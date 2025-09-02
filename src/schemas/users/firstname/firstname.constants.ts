export const firstnameLimits = {
    min: 2,
    max: 50,
};

export const firstnameMessages = {
    emptyField: "First name is required, can not be empty.",
    tooShort: `First name must be at least ${firstnameLimits.min} characters long.`,
    tooLong: `First name must be at most ${firstnameLimits.max} characters long.`,
};
