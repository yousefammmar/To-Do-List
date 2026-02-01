/**
 * Storage Manager for LocalStorage
 * Handles simulated "tables" for Users and Items (Tasks/Notes)
 */

const STORAGE_KEYS = {
    USERS: 'todo_users',
    ITEMS: 'todo_items', // tasks and notes
    CURRENT_USER: 'todo_current_user'
};

class StorageManager {
    // --- User Management ---

    static getUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    }

    static saveUser(user) {
        const users = this.getUsers();
        // Check if email exists
        if (users.some(u => u.email === user.email)) {
            throw new Error('Email already registered');
        }

        user.id = 'user_' + Date.now();
        user.createdAt = new Date().toISOString();

        users.push(user);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return user;
    }

    static authenticate(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            // Create session (store safely without password if possible, but for local basic is fine)
            const sessionUser = { ...user };
            delete sessionUser.password;

            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
            return sessionUser;
        }
        throw new Error('Invalid email or password');
    }

    static logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    }

    static updateUserProfile(userId, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);

        if (index !== -1) {
            const updatedUser = { ...users[index], ...updates };
            users[index] = updatedUser;
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

            // Update session if it's the current user
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                const sessionUser = { ...updatedUser };
                delete sessionUser.password;
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
            }
            return true;
        }
        return false;
    }

    // --- Item Management (Tasks & Notes) ---

    static getItems(userId) {
        const allItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
        return allItems.filter(item => item.userId === userId);
    }

    static addItem(item) {
        const allItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
        item.id = 'item_' + Date.now();
        item.createdAt = new Date().toISOString();
        // Default status for tasks
        if (item.type === 'task' && !item.status) {
            item.status = 'pending';
        }

        allItems.push(item);
        localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(allItems));
        return item;
    }

    static updateItem(itemId, updates) {
        const allItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
        const index = allItems.findIndex(i => i.id === itemId);

        if (index !== -1) {
            allItems[index] = { ...allItems[index], ...updates };
            localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(allItems));
            return allItems[index];
        }
        return null;
    }

    static deleteItem(itemId) {
        const allItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
        const newItems = allItems.filter(i => i.id !== itemId);
        localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(newItems));
    }
}
