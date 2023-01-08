import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { Icon } from '@mui/material';
import './PageChat.scss';
import { Message, Button, EmojiKeyboard } from '../../components';
import vkfs from '../../images/vkfs.jpg';
import { PageChatList } from '..'
import { getChats, getMessages, getLastMessageGeneral } from '../../actions';

function Messages (props) {
  const messages = props.messages;

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages.length]);
  let messagesJSX = null
  if (messages !== null) {
    messagesJSX = messages.map((msg, index) =>
      <Message
        key={index}
        emojiNames={props.emojiNames}
        text={msg.text}
        image={msg.image}
        audio={msg.audio}
        time={getTimeFromISOString(msg.timestamp)}
        sender={msg.author === 'ReAtlaz' ? '' : msg.author}
        isMine={msg.author === 'ReAtlaz'}
      />)
  }
  return (
    <div id="messages">
      {messagesJSX.reverse()}
    {/* <div ref={messagesEndRef} /> */}
    </div>
  )
}

function MessageInputForm (props) {
  const [text, setText] = useState('');
  const [audioBlob, setAudioBlob] = useState();
  const [audioURL, setAudioURL] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [vmIsQuick, setVmIsQuick] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [emojiKeyboardVisible, setEmojiKeyboardVisible] = useState(false);

  async function requestRecorder () {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
  }
  useEffect(() => {
    if (mediaRecorder === null) {
      if (isRecording) {
        requestRecorder().then(setMediaRecorder, console.error);
      }
      return;
    }

    if (isRecording) {
      mediaRecorder.start();
    } else {
      mediaRecorder.stop();
    }

    const handleData = event => {
      setAudioBlob(event.data);
      setAudioURL(URL.createObjectURL(event.data));
    };

    mediaRecorder.addEventListener('dataavailable', handleData);
    return () => mediaRecorder.removeEventListener('dataavailable', handleData);
  }, [mediaRecorder, isRecording]);

  useEffect(() => {
    console.log(audioBlob)
    if (audioBlob && vmIsQuick) {
      handleVoiceMessage();
    }
  }, [audioBlob, vmIsQuick]); // // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const inputElement = document.getElementById('file-input');
    inputElement.addEventListener('change', onImageChange, false);
  }, [])
  const handleChange = (event) => {
    setText(event.target.value);
  }

  const onEmojiClick = (emojiName) => {
    setText(text + ':' + emojiName + ':')
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (imageURL !== '') {
      handleFiles();
    } else if (audioURL !== '') {
      handleVoiceMessage();
    } else if (text !== '') {
      const newMessage = {
        author: 'ReAtlaz',
        text
      }
      props.postMessage(newMessage);
      props.pollCallback();
      setText('');
      props.changeState();
      setImageURL('');
    }
  }
  function handleFiles () {
    const formData = new FormData();
    const fileField = document.getElementById('file-input');
    formData.append('image', fileField.files[0]);
    let imgSrc = null;
    fetch('https://tt-front.vercel.app/upload/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: formData
    })
      .then(resp => resp.json())
      .then(responseJson => {
        // console.log(responseJson.imgSrc)
        imgSrc = responseJson.imgSrc;
        const newMessage = {
          author: 'ReAtlaz',
          text: imgSrc
        }
        props.postMessage(newMessage);
        props.pollCallback();
        setText('');
        props.changeState()
        setImageURL('');
      })
  }

  const handleVoiceMessage = () => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    fetch('https://tt-front.vercel.app/upload/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: formData
    })
      .then(resp => resp.json())
      .then(responseJson => {
        console.log(responseJson)
        const audioSrc = responseJson.audioSrc;
        const newMessage = {
          author: 'ReAtlaz',
          text: audioSrc
        }
        console.log('new message', newMessage)
        props.postMessage(newMessage);
        props.pollCallback();
        if (vmIsQuick) {
          setVmIsQuick(false);
        } else {
          setText('');
        }
        setAudioURL('');
        props.changeState()
      })
  }
  const dropHandler = (event) => {
    event.preventDefault();
    console.log('File(s) dropped');
    const inputElement = document.getElementById('file-input');
    inputElement.files = event.dataTransfer.files;
    setImageURL(URL.createObjectURL(event.dataTransfer.files[0]));
    setAudioURL('');
    setIsOver(false);
  }
  const dragOverHandler = (event) => {
    event.preventDefault();
    setIsOver(true);
  }
  const dragLeaveHandler = (event) => {
    event.preventDefault();
    setIsOver(false);
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0])
      setImageURL(URL.createObjectURL(event.target.files[0]));
      setAudioURL('');
    }
  }
  const sendLocation = () => {
    console.log('trying to send location');
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const newMessage = {
        author: 'ReAtlaz',
        text: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
      }
      props.postMessage(newMessage);
      props.pollCallback();
    });
    console.log('location sent');
  }

  const startRecording = () => {
    setIsRecording(true);
  }

  const quickSendVM = () => {
    setVmIsQuick(true);
    setIsRecording(false);
  }

  const stopRecording = () => {
    setIsRecording(false);
    setAudioURL('');
    setImageURL('');
  }
  return (
    <form className="form" onSubmit={handleSubmit}>
      {
        (imageURL || audioURL) && !vmIsQuick && <div className="attachments">
          {imageURL && <img className="attachment-preview" src={imageURL} alt="img attachment preview" />}
          {audioURL && <audio className="attachment-preview" src={audioURL} alt="audio attachment preview" controls/>}
          <Button
          value='close'
          className='attach-button'
          onClick={() => { setImageURL(''); setAudioURL('') }}
          />
        </div>
      }
      <div className={isOver ? 'over' : 'text-input'} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler}>
        <input className="message-input"
          placeholder="Cообщение"
          onChange={handleChange}
          value={text}
        />
        {emojiKeyboardVisible && <EmojiKeyboard

          onEmojiClick={onEmojiClick}
          emojiNames={props.emojiNames}

        />}
        {isRecording && <Button
          value='arrow_upward'
          className='voice-recording'
          onClick={quickSendVM}
        />}
        <Button
          value='mood'
          className='attach-button'
          onClick={() => setEmojiKeyboardVisible(!emojiKeyboardVisible)}
        />
        <Button
          value='location_on'
          className='attach-button'
          onClick={sendLocation}
        />
        <label
          htmlFor="file-input"
          className='attach-file-button attach-button'
          >
          <Icon className='icon' fontSize='30px'>
            attach_file
          </Icon>
        </label>
        <input type="file" onChange={onImageChange} accept='image/*' id='file-input' hidden/>
        <Button
          value={isRecording ? 'stop' : 'mic'}
          className='attach-button'
          onClick={isRecording ? stopRecording : startRecording}
        />
      </div>
    </form>
  )
}

