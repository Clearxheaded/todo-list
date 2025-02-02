let editingTask = null;
const saveDataButton = document.querySelector('#save-task');
const modalTitle = document.querySelector("#task-modal h2");

saveDataButton.addEventListener("click", () => {
    const title = document.querySelector("#task-title").value;
    const description = document.querySelector("#task-description").value;
    const dueDate = document.querySelector("#task-due-date").value;
    const priority = document.querySelector("#task-priority").value;

    if (!title || !description || !dueDate || !priority) {
        alert("Please fill out all fields before saving.");
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
            <strong>${title}</strong><br>
            <em>${description}</em><br>
            <small>Due: ${dueDate} | Priority: ${priority}</small>
        `;

        const editTaskButton = document.createElement("button");
        editTaskButton.classList.add("edit-task");
        editTaskButton.textContent = "Edit Task";

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
        deleteTaskButton.classList.add("delete-task");
        deleteTaskButton.textContent = 'Delete Task';

        deleteTaskButton.addEventListener("click", () => {
            newTask.remove();
        });

        newTask.appendChild(taskContent);
        newTask.appendChild(editTaskButton);
        newTask.appendChild(deleteTaskButton);

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
