# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Star Calendar** is a minimal interactive web application featuring a draggable card element. The project is a static HTML/CSS/JavaScript site with no build system or package dependencies.

## Architecture

The application uses a simple client-side architecture with platform-specific event handling:

### Event Handling Strategy
- **Desktop**: `main_desktop.js` uses mouse events (`mousedown`, `mousemove`, `mouseup`) for dragging
- **Mobile**: `main_mobile.js` uses touch events (`touchstart`, `touchmove`, `touchend`) for dragging
- **HTML**: Loads only the mobile script; the history shows iterations between mouse and touch event approaches
- Both implementations use the same dragging logic: track starting position, calculate deltas on move, update card position via inline styles

### Key Design Patterns
- **Position Tracking**: Uses `offsetTop` and `offsetLeft` to read current position, updates via inline `style.top` and `style.left`
- **Delta Calculation**: Stores previous coordinates (`startX`, `startY`) and recalculates on each move event
- **Event Listener Lifecycle**: Listeners are attached on `down`/`start` events and removed on `up`/`end` events to prevent memory leaks and improve performance

## File Structure

| File | Purpose |
|------|---------|
| `index.html` | Entry point; minimal DOM with container and card elements |
| `main.css` | Styling for the container background and card element; sets viewport height/width to fill screen |
| `main_desktop.js` | Desktop drag handler using mouse events |
| `main_mobile.js` | Mobile drag handler using touch events |

## Development Notes

### Versioning
The project uses query string versioning (e.g., `?v=1.0.1`) on CSS and script imports in HTML. Increment this when deploying changes to bypass browser caching.

### CSS Touch Handling
The card element has `touch-action: none` to prevent default touch behaviors during dragging on mobile.

### Testing Approach
Git history shows iterative testing of event handling (switching between mouse and touch events multiple times). Use browser DevTools and physical device testing for both desktop and mobile drag interactions.

### Common Tasks
- **Update version numbers**: Change the `v=X.X.X` query strings in `index.html` when deploying
- **Test desktop dragging**: Open in a desktop browser and drag the yellow card
- **Test mobile dragging**: Open on mobile device or use browser DevTools device emulation
- **Debug event handling**: Check browser console for event listener conflicts or missing preventDefaults

## Session Log

@PROGRESS.md
