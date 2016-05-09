#JSON Object Path Resolver

A microservice to resolve path to a target filed, given a JSON Object. [API documentation](http://path-resolver.herokuapp.com/docs)


##INPUT

```javascript

{
  	"target": "example",
  	"object": {
  		"property01": "aux",
  		"property02":{
    		"property021": "tres",
    		"property022": "one",
    		"property02":{
      			"property0231": "jsjs",
      			"property0232":{
        			"property02321": "example"
      			}
    		}
  		} 
  	}
}

```

##OUTPUT

```javascript

{
  	"status": 200,
  	"description": "The path is resolved.",
  	"path": "root.property02.property02.property0232.property02321",
  	"arrayPath": [
    	"property02",
    	"property02",
    	"property0232",
    	"property02321"
  	]
}

```