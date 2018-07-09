本节讨论在将应用迁移到 elasticsearch 2.0 时需要注意的一些变化。

在 0.90 版本前创建的索引
Elasticsearch 2.0 只能够读出在 0.90 版及更新的版本所创建的索引。如果你的索引使用 0.90 之前的版本创建，就需要先更新到 1.x 版本，从而更新索引或者删除旧的索引。elasticsearch 将不能够在旧的索引的情形下启动。

Elasticsearch 迁移的插件
我们已经提供了 Elasticsearch migration plugin 来帮助用户检测任何可能碰到的更新到 2.0 版本的问题。请在更新前安装并运行插件。

移除的特性
Rivers 已经被移除
Facets 已经被移除
MVEL 已经被移除
Delete-by-query 现在变成插件
多播发现已经成为插件
Support for multicast is very patchy. Linux doesn’t allow multicast listening on localhost, while OS/X sends multicast broadcasts across all interfaces regardless of the configured bind address. On top of that, some networks have multicast disabled by default.
This feature has been moved to a plugin. The default discovery mechanism now uses unicast, with a default setup which looks for the first 5 ports on localhost. If you still need to use multicast discovery, you can install the plugin with:
./bin/plugin install discovery-multicast
See https://www.elastic.co/guide/en/elasticsearch/plugins/2.0/discovery-multicast.html for more information.
_shutdown API
murmur3 现在已经是插件
_size 已成插件
Thrift 和 memcached 传输
MergeScheduler
网络变动
绑定到 localhost
多播移除
多重 path.data striping
之前，如果 path.data 设置列出了多个数据路径，那么分片会按照多个路径进行分条，通过将一个整个文件按序写到每个路径中（结合 index.store.distributor 设置）。结果就是在一个分片中的一个单个分段的文件可以遍布多个磁盘上，任何一个磁盘出错会导致多个分片的崩溃。

分条不再支持。相反，不同的分片可能会被分配到不同的路径中，但是在一个单个分片上的所有文件将会写入到同样的路径中。

如果分条在 2.0 或者更新的版本中检测出来，属于同一个分片的文件会迁移到同样的路径上。如果没有足够的磁盘空间完成这次迁移，更新就会被取消只能够在有了足够的磁盘空间时重新启用更新过程。

index.store.distributor 设置也已经被移除了。

映射 Mapping 的变动
对于映射进行了一系列的调整来移除歧义并确保冲突的映射不会发生。

一个主要的变动就是动态增加的字段必须让其映射被 master 节点在索引继续前确认。这是为了避免同一个索引中的不同分片对同一个字段增加不同的映射的问题。这些冲突的映射不会给出显式的错误结果，这样会导致索引的崩溃。

这个变动在频繁增加很多新的字段时候让索引速度放慢很多。我们在寻找优化这个过程的方法但是现在做出了安全性高于性能的抉择。

冲突的字段映射
在同一个索引中不同的类型中有同样名字的字段必须有同样的映射，而  copy_to , dynamic , enabled , ignore_above , include_in_all , 和 properties 这些参数可以对每个字段进行不同的设置。

PUT my_index
{
  "mappings": {
    "type_one": {
      "properties": {
        "name": { 
          "type": "string"
        }
      }
    },
    "type_two": {
      "properties": {
        "name": { 
          "type":     "string",
          "analyzer": "english"
        }
      }
    }
  }
}
上面的两个 name 字段的映射是冲突的，所以会在一开始就被 Elasticsearch 阻止。

Elasticsearch 不会在出现冲突的映射时还正常工作。这些索引必须被删除或者使用新的映射进行重新索引。

Put mapping API 中的 ignore_conflicts 选项已被移除。冲突不再被忽视。

字段不能通过短名进行引用
字段不再能够通过其短名进行引用。而是要用到这个字段的全路径。例如：

PUT my_index
{
  "mappings": {
    "my_type": {
      "properties": {
        "title":     { "type": "string" },    ...1
        "name": {
          "properties": {
            "title": { "type": "string" },    ...2
            "first": { "type": "string" },
            "last":  { "type": "string" }
          }
        }
      }
    }
  }
}
1 处的字段使用 title 引用
2 处的字段使用 name.title 引用
之前这两个字段都可以使用 title 引用，所以会在使用短名引用时产生冲突。

