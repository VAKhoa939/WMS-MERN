import Table from "../../components/Table";
import "../../../css/DashboardPage.css";
import { useQuery } from "@tanstack/react-query";
import { useMainRef, useScrollToMain } from "../../context/MainRefContext";
import { getUsers } from "../../interfaces/User";
import { userTableColumns } from "../../utils/tableColumns";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import NavLookup from "../../utils/navigateLookup";

const UserDashboardPage = () => {
  const mainRef = useMainRef();
  const { refreshAccessToken, accessToken } = useAuth();
  useScrollToMain();

  const { data: users, isLoading } = useQuery({
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

  return (
    <main className="dashboard-page" ref={mainRef}>
      <div className="title">Danh Sách Người Dùng</div>
      {isLoading || typeof users === "undefined" ? (
        <Loader />
      ) : (
        <Table
          data={users}
          columns={userTableColumns}
          baseURL={NavLookup.USER_BASE_PATH}
        />
      )}
    </main>
  );
};

export default UserDashboardPage;
