import {
    saveTasks,
    loadTasks,
    saveProjects,
    loadProjects,
    saveActiveProject,
    loadActiveProject,
    saveThemePreference,
    loadThemePreference
} from './storage.js';

// Icon creation helper
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

// State variables
let editingTask = null;
let editingProject = null;
let allTasks = loadTasks();
const saveDataButton = document.querySelector('#save-task');
const modalTitle = document.querySelector("#task-modal h2");

// Theme initialization
function initializeTheme() {
    const savedTheme = loadThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function setupThemeToggle() {
    document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        saveThemePreference(newTheme);
    });
}

// Task rendering
function renderTasksForProject(projectName) {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = '';

    allTasks
        .filter(task => task.project === projectName)
        .forEach(task => {
            const taskElement = createTaskElement(task);
            todoList.appendChild(taskElement);
        });
}

function saveAllTasks() {
    saveTasks(allTasks);
}

// Task element creation
function createTaskElement(task) {
    const newTask = document.createElement("li");
    newTask.classList.add("todo");
    if (task.completed) newTask.classList.add('completed');
    newTask.dataset.taskId = task.id;

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
        const taskIndex = allTasks.findIndex(t => t.id === task.id);
        allTasks[taskIndex].completed = this.checked;
        saveAllTasks();
    });

    const editTaskButton = document.createElement("button");
    editTaskButton.classList.add("edit-task", "icon-button");
    editTaskButton.appendChild(createIcon("M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"));
    editTaskButton.setAttribute("aria-label", "Edit task");

    editTaskButton.addEventListener("click", () => {
        document.querySelector("#task-title").value = task.title;
        document.querySelector("#task-description").value = task.description;
        document.querySelector("#task-due-date").value = task.dueDate;
        document.querySelector("#task-priority").value = task.priority;
        modalTitle.textContent = "Edit Task";
        editingTask = task.id;
        openModal();
    });

    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.classList.add("delete-task", "icon-button");
    deleteTaskButton.appendChild(createIcon("M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"));
    deleteTaskButton.setAttribute("aria-label", "Delete task");

    deleteTaskButton.addEventListener("click", () => {
        allTasks = allTasks.filter(t => t.id !== task.id);
        saveAllTasks();
        newTask.remove();
    });

    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');
    taskActions.appendChild(editTaskButton);
    taskActions.appendChild(deleteTaskButton);

    newTask.appendChild(taskContent);
    newTask.appendChild(taskActions);

    return newTask;
}

// Project management
function handleProjectClick(projectElement, projectName) {
    document.querySelectorAll('.project').forEach(p => p.classList.remove('active'));
    projectElement.classList.add('active');
    saveActiveProject(projectName);
    renderTasksForProject(projectName);
}

function saveAllProjects() {
    const projects = Array.from(document.querySelectorAll('#project-list li')).map(projectElement => {
        return {
            name: projectElement.querySelector('.project-name').textContent
        };
    });
    saveProjects(projects);
}

function createProjectElement(project) {
    const newProject = document.createElement('li');
    newProject.classList.add('project');
    if (project.name === loadActiveProject()) newProject.classList.add('active');

    const projectNameSpan = document.createElement('span');
    projectNameSpan.classList.add('project-name');
    projectNameSpan.textContent = project.name;
    newProject.appendChild(projectNameSpan);

    const editButton = document.createElement('button');
    editButton.classList.add('edit-project', 'icon-button');
    editButton.appendChild(createIcon("M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"));
    editButton.setAttribute("aria-label", "Edit project");

    editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelector('#project-name').value = project.name;
        editingProject = newProject;
        document.querySelector('#save-project').textContent = 'Update Project';
        document.querySelector('#project-modal').style.display = 'block';
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-project', 'icon-button');
    deleteButton.appendChild(createIcon("M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"));
    deleteButton.setAttribute("aria-label", "Delete project");
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm("Delete this project and all its tasks?")) {
            allTasks = allTasks.filter(t => t.project !== project.name);
            saveAllTasks();
            newProject.remove();
            saveAllProjects();
            if (project.name === loadActiveProject()) {
                saveActiveProject('Inbox');
                renderTasksForProject('Inbox');
            }
        }
    });

    newProject.addEventListener('click', () => handleProjectClick(newProject, project.name));

    newProject.appendChild(editButton);
    newProject.appendChild(deleteButton);
    return newProject;
}

