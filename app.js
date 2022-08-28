const taskHTML1 = "<td onclick='showCellIndex(this)' class=''><i onclick='makeTaskCompleted(";
const taskHTML11 = ")' class='complete-icon fa-solid fa-check'></i><div class='z'><p class='task-text-span'>";
const taskHTML2 = "</p><p class='task-text-span font-1rem'>";
const taskHTML201 = "</p></div><div class='f'><span class='time-span'>";
const taskHTML202 = "</span><i onclick='deleteTask(1,";
const taskHTML21 = ")' class='trash-icon fa-solid fa-trash-can'></i></div></td>";

const taskHTML3 = "<td onclick='showCellIndex(this)' style='background-color: rgb(4, 141, 61);'><div class='z1'><p class='greyed striked task-text-span'>";
const taskHTML4 = "</p><p class='greyed striked font-1rem task-text-span'>";
const taskHTML41 = "</p></div><div class='f'><i onclick='deleteTask(2,";
const taskHTML5 = ")' class='trash-icon fa-solid fa-trash-can'></i></div></td>";

let arrUpco = []; //array of keys - upcoming tasks for localStorage
let arrComp = []; //array of keys - completed tasks for localStorage
let i = 0;
let timerMins = 0, counter = -1;
let timerOpened = false;

// localStorage.clear();

if (localStorage.getItem("upcoming-tasks") == null) {
    localStorage.setItem("upcoming-tasks", JSON.stringify([]));
    localStorage.setItem("upcoming-tasks-desc", JSON.stringify([]));
    localStorage.setItem("time", JSON.stringify([]));
}

if (localStorage.getItem("completed-tasks") == null) {
    localStorage.setItem("completed-tasks", JSON.stringify([]));
    localStorage.setItem("completed-tasks-desc", JSON.stringify([]));
}

let upcomingArr = JSON.parse(localStorage.getItem("upcoming-tasks"));
let completedArr = JSON.parse(localStorage.getItem("completed-tasks"));
let upcoDesc = JSON.parse(localStorage.getItem("upcoming-tasks-desc"));
let compDesc = JSON.parse(localStorage.getItem("completed-tasks-desc"));
let timeArr = JSON.parse(localStorage.getItem("time"));


updateUpcomingTasks();

function showCellIndex(x) {
    console.log("Cell Index = ", x.cellIndex);
    i = x.cellIndex;
}

function deleteTask(n,x) {
    if (n === 1) {
        upcomingArr.splice(x, 1);
        upcoDesc.splice(x, 1);
        timeArr.splice(x, 1);
        localStorage.setItem("upcoming-tasks", JSON.stringify(upcomingArr));
        localStorage.setItem("upcoming-tasks-desc", JSON.stringify(upcoDesc));
        localStorage.setItem("time", JSON.stringify(timeArr));
        updateUpcomingTasks();
    }
    else if (n === 2) {
        completedArr.splice(x, 1);
        compDesc.splice(x, 1);
        localStorage.setItem("completed-tasks", JSON.stringify(completedArr));
        localStorage.setItem("completed-tasks-desc", JSON.stringify(compDesc));
        updateUpcomingTasks();
    }
}

function makeTaskCompleted(qq) {
    console.log(qq);
    completedArr.push(upcomingArr[qq]);
    compDesc.push(upcoDesc[qq]);
    console.log(completedArr);
    upcomingArr.splice(qq, 1);
    upcoDesc.splice(qq, 1);
    timeArr.splice(qq, 1);
    console.log("timearr ", timeArr);
    localStorage.setItem("upcoming-tasks", JSON.stringify(upcomingArr));
    localStorage.setItem("completed-tasks", JSON.stringify(completedArr));
    localStorage.setItem("upcoming-tasks-desc", JSON.stringify(upcoDesc));
    localStorage.setItem("completed-tasks-desc", JSON.stringify(compDesc));
    localStorage.setItem("time", JSON.stringify(timeArr));
    updateUpcomingTasks();
}

function saveTask() {
    console.log("task saved");
    if (timerOpened == false) {
        timerMins = 0;
    }
    timerOpened = false;
    let totalTime = 0;
    totalTime = (timerMins * 60);
    let showTime = totalTime + 's';
    if (totalTime == 0) {
        totalTime = -1;
        showTime = '';
    }
    console.log("CHECK THIS TIME ", totalTime);
    let inputTaskText = $(".entered-list").val();
    let taskDesc = $(".description-input").val();
    $(".entered-list").val("");
    $(".description-input").val("");
    console.log(inputTaskText);
    $("#upcoming-tasks").prepend(taskHTML1 + upcomingArr.length + taskHTML11 + inputTaskText + taskHTML2 + taskDesc + taskHTML201 + showTime + taskHTML202 + upcomingArr.length + taskHTML21);
    upcomingArr.push(inputTaskText);
    upcoDesc.push(taskDesc);
    timeArr.push(totalTime.toString());
    localStorage.setItem("upcoming-tasks", JSON.stringify(upcomingArr));
    localStorage.setItem("upcoming-tasks-desc", JSON.stringify(upcoDesc));
    localStorage.setItem("time", JSON.stringify(timeArr));
}

function updateUpcomingTasks() { 
    $("#upcoming-tasks").empty();
    for (let k = 0; k < upcomingArr.length; k++) { 
        let shTime = timeArr[k] + "s";
        if (timeArr[k] == -1) {
            shTime = '';
        }
        $("#upcoming-tasks").prepend(taskHTML1 + k + taskHTML11 + upcomingArr[k] + taskHTML2 + upcoDesc[k] + taskHTML201 + shTime + taskHTML202 + k + taskHTML21);
    }
    for (let k = 0; k < completedArr.length; k++) { 
        $("#upcoming-tasks").append(taskHTML3 + completedArr[k] + taskHTML4 + compDesc[k] + taskHTML41 + k + taskHTML5);
    }
}

$(".timer-btn").on("click", function() {
    if (($(".entered-list").val() === '') && ($(".description-input").val() === '')) {
        alert("No Title - No Description given. Try Again.");
    } else {
        $("#timer-modal").toggleClass("hidden");
    }
});

$("#timer-submit").on("click", function(event) {
    counter++;
    event.preventDefault();
    timerMins = ($('#mins').val());
    if (timerMins > 0) {
        timerOpened = true;
    }
    // $("#mins").value = '';
    console.log("Timer in Mins ", timerMins);
    // $('#mins').val(0);
    $('#formid')[0].reset();
    $("#timer-modal").toggleClass("hidden");
})

setInterval(() => {
    if (timeArr.length > 0) {
        console.log("Updating tasks based on timer !");
        updateUpcomingTasks();
        for (let i = 0; i < timeArr.length; i++) {
            let val = parseInt(timeArr[i]);
            if (val === 0) {
                makeTaskCompleted(i);
            }
            else if (val > 0) {
                val = val - 1;
                timeArr[i] = val;
            }
        }
        localStorage.setItem("time", JSON.stringify(timeArr));
    }
}, 1000);

document.querySelector('#mins').addEventListener('mouseup', (e) => {
    e.stopPropagation();
});