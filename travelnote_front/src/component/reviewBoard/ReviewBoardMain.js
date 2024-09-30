import { Route, Routes } from "react-router-dom";
import ReviewBoardList from "./ReviewBoardList";

const ReviewBoardMain = () => {
  return (
    <Routes>
      <Route path="list" element={<ReviewBoardList />} />
    </Routes>
  );
};
export default ReviewBoardMain;
