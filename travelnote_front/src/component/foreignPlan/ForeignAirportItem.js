import axios from "axios";
import Swal from "sweetalert2";

const ForeignAirportItem = (props) => {
  const {
    place,
    setSelectedPosition,
    setPlaceInfo,
    itineraryNo,
    selectedDay,
    backServer,
    totalPlanDates,
    setIsPlanAdded,
    departInfo,
    setDepartInfo,
    arrivalInfo,
    setArrivalInfo,
    searchAirport,
    setSearchAirport,
  } = props;

  // 클릭 시 지도 이동
  const viewPlace = () => {
    setSelectedPosition(place.geometry.location);
    setPlaceInfo({
      placeName: place.name,
      placeLocation: place.geometry.location,
      placeAddress: place.formatted_address,
      placeId: place.place_id,
    });
  };

  // 추가 버튼 클릭 시 DB에 저장하고 일정 목록에 추가
  const addAirport = () => {
    if (searchAirport === 1) {
      setDepartInfo({
        ...departInfo,
        itineraryNo: itineraryNo,
        planDay: selectedDay,
        planDate: totalPlanDates[selectedDay - 1],
        planAddress: place.formatted_address,
        planLatitude: place.geometry.location.lat(),
        planLongitude: place.geometry.location.lng(),
        planImage: place.photos[0].getUrl(),
        planType: 2,
        planName: place.name,
        planId: place.place_id,
        departAirport: place.name,
      });
      setSearchAirport(0);
      Swal.fire({
        icon: "success",
        text: "출발 공항으로 설정되었습니다.",
      });
    } else if (searchAirport === 2) {
      setArrivalInfo({
        ...arrivalInfo,
        itineraryNo: itineraryNo,
        planDay: selectedDay,
        planDate: totalPlanDates[selectedDay - 1],
        planAddress: place.formatted_address,
        planLatitude: place.geometry.location.lat(),
        planLongitude: place.geometry.location.lng(),
        planImage: place.photos[0].getUrl(),
        planType: 2,
        planName: place.name,
        planId: place.place_id,
        arrivalAirport: place.name,
      });
      setSearchAirport(0);
      Swal.fire({
        icon: "success",
        text: "도착 공항으로 설정되었습니다.",
      });
    }
  };

  return (
    <div className="place-item-box">
      <div className="place-item-image">
        <div className="place-item-image-box">
          <img
            onClick={viewPlace}
            src={
              place.photos ? place.photos[0].getUrl() : "/image/default_img.png"
            }
          />
        </div>
      </div>
      <div className="place-item-info">
        <h4 className="place-item-title" onClick={viewPlace}>
          {place.name}
        </h4>
        <div className="place-item-address">{place.formatted_address}</div>
      </div>
      <div className="place-item-add">
        <div onClick={addAirport} className="airport-add-button">
          <span className="material-icons">done</span>
        </div>
      </div>
    </div>
  );
};

export default ForeignAirportItem;
