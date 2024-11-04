import "./mobile_menu.css";
import React, { useRef, useState } from "react";

const TestMenu = () => {
    const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열기/닫기 상태
    const [activeIndex, setActiveIndex] = useState(null); // 현재 활성화된 메뉴 인덱스
    const [subMenuIndex, setSubMenuIndex] = useState({}); // 하위 메뉴 활성화 상태
    const menuRef = useRef(null);

    const openMenu = () => {
        if (menuRef.current) {
            menuRef.current.style.width = "260px";
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
        setActiveIndex(activeIndex === index ? null : index); // 부모 메뉴 토글
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
        <div className="wrap" onClick={closeMenu}> {/* wrap 클릭 시 메뉴 닫기 */}
            <button onClick={openMenu} className="menu-btn">
                <span className="icon-menu">
                    <i className="fa-solid fa-bars"></i>
                </span>
            </button>
            <div id="main-menu" ref={menuRef} className="menu-container" onClick={(e) => e.stopPropagation()}> {/* 메뉴 영역 클릭은 이벤트 전파 방지 */}
                <div className="menu">
                    <ul className="main-menu">
                        <li><a href="#">HOME</a></li>
                        <li><a href="#">JAVA</a></li>
                        <li><a href="#">ORACLE</a></li>
                        <li>
                            <a href="#" onClick={(e) => handleParentClick(0)}>
                                FRONTEND
                                <span
                                    className={`more ${activeIndex === 0 ? "active" : ""}`}
                                    onClick={(e) => toggleSubMenu(0, e)}
                                >
                                    +
                                </span>
                            </a>
                            {activeIndex === 0 && (
                                <ul className="sub-menu">
                                    <li><a href="#">HTML5</a></li>
                                    <li><a href="#">CSS3</a></li>
                                    <li><a href="#">JavaScript</a></li>
                                    <li>
                                        <a href="#">
                                            jQuery
                                            <span
                                                className={`more ${subMenuIndex[0] === 1 ? "active" : ""}`}
                                                onClick={(e) => toggleSubMenuLevel2(0, 1, e)}
                                            >
                                                +
                                            </span>
                                        </a>
                                        {subMenuIndex[0] === 1 && (
                                            <ul className="sub-menu">
                                                <li><a href="#">객체탐색</a></li>
                                                <li><a href="#">객체조작</a></li>
                                                <li><a href="#">이벤트</a></li>
                                                <li><a href="#">효과</a></li>
                                            </ul>
                                        )}
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li><a href="#">SERVER</a></li>
                        <li>
                            <a href="#" onClick={(e) => handleParentClick(2)}>
                                FRAMEWORK
                                <span
                                    className={`more ${activeIndex === 2 ? "active" : ""}`}
                                    onClick={(e) => toggleSubMenu(2, e)}
                                >
                                    +
                                </span>
                            </a>
                            {activeIndex === 2 && (
                                <ul className="sub-menu">
                                    <li><a href="#">Mybatis</a></li>
                                    <li><a href="#">Spring</a></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
                {/* 메뉴 닫기 버튼 */}
                <button onClick={closeMenu} className="close-btn">
                    <span className="icon-close">
                        <i className="fa-solid fa-times"></i>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default TestMenu;
