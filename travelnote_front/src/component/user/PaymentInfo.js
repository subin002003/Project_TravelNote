import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const PaymentInfo = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const orderNo = params.orderNo;
  useEffect(() => {
    axios
      .get(`${backServer}/user/paymentInfo/${orderNo}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orderNo]);
};

export default PaymentInfo;
