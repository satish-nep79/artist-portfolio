
export const ButtonType = {
  PRIMARY: 1,
  SECONDARY: 2,
  OUTLINED: 3,
} as const;

export type ButtonType = (typeof ButtonType)[keyof typeof ButtonType];