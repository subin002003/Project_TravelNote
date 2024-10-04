import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { loginEmailState } from "../utils/RecoilData";

const DomesticPlanShare = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const cityName = params.cityName;
  const regionNo = params.regionNo;
  const itineraryNo = params.itineraryNo;
  const navigate = useNavigate();
  const [loginEmail] = useRecoilState(loginEmailState);
  const [tripTitle, setTripTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cityInfo, setCityInfo] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  console.log(regionNo, regionNo);
  console.log(cityName, cityName);
  console.log(itineraryNo, itineraryNo);
  // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split("T")[0];

  // 도시 정보와 기존 여행 일정 정보 가져오기
  useEffect(() => {
    const fetchData = () => {
      // 도시 정보 가져오기
      axios
        .get(`${backServer}/domestic/view/${regionNo}`)
        .then((cityResponse) => {
          setCityInfo(cityResponse.data);

          // 기존 여행 일정 정보 가져오기
          return axios.get(`${backServer}/domestic/itinerary/${itineraryNo}`); // itineraryNo 사용
        })
        .then((itineraryResponse) => {
          const itinerary = itineraryResponse.data;
          setTripTitle(itinerary.itineraryTitle); // 기존 제목 설정
          setStartDate(itinerary.itineraryStartDate); // 기존 시작 날짜 설정
          setEndDate(itinerary.itineraryEndDate); // 기존 종료 날짜 설정
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          Swal.fire({
            icon: "error",
            text: "여행 일정을 가져오는 데 실패했습니다.",
          });
        })
        .finally(() => {
          setLoading(false); // 로딩 완료
        });
    };

    fetchData();
  }, [backServer, regionNo, itineraryNo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const obj = {
      userEmail: loginEmail,
      regionNo: regionNo,
      itineraryStartDate: startDate,
      itineraryEndDate: endDate,
      itineraryTitle: tripTitle.trim() || `${cityName} 여행`,
    };

    axios
      .patch(`${backServer}/domestic/itinerary/${itineraryNo}`, obj) // itineraryNo를 URL에 포함
      .then((response) => {
        Swal.fire({
          icon: "success",
          text: "여행 일정 수정이 성공적으로 저장되었습니다.",
        });
        navigate(`/schedule/${itineraryNo}`); // 수정된 일정 ID로 리디렉션
      })
      .catch((error) => {
        console.error("Error saving itinerary:", error);
        Swal.fire({
          icon: "error",
          text: "여행 일정 수정에 실패했습니다.",
        });
      });
  };

  return (
    <div className="city-detail">
      <div className="detail-content">
        {cityInfo && (
          <>
            <h1>{cityInfo.regionName}</h1>
            <img
              src={`/images/${cityInfo.regionName}.jpg`}
              alt={cityInfo.regionName}
              className="city-detail-image"
            />
            <form className="trip-form" onSubmit={handleSubmit}>
              <label>
                여행 제목 입력:
                <input
                  type="text"
                  placeholder="여행 제목 (수정 가능)"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                />
              </label>
              <div className="date-inputs">
                <label>
                  여행 시작 날짜:
                  <input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>
                <label>
                  여행 종료 날짜:
                  <input
                    type="date"
                    value={endDate}
                    min={today}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </label>
              </div>
              <button className="trip-btn" type="submit">
                여행 일정 수정하기
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DomesticPlanShare;
