const card = document.getElementById('card');

let newX = 0, newY = 0, oldX = 0, oldY = 0;


card.addEventListener('touchstart', touchStart);
card.addEventListener("touchend", touchEnd);

function touchStart(e) {
    startX = e.screenX;
    startY = e.screenY;

    card.addEventListener('touchmove', touchMove);
}

function touchMove(e) {

    // Get deltas
    deltaX = startX - e.screenX;
    deltaY = startY - e.screenY;

    // Store new mouse position
    startX = e.screenX;
    startY = e.screenY;

    card.style.top = (card.offsetTop - newY) + 'px';
    card.style.left = (card.offsetLeft - newX) + 'px';
}

function touchEnd(e) {
    card.removeEventListener('touchmove', touchMove);
}