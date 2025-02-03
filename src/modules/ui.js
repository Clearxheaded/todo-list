// TODO: Get familiar with the code
// Learn about localstorage API
// Add checkboxes for tasks
// Figure out editing logic for project
// Maybe add grid of squares like in github


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
        const newTask = document.createElement("li");
        newTask.classList.add("todo");

        const taskContent = document.createElement("div");
        taskContent.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox">
            <div class="task-details">
                <strong>${title}</strong><br>
                <em>${description}</em><br>
                <small>Due: ${dueDate} | Priority: ${priority}</small>
            </div>
        </div>
        `;

        const checkbox = taskContent.querySelector('.task-checkbox');
        checkbox.addEventListener('change', function () {
            newTask.classList.toggle('completed', this.checked);
        });

        const editTaskButton = document.createElement("button");
        editTaskButton.classList.add("edit-task", "icon-button");
        editTaskButton.appendChild(createIcon("M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"));
        editTaskButton.setAttribute("aria-label", "Edit task");

        editTaskButton.addEventListener("click", () => {
            document.querySelector("#task-title").value = title;
            document.querySelector("#task-description").value = description;
            document.querySelector("#task-due-date").value = dueDate;
            document.querySelector("#task-priority").value = priority;

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
        });

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');
        taskActions.appendChild(editTaskButton);
        taskActions.appendChild(deleteTaskButton);

        newTask.appendChild(taskContent);
        newTask.appendChild(taskActions);

        const todoList = document.querySelector("#todo-list");
        todoList.appendChild(newTask);
    }

    closeModal();
    editingTask = null;
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

                const projectActions = document.createElement('div');
                projectActions.classList.add('project-actions');
                projectActions.appendChild(editButton);
                projectActions.appendChild(createDeleteButton());
                newProject.appendChild(projectActions);
                projectList.appendChild(newProject);
            }
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
    }
});
