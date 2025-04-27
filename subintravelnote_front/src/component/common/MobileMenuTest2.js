import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, loginEmailState, userNickState, userTypeState } from "../utils/RecoilData";
import axios from "axios";
import "./mobile_menu.css";

// MobileMenu 컴포넌트
const MobileMenu = () => {
    // Recoil 상태 관리
    const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
    const [userType, setUserType] = useRecoilState(userTypeState);
    const [userNick, setUserNick] = useRecoilState(userNickState);
    const isLogin = useRecoilValue(isLoginState);

    const navigate = useNavigate(); // navigate 훅을 사용하여 페이지 이동
    const menuRef = useRef(null); // 메뉴를 참조할 ref
    const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열림 여부 상태
    const [activeIndex, setActiveIndex] = useState(null); // 활성화된 서브 메뉴 인덱스

    // 메뉴 토글 핸들러
    const handleMenuToggle = useCallback(() => {
        if (menuRef.current) {
            menuRef.current.style.width = menuOpen ? "0" : "230px"; // 메뉴의 width를 변경
        }
        setMenuOpen((prev) => !prev); // 메뉴 열림/닫힘 상태를 반전
    }, [menuOpen]);

    // 서브 메뉴 토글 핸들러
    const handleSubMenuToggle = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null); // 이미 열린 메뉴를 닫기
        } else {
            setActiveIndex(index); // 새 메뉴 열기
        }
    };

    // 로그아웃 핸들러
    const handleLogout = useCallback(() => {
        // 상태 초기화
        setLoginEmail("");
        setUserType(0);
        setUserNick("");
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/"); // 홈 화면으로 이동
    }, [navigate, setLoginEmail, setUserNick, setUserType]);

    // 메뉴 외부 클릭 시 메뉴 닫기
    const handleClickOutside = useCallback((event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            if (menuOpen) {
                handleMenuToggle();
            }
        }
    }, [menuOpen, handleMenuToggle]);

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside); // 메뉴 열려 있을 때 외부 클릭 감지
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside); // 정리: 메뉴 닫을 때 이벤트 리스너 제거
        };
    }, [menuOpen, handleClickOutside]);

    // 사용자 메뉴 컴포넌트 (로그인 여부에 따라 다르게 렌더링)
    const UserMenu = () => (
        <ul className="mobile-user-menu">
            {isLogin ? (
                <>
                    <li><Link to="/mypage">{userNick}</Link></li> {/* 마이페이지 링크 */}
                    <li><button onClick={handleLogout} className="logout-btn">로그아웃</button></li> {/* 로그아웃 버튼 */}
                </>
            ) : (
                <>
                    <li><Link to="/login">로그인</Link></li> {/* 로그인 링크 */}
                    <li><Link to="/joinUser">회원가입</Link></li> {/* 회원가입 링크 */}
                </>
            )}
        </ul>
    );

    // 메인 메뉴 컴포넌트
    const MainMenu = ({ activeIndex, handleSubMenuToggle }) => (
        <ul className="main-menu">
            <li><Link to="/domestic/list">국내 여행</Link></li> {/* 국내 여행 링크 */}
            <li><Link to="/foreign/list">해외 여행</Link></li> {/* 해외 여행 링크 */}
            <li><Link to="/product/list">패키지 상품</Link></li> {/* 패키지 상품 링크 */}
            <li><Link to="/customerService">고객센터</Link></li> {/* 고객센터 링크 */}

            {/* 커뮤니티 메뉴 (서브 메뉴) */}
            <li>
                <div href="#" onClick={() => handleSubMenuToggle(0)} className="community-toggle">
                    Community
                    <span className={`more ${activeIndex === 0 ? 'active' : ''}`}>+</span> {/* 더보기 버튼 */}
                </div>
                <ul className={`sub-menu ${activeIndex === 0 ? 'show' : ''}`}> {/* 서브 메뉴 토글 */}
                    <li><Link to="/board/list">자유게시판</Link></li>
                    <li><Link to="/reviewBoard/list">후기게시판</Link></li>
                </ul>
            </li>
        </ul>
    );

    return (
        <div className="mobile_menu_wrap">
            {/* 메뉴 열기/닫기 버튼 */}
            <button
                onClick={handleMenuToggle}
                className={menuOpen ? "close-btn" : "menu-btn"}
                aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
                <span className="icon-toggle">
                    <i className={`fa-solid ${menuOpen ? "fa-times" : "fa-bars"}`} />
                </span>
            </button>

            {/* 메뉴 컨테이너 */}
            <div
                id="main-menu"
                ref={menuRef}
                className="menu-container"
                onClick={(e) => e.stopPropagation()} // 메뉴 내부 클릭 방지
            >
                <div className="menu">
                    {/* 사용자 메뉴 */}
                    <UserMenu />

                    <div className="line" style={{ margin: "0 10px" }} /> {/* 구분선 */}

                    {/* 메인 메뉴 */}
                    <MainMenu activeIndex={activeIndex} handleSubMenuToggle={handleSubMenuToggle} />
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
