import { Route, Routes } from "react-router-dom";
import "./foreignPlan.css";
import ForeignList from "./ForeignList";
import ItineraryForm from "./ItineraryForm";
import ForeignPlanMain from "./ForeignPlanMain";
import ForeignEditItinerary from "./ForeignEditItinerary";

// path: foreign
const ForeignMain = () => {
  return (
    <Routes>
      <Route path="list" element={<ForeignList />}></Route>
      <Route path="itinerary/:regionNo" element={<ItineraryForm />}></Route>
      <Route path="plan/:itineraryNo" element={<ForeignPlanMain />}></Route>
      <Route
        path="edit/:itineraryNo"
        element={<ForeignEditItinerary />}
      ></Route>
    </Routes>
  );
};

export default ForeignMain;
