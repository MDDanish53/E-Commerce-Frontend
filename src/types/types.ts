export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
};

export type Product = {
  name: string;
  price: number;
  stock: number;
  numOfReviews: number;
  category: string;
  ratings: number;
  description: string;
  photos: {
    public_id: string;
    url: string;
  }[];
  _id: string;
};

export type Review = {
  _id: string;
  comment: string;
  rating: number;
  user: {
    name: string;
    photo: string;
    _id: string;
  }
  product: string;
}

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type CartItem = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

export type OrderItem = {
  _id: string
  productId: string;
  photos: {
    public_id: string;
    url: string;
  }[];
  name: string;
  price: number;
  quantity: number;
}

export type Order = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    _id: string;
    name: string;
  };
  _id: string;
};

type CountAndChange = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};

type LatestTransaction = {
  _id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string;
};

export type Stats = {
  categoryCount: Record<string, number>[];
  changePercent: CountAndChange;
  count: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  latestTransactions: LatestTransaction[];
};

type OrderFullfillment = {
  processing: number;
  shipped: number;
  delivered: number;
};

type RevenueDistribution = {
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
  netMargin: number;
};

type UserAgeGroup = {
  teen: number;
  adult: number;
  old: number;
};

export type Pie = {
  orderFulfillment: OrderFullfillment;
  productCategories: Record<string, number>[];
  stockAvailability: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: RevenueDistribution;
  userAgeGroup: UserAgeGroup;
  userRole: {
    admin: number;
    user: number;
  };
};

export type Bar = {
  users: number[];
  products: number[];
  orders: number[];
};

export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};

export type CouponType = {
  coupon: string;
  amount: number;
  _id: string;
}