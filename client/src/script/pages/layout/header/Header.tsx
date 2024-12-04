import "../../../../css/Header.css";
import DropdownLogin from "./DropdownLogin";
import { useNavigate } from "react-router-dom";
import NavLookup from "../../../utils/navigateLookup";

function Header() {
  const navigate = useNavigate();
  return (
    <header>
      <div className="header-section">
        <h1 onClick={() => navigate("/")}>WMS - Phần mềm quản lý kho hàng</h1>
        <div className="header-nav">
          <button onClick={() => navigate("/")}>Trang chủ</button>
          <button onClick={() => navigate(NavLookup.GOODS_BASE_PATH)}>
            Bảng điều khiển
          </button>
          <DropdownLogin />
        </div>
      </div>
    </header>
  );
}

export default Header;
