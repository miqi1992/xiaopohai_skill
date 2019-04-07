集群分片配置
     在Elasticsearch集群分片有几种方式，集群水平分片分配(Cluster Level Shard Allocation)。集群分片会经常发生变化，然后从新分配，比如当初始恢复，复制，节点加入或者取消的时候等。包括分片分配设置，分片平衡设置，启发式分片平衡配置。
   分片分配设置：下面的动态设置可以用来控制分片的分配和回收。
cluster.routing.allocation.enable：禁用或启用哪种类型的分片，可选的参数有：
all 允许所有的分片被从新分配
primaries   只允许主结点分片被从新分配
new_primaries   只允许新的主结点索引的分片被从新分配
none    不对任何分片进行从新分配
cluster.routing.allocation.node_concurrent_recoveries：允许在一个节点上同时并发多少个分片分配，默认为2。
cluster.routing.allocation.node_initial_primaries_recoveries：当副本分片加入集群的时候，在一个节点上同行发生分片分配的数量，默认是4个。
cluster.routing.allocation.same_shard.host：在一个主机上的当有多个相同的集群名称的分片分配时，是否进行检查，检查主机名和主机ip地址。默认为false，此设置仅适用于在同一台机器上启动多个节点在时配置。
indices.recovery.concurrent_streams：从一个节点恢复的时候，同时打开的网络流量的数量，默认为3。
indices.recovery.concurrent_small_file_streams：从同伴的分片恢复时打开每个节点的小文件(小于5M)流的数目，默认为2。
分片平衡设置
    下面的动态设置可以用来控制整个集群的碎片再平衡，配置有：
cluster.routing.rebalance.enable：启用或禁用特定种类的分片重新平衡，可选的参数有：
all     允许所有的分片进行分片平衡，默认配置。
primaries   只允许主分片进行平衡。
replicas    只允许从分片进行平衡。
none    不允许汾河分片进行平衡。
cluster.routing.allocation.allow_rebalance：当分片的再平衡时允许的操作，可选的参数有：
always  总是让再平衡。
indices_primaries_active    只有主节点索引允许在平衡。
indices_all_active  所有的分片允许在平衡，默认参数。
cluster.routing.allocation.cluster_concurrent_rebalance：重新平衡时允许多少个并发的分片同时操作，默认为2。
启发式分片平衡
    以下设置来确定在何处放置每个碎片的数据。
cluster.routing.allocation.balance.shard：在节点上分配每个分片的权重，默认是0.45。
cluster.routing.allocation.balance.index：在特定节点上，每个索引分配的分片的数量，默认0.55。
cluster.routing.allocation.balance.threshold：操作的最小最优化的值。默认为1。
基于磁盘的分片分配配置
    Elasticsearch可以根据磁盘的大小来决定是否从新进行分片的分配。
cluster.routing.allocation.disk.threshold_enabled：是否启用磁盘分配决策，默认为true。
cluster.routing.allocation.disk.watermark.low：允许分配时的磁盘空间最小值，可以是比例或者绝对值，比如85%或者1G。当磁盘占用超过设定的值之后，系统将不会对此节点进行分配操作。
cluster.routing.allocation.disk.watermark.high：允许保存分片节点磁盘空间的最大值，当超过这个值后，系统会把分片迁移到别的节点。默认90%。也可以设置一个具体的大小值，当空间小于这个值的时候，系统会自动迁移到别的节点。
cluster.info.update.interval：检查集群中的每个节点的磁盘使用情况的时间间隔，默认30秒。
cluster.routing.allocation.disk.include_relocations：当计算节点的磁盘使用时需要考虑当前被分片的情况。
比如下面的一个配置实例：
```json
PUT /_cluster/settings{
  "transient": {
    "cluster.routing.allocation.disk.watermark.low": "80%",
    "cluster.routing.allocation.disk.watermark.high": "5gb",
    "cluster.info.update.interval": "1m"
  }
}
```

  实例的含义是，每分钟检查一下磁盘空间，当磁盘空间小于80%的时候参与分片分配，当空间不足5G的时候，迁移节点的分片到别的节点。
    需要注意的是，在2.0.0版本前，当系统有多个数据盘的时候，系统考虑的是总大小，在2.0.0之后，系统考虑的是每个磁盘的使用情况。
