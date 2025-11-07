import axios from "axios";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { server, type RootState } from "../../../redux/store";

const NewDiscount = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [code, setCode] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true)
    try {
      const {data} = await axios.post(`${server}/api/v1/payment/coupon/new?id=${user?._id}`, {
        coupon: code, amount: amount
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      if(data.success) {
        toast.success(data.message)
        navigate("/admin/discount")
      }
    } catch (error) {
      
    } finally {
      setBtnLoading(false)
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
            <article>
              <form onSubmit={submitHandler}>
                <h2>New Coupon</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Coupon Name"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>

                <button disabled={btnLoading} type="submit">Create</button>
              </form>
            </article>   
      </main>
    </div>
  );
};

export default NewDiscount;