export function PageGeneralChat (props) {
  // import for notifications support
  PageChatList(props);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  const emojiNames = [
    'angry-face',
    'anguished-face',
    'anxious-face-with-sweat',
    'astonished-face',
    'eyes',
    'video-game'
  ]
  const postMessage = (data) => {
    fetch('https://tt-front.vercel.app/message/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(data => {
        pollCallback(); // get the newly sent message from server
        console.log(data)
      },
      (error) => setError(error));
  }
  const pollCallback = useCallback(() => {
    fetch('https://tt-front.vercel.app/messages/', {
      mode: 'cors',
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        setMessages(data);
        localStorage.setItem('messagesGeneral', JSON.stringify(data));
      },
      (error) => {
        setError(error);
      });
  }, [])
  useEffect(() => {
    const localStorageMessages = JSON.parse(localStorage.getItem('messagesGeneral'));
    if (localStorageMessages != null) {
      setMessages(localStorageMessages);
    }
    pollCallback();
    const t = setInterval(() => pollCallback(), 3000);
    return () => clearInterval(t)
  }, [pollCallback]);
  const changeState = (props) => {
    setMessages(JSON.parse(localStorage.getItem('messagesGeneral')))
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div className='page-chat'>
        <nav>
          <Button
            className='nav-button'
            value='arrow_back'
            goTo={'/im'}
          />
          <Link className="chat-heading"
          // to={'/user/' + id}
          >
            <img
              src={vkfs}
              className="user-avatar"
              alt="Not found"
            />
            <div className="receiver-text">
              <div className="username">
                  Общий чат
              </div>
              {/* <div className="last-seen"></div> */}
            </div>
          </Link>
          <Button className='nav-button' value='search'/>
          <Button className='nav-button' value='more_vert'/>
        </nav>
        <Messages
          messages={messages}
          emojiNames={emojiNames}
        />
        <MessageInputForm
          emojiNames={emojiNames}
          changeState={changeState}

          postMessage={postMessage}
          pollCallback={pollCallback}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  messages: state.messages.messages,
  chats: state.chats.chats,
  lastMessageGeneral: state.lastMessageGeneral.lastMessageGeneral
})

export const ConnectedPageGeneralChat = connect(mapStateToProps, { getMessages, getChats, getLastMessageGeneral })(PageGeneralChat)

function getTimeFromISOString (timestamp) {
  return new Date(timestamp).toLocaleTimeString('ru',
    { timeStyle: 'short', hour12: false, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
}
