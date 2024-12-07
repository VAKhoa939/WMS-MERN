import "../../../css/InfoPage.css";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { isErrorWithMessage } from "../../utils/handleError";

const UserInfoPage = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<User>({} as User);
  const [mode, setMode] = useState<"info" | "update">("info");
  const { authState } = useAuth();
  const location = useLocation();
  const id = location.pathname.split("/").pop() as string;
  const isMyAccount = id === authState.id;
  const ICON_SIZE = 20;

  const navigate = useNavigate();
  const mainRef = useMainRef();
  useScrollToMain();

  const { data, isLoading, error } = useQuery<User>({
    queryFn: async () => getUserById(id, authState.accessToken),
    queryKey: ["user", id],
  });

  if (error && isErrorWithMessage(error)) console.log(error.message); // toast here

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const updateUserMutation = useMutation(
    (data: { id: string; user: User; accessToken: string | null }) =>
      updateUser(data.id, data.user, data.accessToken),
    {
      onSuccess: () => {
        console.log("Cập nhật người dùng thành công"); // toast here
        setMode("info");
      },
      onError: (error: Error) => {
        if (isErrorWithMessage(error)) console.log(error.message);
      },
    }
  );

  const deleteUserMutation = useMutation(
    (data: {
      targetId: string;
      accoundId: string | null;
      admin: boolean | null;
      accessToken: string | null;
    }) =>
      deleteUser(data.targetId, data.accoundId, data.admin, data.accessToken),
    {
      onSuccess: () => {
        console.log("Xóa người dùng thành công"); // toast here
        if (isMyAccount) navigate("/login");
        else navigate(NavLookup.USER_BASE_PATH);
      },
      onError: (error: Error) => {
        if (isErrorWithMessage(error)) console.log(error.message);
      },
    }
  );

  const changeStatusMutation = useMutation(
    (data: {
      targetId: string;
      accoundId: string | null;
      admin: boolean | null;
      accessToken: string | null;
    }) =>
      changeStatusUser(
        data.targetId,
        data.accoundId,
        data.admin,
        data.accessToken
      ),
    {
      onSuccess: () => {
        console.log("Chuyển đổi trạng thái người dùng thành công"); // toast here
        queryClient.invalidateQueries(["user"]);
      },
      onError: (error: Error) => {
        if (isErrorWithMessage(error)) console.log(error.message);
      },
    }
  );

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
    updateUserMutation.mutate({
      id,
      user: formData,
      accessToken: authState.accessToken,
    });
  }

  async function handleDelete(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    deleteUserMutation.mutate({
      targetId: id,
      accoundId: authState.id,
      admin: authState.admin,
      accessToken: authState.accessToken,
    });
  }

  async function handleStatus(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    changeStatusMutation.mutate({
      targetId: id,
      accoundId: authState.id,
      admin: authState.admin,
      accessToken: authState.accessToken,
    });
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
            {authState.admin && !isMyAccount && (
              <button className="status-btn" onClick={handleStatus}>
                Chuyển trạng thái
              </button>
            )}
          </div>
        </div>
        {(isMyAccount || authState.admin) && (
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
