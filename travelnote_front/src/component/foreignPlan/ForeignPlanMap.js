import { useEffect, useState } from "react";

const ForeignPlanMap = () => {
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [map, setMap] = useState();

  const setGoogleMap = () => {
    const googleMap = new window.google.maps.Map(
      document.getElementById("google-map"),
      {
        center: { lat: -34.397, lng: 150.644 }, // 초기 중심 좌표
        zoom: 12,
      }
    );
    setMap(googleMap);
  };

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

  // 장소 검색
  const searchPlaces = (searchInput) => {
    if (!map) return;

    const placeService = new window.google.maps.places.PlacesService(map);
    const request = {
      query: searchInput,
      fields: ["name", "geometry"],
    };

    placeService.findPlaceFromQuery(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        // 결과가 있을 때
        results.forEach((place) => {
          new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
          });
        });
        // 첫 번째 장소로 지도를 이동
        map.setCenter(results[0].geometry.location);
      }
    });
  };

  // 마커 추가하는 방법
  // const addMarker = (lat, lng) => {
  //   const marker = new window.google.maps.Marker({
  //     position: { lat, lng },
  //     map: map,
  //   });
  // };

  return (
    <div className="plan-map-wrap">
      <div id="google-map" className="foreign-map" />
    </div>
  );
};

export default ForeignPlanMap;
