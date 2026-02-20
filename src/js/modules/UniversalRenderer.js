export const UniversalRenderer = {
    basePath: document.documentElement.lang === 'en' ? '' : '../',

    _createElement(config) {
        const element = document.createElement(config.tag);

        // Set class
        if (config.className) {
            element.className = config.className;
        }

        // Set text content
        if (config.text) {
            element.textContent = config.text;
        }

        // Set attributes
        if (config.attributes) {
            Object.entries(config.attributes).forEach(([key, value]) => {
                // Handle image src with basePath
                if (key === 'src' && !value.startsWith('http')) {
                    element.setAttribute(key, this.basePath + value);
                } else {
                    element.setAttribute(key, value);
                }
            });
        }

        // Append children
        if (config.children) {
            config.children.forEach(childConfig => {
                const child = this._createElement(childConfig);
                element.appendChild(child);
            });
        }

        return element;
    },

    render(rootSelector, elements) {
        const root = document.querySelector(rootSelector);
        const fragment = document.createDocumentFragment();

        elements.forEach((element) => {
            const createdElement = this._createElement(element);
            fragment.appendChild(createdElement);

        })

        root.prepend(fragment);
    }
}