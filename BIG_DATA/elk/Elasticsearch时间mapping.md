<blockquote>
    本篇主要介绍ES的mapping Data字段
</blockquote>


##

PUT my_index
{
  "mappings": {
    "_default_" : {
      "properties" : {
        "time" : {
          "type" : "date",
          "format" : "yyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
        }
      }
    }
  }
}
