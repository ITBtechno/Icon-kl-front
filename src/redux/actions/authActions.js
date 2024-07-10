import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const loginSuccess = (token) => {
  console.log("Token received:", token);
  Cookies.set("accessToken", token, { expires: 7 });
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const fullname = decodedToken.fullname;
  const gender = decodedToken.gender;

  return {
    type: "LOGIN_SUCCESS",
    payload: { token, userId, fullname, gender },
  };
};

export const logout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("userFullName");
  Cookies.remove("userGender");

  return {
    type: "LOGOUT",
  };
};