类型名前缀 type name prefix 移除
之前在两个不同的类型中有同样名字的字段有时候可以使用添加类型名作为前缀来去除歧义。但带来的一个后果是，这回加上一个过滤器在类型的名称上来获得相关的查询。这个特性会有歧义——一个类型的名会和一个字段名混淆——并不会总是有效，比如聚合。

相反，字段应该使用全路径指定，不包含类型的名字作为前缀。如果你想要使用 _type 字段进行过滤，在 URL 中指定类型或者加入一个显式的过滤器。

下面的查询样例在 1.x 版本：

GET my_index/_search
{
  "query": {
    "match": {
      "my_type.some_field": "quick brown fox"
    }
  }
}
在 2.x 中可以写成：

GET my_index/my_type/_search 
{
  "query": {
    "match": {
      "some_field": "quick brown fox" 
    }
  }
}
1 类型名可以在 URL 中指定作为过滤器使用
2 字段名必须不包含类型前缀
字段名不再含点“.”
在 1.x 中，很可能会在名字中创建带“.”的字段，例如：

PUT my_index
{
  "mappings": {
    "my_type": {
      "properties": {
        "foo.bar": { 
          "type": "string"
        },
        "foo": {
          "properties": {
            "bar": { 
              "type": "string"
            }
          }
        }
      }
    }
  }
}
这两个字段不能够被区分，因为两个都引用为 foo.bar。

现在已经不能够创建包含“.”在名字中了。

类型名不再能以“.”开头了
在 1.x 中，Elasticsearch 会在一个类型名出现“.”时产生警告。现在这种类型不再用来区分在不同类型中的字段了，所以这个警告放宽了：类型名现在可以包含点，但是不能够以点开头。唯一的特例就是特定的 .percolator 类型。

类型名不能够超过 255 个字符
映射类型名不再能够超过 255 个字符。之前超过长度的类型名应该在更新前还可以使用，但是在新的索引中将不再支持。

类型不再能够被删除
在 1.x 中可以删除一个类型映射，以及相应类型的文档，使用 delete mapping API。现在不再支持，因为在这个类型中的字段剩下的信息可能会造成崩溃。

相反，如果你需要删除一个类型的映射，你应该重索引不含有这个映射的新索引中。如果你仅仅删除了属于这个类型的文档，那么可以使用 delete-by-query plugin。

类型元字段 meta-fields
为了让他们更加可靠，元字段和 had 配置选项相关的部分已经移除：

_id configuration can no longer be changed. If you need to sort, use the _uid field instead.
_type configuration can no longer be changed.
_index configuration can no longer be changed.
_routing configuration is limited to marking routing as required.
_field_names configuration is limited to disabling the field.
_size configuration is limited to enabling the field.
_timestamp configuration is limited to enabling the field, setting format and default value.
_boost has been removed.
_analyzer has been removed.
关键的是，元字段不再被指定成为文档 body 的一部分。相反，他们必须在查询参数中指定。例如，在 1.x 中，routing 可以按照下面的方式指定：

PUT my_index
{
  "mappings": {
    "my_type": {
      "_routing": {
        "path": "group"     ...1
      },
      "properties": {
        "group": {          ...2
          "type": "string"
        }
      }
    }
  }
}

PUT my_index/my_type/1      ...3
{
  "group": "foo"
}
1,2 处 1.x 映射告诉 Elasticsearch 来从文档 body 中的 group 字段中抽取 routing 值
这个索引请求使用了 foo 的 routing 值
在 2.0 中，routing 必须显式地指定：

PUT my_index
{
  "mappings": {
    "my_type": {
      "_routing": {
        "required": true             ...1
      },
      "properties": {
        "group": {
          "type": "string"
        }
      }
    }
  }
}

