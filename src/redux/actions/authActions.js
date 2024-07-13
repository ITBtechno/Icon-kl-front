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

  const { userId, fullname, gender, role } = decodedToken;
  return {
    type: "LOGIN_SUCCESS",
    payload: { token, userId, fullname, gender, role },
  };
};

export const logout = () => {
  Cookies.remove("accessToken");

  return {
    type: "LOGOUT",
  };
};
