import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, loginEmailState, userNickState, userTypeState } from "../utils/RecoilData";
import axios from "axios";
import "./mobile_menu.css";

const MobileMenu = () => {
    // Recoil 상태: 로그인 이메일, 닉네임, 사용자 타입을 가져옴
    const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
    const [userType, setUserType] = useRecoilState(userTypeState);
    const [userNick, setUserNick] = useRecoilState(userNickState);
    const isLogin = useRecoilValue(isLoginState);

    const navigate = useNavigate();

    // 메뉴 DOM에 접근하기 위한 ref
    const menuRef = useRef(null);

    // 메뉴 열림/닫힘 상태
    const [menuOpen, setMenuOpen] = useState(false);

    // 서브 메뉴 활성화 상태 (index로 구분)
    const [activeIndex, setActiveIndex] = useState(null);

    // 메뉴 열기/닫기 토글
    const handleMenuToggle = useCallback(() => {
        if (menuRef.current) {
            menuRef.current.style.width = menuOpen ? "0" : "230px";
        }
        setMenuOpen((prev) => !prev);
    }, [menuOpen]);
    // # 수정전
    // const handleMenuToggle = () => {
    //     if (menuRef.current) {
    //         menuRef.current.style.width = menuOpen ? "0" : "230px";
    //     }
    //     setMenuOpen((prev) => !prev);
    // };

    // 메뉴 열기 함수
    // const openMenu = () => {
    //     if (menuRef.current) {
    //         menuRef.current.style.width = "230px"; // 메뉴 너비를 열리는 상태로 설정
    //     }
    //     setMenuOpen(true);
    // };

    // 메뉴 닫기 함수
    // const closeMenu = () => {
    //     if (menuRef.current) {
    //         menuRef.current.style.width = "0"; // 메뉴를 닫을 때 너비를 0으로
    //     }
    //     setMenuOpen(false);
    // };

    // 서브 메뉴 토글 함수
    const handleSubMenuToggle = useCallback((index, event) => {
        event.stopPropagation();
        setActiveIndex((prev) => (prev === index ? null : index));
    }, []);
    // # 수정전2
    // const handleSubMenuToggle = (index, event) => {
    //     event.stopPropagation();
    //     setActiveIndex((prev) => (prev === index ? null : index));
    // };
    // # 수정전
    // const toggleSubMenu = (index, event) => {
    //     event.stopPropagation(); // 부모 메뉴로 이벤트 버블링 방지
    //     setActiveIndex(prev => (prev === index ? null : index)); // 클릭한 메뉴만 열고, 다시 누르면 닫음
    // };

    // 로그아웃 처리
    const handleLogout = useCallback(() => {
        setLoginEmail("");
        setUserType(0);
        setUserNick("");
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
    }, [navigate, setLoginEmail, setUserNick, setUserType]);
    // # 수정전
    // 로그아웃 함수
    // const logout = () => {
    //     // Recoil 상태 초기화
    //     setLoginEmail("");
    //     setUserType(0);
    //     setUserNick("");

    //     // Axios 헤더 초기화 및 토큰 삭제
    //     delete axios.defaults.headers.common["Authorization"];
    //     localStorage.removeItem("accessToken");
    //     localStorage.removeItem("refreshToken");

    //     // 홈으로 리다이렉트
    //     navigate("/");
    // };

    // 메뉴 외부 클릭 시 메뉴 닫기
    const handleClickOutside = useCallback((event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            if (menuOpen) {
                handleMenuToggle();
            }
        }
    }, [menuOpen, handleMenuToggle]);
    // # 수정전
    // const handleClickOutside = useCallback((event) => {
    //     if (menuRef.current && !menuRef.current.contains(event.target)) {
    //         if (menuOpen) {
    //             handleMenuToggle();
    //         }
    //     }
    // }, [menuOpen]);

    // 외부 클릭 이벤트 리스너 등록/해제
    useEffect(() => {
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen, handleClickOutside]);

    // 유저 메뉴 컴포넌트 분리
    const UserMenu = () => (
        <ul className="mobile-user-menu">
            {isLogin ? (
                <>
                    <li><Link to="/mypage">{userNick}</Link></li>
                    <li><button onClick={handleLogout} className="logout-btn">로그아웃</button></li>
                </>
            ) : (
                <>
                    <li><Link to="/login">로그인</Link></li>
                    <li><Link to="/joinUser">회원가입</Link></li>
                </>
            )}
        </ul>
    );

    // 메인 메뉴 컴포넌트 분리
    const MainMenu = () => (
        <ul className="main-menu">
            <li><Link to="/domestic/list">국내 여행</Link></li>
            <li><Link to="/foreign/list">해외 여행</Link></li>
            <li><Link to="/product/list">패키지 상품</Link></li>
            <li><Link to="/customerService">고객센터</Link></li>
            <li>
                <div onClick={(e) => handleSubMenuToggle(0, e)} className="community-toggle">
                    Community
                    <span
                        className={`more ${activeIndex === 0 ? "active" : ""}`}
                        style={{ transform: activeIndex === 0 ? "rotate(45deg)" : "rotate(0deg)" }}
                    >
                        +
                    </span>
                </div>
                {activeIndex === 0 && (
                    <ul className="sub-menu">
                        <li><Link to="/board/list">자유게시판</Link></li>
                        <li><Link to="/reviewBoard/list">후기게시판</Link></li>
                    </ul>
                )}
            </li>
        </ul>
    );

    return (
        <div className="mobile_menu_wrap">
            {/* 메뉴 버튼 (열기/닫기) */}
            <button
                onClick={handleMenuToggle}
                className={menuOpen ? "close-btn" : "menu-btn"}
                aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
                <span className="icon-toggle">
                    {/* 메뉴 아이콘 상태 변경 */}
                    <i className={`fa-solid ${menuOpen ? "fa-times" : "fa-bars"}`} />
                </span>
            </button>

            {/* 메뉴 영역 */}
            <div
                id="main-menu"
                ref={menuRef}
                className="menu-container"
                onClick={(e) => e.stopPropagation()} // 메뉴 내부 클릭 시 닫히지 않게
            >
                <div className="menu">
                    {/* 로그인 여부에 따른 사용자 메뉴 */}
                    <UserMenu />

                    {/* 구분선 */}
                    <div className="line" style={{ margin: "0 10px" }} />

                    {/* 메인 메뉴 */}
                    <MainMenu />
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
