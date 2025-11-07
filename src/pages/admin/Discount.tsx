import { useEffect, useState, type ReactElement } from "react";
import type { Column } from "react-table";
import TableHOC from "../../components/admin/TableHOC";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { SkeletonLoader } from "../../components/Loading";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useFetchData } from "6pp";
import { server, type RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { type AllDiscountResponse } from "../../types/api-types";
import { useSelector } from "react-redux";

interface DataType {
  coupon: string;
  amount: number;
  _id: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Id",
    accessor: "_id"
  },
  {
    Header: "Code",
    accessor: "coupon"
  },
  {
    Header: "Amount",
    accessor: "amount"
  },
  {
    Header: "Action",
    accessor: "action"
  }
]

const Discount = () => {

  const {user} = useSelector((state: RootState) => state.userReducer)

  const { data, loading: isLoading, error } = useFetchData<AllDiscountResponse>({
    url: `${server}/api/v1/payment/coupon/all?id=${user?._id}`,
    key: "discount-codes",
    dependencyProps: [],
    credentials: undefined,
    successCallback: undefined,
    errorCallback: undefined,
  });

  const [rows, setRows] = useState<DataType[]>([]);

  const Table = TableHOC<DataType>(
    columns,
    rows, 
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  if(error) 
    toast.error(error)

  useEffect(() => {
    if(data) 
      setRows(
    data.coupons.map((i) => ({
      _id: i._id,
      coupon: i.coupon,
      amount: i.amount,
      action: <Link to={`/admin/discount/${i._id}`} >Manage</Link>
    })))
  }, [data]) 

  return <div className="admin-container">
    <AdminSidebar />
    <main>{isLoading ? <SkeletonLoader length={20} /> : Table}</main>
    <Link to="/admin/discount/new" className="create-product-btn" ><FaPlus /></Link>
  </div>
}

export default Discount;