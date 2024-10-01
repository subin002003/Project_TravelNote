import axios from "axios";

const ForeignPlaceItem = (props) => {
  const {
    place,
    setSelectedPosition,
    setPlaceInfo,
    itineraryNo,
    selectedDay,
    backServer,
    totalPlanDates,
    setIsPlanAdded,
  } = props;

  // 클릭 시 지도 이동
  const viewPlace = () => {
    console.log("" + place.geometry.location.lat);

    setSelectedPosition(place.geometry.location);
    setPlaceInfo({
      placeName: place.name,
      placeLocation: place.geometry.location,
      placeAddress: place.formatted_address,
      placeId: place.place_id,
    });
  };

  // 추가 버튼 클릭 시 DB에 저장하고 일정 목록에 추가
  const addPlace = () => {
    const loc = place.geometry.location;
    console.log(loc);
    const placeObj = {
      itineraryNo: itineraryNo,
      planDay: selectedDay,
      planDate: totalPlanDates[selectedDay - 1],
      planAddress: place.formatted_address,
      planLatitude: place.geometry.location.lat(),
      planLongitude: place.geometry.location.lng(),
      planImage: place.photos[0].getUrl(),
      planType: 1,
      planName: place.name,
      planId: place.place_id,
    };
    axios
      .post(`${backServer}/foreign/addPlace`, placeObj)
      .then((res) => {
        if (res.data > 0) {
          setIsPlanAdded(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="place-item-box">
      <div className="place-item-image">
        <div className="place-item-image-box">
          <img onClick={viewPlace} src={place.photos[0].getUrl()} />
        </div>
      </div>
      <div className="place-item-info">
        <h4 className="place-item-title" onClick={viewPlace}>
          {place.name}
        </h4>
        <div className="place-item-address">{place.formatted_address}</div>
      </div>
      <div className="place-item-add">
        <div onClick={addPlace} className="place-add-button">
          +
        </div>
      </div>
    </div>
  );
};

export default ForeignPlaceItem;
