#routing设置
PUT /my_index/my_type/1?routing=user1
{
  "title":"This is a document"
}

GET /my_index/my_type/1?routing=usr1


GET  my_index/_search
{
  "query": {
    "terms": {
      "_routing" : ["usr1"]
    }
  }
}


PUT my_index2
{
  "mappings": {
    "my_type": {
      "_routing": {
        "required": true 
      }
    }
  }
}

PUT my_index2/my_type/1?routing=miqi
{
  "text": "No routing vaasfa那是的啊放fas年底d"
}


GET my_index2/my_type/1?routing=usr1
DELETE /my_index*


#设置父子
PUT my_index3
{
  "mappings": {
    "my_type":{},
    "my_child" : {
      "_parent": {
        "type": "my_type"
      }
    }
  }
}

PUT my_index3/my_type/10?routing=miqi
{
  "title": "ada"
}

PUT my_index3/my_child/12?parent=10&routing=miqi
{
  "title": "adasda"
}

GET my_index3/my_type/10?routing=ss

GET my_index3/my_child/12?routing=assa
