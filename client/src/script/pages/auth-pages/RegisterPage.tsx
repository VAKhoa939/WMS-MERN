import React, { useState } from "react";
import "../../../css/AuthPages.css";
import { useNavigate } from "react-router-dom";
import { useAuth, RegisterUser } from "../../context/AuthContext";
import { useMainRef, useScrollToMain } from "../../context/MainRefContext";

const RegisterPage = () => {
  const mainRef = useMainRef();
  const [registerUser, setRegisterUser] = useState<RegisterUser>(
    {} as RegisterUser
  );
  const [cPassword, setCPassword] = useState<string>("");
  const { register } = useAuth();
  const navigate = useNavigate();

  useScrollToMain();

  function onChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "confirm-password") {
      setCPassword(event.target.value);
      return;
    }
    setRegisterUser((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const success = await register(registerUser);
    if (success) {
      navigate("/login");
    }
  }

  return (
    <main className="auth-page" ref={mainRef}>
      <div className="auth-section">
        <form method="post" className="auth-form">
          <div className="input-area">
            <div className="input-container">
              <p>Tên tài khoản</p>
              <input
                type="text"
                name="name"
                value={registerUser.name}
                onChange={(e) => onChangeInput(e)}
              />
            </div>
          </div>
          <div className="input-area">
            <div className="input-container">
              <p>Email</p>
              <input
                type="text"
                name="email"
                value={registerUser.email}
                onChange={(e) => onChangeInput(e)}
              />
            </div>
          </div>
          <div className="input-area">
            <div className="input-container">
              <p>Mật khẩu</p>
              <input
                type="password"
                name="password"
                value={registerUser.password}
                onChange={(e) => onChangeInput(e)}
              />
            </div>
          </div>
          <div className="input-area">
            <div className="input-container">
              <p>Nhập lại mật khẩu</p>
              <input
                type="password"
                name="confirm-password"
                value={cPassword}
                onChange={(e) => onChangeInput(e)}
              />
            </div>
          </div>
          <div className="register-btn" onClick={handleLogin}>
            Đăng ký
          </div>
          <p>Nếu bạn đã có tài khoản, hãy nhấn vào nút phía dưới.</p>
          <div className="submit-btn" onClick={() => navigate("/login")}>
            Trở về trang đăng nhập
          </div>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;
