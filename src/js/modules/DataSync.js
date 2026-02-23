export const DataSync = {
    apiUrl: 'https://api.apispreadsheets.com/data/ADoZSTJj698fRxeE/',
    apiKey: 'f2654f1f7bf3c87c66f98954675fd8d6',
    secretKey: '42a1259990cbeb8ec20785137f355c3b',
    isEnabled: true,

    async send(state) {
        if (!this.isEnabled) {
            return;
        }

        const payload = {
            data: { ...state.data }
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'accessKey': this.apiKey,
                    'secretKey': this.secretKey
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 201) {
                console.log('Data synced successfully');
            } else {
                console.error('Failed to sync data:', response.status);
            }
        } catch (error) {
            console.error('Error syncing data:', error);
        }
    },

    enable() {
        this.isEnabled = true;
    },

    disable() {
        this.isEnabled = false;
    }
};