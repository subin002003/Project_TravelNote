import { Route, Routes } from "react-router-dom";

import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Main from "./component/common/Main";
import ForeignMain from "./foreignPlan/ForeignMain";

function App() {
  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/foreign/*" element={<ForeignMain />}></Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
