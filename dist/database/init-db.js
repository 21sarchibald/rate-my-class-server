"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const uri = process.env.MONGO_URI || "";
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const init = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error(error.message);
    }
    finally {
        await client.close();
    }
};
await init();
