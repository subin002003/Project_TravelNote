import { useRecoilState } from "recoil";
import "./customerService.css";
import { userTypeState } from "../utils/RecoilData";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import CustomerBoardList from "./CustomerBoardList";
import { useEffect } from "react";
import CustomerBoardWrite from "./CustomerBoardWrite";

const CustomerServiceMain = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 가져옴

  useEffect(() => {
    // 현재 경로가 정확히 "/customerService"일 때만 "customerBoard"로 이동
    if (location.pathname === "/customerService") {
      navigate("customerBoard");
    }
  }, [location.pathname, navigate]);

  return (
    <section className="section">
      <div className="page-title">
        <h1>고객센터</h1>
      </div>
      <Routes>
        <Route path="customerBoard" element={<CustomerBoardList />} />
        <Route path="customerBoardWrite" element={<CustomerBoardWrite />} />
      </Routes>
    </section>
  );
};

export default CustomerServiceMain;
