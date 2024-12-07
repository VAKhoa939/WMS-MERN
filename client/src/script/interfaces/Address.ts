import { ResponseBody } from "./ResponseBody";
import { User } from "./User";

export interface Address {
  _id: string;
  building_id: string;
  building_name: string;
  maximum_capacity: number;
  responsible_user: string;
  __v: string;
  responsible_user_name: string;
}

export type AddressRequest = Omit<
  Address,
  "responsible_user_name" | "current_quantity" | "formatted_quantity"
>;

const ADDRESS_URL = import.meta.env.VITE_API_URL + "/addresses";

export async function getAddresses(accessToken: string | null, users: User[]) {
  const res = await fetch(`${ADDRESS_URL}`, {
    headers: { token: `Bearer ${accessToken}` },
  });
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);

  console.log(body.data);
  body.data.forEach((address: Address) => {
    address.responsible_user_name =
      users.find((user) => user._id === address.responsible_user)?.name ||
      "Không có";
  });
  return body.data as Address[];
}

export async function getAddressById(
  id: string,
  accessToken: string | null,
  users: User[]
) {
  const res = await fetch(`${ADDRESS_URL}/${id}`, {
    headers: { token: `Bearer ${accessToken}` },
  });
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);

  const responsible_user = users.find(
    (user) => user._id === body.data.responsible_user
  );
  body.data.responsible_user_name = responsible_user?.name || "Không có";
  body.data.formatted_quantity = `${body.data.current_quantity} / ${body.data.maximum_capacity}`;
  console.log(body.data);
  return body.data as Address;
}

export async function createAddress(
  address: AddressRequest,
  accessToken: string | null
) {
  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(address),
  };
  const res = await fetch(`${ADDRESS_URL}`, requestInit);
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);
  return body.data as Address;
}

export async function updateAddress(
  id: string,
  address: AddressRequest,
  accessToken: string | null
) {
  const requestInit: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(address),
  };
  const res = await fetch(`${ADDRESS_URL}/${id}`, requestInit);
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);
  return body.data as Address;
}

export async function deleteAddress(id: string, accessToken: string | null) {
  const requestInit: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
  };
  const res = await fetch(`${ADDRESS_URL}/${id}`, requestInit);
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);
}
