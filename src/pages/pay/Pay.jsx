import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

const stripePromise = loadStripe("pk_test_51ODSDeLvnuzVywpy5Ct2NZ2LCJ8RBPmHRNjneCDL1SJ1xzz3538TcElXCiYThRUFmHgzeEnQXCXMOmRlBCm9ANF5009RH4Bvr7");


const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");

  const { id } = useParams();

  useEffect(() => {
    makeRequest();
  }, []);
  const makeRequest = async () => {
    const idUser = JSON.parse(localStorage.getItem('currentUser'));
    try {
      const res = await newRequest.post( //Điều này có thể là endpoint của server chịu trách nhiệm tạo một Payment Intent và trả về `clientSecret`.
        `/orders/create-payment-intent/${id}`, { idUser: idUser._id }
      );
      setClientSecret(res.data.clientSecret); //Lưu trữ giá trị `clientSecret` từ response vào state `clientSecret`. Khi state thay đổi, component sẽ render lại.
    } catch (err) {
      console.log(err);
    }
  };

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="pay">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}

export default Pay