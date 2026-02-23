export function formatToCustomString(date, timeZone) {
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
}

export function formatLocalDate(timestamp) {
    const date = new Date(timestamp);
    return formatToCustomString(date);
}

export function formatKyivDate(timestamp) {
    const date = new Date(timestamp);
    return formatToCustomString(date, 'Europe/Kiev');
}