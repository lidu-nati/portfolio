// Dark Mode
const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// Color Themes
document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        const color = dot.dataset.color;
        const colors = ['purple', 'blue', 'green', 'orange'];
        colors.forEach(c => document.body.classList.remove(`${c}-theme`));
        document.body.classList.add(`${color}-theme`);
        localStorage.setItem('colorTheme', color);
    });
});

const savedColor = localStorage.getItem('colorTheme');
if (savedColor) {
    document.querySelectorAll('.color-dot').forEach(d => {
        if (d.dataset.color === savedColor) {
            d.classList.add('active');
            document.body.classList.add(`${savedColor}-theme`);
        }
    });
}

// DOM Elements
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const categorySelect = document.getElementById('categorySelect');
const tagInput = document.getElementById('tagInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterPriority = document.getElementById('filterPriority');
const filterCategory = document.getElementById('filterCategory');
const filterTag = document.getElementById('filterTag');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

// Stats
const totalNum = document.getElementById('totalNum');
const pendingNum = document.getElementById('pendingNum');
const doneNum = document.getElementById('doneNum');
const scoreVal = document.getElementById('scoreVal');

let tasks = [];
let currentFilter = 'all';

function loadTasks() {
    const saved = localStorage.getItem('todoTasks');
    if (saved) tasks = JSON.parse(saved);
    renderTasks();
    updateStats();
}

function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) { alert('Enter a task!'); return; }
    
    const tags = tagInput.value.split(',').map(t => t.trim()).filter(t => t);
    tasks.unshift({
        id: Date.now(),
        text,
        completed: false,
        priority: prioritySelect.value,
        category: categorySelect.value,
        tags
    });
    saveTasks();
    renderTasks();
    updateStats();
    updateTagFilter();
    taskInput.value = '';
    tagInput.value = '';
    taskInput.focus();
}

function toggleComplete(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
        updateTagFilter();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt('Edit task:', task.text);
    if (newText && newText.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function clearCompleted() {
    const count = tasks.filter(t => t.completed).length;
    if (count === 0) { alert('No completed tasks!'); return; }
    if (confirm(`Clear ${count} completed tasks?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateStats();
        updateTagFilter();
    }
}

function updateTagFilter() {
    const allTags = new Set();
    tasks.forEach(t => t.tags?.forEach(tag => allTags.add(tag)));
    filterTag.innerHTML = '<option value="all">All Tags</option>';
    allTags.forEach(tag => {
        filterTag.innerHTML += `<option value="${tag}">${tag}</option>`;
    });
}

function updateStats() {
    const total = tasks.length;
    const pending = tasks.filter(t => !t.completed).length;
    const done = tasks.filter(t => t.completed).length;
    const score = total > 0 ? Math.round((done / total) * 100) : 0;
    
    totalNum.textContent = total;
    pendingNum.textContent = pending;
    doneNum.textContent = done;
    scoreVal.textContent = score + '%';
}

function renderTasks() {
    let filtered = [...tasks];
    
    if (currentFilter === 'pending') filtered = filtered.filter(t => !t.completed);
    else if (currentFilter === 'completed') filtered = filtered.filter(t => t.completed);
    
    if (filterPriority.value !== 'all') {
        filtered = filtered.filter(t => t.priority === filterPriority.value);
    }
    if (filterCategory.value !== 'all') {
        filtered = filtered.filter(t => t.category === filterCategory.value);
    }
    if (filterTag.value !== 'all') {
        filtered = filtered.filter(t => t.tags?.includes(filterTag.value));
    }
    
    const search = searchInput.value.toLowerCase();
    if (search) filtered = filtered.filter(t => t.text.toLowerCase().includes(search));
    
    if (filtered.length === 0) {
        taskList.innerHTML = '<div class="empty">✨ No tasks found</div>';
        return;
    }
    
    taskList.innerHTML = filtered.map(task => {
        const priorityClass = task.priority === 'low' ? 'badge-low' : 
                             task.priority === 'medium' ? 'badge-medium' : 'badge-high';
        return `
            <div class="task-item">
                <div class="task-info" onclick="toggleComplete(${task.id})">
                    <div class="task-title ${task.completed ? 'completed' : ''}">${task.text}</div>
                    <div class="task-meta">
                        <span class="badge ${priorityClass}">${task.priority}</span>
                        <span class="badge badge-cat">${task.category}</span>
                        ${task.tags?.map(t => `<span class="badge badge-cat">#${t}</span>`).join('')}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit" onclick="editTask(${task.id})">✏️</button>
                    <button class="delete" onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

function exportTasks() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('Tasks exported!');
}

function importTasks(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            tasks = [...tasks, ...imported];
            saveTasks();
            renderTasks();
            updateStats();
            updateTagFilter();
            alert('Tasks imported!');
        } catch (err) {
            alert('Invalid file');
        }
    };
    reader.readAsText(file);
    importFile.value = '';
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });
clearCompletedBtn.addEventListener('click', clearCompleted);
exportBtn.addEventListener('click', exportTasks);
importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', importTasks);

searchInput.addEventListener('input', renderTasks);
filterPriority.addEventListener('change', renderTasks);
filterCategory.addEventListener('change', renderTasks);
filterTag.addEventListener('change', renderTasks);

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderTasks();
    });
});

loadTasks();
updateTagFilter();
