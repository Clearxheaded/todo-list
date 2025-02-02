import { openModal, closeModal } from "./modules/ui";
import './styles.css';

document.addEventListener("DOMContentLoaded", () => {
    const newTaskButton = document.querySelector("#create-new-task");
    newTaskButton.addEventListener("click", openModal);

    const closeButton = document.querySelector("#close-modal");
    closeButton.addEventListener("click", closeModal);
});
