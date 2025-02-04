import { saveTasks, loadTasks, saveProjects, loadProjects } from './storage.js';

function createIcon(pathData, viewBox = "0 0 24 24") {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("fill", "currentColor");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    svg.appendChild(path);
    return svg;
}

let editingTask = null;
const saveDataButton = document.querySelector('#save-task');
const modalTitle = document.querySelector("#task-modal h2");

// Helper function to save all tasks to localStorage
function saveAllTasks() {
    const tasks = Array.from(document.querySelectorAll('#todo-list li')).map(taskElement => {
        return {
            title: taskElement.querySelector('strong').textContent,
            description: taskElement.querySelector('em').textContent,
            dueDate: taskElement.querySelector('small').textContent.match(/Due: (.*?) \|/)[1],
            priority: taskElement.querySelector('small').textContent.match(/Priority: (.*)/)[1],
            completed: taskElement.classList.contains('completed'),
        };
    });

    saveTasks(tasks); // Save tasks to localStorage
}

// Helper function to save all projects to localStorage
function saveAllProjects() {
    const projects = Array.from(document.querySelectorAll('#project-list li')).map(projectElement => {
        return {
            name: projectElement.querySelector('.project-name').textContent,
        };
    });

    saveProjects(projects); // Save projects to localStorage
}

// Helper function to create a task element
function createTaskElement(task) {
    const newTask = document.createElement("li");
    newTask.classList.add("todo");
    if (task.completed) newTask.classList.add('completed');

    const taskContent = document.createElement("div");
    taskContent.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-details">
                <strong>${task.title}</strong><br>
                <em>${task.description}</em><br>
                <small>Due: ${task.dueDate} | Priority: ${task.priority}</small>
            </div>
        </div>
    `;

    const checkbox = taskContent.querySelector('.task-checkbox');
    checkbox.addEventListener('change', function () {
        newTask.classList.toggle('completed', this.checked);
        saveAllTasks(); // Save tasks when checkbox is toggled
    });

    const editTaskButton = document.createElement("button");
    editTaskButton.classList.add("edit-task", "icon-button");
    editTaskButton.appendChild(createIcon("M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"));
    editTaskButton.setAttribute("aria-label", "Edit task");

    editTaskButton.addEventListener("click", () => {
        const currentTitle = newTask.querySelector('strong').textContent;
        const currentDescription = newTask.querySelector('em').textContent;
        const currentDueDate = newTask.querySelector('small').textContent.match(/Due: (.*?) \|/)[1];
        const currentPriority = newTask.querySelector('small').textContent.match(/Priority: (.*)/)[1];

        document.querySelector("#task-title").value = currentTitle;
        document.querySelector("#task-description").value = currentDescription;
        document.querySelector("#task-due-date").value = currentDueDate;
        document.querySelector("#task-priority").value = currentPriority;

        modalTitle.textContent = "Edit Task";
        editingTask = newTask;
        openModal();
    });

    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.classList.add("delete-task", "icon-button");
    deleteTaskButton.appendChild(createIcon("M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"));
    deleteTaskButton.setAttribute("aria-label", "Delete task");

    deleteTaskButton.addEventListener("click", () => {
        newTask.remove();
        saveAllTasks(); // Save tasks after deletion
    });

    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');
    taskActions.appendChild(editTaskButton);
    taskActions.appendChild(deleteTaskButton);

    newTask.appendChild(taskContent);
    newTask.appendChild(taskActions);

    return newTask;
}

// Save task button click handler
saveDataButton.addEventListener("click", () => {
    const title = document.querySelector("#task-title").value;
    const description = document.querySelector("#task-description").value;
    const dueDate = document.querySelector("#task-due-date").value;
    const priority = document.querySelector("#task-priority").value;

    if (!title) {
        alert("Please fill out all title before saving.");
        return;
    }

    if (editingTask) {
        editingTask.querySelector("strong").textContent = title;
        editingTask.querySelector("em").textContent = description;
        editingTask.querySelector("small").textContent = `Due: ${dueDate} | Priority: ${priority}`;
    } else {
        const newTask = createTaskElement({
            title,
            description,
            dueDate,
            priority,
            completed: false,
        });

        const todoList = document.querySelector("#todo-list");
        todoList.appendChild(newTask);
    }

    saveAllTasks(); // Save tasks after creating/updating
    closeModal();
    editingTask = null;
});

// Load tasks and projects when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const tasks = loadTasks();
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        document.querySelector("#todo-list").appendChild(taskElement);
    });

    const projects = loadProjects();
    projects.forEach(project => {
        const projectElement = createProjectElement(project);
        document.querySelector("#project-list").appendChild(projectElement);
    });
});

// Project-related code
document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.querySelector('#project-list');
    const createNewProjectButton = document.querySelector('#create-new-project');
    const projectModal = document.querySelector('#project-modal');
    const closeProjectModalButton = document.querySelector('#close-project-modal');
    const saveProjectButton = document.querySelector('#save-project');
    const projectNameInput = document.querySelector('#project-name');

    let editingProject = null;

    createNewProjectButton.addEventListener('click', () => {
        projectModal.style.display = 'block';
        projectNameInput.value = '';
        saveProjectButton.textContent = 'Save Project';
        editingProject = null;
    });

    closeProjectModalButton.addEventListener('click', () => {
        projectModal.style.display = 'none';
    });

    saveProjectButton.addEventListener('click', () => {
        const projectName = projectNameInput.value.trim();
        if (projectName !== '') {
            if (editingProject) {
                const projectNameSpan = editingProject.querySelector('.project-name');
                projectNameSpan.textContent = projectName;
                projectModal.style.display = 'none';
                editingProject = null;
            } else {
                const newProject = document.createElement('li');
                newProject.classList.add('project');

                const projectNameSpan = document.createElement('span');
                projectNameSpan.classList.add('project-name');
                projectNameSpan.textContent = projectName;
                newProject.appendChild(projectNameSpan);

                const editButton = document.createElement('button');
                editButton.classList.add('edit-project', 'icon-button');
                editButton.appendChild(createIcon("M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"));
                editButton.setAttribute("aria-label", "Edit project");

                editButton.addEventListener('click', () => {
                    projectNameInput.value = projectNameSpan.textContent;
                    editingProject = newProject;
                    saveProjectButton.textContent = 'Update Project';
                    projectModal.style.display = 'block';
                });

                newProject.appendChild(editButton);
                newProject.appendChild(createDeleteButton());
                projectList.appendChild(newProject);
            }

            saveAllProjects(); // Save projects after creating/updating
            projectModal.style.display = 'none';
        }
    });

    function createDeleteButton() {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-project', 'icon-button');
        deleteButton.appendChild(createIcon("M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"));
        deleteButton.setAttribute("aria-label", "Delete project");
        deleteButton.addEventListener('click', () => deleteProject(deleteButton));
        return deleteButton;
    }

    function deleteProject(deleteButton) {
        const project = deleteButton.closest('.project');
        project.remove();
        saveAllProjects(); // Save projects after deletion
    }
});

export function openModal() {
    const modal = document.querySelector("#task-modal");
    modal.style.display = 'block';

    if (!editingTask) {
        modalTitle.textContent = "Create a New Task";
        document.querySelector("#task-title").value = '';
        document.querySelector("#task-description").value = '';
        document.querySelector("#task-due-date").value = '';
        document.querySelector("#task-priority").value = 'low';
    }
}

export function closeModal() {
    const modal = document.querySelector("#task-modal");
    modal.style.display = 'none';
}