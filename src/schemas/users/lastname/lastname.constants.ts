export const lastnameLimits = {
    min: 2,
    max: 50,
};

export const lastnameMessages = {
    emptyField: "Lastname is required, can not be empty.",
    tooShort: `Lastname must be at least ${lastnameLimits.min} characters long.`,
    tooLong: `Lastname must be at most ${lastnameLimits.max} characters long.`,
};
