export function init() {
    const horsey_style = document.createElement("link");
    horsey_style.rel = "stylesheet";
    horsey_style.href = "/horsey.css";
    document.head.append(horsey_style);
}

export function spawnHorsey() {
    const horsey = document.createElement("img");
    horsey.src = "images/HORSEY.avif";
    horsey.id = "horsey";
    document.body.append(horsey);

    setTimeout(() => {
        horsey.classList.add("walk");
    }, 5);

    setTimeout(() => {
        horsey.remove();
    }, 7000);
}
