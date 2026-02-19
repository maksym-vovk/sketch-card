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
            createdAt: this._formatLocalDate(now),
            createdAtInKyiv: this._formatKyivDate(now),
            updatedAt: this._formatLocalDate(now),
            updatedAtInKyiv: this._formatKyivDate(now),
            data: {}
        };
        this._saveToStorage(initialState);
        return initialState;
    },

    _generateUserId() {
        return Math.random().toString(36).substring(2, 8);
    },

    _formatLocalDate(timestamp) {
        const date = new Date(timestamp);
        return this._formatToCustomString(date);
    },

    _formatKyivDate(timestamp) {
        const date = new Date(timestamp);
        return this._formatToCustomString(date, 'Europe/Kiev');
    },

    _formatToCustomString(date, timeZone) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        if (timeZone) {
            options.timeZone = timeZone;
        }

        const formatted = new Intl.DateTimeFormat('en-GB', options).format(date);
        return formatted.replace(/\//g, '.').replace(',', ',');
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

    set(key, value) {
        this.state.data[key] = value;
        this.state.updatedAt = Date.now();
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