// ── State ────────────────────────────────────────────────────────────────────

const now = new Date();

const state = {
    year: now.getFullYear(),
    currentMonth: now.getMonth(),
    selectedDate: null,
    selectedTab: 0,
    tabs: [
        { id: 0, name: 'Tab 1', stars: {} },
        { id: 1, name: 'Tab 2', stars: {} },
        { id: 2, name: 'Tab 3', stars: {} },
    ],
    meter: {
        value: 0,
        max: 20,
        gradient: null,
        decayTimer: null,
    },
};

// ── localStorage ──────────────────────────────────────────────────────────────

function saveData() {
    localStorage.setItem('starCalendar', JSON.stringify({
        year: state.year,
        tabs: state.tabs,
    }));
}

function loadData() {
    const raw = localStorage.getItem('starCalendar');
    if (!raw) return;
    try {
        const saved = JSON.parse(raw);
        const currentYear = new Date().getFullYear();
        if (saved.year !== currentYear) {
            // Year rollover — clear all stars
            return;
        }
        // Merge saved tabs (preserve names and stars)
        saved.tabs.forEach((savedTab) => {
            const tab = state.tabs.find(t => t.id === savedTab.id);
            if (tab) {
                tab.name = savedTab.name;
                tab.stars = savedTab.stars || {};
            } else {
                state.tabs.push(savedTab);
            }
        });
    } catch (e) {
        // Ignore corrupt data
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function dateKey(year, month, day) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}

function currentTab() {
    return state.tabs[state.selectedTab];
}

function randomGradient() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 40 + Math.floor(Math.random() * 80)) % 360;
    return `linear-gradient(90deg, hsl(${hue1},90%,55%), hsl(${hue2},90%,60%))`;
}

function randomColor() {
    const colors = ['#f55', '#5f5', '#55f', '#ff5', '#f5f', '#5ff', '#fa0', '#0af'];
    return colors[Math.floor(Math.random() * colors.length)];
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// ── DOM refs ──────────────────────────────────────────────────────────────────

const monthTitle    = document.getElementById('month-title');
const prevMonthBtn  = document.getElementById('prev-month');
const nextMonthBtn  = document.getElementById('next-month');
const tabsBar       = document.getElementById('tabs-bar');
const dayGrid       = document.getElementById('day-grid');
const starBtn       = document.getElementById('star-btn');
const clearBtn      = document.getElementById('clear-btn');
const meterFill     = document.getElementById('meter-fill');
const confettiLayer = document.getElementById('confetti-layer');
const flyingStar    = document.getElementById('flying-star');
const confirmOverlay = document.getElementById('confirm-overlay');
const confirmYes    = document.getElementById('confirm-yes');
const confirmNo     = document.getElementById('confirm-no');

// ── Render: Tabs ──────────────────────────────────────────────────────────────

function renderTabs() {
    tabsBar.innerHTML = '';
    state.tabs.forEach((tab, i) => {
        const el = document.createElement('button');
        el.className = 'tab' + (i === state.selectedTab ? ' active' : '');
        el.textContent = tab.name;
        el.title = tab.name;
        el.addEventListener('click', () => {
            state.selectedTab = i;
            renderTabs();
            renderCalendar();
            updateControls();
        });
        el.addEventListener('dblclick', () => {
            const newName = prompt('Rename tab:', tab.name);
            if (newName && newName.trim()) {
                tab.name = newName.trim();
                saveData();
                renderTabs();
            }
        });

        // Long-press to rename on touch devices
        let pressTimer = null;
        let longPressed = false;
        el.addEventListener('touchstart', () => {
            longPressed = false;
            pressTimer = setTimeout(() => {
                longPressed = true;
                const newName = prompt('Rename tab:', tab.name);
                if (newName && newName.trim()) {
                    tab.name = newName.trim();
                    saveData();
                    renderTabs();
                }
            }, 600);
        }, { passive: true });
        el.addEventListener('touchend', (e) => {
            clearTimeout(pressTimer);
            if (longPressed) e.preventDefault();
        }, { passive: false });
        el.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        }, { passive: true });
        tabsBar.appendChild(el);
    });

    if (state.tabs.length < 6) {
        const addBtn = document.createElement('button');
        addBtn.id = 'add-tab';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
            const id = Date.now();
            state.tabs.push({ id, name: `Tab ${state.tabs.length + 1}`, stars: {} });
            state.selectedTab = state.tabs.length - 1;
            saveData();
            renderTabs();
            renderCalendar();
            updateControls();
        });
        tabsBar.appendChild(addBtn);
    }
}

