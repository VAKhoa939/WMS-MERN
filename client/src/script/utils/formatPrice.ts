export function formatPrice(value: number) {
  const strValue = value.toString();
  return strValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function convertToNumber(value: string): number {
  const strValue = value.replace(/,/g, "");
  return Number(strValue);
}
