import reviewModel from "../models/review.model.mts";
import type { Course, CreateReviewRequest, Review } from "../models/types.mts";
import mongodb from "../database/index.mts";
import { ObjectId } from "mongodb";


const getReviewById = async (id: string) => {
  return await reviewModel.getReviewById(id);
};

const getReviewsByClass = async (courseCode: string) => {
    return await reviewModel.getReviewsByClass(courseCode);
};

const getReviewsByProfessor = async (professorName: string) => {
    return await reviewModel.getReviewsByProfessor(professorName);
}

const getReviewsByUser = async (userId: string) => {
    return await reviewModel.getReviewsByUser(userId);
}

const searchReviews = async (query: string) => {
  return await reviewModel.searchReviews(query);
}

const createReview = async (reviewData: CreateReviewRequest, userId: string) => {

  console.log("reviewData: ", reviewData)

  const normalizedCourseCode = reviewData.courseCode.toUpperCase();

  const course = await mongodb.getDb().collection<Course>("classes").findOneAndUpdate(
    {
      courseCode: normalizedCourseCode
    },
    {
      $setOnInsert: {
        courseCode: normalizedCourseCode,
        courseName: reviewData.courseName,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    {
      upsert: true,
      returnDocument: "after"
    }
);
  if (!course) {
    throw new Error("Unable to create course");
  }

  const newReview : Review = {
    userId: new ObjectId(userId),
    courseId: new ObjectId(course._id),
    courseCode: normalizedCourseCode,
    courseName: reviewData.courseName,
    professor: reviewData.professor,
    semester: reviewData.semester,
    isBlock: reviewData.isBlock,
    year: reviewData.year,
    rating: reviewData.rating,
    gradeReceived: reviewData.gradeReceived,
    difficulty: reviewData.difficulty,
    type: reviewData.type,
    recommend: reviewData.recommend,
    description: reviewData.description,
    likes: 0,
    dislikes: 0,
    createdAt: new Date(),
    updatedAt: new Date()

  }

  return await reviewModel.createReview(newReview);
}

export default {
  getReviewById,
  getReviewsByClass,
  getReviewsByProfessor,
  getReviewsByUser,
  searchReviews,
  createReview
};