// ── Render: Calendar ──────────────────────────────────────────────────────────

function renderCalendar() {
    const { currentMonth, year } = state;
    monthTitle.textContent = `${MONTH_NAMES[currentMonth]} ${year}`;

    dayGrid.innerHTML = '';

    const firstWeekday = new Date(year, currentMonth, 1).getDay();
    const totalDays = new Date(year, currentMonth + 1, 0).getDate();

    // Padding cells
    for (let i = 0; i < firstWeekday; i++) {
        const pad = document.createElement('div');
        pad.className = 'day-slot empty-pad';
        dayGrid.appendChild(pad);
    }

    const tab = currentTab();

    for (let d = 1; d <= totalDays; d++) {
        const key = dateKey(year, currentMonth, d);
        const hasStar = !!tab.stars[key];
        const isSelected = state.selectedDate === key;

        const slot = document.createElement('div');
        slot.className = 'day-slot' +
            (hasStar ? ' has-star' : '') +
            (isSelected ? ' selected' : '');
        slot.dataset.key = key;

        const num = document.createElement('span');
        num.className = 'day-number';
        num.textContent = d;
        slot.appendChild(num);

        const star = document.createElement('span');
        star.className = 'star-in-slot';
        star.textContent = '★';
        slot.appendChild(star);

        slot.addEventListener('click', () => onDayClick(key));
        dayGrid.appendChild(slot);
    }
}

function getSlotElement(key) {
    return dayGrid.querySelector(`.day-slot[data-key="${key}"]`);
}

// ── Day click ─────────────────────────────────────────────────────────────────

function onDayClick(key) {
    const prevKey = state.selectedDate;
    state.selectedDate = key;

    // Reset meter when switching to a different day that hasn't earned a star
    if (key !== prevKey) {
        const tab = currentTab();
        if (!tab.stars[key]) {
            stopDecay();
            state.meter.value = 0;
            state.meter.gradient = null;
            meterFill.style.background = '';
        }
    }

    renderCalendar();
    updateControls();
}

// ── Meter & Controls ──────────────────────────────────────────────────────────

function updateControls() {
    const { selectedDate } = state;
    const tab = currentTab();

    if (!selectedDate) {
        starBtn.disabled = true;
        clearBtn.disabled = true;
        setMeterDisplay(state.meter.value);
        return;
    }

    const hasStar = !!tab.stars[selectedDate];
    if (hasStar) {
        starBtn.disabled = true;
        clearBtn.disabled = false;
        setMeterDisplay(state.meter.max);
    } else {
        starBtn.disabled = false;
        clearBtn.disabled = true;
        setMeterDisplay(state.meter.value);
    }
}

function setMeterDisplay(value) {
    const pct = (value / state.meter.max) * 100;
    meterFill.style.width = pct + '%';
    if (state.meter.gradient) {
        meterFill.style.background = state.meter.gradient;
    }
}

// ── Meter Decay ───────────────────────────────────────────────────────────────

function startDecay() {
    if (state.meter.decayTimer !== null) return;
    state.meter.decayTimer = setInterval(() => {
        if (state.meter.value <= 0) {
            stopDecay();
            state.meter.gradient = null;
            meterFill.style.background = '';
            return;
        }
        state.meter.value -= 1;
        setMeterDisplay(state.meter.value);
    }, 2000);
}

function stopDecay() {
    if (state.meter.decayTimer !== null) {
        clearInterval(state.meter.decayTimer);
        state.meter.decayTimer = null;
    }
}

// ── Star Button ───────────────────────────────────────────────────────────────

starBtn.addEventListener('click', () => {
    if (!state.selectedDate) return;
    const tab = currentTab();
    if (tab.stars[state.selectedDate]) return;

    if (!state.meter.gradient) {
        state.meter.gradient = randomGradient();
        meterFill.style.background = state.meter.gradient;
    }

    state.meter.value += 1;
    setMeterDisplay(state.meter.value);

    if (state.meter.decayTimer === null) {
        startDecay();
    }

    if (state.meter.value >= state.meter.max) {
        triggerStarEarned();
    }
});

