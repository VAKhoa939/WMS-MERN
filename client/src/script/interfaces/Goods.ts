import { formatPrice } from "../utils/formatPrice";
import { Address } from "./Address";
import { ResponseBody } from "./ResponseBody";
import { User } from "./User";

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
  location_name: string;
}

export type GoodsRequest = Omit<
  Goods,
  | "unit_price_formatted"
  | "origin_price_formatted"
  | "remaining_value_formatted"
  | "responsible_user_name"
  | "responsible_user_code"
  | "location_name"
>;

const GOODS_URL = import.meta.env.VITE_API_URL + "/goods";

export async function getGoodsList(
  accessToken: string | null,
  users: User[],
  addresses: Address[]
) {
  const res = await fetch(`${GOODS_URL}`, {
    headers: { token: `Bearer ${accessToken}` },
  });
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);

  body.data.forEach((goods: Goods) => {
    goods.unit_price_formatted = formatPrice(goods.unit_price);
    goods.origin_price_formatted = formatPrice(goods.origin_price);
    goods.remaining_value_formatted = formatPrice(goods.remaining_value);
    goods.responsible_user_name =
      users.find((user) => user._id === goods.responsible_user)?.name ||
      "Không có";
    goods.location_name =
      addresses.find((address) => address._id === goods.location)
        ?.building_name || "Không có";
  });
  console.log(body.data);
  return body.data as Goods[];
}

export async function getGoodsById(
  id: string,
  accessToken: string | null,
  users: User[],
  addresses: Address[]
) {
  const res = await fetch(`${GOODS_URL}/${id}`, {
    headers: { token: `Bearer ${accessToken}` },
  });
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);

  body.data.unit_price_formatted = formatPrice(body.data.unit_price);
  body.data.origin_price_formatted = formatPrice(body.data.origin_price);
  body.data.remaining_value_formatted = formatPrice(body.data.remaining_value);

  const responsible_user = users.find(
    (user) => user._id === body.data.responsible_user
  ) as User;
  body.data.responsible_user_name = responsible_user.name;
  body.data.responsible_user_userid = responsible_user.user_id;

  const address = addresses.find(
    (address) => address._id === body.data.location
  ) as Address;
  body.data.location_name = address.building_name;

  console.log(body.data);
  return body.data as Goods;
}

export async function createGoods(
  goods: GoodsRequest,
  accessToken: string | null
) {
  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(goods),
  };
  const res = await fetch(`${GOODS_URL}`, requestInit);
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);
  return body.data as Goods;
}

export async function updateGoods(
  id: string,
  goods: GoodsRequest,
  accessToken: string | null
) {
  const requestInit: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(goods),
  };
  const res = await fetch(`${GOODS_URL}/${id}`, requestInit);
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);
  return body.data as Goods;
}

export async function deleteGoods(id: string, accessToken: string | null) {
  const requestInit: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
  };
  const res = await fetch(`${GOODS_URL}/${id}`, requestInit);
  const body = (await res.json()) as ResponseBody;
  if (!body.success) throw new Error(body.message);
}
