import { FaPlus } from "react-icons/fa";
import type { CartItem } from "../types/types";
import { Link } from "react-router-dom";
import { IoIosOpen } from "react-icons/io";
import { transformImage } from "../utils/features";

type productProps = {
  productId: string;
  photos: {
    public_id: string;
    url: string;
  }[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
};

const ProductCard = ({
  productId,
  photos,
  name,
  price,
  stock,
  handler,
  loading = "lazy",
  fetchPriority = "auto",
}: productProps) => {
  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img 
          src={transformImage(photos?.[0]?.url, 400)} 
          alt={name} 
          loading={loading} 
          decoding="async"
          {...({ fetchPriority } as any)} 
        />
      </div>
      <p>{name}</p>
      <span>₹{price}</span>
      <div className="overlay">
        <button
          onClick={() =>
            handler({
              productId,
              photo: photos?.[0]?.url,
              name,
              price,
              stock,
              quantity: 1,
            })
          }
        >
          <FaPlus />
        </button>
        <Link to={`/product/${productId}`}><IoIosOpen /></Link>
      </div>
    </div>
  );
};

export default ProductCard;
