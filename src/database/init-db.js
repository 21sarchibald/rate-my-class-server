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

    const hashedPassword3 = await argon2.hash("Test789!");

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
        },
        {
            name: "Sam Student",
            email: "sam.student@test.com",
            username: "sstudent",
            password: hashedPassword3,
            major: "Web Design and Development",
            userType: "Student",
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

const seedClasses = async (db) => {

    const classes = [
        {
            courseCode: "CSE210",
            courseName: "Programming with Classes",
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            courseCode: "WDD130",
            courseName: "Web Fundamentals",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ]

    try {
        await db.collection("classes").drop();
        console.log("classes dropped");

        await db.createCollection("classes");
        console.log("classess collection created")

        const result = await db.collection("classes").insertMany(
            classes
        );

        console.log(result.insertedIds);
    }
    catch (error) {
        console.log(error.message)
    }
}

const seedReviews = async (db) => {

    const user1 = await db.collection("users").findOne({ email: "alice.student@test.com" });
    const user2 = await db.collection("users").findOne({ email: "sam.student@test.com" });

    const course1 = await db.collection("classes").findOne({ courseCode: "CSE210" });
    const course2 = await db.collection("classes").findOne({ courseCode: "WDD130" });

    const reviews = [
        {
            userId: user1._id,
            courseId: course1._id,
            courseName: "Programming with Classes",
            rating: 5,
            difficulty: 4,
            likelihoodToRecommend: 5,
            professor: "Gary Godderidge",
            semester: "Fall",
            year: 2024,
            type: "in-person",
            isBlock: true,
            description: "Loved this class! Fast-paced but really worth it. I felt like I came out of there with great knowledge and skills to prepare me for the next class.",
            gradeReceived: "A",
            likes: 10,
            dislikes: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            userId: user2._id,
            courseId: course2._id,
            rating: 3,
            difficulty: 2,
            likelihoodToRecommend: 2,
            professor: "James Christensen",
            semester: "Winter",
            year: 2026,
            type: "online",
            isBlock: false,
            description: "Brother Christensen is a nice teacher, but the course material is hard to understand and takes a long time to read. Probably would have been better in-person.",
            gradeReceived: "B-",
            likes: 4,
            dislikes: 3,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ]

    try {
        await db.collection("reviews").drop();
        console.log("reviews dropped");

        await db.createCollection("reviews");
        console.log("reviews collection created")

        const result = await db.collection("reviews").insertMany(
            reviews
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

        // initialize Classes collection
        await seedClasses(db);
        console.log(`Collection 'classes' initialized successfully`);

        // initialize Reviews collection
        await seedReviews(db);
        console.log(`Collection 'reviews' initialized successfully`);

    } catch (error) {
        console.error(error.message);

    } finally {
        await client.close();
    }
}

await init();