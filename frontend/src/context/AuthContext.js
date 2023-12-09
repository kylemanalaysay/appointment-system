import { createContext, useEffect, useReducer } from "react";


const INITIAL_STATE = {
  existingUser: JSON.parse(localStorage.getItem("existingUser")) || null,
  token: localStorage.getItem('token') || null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        existingUser: null,
        token: null,
      };
    case "LOGIN_SUCCESS":
      localStorage.setItem('existingUser', JSON.stringify(action.payload.existingUser));
      localStorage.setItem('token', action.payload.token);
      return {
        existingUser: action.payload.existingUser,
        token: action.payload.token,
      };
    case "LOGOUT":
      localStorage.removeItem('existingUser'); 
      localStorage.removeItem('token');
      return {
        existingUser: null,
        token: null,
      };
    default:
      return state;
  }
};


export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem('existingUser', JSON.stringify(state.existingUser))
    localStorage.setItem('token', state.token)
  },[state])

  return (
    <AuthContext.Provider
      value={{
        existingUser: state.existingUser,
        token:state.token,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};