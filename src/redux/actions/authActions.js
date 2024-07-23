import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const loginSuccess = (token) => {
  console.log("Token received:", token);

  if (!token || token.split(".").length !== 3) {
    console.error("Invalid token format");
    return { type: "INVALID_TOKEN" };
  }

  Cookies.set("accessToken", token, { expires: 7 });

  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode token", error);
    return { type: "INVALID_TOKEN" };
  }

  const { userId, fullname, gender, role, email } = decodedToken;
  Cookies.set("userInfo", JSON.stringify(decodedToken), { expires: 7 });
  
  return {
    type: "LOGIN_SUCCESS",
    payload: { token, userId, fullname, gender, role, email },
  };
};

export const logout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("userInfo");

  return {
    type: "LOGOUT",
  };
};
