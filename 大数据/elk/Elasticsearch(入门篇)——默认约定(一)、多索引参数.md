 >Elasticsearch对外提供的API是以Http协议的方式，通过JSON格式以REST约定对外提供。

##HTTP的配置

HTTP配置文件是放在elasticsearch.yml中，注意的是所有与HTTP配置相关的内容都是静态配置，也就是需要重启后才生效。HTTP对外接口模块是可以禁用的，只需要设置http.enabled 为false。Elasticsearch集群中的通信是通过内部接口实现的，而不是HTTP协议。在集群中不需要所有节点都开启HTTP协议，正常情况下，只需要在一个节点上开启HTTP协议。

###多索引参数

大多数API支持多索引查询，就是同时可以查询多个索引中的数据，例如，参数`test1`,`test2`,`test3`，表示同时搜索test1,test2,test3三个索引中中的数据，或者用(`_all`全部索引，`_all`是内部定义的关键字)。在参数中同时支持通配符的操作，例如test*,表示查询所有以test开头的索引。同时也支持排除操作，例如+test*,-test3表示查询所有test开头的索引，排除test3。同时多索引查询还支持以下参数：

首先，插入几条数据:

```shell
$ curl -XPOST localhost:9200/test1/test/1 -d '{"name":"test1"}'
$ curl -XPOST localhost:9200/test1/test/2 -d '{"name":"test1"}'
$ curl -XPOST localhost:9200/test2/test/1 -d '{"name":"test1"}'
```
- ignore_unavailable：当索引不存在或者关闭的时候，是否忽略这些索引，值为true和false。

**索引不存在，true**
```shell
POST /test1/_search?ignore_unavailable=true

{
  "took": 0,
  "timed_out": false,
  "_shards": {
    "total": 0,
    "successful": 0,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 0,
    "max_score": 0,
    "hits": []
  }
}
```

**索引不存在，false**
```shell
POST /test1/_search?ignore_unavailable=false

{
  "error": {
    "root_cause": [
      {
        "type": "index_not_found_exception",
        "reason": "no such index",
        "resource.type": "index_or_alias",
        "resource.id": "test1",
        "index_uuid": "_na_",
        "index": "test1"
      }
    ],
    "type": "index_not_found_exception",
    "reason": "no such index",
    "resource.type": "index_or_alias",
    "resource.id": "test1",
    "index_uuid": "_na_",
    "index": "test1"
  },
  "status": 404
}
```

- allow_no_indices：当使用通配符查询所有索引的时候，当有索引不存在的时候是否返回查询失败。值为true和false

**没有匹配到索引，false**
```shell
POST /test*/_search?allow_no_indices=false

{
  "error": {
    "root_cause": [
      {
        "type": "index_not_found_exception",
        "reason": "no such index",
        "resource.type": "index_or_alias",
        "resource.id": "test*",
        "index_uuid": "_na_",
        "index": "test*"
      }
    ],
    "type": "index_not_found_exception",
    "reason": "no such index",
    "resource.type": "index_or_alias",
    "resource.id": "test*",
    "index_uuid": "_na_",
    "index": "test*"
  },
  "status": 404
}
```

**没有匹配到索引，true**
```shell
POST /test*/_search?allow_no_indices=true

{
  "took": 0,
  "timed_out": false,
  "_shards": {
    "total": 0,
    "successful": 0,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 0,
    "max_score": 0,
    "hits": []
  }
}
```

- expand_wildcards ：控制什么类似的索引被支持，值为open，close，none，all，open表示只支持open类型的索引，close表示只支持关闭状态的索引，none表示不可用，all表示同时支持open和close索引。

<cite style="color:red">备注：文档操作API和索引别名API不支持多索引参数。</cite>

日期筛选

  日期筛选可以让搜索限定在指定的日期内，而不是搜索全部内容，通过时间限定，可以从集群中减少搜索的内容，提高搜索效率和减少资源占用。例如只搜索最近两天的错误日志。

备注：几乎所有的API都支持日期筛选。

  日期筛选的语法为：

```java
<static_name{date_math_expr{date_format|time_zone}}>
语法解释：

static_name ：索引的名称；

date_math_expr：动态日期计算表达式；

date_format ：日期格式；

time_zone：时区，默认为UTC。
```

例如：

```json
curl -XGET 'localhost:9200/<logstash-{now%2Fd-2d}>/_search' 
{
  "query" : {
    ...
  }
}
```
备注：由于url编码的问题/被替换成了%2F。

假设当前时间为2013.7.17日中午，下面列举几个例子：
```json
<secilog-{now/d}>:secilog-20130.7.17

<secilog-{now/M}>secilog-2013.07.01

<secilog-{now/M{YYYY.MM}}>secilog-2013.07

<secilog-{now/M-1M{YYYY.MM}}>secilog-2013.06

<secilog-{now/d{YYYY.MM.dd|+12:00}}secilog-2013.7.18

```
备注：如果索引名称有{}，可以通过添加\来代替，如：

