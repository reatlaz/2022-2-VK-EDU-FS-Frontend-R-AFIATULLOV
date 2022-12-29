import {GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE} from '../constants/ActionTypes';

const getMessagesStarted = () => ({
  type: GET_MESSAGES_REQUEST,
})

const getMessagesSuccess = (messages) => ({
  type: GET_MESSAGES_SUCCESS,
  payload: messages,
})

const getMessagesFailure = (errorMessage) => ({
  type: GET_MESSAGES_FAILURE,
  payload: errorMessages,
})
