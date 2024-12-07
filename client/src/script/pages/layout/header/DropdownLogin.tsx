import "../../../../css/Header.css";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavLookup from "../../../utils/navigateLookup";

const DropdownLogin = () => {
  const { logout, authState } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {authState.email ? (
        <div className="dropdown">
          <button>
            <FaUserCircle className="user-icon" size={30} />
            <p>{authState.email}</p>
          </button>
          <ul className="dropdown-menu">
            <li
              onClick={() =>
                navigate(`${NavLookup.USER_BASE_PATH}/${authState.id}`)
              }
            >
              <p>Trang cá nhân</p>
            </li>
            <li
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <p>Đăng xuất</p>
            </li>
          </ul>
        </div>
      ) : (
        <button onClick={() => navigate("/login")}>Đăng nhập</button>
      )}
    </>
  );
};

export default DropdownLogin;
