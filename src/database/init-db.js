import {MongoClient, ServerApiVersion} from 'mongodb';

const uri = process.env.MONGO_URI || "";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

const init = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error.message);
    } finally {
        await client.close();
    }
}

await init();