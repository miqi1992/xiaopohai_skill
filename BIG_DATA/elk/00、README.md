<blockquote>
看了ELK大半年了，现在就慢慢的总结一下对ELK的理解   
</blockquote>
<p><object style="display: block; position: absolute; top:50px; left:500px;" width="340" height="80" data="http://music.163.com/style/swf/widget.swf?sid=175206&amp;type=2&amp;auto=0&amp;width=320&amp;height=66" type="application/x-shockwave-flash"></object></p>

##参考资料
[ELK stack中文指南](http://kibana.logstash.es)  
[Elasticsearch权威指南](http://es.xiaoleilu.com/010_Intro/00_README.html)  
[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)  

###Elasticsearch基础篇
<cite>此篇用于介绍Elasticsearch的安装与简单的操作</cite>  
<a href="">ELK修炼之道(入门篇)——入门介绍</a>
#####<a href="">Query DSL查询介绍</a>

- **Term level queries精确检索**
- **Full text queries全文检索**
高级全文查询通常用于查询全文文本字段，比如电子邮件的内容。在执行之前会根据每个字段的**analyzer**或者**search_analyzer**分析查询字串。


- **Compound queries混合查询**

- **Joining queries连接查询**

- **Geo queries坐标查询**

- **Specialized queries**

- **Span queries跨度查询**

###Elasticsearch进阶篇
此篇用于介绍查询与几何


###Elasticsearch高级篇
此篇用于原理介绍和一些原理解析  

- **集群管理**

![Elasticsearch](file:///C:\Users\\chenqi\\Desktop\\Elasticsearch\\Elasticsearch图片\\Elasticsearch.png)