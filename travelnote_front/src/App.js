import { Route, Routes } from "react-router-dom";

import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Main from "./component/common/Main";
import ForeignMain from "./foreignPlan/ForeignMain";
import DomesticMain from "./Domestic/DomesticMain";
import JoinUser from "./component/user/JoinUser";

function App() {
  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/foreign/*" element={<ForeignMain />}></Route>
          <Route path="/joinUser" element={<JoinUser />}></Route>
        </Routes>
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
