import {
    object,
    string,
    number,
    date,
    pipe,
    nonEmpty,
    minValue,
    maxValue,
} from "valibot";

export const UserStatsSchema = object({
    userId: pipe(string(), nonEmpty()),
    quizId: pipe(string(), nonEmpty()),
    category: pipe(string(), nonEmpty()),
    score: pipe(number(), minValue(0), maxValue(500)),
    correctAnswers: pipe(number(), minValue(0), maxValue(30)),
    totalQuestions: pipe(number(), minValue(1), maxValue(30)),
    completedAt: pipe(date(), minValue(new Date())),
    completionTime: pipe(number(), minValue(1)),
});
