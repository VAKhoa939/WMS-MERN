import "../../../css/InfoPage.css";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMainRef, useScrollToMain } from "../../context/MainRefContext";
import { getUsers, User } from "../../interfaces/User";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { FaAngleLeft } from "react-icons/fa";
import {
  Address,
  AddressRequest,
  deleteAddress,
  getAddressById,
  updateAddress,
} from "../../interfaces/Address";
import NavLookup from "../../utils/navigateLookup";
import { isErrorWithMessage } from "../../utils/handleError";

const AddressInfoPage = () => {
  const [formData, setFormData] = useState<Address>({} as Address);
  const [mode, setMode] = useState<"info" | "update">("info");
  const { authState } = useAuth();
  const location = useLocation();
  const id = location.pathname.split("/").pop() as string;
  const ICON_SIZE = 20;

  const navigate = useNavigate();
  const mainRef = useMainRef();
  useScrollToMain();

  const {
    data: users,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useQuery<User[]>({
    queryFn: async () => getUsers(authState.accessToken),
    queryKey: ["users"],
  });

  const {
    data,
    isLoading: isLoadingAddress,
    error: errorAddress,
  } = useQuery<Address>({
    queryFn: async () =>
      getAddressById(id, authState.accessToken, users as User[]),
    queryKey: ["address", id, users],
    enabled: !!users && users.length > 0,
  });

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const updateAddressMutation = useMutation(
    (data: {
      id: string;
      address: AddressRequest;
      accessToken: string | null;
    }) => updateAddress(data.id, data.address, data.accessToken),
    {
      onSuccess: () => {
        console.log("Cập nhật địa chỉ nhà kho thành công"); // toast here
        setMode("info");
      },
      onError: (error: Error) => {
        if (isErrorWithMessage(error)) console.log(error.message); // toast here
      },
    }
  );

  const deleteAddressMutation = useMutation(
    (data: { id: string; accessToken: string | null }) =>
      deleteAddress(data.id, data.accessToken),
    {
      onSuccess: () => {
        console.log("Xóa địa chỉ nhà kho thành công"); // toast here
        navigate(NavLookup.ADDRESS_BASE_PATH);
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

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, _id } = users?.find(
      (user) => user._id === e.target.value
    ) as User;
    console.log(name, _id);
    setFormData((prevState) => ({
      ...prevState,
      responsible_user: _id,
      responsible_user_name: name,
    }));
  }

  async function handleSubmit(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      responsible_user_name,
      ...filteredData
    } = formData;

    const addressRequest = { ...filteredData } as AddressRequest;
    console.log(addressRequest);

    updateAddressMutation.mutate({
      id,
      address: addressRequest,
      accessToken: authState.accessToken,
    });
  }

  async function handleDelete(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    deleteAddressMutation.mutate({ id, accessToken: authState.accessToken });
  }

  const InfoMode = (): ReactNode => {
    return (
      <div className="info-body">
        <div className="normal-info">
          <div className="info-container">
            <div className="info-header">Mã nhà kho: </div>
            <p>{formData.building_id}</p>
          </div>
          <div className="info-container">
            <div className="info-header">Tên nhà kho: </div>
            <p>{formData.building_name}</p>
          </div>
          <div className="info-container">
            <div className="info-header">Sức chứa tối đa của nhà kho: </div>
            <p>{formData.maximum_capacity}</p>
          </div>
          <div className="info-container">
            <div className="info-header">Người chịu trách nhiệm: </div>
            <p>{`${formData.responsible_user_name} - ${
              users?.find((user) => user._id === formData.responsible_user)
                ?.user_id
            }`}</p>
          </div>
        </div>
        <div className="button-container">
          <button className="update-btn" onClick={() => setMode("update")}>
            Cập nhật thông tin
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Xóa địa chỉ nhà kho
          </button>
        </div>
      </div>
    );
  };

  const UpdateMode = (): ReactNode => {
    return (
      <form className="info-body">
        <div className="normal-info">
          <div className="info-container">
            <div className="info-header">Mã nhà kho: </div>
            <input
              type="text"
              name="building_id"
              value={formData.building_id}
              readOnly
            />
          </div>
          <div className="info-container">
            <div className="info-header">Tên nhà kho: </div>
            <input
              type="text"
              name="building_name"
              value={formData.building_name}
              onChange={handleChange}
            />
          </div>
          <div className="info-container">
            <div className="info-header">Sức chứa tối đa của nhà kho: </div>
            <input
              type="number"
              name="maximum_capacity"
              value={formData.maximum_capacity}
            />
          </div>
          <div className="info-container">
            <div className="info-header">Người chịu trách nhiệm: </div>
            <select
              id="dropdown"
              className="dropdown"
              name="responsible_user"
              onChange={handleSelect}
            >
              <option>Chọn người chịu trách nhiệm</option>
              {users?.map((user) => (
                <option
                  value={user._id}
                  selected={user._id === formData.responsible_user}
                >{`${user.name} - ${user.user_id}`}</option>
              ))}
            </select>
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

  if (errorUsers && isErrorWithMessage(errorUsers)) {
    console.log(errorUsers.message); // toast here
  } else if (errorAddress && isErrorWithMessage(errorAddress)) {
    console.log(errorAddress.message); // toast here
  }

  return (
    <main ref={mainRef} className="info-page">
      <div className="container">
        <div className="layout">
          <div
            className="back-button"
            onClick={() => navigate(NavLookup.ADDRESS_BASE_PATH)}
          >
            <FaAngleLeft size={ICON_SIZE} />
            <p>Trở về</p>
          </div>
          <h1 className="title">
            {mode === "info" ? "Thông Tin" : "Cập Nhật"} Nhà Kho
          </h1>
          {isLoadingAddress || isLoadingUsers ? (
            <Loader />
          ) : mode === "info" ? (
            InfoMode()
          ) : (
            UpdateMode()
          )}
        </div>
      </div>
    </main>
  );
};

export default AddressInfoPage;
