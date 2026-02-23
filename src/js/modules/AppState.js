import { formatLocalDate, formatKyivDate } from "../utils/dataFormatters";

export const AppState = {
    storageKey: 'appState',
    state: null,

    init() {
        this.state = this._loadState() || this._initializeState();
    },

    _initializeState() {
        const now = Date.now();
        const initialState = {
            userId: this._generateUserId(),
            createdAt: formatLocalDate(now),
            createdAtInKyiv: formatKyivDate(now),
            updatedAt: formatLocalDate(now),
            updatedAtInKyiv: formatKyivDate(now),
            data: {}
        };
        this._saveToStorage(initialState);
        return initialState;
    },

    _generateUserId() {
        return Math.random().toString(36).substring(2, 8);
    },

    _loadState() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Failed to load state:', error);
            return null;
        }
    },

    _saveToStorage(state) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    },

    set(data) {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            console.error('set() expects a plain object');
            return;
        }

        this.state.data = {
            ...this.state.data,
            ...data
        }
        this.state.updatedAt = formatLocalDate(Date.now());
        this.state.updatedAtInKyiv = formatKyivDate(Date.now())
        this._saveToStorage(this.state);
    },

    get(key) {
        return this.state.data[key];
    },

    getAll() {
        return { ...this.state };
    },

    getUserId() {
        return this.state.userId;
    },

    getCreatedAt() {
        return this.state.createdAt;
    },

    getUpdatedAt() {
        return this.state.updatedAt;
    },

    clear() {
        this.state = this._initializeState();
    }
};