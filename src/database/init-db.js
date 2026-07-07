import {MongoClient, ServerApiVersion} from 'mongodb';

import * as argon2 from "argon2";

const uri = process.env.MONGO_URI || "";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

const seedUsers = async (db) => {

    const hashedPassword1 = await argon2.hash("Test123!");

    const hashedPassword2 = await argon2.hash("Test456!");

    const users = [
        {
            name: "Alice Student",
            email: "alice.student@test.com",
            username: "astudent",
            password: hashedPassword1,
            major: "Cybersecurity",
            userType: "Student",
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            name: "Ava Admin",
            email: "ava.admin@test.com",
            username: "aadmin",
            password: hashedPassword2,
            major: "Software Engineering",
            userType: "Admin",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ]

    try {
        await db.collection("users").drop();
        console.log("users dropped");

        await db.createCollection("users");
        console.log("users collection created")

        const result = await db.collection("users").insertMany(
            users
        );

        console.log(result.insertedIds);
    }
    catch (error) {
        console.log(error.message)
    }
}

const init = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db= client.db(process.env.MONGO_DATABASE);
        console.log(`Connected to database: ${db.databaseName}`);

        // initialize Users collection
        await seedUsers(db);
        console.log(`Collection 'users' initialized successfully`);
    } catch (error) {
        console.error(error.message);
    } finally {
        await client.close();
    }
}

await init();