// Event listeners
saveDataButton.addEventListener("click", () => {
    const title = document.querySelector("#task-title").value;
    const description = document.querySelector("#task-description").value;
    const dueDate = document.querySelector("#task-due-date").value;
    const priority = document.querySelector("#task-priority").value;
    const activeProject = loadActiveProject();

    if (!title) {
        alert("Please fill out at least title before saving.");
        return;
    }

    if (editingTask !== null) {
        const taskIndex = allTasks.findIndex(t => t.id === editingTask);
        allTasks[taskIndex] = {
            ...allTasks[taskIndex],
            title,
            description,
            dueDate,
            priority
        };
    } else {
        allTasks.push({
            id: Date.now(),
            title,
            description,
            dueDate,
            priority,
            completed: false,
            project: activeProject
        });
    }

    saveAllTasks();
    renderTasksForProject(activeProject);
    closeModal();
    editingTask = null;
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupThemeToggle();

    // Projects
    let projects = loadProjects();
    if (projects.length === 0) {
        projects = [{ name: 'Inbox' }];
        saveProjects(projects);
    }

    const projectList = document.querySelector('#project-list');
    projects.forEach(project => {
        projectList.appendChild(createProjectElement(project));
    });

    // Tasks
    const activeProject = loadActiveProject();
    renderTasksForProject(activeProject);

    // Activate current project
    Array.from(document.querySelectorAll('.project-name')).forEach(projectNameSpan => {
        if (projectNameSpan.textContent === activeProject) {
            projectNameSpan.closest('.project').classList.add('active');
        }
    });

    // Project modal
    const createNewProjectButton = document.querySelector('#create-new-project');
    createNewProjectButton.addEventListener('click', () => {
        document.querySelector('#project-modal').style.display = 'block';
        projectNameInput.value = '';
        saveProjectButton.textContent = 'Save Project';
        editingProject = null;
    });
    const projectModal = document.querySelector('#project-modal');
    const closeProjectModalButton = document.querySelector('#close-project-modal');
    const saveProjectButton = document.querySelector('#save-project');
    const projectNameInput = document.querySelector('#project-name');

    closeProjectModalButton.addEventListener('click', () => projectModal.style.display = 'none');

    saveProjectButton.addEventListener('click', () => {
        const projectName = projectNameInput.value.trim();
        if (!projectName) return;

        if (editingProject) {
            const oldName = editingProject.querySelector('.project-name').textContent;
            const newName = projectName;

            allTasks = allTasks.map(task =>
                task.project === oldName ? { ...task, project: newName } : task
            );
            saveAllTasks();

            editingProject.querySelector('.project-name').textContent = newName;
        } else {
            const newProject = createProjectElement({ name: projectName });
            projectList.appendChild(newProject);
        }

        saveAllProjects();
        document.querySelector('#project-modal').style.display = 'none';
    });
});

// Modal functions
export function openModal(modalType = 'task') {
    if (modalType === 'task') {
        document.querySelector("#task-modal").style.display = 'block';
        if (!editingTask) {
            modalTitle.textContent = "Create New Task";
            document.querySelector("#task-title").value = '';
            document.querySelector("#task-description").value = '';
            document.querySelector("#task-due-date").value = '';
            document.querySelector("#task-priority").value = 'low';
        }
    } else {
        document.querySelector("#project-modal").style.display = 'block';
    }
}

export function closeModal(modalType = 'task') {
    if (modalType === 'task') {
        document.querySelector("#task-modal").style.display = 'none';
    } else {
        document.querySelector("#project-modal").style.display = 'none';
    }
    editingTask = null;
    editingProject = null;
}
