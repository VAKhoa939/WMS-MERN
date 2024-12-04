import "../../../css/Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaWarehouse, FaUserCircle, FaRobot } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import NavLookup from "../../utils/navigateLookup";

interface Props {
  children: JSX.Element;
}

const Navbar = (props: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showNavbar =
    location.pathname !== "/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/register";
  const ICON_SIZE = 30;

  return showNavbar ? (
    <div className="ams-body">
      <nav className="navbar-bg">
        <div className="navbar-container">
          <ul className="navbar-menu">
            <li
              className={
                location.pathname.startsWith(NavLookup.GOODS_BASE_PATH)
                  ? "active"
                  : ""
              }
              onClick={() => navigate(NavLookup.GOODS_BASE_PATH)}
            >
              <FaWarehouse size={ICON_SIZE} />
              <p>Hàng Hóa</p>
            </li>
            <li
              className={
                location.pathname.startsWith(NavLookup.ADDRESS_BASE_PATH)
                  ? "active"
                  : ""
              }
              onClick={() => navigate(NavLookup.ADDRESS_BASE_PATH)}
            >
              <FaLocationDot size={ICON_SIZE} />
              <p>Nhà Kho</p>
            </li>
            <li
              className={
                location.pathname.startsWith(NavLookup.USER_BASE_PATH)
                  ? "active"
                  : ""
              }
              onClick={() => navigate(NavLookup.USER_BASE_PATH)}
            >
              <FaUserCircle size={ICON_SIZE} />
              <p>Người Dùng</p>
            </li>
            <li
              className={location.pathname.startsWith("/chat") ? "active" : ""}
              onClick={() => navigate("/chat")}
            >
              <FaRobot size={ICON_SIZE} />
              <p>Chat bot</p>
            </li>
          </ul>
        </div>
      </nav>
      {props.children}
    </div>
  ) : (
    <>{props.children}</>
  );
};

export default Navbar;
