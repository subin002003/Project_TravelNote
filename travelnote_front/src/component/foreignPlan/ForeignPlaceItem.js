const ForeignPlaceItem = (props) => {
  const { place, index, selectedPosition, setSelectedPosition, setPlaceInfo } =
    props;

  const viewPlace = () => {
    setSelectedPosition(place.geometry.location);
    setPlaceInfo(
      "" +
        `
      <div className="place-info-box">
        <h4 className="place-info-title">${place.name}</h4>
      </div>`
    );
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
