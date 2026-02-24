import { useState, useEffect } from "react";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import ProductCard from "../components/ProductCard";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import type { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/Loading";
import type { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Search = () => {

  const searchQuery = useSearchParams()[0];

  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [category, setCategory] = useState(searchQuery.get("category") || "");
  const [page, setPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {isLoading: productLoading, data: searchedData, isError: productIsError, error: productError} = useSearchProductsQuery({
    search,
    sort,
    price: maxPrice,
    category,
    page,
  });

  const dispatch = useDispatch();
  
  const addToCartHandler = (cartItem: CartItem) => {
    if(cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  }

  // GSAP Scroll Animations
  useEffect(() => {
    const productCards = gsap.utils.toArray('.product-card');
    if (productCards.length > 0) {
      gsap.fromTo(
        productCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.search-product-list',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [searchedData]);

  const isPrevPage = page > 1;
  const isNextPage = page < (searchedData?.totalPage || 0);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if(productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }
  return (
    <div className="product-search-page">
      <div 
        className={`filter-overlay ${isMobileFilterOpen ? "active" : ""}`} 
        onClick={() => setIsMobileFilterOpen(false)}
      />
      <aside className={isMobileFilterOpen ? "active" : ""}>
        <div className="filter-header">
           <h2>Filters</h2>
           <button 
             className="close-filters"
             onClick={() => setIsMobileFilterOpen(false)}
           >
             <IoClose />
           </button>
        </div>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">ALL</option>
            {loadingCategories === false &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <div className="search-header-row">
           <h1>Products</h1>
           <button 
             className="mobile-filter-btn"
             onClick={() => setIsMobileFilterOpen(true)}
           >
             <FiFilter /> Filters
           </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {productLoading ? <SkeletonLoader length={10} /> : <div className="search-product-list">
          {searchedData?.products.map((i) => (
            <ProductCard
            key={i._id}
            productId={i._id}
            photos={i.photos}
            price={i.price}
            name={i.name}
            stock={i.stock}
            handler={addToCartHandler}
          />
          ))}
        </div>}
        {searchedData && searchedData.totalPage > 1 && (
          <article className="pagination">
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
