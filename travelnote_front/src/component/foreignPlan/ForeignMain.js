import { Route, Routes } from "react-router-dom";
import "./foreignPlan.css";
import ForeignList from "./ForeignList";
import ItineraryForm from "./ItineraryForm";
import ForeignPlanView from "./ForeignPlanView";

const ForeignMain = () => {
  return (
    <Routes>
      <Route path="list" element={<ForeignList />}></Route>
      <Route
        path="createItinerary/:regionNo"
        element={<ItineraryForm />}
      ></Route>
      <Route path="viewPlan/:itineraryNo" element={<ForeignPlanView />}></Route>
    </Routes>
  );
};

export default ForeignMain;
