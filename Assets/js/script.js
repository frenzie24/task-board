// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// all possible status for tasks
const tStatus = {
    todo: 'to-do',
    prog: 'in-progress',
    done: 'done',
};


// Todo: create a function to generate a unique task id
function generateTaskId() {
    return keyGenerator(new Date());
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let cardData = {
        name: "task-card",
        class: '',
        id: task.id,
        status: task.status,
    }
    let card = generateElement("div", cardData);
    // use the toolBox funtion generateSimpleTag to create child elements for the card
    // and store them in an array children
    let children = [
        generateSimpleTag("h2", task.title),
        generateSimpleTag('h4', dayjs(task.dueDate)),
        generateElement("p", { id: 'description' }).append(task.description),
    ];
    card.append(children);
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    //gets tasks from storage 
    let tasks = getItem('tasks');
    if (!tasks || tasks.length == 0) {
        return;
    }
    // get the card sections we want to append to
    // task will be appeded to card section based on status
    const todo = $("#todo-cards");
    const inProgress = $("#in-progress-cards");
    const done = $("#done-cards");


    tasks.forEach(task => {
        let card = createTaskCard(task);
        switch (task.status) {
            case tStatus.todo:
                $('#todo-cards').append(card);
                break;

            default:
                break;
        }
        debugger;
        // let card = $('<div>', task).attr('class', 'd-flex bg-white h50 w50');

       // card = `<div`
        /*
        let title = $('<div>').attr('class', 'd-flex bg-white');
        let description = $('<div>').attr('class', 'd-flex bg-white');
        let dueDate = $('<div>').attr('class', 'd-flex bg-white');
        title.text(task.title);
        description.text(task.description);
        dueDate.text(task.dueDate);
        card.append([title, description, dueDate]);
        switch (task.status) {
            case tStatus.todo:
                $('#todo-cards').append(card);
                break;

            default:
                break;
        }
        */
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    // prevent the modal from dismissing 
    event.preventDefault();
    // object to store our task's data
    let task = {
        // title, dueDate, and description all get their values from user input
        title: $("#task-title").val(),
        dueDate: new Date($("#task-due-date").val()),
        description: $("#task-decscription").val(),
        // id is generated with by calling generateTaskId
        id: generateTaskId(),
        // Every new task will have its status set to to-do by default
        status: tStatus.todo,
    }
    if (task.title == '' || !task.title) {
        return;
    }
    console.log(`new task: `);
    console.log(task);
    // use our toolBox function to store our task without thinknig about it
    storeTask(task);
    $('#taskModal').modal('hide');

}

function storeTask(task) {
    // use toolBox function getItem to get our tasks wihtout worrying about parsing the data
    let tasks = getItem('tasks');
    // if tasks were ever stored incorrectly wipe it all and make a new array
    if (!tasks || typeof (tasks) == !Array) {
        tasks = [];
    }
    tasks.push(task);
    // use our toolBox function to store our task without worrying about parsing the data
    setItem('tasks', tasks);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // add click listener to add task btn
    $('#add-task-btn').on('click', handleAddTask);
    renderTaskList();
});
