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

    const newTask = document.createElement("li");
    newTask.classList.add("todo");

    const taskContent = document.createElement("div");
    taskContent.innerHTML = `
        <strong>${title}</strong><br>
        <em>${description}</em><br>
        <small>Due: ${dueDate} | Priority: ${priority}</small>
    `;

    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.classList.add("delete-task");
    deleteTaskButton.textContent = 'Delete task';

    // To handle deletion of a task
    deleteTaskButton.addEventListener("click", () => {
        newTask.remove();
    })

    newTask.appendChild(taskContent);
    newTask.appendChild(deleteTaskButton);

    const todoList = document.querySelector("#todo-list");
    todoList.appendChild(newTask);

    closeModal();
});

export function closeModal() {
    const modal = document.querySelector("#task-modal");
    modal.style.display = 'none';
}
