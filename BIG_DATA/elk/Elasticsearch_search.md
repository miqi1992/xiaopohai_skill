PUT /my_test_match
{
  "mappings": {
    "my_type" : {
      "properties": {
        "num" : {
          "type": "integer"
        }
      }
    }
  }
}

PUT /my_test_match/my_type/1
{
  "num" : 12
}

POST /my_test_match/my_type/_search
{
  "query": {
    "match": {
      "num" : {
        "query" : "miqi",
        "lenient" : false
      }
    }
  }
}
#回应如下
{
   "error": {
      "root_cause": [
         {
            "type": "number_format_exception",
            "reason": "For input string: \"miqi\""
         }
      ],
      "type": "search_phase_execution_exception",
      "reason": "all shards failed",
      "phase": "query",
      "grouped": true,
      "failed_shards": [
         {
            "shard": 0,
            "index": "my_test_match",
            "node": "Gbe9VajtT0mZsrAvXJ6LzQ",
            "reason": {
               "type": "number_format_exception",
               "reason": "For input string: \"miqi\""
            }
         }
      ]
   },
   "status": 400
}


POST /my_test_match/my_type/_search
{
  "query": {
    "match": {
      "num" : {
        "query" : "miqi",
        "lenient" : true
      }
    }
  }
}

{
  "took": 1,
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
