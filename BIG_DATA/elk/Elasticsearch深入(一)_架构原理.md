<p><object style="display: block; position: absolute; top:10px; left:500px;" width="340" height="80" data="http://music.163.com/style/swf/widget.swf?sid=175206&amp;type=2&amp;auto=0&amp;width=320&amp;height=66" type="application/x-shockwave-flash"></object></p>
<blockquote>
    本章主要介绍Elasticsearch的结构原理，熟悉了这个，针对es的管理、优化就会融会贯通了，更多内容请参考:()[ELK修炼之道]
</blockquote>

### 架构原理

本篇博客主要介绍ES的工作原理，以及相关的可控项。主要内容包括：准实时索引的实现、segment merge的影响、routing和replica的读写过程、shard的allocate控制、自动发现的配置。  

### 带着问题学习
1. 写入的数据是如何变成elasticsearch里可以被检索和聚合的索引内容的？  
2. lucene如何实现准实时索引？  
3. 什么是segment?  
4. 什么是commit?  
5. segment的数据来自哪里？  
6. segment在写入磁盘前就可以被检索，是因为利用了什么？  
7. elasticsearch中的refersh操作是什么？配置项是哪个？设置的命令是什么？  
8. refersh只是写到了文件系统缓存，那么实际写入磁盘是由什么控制呢？如果这期间发生错误和故障，数据会不会丢失？  
9. 什么是translog日志？什么时候会被清空？什么是flush操作？配置项是什么？怎么配置？  
10. 什么是段合并？为什么要段合并？段合并线程配置项？段合并策略？怎么forcemerge(optimize)?  
11. routing的规则是什么样的？replica读写过程？wait_for_active_shards参数timeout参数？  
12. reroute接口？  
13. 两种自动发现方式？  

### 准实时索引的实现
首先

