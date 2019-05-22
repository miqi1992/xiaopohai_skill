包装另一个查询的查询只返回一个常数分数等于每个文档的查询增加过滤器。映射到Lucene ConstantScoreQuery

```json
{
    "constant_score" : {
        "filter" : {
            "term" : { "user" : "kimchy"}
        },
        "boost" : 1.2
    }
}
```

 [Elasticsearch] 控制相关度 (四) - 忽略TF/IDF:<http://blog.csdn.net/dm_vincent/article/details/42157577>