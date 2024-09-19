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
    exchange: "a08f2cb5d24898544c7a1ded", // ExchangeRate API 키
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
      const BASE_CURRENCY = "KRW"; // 한국 원화
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${API_KEYS.exchange}/latest/${BASE_CURRENCY}`
        );
        setExchangeRate(response.data);
      } catch (error) {
        console.error("환율 정보를 가져오는 중 오류 발생:", error);
      }
    };

    fetchWeather();
    fetchExchangeRate();
  }, [currentIndex]); // currentIndex가 변경될 때마다 호출

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % locations.length);
    }, 4000); // 4000ms (4초)마다 다음 위치로 이동

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
  }, []);

  const nextLocation = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % locations.length);
  };

  const prevLocation = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? locations.length - 1 : prevIndex - 1
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>여행지 정보</h1>

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <button onClick={prevLocation}>
          <span class="material-icons">chevron_left</span>
        </button>
        <h2 style={{ margin: "0 20px" }}>{locations[currentIndex].name}</h2>
        <button onClick={nextLocation}>
          <span class="material-icons">chevron_right</span>
        </button>
      </div>

      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
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

      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h2>환율 정보</h2>
        {exchangeRate ? (
          <div>
            <p>기본 통화 : KRW</p>
            <p>
              1 {locations[currentIndex].currency} ={" "}
              {1 /
                exchangeRate.conversion_rates[
                  locations[currentIndex].currency
                ]}{" "}
              KRW
            </p>
          </div>
        ) : (
          <p>환율 정보를 불러오는 중입니다...</p>
        )}
      </div>

      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h2>{locations[currentIndex].name}에 대한 설명</h2>
        <p>{locations[currentIndex].description}</p>
      </div>

      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h2>{locations[currentIndex].name} 이미지</h2>

        <img
          src={locations[currentIndex].image}
          alt={locations[currentIndex].name}
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "auto",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};

export default Main;
