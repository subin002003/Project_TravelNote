import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, userTypeState } from "../utils/RecoilData";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import SideMenu from "../utils/SideMenu";
import MyInfo from "./MyInfo";

const MypageMain = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useRecoilState(userTypeState);
  const isLogin = useRecoilValue(isLoginState);
  if (!isLogin) {
    Swal.fire({
      title: "로그인 후 이용해주세요!",
      icon: "info",
    });
  }

  const [menus, setMenus] = useState([
    { url: "info", text: "내 정보 수정" },
    { url: "changePw", text: "비밀번호 변경" },
    { url: "#", text: "내 예약" },
    { url: "#", text: "내 일정" },
    { url: "#", text: "공유된 일정" },
    { url: "#", text: "내가 작성한 글" },
  ]);

  useEffect(() => {
    if (userType === 3) {
      setMenus([...menus, { url: "/admin", text: "관리자 페이지" }]);
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
              <Route path="info" element={<MyInfo />}></Route>
            </Routes>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MypageMain;
