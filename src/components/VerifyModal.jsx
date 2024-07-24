import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/actions/authActions";

const VerifyModal = ({ isOpen, onClose, email, onSuccess }) => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const [isModalUserOpen, setModalUserOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState("");
  const inputRefs = useRef([]);

  const openModalUser = () => {
    setModalUserOpen(true);
  };

  const closeModalUser = () => {
    setModalUserOpen(false);
  };

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
        console.log("Verification Response:", data);
        if (
          data.message ===
          "OTP verified and user information updated successfully!"
        ) {
          const { token, userId } = data;
          setToken(token);
          dispatch(loginSuccess(token, userId));
          setMessage(data.message);
          onClose();
          onSuccess(userId);
          openModalUser();
        } else {
          setMessage("Unexpected response from server.");
        }
      } else {
        const errorData = await response.json();
        console.error("Error verifying OTP:", errorData);
        setMessage("Error verifying OTP. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error verifying OTP. Please try again later.");
    }
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const gender = formData.get("gender");
    setUserName(name);
    setUserGender(gender);
    closeModalUser();
    onSuccess(name, gender);
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
      {isModalUserOpen && (
        <div id="myModalUser" className="modal2">
          <div className="modal-content2">
            <button className="close2" onClick={closeModalUser}>
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
      )}
    </div>
  );
};

export default VerifyModal;
