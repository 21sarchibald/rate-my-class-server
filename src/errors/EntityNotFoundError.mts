import CustomError  from '../errors/CustomError.mjs';
export default class EntityNotFoundError extends CustomError<ErrorCode> {}