import { useEffect, useRef, useState } from "react";

const ForeignPlanMap = (props) => {
  const {
    map,
    setMap,
    regionInfo,
    searchKeyword,
    setSearchPlaceList,
    selectedPosition,
    setSelectedPosition,
    placeInfo,
    setPlaceInfo,
  } = props;
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);

  // 구글 지도 스크립트 추가
  useEffect(() => {
    if (regionInfo) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.onload = setGoogleMap;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [googleMapsApiKey]);

  // 지도 세팅
  const setGoogleMap = () => {
    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: 51.50900910232921,
        lng: -0.1282882744195268,
      },
      zoom: 13,
    });
    setMap(googleMap);
  };

  // 지역 정보 조회되면 지도 중심 설정
  useEffect(() => {
    if (map && regionInfo) {
      map.setCenter({
        lat: Number(regionInfo.regionLatitude),
        lng: Number(regionInfo.regionLongitude),
      });
    }
  }, [regionInfo]);

  // selectedPosition에 따라 중심지, 정보창 변경
  useEffect(() => {
    if (map && selectedPosition) {
      map.setCenter(selectedPosition);
      map.setZoom(15);
    }
  }, [selectedPosition]);

  // placeInfo 바뀔 때마다 마커 띄우기
  useEffect(() => {
    if (!map || !placeInfo.placeName) return;

    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div className="gm-style-iw">
                  <div className="info-window-title-box" style="margin: 10px">
                    <h4>${placeInfo.placeName}</h4>
                  </div>
                  <div className="info-window-address-box" style="margin: 10px">
                    <p>${placeInfo.placeAddress}</p>
                  </div>
                  <div className="info-window-link-box" style="margin: 10px">
                    <a href="https://www.google.com/maps?q=place_id:${placeInfo.placeId}" target="_blank" style="color: var(--main-color); text-decoration: underline;">
                      구글 지도에서 보기
                    </a>
                  </div>
                </div>`,
    });
    infoWindow.setPosition(placeInfo.placeLocation);
    infoWindow.open({ map });
    infoWindowRef.current = infoWindow;

    // 닫기 기능 추가
    setTimeout(() => {
      const closeButton = document.getElementById("info-window-close-button");
      if (closeButton) {
        closeButton.addEventListener("click", closeInfoWindow);
      }
    }, 100);

    return () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      const closeButton = document.getElementById("info-window-close-button");
      if (closeButton) {
        closeButton.removeEventListener("click", closeInfoWindow);
      }
    };
  }, [placeInfo]);

  const closeInfoWindow = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  };

  // 장소 검색
  useEffect(() => {
    if (!map || !searchKeyword) return;
    // 서비스 객체
    const mapService = new window.google.maps.places.PlacesService(map);

    // 요청 정보 담는 객체
    const request = {
      location: {
        lat: Number(regionInfo.regionLatitude),
        lng: Number(regionInfo.regionLongitude),
      },
      radius: 500,
      query: searchKeyword,
      fields: ["name", "geometry", "place_id", "formatted_address", "photos"],
      language: "ko",
    };

    // 검색 실행
    mapService.textSearch(request, (resultList, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        resultList
      ) {
        const bounds = new window.google.maps.LatLngBounds();

        // 마커 추가
        resultList.map((place, index) => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
          });
          bounds.extend(marker.position);
          marker.addListener("click", () => {
            map.setZoom(15);
            setPlaceInfo({
              placeName: place.name,
              placeLocation: place.geometry.location,
              placeAddress: place.formatted_address,
              placeId: place.place_id,
            });
            setSelectedPosition(place.geometry.location);
          });
        });
        setSearchPlaceList(resultList);
      }
    });
  }, [searchKeyword]);

  return (
    <div className="plan-map-wrap">
      <div className="foreign-map" ref={mapRef} />
    </div>
  );
};

export default ForeignPlanMap;
