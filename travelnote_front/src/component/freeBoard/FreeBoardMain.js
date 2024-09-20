import { Route, Routes } from "react-router-dom";
import FreeBoardList from "./FreeBoardList";
const FreeBoardMain = () => {
  return (
    <Routes>
      <Route path="list" element={<FreeBoardList />} />
    </Routes>
  );
};

export default FreeBoardMain;
