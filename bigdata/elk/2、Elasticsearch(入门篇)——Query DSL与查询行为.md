##前言
<p><object style="display: block; position: absolute; top:10px; left:500px;" width="340" height="80" data="http://music.163.com/style/swf/widget.swf?sid=175206&amp;type=2&amp;auto=0&amp;width=320&amp;height=66" type="application/x-shockwave-flash"></object></p>
<blockquote>
    ES提供了丰富多彩的查询接口，可以满足各种各样的查询要求。更多内容请参考:<a href="">ELK修炼之道</a>
</blockquote>

###Query DSL结构化查询

- Query DSL是一个Java开源框架用于构建类型安全的SQL查询语句。采用API代替传统的拼接字符串来构造查询语句。目前Querydsl支持的平台包括JPA,JDO，SQL，Java Collections，RDF，Lucene，Hibernate Search。   
- elasticsearch提供了一整套基于JSON的查询DSL语言来定义查询。  
- Query DSL当作是一系列的抽象的查询表达式树(AST)特定查询能够包含其它的查询，(如 bool ), 有些查询能够包含过滤器(如 constant_score), 还有的可以同时包含查询和过滤器 (如 filtered). 都能够从ES支持查询集合里面选择任意一个查询或者是从过滤器集合里面挑选出任意一个过滤器, 这样的话，我们就可以构造出任意复杂（maybe 非常有趣）的查询了，是不是很灵活啊。

**举个例子**
```json
GET _search
{
    "query": {
        "bool": {
            "must": [
                { "match": { "title": "Search" }},
                { "match": { "content": "Elasticsearch" }}
            ],
            "filter": [
                { "term": { "status": "published" }},
                { "range": { "publish_date": { "gte": "2015­01­01" }}}
            ]
        }
    }
}
```

####<p style="color:red">查询的分类 </p> 
**Leaf query Cluase 叶子查询(简单查询)**  
这种查询可以单独使用，针对指定的字段查询指定的值。  

**Compound query clauses 复杂查询**  
复杂查询可以包含叶子或者其它的复杂查询语句，用于组合成复杂的查询语句，比如not, bool等。

**
查询虽然包含这两种，但是查询的行为还与查询的执行环境有关，不同的执行环境，查询操作也不一样。**  
查询的行为取决于他们所在的查询上下文，包括Query查询上下文和Filter查询上下文。  

##查询与过滤

- Query查询上下文  
在Query查询上下文中，查询会回答这个问题--<strong style="color:red">"这个文档匹不匹配查询条件，它的相关性高么？"</strong>  
除了决定文档是够匹配，针对匹配的文档，查询语句还会计算一个<code>_score</code>相关性分值，分数越高，匹配度越高，默认返回是越靠前。这里关于分值的计算不再介绍，以后再做介绍。  

- Filter过滤器上下文
在Filter过滤器上下文中，查询会回答这个问题--<strong style="color:red">"这个文档是否匹配"</strong>  
这个结果要么“不是”要么“是”，不会计算分值问题，也不会关心返回的排序问题,这样性能方面就比Query查询高了。Filter过滤器主要用于过滤结构化数据，例如：  
     - 时间戳范围是否在2015-2016之间？
     - status字段是否被设置成"published"?
另外，常用的过滤器会自动缓存Elasticsearch,加速性能。

举个简单的例子：  

1. title字段包含关键词"search"    
2. content字段包含关键词"elasticsearch"  
3. status字段存在精确词"published"  
4. publish_date字段包含一个日期由2015年1月1日起

```json
GET _search
{
  "query": { 
    "bool": { 
      "must": [
        { "match": { "title":   "Search"        }}, 
        { "match": { "content": "Elasticsearch" }}  
      ],
      "filter": [ 
        { "term":  { "status": "published" }}, 
        { "range": { "publish_date": { "gte": "2015-01-01" }}} 
      ]
    }
  }
}
```

**性能差异**  
使用过滤语句得到的结果集———一个简单的文档列表，快速匹配运算并存入内存是非常方便的，每个文档仅需1个字节。这些缓存的过滤结果集与后续请求的结合使用时非常高效的。  
查询语句不仅要查找相匹配的文档，还需要计算每个文档的相关性，所以一般来说查询语句要比过滤语句更耗时，并且查询结果也不可缓存。  
幸亏有了倒排索引，一个只匹配少量文档的简单查询语句在百万级文档中的查询效率会与一条经过缓存的过滤语句旗鼓相当，甚至略占上风。但是一般情况下，一条经过缓存的过滤查询要远胜一条查询语句的执行效率。

##总结
1. Query查询上下文中，查询操作会根据查询的结果进行相关性分值计算，用于确定相关性。分值越高，返回的结果越靠前。
2. Filter过滤器上下文中，查询不会计算相关性分值，也不会对结果进行排序。
3. 过滤器上下文中，查询的结果可以被缓存。
4. <code style="color:red">以后博客中提到的查询就是在Query查询上下文，过滤就是指filter过滤器上下文。</code>
5. 原则上来说，使用查询语句做全文本搜索或其他需要进行相关性评分的时候，剩下的全部用过滤语句

##参考
<https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html>