// ── Star Earned ───────────────────────────────────────────────────────────────

function triggerStarEarned() {
    stopDecay();

    const tab = currentTab();
    tab.stars[state.selectedDate] = true;
    saveData();

    spawnConfetti();

    // Get target slot position before re-render
    const slot = getSlotElement(state.selectedDate);
    const rect = slot ? slot.getBoundingClientRect() : null;
    const targetX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const targetY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    // Build spiral keyframes: orbit target from off-screen, tightening each loop
    const numKF = 30;
    const initialRadius = Math.max(window.innerWidth, window.innerHeight) * 0.8;
    const startAngle = Math.random() * Math.PI * 2;
    const rotations = 1.75; // full circles before landing

    const keyframes = [];
    for (let i = 0; i <= numKF; i++) {
        const t = i / numKF;
        const radius = initialRadius * Math.pow(1 - t, 1.5);
        const angle = startAngle + t * rotations * Math.PI * 2;
        const x = targetX + radius * Math.cos(angle);
        const y = targetY + radius * Math.sin(angle);
        const size = 1.6 + 1.6 * (1 - t); // 3.2rem far → 1.6rem at landing
        const spin = t * 540; // 1.5 rotations of the star itself
        keyframes.push({
            left: x + 'px',
            top: y + 'px',
            fontSize: size + 'rem',
            transform: `translate(-50%, -50%) rotate(${spin}deg)`,
            opacity: t < 0.08 ? t / 0.08 : 1,
            offset: t,
        });
    }

    flyingStar.style.display = 'block';

    const anim = flyingStar.animate(keyframes, {
        duration: 2200,
        easing: 'linear',
        fill: 'forwards',
    });

    anim.onfinish = () => {
        flyingStar.style.display = 'none';
        renderCalendar();
        // Keep meter full to show earned state
        setMeterDisplay(state.meter.max);
        starBtn.disabled = true;
        clearBtn.disabled = false;
    };
}

// ── Confetti ──────────────────────────────────────────────────────────────────

function spawnConfetti() {
    confettiLayer.innerHTML = '';
    for (let i = 0; i < 80; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-particle';
        el.style.left = Math.random() * 100 + 'vw';
        el.style.background = randomColor();
        el.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        el.style.animationDelay = Math.random() * 0.5 + 's';
        confettiLayer.appendChild(el);
    }
    setTimeout(() => { confettiLayer.innerHTML = ''; }, 4000);
}

// ── Clear Button ──────────────────────────────────────────────────────────────

clearBtn.addEventListener('click', () => {
    if (!state.selectedDate) return;
    const tab = currentTab();
    if (!tab.stars[state.selectedDate]) return;
    confirmOverlay.classList.add('visible');
});

confirmYes.addEventListener('click', () => {
    const tab = currentTab();
    delete tab.stars[state.selectedDate];
    saveData();
    confirmOverlay.classList.remove('visible');

    // Reset meter
    stopDecay();
    state.meter.value = 0;
    state.meter.gradient = null;
    meterFill.style.background = '';

    renderCalendar();
    updateControls();
});

confirmNo.addEventListener('click', () => {
    confirmOverlay.classList.remove('visible');
});

// ── Month Navigation ──────────────────────────────────────────────────────────

prevMonthBtn.addEventListener('click', () => {
    if (state.currentMonth === 0) {
        state.currentMonth = 11;
        state.year -= 1;
    } else {
        state.currentMonth -= 1;
    }
    stopDecay();
    state.meter.value = 0;
    state.meter.gradient = null;
    meterFill.style.background = '';
    renderCalendar();
    updateControls();
});

nextMonthBtn.addEventListener('click', () => {
    if (state.currentMonth === 11) {
        state.currentMonth = 0;
        state.year += 1;
    } else {
        state.currentMonth += 1;
    }
    stopDecay();
    state.meter.value = 0;
    state.meter.gradient = null;
    meterFill.style.background = '';
    renderCalendar();
    updateControls();
});

// ── Init ──────────────────────────────────────────────────────────────────────

loadData();
renderTabs();
renderCalendar();
updateControls();
