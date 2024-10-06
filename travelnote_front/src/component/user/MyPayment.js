import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loginEmailState, userNickState } from "../utils/RecoilData";
import axios from "axios";

const MyPayment = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [myPaymentList, setMyPaymentList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);
  useEffect(() => {
    axios
      .get(`${backServer}/user/myPayment/${userNick}/${reqPage}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userNick, reqPage]);
  return (
    <div className="mypayment-list">
      <div
        style={{ marginBottom: "20px", marginTop: "20px" }}
        className="page-title-info"
      >
        내 판매 내역
      </div>
    </div>
  );
};

export default MyPayment;
