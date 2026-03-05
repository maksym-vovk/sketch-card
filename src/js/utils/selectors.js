export function addModifierClass(elementSelector, modifier) {
    const element = document.querySelector(`${elementSelector}`);
    if (!element) return;
    element.classList.add(`${element.classList[0]}--${modifier}`);
}

export function removeModifierClass(elementSelector, modifier) {
    const element = document.querySelector(`${elementSelector}`);
    if (!element) return;
    element.classList.remove(`${element.classList[0]}--${modifier}`);
}