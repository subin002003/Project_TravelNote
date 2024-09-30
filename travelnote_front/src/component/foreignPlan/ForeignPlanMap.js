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

  // 구글 지도 스크립트 추가
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.onload = setGoogleMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [googleMapsApiKey]);

  // 지도 세팅
  const setGoogleMap = () => {
    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: Number(regionInfo.regionLatitude),
        lng: Number(regionInfo.regionLongitude),
      },
      zoom: 13,
    });
    setMap(googleMap);
  };

  // 지역 정보 조회되면 지도 중심 설정
  useEffect(() => {
    if (!map) return;
    map.setCenter({
      lat: Number(regionInfo.regionLatitude),
      lng: Number(regionInfo.regionLongitude),
    });
  }, [regionInfo]);

  // 중심지, 정보창 위치 변경
  useEffect(() => {
    if (!selectedPosition) return;
    map.setCenter(selectedPosition);
  }, [selectedPosition]);

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
        resultList.forEach((place) => {
          new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
          });
        });

        map.setCenter(resultList[0].geometry.location);
        map.setZoom(15);
        setSearchPlaceList(resultList);
        setSelectedPosition(resultList[0].geometry.location);
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
