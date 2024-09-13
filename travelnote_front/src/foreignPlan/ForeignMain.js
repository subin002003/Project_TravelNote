import { useState } from "react";

const ForeignMain = () => {
  const [regionList, setRegionList] = useState(["지역"]);
  return (
    <>
      <div className="plan-title">여행지 목록</div>
      <div className="foreign-list">
        <ul>
          {regionList.map((region, index) => {
            return <Region />;
          })}
        </ul>
      </div>
    </>
  );
};

const Region = (props) => {
  const region = props.region;
  const index = props.index;
  return (
    <li key={"region-" + index}>
      <div></div>
    </li>
  );
};

export default ForeignMain;
