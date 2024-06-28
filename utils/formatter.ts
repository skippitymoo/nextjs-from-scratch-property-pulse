const formatterCurrency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export const formatCurrency = (nominal: number): string => {
  return formatterCurrency.format(nominal);
};
