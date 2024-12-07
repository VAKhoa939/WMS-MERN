/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { isTokenExpired, decodePayload } from "../utils/jwt";
import { ResponseBody } from "../interfaces/ResponseBody";
import { useQuery } from "@tanstack/react-query";
import { isErrorWithMessage } from "../utils/handleError";

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  id: string | null;
  email: string | null;
  admin: boolean | null;
  accessToken: string | null;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  loading: boolean;
  login: (user: LoginUser) => Promise<void>;
  logout: () => Promise<void>;
  register: (user: RegisterUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const HANDLE_AUTH_URL = import.meta.env.VITE_API_URL + "/auth";

const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${HANDLE_AUTH_URL}/refresh`, {
      method: "POST",
      credentials: "include" as RequestCredentials,
    });
    const body = (await response.json()) as ResponseBody;

    if (!body.success) throw new Error(body.message);
    return body.data as string;
  } catch (error) {
    console.log("Failed to fetch token:", error);
    throw new Error("Không thể kết nối đến máy chủ");
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  // Fetch access token on initial load and in each interval
  const {
    data: accessToken,
    error: errorRefresh,
    isLoading,
  } = useQuery<string, Error>({
    queryFn: refreshAccessToken,
    queryKey: ["accessToken"],
    refetchInterval: 1000 * 60 * 5, // Every 5 minutes
  });

  useEffect(() => {
    if (accessToken && !isTokenExpired(accessToken)) {
      const { email, admin, id } = decodePayload(accessToken);
      setAuthState({
        id,
        email,
        admin,
        accessToken,
      });
      setLoading(false);
    } else if (!isLoading) {
      setLoading(false);
      if (accessToken && isTokenExpired(accessToken)) {
        console.log(
          "Token không hợp lệ hoặc đã hết hạn. Xin hãy đăng nhập lại."
        ); // toast here
      }
    }
  }, [accessToken, isLoading]);

  useEffect(() => {
    if (errorRefresh && isErrorWithMessage(errorRefresh)) {
      console.log(errorRefresh.message); // toast here
      setLoading(false);
    }
  }, [errorRefresh]);

  const register = async (user: RegisterUser) => {
    try {
      const response = await fetch(`${HANDLE_AUTH_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify(user),
      });

      const body = (await response.json()) as ResponseBody;
      if (!body.success) throw new Error(body.message);
    } catch (error) {
      console.log("Registration failed:", error);
      throw new Error("Không thể kết nối đến máy chủ");
    }
  };

  const login = async (user: LoginUser) => {
    try {
      const response = await fetch(`${HANDLE_AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify(user),
      });

      const body = (await response.json()) as ResponseBody;
      if (!body.success) throw new Error(body.message);

      const { email, admin, id } = decodePayload(body.data as string);
      setAuthState({
        id,
        email,
        admin,
        accessToken: body.data as string,
      });
    } catch (error) {
      console.log("Login failed:", error);
      throw new Error("Không thể kết nối đến máy chủ");
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${HANDLE_AUTH_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include" as RequestCredentials,
      });

      const body = (await response.json()) as ResponseBody;
      if (!body.success) throw new Error(body.message);

      setAuthState({} as AuthState);
    } catch (error) {
      console.log("Logout failed:", error);
      throw new Error("Không thể kết nối đến máy chủ");
    }
  };

  if (errorRefresh && isErrorWithMessage(errorRefresh))
    console.log(errorRefresh.message); // toast here

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
