import { auth } from '../../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import {
  LOAD_PROFILE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOG_OUT,
} from '../actionType';
import { Navigate } from 'react-router-dom';

export const login = () => async (dispatch) => {
  try {
    dispatch({
      type: LOGIN_REQUEST,
    });

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const accessToken = result.user.accessToken || result._tokenResponse.oauthAccessToken;
    const profile = {
      name: result.user.displayName,
      photoURL: result.user.photoURL,
      email:result.user.email,
      uid:result.user.uid,
    };
    sessionStorage.setItem("ytc-access-token",accessToken)
    sessionStorage.setItem("ytc-user",JSON.stringify(profile))
    dispatch({
      type: LOGIN_SUCCESS,
      payload: accessToken,
    });

    dispatch({
      type: LOAD_PROFILE,
      payload: profile,
    });
    
  } catch (error) {
    console.error('Login failed:', error);
    dispatch({
      type: LOGIN_FAIL,
      payload: error.message,
    });
  }
};
export const logout=()=>async dispatch=>{
 await auth.signOut()
 dispatch({
  type:LOG_OUT,

 })
 sessionStorage.removeItem("ytc-access-token")
 sessionStorage.removeItem("ytc-user")
}



