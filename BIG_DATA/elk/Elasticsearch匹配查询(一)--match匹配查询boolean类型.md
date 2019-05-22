<p><object style="display: block; position: absolute; top:70px; left:600px;" width="340" height="80" data="http://music.163.com/style/swf/widget.swf?sid=104241&amp;type=2&amp;auto=0&amp;width=320&amp;height=66" type="application/x-shockwave-flash"></object></p>

>match查询接收文本/数值/日期，把query参数中的值拿出来，加以分析，构造出一个查询语句。  
>更多内容请参考:<a href="">
ELK教程</a>

先来看个例子：
```json
{
  "match" : {
    "message" : "This is a text"
  }
}
```

**注意**  
    <1>这里的message是字段名，可以使用任何一个field代替(包括_all)  
    <2>match查询语句有三种查询类型:`boolean`, `phrase`, `phrase_prefix`  
##布尔值匹配查询
`match`默认的查询类型就是`boolean`，这是对提供的查询语句进行分析，分析后构造出一个布尔查询。有几个参数用于控制布尔查询语句。  
（1）`operator`：标记可以被用来设置为`or`或`and`来控制布尔语句(默认为`or`)。如果希望查询中的所有条件都匹配，可以使用`and`运算符。  

（2）`minimum_should_match` :`operator`参数是`or`,构造出`should`布尔查询语句,`should`语句满足条件的最小值。`operator`是`and`时自动忽略。  

（3）`analyzer`: 设置分析器(`analyzer`)，用来分析查询文本，默认使用的是`mapping`中`field`显示指定的的分析器，或者使用默认的分析器。

（4）`fuzziness`:可以通过提供此参数的值来构建模糊查询(fuzzy query)。可以提供相对值和绝对值设置相关性。可以参考<a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#fuzziness">Fuzziness介绍</a>  

（5）`prefix_length`：此参数可以控制模糊查询的行为。指定词条必须匹配的前缀字符长度。  

（6）`max_expansions`：也是控制模糊查询的行为。用于指定查询可被扩展到的最大词条。  

（7）`fuzzy_transpositions`：模糊互换(ab→ba)在默认情况下都是允许的,但可以禁用通过设置`fuzzy_transpositions`为假。  

（8）`zero_terms_query`：如果使用的analyzer移除了一个查询中所有的token（如stop filter所做的那样），它可以被设置成`none`或`and`，默认值是`none`。在分析器移除所有的查询词条时，该参数设置为`none`，将没有文档返回；设置为`all`，将返回所有文档。
```json
{
    "match" : {
        "message" : {
            "query" : "to be or not to be",
            "operator" : "and",
            "zero_terms_query": "all"
        }
    }
}
```

（9）`cutoff_freqency`:该参数允许将查询分解成两组：一组低频词和一组高频词。将在<a href="">常用词查询</a>介绍。  
