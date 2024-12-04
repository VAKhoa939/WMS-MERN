import { getUserById, User } from "./User";

export interface Address {
  _id: string;
  building_id: string;
  building_name: string;
  goods_list: string[];
  responsible_user: string;
  __v: string;
  responsible_user_name: string;
  goods_quantity: number;
}

export type AddressRequest = Omit<
  Address,
  "responsible_user_name" | "goods_quantity"
>;

const HANDLE_ADDRESS_URL = import.meta.env.VITE_API_URL + "/addresses";

export async function getAddresses(token: string, userList: User[]) {
  const res = await fetch(`${HANDLE_ADDRESS_URL}`, {
    headers: { token: `Bearer ${token}` },
  });
  const data: Address[] = await res.json();
  console.log(data);
  data.forEach((data) => {
    data.responsible_user_name =
      userList.find((user) => user._id === data.responsible_user)?.name ||
      "N/A";
    data.goods_quantity = data.goods_list.length;
  });
  return data;
}

export async function getAddressById(id: string, token: string) {
  const res = await fetch(`${HANDLE_ADDRESS_URL}/${id}`, {
    headers: { token: `Bearer ${token}` },
  });
  const data: Address = await res.json();
  const responsible_user = await getUserById(data.responsible_user, token);
  data.responsible_user_name = responsible_user.name;
  console.log(data);
  return data;
}

export async function createAddress(address: AddressRequest, token: string) {
  try {
    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(address),
    };
    console.log(requestInit.body);

    const res = await fetch(`${HANDLE_ADDRESS_URL}`, requestInit);
    const data = await res.json();
    console.log(data);
    return res.ok;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateAddress(
  id: string,
  address: AddressRequest,
  token: string
) {
  try {
    const requestInit: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(address),
    };
    console.log(requestInit.body);

    const res = await fetch(`${HANDLE_ADDRESS_URL}/${id}`, requestInit);
    const data = await res.json();
    console.log(data);
    return res.ok;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteAddress(id: string, token: string) {
  const requestInit: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${token}`,
    },
  };
  const res = await fetch(`${HANDLE_ADDRESS_URL}/${id}`, requestInit);
  const data = await res.json();
  return data;
}
