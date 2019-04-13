import { createReducer } from '../../../app/common/util/reducerUtil';
import { FETCH_COMMENTS, SET_COMMENT } from './commentConstants';

 const initialState = [];

 export const setComment = (state, payload) => {
  return [...state, Object.assign({}, payload.comment)]
}

export const fetchComments = (state, payload) => {
  return payload.comments
}

export default createReducer(initialState, {
  [FETCH_COMMENTS]: fetchComments,
  [SET_COMMENT]: setComment
})
