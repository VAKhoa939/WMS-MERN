import { formatPrice } from "../utils/formatPrice";
import {
  Address,
  AddressRequest,
  getAddressById,
  updateAddress,
} from "./Address";
import { getUserById, User } from "./User";

export interface Goods {
  _id: string;
  goods_id: string;
  goods_code: string;
  goods_name: string;
  specifications: string;
  year_of_use: number;
  quantity: number;
  unit_price: number;
  origin_price: number;
  real_count: number;
  depreciation_rate: number;
  remaining_value: number;
  location: string;
  responsible_user: string;
  suggested_disposal: string;
  note: string;
  __v: string;
  history: number;
  unit_price_formatted: string;
  origin_price_formatted: string;
  remaining_value_formatted: string;
  responsible_user_name: string;
  responsible_user_code: string;
  location_code: string;
}

export type GoodsRequest = Omit<
  Goods,
  | "unit_price_formatted"
  | "origin_price_formatted"
  | "remaining_value_formatted"
  | "responsible_user_name"
  | "responsible_user_code"
  | "location_code"
>;

const HANDLE_ASSET_URL = import.meta.env.VITE_API_URL + "/goods";

export async function getGoodsList(
  token: string,
  users: User[],
  addresses: Address[]
) {
  const res = await fetch(`${HANDLE_ASSET_URL}`, {
    headers: { token: `Bearer ${token}` },
  });
  const data: Goods[] = await res.json();
  data.forEach((data) => {
    data.unit_price_formatted = formatPrice(data.unit_price);
    data.origin_price_formatted = formatPrice(data.origin_price);
    data.remaining_value_formatted = formatPrice(data.remaining_value);
    data.responsible_user_name =
      users.find((user) => user._id === data.responsible_user)?.name || "N/A";
    data.location_code =
      addresses.find((address) => address._id === data.location)?.building_id ||
      "N/A";
  });
  console.log(data);
  return data;
}

export async function getGoodsById(id: string, token: string) {
  const res = await fetch(`${HANDLE_ASSET_URL}/${id}`, {
    headers: { token: `Bearer ${token}` },
  });
  const data = await res.json();
  data.unit_price_formatted = formatPrice(data.unit_price);
  data.origin_price_formatted = formatPrice(data.origin_price);
  data.remaining_value_formatted = formatPrice(data.remaining_value);

  const responsible_user = await getUserById(data.responsible_user, token);
  data.responsible_user_name = responsible_user.name;
  data.responsible_user_userid = responsible_user.user_id;
  const address = await getAddressById(data.location, token);
  data.location_name = address.building_id;
  console.log(data);
  return data;
}

export async function createGoods(
  goods: GoodsRequest,
  address: AddressRequest,
  token: string
) {
  try {
    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(goods),
    };
    const res = await fetch(`${HANDLE_ASSET_URL}`, requestInit);
    const data = (await res.json()) as Goods;
    if (res.ok) {
      console.log(data);
      address.goods_list.push(data._id);
      return await updateAddress(address._id, address, token);
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateGoods(
  id: string,
  goods: GoodsRequest,
  token: string
) {
  try {
    const requestInit: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(goods),
    };
    const res = await fetch(`${HANDLE_ASSET_URL}/${id}`, requestInit);
    const data = await res.json();
    console.log(data);
    return res.ok;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteGoods(id: string, token: string) {
  try {
    const requestInit: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
    };
    const res = await fetch(`${HANDLE_ASSET_URL}/${id}`, requestInit);
    const data = await res.json();
    console.log(data);
    return res.ok;
  } catch (error) {
    console.log(error);
    return false;
  }
}
