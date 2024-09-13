import { Route, Routes } from "react-router-dom";
import ForeignMain from "./foreignPlan/ForeignMain";

function App() {
  return (
    <div className="App">
      <h1>Travel Note 메인 페이지</h1>
      <Routes>
        <Route path="/foreign/*" element={<ForeignMain />}></Route>
      </Routes>
    </div>
  );
}

export default App;
