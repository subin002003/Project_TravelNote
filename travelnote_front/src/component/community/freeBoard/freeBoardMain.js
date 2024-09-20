import { Route, Routes } from "react-router-dom";

const freeBoardMain = () => {
  return (
    <Routes>
      <Route path="list" element={<freeBoardList />} />
    </Routes>
  );
};

export default freeBoardMain;