本文由赛克 蓝德(secisland)原创，转载请标明作者和出处。
区域分片分配(Shard Allocation Awareness)
    实际部署的时候，很多时候是部署在虚拟机中，共享同一个物理节点，或者部署的时候在同一个机架或者同一个网络区域中。当这些情况下遇到故障的时候，很多节点会同时发生故障，导致系统出现问题。如果在配置Elasticsearch的时候事先能够注意到吧不同的节点分布在不同的物理机器，不同的机架或者不同的网络区域，这样当一个节点出现问题的时候，会使风险降到最低。
    区域分片分配(Shard Allocation Awareness)设置允许配置Elasticsearch关于硬件的信息，例如，我们在启动的时候在启动程序后面加上--node.rack_id，后面跟上一个指定的名称，这个配置也可以放在配置文件中：
elasticsearch --node.rack_id rack_one
    同时我们需要设置cluster.routing.allocation.awareness.attributes: rack_id，可以在配置文件中设置，或者通过cluster-update-settings API接口设置。
    假设有两个节点node.rack_id的名称为rack_one，我们创建一个索引有5个主要的分片和一个副本分片。所有的主分片和副本分片被分配在两个节点上。然后我们新加两个节点，节点node.rack_id的名称为rack_two,这样配置后，系统会自定分配节分片到新的节点上，确保没有两个相同的分片在同一个区域中。
    当搜索的时候，系统会智能的处理，只在一个区域中搜索， 这样会比在不同的区域中搜索更快。
    当使用区域分片分配属性，碎片不会分配给没有设置这些属性的值的节点。在相同属性的上主从分片分配节点的数量是由属性值的数量决定的。当一组节点的数量是不平衡的，可能有许多的副本，复制分片可能会停止。
  强制分配属性，解决了不允许相同的分片副本被分配到同一区域的问题。假设当我们有两个区域的时候，每个区域的大小只够分配一半的分片，如果一个区域不可用，全部分片都在一个区域会导致空间不够，引起系统异常，这个时候，强制分配属性就有意义了。配置：
cluster.routing.allocation.awareness.force.zone.values: zone1,zone2 
cluster.routing.allocation.awareness.attributes: zone
这个时候，如果我们启动了zone1上的两个节点，并创建有5个分片一个副本的索引，这个时候在zone1上只会启动主分片，只到zone2的节点启动后，才会启动副本分片。
分片配置过滤
    分片配置过滤可以允许或禁止索引的分片分配到特定节点。这个配置主要的作用是当想停止一个节点到集群中的比较有用。例如我们想停止10.0.0.1这个ip上的所有节点：

```json
PUT /_cluster/settings{
  "transient" : {
    "cluster.routing.allocation.exclude._ip" : "10.0.0.1"
  }
}
```

这样正常情况下，10.0.0.1节点上的分片会被迁移到其他节点。动态配置的属性如下：
cluster.routing.allocation.include.{attribute}：将索引分配给一个节点，其{attribute}至少有一个逗号分隔的值。
cluster.routing.allocation.require.{attribute}：将索引分配给一个节点，该节点的{attribute}具有所有的逗号分隔值。
cluster.routing.allocation.exclude.{attribute}：将索引分配给一个节点，其{attribute}没有一个逗号分隔的值。
attributes 可以包含的值有：
_name：通过节点名称匹配节点
_ip：通过IP地址匹配节点
_host：通过机器名称匹配节点
所有的属性值可以用通配符，如：
```json
PUT _cluster/settings{
  "transient": {
    "cluster.routing.allocation.include._ip": "192.168.2.*"
  }
}
```

其他集群设置
只读设置：可以设置cluster.blocks.read_only使整个群集为只读。
日志记录：设置日志记录的级别，例如增加的indices.recovery模块的日志记录级别的调试：

```json
PUT /_cluster/settings{
  "transient": {
    "logger.indices.recovery": "DEBUG"
  }
}
```
  