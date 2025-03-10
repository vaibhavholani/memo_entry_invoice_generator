export const calculateTotalDDAmount = (items: Array<{ ddAmount: number }>) => {
  return items.reduce((sum, item) => sum + item.ddAmount, 0);
};

export const calculateTotalBillAmount = (items: Array<{ billAmount: number }>) => {
  return items.reduce((sum, item) => sum + item.billAmount, 0);
};

export const calculateNetTotal = (
  items: Array<{ billAmount: number }>,
  totals: {
    lessTotal: number;
    discountPercentage: number;
    rd: number;
    gr: number;
    otherDifference: number;
  }
) => {
  const total = calculateTotalBillAmount(items);
  const discountAmount = total * (totals.discountPercentage / 100);
  return (
    total -
    totals.lessTotal -
    discountAmount -
    totals.rd -
    totals.gr -
    totals.otherDifference
  );
};
