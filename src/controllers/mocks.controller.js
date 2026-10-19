import { petsService, usersService } from "../services/index.js"
import { generatePets, generateUsers } from "../utils/mocking.js";

const MAX_QUANTITY = 10000;

const parseQuantity = (value, defaultValue) => {
    if (value === undefined || value === '') return defaultValue;
    const quantity = Number(value);
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > MAX_QUANTITY) return null;
    return quantity;
}

const invalidQuantity = (res, field) => res.status(400).send({ status: "error", error: `${field} must be an integer between 0 and ${MAX_QUANTITY}` });

const getMockingPets = (req, res) => {
    const quantity = parseQuantity(req.query.quantity, 100);
    if (quantity === null) return invalidQuantity(res, "quantity");
    const pets = generatePets(quantity);
    res.send({ status: "success", payload: pets })
}

const getMockingUsers = async (req, res) => {
    try {
        const quantity = parseQuantity(req.query.quantity, 50);
        if (quantity === null) return invalidQuantity(res, "quantity");
        const users = await generateUsers(quantity);
        res.send({ status: "success", payload: users })
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message })
    }
}

const generateData = async (req, res) => {
    try {
        const params = { ...req.query, ...req.body };
        const usersQuantity = parseQuantity(params.users, 0);
        if (usersQuantity === null) return invalidQuantity(res, "users");
        const petsQuantity = parseQuantity(params.pets, 0);
        if (petsQuantity === null) return invalidQuantity(res, "pets");
        if (!usersQuantity && !petsQuantity) return res.status(400).send({ status: "error", error: "Incomplete values: send users and/or pets" })

        const users = await generateUsers(usersQuantity);
        const pets = generatePets(petsQuantity);
        const insertedUsers = users.length ? await usersService.createMany(users) : [];
        const insertedPets = pets.length ? await petsService.createMany(pets) : [];
        res.status(201).send({
            status: "success",
            message: `${insertedUsers.length} users and ${insertedPets.length} pets inserted`,
            payload: { users: insertedUsers.length, pets: insertedPets.length }
        })
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message })
    }
}

export default {
    getMockingPets,
    getMockingUsers,
    generateData
}
