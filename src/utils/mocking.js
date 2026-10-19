import mongoose from 'mongoose';
import { fakerES as faker } from '@faker-js/faker';
import { createHash } from './index.js';

const MOCK_PASSWORD = 'coder123';
const ROLES = ['user', 'admin'];
const SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'turtle'];

const validateQuantity = (quantity) => {
    if (!Number.isInteger(quantity) || quantity < 0) throw new Error('quantity must be a non-negative integer');
}

export const generatePet = () => {
    return {
        _id: new mongoose.Types.ObjectId(),
        name: faker.animal.petName(),
        specie: faker.helpers.arrayElement(SPECIES),
        birthDate: faker.date.past({ years: 15 }),
        adopted: false,
        image: faker.image.url(),
        __v: 0
    }
}

export const generatePets = (quantity) => {
    validateQuantity(quantity);
    return Array.from({ length: quantity }, generatePet);
}

export const generateUsers = async (quantity) => {
    validateQuantity(quantity);
    // Se encripta una sola vez: bcrypt es lento a propósito y todos los mocks comparten la misma contraseña
    const password = await createHash(MOCK_PASSWORD);
    const usedEmails = new Set();
    const users = [];
    while (users.length < quantity) {
        const first_name = faker.person.firstName();
        const last_name = faker.person.lastName();
        const email = faker.internet.email({ firstName: first_name, lastName: last_name }).toLowerCase();
        if (usedEmails.has(email)) continue;
        usedEmails.add(email);
        users.push({
            _id: new mongoose.Types.ObjectId(),
            first_name,
            last_name,
            email,
            password,
            role: faker.helpers.arrayElement(ROLES),
            pets: [],
            __v: 0
        });
    }
    return users;
}
