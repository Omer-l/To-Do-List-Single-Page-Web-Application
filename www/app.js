//Import the express and body-parser modules, mysql module
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());

//Set up express to serve static files from the directory called 'public'
app.use(express.static('public')); //use public folder to load files
app.use('/css', express.static('node_modules/bootstrap/dist/css')); //bootstrap css
app.use('/js', express.static('node_modules/bootstrap/dist/js')); //boostrap js
app.use('/js', express.static('node_modules/jquery/dist')); //jquery

//Data structure that will be accessed using the web service
let todoArray = [];

//Set up application to handle GET requests sent to the task path
app.get('/todo/*', handleGetRequest);//Returns task with specified ID
app.get('/todo', handleGetRequest);//Returns all tasks

//set up application to handle DELETE requests sent to the task path
app.delete('/todo', handleDeleteRequest);

//Set up application to handle POST requests sent to the task path
app.post('/todo', handlePostRequest);//Adds a newtask 

//Start the app listening on port 8080
app.listen(8080);

//Create a connection pool with the task details
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "todo",
    debug: false
});

//Handles DELETE requests to our web service
function handleDeleteRequest(request, response) {

    //Output the data sent to the server
    let newTask = request.body
    console.log("Data received: " + JSON.stringify(newTask));

    //Finish off the interaction.
    response.send("Task removed successfully.");

    //Build SQL query
    let sql = 'DELETE FROM tasks WHERE id="' + request.body.id + '"';

    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
        if (err) {//Check for errors
            console.error("Error executing query: " + JSON.stringify(err));
        }
        else {
            console.log(JSON.stringify(result));
        }
    });

}

//Handles GET requests to our web service
function handleGetRequest(request, response) {
    let todoArray = [];
    /* Outputs all of the todos */
    //Build query
    let sql = "SELECT * FROM tasks";

    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];
    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
        if (err) {//Check for errors
            console.error("Error executing query: " + JSON.stringify(err));
        }
        else {//Output results in JSON format - a web service would return this string.

            //If path ends with 'todo' we return all tasks
            if (pathEnd === 'todo') {
                response.send(JSON.stringify(result));
            }
            else
            {
            //send back data from mysql
            response.send(JSON.stringify(result));
            todoArray.push(JSON.stringify(result));
            }
        }
    });


}

//Handles GET requests to our web service for testing
function handleGetRequest(request, response, task) {
    let todoArray = [];
    /* Outputs all of the todos */
    //Build query
    let sql = "SELECT * FROM tasks";

    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];
    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
        if (err) {//Check for errors
            console.error("Error executing query: " + JSON.stringify(err));
        }
        else {//Output results in JSON format - a web service would return this string.

            //If path ends with 'todo' we return all tasks
            if (pathEnd === 'todo') {
                response.send(JSON.stringify(result));
            }
            else
            {
            //send back data from mysql
            response.send(JSON.stringify(result));
            todoArray.push(JSON.stringify(result));
            }
        }
    });


}

//Handles POST requests to our web service
function handlePostRequest(request, response) {

    //Output the data sent to the server
    let newTask = request.body
    console.log("Data received: " + JSON.stringify(newTask));

    //Finish off the interaction.
    response.send("Task added successfully.");

    //Build query
    let sql = "INSERT INTO tasks (task, dateAdded) "
        + " VALUES ("//unique id for task
        + "\"" + request.body.task //task details
        + "\", \"" + new Date().toLocaleString('en-US', { timeZone: 'GB-Eire' }) + "\"" //date
        + ")";

    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
        if (err) {//Check for errors
            console.error("Error executing query: " + JSON.stringify(err));
        }
        else {
            console.log(JSON.stringify(result));
        }
    });

}