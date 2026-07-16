import mongodb from "../database/index.mts";
import type { Review, SearchResults } from "./types.mts";
import { ObjectId } from "mongodb";

async function getAllReviews(): Promise<Review[]> {
    return await mongodb
        .getDb()
        .collection<Review>("reviews")
        .find({})
        .toArray();
}

async function getReviewById(reviewId: string): Promise<Review | null> {
    const data = (await mongodb.getDb().collection<Review>("reviews").findOne({ _id: new ObjectId(reviewId) }));
    return data;
}

async function getReviewsByUser(userId: string): Promise<Review[] | null> {
    
    const data = (await mongodb.getDb().collection<Review>("reviews").find({ userId: new ObjectId(userId) })).toArray();
    return data;
}

async function getReviewsByProfessor(professor: string): Promise<Review[] | null> {
    
    const data = (await mongodb.getDb().collection<Review>("reviews").find({ professor: { $regex: professor, $options: "i" } })).toArray();
    return data;
}

async function getReviewsByClass(courseId: string): Promise<Review[] | null> {
    
    const data = (await mongodb.getDb().collection<Review>("reviews").find({ courseId: new ObjectId(courseId) })).toArray();
    return data;
}

// async function searchReviews(search: string): Promise<Review[] | null> {

//     const data = (await mongodb.getDb().collection<Review>("reviews").find({
//         $or: [
//             { courseName: { $regex: search, $options: "i"}},
//             { professor: { $regex: search, $options: "i"}},
//             { courseCode: { $regex: search, $options: "i"}}
//         ]
//     })).toArray();
//     return data;
// }

async function searchReviews(search: string): Promise<SearchResults> {
    // const db = mongodb.getDb();

    // Find matching courses (remove duplicates)

    const courses = await mongodb.getDb().collection<Review>("reviews")
        .aggregate<{
            courseId: ObjectId;
            courseCode: string;
            courseName: string;
        }>([
            {
                $match: {
                    $or: [
                        { courseName: { $regex: search, $options: "i" } },
                        { courseCode: { $regex: search, $options: "i" } },
                        { professor: { $regex: search, $options: "i" } }
                    ]
                }
            },
            {
                $group: {
                    _id: "$courseId",
                    courseCode: { $first: "$courseCode" },
                    courseName: { $first: "$courseName" }
                }
            },
            {
                $project: {
                    _id: 0,
                    courseId: "$_id",
                    courseCode: 1,
                    courseName: 1
                }
            }
        ])
        .toArray();

    // Find matching professors (remove duplicates)
    const professors = await mongodb.getDb()
    .collection<Review>("reviews")
    .aggregate<{ professor: string }>([
        {
            $match: {
                $or: [
                    { professor: { $regex: search, $options: "i" } },
                    { courseCode: { $regex: search, $options: "i" } },
                    { courseName: { $regex: search, $options: "i" } }
                ]
            }
        },
        {
            $group: {
                _id: "$professor"
            }
        },
        {
            $project: {
                _id: 0,
                professor: "$_id"
            }
        }
    ])
    .toArray();

    const professorNames = professors.map(p => p.professor);

    return {
        courses: courses.map(course => ({
            ...course,
            courseId: course.courseId.toString()
        })),
        professors: professorNames
    };

}

async function createReview(newReview: Review) {
    const result = await mongodb.getDb().collection<Review>("reviews").insertOne(newReview)
    return result
}

async function updateReview(ReviewId: string, updates: Partial<Review>) {
    const result = await mongodb.getDb().collection<Review>("reviews").updateOne(
        { _id: new ObjectId(ReviewId) },
        { $set: updates }
    )
    return result
}

async function deleteReview(ReviewId: string) {
    if (!ObjectId.isValid(ReviewId)) {
        throw new Error("Invalid Review ID")
    }

    const result = await mongodb.getDb().collection<Review>("reviews").deleteOne({ _id: new ObjectId(ReviewId) })
    return result
}

export default {
    getAllReviews,
    getReviewById,
    getReviewsByUser,
    getReviewsByProfessor,
    getReviewsByClass,
    searchReviews,
    createReview,
    updateReview,
    deleteReview
}

function next(error: unknown) {
        throw new Error("Function not implemented.");
    }
