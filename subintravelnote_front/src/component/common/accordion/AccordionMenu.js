import React, { useState } from 'react';
import './accordion.css';

const AccordionMenu = () => {
    // 상태 변수 정의
    const [activeIndex, setActiveIndex] = useState(null); // 열려있는 메뉴 인덱스를 관리

    // 메뉴 클릭 시 활성화/비활성화 상태 변경
    const toggleSubMenu = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null); // 이미 열려있는 메뉴는 닫기
        } else {
            setActiveIndex(index); // 새 메뉴 열기
        }
    };

    return (
        <div className="menu">
            <ul className="main-menu">
                <li><a href="#">HOME</a></li>
                <li><a href="#">JAVA</a></li>
                <li><a href="#">ORACLE</a></li>
                <li>
                    <a href="#" onClick={() => toggleSubMenu(0)}>
                        FRONTEND
                        <span className={`more ${activeIndex === 0 ? 'active' : ''}`}>+</span>
                    </a>
                    <ul className={`sub-menu ${activeIndex === 0 ? 'show' : ''}`}>
                        <li><a href="#">HTML5</a></li>
                        <li><a href="#">CSS3</a></li>
                        <li><a href="#">JavaScript</a></li>
                        <li>
                            <a href="#" onClick={() => toggleSubMenu(1)}>
                                jQuery
                                <span className={`more ${activeIndex === 1 ? 'active' : ''}`}>+</span>
                            </a>
                            <ul className={`sub-menu ${activeIndex === 1 ? 'show' : ''}`}>
                                <li><a href="#">객체탐색</a></li>
                                <li><a href="#">객체조작</a></li>
                                <li><a href="#">이벤트</a></li>
                                <li><a href="#">효과</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li><a href="#">SERVER</a></li>
                <li>
                    <a href="#" onClick={() => toggleSubMenu(2)}>
                        FRAMEWORK
                        <span className={`more ${activeIndex === 2 ? 'active' : ''}`}>+</span>
                    </a>
                    <ul className={`sub-menu ${activeIndex === 2 ? 'show' : ''}`}>
                        <li><a href="#">Mybatis</a></li>
                        <li><a href="#">Spring</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default AccordionMenu;
