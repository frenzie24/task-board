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
        class: '',
        id: task.id,
        status: task.status,
    }
    // TODO: ADD STYLING TO CARD 
    let card = generateElement("div", cardData);
    // using dayjs, we can get the difference in time from dueDate to now, delaTima is the differnce in days
    const now = dayjs(new Date);
    const dueDate = dayjs(task.dueDate);
    
    const deltaTime = dueDate.diff(now, 'day');
    // inline conditional if deltaTime > 3 set the background to bg-success,
    // else if deltaTime > 0 set background to bg-warning, 
    // else set background to bg-danger
    card.addClass(deltaTime > 3 ? "bg-success" : deltaTime < 3 && deltaTime > 0 ? "bg-warning" : "bg-danger");
    card.addClass("task-card")
    card.css('z-index', 1);
    // use the toolBox functions to create child elements for the card
    // and store them in an array children
    let children = [
        generateSimpleTag("h2", task.title),
        generateSimpleTag('h4', `Due: ${new Date(task.dueDate).toLocaleDateString()}`),
        generateElement("p", { id: 'description' }).append(task.description),
        generateElement("button", { class: "btn btn-danger border border-dark" }).text('DELETE').on('click', handleDeleteTask),
    ];
    // attach child elements stored in children to the card and return the card
    card.append(children);
    card.css('margin-bottom:', '1em');
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
    // here we set the min height of the cards to hold tasks so that they can be useable droppable targets
    // then we remove any childdren of our cards to prepare for new render
    const todo = $("#todo-cards").css("min-height", "170px").empty().sortable().sortable();;
    const inProgress = $("#in-progress-cards").css("min-height", "170px").empty().sortable();
    const done = $("#done-cards").css("min-height", "170px").empty().sortable().sortable();;

    tasks.forEach(task => {
        let card = createTaskCard(task);
        card.draggable({
            containment: '#taskboard',
            revert: "invalid",
            snap: true,
            snapMode: "inner"
        });

        // this switch case handles which card task card will attach to
        switch (task.status) {
            case tStatus.todo:
                todo.append(card);
                break;
            case tStatus.prog:
                inProgress.append(card);
                break;
            case tStatus.done:
                done.append(card);
                break;

            default:
                break;
        }
    });

   // handles dropped a draggble onto our droppables, then calls handleDrop to reassign task status and store updated task
    todo.droppable({
        drop: function (ev, ui) {
            handleDrop(ev, ui);
            $(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
        }
    });

    inProgress.droppable({
        drop: function (ev, ui) {
            handleDrop(ev, ui);
            $(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
        }
    });

    done.droppable({
        drop: function (ev, ui) {
            handleDrop(ev, ui);
            $(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
        }
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
        dueDate: new Date(new Date($("#task-due-date").val()).getTime() + (24 * 60 *60* 1000)),
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
    renderTaskList();
    $('#taskModal').modal('hide');

}

// Function to store tasks
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
    let card = this.parentElement;
    let tasks = getItem('tasks');
    // steps through the array and remove the task
    tasks.forEach(task => {
        if (task.id == card.id) {
            const index = tasks.indexOf(task);
            tasks.splice(index, 1);
        }
    });
    // store our updated tasks
    setItem('tasks', tasks);
    // remove the task card from DOM
    card.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // dargged is the task that is being modified
        let dragged =   $(ui.draggable)[0];
        let tasks = getItem('tasks');
        //find all tasks that match id then set status to dropped card
        let task = tasks.find((entry) => entry.id === dragged.id);
        if (event.target.id == 'in-progress-cards') {
            dragged.setAttribute('status', tStatus.prog);
            task.status = tStatus.prog;
        } else if (event.target.id == 'done-cards') {
            dragged.setAttribute('status', tStatus.done);
            task.status = tStatus.done;
        } else {
            dragged.setAttribute('status', tStatus.todo);
            task.status = tStatus.todo; 
        }
        // replace old task with new task
        tasks.splice(tasks.indexOf(task), 1, task)
        // store updated tasks array
        setItem('tasks', tasks);
         
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // add click listener to add task btn
    $('#add-task-btn').on('click', handleAddTask);
    renderTaskList();
});
