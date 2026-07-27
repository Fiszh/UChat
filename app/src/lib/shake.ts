export function shake(element: HTMLElement) {
    if (!element) return;
    element.classList.remove("shake");
    void element.offsetWidth;
    element.classList.add("shake");
}
