<p
<blockquote>
	config目录下有2个配置文件：
	es的配置文件:<code>elasticsearch.yml</code>
	日志配置文件:<code>logging.yml</code>
</blockquote>

<cite style="color:red">cluster.name: elasticsearch</cite></br>
配置es的集群名称，默认是elasticsearch，es会自动发现在同一网段下的es，如果在同一网段下有多个集群，就可以用这个属性来区分不同的集群</br>
<cite style="color:red">node.name: "Franz Kafka"</cite></br>
节点名，默认随机指定一个name列表中名字，该列表在es的jar包中config文件夹里name.txt文件中，其中有很多作者添加的有趣名字。</br>
<cite style="color:red">node.master: true</cite></br>
指定该节点是否有资格被选举成为node，默认是true，es是默认集群中的第一台机器为master，如果这台机挂了就会重新选举master。 </br> 
<cite style="color:red">node.data: true</cite></br>
指定该节点是否存储索引数据，默认为true。  </br>
<cite style="color:red">index.number_of_shards: 5</cite></br>
设置默认索引分片个数，默认为5片。</br>
<cite style="color:red">index.number_of_replicas: 1</cite></br>
设置默认索引副本个数，默认为1个副本。</br>
<cite style="color:red">path.conf: /path/to/conf</cite></br>
设置配置文件的存储路径，默认是es根目录下的config文件夹。</br>
<cite style="color:red">path.data: /path/to/data</cite></br>
设置索引数据的存储路径，默认是es根目录下的data文件夹，可以设置多个存储路径，用逗号隔开，例：</br>
<code>path.data: /path/to/data1,/path/to/data2</code>  
<cite style="color:red">path.work: /path/to/work</cite></br>
设置临时文件的存储路径，默认是es根目录下的work文件夹。</br>
<cite style="color:red">path.logs: /path/to/logs</cite></br>
设置日志文件的存储路径，默认是es根目录下的logs文件夹</br>
<cite style="color:red">path.plugins: /path/to/plugins</cite></br>
设置插件的存放路径，默认是es根目录下的plugins文件夹</br>
<cite style="color:red">bootstrap.mlockall: true</cite></br>
设置为true来锁住内存。因为当jvm开始swapping时es的效率会降低，所以要保证它不swap，可以把ES_MIN_MEM和ES_MAX_MEM两个环境变量设置成同一个值，并且保证机器有足够的内存分配给es。同时也要允许elasticsearch的进程可以锁住内存，linux下可以通过`ulimit -l unlimited`命令。</br>
<cite style="color:red">network.bind_host: 192.168.0.1</cite></br>
设置绑定的ip地址，可以是ipv4或ipv6的，默认为0.0.0.0。</br>
<cite style="color:red">network.publish_host: 192.168.0.1</cite></br>
设置其它节点和该节点交互的ip地址，如果不设置它会自动判断，值必须是个真实的ip地址。</br>
<cite style="color:red">network.host: 192.168.0.1</cite></br>
这个参数是用来同时设置bind_host和publish_host上面两个参数。</br>
<cite style="color:red">transport.tcp.port: 9300</cite></br>
设置节点间交互的tcp端口，默认是9300。</br>
<cite style="color:red">transport.tcp.compress: true</cite></br>
设置是否压缩tcp传输时的数据，默认为false，不压缩。</br>
<cite style="color:red">http.port: 9200</cite></br>
设置对外服务的http端口，默认为9200。</br>
<cite style="color:red">http.max_content_length: 100mb</cite></br>
设置内容的最大容量，默认100mb</br>
<cite style="color:red">http.enabled: false</cite></br>
是否使用http协议对外提供服务，默认为true，开启。</br>
<cite style="color:red">gateway.type: local</cite></br>
gateway的类型，默认为local即为本地文件系统，可以设置为本地文件系统，分布式文件系统，hadoop的HDFS，和amazon的s3服务器，其它文件系统的设置方法下次再详细说。</br>
<cite style="color:red">gateway.recover_after_nodes: 1</cite></br>
设置集群中N个节点启动时进行数据恢复，默认为1。</br>
<cite style="color:red">gateway.recover_after_time: 5m</cite></br>
设置初始化数据恢复进程的超时时间，默认是5分钟。
<cite style="color:red">gateway.expected_nodes: 2</cite></br>
设置这个集群中节点的数量，默认为2，一旦这N个节点启动，就会立即进行数据恢复。</br>
<cite style="color:red">cluster.routing.allocation.node_initial_primaries_recoveries: 4</cite></br>
初始化数据恢复时，并发恢复线程的个数，默认为4。</br>
<cite style="color:red">cluster.routing.allocation.node_concurrent_recoveries: 2</cite></br>
添加删除节点或负载均衡时并发恢复线程的个数，默认为4。</br>
<cite style="color:red">indices.recovery.max_size_per_sec: 0</cite></br>
设置数据恢复时限制的带宽，如入100mb，默认为0，即无限制。</br>
<cite style="color:red">indices.recovery.concurrent_streams: 5</cite></br>
设置这个参数来限制从其它分片恢复数据时最大同时打开并发流的个数，默认为5。</br>
<cite style="color:red">discovery.zen.minimum_master_nodes: 1</cite></br>
设置这个参数来保证集群中的节点可以知道其它N个有master资格的节点。默认为1，对于大的集群来说，可以设置大一点的值（2-4）</br>
<cite style="color:red">discovery.zen.ping.timeout: 3s</cite></br>
设置集群中自动发现其它节点时ping连接超时时间，默认为3秒，对于比较差的网络环境可以高点的值来防止自动发现时出错。</br>
<cite style="color:red">discovery.zen.ping.multicast.enabled: false</cite></br>
设置是否打开多播发现节点，默认是true。</br>
<cite style="color:red">discovery.zen.ping.unicast.hosts: ["host1", "host2:port", "host3[portX-portY]"]</cite></br>
设置集群中master节点的初始列表，可以通过这些节点来自动发现新加入集群的节点。</br>
<cite style="color:red">下面是一些查询时的慢日志参数设置</cite></br>
index.search.slowlog.level: TRACE  
index.search.slowlog.threshold.query.warn: 10s  
index.search.slowlog.threshold.query.info: 5s  
index.search.slowlog.threshold.query.debug: 2s  
index.search.slowlog.threshold.query.trace: 500ms  
index.search.slowlog.threshold.fetch.warn: 1s  
index.search.slowlog.threshold.fetch.info: 800ms  
index.search.slowlog.threshold.fetch.debug:500ms  
index.search.slowlog.threshold.fetch.trace: 200ms  



