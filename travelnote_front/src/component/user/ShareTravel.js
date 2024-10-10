import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";

const ShareTravel = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});
  const [shareTravelList, setShareTrevelList] = useState([]);
  const [userNick, setUserNick] = useRecoilState(userNickState);

  useEffect(() => {
    axios
      .get(`${backServer}/user/shareTravelList/${userNick}/${reqPage}`)
      .then((res) => {
        setShareTrevelList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);
  return (
    <div className="shareTrevel-content">
      <div className="page-title-info">공유된 일정</div>
      <div>
        {shareTravelList && shareTravelList.length > 0 ? (
          shareTravelList.map((shareTravel, i) => {
            return (
              <ShareTravelItem
                key={"shareTravel" + i}
                shareTravel={shareTravel}
              />
            );
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
            <h3>아직 공유받은 일정이 없습니다.</h3>
          </div>
        )}
      </div>
      <div className="mytravel-page-navi">
        <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
      </div>
    </div>
  );
};

const ShareTravelItem = (props) => {
  const shareTravel = props.shareTravel;
  const navigate = useNavigate();
  const navigateShareTravel = () => {
    if (shareTravel.countryName === "대한민국") {
      navigate(`/schedule/${shareTravel.itineraryNo}`);
    } else {
      navigate(`/foreign/plan/${shareTravel.itineraryNo}`);
    }
  };
  return (
    <div
      onClick={navigateShareTravel}
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
              <td colSpan={2}>{shareTravel.itineraryTitle}</td>
            </tr>
            <tr>
              <td>{shareTravel.itineraryStartDate}</td>
              <td>~</td>
              <td>{shareTravel.itineraryEndDate}</td>
            </tr>
            <tr>
              <td>{shareTravel.countryName}</td>
              <td colSpan={2}>{shareTravel.regionName}</td>
            </tr>
            <tr>
              <td>공유해준 사람 : </td>
              <td colSpan={2}>{shareTravel.sendUser}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShareTravel;
