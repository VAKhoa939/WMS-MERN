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

const HANDLE_USER_URL = import.meta.env.VITE_API_URL + "/users";

export async function getUsers(accessToken: string) {
  const res = await fetch(`${HANDLE_USER_URL}`, {
    headers: { token: `Bearer ${accessToken}` },
  });
  const data: User[] = await res.json();
  console.log(data);
  data.forEach((item) => {
    item.status = item.is_active ? "Đang hoạt động" : "Dừng hoạt động";
    item.role = item.admin ? "Admin" : "Người dùng";
  });
  return data;
}

export async function getUserById(id: string, accessToken: string) {
  const res = await fetch(`${HANDLE_USER_URL}/${id}`, {
    headers: { token: `Bearer ${accessToken}` },
  });
  const data = (await res.json()) as User;
  data.status = data.is_active ? "Đang hoạt động" : "Dừng hoạt động";
  data.role = data.admin ? "Admin" : "Người dùng";
  console.log(data);
  return data;
}

export async function createUser(user: User, accessToken: string) {
  try {
    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(user),
    };
    const res = await fetch(`${HANDLE_USER_URL}`, requestInit);
    const data = await res.json();
    console.log(data);
    return res.ok;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
}

export async function updateUser(id: string, user: User, accessToken: string) {
  try {
    const requestInit: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(user),
    };
    const res = await fetch(`${HANDLE_USER_URL}/${id}`, requestInit);
    const data = await res.json();
    console.log(data);
    return res.ok;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}

export async function deleteUser(
  id: string,
  accoundId: string,
  admin: boolean,
  accessToken: string
) {
  try {
    const requestInit: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id: accoundId, admin: admin }),
    };
    const res = await fetch(`${HANDLE_USER_URL}/${id}`, requestInit);
    const data = await res.json();
    console.log(data);
    return res.ok;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}

export async function changeStatusUser(
  id: string,
  accoundId: string,
  admin: boolean,
  accessToken: string
) {
  try {
    const requestInit: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id: accoundId, admin: admin }),
    };
    const res = await fetch(`${HANDLE_USER_URL}/active/${id}`, requestInit);
    const data = await res.json();
    console.log(data);
    return res.ok;
  } catch (error) {
    console.error("Error changing status:", error);
    return false;
  }
}
