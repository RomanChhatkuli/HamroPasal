import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useProductStore } from '../Admin/Stores/useProductStore'
import { useSubCategoryStore } from '../Admin/Stores/useSubCategoryStore';

function ProductList() {
  const {fetchProductByCategoryAndSubcategory} = useProductStore()
  const {subCategories} = useSubCategoryStore()
  const [data,setData] = useState([])
  const params = useParams()

  useEffect(() => {
    async function getData(){
      const response = await fetchProductByCategoryAndSubcategory(params.categoryId,params.subcategoryId)
      setData(response)
    }
    getData()
  },[])

  return (
    <div>ProductList</div>
  )
}

export default ProductList