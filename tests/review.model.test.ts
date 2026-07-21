// reviewData.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObjectId } from "mongodb";
import reviewData from "../src/models/review.model.mts";
import mongodb from "../src/database/index.mts";

vi.mock("../src/database/index.mts", () => ({
    default: {
        getDb: vi.fn()
    }
}));

describe("reviewData", () => {
    let collectionMock: any;

    beforeEach(() => {
        collectionMock = {
            find: vi.fn(),
            findOne: vi.fn(),
            insertOne: vi.fn(),
            updateOne: vi.fn(),
            deleteOne: vi.fn(),
            aggregate: vi.fn()
        };

        vi.mocked(mongodb.getDb).mockReturnValue({
            collection: vi.fn().mockReturnValue(collectionMock)
        } as any);
    });

    describe("getAllReviews", () => {
        it("returns all reviews", async () => {
            const reviews = [{ title: "Test Review" }];

            collectionMock.find.mockReturnValue({
                toArray: vi.fn().mockResolvedValue(reviews)
            });

            const result = await reviewData.getAllReviews();

            expect(result).toEqual(reviews);
            expect(collectionMock.find).toHaveBeenCalledWith({});
        });
    });

    describe("getReviewById", () => {
        it("returns a review by id", async () => {
            const review = { title: "Review" };

            collectionMock.findOne.mockResolvedValue(review);

            const id = new ObjectId().toString();

            const result = await reviewData.getReviewById(id);

            expect(result).toEqual(review);
            expect(collectionMock.findOne).toHaveBeenCalledWith({
                _id: new ObjectId(id)
            });
        });
    });

    describe("getReviewsByProfessor", () => {
        it("searches by professor name", async () => {
            const reviews = [{ professor: "Smith" }];

            collectionMock.find.mockReturnValue({
                toArray: vi.fn().mockResolvedValue(reviews)
            });

            const result = await reviewData.getReviewsByProfessor("smith");

            expect(result).toEqual(reviews);
            expect(collectionMock.find).toHaveBeenCalledWith({
                professor: {
                    $regex: "smith",
                    $options: "i"
                }
            });
        });
    });

    describe("createReview", () => {
        it("inserts a review", async () => {
            const review = {
                professor: "Smith"
            };

            const insertResult = {
                insertedId: new ObjectId()
            };

            collectionMock.insertOne.mockResolvedValue(insertResult);

            const result = await reviewData.createReview(review as any);

            expect(result).toEqual(insertResult);
            expect(collectionMock.insertOne).toHaveBeenCalledWith(review);
        });
    });

    describe("updateReview", () => {
        it("updates a review", async () => {
            const updateResult = {
                modifiedCount: 1
            };

            collectionMock.updateOne.mockResolvedValue(updateResult);

            const id = new ObjectId().toString();
            const updates = {
                rating: 5
            };

            const result = await reviewData.updateReview(id, updates);

            expect(result).toEqual(updateResult);
            expect(collectionMock.updateOne).toHaveBeenCalledWith(
                { _id: new ObjectId(id) },
                { $set: updates }
            );
        });
    });

    describe("deleteReview", () => {
        it("deletes a review", async () => {
            const deleteResult = {
                deletedCount: 1
            };

            collectionMock.deleteOne.mockResolvedValue(deleteResult);

            const id = new ObjectId().toString();

            const result = await reviewData.deleteReview(id);

            expect(result).toEqual(deleteResult);
            expect(collectionMock.deleteOne).toHaveBeenCalledWith({
                _id: new ObjectId(id)
            });
        });

        it("throws on invalid id", async () => {
            await expect(
                reviewData.deleteReview("not-an-id")
            ).rejects.toThrow("Invalid Review ID");
        });
    });

    describe("searchReviews", () => {
        it("returns matching courses and professors", async () => {
            const aggregateMock = vi.fn();

            aggregateMock
                .mockReturnValueOnce({
                    toArray: vi.fn().mockResolvedValue([
                        {
                            courseId: new ObjectId(),
                            courseCode: "CS101",
                            courseName: "Intro to CS"
                        }
                    ])
                })
                .mockReturnValueOnce({
                    toArray: vi.fn().mockResolvedValue([
                        { professor: "Dr. Smith" }
                    ])
                });

            collectionMock.aggregate = aggregateMock;

            const result = await reviewData.searchReviews("smith");

            expect(result.professors).toEqual(["Dr. Smith"]);
            expect(result.courses).toHaveLength(1);
            expect(result.courses[0].courseCode).toBe("CS101");
        });
    });
});