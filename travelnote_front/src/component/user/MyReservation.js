import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import axios from "axios";
import PageNavi from "../utils/PagiNavi";
import { useNavigate } from "react-router-dom";

const MyReservation = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [reservationList, setReservationList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);
  useEffect(() => {
    axios
      .get(`${backServer}/user/myReservation/${userNick}/${reqPage}`)
      .then((res) => {
        console.log(res);
        setReservationList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage, userNick]);
  return (
    <div
      className="myReservation-content"
      style={{ marginTop: "20px", marginBottom: "20px" }}
    >
      <div className="page-title-info">내 예약 내역 보기</div>
      <div className="myReservation-list">
        {reservationList.map((reservation, i) => {
          return (
            <ReservationItem
              key={"reservation" + i}
              reservation={reservation}
            />
          );
        })}
      </div>
      <div className="myReservation-page-navi" style={{ marginTop: "20px" }}>
        <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
      </div>
    </div>
  );
};

const ReservationItem = (props) => {
  const reservation = props.reservation;
  const navigate = useNavigate();
  const navigateReservationView = () => {
    navigate(`/mypage/myReservation/${reservation.orderNo}`);
  };
  return (
    <div
      onClick={navigateReservationView}
      style={{ cursor: "pointer" }}
      className="reservation-item"
    >
      <div className="reservation-thum">
        <img className="reservation-img" src="/image/logo1.png"></img>
      </div>
      <div className="reservation-table">
        <table>
          <tbody>
            <tr>
              <th>예약 상품명 :</th>
              <td>{reservation.productName}</td>
            </tr>
            <tr>
              <th>예약 인원수 :</th>
              <td>{reservation.people}명</td>
            </tr>
            <tr>
              <th>가격 :</th>
              <td>{reservation.price}00원</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReservation;