import Table from "../../components/Table";
import "../../../css/DashboardPage.css";
import { useQuery } from "@tanstack/react-query";
import { useMainRef, useScrollToMain } from "../../context/MainRefContext";
import { getUsers } from "../../interfaces/User";
import { userTableColumns } from "../../utils/tableColumns";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import NavLookup from "../../utils/navigateLookup";
import { isErrorWithMessage } from "../../utils/handleError";

const UserDashboardPage = () => {
  const { authState } = useAuth();

  const mainRef = useMainRef();
  useScrollToMain();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => getUsers(authState.accessToken),
    queryKey: ["users"],
  });

  if (error && isErrorWithMessage(error)) console.log(error.message); // toast here

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
