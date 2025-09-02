export const passwordLimits = {
    min: 8,
    max: 24,
};

export const passwordMessages = {
    emptyField: "Password is required, can not be empty.",
    tooShort: `Password must be at least ${passwordLimits.min} characters long.`,
    tooLong: `Password must be at most ${passwordLimits.max} characters long.`,
    invalidFormat:
        "Password must include uppercase, lowercase, number and symbol.",
};
