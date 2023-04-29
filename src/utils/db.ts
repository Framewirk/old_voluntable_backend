import { Db, MongoClient } from "mongodb";

let db : Db;

export const establishDBConnection : Function = async () : Promise<void> => {
    try {
        const connectionString = process.env.DB_CONNECTION_STRING;
        if(!connectionString) {
            throw new Error("DB_CONNECTION_STRING is not defined");
        } else {
            const client = await new MongoClient(connectionString);
            await client.connect().then((connection) => {
                const dbName = process.env.DB_NAME;
                if(!dbName) {
                    throw new Error("DB_NAME is not defined");
                } else {
                    db = connection.db(dbName);
                    console.log("Connected to DB!");
                }
            }).catch((err) => {
                throw new Error(err);
            });
        }
    } catch(err) {
        throw err;
    }
};

export const getDB : Function = () : Db => {
    try {
        if(!db) {
            throw new Error("DB is not connected");
        } else {
            return db;
        }
    } catch(err) {
        throw err;
    }
}