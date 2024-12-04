import "../../../css/DashboardPage.css";
import { getGoodsList } from "../../interfaces/Goods";
import { useQuery } from "@tanstack/react-query";
import { useMainRef, useScrollToMain } from "../../context/MainRefContext";
import Table from "../../components/Table";
import { goodsTableColumns } from "../../utils/tableColumns";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { getUsers, User } from "../../interfaces/User";
import { Address, getAddresses } from "../../interfaces/Address";
import NavLookup from "../../utils/navigateLookup";

const GoodsDashboardPage = () => {
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

  const { data: goodsList, isLoading: isLoadingGoodsList } = useQuery({
    queryFn: async () => {
      let token = accessToken;
      if (!token) {
        token = await refreshAccessToken();
        if (!token) {
          throw new Error("Unable to refresh access token");
        }
      }
      return getGoodsList(token, users as User[], addresses as Address[]);
    },
    queryKey: ["goodsList", addresses],
    enabled: !!addresses && addresses.length > 0,
  });

  return (
    <main className="dashboard-page" ref={mainRef}>
      <div className="title">Danh Sách Hàng Hóa</div>
      {isLoadingGoodsList ||
      isLoadingAddresses ||
      isLoadingUsers ||
      typeof goodsList === "undefined" ? (
        <Loader />
      ) : (
        <Table
          data={goodsList}
          columns={goodsTableColumns}
          baseURL={NavLookup.GOODS_BASE_PATH}
        />
      )}
    </main>
  );
};

export default GoodsDashboardPage;
