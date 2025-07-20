import {
  LOAD_PROFILE,
  LOG_OUT,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
} from "../actionType";

const initialState = {
  accessToken: sessionStorage.getItem("ytc-access-token") || null,
  user: sessionStorage.getItem("ytc-user")
    ? JSON.parse(sessionStorage.getItem("ytc-user"))
    : null,
  loading: false,
};

export const authReducer = (prevState = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_REQUEST:
      return {
        ...prevState,
        loading: true,
      };

    case LOGIN_SUCCESS:
      sessionStorage.setItem("ytc-access-token", payload); 
      return {
        ...prevState,
        accessToken: payload,
        loading: false,
      };

    case LOAD_PROFILE:
      sessionStorage.setItem("ytc-user", JSON.stringify(payload)); 
      return {
        ...prevState,
        user: payload,
      };

    case LOGIN_FAIL:
      sessionStorage.removeItem("ytc-access-token");
      sessionStorage.removeItem("ytc-user");
      return {
        ...prevState,
        accessToken: null,
        user: null,
        loading: false,
        error: payload,
      };

    case LOG_OUT:
      sessionStorage.removeItem("ytc-access-token");
      sessionStorage.removeItem("ytc-user");
      return {
        ...prevState,
        accessToken: null,
        user: null,
      };

    default:
      return prevState;
  }
};
