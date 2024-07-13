const initialState = {
  token: null,
  userId: null,
  fullname: null,
  gender: null,
  role: null,
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        fullname: action.payload.fullname,
        gender: action.payload.gender,
        role: action.payload.role,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        token: null,
        userId: null,
        fullname: null,
        gender: null,
        role: null,
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
