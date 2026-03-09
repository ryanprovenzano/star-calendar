const card = document.getElementById('card');

let startX = 0, startY = 0, deltaX = 0, deltaY = 0;


card.addEventListener('touchstart', touchStart);

function touchStart(e) {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;

    card.addEventListener('touchmove', touchMove);
    card.addEventListener("touchend", touchEnd);
}

function touchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];

    // Get deltas
    deltaX = startX - touch.clientX;
    deltaY = startY - touch.clientY;

    // Store new mouse position
    startX = touch.clientX;
    startY = touch.clientY;

    card.style.top = (card.offsetTop - deltaY) + 'px'
    card.style.left = (card.offsetLeft - deltaX) + 'px'
}

function touchEnd(e) {
    card.removeEventListener('touchmove', touchMove);
    card.removeEventListener('touchend', touchEnd);
}