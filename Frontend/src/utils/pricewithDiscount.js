export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.floor((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}