var neo4j = require('neo4j-driver').v1;
var http = require('http');
var dispatcher = require('httpdispatcher');
var yaml_config = require('node-yaml-config');
var config = yaml_config.load(__dirname + '/config/config.yml');
var express = require('express');
var app = express();

var driver = neo4j.driver("bolt://" + config.server.host, neo4j.auth.basic(config.server.username, config.server.password));

app.get('/', function (req, res) {

    var session = driver.session();

    // load data into neo4j
    var tx = session.beginTransaction();
    tx.run( "MERGE (a:Person {name:'Richard', title:'King'})" )
    tx.run( "MERGE (a:Person {name:'Arthur', title:'King'})" )
    tx.run( "MATCH (a:Person), (b:Person) where a.name = 'Arthur' AND b.name = 'Richard' MERGE (a)-[:BOSSES]->(b);")
    tx.commit();

    console.log(req.url);
    var jsonArray = [];
    // retrieve data
    session
      .run( "MATCH (a:Person)-[r:BOSSES]->(b:Person) RETURN a.name AS name1, type(r) AS relName, b.name AS name2 ")
      .subscribe({
        onNext: function(record) {
          //record.forEach(function(value, key, record) {
            console.log(record);
            var jsonObject = {};
            jsonObject.name1 = record.get("name1");
            jsonObject.relName = record.get("relName");
            jsonObject.name2 = record.get("name2");
            jsonArray.push(jsonObject);
          //});
        },
        onCompleted: function() {

          session.close();
          res.json(jsonArray);
        },
        onError: function(error) {
          console.log(error);
          res.send(error);
        }
      });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
