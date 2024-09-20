import React, { useEffect, useState } from "react";
import axios from "axios";
import jejuImage from "./images/mainImage/jeju.jpg";
import tokyoImage from "./images/mainImage/tokyo.jpg";
import newyorkImage from "./images/mainImage/newyork.jpg";
import parisImage from "./images/mainImage/paris.jpg";
import beijingImage from "./images/mainImage/beijing.jpg";

const Main = () => {
  const [weather, setWeather] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_KEYS = {
    weather: "a33e108aafd2700b393505935a10c98e", // OpenWeatherMap API 키
    exchange: "fca_live_EeFeNGdxZTuLBGhbi5zT4weOAZk1AgA4ahK7Q0EP", // freecurrency API 키
  };

  // 지역 이름(name) /  해당 통화(currency) / 지역 설명(description) / 지역 이미지(image)
  const locations = [
    {
      name: "Jeju",
      currency: "KRW",
      description:
        "제주는 한국의 아름다운 섬으로, 독특한 자연경관과 풍부한 문화유산을 자랑합니다.",
      image: jejuImage,
    },
    {
      name: "Tokyo",
      currency: "JPY",
      description:
        "도쿄는 일본의 수도이며, 전통과 현대가 어우러진 독특한 문화가 특징입니다.",
      image: tokyoImage,
    },
    {
      name: "New York",
      currency: "USD",
      description:
        "뉴욕은 미국의 대표적인 대도시로, 다양한 문화와 예술의 중심지입니다.",
      image: newyorkImage,
    },
    {
      name: "Paris",
      currency: "EUR",
      description:
        "파리는 프랑스의 수도로, 세계적으로 유명한 예술과 패션의 도시입니다.",
      image: parisImage,
    },
    {
      name: "Beijing",
      currency: "CNY",
      description:
        "베이징은 중국의 수도이며, 역사적인 유적과 현대적인 발전이 공존하는 도시입니다.",
      image: beijingImage,
    },
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${locations[currentIndex].name}&appid=${API_KEYS.weather}&units=metric`
        );
        setWeather(response.data);
      } catch (error) {
        console.error("날씨 정보를 가져오는 중 오류 발생:", error);
      }
    };

    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(
          `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEYS.exchange}&base_currency=KRW`
        );

        console.log(response.data);

        setExchangeRate(response.data);
      } catch (error) {
        console.error("환율 정보를 가져오는 중 오류 발생:", error);
      }
    };

    fetchWeather();
    fetchExchangeRate();
  }, [currentIndex]); // currentIndex가 변경될 때마다 호출

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % locations.length);
  //   }, 4000); // 4000ms (4초)마다 다음 위치로 이동(환율 조회 제한 문제로 임시 주석처리함)

  //   return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
  // }, []);

  const nextLocation = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % locations.length);
  };

  const prevLocation = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? locations.length - 1 : prevIndex - 1
    );
  };

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "80px auto" }}>
      <h1 style={{ textAlign: "center", fontSize: "40px" }}>여행지 정보</h1>
      <h2
        style={{
          textAlign: "center",

          fontSize: "30px",
          marginBottom: "50px",
        }}
      >
        {locations[currentIndex].name}
      </h2>

      {/* 설명 + 이미지 */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* 설명 + 날씨 + 환율 */}
        <div
          style={{
            // height: "300px",
            width: "50%",

            padding: "10px",
            textAlign: "center",
          }}
        >
          {/* 설명 */}
          <div className="MainPage-info">
            <h2>{locations[currentIndex].name}</h2>
            <p>{locations[currentIndex].description}</p>
          </div>

          {/* 날씨 + 환율 */}
          <div style={{ marginTop: "20px", display: "flex", gap: "0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* 날씨 */}
              <div
                className="MainPage-weather"
                style={{
                  width: "45%",
                  marginLeft: "200px",
                  padding: "10px",
                }}
              >
                <h2>날씨 정보</h2>
                {weather ? (
                  <>
                    <p>온도: {weather.main.temp} °C</p>
                    <p>상태: {weather.weather[0].description}</p>
                    <p>습도: {weather.main.humidity}%</p>
                    <p>풍속: {weather.wind.speed} m/s</p>
                  </>
                ) : (
                  <p>날씨 정보를 불러오는 중입니다...</p>
                )}
              </div>

              {/* 환율 */}
              <div
                className="MainPage-exchangeRate"
                style={{
                  width: "45%",
                  marginRight: "100px",
                  padding: "10px",
                }}
              >
                <h2>환율 정보</h2>
                {exchangeRate ? (
                  <div>
                    <p>기본 통화 : KRW</p>
                    <p>
                      1 {locations[currentIndex].currency} ={" "}
                      {exchangeRate &&
                      exchangeRate.data &&
                      exchangeRate.data[locations[currentIndex].currency]
                        ? (
                            1 /
                            exchangeRate.data[locations[currentIndex].currency]
                          ).toFixed(2)
                        : "정보 없음"}{" "}
                      KRW
                    </p>
                    <p>
                      100 {locations[currentIndex].currency} ={" "}
                      {exchangeRate &&
                      exchangeRate.data &&
                      exchangeRate.data[locations[currentIndex].currency]
                        ? (
                            (1 /
                              exchangeRate.data[
                                locations[currentIndex].currency
                              ]) *
                            100
                          ).toFixed(2)
                        : "정보 없음"}{" "}
                      KRW
                    </p>
                  </div>
                ) : (
                  <p>환율 정보를 불러오는 중입니다...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 */}
        <div
          className="MainPage-image"
          style={{
            padding: "10px",
            width: "50%",
          }}
        >
          <img
            src={locations[currentIndex].image}
            alt={locations[currentIndex].name}
            style={{
              width: "100%",
              // maxWidth: "500px",
              height: "400px",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* 화살표 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1800px",
          margin: "20px 0",
          position: "absolute",
          top: "36%",
          left: "14.5%",
          gap: "1630px",
        }}
      >
        <button
          onClick={prevLocation}
          style={{
            marginRight: "10px",
            fontSize: "24px",
            background: "transparent",
            color: "#000000",
          }}
        >
          <span className="material-icons">chevron_left</span>
        </button>

        <button
          onClick={nextLocation}
          style={{
            marginLeft: "10px",
            fontSize: "24px",
            background: "transparent",
            color: "#000000",
          }}
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Main;
