# Progress Log

---

## 2026-04-06 — v2.1.1

### Bug Fix: Meter not resetting on day switch / one-tap earn

**Problem:** `state.meter.value` was global and never reset when selecting a different day slot. If you'd tapped the star button N times on day A, switching to day B would leave the meter at N. One more tap could immediately trigger `triggerStarEarned`, earning the star with a single press.

**Fix:** In `onDayClick` (`main.js`), before calling `renderCalendar()`, check if the newly selected key differs from the previous one. If so, and if the new day has no star, stop the decay timer and zero out `state.meter.value` / gradient.

**Key change:** `main.js` — `onDayClick`

---

### Bug Fix: Star appears in slot before animation finishes

**Problem:** `tab.stars[state.selectedDate] = true` was called at the top of `triggerStarEarned`, before the spiral animation ran. Clicking any other day during the ~2.2s animation triggered `renderCalendar()` which saw the star already saved and rendered it prematurely.

**Fix:** Moved `tab.stars[earnedKey] = true` and `saveData()` into `anim.onfinish`. Captured `earnedKey = state.selectedDate` at trigger time so the correct day is starred even if the user navigates away mid-animation. Controls (meter display, button states) are only updated in `onfinish` when `state.selectedDate === earnedKey`.

**Key change:** `main.js` — `triggerStarEarned`

---

### Feature: Tab long-press rename (mobile)

**Problem / Request:** Double-click to rename tabs only works on desktop. No touch equivalent existed.

**Implementation:** Added `touchstart` → `setTimeout(600ms)` long-press detection on each tab button in `renderTabs`. Touching and moving cancels the timer. On `touchend`, calls `e.preventDefault()` when a long-press completed so the tap-click doesn't also fire (which would switch the tab instead of just renaming). Desktop `dblclick` rename is unchanged.

**Key change:** `main.js` — `renderTabs`

---

### Feature: Spiral swirl animation for flying star

**Problem / Request:** The flying star previously traveled in a straight line from a random screen edge to the target slot. Request was for it to start from outside the screen, swirl in a circular spiral, and land on the destination.

**Implementation:** Replaced the two-keyframe straight-line `animate()` call with 31 computed keyframes forming an inward spiral:
- `initialRadius = 0.8 * max(viewportWidth, viewportHeight)` — ensures the star starts off-screen
- `startAngle` — random each time for visual variety
- `rotations = 1.75` — star completes 1¾ full orbits before landing
- Radius shrinks via `Math.pow(1 - t, 1.5)` (accelerates inward near the end)
- Star size: 3.2rem → 1.6rem as it approaches
- Star self-rotates 540° during flight (`transform: translate(-50%,-50%) rotate(Ndeg)`)
- Fades in during first 8% of animation (appears mid-orbit rather than popping in)
- Duration increased from 1200ms → 2200ms

**Key change:** `main.js` — `triggerStarEarned`
