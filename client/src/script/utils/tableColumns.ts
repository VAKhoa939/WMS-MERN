export interface Column {
  header: string;
  accessorKey: string;
  footer: string;
}

export const goodsTableColumns: Column[] = [
  {
    header: "Mã hàng hóa",
    accessorKey: "goods_id",
    footer: "Mã hàng hóa",
  },
  {
    header: "Số hiệu hàng hóa",
    accessorKey: "goods_code",
    footer: "Số hiệu hàng hóa",
  },
  {
    header: "Tên hàng hóa",
    accessorKey: "goods_name",
    footer: "Tên hàng hóa",
  },
  {
    header: "Quy cách, đặc điểm hàng hóa",
    accessorKey: "specifications",
    footer: "Quy cách, đặc điểm hàng hóa",
  },
  {
    header: "Năm sử dụng",
    accessorKey: "year_of_use",
    footer: "Năm sử dụng",
  },
  {
    header: "Số lượng",
    accessorKey: "quantity",
    footer: "Số Lượng",
  },
  {
    header: "Đơn Giá",
    accessorKey: "unit_price_formatted",
    footer: "Đơn Giá",
  },
  {
    header: "Nguyên giá",
    accessorKey: "origin_price_formatted",
    footer: "Nguyên giá",
  },
  {
    header: "Số lượng thực tế",
    accessorKey: "real_count",
    footer: "Nguyên giá",
  },
  {
    header: "Phầm trăm hao mòn",
    accessorKey: "depreciation_rate",
    footer: "Phầm trăm hao mòn",
  },
  {
    header: "Nguyên giá còn lại",
    accessorKey: "remaining_value_formatted",
    footer: "Nguyên giá còn lại",
  },
  {
    header: "Địa chỉ nhà kho",
    accessorKey: "location_name",
    footer: "Địa chỉ nhà kho",
  },
  {
    header: "Người phụ trách",
    accessorKey: "responsible_user_name",
    footer: "Người phụ trách",
  },
  {
    header: "Đề nghị thanh lý",
    accessorKey: "suggested_disposal",
    footer: "Đề nghị thanh lý",
  },
  {
    header: "Ghi chú",
    accessorKey: "note",
    footer: "Ghi chú",
  },
];

export const userTableColumns: Column[] = [
  {
    header: "ID người dùng",
    accessorKey: "user_id",
    footer: "ID người dùng",
  },
  {
    header: "Tên người dùng",
    accessorKey: "name",
    footer: "Tên người dùng",
  },
  {
    header: "Email",
    accessorKey: "email",
    footer: "Email",
  },
  {
    header: "Số điện thoại",
    accessorKey: "phone_number",
    footer: "Số điện thoại",
  },
  { header: "Loại tài khoản", accessorKey: "role", footer: "Loại tài khoản" },
  {
    header: "Chức vụ",
    accessorKey: "position",
    footer: "Chức vụ",
  },
  { header: "Trạng thái", accessorKey: "status", footer: "Trạng thái" },
];

export const addressTableColumns: Column[] = [
  {
    header: "Mã nhà kho",
    accessorKey: "building_id",
    footer: "Mã nhà kho",
  },
  {
    header: "Tên nhà kho",
    accessorKey: "building_name",
    footer: "Tên nhà kho",
  },
  {
    header: "Sức chứa của nhà kho",
    accessorKey: "maximum_capacity",
    footer: "Sức chứa của nhà kho",
  },
  {
    header: "Người phụ trách",
    accessorKey: "responsible_user_name",
    footer: "Người phụ trách",
  },
];
