import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Icon } from '@mui/material';
import './PageProfile.scss';
import { Button } from '../../components';
import barsiq from '../../images/barsiq.png';
import billy from '../../images/billy.jpeg';
import smesh from '../../images/смешнявкин.JPG';

function ProfileInputForm (props) {
  const [fullName, setFullName] = useState(
    (props.userId === '1' && 'Барсик Пушистикович') ||
    (props.userId === '2' && 'Billy') ||
    (props.userId === '3' && '404 NOT FOUND')
  );
  const [username, setUsername] = useState(
    (props.userId === '1' && '@barsiq') ||
    (props.userId === '2' && '@billy99') ||
    (props.userId === '3' && '@class10a'));
  const [bio, setBio] = useState(
    (props.userId === '1' && 'I like frogsdgdfgdfgdfgdfgdsfgdfgdfgdfsgdfgdfgdfgdfgdfgdfgdfgdfgdsfgdfsgsdgfdsfg sfsfsdfsdfsd fsdf sdf sdfsd fs') ||
            (props.userId === '2' && 'Performance artist') ||
            (props.userId === '3' && 'Вообще это не пользователь, но для полноты картины я добавил '));

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  }
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }
  const handleBioChange = (event) => {
    setBio(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fullName !== '' || username !== '' || bio !== '') {
      if (username[0] !== '@') {
        setUsername('@' + username)
      }
      if (username.length < 5) {
        alert('Minimum username length is 5 characters')
        return
      }
      // const newProfile = {
      //   fullName: fullName,
      //   username: username,
      //   bio: bio,
      // };
    }
    // insert for submission logic here
    console.log('form submitted');
  }

  return (
    <form id="profile-form" onSubmit={handleSubmit}>
      <div className='edit-picture'>
        <img
          src={
            (props.userId === '1' && barsiq) ||
            (props.userId === '2' && billy) ||
            (props.userId === '3' && smesh)
            }
          className="profile-avatar"
          alt="Not found"
        />
        <div className='avatar-button'>
          <Icon className='edit-avatar-icon'>
            photo_camera
          </Icon>
        </div>
      </div>
      <div className="profile-form-input" id='full-name'>
        <div className='profile-input-header'>
          Full name
        </div>
        <div className='profile-input-container'>
          <input
          onChange={handleFullNameChange}
          value={fullName}
          />
        </div>
      </div>
      <div className="profile-form-input" id='username'>
        <div className='profile-input-header'>
          Username
        </div>
        <div className='profile-input-container'>
          <input
          onChange={handleUsernameChange}
          value={username}
          />
        </div>
        <div className='profile-input-footer'>
          Minimum length is 5 characters
        </div>
      </div>
      <div className="profile-form-input" id='bio'>
        <div className='profile-input-header'>
          Bio
        </div>
        <div className='profile-input-container'>
          <textarea
          onChange={handleBioChange}
          value={bio}
          />
        </div>
        <div className='profile-input-footer'>
          Any details about you
        </div>
      </div>
    </form>
  )
}

export function PageProfile () {
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <div className='page-chat'>
      <nav>
        <Button
          className='nav-button'
          value='arrow_back'
          goTo={'/im/' + id}
        />
        <div className="heading">
          Edit Profile
        </div>
        <button form='profile-form' className='nav-button'>
          <Icon className='icon' fontSize='30px'>
            done
          </Icon>
        </button>
      </nav>
      <div className='profile-form'>
        <ProfileInputForm userId={id}/>
      </div>
    </div>
  );
}
