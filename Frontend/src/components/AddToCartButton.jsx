import React, { useEffect, useState } from 'react'
import { Button } from '@mantine/core';
import { Plus, Minus  } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore.js';

const AddToCartButton = ( {product} ) => {
  const [isInCart, setIsInCart] = useState(false)
  const [quantity,setQuantity] = useState(0)
  const { addCartProducts,incCartProductsQuantity,decCartProductsQuantity,cartProducts } = useCartStore();

  useEffect(() => {
    const existing = cartProducts.find((p) => p._id == product._id)
    if(existing == null){
      setIsInCart(false)
    }
    else{
      setQuantity(existing?.quantity)
      setIsInCart(true)
    }
  },[cartProducts,product])
  
  function handleAddToCart(e) {
    e.preventDefault()
    addCartProducts(product)
    setQuantity((prev) => prev + 1)
  }

  function decQuantity(e) {
    e.preventDefault()
    decCartProductsQuantity(product)
    if(quantity == 1){
      setQuantity(0)
      setIsInCart(false)
    }else{
      setQuantity((prev) => prev - 1)
    }
  }
  function incQuantity(e) {
    e.preventDefault()
    setQuantity((prev) => prev + 1)
    incCartProductsQuantity(product)

  }

  return (
    <div className='w-full'>
      {
        isInCart ?
          (
            <div 
            className='w-16 py-[7px] lg:text-sm px-0.5 flex justify-center items-center gap-0.5 lg:gap-1 rounded-md lg:min-w-[68px] text-white font-bold bg-[#318616] border border-b-green'
            onClick={(e) => e.preventDefault()}
            >
                <Minus size={18} onClick={(e) => decQuantity(e)}/>
                <p className=''>{quantity}</p>
                <Plus size={18} onClick={(e) => incQuantity(e)} />
            </div>
          )
          :
          (
            <div className='scale-[0.9] lg:scale-100'>
              <Button
                color="green"
                loading={false}
                onClick={(e) => handleAddToCart(e)}
                variant="outline"
              >
                <p className='font-semibold text-[#318616]'>ADD</p>
              </Button>
            </div>
          )
      }
    </div>
  )
}

export default AddToCartButton


// for loading inside add button if necessart
// import { useDisclosure } from '@mantine/hooks';
// const [loading, { toggle }] = useDisclosure();
// <Switch checked={loading} onChange={toggle} label="Loading state" mt="md" />