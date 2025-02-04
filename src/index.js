import { openModal, closeModal } from './modules/ui.js';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#create-new-task').addEventListener('click', () => openModal('task'));
    document.querySelector('#create-new-project').addEventListener('click', () => openModal('project'));

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.closest('.modal').id.includes('task') ? 'task' : 'project'));
    });
});