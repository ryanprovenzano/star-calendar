# Progress Log

---

## 2026-04-06 — v2.2.2

### UI: Desktop tabs grow to fit content

**Problem:** Tabs on desktop had a fixed `max-width: 80px`, causing longer names to be truncated with ellipsis even when there was plenty of screen space.

**Fix:** Removed `max-width` and `overflow` constraints from `.tab` by default. Re-applied them specifically for touch devices using `@media (pointer: coarse)` to maintain a compact layout on mobile.

**Key change:** `main.css` — `.tab` styling; `index.html` — version bump

---

## 2026-04-06 — v2.2.1

### Bug Fix: Desktop tab renaming (dblclick)

**Problem:** Double-clicking a tab to rename it on desktop was failing. The first click was triggering a full `renderTabs()` which rebuilt the button elements, causing the second click to land on a new element and preventing the `dblclick` event from firing.

**Fix:** Added an early return in the tab `click` listener if the clicked tab is already the `selectedTab`. This avoids redundant re-renders and preserves the DOM element, allowing the `dblclick` event to proceed naturally.

**Key change:** `main.js` — `renderTabs` click listener; `index.html` — version bump

---

## 2026-04-06 — v2.2.0

### UI: Highlight current day in calendar

**Problem:** It was hard to distinguish which day was "today" at a glance unless it was the selected one.

**Fix:**
- Added `today` class to the current day's slot in `main.js`.
- Styled `.day-slot.today` in `main.css` with a more opaque background (`rgba(255, 255, 255, 0.25)`) to make it stand out from other slots.
- Incremented CSS and JS versions to `v2.2.0` in `index.html`.

**Key change:** `main.js` — `renderCalendar` loop; `main.css` — `.day-slot.today`; `index.html` — version bump

---

## 2026-04-06 — v2.1.9

### Feature: Smart reticle on month switch

**Problem:** Switching months would leave the reticle on the same day number (e.g., the 10th) even if the user had moved to a different month where that day isn't what they intended to interact with, or it would just stay on a date that doesn't exist in the current view.

**Fix:**
- Added `updateSelectionForMonth()` helper.
- When navigating months, the reticle now automatically selects today's date if the target month is the current real-world month.
- If navigating to any other month, the reticle is cleared (unselected).
- Incremented CSS and JS versions to `v2.1.9` in `index.html`.

**Key change:** `main.js` — `updateSelectionForMonth` and navigation listeners; `index.html` — version bump

---

## 2026-04-06 — v2.1.8

### Feature: Default selection to today's date

**Problem:** Opening the calendar resulted in no day being selected, requiring a manual click before stars could be earned or cleared.

**Fix:**
- Updated Init section in `main.js` to set `state.selectedDate` to today's date on startup using `dateKey()`.
- Incremented CSS and JS versions to `v2.1.8` in `index.html`.

**Key change:** `main.js` — `Init` block; `index.html` — version bump

---

## 2026-04-06 — v2.1.7

### UI: Smoother star bar decay and reduced threshold

**Problem:** The star bar decay felt chunky (once every 2s) and requiring 20 clicks felt slightly too high for a quick interaction.

**Fix:**
- Increased decay frequency to 30fps (33ms interval) for a smoother "bleeding" effect.
- Adjusted decay rate to ~1 unit per second (`-0.033` per tick).
- Reduced `state.meter.max` from 20 to 16 (a 20% reduction) to make earning stars faster.
- Incremented CSS and JS versions to `v=2.1.7` in `index.html`.

**Key change:** `main.js` — `state.meter.max`, `startDecay`; `index.html` — version bump

---

## 2026-04-06 — v2.1.6

### UI: Star scaling relative to day slot size

**Problem:** The star in the day slot had a fixed `1.4rem` font size, which didn't adapt well to different screen sizes or orientations.

**Fix:**
- Added `container-type: size` to `.day-slot` to enable container queries.
- Set `.star-in-slot` `font-size` to `50cqmin`, ensuring the star always scales to 50% of its container's smallest dimension.
- Adjusted `starWiggle` duration from `3s` to `2.5s` for a slightly more energetic idle animation.

**Key change:** `main.css` — `.day-slot`, `.star-in-slot` (font-size and animation duration)

---

## 2026-04-06 — v2.1.5

### Bug Fix: Animation resets on multiple clicks

**Problem:** Clicking the star button while a star animation is already in progress would trigger the animation again, causing it to reset.

**Fix:** Added `state.meter.isEarning` flag to track when an animation is in progress. The star button is now disabled immediately when `triggerStarEarned` starts and is only re-enabled (if applicable) when the animation finishes. The click listener also checks this flag for robustness.

**Key change:** `main.js` — `state` definition, `updateControls`, `triggerStarEarned`, `starBtn` listener

---

## 2026-04-06 — v2.1.4

### UI: Update horizontal background and version bump

**Change:**
- Added landscape media query to use `website-background-horizontal.png` for `#bg`.
- Incremented CSS and JS versions to `v=2.1.4` in `index.html`.

---

## 2026-04-06 — v2.1.3

### UI: Update website background and version bump

**Change:**
- Replaced `#bg` linear-gradient with `website-background.png`.
- Background set to `no-repeat center center` and `background-size: cover`.
- Incremented CSS and JS versions to `v=2.1.3` in `index.html` to force browser cache busting.

---

## 2026-04-06 — v2.1.2

### Bug Fix: Mobile portrait — enforce square calendar slots

**Problem:** `#calendar` had `flex-grow: 1`, stretching to fill the full screen height and making day slots tall rectangles in portrait. The star/meter/✕ controls were pinned to the bottom with no breathing room.

**Fix:**
- Portrait media query: `#calendar { flex-grow: 0 }` so the calendar sizes to content only
- `#day-grid { grid-auto-rows: calc((100vw - 16px) / 7) }` — row height = column width → square slots
- `#controls { flex-grow: 1 }` — fills remaining screen space; `align-items: center` (already set) vertically centres the controls in that space

---

### Bug Fix: Mobile landscape — starred slots taller than empty slots

**Problem:** `.star-in-slot` was in normal flow. Rows containing a star sized to the star's height (`1.4rem`); empty rows got the leftover space. This made starred slots visibly taller and uneven.

**Fix:** Made `.star-in-slot` `position: absolute` (matching `.day-number`). Now it has zero impact on row sizing; all rows get equal height from `align-content: stretch`. Updated `@keyframes starWiggle` to include `translate(-50%, -50%)` so the absolute-centred star still wiggles correctly.

---

### Layout: Landscape calendar narrowed to 80% screen width

**Problem:** In landscape the calendar spanned full screen width, making the 7-column slots very wide and short (non-square).

**Fix:** Landscape media query: `#app { left: 10%; right: 10% }` — overrides `inset: 0` to constrain the app to 80% of screen width, centred, giving slots a better aspect ratio.

---

### Bug Fix: Tab switch doesn't reset meter — one-tap earn on new tab

**Problem:** After completing a star animation the meter stays at `max` (20). Switching tabs didn't reset it. The newly-selected day on the new tab has no star, so the star button is enabled. One tap adds 1 → value hits 21 ≥ 20 → `triggerStarEarned` fires immediately.

**Fix:** Added `stopDecay()` + meter/gradient reset inside the tab click handler in `renderTabs`, mirroring what the month-navigation buttons already do.

**Key change:** `main.js` — `renderTabs` tab click handler

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
