import { useParams, useNavigate } from "react-router-dom";
import "./CityDetail.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { loginEmailState } from "../utils/RecoilData";
import WeatherDescKo from "./WeatherDescKo";

const CityDetail = () => {
  const [weather, setWeather] = useState(null);
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const { cityName, regionNo } = useParams();
  const navigate = useNavigate();
  const [loginEmail] = useRecoilState(loginEmailState);
  const [tripTitle, setTripTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cityInfo, setCityInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_KEYS = {
    weather: "a33e108aafd2700b393505935a10c98e", // OpenWeatherMap API 키
  };

  const locations = [
    {
      name: "Jeju",
    },
    {
      name: "서울",
    },
  ];

  // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split("T")[0];

  // 도시 정보와 날씨 정보를 가져오는 useEffect
  useEffect(() => {
    axios
      .get(`${backServer}/domestic/view/${regionNo}`)
      .then((res) => {
        setCityInfo(res.data);
        getWeatherForCity(res.data.regionName);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          text: "도시 정보를 가져오는 데 실패했습니다.",
        });
      });
  }, [backServer, regionNo]);

  // 도시 이름을 기반으로 날씨 정보를 가져오는 함수
  const getWeatherForCity = async (cityName) => {
    try {
      // 도시 이름으로 날씨를 가져오는 API 호출
      const res = await axios.get(
        `/api/data/2.5/weather?q=${locations[currentIndex].name}&appid=${API_KEYS.weather}&units=metric`
      );
      const weatherId = res.data.weather[0].id;
      const weatherKo = WeatherDescKo[weatherId];
      // 날씨 아이콘 가져오기
      const weatherIcon = res.data.weather[0].icon;
      const weatherIconAdrs = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      // 소수점 버리기
      const temp = Math.round(res.data.main.temp);

      setWeather({
        description: weatherKo,
        name: cityName,
        temp: temp,
        icon: weatherIconAdrs,
      });
    } catch (err) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      Swal.fire({
        icon: "warning",
        text: "날짜를 입력해 주세요.",
      });
      return;
    }

    const obj = {};
    obj.userEmail = loginEmail; // 객체.키 = 값; 형식으로 필요한 속성들 추가
    obj.regionNo = regionNo;
    obj.itineraryStartDate = startDate;
    obj.itineraryEndDate = endDate;
    obj.itineraryTitle = tripTitle.trim() || `${cityName} 여행`;

    axios
      .post(`${backServer}/domestic/Schedule`, obj)
      .then((res) => {
        Swal.fire({
          icon: "success",
          text: "여행 일정 만들기 성공.",
        });
        navigate(`/schedule/${res.data}`);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          text: "여행 일정 저장에 실패했습니다.",
        });
      });
  };

  return (
    <div className="city-detail">
      <div className="detail-content">
        {cityInfo ? (
          <>
            <h1>{cityInfo.regionName}</h1>
            <img
              src={`/images/${cityInfo.regionName}.jpg`}
              alt={cityInfo.regionName}
              className="city-detail-image"
            />
            {weather ? (
              <div className="weather-info">
                <div className="weather-temp">{weather.temp}°C</div>
                <div className="weather-description">
                  <img src={weather.icon} alt={weather.description} />
                  <p>{weather.description}</p>
                </div>
              </div>
            ) : (
              <p>Loading weather...</p>
            )}
            <form className="trip-form" onSubmit={handleSubmit}>
              <label>
                여행 제목 입력:
                <input
                  type="text"
                  placeholder="여행 제목을 입력해주세요"
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
                    min={startDate || today}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </label>
              </div>
              <button className="trip-btn" type="submit">
                여행 일정 만들기
              </button>
            </form>
          </>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default CityDetail;
