const input = document.getElementById("input");
const output = document.getElementById("output");

const card = document.getElementById('card');

let startX = 0, startY = 0, deltaX = 0, deltaY = 0;


card.addEventListener('touchstart', touchStart);

function touchStart(e) {
    startX = e.clientX;
    startY = e.clientY;

    card.addEventListener('touchmove', touchMove);
    card.addEventListener("touchend", touchEnd);
}

function touchMove(e) {

    // Get deltas
    deltaX = startX - e.clientX;
    deltaY = startY - e.clientY;

    // Store new mouse position
    startX = e.clientX;
    startY = e.clientY;

    card.style.top = (card.offsetTop - deltaY) + 'px'
    card.style.left = (card.offsetLeft - deltaX) + 'px'
}

function touchEnd(e) {
    card.removeEventListener('touchmove', touchMove);
    card.removeEventListener('touchend', touchEnd);
}