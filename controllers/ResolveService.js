/*!
 * Copyright(c) 2016 Daniel Arteaga
 * MIT Licensed
 * 
 * @author Daniel Artega <dani8art.da@gmail.com>
 */

'use strict';

var Algorithmia = require('algorithmia');

var i = 1;
var j = 1;
var node = 0;

function changeName(name, nodeToName){
    var new_name = name + "_" + node;
    nodeToName[new_name] = name;
    node ++;
    return new_name;
}

function addVertex(name, vertexName){
    if(!vertexName[name]){
        vertexName[name] = [i,j]; i++; j++;
    }
}

function constructGraph(root, object, nodeToName, vertexName, vertexNeighbors){
    addVertex(root, vertexName);

    for(var p in object){
        var new_name = changeName(p, nodeToName);
        addVertex(new_name, vertexName);

        if(vertexNeighbors[root])
            vertexNeighbors[root].push(new_name);
        else
            vertexNeighbors[root] = [new_name];

        if(object[p] instanceof Object)
            constructGraph(new_name, object[p], nodeToName, vertexName, vertexNeighbors);
        else{
            addVertex(new_name, vertexName);
            addVertex(object[p], vertexName);

            if(vertexNeighbors[new_name])
                vertexNeighbors[new_name].push(object[p]);
            else
                vertexNeighbors[new_name] = [object[p]];
        }
    }

}

exports.resolvesPath = function(args, res, next) {
  /**
   * parameters expected in the args:
  * requestObject (RequestObject)
  **/  
    if(args.requestObject) {
        var requestObject = args.requestObject.value;

        if(requestObject.object){
            if(requestObject.target){
                var object = requestObject.object;
                var target = requestObject.target;
                var root = "root";

                var nodeToName = {};
                var vertexName = {};
                var vertexNeighbors = {};

                var i = 1;
                var j = 1;
                var node = 0;

                constructGraph(root, object, nodeToName, vertexName, vertexNeighbors);

                var sendToAlgorithmia = [vertexName, vertexNeighbors, root, target];

                Algorithmia.client("sim0g1pJ/+5fpbGsNePMBcUhwNT1")
                    .algo("algo://kenny/Dijkstra/0.1.0")
                    .pipe(sendToAlgorithmia)
                    .then(function(response) {
                        if(!response.error){
                            var path = response.get();
                            var stringCall = "root";
                            var arrayCall = [];
                            for(var o in path){
                                if(path[o] != "root" && path[o] != target){
                                    stringCall += "." + nodeToName[path[o]];
                                    arrayCall.push(nodeToName[path[o]].toString());
                                }
                            }
                            res.status(200);
                            res.json({
                                status: 200,
                                description: "The path is resolved.",
                                path: stringCall,
                                arrayPath: arrayCall
                            });

                        }else{
                            res.status(500);
                            res.json({
                                code: 500,
                                message: "There is an error with Algorithmia Servers, please contact us."
                            });
                        }
                    });
            }else{
                res.status(400)
                res.json({
                    code: 400,
                    message: "Bad Request: There is not target."
                });
            }
        }else{
            res.status(400)
            res.json({
                code: 400,
                message: "Bad Request: Object for search path into, is empty."
            });
        }
    }else {
        res.status(400)
        res.json({
            code: 400,
            message: "Bad Request: request body is empty."
        });
    }

}

