import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductStore } from "../Admin/Stores/useProductStore";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { useSubCategoryStore } from "../Admin/Stores/useSubCategoryStore";
import CategorySkeleton from "./CategorySkeleton";

// Memoized ProductCard to prevent unnecessary re-renders
const MemoizedProductCard = memo(ProductCard);

function sanitizeName(name) {
    return name.trim().replace(/[^a-zA-Z0-9_\/.]/g, '');
}

function CategoryWiseProduct({ id, name }) {
    const { fetchCategoryWiseProduct } = useProductStore();
    const { subCategories } = useSubCategoryStore();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef(null);

    // Fetch category-wise products
    useEffect(() => {
        const getCategoryWiseProduct = async () => {
            try {
                const result = await fetchCategoryWiseProduct(id);
                setData(result);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getCategoryWiseProduct();
    }, [id, fetchCategoryWiseProduct]);

    // Scroll handler with debouncing
    const scroll = useCallback((direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            current.scrollBy({
                left: direction === "left" ? -450 : 450,
                behavior: "smooth",
            });
        }
    }, []);

    // Memoized URL generation for "see all" link
    const url = useMemo(() => {
        const subcategory = subCategories.find((sub) =>
            sub.category.some((c) => c === id)
        );
        if (subcategory) {
            return `/${sanitizeName(name)}/${id}/${sanitizeName(subcategory.name)}/${subcategory._id}`;
        }
        return "#"; // Fallback URL
    }, [subCategories, id, name]);

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-screen mx-auto lg:p-2 ml-4 px-1">
            <div className="grid grid-cols-4 lg:gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6">
                <CategorySkeleton />
            </div>
        </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold ml-2 mt-4">{name}</h2>
                <Link className="mt-6 text-green-700" to={url}>
                    see all
                </Link>
            </div>
            <div className="relative">
                <button
                    className="hidden md:block absolute left-[-10px] top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-xl rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => scroll("left")}
                    aria-label="Scroll left"
                >
                    <ChevronLeft />
                </button>
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-2 lg:gap-4 scrollbar-hide scroll-smooth p-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {data.map((product) => (
                        <MemoizedProductCard
                            product={product}
                            key={product?._id + "CategoryWiseProductCard"}
                        />
                    ))}
                </div>
                <button
                    className="hidden md:block absolute right-[-10px] top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-xl rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => scroll("right")}
                    aria-label="Scroll right"
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
}

export default memo(CategoryWiseProduct);