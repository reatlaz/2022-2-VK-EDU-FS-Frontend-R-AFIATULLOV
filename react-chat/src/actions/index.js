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
  payload: errorMessage,
})

export const getMessages = (id) => {
  return ((dispatch, getState) => {
    console.log('state: ', getState())
    dispatch(getMessagesStarted())

    fetch('https://reatlaz.pythonanywhere.com/chats/' + id + '/messages/', {
      mode: 'cors',
      headers: {'Access-Control-Allow-Origin': '*'}
      })
      .then(resp => resp.json())
      .then(newMessages => {
        console.log(newMessages.data)
        dispatch(getMessagesSuccess(newMessages))
        localStorage.setItem('messages' + id, JSON.stringify(newMessages.data));
      })
      .catch(err => {
        dispatch(getMessagesFailure(err.message))
      })

  })
}