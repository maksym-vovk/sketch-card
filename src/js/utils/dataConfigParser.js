export const dataConfigParser = (configSelector) => {
    const configContainer = document.querySelector(configSelector);

    if (!configContainer) {
        console.warn(`Config container with selector "${configSelector}" not found.`);
        return null;
    }

    return JSON.parse(configContainer.dataset.config);
}