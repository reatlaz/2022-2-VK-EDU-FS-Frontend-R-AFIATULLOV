import {
  GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE,
  GET_CHATS_REQUEST, GET_CHATS_SUCCESS, GET_CHATS_FAILURE,
  GET_LAST_MESSAGE_GENERAL_REQUEST, GET_LAST_MESSAGE_GENERAL_SUCCESS, GET_LAST_MESSAGE_GENERAL_FAILURE
} from '../constants/ActionTypes';

const getMessagesStarted = () => ({
  type: GET_MESSAGES_REQUEST
})

const getMessagesSuccess = (messages) => ({
  type: GET_MESSAGES_SUCCESS,
  payload: messages
})

const getMessagesFailure = (errorMessage) => ({
  type: GET_MESSAGES_FAILURE,
  payload: errorMessage
})

export const getMessages = (id) => {
  return (dispatch, getState) => {
    console.log('state: ', getState())
    dispatch(getMessagesStarted())

    const localStorageMessages = JSON.parse(localStorage.getItem('messages' + id));
    if (localStorageMessages != null) {
      dispatch(getMessagesSuccess(localStorageMessages));
    } else {
      dispatch(getMessagesSuccess({ data: [], user_id: null }));
    }

    fetch('/api/chats/' + id + '/messages/', {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/',
        'Access-Control-Allow-Credentials': true
      },
      credentials: 'include'
    })
      .then(resp => resp.json())
      .then(newMessages => {
        console.log(newMessages)
        dispatch(getMessagesSuccess(newMessages))
        localStorage.setItem('messages' + id, JSON.stringify(newMessages));
      })
      .catch(err => {
        dispatch(getMessagesFailure(err.message))
      })
  }
}

const getChatsStarted = () => ({
  type: GET_CHATS_REQUEST
})

const getChatsSuccess = (chats) => ({
  type: GET_CHATS_SUCCESS,
  payload: chats
})

const getChatsFailure = (errorMessage) => ({
  type: GET_CHATS_FAILURE,
  payload: errorMessage
})

export const getChats = (id) => {
  return (dispatch, getState) => {
    console.log('state: ', getState())
    dispatch(getChatsStarted())

    const localStorageChats = JSON.parse(localStorage.getItem('chats'));
    if (localStorageChats != null) {
      dispatch(getChatsSuccess(localStorageChats));
    } else {
      dispatch(getChatsSuccess([]));
    }

    fetch('/api/chats/', {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/',
        'Access-Control-Allow-Credentials': true
      },
      credentials: 'include'
    })
      .then(resp => resp.json())
      .then(newChats => {
        console.log('adding polled data to chats state', newChats.data)
        dispatch(getChatsSuccess(newChats.data))
        localStorage.setItem('chats', JSON.stringify(newChats.data));
      })
      .catch(err => {
        dispatch(getChatsFailure(err.message))
      });
  }
}

const getLastMessageGeneralStarted = () => ({
  type: GET_LAST_MESSAGE_GENERAL_REQUEST
})

const getLastMessageGeneralSuccess = (lastMessageGeneral) => ({
  type: GET_LAST_MESSAGE_GENERAL_SUCCESS,
  payload: lastMessageGeneral
})

const getLastMessageGeneralFailure = (errorMessage) => ({
  type: GET_LAST_MESSAGE_GENERAL_FAILURE,
  payload: errorMessage
})

export const getLastMessageGeneral = () => {
  return (dispatch, getState) => {
    console.log('state: ', getState())
    dispatch(getLastMessageGeneralStarted())

    const localStorageLastMessageGeneral = JSON.parse(localStorage.getItem('lastMessageGeneral'));
    if (localStorageLastMessageGeneral != null) {
      dispatch(getLastMessageGeneralSuccess(localStorageLastMessageGeneral));
    } else {
      dispatch(getLastMessageGeneralSuccess([]));
    }

    fetch('https://tt-front.vercel.app/messages/', {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/'
      }
    })
      .then(resp => resp.json())
      .then(data => {
        const last = data.at(-1)
        console.log('adding polled data to general chat state', last);
        dispatch(getLastMessageGeneralSuccess(last));

        localStorage.setItem('lastMessageGeneral', JSON.stringify(last));
      })
      .catch(err => {
        dispatch(getLastMessageGeneralFailure(err.message))
      });
  }
}

export const getChat = (id) => {
  return (dispatch, getState) => {
    console.log('state: ', getState())
    dispatch(getChatsStarted())

    const localStorageChats = JSON.parse(localStorage.getItem('chats'));
    if (localStorageChats != null) {
      dispatch(getChatsSuccess(localStorageChats));
    } else {
      dispatch(getChatsSuccess([]));
    }

    fetch('/api/chats/' + id, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/',
        'Access-Control-Allow-Credentials': true
      },
      credentials: 'include'
    })
      .then(resp => resp.json())
      .then(newMessages => {
        console.log(newMessages.data)
        dispatch(getChatsSuccess(newMessages.data))
        localStorage.setItem('messages' + id, JSON.stringify(newMessages.data));
      })
      .catch(err => {
        dispatch(getChatsFailure(err.message))
      })
  }
}
