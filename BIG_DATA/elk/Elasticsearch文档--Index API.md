##前言
<p><object style="display: block; position: absolute; top:160px; left:500px;" width="340" height="80" data="http://music.163.com/style/swf/widget.swf?sid=175206&amp;type=2&amp;auto=0&amp;width=320&amp;height=66" type="application/x-shockwave-flash"></object></p>

<blockquote><p>Elasticsearch可以支持全文检索，那么ES是以什么机制来支持的，这里索引就是一个重要的步骤，经过索引之后的文档才可以被分析存储、建立倒排索引。<cite style="color:red">本篇就是以ES的数据索引操作来讨论的。</cite></p>
<p>更多内容情参考：<a = href="">ELK教程</a></p> 
</blockquote>

##索引操作
ES索引可以根据指定的index和type进行增加或者更新文档，ID可以指定也可以不指定（index API为我们自动生成）  

```
curl -XPUT 'http://localhost:9200/twitter/tweet/1' -d '{
    "user" : "kimchy",
    "post_date" : "2009-11-15T14:12:12",
    "message" : "trying out Elasticsearch"
}'
```
这里指定了索引twitter、类型tweet、Id为1  
索引操作的结果如下：
``` 
{
    "_shards" : {
        "total" : 10,
        "failed" : 0,
        "successful" : 10
    },
    "_index" : "twitter",
    "_type" : "tweet",
    "_id" : "1",
    "_version" : 1,
    "created" : true
}
```
上面_shards中描述了分片相关的信息，即当前一共有10个分片（5个主分片，5个副本）;
以及index、type、id、version相关信息  

- total:表示现在在使用的分片数量（主分片和副本）
- successful:操作成功的分片数量
- failed:操作失败的分片数量

##自动创建索引
如果上面索引操作之前，ES中还没有这个索引，那么默认会创建这个索引，并且type类型也会自动创建，也就是说，<span style="color:red">ES并不需要像传统数据库那样预先定义表的结构。</span>
每个索引都有一个mapping映射，这个映射也是<span style="color:red">动态生成</span>的,因此当添加新的字段时，会自动的添加mapping映射。
通过在所有节点的配置文件中设置<code>action_create_index</code>为<code>false</code>,可以<span style="color:red">关闭自动索引创建</span>这个功能，默认是打开的  
通过在所有节点的配置文件中设置<code>index.mapper.dynamic</code>为<code>false</code>,可以关闭自动映射创建功能。
通过在所有节点的配置文间中设置<code>action.auto_create_index</code>为<code>+aaa*,-bbb*,+ccc*,-*</code>有选择性的创建某些索引。  
关闭自动mapping映射功能时，就会引发第一次索引的数据失败，这里我们就要自己手动的put一个映射<a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html">Elasticsearch-Mapping映射</a>  
##版本控制
Elasticsearch采用乐观并发控制，当程序并发性比较高的时候，就会产生脏读，所以ES就使用版本号用来避免文档冲突，这里不做过多介绍，分成专门的一篇来介绍ES的版本控制问题<a href="#">Elasticsearch-版本控制</a>  

##操作类型
ES通过设置一个参数op_type控制索引操作"缺少即加入"，当设置<code>op_type
</code>为<code>create</code>时，如果索引时指定的id已经存在，那么索引操作就会失败  
上面的op_type=create与直接使用_create API,效果一样：
```
curl -XPUT 'http://localhost:9200/twitter/tweet/1?op_type=create' -d '{
    "user" : "kimchy",
    "post_date" : "2009-11-15T14:12:12",
    "message" : "trying out Elasticsearch"
}'
```
等价于：
```
curl -XPUT 'http://localhost:9200/twitter/tweet/1/_create' -d '{
    "user" : "kimchy",
    "post_date" : "2009-11-15T14:12:12",
    "message" : "trying out Elasticsearch"
}'
```
如果使用自动id生成就不存在这个问题了。  
##自动ID创建：
前面提到创建索引时可以指定ID，也可以不指定ID，如果不指定ID，那么ES会自动的生成一个ID，并且把<code>op_type</code>更改为<code>create</code>。  
这里需要指出的就是此时HTTP方法将不再是<code style="color:red">put</code>,更改为<code style="color:red">POST</code>

```
 curl -XPOST 'http://localhost:9200/twitter/tweet/' -d '{
    "user" : "kimchy",
    "post_date" : "2009-11-15T14:12:12",
    "message" : "trying out Elasticsearch"
}'
```
返回的结果如下：
```
{
    "_index" : "twitter",
    "_type" : "tweet",
    "_id" : "6a8ca01c-7896-48e9-81cc-9f70661fcb32",
    "_version" : 1,
    "created" : true
}
```

##路由routing
所有的文档API（get、index、delete、bulk、update、mget）都接收一个routing参数，它用来自定义文档到分片的映射。自定义路由值可以确保所有相关文档都被保存在同一分片上。

<pre>shard = hash(routing) % number_of_primary_shards</pre>
<code style="color:red">设置了路由值，就相当于告诉ES文档操作针对的具体分片。</code>  
一般情况下ID都是随机生成的，这样可以保证默认情况下分片的数据负载是相同的，如果我们需要在特定的分片上保持特定的内容，就需要用到这个属性。

##Parent & Children父子查询
这个属性在父子连接中用到，类似于传统关系中的一对多关系，具体的介绍在<code style="color:red">连接查询</code>和<code style="color:red">mapping模块</code>中介绍
```
curl -XPUT localhost:9200/blogs/blog_tag/1122?parent=1111 -d '{
    "tag" : "something"
}'
```
当索引一个child文档时，这个routing属性值被自动的设置成指定的parent文档相同的routing,除非指定routing值（即使parent指定routing,child文档还是parent文档的ID）

