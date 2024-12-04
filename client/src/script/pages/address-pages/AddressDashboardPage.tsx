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

const AddressDashboardPage = () => {
  const mainRef = useMainRef();
  const { refreshAccessToken, accessToken } = useAuth();
  useScrollToMain();

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryFn: async () => {
      let token = accessToken;
      if (!token) {
        token = await refreshAccessToken();
        if (!token) {
          throw new Error("Unable to refresh access token");
        }
      }
      return getUsers(token);
    },
    queryKey: ["users"],
  });

  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryFn: async () => {
      let token = accessToken;
      if (!token) {
        token = await refreshAccessToken();
        if (!token) {
          throw new Error("Unable to refresh access token");
        }
      }
      return getAddresses(token, users as User[]);
    },
    queryKey: ["addresses", users],
    enabled: !!users && users.length > 0,
  });

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
