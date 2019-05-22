<blockquote>
    Aggregations操作，统计操作
</blockquote>


##Metrics Aggregations
<p style="color:red">（1）Avg统计</p>
<code>统计最近15分钟的平均访问时间，upstream_time_ms是每次访问时间，单位是毫秒</code>  
```
{
  "query" : {
    "filtered": {
      "filter": {
        "range": {
          "@timestamp": {
            "gte": "now-15m",
            "lte": "now"
          }
        }
      }
    }
  },
  "aggs":{
    "execute_time" : {
      "avg": {
        "field": "upstream_time_ms"
      }
    }
  }
}

//当然，还可以把过滤器写在aggs里面
POST logstash-narilog-2015.11.13/narilog/_search
{
  "size": 0, 
  "aggs": {
    "filtered_aggs": {
      "filter": {
        "range": {
          "@timestamp": {
            "gte": "now-15m",
            "lte": "now"
          }
        }
      },
      "aggs": {
        "execute_time": {
          "avg": {
            "field": "upstream_time_ms"
          }
        }
      }
    }
  }
}
```

**注:**
- size:0用于代替以前search_type:count,不返回数据本身，只返回统计值

<p style="color:red">（2）cardinality求唯一值，即不重复的字段有多少</p>
```
//计算UV
{
  "size" : 0,
  "aggs" : {
    "filtered" : {
      "range" : {
        "@timestamp" : {
          "gte" : "now-15m",
          "lt" : "now"
        }
      }
    },
    "aggs" : {
      "ipv" : {
        "cardinality": {
          "field": "ip"
        }
      }
    }
  }
}
```

<p style="color:red">（3）percentiles 基于百分比统计</p>
```
{
  "size": 0,
  "query": {
    "filtered": {
      "filter": {
        "range": {
          "@timestamp": {
            "gt": "now-15m",
            "lt": "now"
          }
        }
      }
    }
  },
  "aggs": {
    "execute_time": {
      "percentiles": {
        "field": "upstream_time_ms",
        "percents": [
          90,
          95,
          99.9
        ]
      }
    }
  }
}
//返回值，0.1%的请求超过了159ms
{
  "took": 620,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 679400,
    "max_score": 0,
    "hits": []
  },
  "aggregations": {
    "execute_time": {
      "values": {
        "90.0": 24.727003484320534,
        "95.0": 72.6200981699678,
        "99.9": 159.01065773524886 //99.9的数据落在159以内，是系统计算出来159
      }
    }
  }
}
```

<p style="color:red">（4）percentile_ranks 指定字段取值返回，有多少数据落在这里</p>

```
{
  "size": 0,
  "query": {
    "filtered": {
      "filter": {
        "range": {
          "@timestamp": {
            "gt": "now-15m",
            "lt": "now"
          }
        }
      }
    }
  },
  "aggs": {
    "execute_time": {
      "percentile_ranks": {
        "field": "upstream_time_ms",
        "values": [
          50,
          160
        ]
      }
    }
  }
}

//返回值

{
  "took": 666,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 681014,
    "max_score": 0,
    "hits": []
  },
  "aggregations": {
    "execute_time": {
      "values": {
        "50.0": 94.14716385885366,
        "160.0": 99.91130872493076 //99.9的数据落在了160以内，这次，160是我指定的，系统计算出99.9
      }
    }
  }
}
```

```
//统计最近15分钟，不同的链接请求时间大小

{
  "size": 0,
  "query": {
    "filtered": {
      "filter": {
        "range": {
          "@timestamp": {
            "gt": "now-15m",
            "lt": "now"
          }
        }
      }
    }
  },
  "aggs": {
    "execute_time": {
      "terms": {
        "field": "uri"
      },
      "aggs": {
        "avg_time": {
          "avg": {
            "field": "upstream_time_ms"
          }
        }
      }
    }
  }
}

//返回,看起来url1 比 url2慢一点(avg_time)，不过url1的请求量比较大 （doc_count）
{
  "took": 1655,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 710802,
    "max_score": 0,
    "hits": []
  },
  "aggregations": {
    "execute_time": {
      "doc_count_error_upper_bound": 10,
      "sum_other_doc_count": 347175,
      "buckets": [
        {
          "key": "/url1",
          "doc_count": 362688,
          "avg_time": {
            "value": 6.601660380271749
          }
        },
        {
          "key": "/url2",
          "doc_count": 939,
          "avg_time": {
            "value": 5.313099041533547
          }
        }
      ]
    }
  }
}
```


```
//找出url响应最慢的前2名
{
  "size": 0,
  "query": {
    "filtered": {
      "filter": {
        "range": {
          "@timestamp": {
            "gt": "now-15m",
            "lt": "now"
          }
        }
      }
    }
  },
  "aggs": {
    "execute_time": {
      "terms": {
        "size": 2,
        "field": "uri",
        "order": {
          "avg_time": "desc"
        }
      },
      "aggs": {
        "avg_time": {
          "avg": {
            "field": "upstream_time_ms"
          }
        }
      }
    }
  }
}
//返回值
{
  "took": 1622,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 748712,
    "max_score": 0,
    "hits": []
  },
  "aggregations": {
    "execute_time": {
      "doc_count_error_upper_bound": -1,
      "sum_other_doc_count": 748710,
      "buckets": [
        {
          "key": "url_shit",
          "doc_count": 123,
          "avg_time": {
            "value": 8884
          }
        },
        {
          "key": "url_shit2",
          "doc_count": 456,
          "avg_time": {
            "value": 8588
          }
        }
      ]
    }
  }
}
```


```
value_count 文档数量
相当于
select count(*) from table group by uri，为了达到这个目的，只需要把上文中,avg 换成value_count。不过avg的时候，结果中的doc_count其实达到了同样效果。
怎么取数据画个图？比如：最近2分钟，每20秒的时间窗口中，平均响应时间是多少
{
  "size": 0,
  "query": {
    "filtered": {
      "filter": {
        "range": {
          "@timestamp": {
            "gt": "now-2m",
            "lt": "now"
          }
        }
      }
    }
  },
  "aggs": {
    "execute_time": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "20s"
      },
      "aggs": {
        "avg_time": {
          "avg": {
            "field": "upstream_time_ms"
          }
        }
      }
    }
  }
}
```

```
pv 分时统计图（每小时一统计）
周期大小对性能影响不大
{
  "size":0,
  "fields":false,
  "aggs": {
    "execute_time": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "1h"
      }
    }
  }
}
```


<a href="">