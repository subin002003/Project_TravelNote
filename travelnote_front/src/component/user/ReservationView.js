import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import axios from "axios";

const ReservationView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const orderNo = params.orderNo;
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [reservationInfo, setReservationInfo] = useState({});
  useEffect(() => {
    axios
      .get(`${backServer}/user/reservationInfo/${orderNo}`)
      .then((res) => {
        console.log(res);
        setReservationInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orderNo, userNick]);

  return (
    <div className="reservation-info-wrap">
      <div
        className="page-title-info"
        style={{ marginBottom: "20px", marginTop: "20px" }}
      >
        예약 내역 상세보기
      </div>
      <table className="reservation-info-table">
        <tbody>
          <tr>
            <th>예약 상품명</th>
            <td colSpan={3}>{reservationInfo.productName}</td>
          </tr>
          <tr>
            <th>결제 방식</th>
            <td colSpan={3}>
              {reservationInfo.paymentType === 4
                ? "헥토파이낸셜"
                : reservationInfo.paymentType === 1
                ? "카카오페이"
                : reservationInfo.paymentType === 2
                ? "스마일페이"
                : reservationInfo.paymentType === 3
                ? "페이코"
                : "알 수 없는 결제수단"}
            </td>
          </tr>
          <tr>
            <th>결제 일시</th>
            <td colSpan={3}>{reservationInfo.orderDate}</td>
          </tr>
          <tr>
            <th>예약자</th>
            <td>{reservationInfo.buyerName}</td>
            <th>에약자 연락처</th>
            <td>{reservationInfo.buyerPhone}</td>
          </tr>
          <tr>
            <th>예약 인원</th>
            <td>{reservationInfo.people}명</td>
            <th>예약 가격</th>
            <td>{reservationInfo.price}00원</td>
          </tr>
          <tr>
            <th>여행사 명</th>
            <td>{reservationInfo.sellerNick}</td>
            <th>여행사 연락처</th>
            <td>{reservationInfo.sellerPhone}</td>
          </tr>
          <tr>
            <th>여행 시작일</th>
            <td>{reservationInfo.startDate}</td>
            <th>여행 종료일</th>
            <td>{reservationInfo.endDate}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReservationView;
