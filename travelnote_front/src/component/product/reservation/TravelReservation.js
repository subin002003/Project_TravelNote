import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../../utils/RecoilData";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./reservation.css";
import ChannelTalk from "../ChannelTalk";

const TravelReservation = () => {
  const productNo = localStorage.getItem("productNo");
  const productName = localStorage.getItem("productName");
  const startDate = localStorage.getItem("startDate");
  const endDate = localStorage.getItem("endDate");
  const people = Number(localStorage.getItem("people")) || 0;
  const productPrice = Number(localStorage.getItem("productPrice")) || 0;
  // totalPrice 계산
  const totalPrice = people * productPrice;

  // console.log("productNo", productNo);
  // console.log("productName", productName);
  // console.log("startDate:", startDate);
  // console.log("endDate:", endDate);
  // console.log("people:", people);
  // console.log("productPrice:", productPrice);

  const backServer = process.env.REACT_APP_BACK_SERVER;
  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  // const userEmail = loginEmail;
  const [userType, setUserType] = useRecoilState(userTypeState);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState(loginEmail);
  const [userPhone, setUserPhone] = useState("");

  // 유저 이름
  const inputUserName = (e) => {
    setUserName(e.target.value);
  };

  // 유저 이메일
  const inputUserEmail = (e) => {
    setUserEmail(e.target.value);
  };

  // 유저 전화번호
  const inputUserPhone = (e) => {
    setUserPhone(e.target.value);
  };

  // State for checkboxes
  const [allChecked, setAllChecked] = useState(false);
  const [agree1, setAgree1] = useState(false);
  const [agree11, setAgree11] = useState(false);
  const [agree12, setAgree12] = useState(false);
  const [agree13, setAgree13] = useState(false);

  const [agree2, setAgree2] = useState(false);
  const [agree21, setAgree21] = useState(false);
  const [agree22, setAgree22] = useState(false);

  const [agree3, setAgree3] = useState(false);
  const [agree31, setAgree31] = useState(false);
  const [agree32, setAgree32] = useState(false);

  // 전체 동의 체크박스 상태 업데이트
  useEffect(() => {
    const isAllChecked =
      agree1 &&
      agree11 &&
      agree12 &&
      agree13 &&
      agree2 &&
      agree21 &&
      agree22 &&
      agree3 &&
      agree31 &&
      agree32;
    setAllChecked(isAllChecked);
  }, [
    agree1,
    agree11,
    agree12,
    agree13,
    agree2,
    agree21,
    agree22,
    agree3,
    agree31,
    agree32,
  ]);

  // Handle parent checkbox change
  const handleAgree1Change = (e) => {
    const checked = e.target.checked;
    setAgree1(checked);
    setAgree11(checked);
    setAgree12(checked);
    setAgree13(checked);
  };

  const handleAgree2Change = (e) => {
    const checked = e.target.checked;
    setAgree2(checked);
    setAgree21(checked);
    setAgree22(checked);
  };

  const handleAgree3Change = (e) => {
    const checked = e.target.checked;
    setAgree3(checked);
    setAgree31(checked);
    setAgree32(checked);
  };

  // Handle all agree checkbox
  const handleAllAgreeChange = (e) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    setAgree1(checked);
    setAgree11(checked);
    setAgree12(checked);
    setAgree13(checked);

    setAgree2(checked);
    setAgree21(checked);
    setAgree22(checked);

    setAgree3(checked);
    setAgree31(checked);
    setAgree32(checked);
  };

  const handleIndividualChange = (e, setFunction, parentType) => {
    const checked = e.target.checked;
    setFunction(checked);

    // 하위 체크박스 해제 시 상위 체크박스도 해제
    if (!checked) {
      setAllChecked(false); // 전체 체크박스 해제
      if (parentType === "agree1") {
        setAgree1(false);
      } else if (parentType === "agree2") {
        setAgree2(false);
      } else if (parentType === "agree3") {
        setAgree3(false);
      }
    } else {
      // 모든 하위 체크박스가 체크된 경우 상위 체크박스를 다시 체크
      if (parentType === "agree1") {
        if (agree11 && agree12 && agree13) {
          setAgree1(true);
        }
      } else if (parentType === "agree2") {
        if (agree21 && agree22) {
          setAgree2(true);
        }
      } else if (parentType === "agree3") {
        if (agree31 && agree32) {
          setAgree3(true);
        }
      }

      // 모든 항목이 체크되었는지 확인하여 전체 체크박스 상태 업데이트
      setAllChecked(
        agree1 &&
          agree11 &&
          agree12 &&
          agree13 &&
          agree2 &&
          agree21 &&
          agree22 &&
          agree3 &&
          agree31 &&
          agree32
      );
    }
  };

  return (
    <section className="sec reservation-wrap">
      <div className="travel-info">
        <h2>여행 정보</h2>
        <ul>
          <li>
            <p className="info-title">선택 패키지</p>
            <p>{productName}</p>
          </li>
          <li>
            <p className="info-title">여행 예정일</p>{" "}
            <p>
              {startDate
                ? new Date(startDate).toLocaleDateString()
                : "선택되지 않음"}
            </p>
            <p className="info-title">여행 기간</p>
            <p>
              {" "}
              {startDate
                ? new Date(startDate).toLocaleDateString()
                : "선택되지 않음"}
              <span> ~ </span>{" "}
              {endDate
                ? new Date(endDate).toLocaleDateString()
                : "선택되지 않음"}
            </p>
          </li>
          <li>
            <p className="info-title">여행 인원</p>
            <p>성인 x {people}</p>
          </li>
        </ul>
      </div>

      <div style={{ margin: "50px 0px" }} className="line"></div>

      <div className="payment-guide">
        <h2>결제 내역 안내</h2>
        <p>총 결제 금액</p>
        <div className="payment-guide-info">
          <p>{productName}</p>
          <p>
            {" "}
            {startDate
              ? new Date(startDate).toLocaleDateString()
              : "선택되지 않음"}
            <span> ~ </span>{" "}
            {endDate ? new Date(endDate).toLocaleDateString() : "선택되지 않음"}
          </p>
          <p>성인 x {people}</p>
          <p className="total-price">{totalPrice.toLocaleString()}원</p>
        </div>
      </div>

      <div style={{ margin: "50px 0px" }} className="line"></div>

      <div>
        <h2>예약자 정보</h2>

        <div style={{ margin: "31.5px 0" }} className="input-item">
          <label htmlFor="productName">한글 성명</label>
          <input
            type="text"
            name="userName"
            id="userName"
            value={userName}
            onChange={inputUserName}
            placeholder="ex.) 홍길동"
          />
        </div>

        <div style={{ margin: "31.5px 0" }} className="input-item">
          <label htmlFor="userEmail">이메일</label>
          <input
            type="text"
            name="userEmail"
            id="userEmail"
            value={userEmail}
            onChange={inputUserEmail}
            placeholder="ex.) abc1234@mail.com"
          />
        </div>

        <div style={{ margin: "31.5px 0" }} className="input-item">
          <label htmlFor="userPhone">휴대전화번호</label>
          <input
            type="text"
            name="userPhone"
            id="userPhone"
            value={userPhone}
            onChange={inputUserPhone}
            placeholder="ex.) 010-1234-5678"
          />
        </div>
      </div>

      <div style={{ margin: "50px 0px" }} className="line"></div>

      <div>
        <h2>대표 예약자 정보</h2>
      </div>

      <div style={{ margin: "50px 0px" }} className="line"></div>

      <div className="draggable">
        <h2>
          <span>
            <i className="fa-solid fa-circle-check"></i>
          </span>
          <span>TravelNote 이용 동의</span>
        </h2>
        <div className="allAgree">
          <input
            type="checkbox"
            id="allAgree"
            checked={allChecked}
            onChange={handleAllAgreeChange}
          />
          <label className="parents-label" htmlFor="allAgree">
            전체 약관 동의
          </label>
        </div>

        <div style={{ margin: "30px 0" }} className="line"></div>

        <div className="agree-box">
          <div>
            <input
              type="checkbox"
              name="agree"
              id="agree1"
              checked={agree1}
              onChange={(e) =>
                handleAgree1Change(
                  e,
                  setAgree1,
                  setAgree11,
                  setAgree12,
                  setAgree13
                )
              }
              required
            />
            <label className="parents-label" htmlFor="agree1">
              이용 규정과 약관
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              name="agree"
              id="agree11"
              checked={agree11}
              onChange={(e) => handleIndividualChange(e, setAgree11, "agree1")}
              required
            />
            <label className="child-label" htmlFor="agree11">
              TravelNote 예약 규정
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              name="agree"
              id="agree12"
              checked={agree12}
              onChange={(e) => handleIndividualChange(e, setAgree12, "agree1")}
              required
            />
            <label className="child-label" htmlFor="agree12">
              취소 및 이용 규정
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              name="agree"
              id="agree13"
              checked={agree13}
              onChange={(e) => handleIndividualChange(e, setAgree13, "agree1")}
              required
            />
            <label className="child-label" htmlFor="agree13">
              취소 및 환불정책
            </label>
          </div>
        </div>

        <div className="agree-box">
          <div>
            <input
              type="checkbox"
              name="agree"
              id="agree2"
              checked={agree2}
              onChange={(e) =>
                handleAgree2Change(e, setAgree2, setAgree21, setAgree22)
              }
              required
            />
            <label className="parents-label" htmlFor="agree2">
              개인정보 수집 및 이용 동의
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              name="agree"
              id="agree21"
              checked={agree21}
              onChange={(e) => handleIndividualChange(e, setAgree21, "agree2")}
              required
            />
            <label className="child-label" htmlFor="agree21">
              개인정보 수집 및 이용
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              name="agree"
              id="agree22"
              checked={agree22}
              onChange={(e) => handleIndividualChange(e, setAgree22, "agree2")}
              required
            />
            <label className="child-label" htmlFor="agree22">
              개인정보 수집 및 이용
            </label>
          </div>
        </div>

        <div className="agree-box">
          <div>
            <input
              type="checkbox"
              name="agree"
              id="agree3"
              checked={agree3}
              onChange={(e) =>
                handleAgree3Change(e, setAgree3, setAgree31, setAgree32)
              }
            />
            <label className="parents-label" htmlFor="agree3">
              광고성 수신 동의
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              name="agree"
              id="agree31"
              checked={agree31}
              onChange={(e) => handleIndividualChange(e, setAgree31, "agree3")}
            />
            <label className="child-label" htmlFor="agree31">
              SMS 수신 동의
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              name="agree"
              id="agree32"
              checked={agree32}
              onChange={(e) => handleIndividualChange(e, setAgree32, "agree3")}
            />
            <label className="child-label" htmlFor="agree32">
              이메일 수신 동의
            </label>
          </div>
        </div>
      </div>

      <div style={{ margin: "50px 0px" }} className="line"></div>

      <div>
        <Link
          to="/payment"
          onClick={() => {
            localStorage.setItem("productNo", productNo);
            localStorage.setItem("productName", productName);
            localStorage.setItem("startDate", startDate);
            localStorage.setItem("endDate", endDate);
            localStorage.setItem("people", people);
            localStorage.setItem("productPrice", productPrice);
            localStorage.setItem("totalPrice", totalPrice);
            localStorage.setItem("userName", userName);
            localStorage.setItem("userEmail", userEmail);
            localStorage.setItem("userPhone", userPhone);
          }}
          style={{ padding: "23.5px 0", width: "100%", display: "block" }}
          className="btn-primary lg"
        >
          결제하기
        </Link>
      </div>
      <ChannelTalk />
      {isLogin ? (
        <button className="channelTalkBtn">
          <img src="/image/logo2.png"></img>
        </button>
      ) : (
        ""
      )}
    </section>
  );
};

export default TravelReservation;
