/**
 * Main Application Logic
 * Handles Dashboard: Adding, listing, updating, deleting tasks and notes
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = StorageManager.getCurrentUser();
    if (!user) return; // Should be handled by auth.js check, but safety first

    const taskAPI = {
        add: document.getElementById('addTaskForm'),
        list: document.getElementById('tasks-container'),
        input: document.getElementById('taskInput')
    };

    const noteAPI = {
        add: document.getElementById('addNoteForm'),
        list: document.getElementById('notesList'),
        input: document.getElementById('noteInput')
    };

    // --- Render Functions ---

    function loadData() {
        const items = StorageManager.getItems(user.id);

        // Filter Tasks (Pending/In Progress)
        const tasks = items.filter(i => i.type === 'task' && i.status !== 'completed' && i.status !== 'done');
        // Sort by newest
        tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        renderTasks(tasks);

        // Filter Notes
        const notes = items.filter(i => i.type === 'note');
        notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        renderNotes(notes);
    }

    function renderTasks(tasks) {
        if (!taskAPI.list) return;

        if (tasks.length === 0) {
            taskAPI.list.innerHTML = '<p class="placeholder">No tasks yet. Add a task to get started!</p>';
            return;
        }

        taskAPI.list.innerHTML = `<ul class="task-list">
            ${tasks.map(task => `
                <li class="task-item">
                    <div class="task-content">
                        <div class="task-text">
                            <span contenteditable="true" 
                                  onblur="updateTaskContent('${task.id}', this.innerText)" 
                                  class="editable-content">${escapeHtml(task.content)}</span>
                            <span class="task-date">${new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span class="status-badge ${getStatusClass(task.status)}">${formatStatus(task.status)}</span>
                    </div>
                    <div class="task-actions">
                        <button onclick="updateTaskStatus('${task.id}', '${getNextStatus(task.status)}')" class="btn btn-info btn-sm">
                            ${isPending(task.status) ? 'Start' : 'Mark Done'}
                        </button>
                        <button onclick="deleteItem('${task.id}')" class="btn btn-danger btn-sm">Delete</button>
                    </div>
                </li>
            `).join('')}
        </ul>`;
    }

    function renderNotes(notes) {
        if (!noteAPI.list) return;

        if (notes.length === 0) {
            noteAPI.list.innerHTML = '<li class="placeholder">No notes yet.</li>';
            return;
        }

        noteAPI.list.innerHTML = notes.map(note => `
            <li>
                <span>${escapeHtml(note.content)}</span>
                <button class="btn btn-danger btn-sm" onclick="deleteItem('${note.id}')">Delete</button>
            </li>
        `).join('');
    }

    // --- Helpers ---

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function getStatusClass(status) {
        if (status === 'in_progress' || status === 'in progress') return 'status-in-progress';
        return 'status-pending';
    }

    function formatStatus(status) {
        if (status === 'in_progress' || status === 'in progress') return 'In Progress';
        return 'Pending';
    }

    function getNextStatus(current) {
        if (current === 'pending') return 'in_progress';
        return 'completed';
    }

    function isPending(status) {
        return status === 'pending' || !status;
    }

    // --- Event Listeners ---

    if (taskAPI.add) {
        taskAPI.add.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = taskAPI.input.value.trim();
            if (content) {
                StorageManager.addItem({
                    userId: user.id,
                    type: 'task',
                    content: content,
                    status: 'pending'
                });
                taskAPI.input.value = '';
                loadData();
            }
        });
    }

    if (noteAPI.add) {
        noteAPI.add.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = noteAPI.input.value.trim();
            if (content) {
                StorageManager.addItem({
                    userId: user.id,
                    type: 'note',
                    content: content
                });
                noteAPI.input.value = '';
                loadData();
            }
        });
    }

    // --- Global Actions (exposed for onclick) ---

    window.deleteItem = (id) => {
        if (confirm('Are you sure?')) {
            StorageManager.deleteItem(id);
            loadData();
        }
    };

    window.updateTaskStatus = (id, status) => {
        StorageManager.updateItem(id, { status: status });
        loadData();
    };

    window.updateTaskContent = (id, content) => {
        StorageManager.updateItem(id, { content: content });
        // No reload needed as it is editable in place
    };

    // Initial Load
    loadData();
});
