import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ForeignList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [regionList, setRegionList] = useState([]);
  const [reqPage, setReqPage] = useState(1);

  // 여행지 목록 조회
  useEffect(() => {
    axios
      .get(`${backServer}/foreign/list/${reqPage}`)
      .then((res) => {
        setRegionList([...regionList, ...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  // 여행지 검색
  const searchRegion = () => {};

  return (
    <section className="section">
      <div className="foreign-search-box">
        <input placeholder="어디로 갈까요?"></input>
        <button type="button" onClick={searchRegion}>
          검색
        </button>
      </div>
      <div className="foreign-list">
        <ul>
          {regionList.map((region, index) => {
            console.log(region);
            return (
              <Region
                key={"region-" + index}
                region={region}
                backServer={backServer}
                navigate={navigate}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
};

// 여행지 li
const Region = (props) => {
  const backServer = props.backServer;
  const region = props.region;
  const navigate = props.navigate;
  const createItinerary = () => {
    navigate(`/foreign/createItinerary/${region.regionNo}`);
  };

  return (
    <li onClick={createItinerary}>
      <div className="region-img">
        <img
          src={
            region.regionImg
              ? `${backServer}/foreign/${region.regionImg}`
              : "/image/default_img.png"
          }
        ></img>
      </div>
      <div className="region-title">
        <div className="region-name">{region.regionName}</div>
        <div className="country-name">{region.countryName}</div>
      </div>
    </li>
  );
};

export default ForeignList;
