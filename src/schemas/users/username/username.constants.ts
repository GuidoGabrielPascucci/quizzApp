export const usernameLimits = {
    min: 3,
    max: 20,
};

export const usernameMessages = {
    emptyField: "Username is required, can not be empty.",
    tooShort: `Username must be at least ${usernameLimits.min} characters long.`,
    tooLong: `Username must be at most ${usernameLimits.max} characters long.`,
    invalidFormat:
        "Username can only contain letters, numbers, underscores and dots.",
};
