import axios from "axios";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { server, type RootState } from "../redux/store";

const Shipping = () => {
  const { cartItems, total } = useSelector(
    (state: RootState) => state.cartReducer
  );

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo));
    try {
      const {data} = await axios.post(`${server}/api/v1/payment/create`, {
        amount: total
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      }) 
      navigate("/pay", {
        state: data.clientSecret
      })
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    if (cartItems.length <= 0) {
      navigate("/cart");
    }
  }, [cartItems]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
          required
        />
        <input
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
          required
        />
        <input
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
          required
        />
        <input
          type="text"
          placeholder="Country"
          name="country"
          value={shippingInfo.country}
          onChange={changeHandler}
          required
        />
        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
          <option value="america">America</option>
          <option value="nepal">Nepal</option>
          <option value="bangladesh">Bangladesh</option>
        </select>
        <input
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
          required
        />
        <button>Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
