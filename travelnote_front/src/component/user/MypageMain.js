import { useRecoilValue } from "recoil";
import { isLoginState, userTypeState } from "../utils/RecoilData";
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

const MypageMain = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 확인
  const userType = useRecoilValue(userTypeState);
  const isLogin = useRecoilValue(isLoginState);

  const [menus, setMenus] = useState([
    { url: "info", text: "내 정보 수정" },
    { url: "changePw", text: "비밀번호 변경" },
    { url: "#", text: "내 예약" },
    { url: "#", text: "내 일정" },
    { url: "#", text: "공유된 일정" },
    { url: "#", text: "내가 작성한 글" },
  ]);

  // 로그인 상태 체크 및 리다이렉트
  useEffect(() => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인 후 이용 가능합니다",
        icon: "warning",
      }).then(() => {
        navigate("/login"); // 경고 후 로그인 페이지로 리다이렉트
      });
    }
  }, [isLogin, navigate]);

  // 현재 경로가 '/mypage'일 때만 'info'로 이동, 다른 경로일 경우 유지
  useEffect(() => {
    if (isLogin && location.pathname === "/mypage" && userType === 1) {
      navigate("info"); // 기본 페이지로 이동
    } else if (isLogin && location.pathname === "/mypage" && userType === 3) {
      navigate("admin/manageBoard");
    }
  }, [isLogin, location.pathname, navigate]);

  // 관리자 메뉴 추가
  useEffect(() => {
    if (userType === 3) {
      setMenus([
        { url: "#", text: "게시글 관리" },
        { url: "#", text: "회원 관리" },
        { url: "/mypage/admin/personalBoardList", text: "1대1문의 답변하기" },
        { url: "#", text: "여행지 등록하기" },
        { url: "#", text: "관광지 등록하기" },
      ]);
    } else if (userType === 2) {
      setMenus([
        { url: "#", text: "여행사 정보 수정" },
        { url: "#", text: "비밀번호 변경" },
        { url: "#", text: "판매중인 상품" },
        { url: "#", text: "결제 내역 확인" },
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
        <div className="mypage-content">
          <section className="section">
            <Routes>
              <Route path="info" element={<MyInfo />} />

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
