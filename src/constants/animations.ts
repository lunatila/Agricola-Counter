/**
 * Shared animation configuration constants.
 * Centralising these prevents magic numbers from being scattered across components.
 */
export const ANIMATION = {
  /** Spring config for the "press in" phase of a button tap. */
  PRESS_IN: { friction: 5, tension: 100 },

  /** Spring config for the "press out" (release) phase of a button tap. */
  PRESS_OUT: { friction: 4, tension: 80 },

  /** Spring config for content appearing on screen (hammer/pop effect). */
  CONTENT_APPEAR: { tension: 100, friction: 5 },

  /** Spring config for a result card popping in on the score screen. */
  RESULT_POP: { tension: 50, friction: 7 },

  /** Duration (ms) for content fading/shrinking when navigating away. */
  CONTENT_HIDE_MS: 200,

  /** Duration (ms) for content fading in when a screen is focused. */
  CONTENT_SHOW_MS: 300,

  /** Duration (ms) for the shared background slide animation. */
  BACKGROUND_SLIDE_MS: 600,
} as const;

/** Default scale applied to a button when pressed in. */
export const PRESS_IN_SCALE = 0.85;
