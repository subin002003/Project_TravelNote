import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";

// path: foreign/list
const ForeignList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate();

  const [regionTotalCount, setRegionTotalCount] = useState(0); // 여행지 개수
  const [isMoreRegionLeft, setIsMoreRegionLeft] = useState(true); // 더보기 버튼 띄울지 여부
  const [regionList, setRegionList] = useState([]); // 현재 띄운 목록
  const [reqPage, setReqPage] = useState(1);
  const [searchInput, setSearchInput] = useState(""); // 검색어

  // 여행지 개수 조회
  const getTotalCount = () => {
    axios
      .get(`${backServer}/foreign/totalCount`, {
        params: { searchInput: searchInput },
      })
      .then((res) => {
        setRegionTotalCount(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 최초 렌더링 시 한 번 실행
  useEffect(() => {
    getTotalCount();
  }, []);

  // 기본 여행지 목록 조회
  useEffect(() => {
    axios
      .get(`${backServer}/foreign/list/${reqPage}`)
      .then((res) => {
        setRegionList([...regionList, ...res.data]); // 목록에 여행지 추가

        // 여행지가 전부 조회되었으면 더보기 버튼 없애기
        if (regionList.length + res.data.length === regionTotalCount) {
          setIsMoreRegionLeft(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  // 더보기 버튼 클릭 시 reqPage 1 증가 -> 기본 여행지 목록 조회
  const moreButtonHandler = () => {
    setReqPage(reqPage + 1);
  };

  // 여행지 검색
  const searchRegion = () => {
    setRegionList([]);
    setRegionTotalCount(0);
    axios
      .get(`${backServer}/foreign/list/1`, {
        params: { searchInput: searchInput },
      })
      .then((res) => {
        setRegionList(res.data); // 여행지 목록 갱신
        setRegionTotalCount(res.data.length); // 여행지 개수 갱신
        setReqPage(1);
        setIsMoreRegionLeft(false); // 검색 결과는 최대 6개로 한정이라 더보기 버튼 없애기
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          text: "잠시 후 다시 시도해 주세요.",
        });
      });
  };

  // 엔터 치면 검색
  const activateSearch = (e) => {
    if (e.keyCode === 13) {
      document.getElementById("search-button").click();
    }
  };

  // 섹션
  return (
    <section className="section">
      <div className="foreign-title">
        <h2>해외 여행 플래너</h2>
      </div>
      <div className="foreign-search-box">
        <input
          className="foreign-search-input"
          placeholder="어디로 갈까요?"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          onKeyUp={activateSearch}
        ></input>
        <button id="search-button" type="button" onClick={searchRegion}>
          검색
        </button>
      </div>
      {regionList.length !== 0 ? (
        <RegionList
          regionList={regionList}
          backServer={backServer}
          navigate={navigate}
          moreButtonHandler={moreButtonHandler}
          isMoreRegionLeft={isMoreRegionLeft}
          isLogin={isLogin}
        />
      ) : (
        <div className="foreign-list">
          <h3>아직 등록된 여행지가 없어요.</h3>
        </div>
      )}
    </section>
  );
};

// 여행지 목록
const RegionList = (props) => {
  const {
    backServer,
    regionList,
    navigate,
    moreButtonHandler,
    isMoreRegionLeft,
    isLogin,
  } = props;

  return (
    <div className="foreign-list">
      <ul>
        {regionList.map((region, index) => {
          return (
            <Region
              key={"region-" + index}
              region={region}
              backServer={backServer}
              navigate={navigate}
              isLogin={isLogin}
            />
          );
        })}
      </ul>

      {/* 게시물이 남았을 때에만 더보기 버튼 보이기 */}
      {isMoreRegionLeft ? (
        <div className="req-more-button-wrap">
          <button
            type="button"
            id="req-more-button"
            onClick={moreButtonHandler}
          >
            더보기
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

// 여행지 li
const Region = (props) => {
  const { backServer, region, navigate, isLogin } = props;

  // 클릭 시 여행 일정 생성으로 이동
  const createItinerary = () => {
    if (isLogin) {
      navigate(`/foreign/createItinerary/${region.regionNo}`);
    } else {
      Swal.fire({
        icon: "info",
        text: "로그인이 필요합니다.",
      });
    }
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
