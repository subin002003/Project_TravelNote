const ForeignPlaceItem = (props) => {
  const { place, index, selectedPosition, setSelectedPosition, setPlaceInfo } =
    props;

  const viewPlace = () => {
    setSelectedPosition(place.geometry.location);
    console.log(place);
    setPlaceInfo({
      placeName: place.name,
      placeLocation: place.geometry.location,
      placeAddress: place.formatted_address,
      placeId: place.place_id,
    });
  };
  return (
    <div className="place-item-box">
      <div className="place-item-info">
        <h4 className="place-item-title" onClick={viewPlace}>
          {place.name}
        </h4>
        <div className="place-item-address">{place.formatted_address}</div>
      </div>
      <div className="place-item-add">
        <div className="place-add-button">+</div>
      </div>
    </div>
  );
};

export default ForeignPlaceItem;