PUT my_index/my_type/1?routing=bar   ...2
{
  "group": "foo"
}
1 处 routing 可以被设置为 True 来确保在索引时候不被忽略
2 处索引请求使用了一个 bar 的 routing 值
_timestamp 和 _ttl 舍弃
_timestamp 和 _ttl 字段已经舍弃，但是会对 2.x 系列还是有用的。

取代 _timestamp 字段的是使用正常的 data 字段并显式地设置该值。

当前 _ttl 功能会在未来新的版本中的实现取代，可能会有不同的寓意，不会依赖 _timestamp 字段。

分析器映射
之前，index_analyzer 和 search_analyzer 可以分开设置，而 analyzer 设置可以设置这两个。index_analyzer 设置已经丢弃了，所以现在只可以使用 analyzer 设置。

如果仅仅设置了 analyzer，这会在索引和搜索时都用上。在搜索时使用不同的分析器，也可以通过 analyzer 和 search_analyzer 进行设置。

index_analyzer, search_analyzer 和 analyzer 类型层的设置已经被舍弃了，因为不再能够基于类型名字来选择字段。

_analyzer 元字段，允许对每篇文档进行分析器设置也被移除了。

日期字段和 Unix timestamps
之前，date 字段首先尝试按照 Unix timestamp 进行解析——milliseconds-since-the-epoch——在尝试使用预定义的日期 format。这意味着如 yyyyMMdd 的格式不再可行，因为值会被解释为 timestamp。

在 2.0 中，我们增加了两个格式：epoch_millis 和 epoch_second。仅仅这种类型的日期字段能够被解析为 timestamp。

这些格式不能够够使用动态模板，因为他们对长的值来说是无法区分的。

默认日期格式
默认日期格式已经从 data_optional_time 变成了 strict_date_optional_time，需要的是 4 位的年份，2 位的月和日，（以及可选的，2 位的时、分和秒）。

动态增加的日期字段默认地包含 epoch_millis 格式来支持 timestamp 解析。例如：

PUT my_index/my_type/1
{
  "date_one": "2015-01-01" 
}
Has format : "strict_date_optional_time||epoch_millis".
mapping.date.round_ceil 设置
The mapping.date.round_ceil setting for date math parsing has been removed.

Boolean 字段
Boolean 字段过去使用一个字符串的字段数据 F 表示 false 而 T 表示 true。他们已经被重构成数值的字段数据，0 表示 false 而 1 表示 true。所以，下面的 API 给出的响应的格式会发生相应的改变当应用在 boolean 字段上时：返回 0/1 而不是 F/T：

fielddata fields
sort values
terms aggregations
另外，项的聚合为 boolean （如日期和 IP 地址）使用了自定义的格式，这同样也是以数字作为支持的，以返回用户友好的 boolean 字段的表示 false/true：

"buckets": [
  {
     "key": 0,
     "key_as_string": "false",
     "doc_count": 42
  },
  {
     "key": 1,
     "key_as_string": "true",
     "doc_count": 12
  }
]
index_name 和 path 移除
index_name 设置用来改变 Lucene 字段的名字，而 path 设置用在 object 字段上来确定 Lucene 字段是否应该使用全路径（包含父对象字段），或者仅仅就是最终的 name。

这些设置已经移除了，因为这些功能已经可以通过 copy_to 参数实现。

配置文件中的映射不再支持
在配置文件中指定映射已经被移除。为指定应用在多个索引上的默认映射，使用 index templates。

所以跟随这个变动，下面的设置已经被移除了：

index.mapper.default_mapping_location
index.mapper.default_percolator_mapping_location
字段数据格式
现在文档值是字段数据的默认设置，指定 in-memory 格式已经成为过度复杂的选项。这些字段数据已经被移除了：

字符串字段的fst
geo 点的 compressed
会使用默认的字段数据。

Posting 和 doc-value codecs
压缩和压缩阈值
compress 和 compress_threshold 选项已经从 _source 字段和类型为 binary的字段中移除。这些字段默认被压缩。如果你想要提高压缩的层次，使用新的 index.codec: best_compression 设置。

