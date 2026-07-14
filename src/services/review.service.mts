import reviewModel from "../models/review.model.mts";
// import type { Review } from "../models/types.mts";
// import {buildPaginationWrapper, formatFields} from "./utils.mts";


// const getReviewsByClass = async (query:QueryParams) => {

//   let find:FindProductObj = {search: {},

//     limit: query.limit? parseInt(query.limit) : 20,

//     offset: query.offset? parseInt(query.offset) : 0

//   }

//   const {q, category, fields} = query; 

//   find.fieldFilters = fields? formatFields(fields): undefined;

//   if(category) {

//       find.search.category = category;

//   }

//   if(q) {

//       find.search.name = q;

//       find.search.descriptionHtmlSimple = q;

//   }

//   // now that we know what we have send it to the model and get the results.

// const data = await productModel.getAllProducts(find);

// // take the results and format them correctly

// const wrapper = buildPaginationWrapper(data.totalCount, query)

// // don't forget to actually set the records in there.

// wrapper.results = data.results

// return wrapper

// };
 

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

export default {
  getReviewById,
  getReviewsByClass,
  getReviewsByProfessor,
  getReviewsByUser,
  searchReviews
};