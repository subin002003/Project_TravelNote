import { Route, Routes } from "react-router-dom";
import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Main from "./component/common/Main";
import ForeignMain from "./component/foreignPlan/ForeignMain";
import DomesticMain from "./component/Domestic/DomesticMain";
import CityDetail from "./component/Domestic/CityDetail";
import Schedule from "./component/Domestic/Schedule";
import JoinUser from "./component/user/JoinUser";
import ProductMain from "./component/product/ProductMain";
import Login from "./component/user/Login";
import BoardMain from "./component/board/BoardMain";
import { useRecoilState } from "recoil";
import {
  loginEmailState,
  userNickState,
  userTypeState,
} from "./component/utils/RecoilData";
import { useEffect } from "react";
import axios from "axios";
import NaverCallback from "./component/user/NaverCallback";
import FindEmail from "./component/user/FindEmail";
import FindPw from "./component/user/FindPw";
import MypageMain from "./component/user/MypageMain";
import CustomerServiceMain from "./component/customerService/CustomerServiceMain";
import ReviewBoardMain from "./component/reviewBoard/ReviewBoardMain";
import Payment from "./component/payment/Payment";
import TravelReservation from "./component/product/reservation/TravelReservation";
import DomesticPlanShare from "./component/Domestic/DomesticPlanShare";

function App() {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);
  const [userNick, setUserNick] = useRecoilState(userNickState);
  useEffect(() => {
    refreshLogin();
    window.setInterval(refreshLogin, 30 * 60 * 1000); //30분마다 로그인 정보 자동 refresh
  }, []);

  const refreshLogin = () => {
    //최초 화면 접속시 localStorage 에 저장된 refreshToken 으로 자동 로그인 처리
    const refreshToken = window.localStorage.getItem("refreshToken");
    //로그인한적 없거나 로그아웃 했을시 refreshToken 이 존재하지 않으므로 존재 여부 확인
    if (refreshToken !== null) {
      axios.defaults.headers.common["Authorization"] = refreshToken;
      axios
        .post(`${backServer}/user/refresh`)
        .then((res) => {
          //refresh토큰을 전송해서 로그인 정보를 새로 갱신해옴
          // console.log(res);
          setLoginEmail(res.data.userEmail);
          setUserType(res.data.userType);
          setUserNick(res.data.userNick);
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
        })
        .catch((err) => {
          console.log(err);
          setLoginEmail("");
          setUserType(0);
          setUserNick("");
          delete axios.defaults.headers.common["Authorization"];
          window.localStorage.removeItem("refreshToken");
        });
    }
  };
  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/foreign/*" element={<ForeignMain />}></Route>
          <Route path="/joinUser" element={<JoinUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/oauth2/code/naver" element={<NaverCallback />} />
          <Route path="/findEmail" element={<FindEmail />} />
          <Route path="/findPw" element={<FindPw />} />
          <Route path="/mypage/*" element={<MypageMain />} />
          <Route path="/customerService/*" element={<CustomerServiceMain />} />
          <Route path="/product/*" element={<ProductMain />} />
          <Route path="/travelReservation" element={<TravelReservation />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/Domestic/*" element={<DomesticMain />}></Route>
          <Route path="/city/:cityName/:regionNo" element={<CityDetail />} />
          <Route path="/schedule/:itineraryNo" element={<Schedule />} />
          <Route path="/board/*" element={<BoardMain />} />
          <Route path="/reviewBoard/*" element={<ReviewBoardMain />} />
          <Route
            path="/Domestic/share/:itineraryNo"
            element={<DomesticPlanShare />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
