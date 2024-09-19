import { Route, Routes } from "react-router-dom";

import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Main from "./component/common/Main";
import ForeignMain from "./foreignPlan/ForeignMain";
import DomesticMain from "./Domestic/DomesticMain";
import CityDetail from "./Domestic/CityDetail";

function App() {
  return (
    <div className="wrap">
      <Header />
      <main className="content"></main>
      <Routes>
        <Route path="/foreign/*" element={<ForeignMain />}></Route>
        <Route path="/Domestic/*" element={<DomesticMain />}></Route>
        <Route path="/city/:cityName" element={<CityDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
