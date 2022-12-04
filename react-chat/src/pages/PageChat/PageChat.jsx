import React, {useState} from 'react';
import './PageChat.scss';
import {Message, Button} from '../../components';

function Messages(props) {
  const messages = props.messages;
  var messagesJSX = null
  if (messages !== null) {
    messagesJSX = messages.map((msg, index) =>
      <Message
        key={index}
        isMine={msg.isMine}
        text={msg.text}
        time={msg.time}
      />)
  }
  return (
    <div id="messages">
      {messagesJSX}
    </div>
  )
}

function MessageInputForm(props) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if(value !== '') {
      const textString = value;
      const timeString = getCurrentTime();
      const newMessage = {
        isMine: true,
        text: textString,
        time: timeString,
      }
      let localStorageMessages = JSON.parse(localStorage.getItem("messages"));
      if(localStorageMessages === null) {
          localStorageMessages = [];
      }
      localStorageMessages.push(newMessage)
      localStorage.setItem('messages', JSON.stringify(localStorageMessages));
      setValue('');
      props.changeState()
    }
  }

  return(
    <form className="form" onSubmit={handleSubmit}>
      <div id="text-input">
        <input className="form-input"
          placeholder="Cообщение"
          onChange={handleChange}
          value={value}
        />
        <Button value='attach_file' className='attach-button'/>
      </div>
    </form>
  )
}

export class PageChat extends React.Component {
  constructor(props) {
    super(props);
    let localStorageMessages = JSON.parse(localStorage.getItem("messages"));
    if(localStorageMessages === null) {
      localStorageMessages = [{
        isMine: false,
        text: 'Я вазу уронил',
        time: '00:01',
        }];
      localStorage.setItem('messages', JSON.stringify(localStorageMessages));
    }
    this.state ={
      messages: localStorageMessages
      }
  };
  changeState() {
    this.setState({
      messages: JSON.parse(localStorage.getItem("messages"))
      })
  }
  render() {
    return (
      <div className='page-chat'>
        <nav>
          <Button
            className='nav-button'
            value='arrow_back'
            onClick={() => this.props.goToPage('PageChatList')}
          />
          <div className="heading">
          <img
            src="src/static/barsiq.png"
            className="user-avatar"
            alt="Not found"
            />
            <div className="receiver-text">
              <div id="username">
                Барсик
              </div>
              <div id="last-seen">
                был 2 часа назад
              </div>
            </div> 
          </div>
          <Button className='nav-button' value='search'/>
          <Button className='nav-button' value='more_vert'/>
        </nav>
        <Messages messages={this.state.messages}/>
        <MessageInputForm
          changeState={() => this.changeState()}
          onSubmit={this.handleSubmit}
        />
    </div>
    );
  }
}


function getCurrentTime() {
  const currentDate = new Date();
    let hours = String(currentDate.getHours());
    if (hours.length === 1) {
        hours = '0' + hours
    }
    let minutes = String(currentDate.getMinutes());

    if (minutes.length === 1) {
        minutes = '0' + minutes
    }
    return hours + ":" + minutes;
}
