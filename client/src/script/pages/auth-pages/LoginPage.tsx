import "../../../css/AuthPages.css";
import { MdOutlineEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, LoginUser } from "../../context/AuthContext";
import { useMainRef, useScrollToMain } from "../../context/MainRefContext";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { isErrorWithMessage } from "../../utils/handleError";

const LoginPage = () => {
  const [loginUser, setLoginUser] = useState<LoginUser>({} as LoginUser);
  const { login } = useAuth();
  const navigate = useNavigate();
  const ICON_SIZE = 32;

  const mainRef = useMainRef();
  useScrollToMain();

  const loginMutation = useMutation(
    (data: { user: LoginUser }) => login(data.user),
    {
      onSuccess: () => {
        console.log("Đăng nhập thành công"); // toast here
        navigate("/");
      },
      onError: (error: Error) => {
        if (isErrorWithMessage(error)) console.log(error.message); // toast here
      },
    }
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;
    const value = e.target.value;
    setLoginUser((prevState) => ({ ...prevState, [name]: value }));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    loginMutation.mutate({ user: loginUser });
  }

  return (
    <main className="auth-page" ref={mainRef}>
      <div className="auth-section">
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-area login-form">
            <MdOutlineEmail size={ICON_SIZE} />
            <div className="input-container">
              <p>Email</p>
              <input
                type="text"
                name="email"
                value={loginUser.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input-area login-form">
            <FaLock size={ICON_SIZE} />
            <div className="input-container">
              <p>Mật khẩu</p>
              <input
                type="password"
                name="password"
                value={loginUser.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="submit-btn" type="submit">
            Đăng Nhập
          </button>
          <p>Nếu bạn là người mới, hãy nhấn vào nút phía dưới.</p>
          <Link to="/register">
            <p className="register-btn">Tạo tài khoản mới</p>
          </Link>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
