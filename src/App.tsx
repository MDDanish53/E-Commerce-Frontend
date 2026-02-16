import { onAuthStateChanged } from "firebase/auth";
import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Loader from "./components/admin/Loader";
import Header from "./components/Header";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/Protected-route";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import type { UserReducerInitialState } from "./types/reducer-types";
import Footer from "./components/Footer";
import { useSmoothScroll } from "./utils/smoothScroll";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const NotFound = lazy(() => import("./pages/not-found"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));

// Admin Routes Importing
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Discount = lazy(() => import("./pages/admin/Discount"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);
const DiscountManagement = lazy(
  () => import("./pages/admin/management/discountmanagement")
);
const NewDiscount = lazy(() => import("./pages/admin/management/newdiscount"));

// Component to conditionally show footer and track route changes
const ConditionalFooter = ({ onPathChange }: { onPathChange: (path: string) => void }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Notify parent of path changes
  useEffect(() => {
    onPathChange(location.pathname);
  }, [location.pathname, onPathChange]);
  
  // Don't show footer on admin pages
  if (isAdminRoute) return null;
  
  return <Footer />;
};

const App = () => {
  const { user, loading } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const dispatch = useDispatch();
  
  // Track current path for smooth scroll control
  const [currentPath, setCurrentPath] = useState("");
  
  // Disable smooth scrolling on admin routes to allow internal container scrolling
  const isAdminRoute = currentPath.startsWith('/admin');
  useSmoothScroll(!isAdminRoute);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const minimalUser = {
          name: user.displayName || "",
          email: user.email || "",
          photo: user.photoURL || "",
          gender: "",
          dob: "",
          _id: user.uid,
        } as any;

        dispatch(userExist(minimalUser));

        (async () => {
          try {
            const data = await getUser(user.uid);
            if (data && data.user) dispatch(userExist(data.user));
          } catch (err) {
            console.error(
              "Failed to fetch full user after auth state change:",
              err
            );
          }
        })();
      } else {
        dispatch(userNotExist());
      }
    });

    return () => unsubscribe();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      {/* Header */}
      <Header user={user} />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          {/* Not Logged in Routes */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          ></Route>
          {/* Logged In User Routes */}
          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/my" element={<Orders />} />
            <Route path="/pay" element={<Checkout />} />
          </Route>
          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                // Pass `undefined` when role is not yet known so ProtectedRoute
                // doesn't forcibly redirect during initial sync. Only pass `true` when admin.
                admin={user?.role === "admin" ? true : undefined}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path="/admin/discount" element={<Discount />} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
            <Route path="/admin/discount/new" element={<NewDiscount />} />
            <Route
              path="/admin/discount/:id"
              element={<DiscountManagement />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {/* Conditionally render footer - hidden on admin pages */}
      <ConditionalFooter onPathChange={setCurrentPath} />
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
