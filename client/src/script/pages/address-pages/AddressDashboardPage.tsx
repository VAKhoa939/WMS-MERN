import "../../../css/DashboardPage.css";
import { useQuery } from "@tanstack/react-query";
import { useMainRef, useScrollToMain } from "../../context/MainRefContext";
import Table from "../../components/Table";
import { addressTableColumns } from "../../utils/tableColumns";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { getAddresses } from "../../interfaces/Address";
import { getUsers, User } from "../../interfaces/User";
import NavLookup from "../../utils/navigateLookup";
import { isErrorWithMessage } from "../../utils/handleError";

const AddressDashboardPage = () => {
  const { authState } = useAuth();

  const mainRef = useMainRef();
  useScrollToMain();

  const {
    data: users,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useQuery({
    queryFn: async () => getUsers(authState.accessToken),
    queryKey: ["users"],
  });

  const {
    data: addresses,
    isLoading: isLoadingAddresses,
    error: errorAddresses,
  } = useQuery({
    queryFn: async () => getAddresses(authState.accessToken, users as User[]),
    queryKey: ["addresses", users],
    enabled: !!users && users.length > 0,
  });

  if (errorUsers && isErrorWithMessage(errorUsers)) {
    console.log(errorUsers.message); // toast here
  } else if (errorAddresses && isErrorWithMessage(errorAddresses)) {
    console.log(errorAddresses.message); // toast here
  }

  return (
    <main className="dashboard-page" ref={mainRef}>
      <div className="title">Danh Sách Địa Chỉ Nhà Kho</div>
      {isLoadingUsers ||
      isLoadingAddresses ||
      typeof addresses === "undefined" ? (
        <Loader />
      ) : (
        <Table
          data={addresses}
          columns={addressTableColumns}
          baseURL={NavLookup.ADDRESS_BASE_PATH}
        />
      )}
    </main>
  );
};

export default AddressDashboardPage;
