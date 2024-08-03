// VerifyModal.js
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, updateUser } from "../redux/actions/authActions";

const VerifyModal = ({
  isOpen,
  onClose,
  email,
  onSuccess,
  handleUserUpdate,
}) => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState("");
  const inputRefs = useRef([]);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setUserName(user.fullname);
      setUserGender(user.gender);
    }
  }, [user]);

  const handleChange = (index, value) => {
    if (/[0-9]/.test(value) || value === "") {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      if (value !== "" && index < otpDigits.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    try {
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/otp/verify/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (
          data.message ===
          "OTP verified and user information updated successfully!"
        ) {
          const { token, userId } = data;
          dispatch(loginSuccess(token));
          setMessage(data.message);
          onClose();
          onSuccess(userId);
        } else {
          setMessage("Unexpected response from server.");
        }
      } else {
        const errorData = await response.json();
        setMessage("Error verifying OTP. Please try again later.");
      }
    } catch (error) {
      setMessage("Error verifying OTP. Please try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <div id="myModal" className="modal2">
      <div className="modal-content2">
        <button className="close2" onClick={onClose}>
          &times;
        </button>
        <div className="modal_info">
          <div className="choice2">Kodu daxil edin</div>
          <form onSubmit={handleSubmitOtp}>
            <div className="formInput">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  autoFocus={index === 0}
                  className="otp-input"
                />
              ))}
            </div>
            <button type="submit" className="continueBtn">
              Davam et
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
      <div id="myModalUser" className="modal2">
        <div className="modal-content2">
          <button className="close2" onClick={onClose}>
            &times;
          </button>
          <div className="modal_info2">
            <div className="choice2">Update User Information</div>
            <form onSubmit={handleUserUpdate}>
              <div>
                <input
                  type="text"
                  placeholder="Ad və Soyad"
                  name="name"
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
                />
              </div>
              <div>
                <label htmlFor="male">Kişi</label>
                <input
                  type="radio"
                  name="gender"
                  id="male"
                  value="male"
                  checked={userGender === "male"}
                  onChange={() => setUserGender("male")}
                />
                <label htmlFor="female">Qadın</label>
                <input
                  type="radio"
                  name="gender"
                  id="female"
                  value="female"
                  checked={userGender === "female"}
                  onChange={() => setUserGender("female")}
                />
              </div>
              <div className="continue">
                <button className="continueBtn" type="submit">
                  Yadda saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyModal;
