import { openModal, closeModal } from "./modules/ui.js";
import './styles.css';

document.addEventListener("DOMContentLoaded", () => {
    const newTaskButton = document.querySelector("#create-new-task");
    const closeButton = document.querySelector("#close-modal");

    newTaskButton.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);
});

// Toggle dark mode
document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme',
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
});
