// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
} else {
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        themeToggle.textContent = '🌙';
    }
});

// Color Themes
const colorDots = document.querySelectorAll('.color-dot');
colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const color = dot.classList[1];
        const colors = ['purple', 'blue', 'green', 'orange'];
        colors.forEach(c => document.body.classList.remove(`${c}-theme`));
        document.body.classList.add(`${color}-theme`);
        localStorage.setItem('colorTheme', color);
    });
});

const savedColor = localStorage.getItem('colorTheme');
if (savedColor) {
    const colors = ['purple', 'blue', 'green', 'orange'];
    colors.forEach(c => document.body.classList.remove(`${c}-theme`));
    document.body.classList.add(`${savedColor}-theme`);
}

// DOM Elements
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput = document.getElementById('dueDateInput');
const reminderTime = document.getElementById('reminderTime');
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

// Stats Elements
const scoreValSpan = document.getElementById('scoreVal');
const scoreMsg = document.getElementById('scoreMsg');
const totalNumSpan = document.getElementById('totalNum');
const pendingNumSpan = document.getElementById('pendingNum');
const doneNumSpan = document.getElementById('doneNum');
const highNumSpan = document.getElementById('highNum');
const totalFillDiv = document.getElementById('totalFill');
const pendingFillDiv = document.getElementById('pendingFill');
const doneFillDiv = document.getElementById('doneFill');
const highFillDiv = document.getElementById('highFill');

let tasks = [];
let currentFilter = 'all';

function loadTasks() {
    const savedTasks = localStorage.getItem('taskMasterData');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
    updateStatsAndCharts();
}

function saveTasks() {
    localStorage.setItem('taskMasterData', JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        alert('Please enter a task!');
        return;
    }

    const tags = tagInput.value.split(',').map(t => t.trim()).filter(t => t);

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: prioritySelect.value,
        category: categorySelect.value,
        dueDate: dueDateInput.value,
        reminderTime: reminderTime.value,
        tags: tags,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    updateStatsAndCharts();
    updateTagFilter();

    taskInput.value = '';
    dueDateInput.value = '';
    reminderTime.value = '';
    tagInput.value = '';
    taskInput.focus();
}

function deleteTask(id) {
    if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStatsAndCharts();
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

function toggleComplete(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    renderTasks();
    updateStatsAndCharts();
}

function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    if (confirm(`Clear ${completedCount} completed task(s)?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateStatsAndCharts();
        updateTagFilter();
    }
}

function updateTagFilter() {
    const allTags = new Set();
    tasks.forEach(task => {
        task.tags?.forEach(tag => allTags.add(tag));
    });
    
    filterTag.innerHTML = '<option value="all">All Tags</option>';
    allTags.forEach(tag => {
        filterTag.innerHTML += `<option value="${tag}">🏷️ ${tag}</option>`;
    });
}

function updateStatsAndCharts() {
    const total = tasks.length;
    const pending = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    
    totalNumSpan.textContent = total;
    pendingNumSpan.textContent = pending;
    doneNumSpan.textContent = completed;
    highNumSpan.textContent = highPriority;
    
    const maxVal = Math.max(total, 1);
    totalFillDiv.style.width = `${(total / maxVal) * 100}%`;
    pendingFillDiv.style.width = `${(pending / maxVal) * 100}%`;
    doneFillDiv.style.width = `${(completed / maxVal) * 100}%`;
    highFillDiv.style.width = `${(highPriority / maxVal) * 100}%`;
    
    let score = 0;
    if (total > 0) {
        score = Math.round((completed / total) * 100);
    }
    scoreValSpan.textContent = score;
    
    const ring = document.querySelector('.ring-progress');
    if (ring) {
        const circumference = 188;
        const offset = circumference - (score / 100) * circumference;
        ring.style.strokeDashoffset = offset;
    }
    
    if (score === 100) scoreMsg.textContent = '🏆 Perfect!';
    else if (score >= 75) scoreMsg.textContent = '🎉 Great job!';
    else if (score >= 50) scoreMsg.textContent = '📈 Good progress!';
    else if (score >= 25) scoreMsg.textContent = '💪 Keep going!';
    else scoreMsg.textContent = 'Add tasks to start';
}

function renderTasks() {
    let filtered = [...tasks];
    
    if (currentFilter === 'pending') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }
    
    const priorityFilter = filterPriority.value;
    if (priorityFilter !== 'all') {
        filtered = filtered.filter(t => t.priority === priorityFilter);
    }
    
    const categoryFilter = filterCategory.value;
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    const tagFilter = filterTag.value;
    if (tagFilter !== 'all') {
        filtered = filtered.filter(t => t.tags?.includes(tagFilter));
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(t => t.text.toLowerCase().includes(searchTerm));
    }
    
    if (filtered.length === 0) {
        taskList.innerHTML = '<div class="empty-state">✨ No tasks match your criteria</div>';
        return;
    }
    
    taskList.innerHTML = filtered.map(task => {
        let priorityClass = '';
        if (task.priority === 'low') priorityClass = 'badge-low';
        else if (task.priority === 'medium') priorityClass = 'badge-med';
        else priorityClass = 'badge-high';
        
        return `
            <div class="task-item">
                <div class="task-row">
                    <div class="task-info">
                        <div class="task-title ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                            ${escapeHtml(task.text)}
                        </div>
                        <div class="task-badges">
                            <span class="badge ${priorityClass}">${task.priority}</span>
                            <span class="badge badge-cat">${task.category}</span>
                            ${task.dueDate ? `<span class="badge badge-cat">📅 ${task.dueDate}</span>` : ''}
                            ${task.tags?.map(t => `<span class="badge badge-cat">🏷️ ${t}</span>`).join('')}
                        </div>
                    </div>
                    <div class="task-buttons">
                        <button class="edit-task" data-id="${task.id}">✏️</button>
                        <button class="delete-task" data-id="${task.id}">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.task-title').forEach(el => {
        el.addEventListener('click', () => toggleComplete(parseInt(el.dataset.id)));
    });
    document.querySelectorAll('.edit-task').forEach(btn => {
        btn.addEventListener('click', () => editTask(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.delete-task').forEach(btn => {
        btn.addEventListener('click', () => deleteTask(parseInt(btn.dataset.id)));
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskmaster-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('Tasks exported!');
}

function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            tasks = [...tasks, ...imported];
            saveTasks();
            renderTasks();
            updateStatsAndCharts();
            updateTagFilter();
            alert('Tasks imported!');
        } catch (error) {
            alert('Invalid file');
        }
    };
    reader.readAsText(file);
    importFile.value = '';
}

addBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompleted);
exportBtn.addEventListener('click', exportTasks);
importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', importTasks);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

searchInput.addEventListener('input', () => renderTasks());
filterPriority.addEventListener('change', () => renderTasks());
filterCategory.addEventListener('change', () => renderTasks());
filterTag.addEventListener('change', () => renderTasks());

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
