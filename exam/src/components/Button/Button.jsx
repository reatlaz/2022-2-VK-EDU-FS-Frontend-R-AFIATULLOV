import React from 'react';
import {Link} from 'react-router-dom'
import './Button.css';
import { Icon } from '@mui/material';

export function Button(props) {
  return (
    <Link
      className={props.className}
      to={props.goTo}
      onClick={props.onClick}
    >
      <Icon className='material-symbols-outlined' fontSize='50px'>
        {props.value}
      </Icon>
    </Link>
  );
}