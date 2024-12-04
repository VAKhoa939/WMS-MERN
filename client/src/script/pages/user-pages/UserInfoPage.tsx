import "../../../css/InfoPage.css";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMainRef, useScrollToMain } from "../../context/MainRefContext";
import {
  changeStatusUser,
  deleteUser,
  getUserById,
  updateUser,
  User,
} from "../../interfaces/User";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { FaAngleLeft, FaCircle } from "react-icons/fa";
import NavLookup from "../../utils/navigateLookup";

const UserInfoPage = () => {
  const [formData, setFormData] = useState<User>({} as User);
  const [mode, setMode] = useState<"info" | "update">("info");
  const { refreshAccessToken, accessToken, _id: accountId, admin } = useAuth();
  const location = useLocation();
  const id = location.pathname.split("/").pop() as string;
  const isMyAccount = id === accountId;
  const ICON_SIZE = 20;

  const { data, isLoading } = useQuery<User>({
    queryFn: async () => {
      let token = accessToken;
      if (!token) {
        token = await refreshAccessToken();
        if (!token) {
          throw new Error("Unable to refresh access token");
        }
      }
      return getUserById(id, token);
    },
    queryKey: ["user", id],
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const navigate = useNavigate();
  const mainRef = useMainRef();
  useScrollToMain();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }

  async function handleSubmit(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    let token = accessToken;
    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        throw new Error("Unable to refresh access token");
      }
    }
    const result = await updateUser(id, formData, token);
    if (result) setMode("info");
  }

  async function handleDelete(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    let token = accessToken;
    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        throw new Error("Unable to refresh access token");
      }
    }
    const result = await deleteUser(
      id,
      accountId as string,
      admin as boolean,
      token
    );
    if (result) {
      if (isMyAccount) window.location.reload();
      else navigate(NavLookup.USER_BASE_PATH);
      console.log("Deleted user:", id);
    } else console.log("Failed to delete user:", id);
  }

  async function handleStatus(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    let token = accessToken;
    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        throw new Error("Unable to refresh access token");
      }
    }
    const result = await changeStatusUser(
      id,
      accountId as string,
      admin as boolean,
      token
    );
    if (result) {
      window.location.reload();
      console.log("Changed status:", id);
    } else console.log("Failed to change status:", id);
  }

  const InfoMode = (): ReactNode => {
    return (
      <div className="info-body">
        <div className="long-info">
          <div className="info-header">Tên tài khoản: </div>
          <p>{formData.name}</p>
        </div>
        <div className="long-info">
          <div className="info-header">ID tài khoản: </div>
          <p>{formData.user_id}</p>
        </div>
        <div className="normal-info">
          <div className="info-container">
            <div className="info-header">Email:</div>
            <p>{formData.email}</p>
          </div>
          <div className="info-container">
            <div className="info-header">Số điện thoại:</div>
            <p>{formData.phone_number || "Không có"}</p>
          </div>
          <div className="info-container">
            <div className="info-header">Chức vụ:</div>
            <p>{formData.position || "Không có"}</p>
          </div>
          <div className="info-container">
            <div className="info-header">Trạng thái:</div>
            <p>
              <FaCircle
                size={ICON_SIZE}
                color={formData.is_active ? "green" : "red"}
              />{" "}
              {formData.status}
            </p>
            {admin && !isMyAccount && (
              <button className="status-btn" onClick={handleStatus}>
                Chuyển trạng thái
              </button>
            )}
          </div>
        </div>
        {(isMyAccount || admin) && (
          <div className="button-container">
            <button className="update-btn" onClick={() => setMode("update")}>
              Cập nhật thông tin
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Xóa tài khoản
            </button>
          </div>
        )}
      </div>
    );
  };

  const UpdateMode = (): ReactNode => {
    return (
      <form className="info-body">
        <div className="long-info">
          <div className="info-header">Tên tài khoản: </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="long-info">
          <div className="info-header">ID tài khoản: </div>
          <input
            type="text"
            name="userid"
            className="read-only"
            value={formData.user_id}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="normal-info">
          <div className="info-container">
            <div className="info-header">Email:</div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="info-container">
            <div className="info-header">Số điện thoại:</div>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
          <div className="info-container">
            <div className="info-header">Chức vụ:</div>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>
          <div className="info-container">
            <div className="info-header">Trạng thái:</div>
            <input
              type="text"
              name="role"
              value={formData.status}
              onChange={handleChange}
              readOnly
            />
          </div>
        </div>
        <div className="button-container">
          <button className="submit-btn" onClick={handleSubmit}>
            Lưu thông tin
          </button>
          <button className="cancel-btn" onClick={() => setMode("info")}>
            Hủy cập nhật
          </button>
        </div>
      </form>
    );
  };

  return (
    <main ref={mainRef} className="info-page">
      <div className="container">
        <div className="layout">
          <div
            className="back-button"
            onClick={() => navigate(NavLookup.USER_BASE_PATH)}
          >
            <FaAngleLeft size={ICON_SIZE} />
            <p>Trở về</p>
          </div>
          <h1 className="title">
            {mode === "info" ? "Thông Tin" : "Cập Nhật"} Người Dùng
          </h1>
          {isLoading ? <Loader /> : mode === "info" ? InfoMode() : UpdateMode()}
        </div>
      </div>
    </main>
  );
};

export default UserInfoPage;
