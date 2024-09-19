import { Route, Routes } from "react-router-dom";
import "./foreignPlan.css";
import ForeignList from "./ForeignList";
import ItineraryForm from "./ItineraryForm";

const ForeignMain = () => {
  return (
    <>
      <div className="foreign-title">
        <h2>해외 여행 플래너</h2>
      </div>
      <Routes>
        <Route path="list" element={<ForeignList />}></Route>
        <Route
          path="createItinerary/:regionNo"
          element={<ItineraryForm />}
        ></Route>
      </Routes>
    </>
  );
};

export default ForeignMain;
