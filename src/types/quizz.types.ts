export type QuizzData = {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    questions: QuizzQuestion[];
};

type QuizzQuestion = {
    question: string;
    choices: string[];
    correctAnswer: number;
};

export type QuizzFilters = {
    category?: string;
    difficulty?: string;
};
