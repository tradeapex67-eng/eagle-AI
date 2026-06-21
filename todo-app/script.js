// ========================
// EAGLE TASKS - To-Do List App
// ========================

class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.editingTaskId = null;
        this.storageKey = 'eagle-tasks';
        
        this.init();
    }

    // Initialize the app
    init() {
        this.loadTasks();
        this.cacheElements();
        this.attachEventListeners();
        this.render();
        console.log('🦅 Eagle Tasks App Initialized');
    }

    // Cache DOM elements
    cacheElements() {
        this.taskInput = document.getElementById('taskInput');
        this.categorySelect = document.getElementById('categorySelect');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.tasksList = document.getElementById('tasksList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.categoryBadges = document.querySelectorAll('.category-badge');
        this.searchInput = document.getElementById('searchInput');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.deleteAllBtn = document.getElementById('deleteAllBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.confirmModal = document.getElementById('confirmModal');
        this.confirmBtn = document.getElementById('confirmBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.confirmMessage = document.getElementById('confirmMessage');
        this.notificationToast = document.getElementById('notificationToast');
    }

    // Attach event listeners
    attachEventListeners() {
        // Add task
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter tasks
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Category filter
        this.categoryBadges.forEach(badge => {
            badge.addEventListener('click', (e) => this.setCategory(e.target.dataset.category));
        });

        // Search
        this.searchInput.addEventListener('input', (e) => this.setSearch(e.target.value));

        // Action buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.deleteAllBtn.addEventListener('click', () => this.deleteAll());
        this.exportBtn.addEventListener('click', () => this.exportTasks());

        // Modal buttons
        this.confirmBtn.addEventListener('click', () => this.executeConfirmAction());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
    }

    // Add a new task
    addTask() {
        const text = this.taskInput.value.trim();
        const category = this.categorySelect.value;

        if (!text) {
            this.showNotification('Please enter a task', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            category: category,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.taskInput.focus();
        this.showNotification(`Task added to ${category}`, 'success');
        this.render();
    }

    // Toggle task completion
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
            this.render();
        }
    }

    // Delete a task
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.showNotification('Task deleted', 'success');
        this.render();
    }

    // Edit task
    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim()) {
                task.text = newText.trim();
                task.updatedAt = new Date().toISOString();
                this.saveTasks();
                this.showNotification('Task updated', 'success');
                this.render();
            }
        }
    }

    // Filter tasks
    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.render();
    }

    // Category filter
    setCategory(category) {
        this.currentCategory = category;
        this.categoryBadges.forEach(badge => badge.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        this.render();
    }

    // Search
    setSearch(term) {
        this.searchTerm = term.toLowerCase();
        this.render();
    }

    // Get filtered tasks
    getFilteredTasks() {
        let filtered = this.tasks;

        // Apply status filter
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(t => t.category === this.currentCategory);
        }

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(t => t.text.toLowerCase().includes(this.searchTerm));
        }

        return filtered;
    }

    // Clear completed tasks (with confirmation)
    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear', 'error');
            return;
        }
        this.showConfirmModal(
            `Delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`,
            () => {
                this.tasks = this.tasks.filter(t => !t.completed);
                this.saveTasks();
                this.showNotification(`${completedCount} task${completedCount > 1 ? 's' : ''} deleted`, 'success');
                this.render();
            }
        );
    }

    // Delete all tasks (with confirmation)
    deleteAll() {
        if (this.tasks.length === 0) {
            this.showNotification('No tasks to delete', 'error');
            return;
        }
        this.showConfirmModal(
            `Delete all ${this.tasks.length} task${this.tasks.length > 1 ? 's' : ''}? This cannot be undone.`,
            () => {
                const count = this.tasks.length;
                this.tasks = [];
                this.saveTasks();
                this.showNotification(`All ${count} task${count > 1 ? 's' : ''} deleted`, 'success');
                this.render();
            }
        );
    }

    // Export tasks as JSON
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `eagle-tasks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Tasks exported successfully', 'success');
    }

    // Format date
    formatDate(isoString) {
        const date = new Date(isoString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    // Get category emoji
    getCategoryEmoji(category) {
        const emojis = {
            work: '💼',
            personal: '👤',
            shopping: '🛒',
            health: '🏥',
            other: '📝'
        };
        return emojis[category] || '📝';
    }

    // Render tasks
    render() {
        const filteredTasks = this.getFilteredTasks();
        this.tasksList.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.emptyState.style.display = 'flex';
        } else {
            this.emptyState.style.display = 'none';
            filteredTasks.forEach(task => {
                const taskEl = document.createElement('div');
                taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskEl.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    <div class="task-content">
                        <div class="task-text">${this.escapeHtml(task.text)}</div>
                        <div class="task-meta">
                            <span class="task-category">${this.getCategoryEmoji(task.category)} ${task.category}</span>
                            <span class="task-date">${this.formatDate(task.createdAt)}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-edit" data-id="${task.id}">Edit</button>
                        <button class="btn-delete" data-id="${task.id}">Delete</button>
                    </div>
                `;

                // Checkbox event
                taskEl.querySelector('.task-checkbox').addEventListener('change', () => {
                    this.toggleTask(task.id);
                });

                // Edit button
                taskEl.querySelector('.btn-edit').addEventListener('click', () => {
                    this.editTask(task.id);
                });

                // Delete button
                taskEl.querySelector('.btn-delete').addEventListener('click', () => {
                    this.showConfirmModal(
                        'Delete this task?',
                        () => this.deleteTask(task.id)
                    );
                });

                this.tasksList.appendChild(taskEl);
            });
        }

        // Update stats
        this.updateStats();
    }

    // Update stats
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
    }

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    // Load tasks from localStorage
    loadTasks() {
        const stored = localStorage.getItem(this.storageKey);
        this.tasks = stored ? JSON.parse(stored) : [];
    }

    // Show confirmation modal
    showConfirmModal(message, callback) {
        this.confirmMessage.textContent = message;
        this.confirmModal.classList.add('active');
        this.confirmCallback = callback;
    }

    // Execute confirm action
    executeConfirmAction() {
        if (this.confirmCallback) {
            this.confirmCallback();
            this.confirmCallback = null;
        }
        this.closeModal();
    }

    // Close modal
    closeModal() {
        this.confirmModal.classList.remove('active');
        this.confirmCallback = null;
    }

    // Show notification
    showNotification(message, type = 'success') {
        this.notificationToast.textContent = message;
        this.notificationToast.className = `notification-toast show ${type}`;
        setTimeout(() => {
            this.notificationToast.classList.remove('show');
        }, 3000);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TodoApp();
    });
} else {
    new TodoApp();
}

console.log('🦅 Eagle Tasks - Local Storage Enabled');
console.log('All tasks are automatically saved to your browser');