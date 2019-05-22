>Snapshot and restore模块允许创建单个索引或者整个集群的快照到远程仓库，在初始版本里只支持共享文件系统的仓库，但是现在通过官方的仓库插件可以支持各种各样的后台仓库。

###Repositories--仓库
在进行任何快照或者恢复操作之前必须有一个快照仓库注册在Elasticsearch里。下面的这个命令注册了一个名为my_backup的共享文件系统仓库，快照将会存储在`/mount/backups/my_backup`这个目录。  

```
curl -XPUT 'http://192.168.1.90:9200/_snapshot/my_backups' -d '
{
    "type" : "fs",
    "settings" : {
        "location" : "/mount/backups/my_backup",
        "compress": "true"
    }
}
'
```
一旦仓库被注册了，就可以只用下面的命令去获取这个仓库的信息

```
curl -XGET 'http://192.168.1.90:9200/_snapshot/my_backup?pretty'

{
  "my_backup" : {
    "type" : "fs",
    "settings" : {
        "compress" : "true",
        "location" : "/mount/backups/my_backup"
    }
  }
}
```

如果没有指定仓库名字，或者使用_all作为仓库名字，Elasticsearch将返回该集群当前注册的仓库的信息:
```
$ curl -XGET 'http://192.168.1.90:9200/_snapshot'
or
$ curl -XGET 'http://192.168.1.90:9200/_snapshot/_all'
```

###共享文件系统的仓库
共享文件系统仓库("type": "fs")是使用共享的文件系统去存储快照。**在`location`参数里指定的具体存储路径必须和共享文件系统里的位置是一样的并且能被所有的数据节点和master节点访问。**

|参数|备注|
|:---|:---|
|location                   |指定快照的存储位置。必须要有|
|compress                   |指定是否对快照文件进行压缩，默认是true|
|chunk_size                 |如果需要在做快照的时候大文件可以被分解成几块。这个参数知名了也可用不同的单位标识。 比如，1g, 10m, 5k等。默认是null|
|max_restore_bytes_per_sec  |每个节点数据恢复的最高速度限制。默认是20mb/s|
|max_snapshot_bytes_per_sec |每个节点做快照的最高速度限制。默认是20mb/s|

###只读URL仓库
URL仓库("type":"url")可以作为使用共享文件系统存储快照创建的共享文件仓库的只读访问方式。url参数指定的URL必须指向共享文件系统仓库的根。 支持的配置方式如下：

|
|--|--|
|url|指定快照位置。必须要有|

###仓库插件
下面这些官方插件中的仓库后台都是可用的:

- [AWS Cloud Plugin](https://github.com/elasticsearch/elasticsearch-cloud-aws#s3-repository)亚马逊S3仓库
- [HDFS Plugin](https://github.com/elasticsearch/elasticsearch-hadoop/tree/master/repository-hdfs)Hadoop环境
- [Azure Cloud Plugin](https://github.com/elastic/elasticsearch-cloud-azure#azure-repository)Azure存储仓库

###快照

一个仓库可以包含同一个集群的多个快照。快照根据集群中的唯一名字进行区分。在仓库`my_backup`里创建一个名为snapshot_t的快照可以通过下面的命令:
```
curl -XPUT "192.168.1.90:9200/_snapshot/my_backup/snapshot_1?wait_for_completion=true"
```

`wait_for_completion`参数指定创建snapshot的请求是否等待快照创建完成再返回。默认情况下，集群中所有打开和启动的索引是自动创建的。可以通过在快照请求里列出需要创建快照的索引。

```
$ curl -XPUT "192.168.1.90:9200/_snapshot/my_backup/snapshot_1" -d '{
    "indices": "index_1,index_2",
    "ignore_unavailable": "true",
    "include_global_state": false
    "partial": "false"
}'
```

上述命令中通过`indices`参数指定快照包含的索引，这个参数支持同时配置多个索引，快照请求同样支持`ignore_unavailable`选项。这个选项