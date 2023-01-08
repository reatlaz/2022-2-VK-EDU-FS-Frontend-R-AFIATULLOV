import React from 'react';
import { Link } from 'react-router-dom'
import './Button.scss';
import { Icon } from '@mui/material';

export function Button (props) {
  return (
    <Link
      className={props.className}
      to={props.goTo}
      onClick={props.onClick}
    >
      <Icon className='icon' fontSize='30px'>
        {props.value}
      </Icon>
    </Link>
  );
}
