export const DisplayPriceInRupees = (price) => {
    return new Intl.NumberFormat('en-NP', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};