##_timestamp设置时间戳  
<span style="color:red">这个字段将被date字段替代，且在使用的时候(包括自定义timestamp)，必须mapping设置为enable</span></br>
```
{
  "mappings": {
    "my_type": {
      "_timestamp": {
        "enabled": true
      }
    }
  }
}
```

时间戳字段可以在索引的时候指定：
```
curl -XPUT localhost:9200/twitter/tweet/1?timestamp=2009-11-15T14%3A12%3A12 -d '{
    "user" : "kimchy",
    "message" : "trying out Elasticsearch"
}'
```
如果没有指定<code>timestamp</code>，_source中也不存在时间戳，就会指定为索引指定时间。
```
#测试timestamp
PUT /my_index
{
  "mappings": {
    "my_type": {
      "_timestamp": {
        "enabled": true
      }
    }
  }
}


GET my_index/_mapping
#回应如下
{
  "my_index": {
    "mappings": {
      "my_type": {
        "_timestamp": {
          "enabled": true
        }
      }
    }
  }
}

#索引数据
PUT /my_index/my_type/1?pretty
{
  "meas" : "timestamp测试"
}


GET /my_index/my_type/1
#回应如下
{
  "_index": "my_index",
  "_type": "my_type",
  "_id": "1",
  "_version": 2,
  "_timestamp": 1464418352065,
  "found": true,
  "_source": {
    "meas": "timestamp测试"
  }
}


#自定义timestamp
PUT /my_index3/my_type/1?timestamp=2019-12-12T14%3A12%3A23
{
  "message" : "自定义timestamp测试"
}


GET my_index3/my_type/1
#回应如下
{
  "_index": "my_index3",
  "_type": "my_type",
  "_id": "1",
  "_version": 3,
  "_timestamp": 1576159943000,
  "found": true,
  "_source": {
    "message": "自定义timestamp测试"
  }
}
```

##ttl文档过期
ES中也可以设置文档自动过期，过期是设置一个正的时间间隔，然后以_timestamp为基准，一旦_ttl到0的时候，文档就会被自动删除。  
<p style="color:red">如果想_ttl生效，必须mapping设置_timestamp和_ttl为enable</p>
```
PUT my_index5
{
  "mappings": {
    "my_type" : {
      "_ttl": {
        "enabled": true
      },
      "_timestamp": {
        "enabled": true
      }
    }
  }
}
```
这时就可以使用_ttl删除文档了
```
PUT /my_index5/my_type/1?ttl=2m
{
  "user" : "kimchy",
  "post_date" : "2016-05-21T17:23:00",
  "messae" : "trying out Elasticsearch"
}

GET /my_index5/my_type/1
#回应如下
{
  "_index": "my_index5",
  "_type": "my_type",
  "_id": "1",
  "_version": 1,
  "_ttl": 78225,
  "_timestamp": 1464420120972,
  "found": true,
  "_source": {
    "user": "kimchy",
    "post_date": "2016-05-21T17:23:00",
    "messae": "trying out Elasticsearch"
  }
}
```

##refersh手动刷新
由于ES并不是一个实时索引搜索的框架，因此数据在索引操作后，需要等1秒钟才能搜索到。这里的搜索是指进行检索操作。如果你使用的是get这种API，就是真正的实时操作了。他们之间的不同是，检索可能还需要进行分析和计算分值相关性排序等操作。
为了在数据索引操作后，马上就能搜索到，也可以手动执行refresh操作。只要在API后面添加<code>refresh=true</code>即可。
这种操作仅推荐在特殊情况下使用，如果在大量所以操作中，每个操作都执行refresh，那是很耗费性能的。  
这一步是把缓冲区的请求数据刷到文件系统缓存上。

##Timeout超时
分片并不是随时可用的，当分片进行备份等操作时，是不能进行索引操作的。因此需要等待分片可用后，再进行操作。这时，就会出现一定的等待时间，如果超过等地时间则返回并抛出错误，这个等待时间可以通过timeout设置：
```
PUT /my_index/my_type/1?timeout=5m
{
   "user" : "kimchy",
    "post_date" : "2009-11-15T14:12:12",
    "message" : "trying out Elasticsearch"
}
```
<style type="text/css">
  table{
    text-align: center;
  }
</style>
<table>
  <tr>
    <th>参数</th>
    <th>可选值</th>
    <th>备注</th>
  </tr>
  <tr>
    <td>op_type</td>
    <td>create</td>
    <td>索引不存在就创建，存在报错</td>
  </tr>
  <tr>
    <td>version</td>
    <td>自定义值</td>
    <td>用于指定版本号</td>
  </tr>
  <tr>
    <td>version_type</td>
    <td>internal</br>external</td>
    <td>定义外部版本</td>
  </tr>
  <tr>
    <td>routing</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>parent</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>timestamp</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>ttl</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>consistency</td>
    <td>one</br>quorum</br>all</td>
    <td></td>
  </tr>
  <tr>
    <td>refresh</td>
    <td>--</td>
    <td></td>
  </tr>
  <tr>
    <td>timeout</td>
    <td></td>
    <td></td>
  </tr>
</table>
<p style="color:red">针对index api暂时就先介绍到这，还有许多细节以后再慢慢补充。</p>
##参考文档  
【1】<a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-index_.html">官方Index API文档</a>  
【2】<a href="http://es.xiaoleilu.com/030_Data/10_Index.html">权威指南  索引</a>