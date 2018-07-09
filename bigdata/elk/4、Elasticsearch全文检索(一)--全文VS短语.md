##前言
<p><object style="display: block; position: absolute; top:10px; left:500px;" width="340" height="80" data="http://music.163.com/style/swf/widget.swf?sid=175206&amp;type=2&amp;auto=0&amp;width=320&amp;height=66" type="application/x-shockwave-flash"></object></p>

>关于倒排索引等内容，将不做介绍，可以看<a href="">《Elasticsearch权威指南》</a>更多内容:<a href="">ELK修炼之道</a>

##短语  **vs** 全文
虽然所有的查询都会进行相关度计算，但不是所有的查询都会有分析阶段。而且像`bool`或`function_score`这样的查询并不在文本字段执行分析。

**1、基于短语(Term-based)的查询:**
像`term`（在filter上下文中）或`fuzzy`一类的查询是低级查询，它们没有分析阶段。这些查询在单一的短语上执行。例如对单词`Foo`的`term`查询会在倒排索引里精确查找`Foo`这个词，并对每个包含这个单词的文档计算TF/IDF相关度`_score`  
`term`查询只在倒排查询里精确低查找特定短语，而不会匹配短语的其它变形，如`Foo`或`FOO`。不管短语怎样被加入索引，都只匹配倒排索引里的准确值。如果你在一个设置了`not_analyzed`的字段为`["Foo", "Bar"]`建索引，或者在一个用`whitespace`解析器解析的字段为`Foo Bar`建索引，都会在倒排索引里加入两个索引`Foo`和`Bar`。

**2、全文(Full-text)检索**
`match`和`query_string`这样的查询是高级查询，他们会对字段进行分析:  

- 如果检索一个`date`或`integer`字段，他们会把查询语句作为日期或者整数格式数据。  
- 如果检索一个精确值(`not_analyzed`)字符串字段，他们会把整个查询语句作为一个短语。
- 如果检索一个全文(`analyzed`)字段，查询会先用适当的解析器解析查询语句，产生需要查询的短语列表。然后对列表中的每个短语执行低级查询，合并查询结果，得到最终的文档相关度。

##全文检索
全文检索最重要的两个方面：  

- 相关度(Relevance)
    根据文档与查询相关程度对结果进行排序的能力。相关度可以使用TF/IDF，地理位置相近程度、模糊相似度或其他算法计算。  
- 分析(Analysis)
    将一段文本转换成一组唯一的、标准化了的标词(term),用以(a)创建倒排索引，(b)查询倒排索引  

>**注意：**
>一旦我们提到相关度和分析，指的都是查询(queries)而非过滤器(filters)

```json
//验证match查询也不一定全部要做分析
PUT my_index3/
{
  "mappings" : {
    "my_type" : {
    "properties" : {
      "message" : {
        "type" : "string",
        "index" : "analyzed"
      }
      "message1" : {
        "type" : "string",
        "index" : "not_analyzed"
      }
    } 
  }
  }
}
//索引一条数据
POST my_index3/my_type
{
  "message" : "boy",
  "message1" : "boy"
}

POST /my_index3/my_type/_search
{
  "query": {
    "filtered": {
      "filter": {
        "match": {
          "message1": "BOY"
        }
      }
    }
  }
}
//response
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 0,
    "max_score": null,
    "hits": []
  }
}

//同样的查询message1就可以查到了
```
>在很少的情况下，你可能才需要使用基于词条的查询(Term-based Queries)。通常你需要查询的是全文，而不是独立的词条，而这个
工作通过高级的全文查询来完成会更加容易(在内部它们最终还是使用的基于词条的低级查询)。

##match查询
先来个例子入门说明match查询的步骤:
```json
{
    "match" : {
        "message" : "BOY"
    }
}
```

Elasticsearch通过执行下面的步骤执行match查询:   
1. 检查field类型  
&#160; &#160; &#160; &#160;`message`字段是一个字符串(`analyzed`),所以该查询字符串也需要被分析(`analysis`)  
2. 分析查询字符串  
&#160; &#160; &#160; &#160;查询词`boy`。因为我们只有一个查询词，因此match查询可以以一种低级别的`term`查询的方式执行。  
3. 找到匹配的文档  
&#160; &#160; &#160; &#160;`term`查询在倒排索引中搜索`boy`,并且返回包含该词的文档。  
4. 为每个文档打分  
&#160; &#160; &#160; &#160;`term`查询综合考虑词频(每篇文档`message`字段包含`boy`的次数)、逆文档频率(在全部文档中`message`字段`boy`的次数)、包含`boy`的字段长度(长度越短越相关)来计算每篇文档的相关性得分`_score`。

##参考
<a href="http://www.ruanyifeng.com/blog/2013/03/tf-idf.html">TF-IDF与余弦相似性的应用：阮一峰</a>

