import "../../../css/InfoPage.css";
import { useMainRef, useScrollToMain } from "../../context/MainRefContext";
import { useAuth } from "../../context/AuthContext";
import { FaAngleLeft } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddressRequest, createAddress } from "../../interfaces/Address";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUsers, User } from "../../interfaces/User";
import Loader from "../../components/Loader";
import NavLookup from "../../utils/navigateLookup";
import { isErrorWithMessage } from "../../utils/handleError";

const CreateAddressPage = () => {
  const [formData, setFormData] = useState<AddressRequest>(
    {} as AddressRequest
  );
  const { authState } = useAuth();
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

  const createAddressMutation = useMutation(
    (data: { address: AddressRequest; accessToken: string | null }) =>
      createAddress(data.address, data.accessToken),
    {
      onSuccess: () => {
        console.log("Tạo địa chỉ nhà kho thành công"); // toast here
        navigate(NavLookup.ADDRESS_BASE_PATH);
      },
      onError: (error: Error) => {
        if (isErrorWithMessage(error)) console.log(error.message); // toast here
      },
    }
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;
    const value =
      typeof e.target.value === "number"
        ? Number(e.target.value)
        : e.target.value;
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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    createAddressMutation.mutate({
      accessToken: authState.accessToken,
      address: formData,
    });
  }

  if (errorUsers && isErrorWithMessage(errorUsers)) {
    console.log(errorUsers.message); // toast here
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
          <h1 className="title">Tạo Địa Chỉ Nhà Kho Mới</h1>
          {isLoadingUsers ? (
            <Loader />
          ) : (
            <form className="info-body">
              <div className="long-info">
                <div className="info-header">Tên nhà kho: </div>
                <input
                  type="text"
                  name="building_name"
                  value={formData.building_name}
                  onChange={handleChange}
                />
              </div>
              <div className="long-info">
                <div className="info-header">Sức chứa tối đa của nhà kho: </div>
                <input
                  type="number"
                  name="maximum_capacity"
                  value={formData.maximum_capacity}
                  onChange={handleChange}
                />
              </div>
              <div className="long-info">
                <div className="info-header">Người chịu trách nhiệm: </div>
                <select
                  id="dropdown"
                  name="responsible_user"
                  onChange={handleSelect}
                >
                  <option>Chọn người chịu trách nhiệm</option>
                  {users?.map((user) => (
                    <option
                      value={user._id}
                    >{`${user.name} - ${user.user_id}`}</option>
                  ))}
                </select>
              </div>
              <div className="button-container">
                <button className="submit-btn" onClick={handleSubmit}>
                  Tạo địa chỉ phòng
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default CreateAddressPage;
