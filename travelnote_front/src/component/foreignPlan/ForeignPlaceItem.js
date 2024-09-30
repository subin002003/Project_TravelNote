const ForeignPlaceItem = (props) => {
  const { place, index } = props;
  console.log(place);
  return (
    <div className="place-item-box">
      <div className="place-item-info">
        <h4 className="place-item-title">{place.name}</h4>
        <span className="place-item-address">{place.formatted_address}</span>
      </div>
      <div className="place-item-add">
        <div className="place-add-button">+</div>
      </div>
    </div>
  );
};

export default ForeignPlaceItem;
