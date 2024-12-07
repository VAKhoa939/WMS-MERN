import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  id: string;
  email: string;
  admin: boolean;
  iat: number;
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  const { exp } = jwtDecode<TokenPayload>(token);
  if (Date.now() >= exp * 1000) {
    return true;
  }
  return false;
};

export const decodePayload = (token: string): TokenPayload => {
  const payload = jwtDecode<TokenPayload>(token);
  console.log(payload);
  return payload;
};
