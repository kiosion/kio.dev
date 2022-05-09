if (!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
    document.addEventListener('DOMContentLoaded', () => {
        const cursor = document.querySelector(".app__cursor") as HTMLElement;
        cursor.style.display = "none";
        let xp = 0, yp = 0;
        let mouseX = 0, mouseY = 0;
        const cursorMove = () => { cursor.style.display = "block"; document.removeEventListener("mousemove", cursorMove); };
        document.addEventListener("mousemove", cursorMove);
        document.addEventListener("dragstart", (e) => { e.preventDefault(); }, false);
        document.addEventListener("dragover", (e) => { e.preventDefault(); }, false);
        document.addEventListener("contextmenu", (e) => { e.preventDefault(); }, false);
        document.addEventListener("mouseout", () => { cursor.style.display = "none"; });
        document.addEventListener("mouseover", () => { cursor.style.display = "block"; });
        document.addEventListener("mousedown", () => { cursor.classList.add('cursor-click'); });
        document.addEventListener("mouseup", () => { cursor.classList.remove('cursor-click'); cursor.classList.remove('cursor-hover') });
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        // Update loop
        setInterval(() => {
            xp += ((mouseX - xp)/6);
            yp += ((mouseY - yp)/6);
            cursor.style.left = xp + "px";
            cursor.style.top = yp + "px";
        }, 6);
    });
}
