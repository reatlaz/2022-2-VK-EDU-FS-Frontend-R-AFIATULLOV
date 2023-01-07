import { combineReducers } from 'redux';
import messages from './messages';
import chats from './chats';
import lastMessageGeneral from './lastMessageGeneral';

export default combineReducers({
  messages,
  chats,
  lastMessageGeneral
})
