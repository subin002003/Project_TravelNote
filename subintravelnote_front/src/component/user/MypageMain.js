import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userNickState,
  userTypeState,
} from "../utils/RecoilData";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import SideMenu from "../utils/SideMenu";
import MyInfo from "./MyInfo";
import PersonalBoardList from "./PersonalBoardList";
import PersonalBoardAnswerWrite from "./PersonalBoardAnswerWrite";
import PersonalBoardAnswerUpdate from "./PersonalBoardAnswerUpdate";
import ManageBoard from "./ManageBoard";
import ManageUser from "./ManageUser";
import MyBoard from "./MyBoard";
import MyReview from "./MyReview";
import MyReservation from "./MyReservation";
import ReservationView from "./ReservationView";
import MyProduct from "./MyProduct";
import MyPayment from "./MyPayment";
import PaymentInfo from "./PaymentInfo";
import Mywish from "./Mywish";
import ChangePw from "./ChangePw";
import MyTravel from "./MyTravel";
import ShareTravel from "./ShareTravel";
import axios, { Axios } from "axios";

const MypageMain = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 확인
  const userType = useRecoilValue(userTypeState);
  const isLogin = useRecoilValue(isLoginState);
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [menus, setMenus] = useState([
    { url: "info", text: "내 정보 수정" },
    { url: "changePw", text: "비밀번호 변경" },
    { url: "myWish", text: "내가 찜한 목록" },
    { url: "myReservation", text: "내 예약" },
    { url: "myTravel", text: "내 일정" },
    { url: "shareTravel", text: "공유된 일정" },
    { url: "myboard", text: "내가 작성한 글" },
    { url: "myReview", text: "내가 작성한 리뷰" },
  ]);

  // 로그인 상태 체크 및 리다이렉트
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      axios
        .get(`${backServer}/user/checkToken`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {})
        .catch((err) => {
          Swal.fire({
            title: "로그인 후 이용해주세요",
            icon: "warning",
          }).then(() => {
            // 경고 후 로그인 페이지로 리다이렉트
            navigate("/login");
          });
        });
    } else {
      // 토큰이 없으면 바로 로그인 페이지로 리다이렉트

      if (!isLogin) {
        Swal.fire({
          title: "로그인 후 이용해주세요",
          icon: "warning",
        }).then(() => {
          navigate("/login");
        });
      }
    }
  }, [navigate, backServer, isLogin, userNick, userType, loginEmail]);

  // 현재 경로가 '/mypage'일 때만 'info'로 이동, 다른 경로일 경우 유지
  useEffect(() => {
    if (isLogin && location.pathname === "/mypage") {
      if (userType === 1) {
        navigate("info");
      } else if (userType === 2) {
        navigate("info");
      } else if (userType === 3) {
        navigate("admin/manageBoard");
      }
    }
  }, [isLogin, location.pathname, navigate, userType]);

  // 관리자 메뉴 추가
  useEffect(() => {
    if (userType === 3) {
      setMenus([
        { url: "/mypage/admin/manageBoard", text: "게시글 관리" },
        { url: "/mypage/admin/manageUser", text: "회원 관리" },
        { url: "/mypage/admin/personalBoardList", text: "1대1문의 답변하기" },
      ]);
    } else if (userType === 2) {
      setMenus([
        { url: "info", text: "여행사 정보 수정" },
        { url: "changePw", text: "비밀번호 변경" },
        { url: "myProduct", text: "판매중인 상품" },
        { url: "myPayment", text: "판매 내역 확인" },
      ]);
    }
  }, [userType]);

  return (
    <div className="mypage-wrap">
      <div className="page-title">
        <h1>마이페이지</h1>
      </div>
      <div className="mypage-main">
        <div className="mypage-side-menu">
          <section className="section account-box">
            <div className="account-info">
              {userType === 1 ? (
                <span className="material-icons">person</span>
              ) : userType === 2 ? (
                <span className="material-icons">flight_takeoff</span>
              ) : userType === 3 ? (
                <span className="material-icons">manage_accounts</span>
              ) : null}
            </div>
          </section>
          <section className="section side-menu">
            <SideMenu menus={menus} />
          </section>
        </div>
        <div style={{ padding: "20px" }} className="mypage-content">
          <section className="section">
            <Routes>
              <Route path="info" element={<MyInfo />} />
              <Route path="myboard" element={<MyBoard />} />
              <Route path="myReview" element={<MyReview />} />
              <Route path="myReservation" element={<MyReservation />} />
              <Route
                path="myReservation/:orderNo"
                element={<ReservationView />}
              />
              <Route path="myWish" element={<Mywish />} />
              <Route path="changePw" element={<ChangePw />} />
              <Route path="myTravel" element={<MyTravel />} />
              <Route path="shareTravel" element={<ShareTravel />} />

              <Route path="myProduct" element={<MyProduct />} />
              <Route path="myPayment" element={<MyPayment />} />
              <Route
                path="myPayment/paymentInfo/:orderNo"
                element={<PaymentInfo />}
              />

              <Route path="admin/manageBoard" element={<ManageBoard />} />
              <Route path="admin/manageUser" element={<ManageUser />} />
              <Route
                path="admin/personalBoardList"
                element={<PersonalBoardList />}
              />
              <Route
                path="admin/personalBoardList/writeAnswer/:personalBoardNo"
                element={<PersonalBoardAnswerWrite />}
              ></Route>
              <Route
                path="admin/personalBoardList/updateAnswer/:personalBoardNo"
                element={<PersonalBoardAnswerUpdate />}
              />
            </Routes>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MypageMain;
