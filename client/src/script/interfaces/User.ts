import { ResponseBody } from "./ResponseBody";

export type Status = "Đang hoạt động" | "Dừng hoạt động";
export type Role = "Người dùng" | "Admin";

export interface User {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
  position: string;
  admin: boolean;
  is_active: boolean;
  __v: string;
  status: Status;
  role: Role;
}

const USER_URL = import.meta.env.VITE_API_URL + "/users";

export async function getUsers(accessToken: string | null) {
  const res = await fetch(`${USER_URL}`, {
    headers: { token: `Bearer ${accessToken}` },
  });
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);

  body.data.forEach((user: User) => {
    user.status = user.is_active ? "Đang hoạt động" : "Dừng hoạt động";
    user.role = user.admin ? "Admin" : "Người dùng";
  });
  console.log(body.data);
  return body.data as User[];
}

export async function getUserById(id: string, accessToken: string | null) {
  const res = await fetch(`${USER_URL}/${id}`, {
    headers: { token: `Bearer ${accessToken}` },
  });
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);

  body.data.status = body.data.is_active ? "Đang hoạt động" : "Dừng hoạt động";
  body.data.role = body.data.admin ? "Admin" : "Người dùng";
  console.log(body.data);
  return body.data as User;
}

export async function createUser(user: User, accessToken: string | null) {
  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(user),
  };
  const res = await fetch(`${USER_URL}`, requestInit);
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);
  return body.data as User;
}

export async function updateUser(
  id: string,
  user: User,
  accessToken: string | null
) {
  const requestInit: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(user),
  };
  const res = await fetch(`${USER_URL}/${id}`, requestInit);
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);
  return body.data as User;
}

export async function deleteUser(
  targetId: string,
  accoundId: string | null,
  admin: boolean | null,
  accessToken: string | null
) {
  const requestInit: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ id: accoundId, admin: admin }),
  };
  const res = await fetch(`${USER_URL}/${targetId}`, requestInit);
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);
}

export async function changeStatusUser(
  targetId: string,
  accoundId: string | null,
  admin: boolean | null,
  accessToken: string | null
) {
  const requestInit: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ id: accoundId, admin: admin }),
  };
  const res = await fetch(`${USER_URL}/active/${targetId}`, requestInit);
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);
  return body.data as User;
}
