const ButtonType = {
    PRIMARY: 1,
    SECONDARY: 2,
    OUTLINED: 3
} as const;

type ButtonType = typeof ButtonType[keyof typeof ButtonType];

export default ButtonType