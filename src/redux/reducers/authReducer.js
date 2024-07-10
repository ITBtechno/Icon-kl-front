const initialState = {
  token: null,
  userId: null,
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        token: null,
        userId: null,
        isAuthenticated: false,
      };
    case "USER":
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default authReducer;
