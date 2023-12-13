export const toIdr = (value) => {
  return value.toLocaleString('id-ID', { style: "currency", currency: "IDR" })
}