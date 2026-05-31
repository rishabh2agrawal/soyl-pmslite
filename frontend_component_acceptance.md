# SOYL Lite PMS - Component Acceptance Checklist

Use this as the definition-of-done for every reusable UI component.

---

## 1) Visual + UX
- Fits the design tokens (colors, radius, spacing, type scale).
- 48x48 minimum touch target for interactive elements.
- Clear hover / pressed / focus / disabled states.
- Works on 360px width without overflow.

---

## 2) i18n
- All strings via i18n keys.
- Handles longer Hindi/Kannada text without truncation.
- Uses locale-aware number and date formatting.

---

## 3) Accessibility
- Keyboard operable (tab, enter, escape).
- Focus ring visible and consistent.
- ARIA labels present for icon-only controls.
- Screen-reader labels for form inputs.

---

## 4) States
- Loading state (skeleton or spinner).
- Empty state with CTA.
- Error state with retry or guidance.

---

## 5) Offline Behavior
- Graceful fallback if data is stale.
- Shows pending sync badge where relevant.

---

## 6) Testing
- Manually tested on mobile and desktop.
- Verified in EN/HI/KN.
- Verified in offline mode (where applicable).
