import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObjectId } from "mongodb";
import userData from "../src/models/user.model.mts";
import mongodb from "../src/database/index.mts";

vi.mock("../src/database/index.mts", () => ({
    default: {
        getDb: vi.fn()
    }
}));

describe("userData", () => {
    let collectionMock: any;

    beforeEach(() => {
        collectionMock = {
            find: vi.fn(),
            findOne: vi.fn(),
            insertOne: vi.fn(),
            updateOne: vi.fn(),
            deleteOne: vi.fn()
        };

        vi.mocked(mongodb.getDb).mockReturnValue({
            collection: vi.fn().mockReturnValue(collectionMock)
        } as any);
    });

    describe("getAllUsers", () => {
        it("returns all users without passwords", async () => {
            const users = [
                {
                    username: "alice",
                    email: "alice@test.com"
                }
            ];

            const toArray = vi.fn().mockResolvedValue(users);
            const project = vi.fn().mockReturnValue({ toArray });

            collectionMock.find.mockReturnValue({ project });

            const result = await userData.getAllUsers();

            expect(result).toEqual(users);
            expect(collectionMock.find).toHaveBeenCalledWith({});
            expect(project).toHaveBeenCalledWith({
                password: 0
            });
        });
    });

    describe("getUserById", () => {
        it("returns a user by id", async () => {
            const user = {
                username: "alice"
            };

            collectionMock.findOne.mockResolvedValue(user);

            const id = new ObjectId().toString();

            const result = await userData.getUserById(id);

            expect(result).toEqual(user);
            expect(collectionMock.findOne).toHaveBeenCalledWith({
                _id: new ObjectId(id)
            });
        });
    });

    describe("getUserByEmail", () => {
        it("returns a user by email", async () => {
            const user = {
                email: "alice@test.com"
            };

            collectionMock.findOne.mockResolvedValue(user);

            const result = await userData.getUserByEmail("alice@test.com");

            expect(result).toEqual(user);
            expect(collectionMock.findOne).toHaveBeenCalledWith({
                email: "alice@test.com"
            });
        });
    });

    describe("getUserByUsername", () => {
        it("returns a user by username", async () => {
            const user = {
                username: "alice"
            };

            collectionMock.findOne.mockResolvedValue(user);

            const result = await userData.getUserByUsername("alice");

            expect(result).toEqual(user);
            expect(collectionMock.findOne).toHaveBeenCalledWith({
                username: "alice"
            });
        });
    });

    describe("createUser", () => {
        it("creates a user", async () => {
            const user = {
                username: "alice",
                email: "alice@test.com"
            };

            const insertResult = {
                insertedId: new ObjectId()
            };

            collectionMock.insertOne.mockResolvedValue(insertResult);

            const result = await userData.createUser(user as any);

            expect(result).toEqual(insertResult);
            expect(collectionMock.insertOne).toHaveBeenCalledWith(user);
        });
    });

    describe("updateUser", () => {
        it("updates a user", async () => {
            const updateResult = {
                modifiedCount: 1
            };

            collectionMock.updateOne.mockResolvedValue(updateResult);

            const id = new ObjectId().toString();
            const updates = {
                username: "newUsername"
            };

            const result = await userData.updateUser(id, updates);

            expect(result).toEqual(updateResult);

            // Matches your CURRENT implementation.
            expect(collectionMock.updateOne).toHaveBeenCalledWith(
                { _id: new ObjectId(id) },
                { $set: { updates } }
            );
        });
    });

    describe("deleteUser", () => {
        it("deletes a user", async () => {
            const deleteResult = {
                deletedCount: 1
            };

            collectionMock.deleteOne.mockResolvedValue(deleteResult);

            const id = new ObjectId().toString();

            const result = await userData.deleteUser(id);

            expect(result).toEqual(deleteResult);
            expect(collectionMock.deleteOne).toHaveBeenCalledWith({
                _id: new ObjectId(id)
            });
        });

        it("throws an error for an invalid id", async () => {
            await expect(
                userData.deleteUser("not-a-valid-id")
            ).rejects.toThrow("Invalid user ID");
        });
    });
});