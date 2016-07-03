# graph-app
Node Express Server for communicating Neo4j through Bolt

This is an example of connecting to Neo4J through the Bolt API.

It is a basic Node Express Server and uses the Neo4j Javascript Driver

http://neo4j.com/docs/api/javascript-driver/current/

A file is included to start a Docker image of Neo4j. It sets no volumes as this was written as a test server so could just be restarted to clear the data.

The config.yml file needs to have the IP address of the Docker image, and the password.

After cloning run (sudo) npm install
