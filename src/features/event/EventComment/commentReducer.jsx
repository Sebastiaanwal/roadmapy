import { createReducer } from '../../../app/common/util/reducerUtil';
import { FETCH_ANSWERS, SET_ANSWER } from './commentConstants';

 const initialState = [];

 export const setAnswer = (state, payload) => {
  return [...state, Object.assign({}, payload.answer)]
}

export const fetchAnswers = (state, payload) => {
  return payload.answers
}

export default createReducer(initialState, {
  [FETCH_ANSWERS]: fetchAnswers,
  [SET_ANSWER]: setAnswer
})