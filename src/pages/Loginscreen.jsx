import React from 'react'
import './Loginscreen.css'
import { useEffect } from 'react'
import image from './image.png'
import { useDispatch, useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom';
import { login } from '../redux/actions/auth.action';

const Loginscreen = () => {
  const dispatch=useDispatch()
  const accessToken=useSelector(state=>state.auth.accessToken)
  const navigate=useNavigate()
  const handlelogin=()=>{
    dispatch(login())
  }
  useEffect(() => {
    if (accessToken) {
      navigate('/home');
    }
  }, [accessToken, navigate]);

  return (
    <div className='login'>
      <div className='login-container'>
        <img
            src={image}
            alt='new'
        />
        <button className='bttn' onClick={handlelogin}>Login With Google</button>
        <p className='pro'>This project is made using YOUTUBE DATA API</p>
      </div>
    </div>
  )
}

export default Loginscreen;
