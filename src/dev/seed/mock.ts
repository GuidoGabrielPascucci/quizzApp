import { faker } from "@faker-js/faker";
import { hashSync } from "bcrypt";

type RandomUser = {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    score?: number;
    createdAt?: Date;
};

export function createRandomUser(testing?: boolean) {
    const randomUser: RandomUser = {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: hashSync(faker.internet.password(), 10),
        score: faker.number.int({ min: 0 }),
        createdAt: faker.date.recent(),
    };
    if (testing) {
        delete randomUser.score;
        delete randomUser.createdAt;
    }
    return randomUser;
}

export function createUsersDataset(length: number) {
    const users = [];
    for (let i = 0; i < length; i++) {
        const newRandomUser = createRandomUser();
        users.push(newRandomUser);
    }
    return users;
}
