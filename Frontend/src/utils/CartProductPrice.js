import { pricewithDiscount } from "./pricewithDiscount.js";
import { DisplayPriceInRupees } from "./DisplayPriceInRupees.js";

export const totalPriceWithDiscount = (cartProducts) =>{
    let total = 0
    cartProducts.map((product) => {
        total += pricewithDiscount(product?.price, product?.discount)*product?.quantity
    })
    return DisplayPriceInRupees(total)
}

export const totalPriceWithoutDiscount = (cartProducts) =>{
    let total = 0
    cartProducts.map((product) => {
        total += product?.price*product?.quantity
    })
    return DisplayPriceInRupees(total)
}