<elastic\\{ON\\}-{now/M}>被转换为 elastic{ON}-2013.07.01

时间搜索也可以通过逗号，来选择多个时间，例如，选择最近三天的数据：

```json
curl -XGET 'localhost:9200/<secilog-{now%2Fd-2d}>,<secilog-{now%2Fd-1d}>,<secilog-{now%2Fd}>/_search' {
  "query" : {
    ...
  }
}
```

通用参数

  pretty参数，当你在任何请求中添加了参数?pretty=true时，请求的返回值是经过格式化后的JSON数据，这样阅读起来更加的方便。系统还提供了另一只格式的格式化，?format=yaml，YAML格式，这将导致返回的结果具有可读的YAML格式。 

 human参数，对于统计数据，系统支持计算机数据，同时也支持比较日和人类阅读的数据，比如：计算机数据"exists_time_in_millis": 3600000 or "size_in_bytes": 1024，更适合人类阅读的数据："exists_time": "1h" or "size": "1kb"。当?human=false 的时候，只输出计算机数据，当?human=ture的时候输出更适合人类阅读的数据，但这会消耗更多的资源，默认是false。

  日期表达式，大多数参数接受格式化日期表达式?，?如范围查询范围查询gt（大于）和lt（小于），或在日期聚合中用from to来表达时间范围。表达式设定的日期为now或者日期字符串加||。

? +1h - 增加一小时 

? -1d - 减少一个小时 

?/d - 上一个小时

所支持的时间单位为：y（年）、M（月）、w（周）、d（日）、h（小时）、m（分钟）、s（秒）。

例如：

now+1h ：当前时间加一小时，以毫秒为单位。

now+1h+1m ：当前时间加一小时和一分钟，以毫秒为单位。

now+1h/d ：当前时间加一小时，四舍五入到最近的一天。

2015-01-01||+1M/d ：2015-01-01加一个月，向下舍入到最接近的一天。

  响应过滤(filter_path)。所有的返回值可以通过filter_path来减少返回值的内容，多个值可以用逗号分开。例如：
```json
curl -XGET 'localhost:9200/_search?pretty&filter_path=took,hits.hits._id,hits.hits._score'{
  "took" : 3,
  "hits" : {
    "hits" : [
      {
        "_id" : "3640",
        "_score" : 1.0
      },
      {
        "_id" : "3642",
        "_score" : 1.0
      }
    ]
  }
}
//它也支持通配符*匹配任何部分字段的名称，例如： 

curl -XGET 'localhost:9200/_nodes/stats?filter_path=nodes.*.ho*'{
  "nodes" : {
    "lvJHed8uQQu4brS-SXKsNA" : {
      "host" : "portable"
    }
  }
}
//我们可以用两个通配符**来匹配不确定名称的字段，例如我们可以返回Lucene版本的段信息：


curl 'localhost:9200/_segments?pretty&filter_path=indices.**.version'{
  "indices" : {
    "movies" : {
      "shards" : {
        "0" : [ {
          "segments" : {
            "_0" : {
              "version" : "5.2.0"
            }
          }
        } ],
        "2" : [ {
          "segments" : {
            "_0" : {
              "version" : "5.2.0"
            }
          }
        } ]
      }
    },
    "books" : {
      "shards" : {
        "0" : [ {
          "segments" : {
            "_0" : {
              "version" : "5.2.0"
            }
          }
        } ]
      }
    }
  }
}
//注意，有时直接返回Elasticsearch的某个字段的原始值，如_source字段。如果你想过滤_source字段，可以结合_source字段和filter_path参数，例如：

curl -XGET 'localhost:9200/_search?pretty&filter_path=hits.hits._source&_source=title'{
  "hits" : {
    "hits" : [ {
      "_source":{"title":"Book #2"}
    }, {
      "_source":{"title":"Book #1"}
    }, {
      "_source":{"title":"Book #3"}
    } ]
  }
}
//紧凑参数flat_settings，flat_settings为true时候返回的内容更加的紧凑，false是返回的值更加的容易阅读。例如为true的时候：

{
  "persistent" : { },
  "transient" : {
    "discovery.zen.minimum_master_nodes" : "1"
  }
}
//为false的时候，默认的情况下为false：

{
  "persistent" : { },
  "transient" : {
    "discovery" : {
      "zen" : {
        "minimum_master_nodes" : "1"
      }
    }
  }
}
```
基于URL的访问控制

  当多用户通过URL访问Elasticsearch索引的时候，为了防止用户误删除等操作，可以通过基于URL的访问控制来限制用户对某个具体索引的访问。可以在配置文件中添加参数：rest.action.multi.allow_explicit_index: false。这个参数默认为true。当为false的时候。在请求参数中指定具体索引的请求将会被拒绝。