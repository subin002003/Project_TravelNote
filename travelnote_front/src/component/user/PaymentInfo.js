import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PaymentInfo = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const orderNo = params.orderNo;
  const [paymentInfo, setPaymentInfo] = useState({});
  useEffect(() => {
    axios
      .get(`${backServer}/user/paymentInfo/${orderNo}`)
      .then((res) => {
        setPaymentInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orderNo]);
  return (
    <div style={{ marginBottom: "20px" }} className="paymentInfo-content">
      <div
        style={{ marginTop: "20px", marginBottom: "20px" }}
        className="page-title-info"
      >
        결제 상세 내역 보기
      </div>
      <div className="paymentInfo-table">
        <table>
          <tbody>
            <tr>
              <th style={{ width: "25%" }}>주문번호</th>
              <td colSpan={3}>{paymentInfo.orderNo}</td>
            </tr>
            <tr>
              <th>결제일시</th>
              <td colSpan={3}>{paymentInfo.orderDate}</td>
            </tr>
            <tr>
              <th>결제타입</th>
              <td colSpan={3}>
                {" "}
                {paymentInfo.paymentType === 4
                  ? "헥토파이낸셜"
                  : paymentInfo.paymentType === 1
                  ? "카카오페이"
                  : paymentInfo.paymentType === 2
                  ? "스마일페이"
                  : paymentInfo.paymentType === 3
                  ? "페이코"
                  : "알 수 없는 결제수단"}
              </td>
            </tr>
            <tr>
              <th>결제 상품명</th>
              <td colSpan={3}>{paymentInfo.productName}</td>
            </tr>
            <tr>
              <th style={{ width: "25%" }}>결제 가격</th>
              <td style={{ width: "25%" }}>{paymentInfo.price}00원</td>
              <th>결제 인원</th>
              <td>{paymentInfo.people}명</td>
            </tr>
            <tr>
              <th>여행 시작일</th>
              <td>{paymentInfo.startDate}</td>
              <th>여행 종료일</th>
              <td>{paymentInfo.endDate}</td>
            </tr>
            <tr>
              <th>구매자</th>
              <td>{paymentInfo.buyerName}</td>
              <th>구매자 연락처</th>
              <td>{paymentInfo.buyerPhone}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentInfo;
