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

    newTask.innerHTML = `
        <strong>${title}</strong><br>
        <em>${description}</em><br>
        <small>Due: ${dueDate} | Priority: ${priority}</small>
    `;

    const todoList = document.querySelector("#todo-list");
    todoList.appendChild(newTask);

    closeModal();
});

export function closeModal() {
    const modal = document.querySelector("#task-modal");
    modal.style.display = 'none';
}
