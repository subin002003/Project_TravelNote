import { useEffect, useRef, useState } from "react";

const ForeignPlanMap = (props) => {
  const {
    map,
    setMap,
    regionInfo,
    searchKeyword,
    setSearchKeyword,
    setSearchPlaceList,
    selectedPosition,
    setSelectedPosition,
    placeInfo,
    setPlaceInfo,
    searchDepartAirport,
    setSearchDepartAirport,
    searchArrivalAirport,
    setSearchArrivalAirport,
    searchAirport,
    planPageOption,
    planList,
    isPlanDiffered,
  } = props;
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef();
  const infoWindowRef = useRef(null);
  const [markerArr, setMarkerArr] = useState([]);
  const [pathPoints, setPathPoints] = useState(null);

  // 구글 지도 스크립트 추가
  useEffect(() => {
    if (regionInfo.regionLatitude !== "" && mapRef) {
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
    if (map && regionInfo.regionLatitude !== "") {
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

  // planPageOption 바뀔 때마다 마커 띄우기/지우기
  useEffect(() => {
    if (!map) return;
    // 기존 마커 있으면 지우기
    markerArr.forEach((marker) => {
      marker.setMap(null);
    });
    if (pathPoints) {
      pathPoints.setMap(null);
    }
    // planPageOption이 1일 때 조회이므로 planList에 있는 리스트를 마커로 띄우기
    if (planPageOption === 1 && planList.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      const newPathPoints = [];
      const newMarkerArr = [];
      planList.map((place, index) => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: Number(place.planLatitude),
            lng: Number(place.planLongitude),
          },
          map: map,
          label: {
            text: String(place.planSeq),
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
          },
        });
        bounds.extend(marker.position);
        // 마커 이벤트 리스너
        marker.addListener("click", () => {
          map.setZoom(15);
          map.setCenter({
            lat: Number(place.planLatitude),
            lng: Number(place.planLongitude),
          });
          setPlaceInfo({
            placeName: place.planName,
            placeLocation: {
              lat: Number(place.planLatitude),
              lng: Number(place.planLongitude),
            },
            placeAddress: place.planAddress,
            placeId: place.planId,
          });
          setSelectedPosition({
            lat: Number(place.planLatitude),
            lng: Number(place.planLongitude),
          });
        });
        newPathPoints.push({
          lat: Number(place.planLatitude),
          lng: Number(place.planLongitude),
        });
        newMarkerArr.push(marker);
      });
      setMarkerArr(newMarkerArr);
      if (newMarkerArr.length > 0) {
        map.fitBounds(bounds);
      }
      if (map.getZoom() > 13) {
        map.setZoom(13);
      }
      const polyline = new window.google.maps.Polyline({
        path: newPathPoints,
        geodesic: false,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 1,
        map: map,
      });
      setPathPoints(polyline);
    } else {
      map.setCenter({
        lat: Number(regionInfo.regionLatitude),
        lng: Number(regionInfo.regionLongitude),
      });
      map.setZoom(13);
    }
  }, [regionInfo, planPageOption, planList]);

  // placeInfo 바뀔 때마다 인포윈도우 띄우기
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
  }, [placeInfo]);

  // 장소 검색
  useEffect(() => {
    if (!map || !searchKeyword) return;
    const mapService = new window.google.maps.places.PlacesService(map);
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

    // 기존 마커 지우기
    markerArr.forEach((marker) => {
      marker.setMap(null);
    });

    // 검색 실행
    mapService.textSearch(request, (resultList, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        resultList
      ) {
        const bounds = new window.google.maps.LatLngBounds();
        // 마커 추가
        const newMarkerArr = [];
        resultList.map((place, index) => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
          });
          bounds.extend(marker.position);
          marker.addListener("click", () => {
            map.setZoom(15);

            map.setCenter(place.geometry.location);
            setPlaceInfo({
              placeName: place.name,
              placeLocation: place.geometry.location,
              placeAddress: place.formatted_address,
              placeId: place.place_id,
            });
            setSelectedPosition(place.geometry.location);
          });
          newMarkerArr.push(marker);
        });
        if (newMarkerArr.length > 0) {
          map.fitBounds(bounds);
        }
        if (map.getZoom() > 13) {
          map.setZoom(13);
        }
        setMarkerArr(newMarkerArr);
        setSearchPlaceList(resultList);
        setSearchKeyword("");
      } else {
        setSearchPlaceList([]);
        setSearchKeyword("");
      }
    });
  }, [searchKeyword]);

  // 공항 검색
  useEffect(() => {
    if (!map || (searchDepartAirport === "" && searchArrivalAirport === ""))
      return;
    var queryKeyword = "";
    if (searchAirport === 1) {
      queryKeyword = searchDepartAirport;
    } else if (searchAirport === 2) {
      queryKeyword = searchArrivalAirport;
    } else {
      return;
    }
    const mapService = new window.google.maps.places.PlacesService(map);

    const request = {
      location: {
        lat: Number(regionInfo.regionLatitude),
        lng: Number(regionInfo.regionLongitude),
      },
      radius: 500,
      query: queryKeyword,
      fields: ["name", "geometry", "place_id", "formatted_address", "photos"],
      language: "ko",
    };

    // 기존 마커 지우기
    markerArr.forEach((marker) => {
      marker.setMap(null);
    });

    // 검색 실행
    mapService.textSearch(request, (resultList, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        resultList
      ) {
        const bounds = new window.google.maps.LatLngBounds();
        // 마커 추가
        const newMarkerArr = [];
        resultList.map((place, index) => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
          });
          bounds.extend(marker.position);
          newMarkerArr.push(marker);
        });
        if (newMarkerArr.length > 0) {
          map.fitBounds(bounds);
        }
        if (map.getZoom() > 13) {
          map.setZoom(13);
        }
        setMarkerArr(newMarkerArr);
        setSearchPlaceList(resultList);
        setSearchDepartAirport("");
        setSearchArrivalAirport("");
      } else {
        setSearchPlaceList([]);
        setSearchDepartAirport("");
        setSearchArrivalAirport("");
      }
    });
  }, [searchDepartAirport, searchArrivalAirport]);

  // isPlanDiffered 바뀔 때마다 마커, 인포윈도우 삭제
  useEffect(() => {
    if (!map || !placeInfo) return;

    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  }, [isPlanDiffered]);

  return (
    <div className="plan-map-wrap">
      <div className="foreign-map" ref={mapRef} />
    </div>
  );
};

export default ForeignPlanMap;
