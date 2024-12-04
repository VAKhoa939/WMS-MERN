import { useNavigate } from "react-router-dom";
import "../../../css/HomePage.css";
import homepagebg from "../../../assets/homepagebg.png";
import NavLookup from "../../utils/navigateLookup";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <main className="homepage">
      <div className="homepage-content">
        <h1>Phần Mềm Quản Lý Nhà Kho</h1>
        <button
          className="go-to-dashboard-btn"
          onClick={() => navigate(NavLookup.GOODS_BASE_PATH)}
        >
          Đến bảng điều khiển
        </button>
      </div>
      <img className="bg-image" src={homepagebg} />
    </main>
  );
};

export default HomePage;
