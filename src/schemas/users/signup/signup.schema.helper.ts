export type LengthObjType = {
    length: number;
    message: string;
};

export const getSchemaObject = (
    field: string,
    minLengthObj: LengthObjType,
    maxLengthObj: LengthObjType
) => {
    return {
        field,
        minLengthObj,
        maxLengthObj,
    };
};
