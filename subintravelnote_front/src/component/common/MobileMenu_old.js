import { Link } from "react-router-dom";
import "./mobile_menu.css";
import React, { useEffect, useRef, useState } from 'react';
import { isLoginState, loginEmailState, userNickState, userTypeState } from "../utils/RecoilData";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";

const MobileMenu = () => {
    const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
    const [userType, setUserType] = useRecoilState(userTypeState);
    const [userNick, setUserNick] = useRecoilState(userNickState);
    const isLogin = useRecoilValue(isLoginState);

    const [isRendered, setIsRendered] = useState(false); // 렌더링 여부

    useEffect(() => {
        if (isLogin) {
            setIsRendered(true);
        }
    }, [isLogin]);
    const logout = () => {
        setLoginEmail("");
        setUserType(0);
        setUserNick("");
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
    };

    const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열기/닫기 상태
    const [activeIndex, setActiveIndex] = useState(null); // 현재 활성화된 메뉴 인덱스
    const [subMenuIndex, setSubMenuIndex] = useState({}); // 하위 메뉴 활성화 상태
    const menuRef = useRef(null);

    const openMenu = () => {
        if (menuRef.current) {
            menuRef.current.style.width = "230px";
        }
        setMenuOpen(true);
    };

    const closeMenu = () => {
        if (menuRef.current) {
            menuRef.current.style.width = "0";
        }
        setMenuOpen(false);
    };

    const toggleSubMenu = (index, event) => {
        event.stopPropagation(); // 이벤트 버블링 방지
        setActiveIndex(activeIndex === index ? null : index); // 메뉴 토글
    };

    const toggleSubMenuLevel2 = (parentIndex, index, event) => {
        event.stopPropagation(); // 이벤트 버블링 방지
        setSubMenuIndex((prevState) => ({
            ...prevState,
            [parentIndex]: prevState[parentIndex] === index ? null : index, // 하위 메뉴 토글
        }));
    };

    const handleParentClick = (index) => {
        setActiveIndex(index); // 부모 클릭 시 해당 인덱스의 메뉴를 활성화
    };

    return (
        <div className="mobile_menu_wrap">
            <button onClick={openMenu} className="menu-btn">
                <span className="icon-menu">
                    <i className="fa-solid fa-bars"></i>
                </span>
            </button>
            <div id="main-menu" ref={menuRef} className="menu-container" onClick={(e) => e.stopPropagation()}>
                {/* 메뉴 닫기 버튼 */}
                <button onClick={closeMenu} className="close-btn">
                    <span className="icon-close">
                        <i className="fa-solid fa-times"></i>
                    </span>
                </button>
                <div className="menu">
                    <ul className="mobile-user-menu">
                        {isLogin ? (
                            <>
                                <li>
                                    <Link to="/mypage">{userNick}</Link>
                                </li>
                                <li>
                                    <Link to="/#" onClick={logout}>
                                        로그아웃
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login">로그인</Link>
                                </li>
                                <li>
                                    <Link to="/joinUser">회원가입</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <div style={{ margin: "0 10px" }} className="line"></div>

                    <ul className="main-menu">
                        <li><Link to="/domestic/list">국내 여행</Link></li>
                        <li><Link to="/foreign/list">해외 여행</Link></li>
                        <li><Link to="/product/list">패키지 상품</Link></li>
                        <li><Link to="/customerService">고객센터</Link></li>
                        <li>
                            <div onClick={(e) => handleParentClick(0)}>
                                Community
                                <span
                                    className={`more ${activeIndex === 0 ? "active" : ""}`}
                                    onClick={(e) => toggleSubMenu(0, e)}
                                >
                                    +
                                </span>
                            </div>
                            {activeIndex === 0 && (
                                <ul className="sub-menu">
                                    <li>
                                        <Link to="/board/list">자유게시판</Link>
                                    </li>
                                    <li>
                                        <Link to="/reviewBoard/list">후기게시판</Link>
                                    </li>
                                    {/* <li>
                                        <Link to="#">
                                            jQuery
                                            <span
                                                className={`more ${subMenuIndex[0] === 1 ? "active" : ""}`}
                                                onClick={(e) => toggleSubMenuLevel2(0, 1, e)}
                                            >
                                                +
                                            </span>
                                        </Link>
                                        {subMenuIndex[0] === 1 && (
                                            <ul className="sub-menu">
                                                <li><Link to="#">객체탐색</Link></li>
                                                <li><Link to="#">객체조작</Link></li>
                                                <li><Link to="#">이벤트</Link></li>
                                                <li><Link to="#">효과</Link></li>
                                            </ul>
                                        )}
                                    </li> */}
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
