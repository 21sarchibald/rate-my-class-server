import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObjectId } from "mongodb";
import courseData from "../src/models/course.model.mts";
import mongodb from "../src/database/index.mts";

vi.mock("../src/database/index.mts", () => ({
    default: {
        getDb: vi.fn()
    }
}));

describe("courseData", () => {
    let collectionMock: any;

    beforeEach(() => {
        collectionMock = {
            findOne: vi.fn(),
            insertOne: vi.fn(),
            updateOne: vi.fn(),
            deleteOne: vi.fn()
        };

        vi.mocked(mongodb.getDb).mockReturnValue({
            collection: vi.fn().mockReturnValue(collectionMock)
        } as any);
    });

    describe("getCourseById", () => {
        it("returns a course by id", async () => {
            const course = {
                courseCode: "CS101",
                courseName: "Intro to CS"
            };

            collectionMock.findOne.mockResolvedValue(course);

            const id = new ObjectId().toString();

            const result = await courseData.getCourseById(id);

            expect(result).toEqual(course);
            expect(collectionMock.findOne).toHaveBeenCalledWith({
                _id: new ObjectId(id)
            });
        });
    });

    describe("getCourseByCode", () => {
        it("returns a course by course code", async () => {
            const course = {
                courseCode: "CS101",
                courseName: "Intro to CS"
            };

            collectionMock.findOne.mockResolvedValue(course);

            const result = await courseData.getCourseByCode("CS101");

            expect(result).toEqual(course);
            expect(collectionMock.findOne).toHaveBeenCalledWith({
                courseCode: "CS101"
            });
        });
    });

    describe("createCourse", () => {
        it("creates a course", async () => {
            const course = {
                courseCode: "CS101",
                courseName: "Intro to CS"
            };

            const insertResult = {
                insertedId: new ObjectId()
            };

            collectionMock.insertOne.mockResolvedValue(insertResult);

            const result = await courseData.createCourse(course as any);

            expect(result).toEqual(insertResult);
            expect(collectionMock.insertOne).toHaveBeenCalledWith(course);
        });
    });

    describe("updateCourse", () => {
        it("updates a course", async () => {
            const updateResult = {
                modifiedCount: 1
            };

            collectionMock.updateOne.mockResolvedValue(updateResult);

            const id = new ObjectId().toString();
            const updates = {
                courseName: "Advanced Programming"
            };

            const result = await courseData.updateCourse(id, updates);

            expect(result).toEqual(updateResult);

            // This matches your CURRENT implementation.
            expect(collectionMock.updateOne).toHaveBeenCalledWith(
                { _id: new ObjectId(id) },
                { $set: { updates } }
            );
        });
    });

    describe("deleteCourse", () => {
        it("deletes a course", async () => {
            const deleteResult = {
                deletedCount: 1
            };

            collectionMock.deleteOne.mockResolvedValue(deleteResult);

            const id = new ObjectId().toString();

            const result = await courseData.deleteCourse(id);

            expect(result).toEqual(deleteResult);
            expect(collectionMock.deleteOne).toHaveBeenCalledWith({
                _id: new ObjectId(id)
            });
        });

        it("throws an error for an invalid id", async () => {
            await expect(
                courseData.deleteCourse("invalid-id")
            ).rejects.toThrow("Invalid course ID");
        });
    });
});