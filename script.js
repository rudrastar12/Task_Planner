class TaskManager {
  constructor() {
    this.tasks = [];
    this.currentId = 0;
    this.loadTasksFromLocalStorage(); // Load tasks from Local Storage on initialization
  }

  // Load tasks from Local Storage
  loadTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
      this.currentId = this.tasks.length > 0 ? this.tasks[this.tasks.length - 1].id + 1 : 0;
    }
  }

  // Save tasks to Local Storage
  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(name, description, assignedTo, dueDate, status) {
    this.tasks.unshift({
      id: this.currentId++,
      name: name,
      description: description,
      assignedTo: assignedTo,
      dueDate: dueDate,
      status: status,
    });

    this.saveTasksToLocalStorage(); // Save tasks to Local Storage after adding
  }

  deleteTask(id) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    this.tasks.splice(taskIndex, 1);
    this.saveTasksToLocalStorage(); // Save tasks to Local Storage after deletion
  }

  updateTask(id, updatedTask) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.name = updatedTask.name;
      task.description = updatedTask.description;
      task.assignedTo = updatedTask.assignedTo;
      task.dueDate = updatedTask.dueDate;
      task.status = updatedTask.status;
      this.saveTasksToLocalStorage(); // Save tasks to Local Storage after update
    }
  }

  markTaskAsDone(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.status = 'Done';
      this.saveTasksToLocalStorage(); // Save tasks to Local Storage after marking as done
    }
  }

  render() {
    const taskListContainer = document.getElementById('task-list');
    taskListContainer.innerHTML = '';

    this.tasks.forEach((task) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.description}</td>
        <td>${task.assignedTo}</td>
        <td>${task.dueDate}</td>
        <td>${task.status}</td>
        <td>
          <button class="edit-button" data-task-id="${task.id}">Edit</button>
          <button class="delete-button" data-task-id="${task.id}">Delete</button>
          ${
            task.status !== 'Done'
              ? `<button class="mark-done-button" data-task-id="${task.id}">Mark as Done</button>`
              : ''
          }
        </td>
      `;

      taskListContainer.appendChild(row);
    });

    // Add event listeners to the new buttons
    const editButtons = document.querySelectorAll('.edit-button');
    const deleteButtons = document.querySelectorAll('.delete-button');
    const markDoneButtons = document.querySelectorAll('.mark-done-button');

    editButtons.forEach((button) => {
      button.addEventListener('click', handleEditTask);
    });

    deleteButtons.forEach((button) => {
      button.addEventListener('click', handleDeleteTask);
    });

    markDoneButtons.forEach((button) => {
      button.addEventListener('click', handleMarkAsDone);
    });
  }
}

const taskManager = new TaskManager();

// Function to handle form submission
function addTask(event) {
  event.preventDefault();

  // Get the form input values
  const nameInput = document.getElementById('task-name');
  const descriptionInput = document.getElementById('task-description');
  const assignedToInput = document.getElementById('assigned-to');
  const dueDateInput = document.getElementById('due-date');
  const statusInput = document.getElementById('status');

  // Validate the name input
  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const assignedTo = assignedToInput.value.trim();

  if (name === '' || name.length > 8) {
    alert('Task Name must not be empty and should not exceed 8 characters.');
    return;
  } else if (description === '' || description.length > 15) {
    alert('Add some relevant description and not longer than 15 characters.');
    return;
  } else if (assignedTo === '' || assignedTo.length > 8) {
    alert('Assigned To field must not be empty and should not exceed 8 characters.');
    return;
  }

  // Add the task to the task manager
  taskManager.addTask(name, description, assignedTo, dueDateInput.value, statusInput.value);

  // Clear the form inputs
  nameInput.value = '';
  descriptionInput.value = '';
  assignedToInput.value = '';
  dueDateInput.value = '';
  statusInput.value = 'todo';

  // Render the tasks
  taskManager.render();
}

// Function to handle task deletion
function handleDeleteTask(event) {
  const taskId = Number(event.target.dataset.taskId);
  taskManager.deleteTask(taskId);
  taskManager.render();
}

// Function to handle task editing
function handleEditTask(event) {
  const taskId = Number(event.target.dataset.taskId);
  const task = taskManager.tasks.find((task) => task.id === taskId);

  // Populate the form with task data
  const nameInput = document.getElementById('task-name');
  const descriptionInput = document.getElementById('task-description');
  const assignedToInput = document.getElementById('assigned-to');
  const dueDateInput = document.getElementById('due-date');
  const statusInput = document.getElementById('status');

  nameInput.value = task.name;
  descriptionInput.value = task.description;
  assignedToInput.value = task.assignedTo;
  dueDateInput.value = task.dueDate;
  statusInput.value = task.status;

  // Replace form submit event listener with updateTask
  const taskForm = document.getElementById('task-form');
  taskForm.removeEventListener('submit', addTask);
  taskForm.addEventListener('submit', updateTask);
  taskForm.setAttribute('data-task-id', taskId);
}

// Function to handle task update
function updateTask(event) {
  event.preventDefault();

  // Get the form input values
  const nameInput = document.getElementById('task-name');
  const descriptionInput = document.getElementById('task-description');
  const assignedToInput = document.getElementById('assigned-to');
  const dueDateInput = document.getElementById('due-date');
  const statusInput = document.getElementById('status');

  // Validate the name input
  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const assignedTo = assignedToInput.value.trim();

  if (name === '' || name.length > 8) {
    alert('Task Name must not be empty and should not exceed 8 characters.');
    return;
  } else if (description === '' || description.length > 15) {
    alert('Add some relevant description and not longer than 15 characters.');
    return;
  } else if (assignedTo === '' || assignedTo.length > 8) {
    alert('Assigned To field must not be empty and should not exceed 8 characters.');
    return;
  }

  const taskId = Number(event.target.getAttribute('data-task-id'));
  const updatedTask = {
    name: name,
    description: description,
    assignedTo: assignedTo,
    dueDate: dueDateInput.value,
    status: statusInput.value,
  };

  // Update the task
  taskManager.updateTask(taskId, updatedTask);

  // Clear the form inputs
  nameInput.value = '';
  descriptionInput.value = '';
  assignedToInput.value = '';
  dueDateInput.value = '';
  statusInput.value = 'todo';

  // Revert the form submit event listener to addTask
  const taskForm = document.getElementById('task-form');
  taskForm.removeEventListener('submit', updateTask);
  taskForm.addEventListener('submit', addTask);
  taskForm.removeAttribute('data-task-id');

  // Render the tasks
  taskManager.render();
}

// Function to handle marking a task as done
function handleMarkAsDone(event) {
  const taskId = Number(event.target.dataset.taskId);
  taskManager.markTaskAsDone(taskId);
  taskManager.render();
}

// Add event listener to form submit
const taskForm = document.getElementById('task-form');
taskForm.addEventListener('submit', addTask);

// Add event listener to mark done buttons
const taskListContainer = document.getElementById('task-list');
taskListContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('mark-done-button')) {
    handleMarkAsDone(event);
  }
});

// Render the tasks on page load
taskManager.render();