Position_offset_gap
The position_offset_gap option is renamed to position_increment_gap. This was done to clear away the confusion. Elasticsearch’s position_increment_gap now is mapped directly to Lucene’sposition_increment_gap
The default position_increment_gap is now 100. Indexes created in Elasticsearch 2.0.0 will default to using 100 and indexes created before that will continue to use the old default of 0. This was done to prevent phrase queries from matching across different values of the same term unexpectedly. Specifically, 100 was chosen to cause phrase queries with slops up to 99 to match only within a single value of a field.

查询 DSL 的变动
查询和过滤器合并了
查询和过滤现在已经合并了——所有的过滤语句现在都是查询语句。另外，查询语句现在可以用在查询上下文或者过滤上下文中了。

查询上下文：用在查询上下文中的查询会计算相关分数并不支持 cache。查询上下文在不使用过滤上下文的情况下采用。
过滤上下文：用在过滤上下文中的查询不会计算相关分数，但支持 cache。过滤上下文常常由下面的语句引入：
constant_score 查询
在 bool 查询中的must_not 和新增的 filter 参数
在 function_score 查询中的 filter 和 filters 参数
任何叫 filter 的 API，例如 post_filter 搜索参数，或者在聚合中或者索引别名中
所以根据这些变动，terms 过滤器 的execution 选项已经被舍弃或者忽视。

or 和 and 现在通过 bool 来实现
or 和 and 过滤器之前的执行模式和 bool 过滤器很不同。通常针对某些过滤语句使用 and/or 是非常重要的，其他的语句则使用 bool。

这种不同已经移除了：bool 查询现在足够精妙来处理这两种情形了。所以，or 和 and 过滤器实际上就是语法糖，其实内部执行就是 bool 查询。这些过滤器未来都可能被去掉。

filtered 查询和 query 过滤器被取消
query 过滤器已经不再需要了——所有的查询都可以用在查询或者过滤上下文中。

filtered 查询由于 bool查询被取消。下面的查询：

GET _search
{
  "query": {
    "filtered": {
      "query": {
        "match": {
          "text": "quick brown fox"
        }
      },
      "filter": {
        "term": {
          "status": "published"
        }
      }
    }
  }
}
将查询和过滤移到 bool 查询的 must 和 filter 参数中：

GET _search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "text": "quick brown fox"
        }
      },
      "filter": {
        "term": {
          "status": "published"
        }
      }
    }
  }
}
Filter auto-caching
这个用来控制那些使用 _cache 过滤器的缓存，并提供一个定制的 _cache_key。这些选项已经被丢弃，就算设置了现已无效。

用在过滤器上下文中的查询语句现在是自动根据需要来 cache 的。算法考虑了使用的频率、查询执行的代价和构建缓冲区的代价。

terms 过滤器检索（lookup）机制不再对包含项的文档的值进行 cache。这取决于文件系统的 cache。如果检索（lookup）索引不是太大，推荐将其复制到所有的节点上，使用设置 index.auto_expand_relicas: 0-all 来减轻网络的通信压力。

使用 IDF 计分的数值查询
前面，在数值字段上的项查询已经通过使用常用的 Lucene 计算逻辑规避了，这个行为并没有被记录下来也有点出乎意料。

在数值字段上的单一的 term 查询和字符串字段一样使用 IDF 和 norms（如果打开了选项）。

而使用不计算分值的方式来查询数值字段，查询语句应该被用在过滤器上下文中，也就是说在 bool 查询的 filter 参数，或者包裹在 constant_score 查询中：

GET _search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": { 
            "numeric_tag": 5
          }
        }
      ],
      "filter": [
        {
          "match": { 
            "count": 5
          }
        }
      ]
    }
  }
}
Fuzziness 和 fuzzy-like-this
模糊匹配用来计算每个模糊候选项的分值

Parent/Child 变动
Parent type 不能 pre-exist
top_children 查询丢弃
设置变动 setting changes

文／Not_GOD（简书作者）
原文链接：http://www.jianshu.com/p/aaf4685f1a34
著作权归作者所有，转载请联系作者获得授权，并标注“简书作者”。