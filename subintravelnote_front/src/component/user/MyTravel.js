import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";

const MyTravel = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [myTravelList, setMyTravelList] = useState([]);
  useEffect(() => {
    axios
      .get(`${backServer}/user/myTravel/${userNick}/${reqPage}`)
      .then((res) => {
        console.log(res.data.list);
        setMyTravelList(res.data.list);
        setPi(res.data.pi);
      });
  }, [reqPage]);
  return (
    <div className="mytravel-content">
      <div className="page-title-info">내가 만든 일정</div>
      <div className="myTravel-list">
        {myTravelList && myTravelList.length > 0 ? (
          myTravelList.map((myTravel, i) => {
            return <MyTravelItem key={"myTravel" + i} myTravel={myTravel} />;
          })
        ) : (
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              height: "100px",
              margin: "0 auto",
              lineHeight: "100px",
            }}
          >
            <h3>아직 생성한 일정이 없습니다.</h3>
          </div>
        )}
      </div>
      <div className="mytravel-page-navi">
        <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
      </div>
    </div>
  );
};

const MyTravelItem = (props) => {
  const myTravel = props.myTravel;
  const navigate = useNavigate();
  const navigateMyTravel = () => {
    if (myTravel.countryName === "대한민국") {
      navigate(`/schedule/${myTravel.itineraryNo}`);
    } else {
      navigate(`/foreign/plan/${myTravel.itineraryNo}`);
    }
  };
  const getImagePath = (city) => {
    switch (city) {
      case "서울":
        return "/images/서울.jpg";
      case "부산":
        return "/images/부산.jpg";
      case "강릉":
        return "/images/강릉.jpg";
      case "대전":
        return "/images/대전.jpg";
      case "인천":
        return "/images/인천.jpg";
      case "제주":
        return "/images/제주.jpg";
      case "가평":
        return "/images/가평.jpg";
      case "거제 통영":
        return "/images/거제 통영.jpg";
      case "경주":
        return "/images/경주.jpg";
      case "군산":
        return "/images/군산.jpg";
      case "남원":
        return "/images/남원.jpg";
      case "목포":
        return "/images/목포.jpg";
      case "수원":
        return "/images/수원.jpg";
      case "안동":
        return "/images/안동.jpg";
      case "여수":
        return "/images/여수.jpg";
      case "영월":
        return "/images/영월.jpg";
      case "전주":
        return "/images/전주.jpg";
      case "제천":
        return "/images/제천.jpg";
      case "춘천":
        return "/images/춘천.jpg";
      case "포항":
        return "/images/포항.jpg";
      default:
        return "/images/default_img.png";
    }
  };
  const imagePath = getImagePath(myTravel.regionName);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  return (
    <div
      onClick={navigateMyTravel}
      className="reservation-item"
      style={{ marginBottom: "20px", cursor: "pointer" }}
    >
      <div className="reservation-thum">
        {myTravel.countryName === "대한민국" ? (
          <img className="reservation-img" src={imagePath}></img>
        ) : (
          <img
            className="reservation-img"
            src={
              myTravel.regionImg !== ""
                ? `${backServer}/foreignImg/${myTravel.regionImg}`
                : "/image/default_img.png"
            }
          ></img>
        )}
      </div>
      <div className="reservation-table">
        <table>
          <tbody>
            <tr>
              <th>일정명 : </th>
              <td colSpan={2}>{myTravel.itineraryTitle}</td>
            </tr>
            <tr>
              <td>{myTravel.itineraryStartDate}</td>
              <td>~</td>
              <td>{myTravel.itineraryEndDate}</td>
            </tr>
            <tr>
              <td>{myTravel.countryName}</td>
              <td colSpan={2}>{myTravel.regionName}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTravel;
