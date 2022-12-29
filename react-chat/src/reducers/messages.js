import {GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE} from '../constants/ActionTypes';

const getInitialMessages = () => {
    const localStorageMessages = JSON.parse(localStorage.getItem("messages" + id));
    if (localStorageMessages != null) {
      return localStorageMessages;
    }
    return []
}
const initialState = {
  loading: false,
  messages: getInitialMessages(),
  error: '',
}

export default (state = initialState, action) => { // eslint-disable-line  import/no-anonymous-default-export
  switch (action.type) {
    case GET_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case GET_MESSAGES_SUCCESS:
      return {
        loading: false,
        messages: [...state.messages, action.payload],
        error: '',
      }
    case GET_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}