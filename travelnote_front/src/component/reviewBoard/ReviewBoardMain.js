import "./reviewBoard.css";
import { Route, Routes } from "react-router-dom";
import ReviewBoardList from "./ReviewBoardList";
import ReviewBoardWrite from "./ReviewBoardWrite";
import ReviewBoardView from "./ReviewBoardView";
import ReviewBoardUpdate from "./ReviewBoardUpdate";

const ReviewBoardMain = () => {
  return (
    <Routes>
      <Route path="list" element={<ReviewBoardList />} />
      <Route path="write" element={<ReviewBoardWrite />} />
      <Route path="view:boardNo" element={<ReviewBoardView />} />
      <Route path="update/:boardNo" element={<ReviewBoardUpdate />} />
    </Routes>
  );
};
export default ReviewBoardMain;
