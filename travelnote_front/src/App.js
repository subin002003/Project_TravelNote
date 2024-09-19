import { Route, Routes } from "react-router-dom";

import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import ForeignMain from "./component/foreignPlan/ForeignMain";
import JoinUser from "./component/user/JoinUser";

function App() {
  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <h1>Travel Note 메인 페이지</h1>
        <Routes>
          <Route path="/foreign/*" element={<ForeignMain />}></Route>
          <Route path="/joinUser" element={<JoinUser />}></Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
