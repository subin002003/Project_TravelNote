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
        console.log(res.data);
        setMyTravelList(res.data.list);
        setPi(res.data.pi);
        console.log(pi);
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
  return (
    <div
      onClick={navigateMyTravel}
      className="reservation-item"
      style={{ marginBottom: "20px", cursor: "pointer" }}
    >
      <div className="reservation-thum">
        <img className="reservation-img" src="/image/logo1.png"></img>
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
