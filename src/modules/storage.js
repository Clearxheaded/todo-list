// storage.js

// Keys for localStorage
const STORAGE_KEYS = {
    TASKS: 'tasks',
    PROJECTS: 'projects',
};

// Save data to localStorage
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Load data from localStorage
function loadFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Clear all data (optional, for debugging)
function clearStorage() {
    localStorage.clear();
}

// Save tasks
export function saveTasks(tasks) {
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
}

// Load tasks
export function loadTasks() {
    return loadFromStorage(STORAGE_KEYS.TASKS) || [];
}

// Save projects
export function saveProjects(projects) {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
}

// storage.js
export function loadProjects() {
    const projects = loadFromStorage(STORAGE_KEYS.PROJECTS);
    // Handle legacy format if needed
    if (projects && projects[0] && projects[0].name) {
        return projects;
    }
    return [];
}