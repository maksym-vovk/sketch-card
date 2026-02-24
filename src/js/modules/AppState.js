import { formatLocalDate, formatKyivDate } from "../utils/dataFormatters";
import {DataSync} from "./DataSync";

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

        this.state = {
            ...this.state,
            ...data,
            updatedAt: formatLocalDate(Date.now()),
            updatedAtInKyiv: formatKyivDate(Date.now())
        }
        this._saveToStorage(this.state);

        DataSync.send(this.state)
    },

    get(key) {
        return this.state[key];
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
        // this.state = this._initializeState();
        const preservedFields = {
            initial_language: this.state.initial_language,
            language: this.state.language,
            redirected_language: this.state.redirected_language,
            api_country_code: this.state.api_country_code,
            browser_lang: this.state.browser_lang
        };

        this.state = {
            ...this._initializeState(),
            ...Object.fromEntries(
                Object.entries(preservedFields).filter(([_, value]) => value !== undefined)
            )
        };

        this._saveToStorage(this.state);
    }
};