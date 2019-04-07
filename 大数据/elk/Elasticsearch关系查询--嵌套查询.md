###传统的object


GET my_index2/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "user.first": "Alice" }},
        { "match": { "user.last":  "Smith" }}
      ]
    }
  }
}

//response
{
  "took": 4,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 0.2712221,
    "hits": [
      {
        "_index": "my_index2",
        "_type": "my_type",
        "_id": "1",
        "_score": 0.2712221,
        "_source": {
          "group": "fans",
          "user": [
            {
              "first": "John",
              "last": "Smith"
            },
            {
              "first": "Alice",
              "last": "White"
            }
          ]
        }
      }
    ]
  }
}



##nested映射
PUT /my_index
{
  "mappings": {
    "my_type": {
      "properties": {
        "user": {
          "type": "nested"
        }
      }
    }
  }
}

//索引一个文档
PUT /my_index/my_type/1
{
  
  "group" : "fans",
  "user" : [
    {"first" : "John",
      "last" : "Smith"
    },
    {
      "first" : "Alics",
      "last" : "White"
    }
    ]
}

//查询一个是同一个对象的文档
GET my_index/_search
{
  "query": {
    "nested": {
      "path": "user",
      "query": {
        "bool": {
          "must": [
            { "match": { "user.first": "Alics" }},
            { "match": { "user.last":  "Smith" }} 
          ]
        }
      }
    }
  }
}

{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 0,
    "max_score": null,
    "hits": []
  }
}



//查询是统一对象的文档
GET my_index/_search
{
  "query": {
    "nested": {
      "path": "user",
      "query": {
        "bool": {
          "must": [
            { "match": { "user.first": "Alics" }},
            { "match": { "user.last":  "White" }} 
          ]
        }
      }
    }
  }
}

{
  "took": 4,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 1.987628,
    "hits": [
      {
        "_index": "my_index",
        "_type": "my_type",
        "_id": "1",
        "_score": 1.987628,
        "_source": {
          "group": "fans",
          "user": [
            {
              "first": "John",
              "last": "Smith"
            },
            {
              "first": "Alics",
              "last": "White"
            }
          ]
        }
      }
    ]
  }
}


GET my_index/_search
{
  "query": {
    "nested": {
      "path": "user",
      "query": {
        "bool": {
          "must": [
            { "match": { "user.first": "Alics" }},
            { "match": { "user.last":  "White" }} 
          ]
        }
      },
      "inner_hits": { 
        "highlight": {
          "fields": {
            "user.first": {}
          }
        }
      }
    }
  }
}



{
  "took": 12,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 1.987628,
    "hits": [
      {
        "_index": "my_index",
        "_type": "my_type",
        "_id": "1",
        "_score": 1.987628,
        "_source": {
          "group": "fans",
          "user": [
            {
              "first": "John",
              "last": "Smith"
            },
            {
              "first": "Alics",
              "last": "White"
            }
          ]
        },
        "inner_hits": {
          "user": {
            "hits": {
              "total": 1,
              "max_score": 1.987628,
              "hits": [
                {
                  "_type": "my_type",
                  "_id": "1",
                  "_nested": {
                    "field": "user",
                    "offset": 1
                  },
                  "_score": 1.987628,
                  "_source": {
                    "first": "Alics",
                    "last": "White"
                  },
                  "highlight": {
                    "user.first": [
                      "<em>Alics</em>"
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    ]
  }
}