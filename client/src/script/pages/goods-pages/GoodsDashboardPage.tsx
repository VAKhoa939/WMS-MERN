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
import { isErrorWithMessage } from "../../utils/handleError";

const GoodsDashboardPage = () => {
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

  const {
    data: goodsList,
    isLoading: isLoadingGoodsList,
    error: errorGoodsList,
  } = useQuery({
    queryFn: async () => {
      return getGoodsList(
        authState.accessToken,
        users as User[],
        addresses as Address[]
      );
    },
    queryKey: ["goodsList", addresses],
    enabled: !!addresses && addresses.length > 0,
  });

  if (errorUsers && isErrorWithMessage(errorUsers)) {
    console.log(errorUsers.message); // toast here
  } else if (errorAddresses && isErrorWithMessage(errorAddresses)) {
    console.log(errorAddresses.message); // toast here
  } else if (errorGoodsList && isErrorWithMessage(errorGoodsList)) {
    console.log(errorGoodsList.message); // toast here
  }

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
