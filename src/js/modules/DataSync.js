const CONFIG = {
    apiUrl: 'https://api.apispreadsheets.com/data/ADoZSTJj698fRxeE/',
    apiKey: 'f2654f1f7bf3c87c66f98954675fd8d6',
    secretKey: '42a1259990cbeb8ec20785137f355c3b',
    debounceDelay: 300
};

const normalizeLanguageValue = (data) => {
    if (data.language === undefined || data.language === null) {
        return data;
    }

    return {
        ...data,
        language: data.language.length ? data.language : 'en',
    };
}

export const DataSync = {
    isEnabled: true,
    debounceTimer: null,

    send(data) {
        if (!this.isEnabled) return;

        data = normalizeLanguageValue(data);

        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this._syncData(data), CONFIG.debounceDelay);
    },

    async _syncData(data) {
        if (!this.isEnabled || this._syncing) return;

        this._syncing = true;

        try {
            // console.log('Attempting update...');
            const updated = await this._tryUpdate(data);
            // console.log('Update result:', updated);

            if (updated) {
                console.log('Data synced successfully (updated)');
                return;
            }

            // console.log('Attempting create...');
            const created = await this._tryCreate(data);
            // console.log('Create result:', created);

            if (created) {
                console.log('Data synced successfully (created)');
            } else {
                console.error('Failed to sync data');
            }
        } catch (error) {
            console.error('Error syncing data:', error);
        } finally {
            this._syncing = false;
        }
    },

    async _tryUpdate(data) {
        const { userId } = data;
        const query = `select * from ADoZSTJj698fRxeE where userId='${userId}'`;

        const response = await this._makeRequest({
            data: data,
            query
        });

        return response.status === 201;
    },

    async _tryCreate(data) {
        const response = await this._makeRequest({
            data: data
        });

        return response.status === 201;
    },

    async _makeRequest(body) {
        return fetch(CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                accessKey: CONFIG.apiKey,
                secretKey: CONFIG.secretKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    },

    enable() {
        this.isEnabled = true;
    },

    disable() {
        this.isEnabled = false;
    }
};