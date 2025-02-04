const STORAGE_KEYS = {
    TASKS: 'tasks',
    PROJECTS: 'projects',
    ACTIVE_PROJECT: 'activeProject',
    THEME: 'theme'
};

// Tasks
export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function loadTasks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
}

// Projects
export function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

export function loadProjects() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS)) || [];
}

// Active Project
export function saveActiveProject(projectName) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, projectName);
}

export function loadActiveProject() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT) || 'Inbox';
}

// Theme
export function saveThemePreference(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function loadThemePreference() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}