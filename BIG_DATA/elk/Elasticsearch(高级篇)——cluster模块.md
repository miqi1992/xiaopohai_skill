1：shard allocation

分片分配就是将索引的各个分片合理的分布到各个节点上去。这个过程可能发生在以下场景下：

初始化(重启恢复)，副本分配，平衡，节点加入，节点移除。

es在这个模块对应的设置有：

cluster.routing.allocation.allow_rebalance: 根据集群状态是否允许平衡操作，什么时机可以平衡。选项有：always， indices_primaries_active, indices_all_active(default).默认值减少集群启动时机器之间的交互。
cluster.routing.allocation.cluster_concurrent_rebalance: 设置集群级别平衡过程中的shard并发度设置，2(default)

cluster.routing.allocation.node_initial_primaries_recoveries: 设置node级别上初始化数据恢复过程中并发的主分片数量，大多情况下是local gateway，这个过程会很快，因此可以在不增加负载的情况下处理更多的主分片。

cluster.routing.allocation.node_concurrent_recoveries: 设置node级别recovery的并发度。2(default)

cluster.routing.allocation.enable: 哪些分片可以参与重新分配。选项有：all(default), primaries(主分片), new_primaries(新增加的主分片), none.

cluster.routing.allocation.same_shard.host: 是否启用对同一分片在同一个主机上出现多个分配实例的检测。默认false。这个选项只有在同一个node上启动多个es实例的情况下才有意义。

indices.recovery.concurrent_stream：设置node级别上从一个分片恢复另一个分片的并发度。

2：shard allocation awareness

集群分配awareness可以跨一般的属性来控制节点上分片和副本的分配。举例说明：

假设我们有多个机架。当我们启动一个节点的时候，配置一个属性rack_id(任何名称都可以，这里只是举例)，例如：

node.rack_id : rack_one

以上给一个node设置了rank_id属性，现在我们将rack_id属性设置为一个awareness allocation属性（所有node上都要设置）：

cluster.routing.allocation.awareness.attributes: racd_id

以上设置将rack_id属性应用在awareness过程中影响分片和副本的分配。例如：我们启动了2个设置rack_id为rack_one的节点，部署了一个有5分片1副本的索引，那么索引会部署到所有当前节点中，总共10个分片，每个节点5个。现在如果我们再启动2个节点，node.rack_id: rack_two。分片就会在当前4个节点中重新分配，但是分片和副本不会同时分配到rack_id相同的节点上。也就是说如果一个分片落在rack_one上，其副本必定落在rank_two上。

awareness允许多值，例如：

cluster.routing.allocation.awareness.attributes:rank_id, zone。

注意：当应用awareness属性时，分片不会落在没有设置属性值的节点上。

3：forced awareness

有些时候，我们事先就可以知道awareness属性值的数量，并且我们不想让超出需求数量以外的副本分配到特定的具有相同awareness属性值的节点群中，这种情况下我们可以使用强制awareness的功能。举例说明：

假设我们有一个awareness的属性为zone，而且我们知道只存在两个zone的取值：zone1和zone2.因此我们可以配置这样的一个强制awareness属性：

cluster.routing.allocation.awareness.force.zone.values: zone1, zone2

cluster.routing.allocation.awareness.attributes: zone

现在我们启动两个node.zone：zone1的节点，部署一个5分片1副本的索引，则这两个节点启动后，只会分配5个主分片，一个节点2一个节点3，但是不会有副本（请注意跟2中的区别，2中是有副本的，因为预先es并不知道会有rack_two的存在）。只有我们启动具有node.zone: zone2的节点，副本才会分配。

4：automatic preference when searching/getting

当执行一个查询或者get操作的时候，节点接受到请求后，会优先在相同属性值的分片上处理请求。

5：realtime settings update

这些配置都可以通过update api进行实时的更新

6：shard allocation filtering

支持用include/exclude过滤器来控制分片的分配。过滤器可以设置在索引级别或者是集群级别。索引级别设置举例：

假设有4个节点，每个节点有tag属性，tag有对应取值：节点1为node.tag: value1, 节点2为node.tag: value2。依次类推。

我们创建一个索引，设置index.routing.allocation.include.tag: value1, value2。

这个配置将索引分配限定在tag值为value1和value2的节点上。

另外，我们可以设置索引部署在所有节点，除了tag为value3的节点，

设置index.routing.allocation.exclude.tag: value3.

index.routing.allocation.require.tag可以设置必须满足的一些规则才能分配，是must all的关系，而inclued 是 any的关系。

include，exclude，require可以支持简单的通配符，例如value*。

另外有一个特殊的属性_ip可以匹配节点的ip，_host可以匹配主机名称也可以匹配ip，_name可以匹配node name，_id可以匹配node id。

显然一个节点可以设置多个属性，并且属性名称和属性值可以在setting中指定。比如：

node.group1: group1_value1
node.group2: group2_value4
同样的，include exclude require 也可以有多个属性：

curl -XPUT localhost:9200/test/_settings -d '{
"index.routing.allocation.include.group1" : "xxx"
"index.routing.allocation.include.group2" : "yyy",
"index.routing.allocation.exclude.group3" : "zzz",

"index.routing.allocation.require.group4" : "aaa",
}'
上边设置的意义是：分片分配要符合这样规则----group4必须为aaa，group3必须不能为zzz，group为xxx或者group2为yyy

以上设置可以通过update api实时改变，当然会触发shard的重新分配。

cluste级别的filter同样可以定义，也可以实时更新。这个设置在删除节点时很有用途（即使副本为0）

curl -XPUT localhost:9200/_cluster/settings -d '{
"transient" : {
"cluster.routing.allocation.exclude._ip" : "10.0.0.1"
}
}'
显然10.0.0.1这个节点将要被删除，其上的分片将会重新分配～