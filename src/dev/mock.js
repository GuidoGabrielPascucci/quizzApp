import { faker } from "@faker-js/faker";
import { hashSync } from "bcrypt";

export function createRandomUser(testing) {
  const randomUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: hashSync(faker.internet.password(), 10),
    score: faker.number.int({ min: 0}),
    createdAt: faker.date.recent()
  };
  if (testing) {
    delete randomUser.score;
    delete randomUser.createdAt;
  }
  return randomUser;
}

export function createUsersDataset(length) {
  const users = [];
  for (let i = 0; i < length; i++) {
    const newRandomUser = createRandomUser();
    users.push(newRandomUser);
  }
  return users;
}

/* MOCK CHAT GPT
export function createRandomUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    score: faker.number.int({ min: 0}),
    createdAt: faker.date.recent()
    //_id: faker.string.uuid(),
    //avatar: faker.image.avatar(),
    //birthday: faker.date.birthdate(),
    //sex: faker.person.sexType(),
    //subscriptionTier: faker.helpers.arrayElement(['free', 'basic', 'business']),
  };
}
*/