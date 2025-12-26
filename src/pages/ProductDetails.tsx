import {
  MyntraCarousel,
  Slider,
  useRating,
  type CarouselButtonType,
} from "6pp";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaArrowRight,
  FaRegStar,
  FaStar,
  FaTrash,
} from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { SkeletonLoader } from "../components/Loading";
import RatingsComponent from "../components/Ratings";
import {
  useDeleteReviewMutation,
  useGetReviewsOfProductQuery,
  useNewReviewMutation,
  useProductDetailsQuery,
} from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import type { RootState } from "../redux/store";
import type { CartItem, Review } from "../types/types";
import { responseToast } from "../utils/features";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, isError } = useProductDetailsQuery(params.id!);

  const reviewsResponse = useGetReviewsOfProductQuery(params.id!);

  const [carouselOpen, setCarouselOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);

  const [reviewComment, setReviewComment] = useState<string>("");
  const reviewDialogRef = useRef<HTMLDialogElement>(null);

  const [createReview] = useNewReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const {
    Ratings: RatingsEditable,
    rating,
    setRating,
  } = useRating({
    IconFilled: <FaStar />,
    IconOutline: <FaRegStar />,
    value: 0,
    selectable: true,
    styles: {
      fontSize: "1.75rem",
      color: "coral",
      justifyContent: "flex-start",
    },
  });

  const validImages = data?.product.photos
    ?.map((i) => i.url)
    .filter((url): url is string => !!url);

  const decrement = () => {
    if (quantity === 1) return;
    setQuantity((prev) => prev - 1);
  };
  const increment = () => {
    if (data?.product.stock === quantity)
      return toast.error(`${data.product.stock} available only`);
    setQuantity((prev) => prev + 1);
  };

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  const showDialog = () => {
    reviewDialogRef.current?.showModal();
  };

  const closeDialogHandler = () => {
    reviewDialogRef.current?.close();
    setRating(0);
    setReviewComment("");
  };

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0 || reviewComment === "")
      return toast.error("Please fill all fields");

    const res = await createReview({
      comment: reviewComment,
      rating,
      userId: user?._id,
      productId: params.id!,
    });

    responseToast(res, null, "");

    closeDialogHandler();
  };

  const deleteReviewHandler = async (reviewId: string) => {
    const res = await deleteReview({ reviewId, userId: user?._id });
    responseToast(res, null, "");
  };

  // Now check for error after all hooks
  if (isError) return <Navigate to="/404" />;

  return (
    <div className="product-details">
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          <main>
            <section>
              {validImages && validImages.length > 0 && (
                <Slider
                  showThumbnails
                  showNav={false}
                  onClick={() => setCarouselOpen(true)}
                  images={data?.product.photos.map((i) => i.url) || []}
                />
              )}

              {carouselOpen && validImages && validImages.length > 0 && (
                <MyntraCarousel
                  images={data?.product.photos.map((i) => i.url) || []}
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  setIsOpen={setCarouselOpen}
                />
              )}
            </section>
            <section>
              <h1>{data?.product.name}</h1>
              <code>{data?.product.category}</code>
              <em
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <RatingsComponent value={data?.product.ratings || 0} />
                <span>({data?.product?.numOfreviews || 0} reviews)</span>
              </em>
              <h3>₹{data?.product.price}</h3>
              <article>
                <div>
                  <button onClick={decrement}>-</button>
                  <span>{quantity}</span>
                  <button onClick={increment}>+</button>
                </div>
                <button
                  onClick={() =>
                    addToCartHandler({
                      productId: data?.product._id!,
                      photo: validImages && validImages.length > 0 ? validImages[0] : "/images/placeholder.png",
                      name: data?.product.name!,
                      price: data?.product.price!,
                      quantity,
                      stock: data?.product.stock!,
                    })
                  }
                >
                  Add to Cart
                </button>
              </article>
              <p>{data?.product.description}</p>
            </section>
          </main>
        </>
      )}

      <dialog ref={reviewDialogRef} className="review-dialog">
        <button onClick={closeDialogHandler}>X</button>
        <h2>Write a Review</h2>
        <form onSubmit={submitReview}>
          <textarea
            rows={5}
            placeholder="Review"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          ></textarea>
          <RatingsEditable />
          <button type="submit">Submit</button>
        </form>
      </dialog>

      <section>
        <article>
          <h2>Reviews</h2>
          {reviewsResponse.isLoading
            ? null
            : user && (
                <button onClick={showDialog}>
                  <FiEdit />
                </button>
              )}
        </article>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            overflowX: "auto",
            padding: "2rem",
          }}
        >
          {reviewsResponse.isLoading ? (
            <>
              <SkeletonLoader width="45rem" length={5} />
              <SkeletonLoader width="45rem" length={5} />
              <SkeletonLoader width="45rem" length={5} />
            </>
          ) : (
            (reviewsResponse?.data?.reviews ?? []).map((review) => (
              <ReviewCard
                deleteHandler={deleteReviewHandler}
                userId={user?._id}
                key={review._id}
                review={review}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const ReviewCard = ({
  userId,
  review,
  deleteHandler,
}: {
  userId?: string;
  review: Review;
  deleteHandler: (reviewId: string) => void;
}) => (
  <div className="review">
    <RatingsComponent value={review.rating} />
    <p>{review.comment}</p>
    <div>
      <img src={review.user.photo} alt="User" />
      <small>{review.user.name}</small>
    </div>
    {userId === review.user._id && (
      <button onClick={() => deleteHandler(review._id)}>
        <FaTrash />
      </button>
    )}
  </div>
);

const ProductLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        border: "1px solid #f1f1f1",
        height: "80vh",
      }}
    >
      <section style={{ width: "100%", height: "100%" }}>
        <SkeletonLoader
          width="100%"
          height="100%"
          containerHeight="100%"
          length={1}
        />
      </section>
      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "2rem",
        }}
      >
        <SkeletonLoader width="40%" length={3} />
        <SkeletonLoader width="50%" length={4} />
        <SkeletonLoader width="100%" length={4} />
        <SkeletonLoader width="100%" length={7} />
      </section>
    </div>
  );
};

const NextButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowRight />
  </button>
);

const PrevButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowLeft />
  </button>
);

export default ProductDetails;
