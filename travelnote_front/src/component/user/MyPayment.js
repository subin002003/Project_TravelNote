import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loginEmailState, userNickState } from "../utils/RecoilData";
import axios from "axios";
import PageNavi from "../utils/PagiNavi";
import { Link } from "react-router-dom";

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
        setMyPaymentList(res.data.list);
        setPi(res.data.pi);
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
      <div className="mypayment-content">
        <table>
          <tbody>
            <tr>
              <th style={{ width: "20%" }}>결제 번호</th>
              <th style={{ width: "40%" }}>제품명</th>
              <th style={{ width: "40%" }}>결제 일시</th>
            </tr>
            {myPaymentList && myPaymentList.length > 0 ? (
              myPaymentList.map((payment, i) => {
                return <PaymentItem key={"payment" + i} payment={payment} />;
              })
            ) : (
              <tr>
                <th colSpan={3}>
                  <div
                    style={{
                      marginTop: "20px",
                      textAlign: "center",
                      height: "100px",
                      margin: "0 auto",
                      lineHeight: "100px",
                    }}
                  >
                    아직 판매된 상품이 없습니다.
                  </div>
                </th>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div
        style={{ marginTop: "20px", marginBottom: "20px" }}
        className="mypayment-page-navi"
      >
        <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
      </div>
    </div>
  );
};

const PaymentItem = (props) => {
  const payment = props.payment;
  return (
    <tr>
      <td>
        <Link to={`/mypage/myPayment/paymentInfo/${payment.orderNo}`}>
          {payment.orderNo}
        </Link>
      </td>
      <td>
        <Link to={`/mypage/myPayment/paymentInfo/${payment.orderNo}`}>
          {payment.productName}
        </Link>
      </td>
      <td>
        <Link to={`/mypage/myPayment/paymentInfo/${payment.orderNo}`}>
          {payment.orderDate}
        </Link>
      </td>
    </tr>
  );
};

export default MyPayment;
