import { Route, Routes } from "react-router-dom";

import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Main from "./component/common/Main";
import ForeignMain from "./foreignPlan/ForeignMain";
import DomesticMain from "./Domestic/DomesticMain";

function App() {
  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <h1>Travel Note 메인 페이지</h1>
      </main>
      <Routes>
        <Route path="/foreign/*" element={<ForeignMain />}></Route>
        <Route path="/Domestic/*" element={<DomesticMain />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
