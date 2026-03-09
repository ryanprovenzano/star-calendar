const input = document.getElementById("input");
const output = document.getElementById("output");

const card = document.getElementById('card');

let startX = 0, startY = 0, deltaX = 0, deltaY = 0;


card.addEventListener('mousedown', mouseDown);

function mouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;

    card.addEventListener('mousemove', mouseMove);
    card.addEventListener("mouseup", mouseUp);
}

function mouseMove(e) {

    // Get deltas
    deltaX = startX - e.clientX;
    deltaY = startY - e.clientY;

    // Store new mouse position
    startX = e.clientX;
    startY = e.clientY;

    card.style.top = (card.offsetTop - deltaY) + 'px'
    card.style.left = (card.offsetLeft - deltaX) + 'px'
}

function mouseUp(e) {
    card.removeEventListener('mousemove', mouseMove);
    card.removeEventListener('mouseup', mouseUp);
}