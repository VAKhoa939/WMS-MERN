/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { checkTokenExpiration, getPayload } from "../utils/jwt";

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  accessToken: string | null;
  _id: string | null;
  email: string | null;
  admin: boolean | null;
  login: (user: LoginUser) => Promise<boolean>;
  logout: () => void;
  register: (user: RegisterUser) => Promise<boolean>;
  refreshAccessToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [_id, set_id] = useState<string | null>(null);

  const HANDLE_AUTH_URL = import.meta.env.VITE_API_URL + "/auth";

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch(`${HANDLE_AUTH_URL}/refresh`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        const {
          email: emailToken,
          admin: adminToken,
          id,
        } = getPayload(data.accessToken);
        setEmail(emailToken);
        setAdmin(adminToken);
        set_id(id);

        return data.accessToken;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch access token:", error);
      return null;
    }
  }, [HANDLE_AUTH_URL]);

  const login = async (user: LoginUser): Promise<boolean> => {
    try {
      const response = await fetch(`${HANDLE_AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (response.ok) {
        setAccessToken(data.accessToken);
        setEmail(data.email);
        setAdmin(data.admin);
        set_id(data.userid);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setEmail(null);
  };

  const register = async (user: RegisterUser): Promise<boolean> => {
    try {
      const response = await fetch(`${HANDLE_AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (response.ok) {
        setAccessToken(data.accessToken);
        setEmail(data.email);
        setAdmin(data.admin);
        set_id(data.userid);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let token = accessToken;
        if (!token) {
          token = await refreshAccessToken();
        }
        if (token) {
          const isExpired = checkTokenExpiration(token);
          if (isExpired) {
            token = await refreshAccessToken();
          }
          if (token) {
            try {
              const {
                email: emailToken,
                admin: adminToken,
                id,
              } = getPayload(token);
              set_id(id);
              setEmail(emailToken);
              setAdmin(adminToken);
              return;
            } catch (decodeError) {
              console.error("Failed to decode token:", decodeError);
              set_id(null);
              setEmail(null);
              setAdmin(null);
            }
          }
          set_id(null);
          setEmail(null);
          setAdmin(null);
          return;
        }
        set_id(null);
        setEmail(null);
        setAdmin(null);
        return;
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
        set_id(null);
        setEmail(null);
        setAdmin(null);
      }
    };
    initializeAuth();
  }, [accessToken, refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        email,
        admin,
        _id,
        login,
        logout,
        register,
        refreshAccessToken,
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
