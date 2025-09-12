import { NextFunction, Request, Response } from "express";
import { safeParse } from "valibot";
import { UserStatsSchema } from "@schemas/users/validation.schema.js";
import { invalidDataResponseObject } from "@utils/user.utils.js";

export function validateUpdateStatsInputs(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const result = safeParse(UserStatsSchema, req.body);

    if (!result.success) {
        res.status(400).json(invalidDataResponseObject);
        return;
    }

    req.body = result.output;
    next();
}