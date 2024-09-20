import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ForeignList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [regionList, setRegionList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  // 여행지 목록 조회
  useEffect(() => {
    axios
      .get(`${backServer}/foreign/list/${reqPage}`)
      .then((res) => {
        setRegionList([...regionList, ...res.data]);
      })
      .catch((err) => {});
  }, [reqPage]);

  // 여행지 검색
  const searchRegion = () => {
    console.log(searchInput);
    axios
      .get(`${backServer}/foreign/list/1`, {
        params: { searchInput: searchInput },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="section">
      <div className="foreign-search-box">
        <input
          placeholder="어디로 갈까요?"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        ></input>
        <button type="button" onClick={searchRegion}>
          검색
        </button>
      </div>
      <div className="foreign-list">
        {regionList.length != 0 ? (
          <ul>
            {regionList.map((region, index) => {
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
        ) : (
          <div>아직 등록된 여행지가 없어요.</div>
        )}
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
