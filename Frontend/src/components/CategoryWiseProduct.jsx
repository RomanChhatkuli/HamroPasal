import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductStore } from "../Admin/Stores/useProductStore";
import CategoryWiseProductCard from "./CategoryWiseProductCard";
import CategorySkeleton from "./CategorySkeleton";

function CategoryWiseProduct({ id, name }) {
    const { fetchCategoryWiseProduct, isFetchingCategoryWiseProduct } = useProductStore()
    const [data, setData] = useState([])

    async function getCategoryWiseProduct() {
        let ans = await fetchCategoryWiseProduct(id)
        setData(ans)
    }
    useEffect(() => {
        getCategoryWiseProduct()
    }, [])

    const scrollRef = useRef(null);
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            current.scrollBy({ left: direction === "left" ? -450 : 450, behavior: "smooth" });
        }
    };

    return isFetchingCategoryWiseProduct ?
    (
        <div className="max-w-screen mx-auto lg:p-2 ml-4 px-1">
                <div className="grid grid-cols-4 lg:gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                    <CategorySkeleton />
                </div>
            </div>
        )
        :
        (<div>
            <h2 className="text-xl font-semibold ml-2 mt-4">{name}</h2>
            <div className="relative">
                <button
                    className="hidden md:block absolute left-[-10px] top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-xl rounded-full"
                    onClick={() => scroll("left")}
                >
                    <ChevronLeft />
                </button>
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth p-2 "
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {data?.map((product) => (
                        <CategoryWiseProductCard product={product} key={product?._id + "CategoryWiseProductCard"} />
                    ))}
                </div>
                <button
                    className="hidden md:block absolute right-[-10px] top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-xl rounded-full"
                    onClick={() => scroll("right")}
                >
                    <ChevronRight />
                </button>
            </div>
        </div>)



}


export default CategoryWiseProduct