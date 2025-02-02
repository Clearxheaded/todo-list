let editingTask = null;

export function openModal() {
    const modal = document.querySelector("#task-modal");
    modal.style.display = 'block';
}

const saveDataButton = document.querySelector('#save-task');
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
            const taskTitle = newTask.querySelector("strong").textContent;
            const taskDescription = newTask.querySelector("em").textContent;
            const taskDueDate = newTask.querySelector("small").textContent.split("|")[0].trim();
            const taskPriority = newTask.querySelector("small").textContent.split("|")[1].trim();

            document.querySelector("#task-title").value = taskTitle;
            document.querySelector("#task-description").value = taskDescription;
            document.querySelector("#task-due-date").value = taskDueDate;
            document.querySelector("#task-priority").value = taskPriority;

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

export function closeModal() {
    const modal = document.querySelector("#task-modal");
    modal.style.display = 'none';
}
