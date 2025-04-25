import { useRecoilState, useRecoilValue } from "recoil";
import "./customerService.css";
import { isLoginState, userTypeState } from "../utils/RecoilData";
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
import CustomerBoardView from "./CustomerBoardView";
import CustomerBoardUpdate from "./CustmerBoardUpdate";
import ChannelTalk from "./ChannelTalk";
import PersonalBoardWrite from "./PersonalBoardWrite";
import PersonalBoardView from "./PersonalBoardView";
import PersonalBoardUpdate from "./PersonalBoardUpdate";

const CustomerServiceMain = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 가져옴
  const isLogin = useRecoilValue(isLoginState);

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
        <Route
          path="customerBoard/View/:faqBoardNo"
          element={<CustomerBoardView />}
        />
        <Route
          path="customerBoard/update/:faqBoardNo"
          element={<CustomerBoardUpdate />}
        />
        <Route path="customerBoardWrite" element={<CustomerBoardWrite />} />
        <Route path="personalBoardWrite" element={<PersonalBoardWrite />} />
        <Route
          path="personalBoard/view/:personalBoardNo"
          element={<PersonalBoardView />}
        />
        <Route
          path="personalBoard/update/:personalBoardNo"
          element={<PersonalBoardUpdate />}
        />
      </Routes>
      <ChannelTalk />
      {isLogin ? (
        <button className="channelTalk-btn">
          <img src="/image/logo1.png"></img>
        </button>
      ) : (
        <></>
      )}
    </section>
  );
};

export default CustomerServiceMain;
