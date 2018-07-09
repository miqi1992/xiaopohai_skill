>Elsticsearch中的数据可以分为结构化数据和非结构化的。针对这两种数据可以分别有不同的查询方法。本篇将开始介绍结构化数据搜索方法。更多内容情参考:<a href="">EIK修炼之道</a>

##结构化数据与非结构化数据
- 结构化数据是指包含内部结构的数据。日期，时间，数字都是结构化的:它们都有明确的格式，可以支持相应的一些逻辑操作。例如:可以针对时间字段取范围，针对数字字段排序，或者比大小。  
- 当然，非结构数据就是没有固定内部结构的数据。比如，邮件的内容，一行日志记录。  
- 通常，我们认为文本是非结构数据，但有时候也可以把它们当做结构化数据。  

##结构化数据的过滤查询
针对结构化数据的查询，也可以认为是匹配查询或者过滤查询，都代表一个意思。满足条件的就返回，不计算相关性。  
1. <span style="color:red">Term过滤</p>  
>`term`主要用于精确匹配哪些值，比如数字，日期，布尔值或not_analyzed的字符串
<cite style="color:red">Term既可以用作查询(计算相关性)，也可以用作过滤，关于是否相关性计算参考下面的表格，我们主要在过滤上下文中使用`Term`，以后将默认`Term`在过滤上下文使用。</cite>

**举个例子**
```json
{
    "term":{"user" : "Kimchy"}
}
```

<1>查找在`user`字段中存在词项`Kimchy`的文档

<code>权重设置</code>  
boost:可以在`term`查询中使用这个参数改变相关性得分。
```json
GET /_search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "status": {
              "value": "urgent",
              "boost": 2.0 
            }
          }
        },
        {
          "term": {
            "status": "normal" 
          }
        }
      ]
    }
  }
}
```

<1>`urgent`查询语句的相关性得分将是查询字句的两倍
     

2. <p style="color:red">Terms过滤</p>
terms 跟 term 有点类似，但 terms 允许指定多个匹配条件。 如果某个字段指定了多个值，那么文档需要一起去做匹配：
```json
{
    "terms": {
        "tag": [ "search", "full_text", "nosql" ]
        }
}
```

###term相关性分数
![Term相关性计算](file:///C:\Users\\chenqi\\Desktop\\Elasticsearch\\Elasticsearch图片\\Term相关性计算.png)

从上图可以看出，`Term`查询既可以计算相关性，也可以不计算，主要根据查询字段的类型和`Term`所在的查询上下文，以后将要讲到的`match`查询可以转化为`Term`查询，`match`查询是高级查询，计算相关性，而`Term`查询更主要的是用来过滤结构化数据。  

3. <p style="color:red">range过滤</p>
`range`过滤允许我们按照指定范围查找一批数据:  
```json
{
  "range": {
    "age": {
      "gte": 20,
      "lt": 30
    }
  }
}
```

范围操作符包含:
`gt`:大于
`gte`:大于等于
`lt`:小于
`lte`:小于等于

4. <p style="color:red">exists过滤和missing过滤</p>
exists 和 missing 过滤可以用于查找文档中是否包含指定字段或没有某个字段，类似于
SQL语句中的 IS_NULL 条件
```json
{
  "exists": {
    "field": "title"
  }
}
```

5. <p style="color:red">wildcard过滤</p>

<a href="">Wildcard查询</a>  
<a href="">Regexp查询</a>  
<a href="">Fuzzy查询</a>  