import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/layout/Layout";
import LoginPage from "./pages/auth-pages/LoginPage";
import RegisterPage from "./pages/auth-pages/RegisterPage";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/home-page/HomePage";
import GoodsDashboardPage from "./pages/goods-pages/GoodsDashboardPage";
import { MainRefProvider } from "./context/MainRefContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GoodsInfoPage from "./pages/goods-pages/GoodsInfoPage";
import CreateGoodsPage from "./pages/goods-pages/CreateGoodsPage";
import React from "react";
import UserDashboardPage from "./pages/user-pages/UserDashboardPage";
import UserInfoPage from "./pages/user-pages/UserInfoPage";
import AddressDashboardPage from "./pages/address-pages/AddressDashboardPage";
import AddressInfoPage from "./pages/address-pages/AddressInfoPage";
import CreateAddressPage from "./pages/address-pages/CreateAddressPage";
import NavLookup from "./utils/navigateLookup";
import ChatPage from "./pages/chat-page/ChatPage";

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <MainRefProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path={NavLookup.GOODS_BASE_PATH}
                  element={<ProtectedRoute Component={GoodsDashboardPage} />}
                />
                <Route
                  path={`${NavLookup.GOODS_BASE_PATH}/:id`}
                  element={<ProtectedRoute Component={GoodsInfoPage} />}
                />
                <Route
                  path={`${NavLookup.GOODS_BASE_PATH}/create`}
                  element={<ProtectedRoute Component={CreateGoodsPage} />}
                />
                <Route
                  path={NavLookup.ADDRESS_BASE_PATH}
                  element={<ProtectedRoute Component={AddressDashboardPage} />}
                />
                <Route
                  path={`${NavLookup.ADDRESS_BASE_PATH}/:id`}
                  element={<ProtectedRoute Component={AddressInfoPage} />}
                />
                <Route
                  path={`${NavLookup.ADDRESS_BASE_PATH}/create`}
                  element={<ProtectedRoute Component={CreateAddressPage} />}
                />
                <Route
                  path={NavLookup.USER_BASE_PATH}
                  element={<ProtectedRoute Component={UserDashboardPage} />}
                />
                <Route
                  path={`${NavLookup.USER_BASE_PATH}/:id`}
                  element={<ProtectedRoute Component={UserInfoPage} />}
                />
                <Route
                  path="/chat"
                  element={<ProtectedRoute Component={ChatPage} />}
                />
              </Routes>
            </Layout>
          </MainRefProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
interface ProtectedRouteProps {
  Component: React.FC;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ Component }) => {
  const authContext = React.useContext(AuthContext);
  if (!authContext) {
    throw new Error("useContext must be used within an AuthProvider");
  }
  return authContext.email ? <Component /> : <Navigate to="/login" />;
};

export default App;
