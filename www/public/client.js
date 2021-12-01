//Points to a div element where task combo will be inserted.
let taskDiv;
let addTaskResultDiv;

//Set up page when window has loaded
window.onload = init;

//Get pointers to parts of the DOM after the page has loaded.
function init() {
    taskDiv = document.getElementById("TaskDiv");
    addTaskResultDiv = document.getElementById("AddTaskResult");
    loadTasks();
}
//jquery to handle button clicks
$(document).ready(function () {
    $("#plusButton").click(function () {
        addTask();
        document.getElementById("taskInput").focus();
    });
});

function completedTask(taskID) {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Create object with task data
    let taskObj = {
        id: taskID
    };

    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            addTaskResultDiv.innerHTML = "Task removed successfully";

            //Refresh list of tasks 
            loadTasks();
        }
        else {
            addTaskResultDiv.innerHTML = "<span style='color: red'>Error adding task</span>.";
        }

    };

    //Send new task data to server
    xhttp.open("DELETE", "/todo", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(taskObj));
}

/* Loads current  tasks and adds them to the page. */
function loadTasks() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            let taskArr = JSON.parse(xhttp.responseText);

            //Return if no tasks 
            if (taskArr.length === 0) {
                taskDiv.innerHTML = "";
                return;
            }

            //Build string with task data
            let taskNumber = 1;
            let htmlStr = "<table class='table'><tr><th>Task</th></th><th>Information</th><th>Date and Time</th><th>Done</th></tr>";
            for (let key in taskArr) {
                taskArr[key].task = taskArr[key].task.replaceAll("'", '&#39;');
                taskArr[key].task = taskArr[key].task.replaceAll('"', '&quot;');
                taskArr[key].task = taskArr[key].task.replaceAll("<", '&lt;');
                taskArr[key].task = taskArr[key].task.replaceAll(">", '&gt;');
                htmlStr += ("<tr><td>" + taskNumber + "</td><td>" + taskArr[key].task + "</td>");
                htmlStr += ("<td>" + taskArr[key].dateAdded + "</td>");
                htmlStr += ("<td><button class='btn-lg' id='minusButton' onclick='completedTask(\"" + taskArr[key].id + "\")'>-</button></td></tr>");
                taskNumber++;
            }
            //Add  tasks to page.
            htmlStr += "</table>";
            taskDiv.innerHTML = htmlStr;
        }
    };

    //Request data from all tasks 
    xhttp.open("GET", "/todo", true);
    xhttp.send();
}


/* Posts a new task to the server. */
function addTask() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    if (document.getElementById("taskInput").value != "") {
        //Extract task data
        let taskToAdd = document.getElementById("taskInput").value;

        //Create object with task data
        let taskObj = {
            task: taskToAdd,
        };

        //Set up function that is called when reply received from server
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                addTaskResultDiv.innerHTML = "Task added successfully";
                //Refresh list of tasks 
                loadTasks();
            }
            else {
                addTaskResultDiv.innerHTML = "<span style='color: red'>Error adding task</span>.";
            }

        };

        //Send new task data to server
        xhttp.open("POST", "/todo", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(taskObj));

        //empties input field
        document.getElementById('taskInput').value = '';
    } else {
        addTaskResultDiv.innerHTML = "Please enter a to do!";
    }
}