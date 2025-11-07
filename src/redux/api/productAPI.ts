import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  type AllProductsResponse,
  type AllReviewsResponse,
  type CategoriesResponse,
  type DeleteProductRequest,
  type DeleteReviewRequest,
  type MessageResponse,
  type NewProductRequest,
  type NewReviewRequest,
  type ProductResponse,
  type SearchProductsRequest,
  type SearchProductsResponse,
  type UpdateProductRequest
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => "categories",
      providesTags: ["product"]
    }),
    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ price, search, sort, category, page }) => {
        let base = `all?search=${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;

        return base;
      },
      providesTags: ["product"]
    }),
    productDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags: ["product"]
    }),
    getReviewsOfProduct: builder.query<AllReviewsResponse, string>({
      query: (productId) => `reviews/${productId}`,
      providesTags: ["product"]
    }),
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    newReview: builder.mutation<MessageResponse, NewReviewRequest>({
      query: ({comment, rating, userId, productId}) => ({
        url: `review/new/${productId}?id=${userId}`,
        method: "POST",
        body: {comment, rating},
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["product"]
    }),
    deleteReview: builder.mutation<MessageResponse, DeleteReviewRequest>({
      query: ({userId, reviewId}) => ({
        url: `review/${reviewId}?id=${userId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["product"]
    }),
    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({formData, userId, productId}) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"]
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({userId, productId}) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE", 
      }),
      invalidatesTags: ["product"]
    })
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useGetReviewsOfProductQuery,
  useNewReviewMutation,
  useDeleteReviewMutation,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productAPI;
