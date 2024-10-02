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
  const totalPrice = people * productPrice;

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState(loginEmail);
  const [userPhone, setUserPhone] = useState("");

  const inputUserName = (e) => {
    setUserName(e.target.value);
  };

  const inputUserEmail = (e) => {
    setUserEmail(e.target.value);
  };

  const inputUserPhone = (e) => {
    setUserPhone(e.target.value);
  };

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

    if (!checked) {
      setAllChecked(false);
      if (parentType === "agree1") {
        setAgree1(false);
      } else if (parentType === "agree2") {
        setAgree2(false);
      } else if (parentType === "agree3") {
        setAgree3(false);
      }
    } else {
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

  const handlePayment = () => {
    // 필수 체크박스가 모두 선택되지 않았을 경우 경고 메시지
    if (
      !(agree1 && agree11 && agree12 && agree13 && agree2 && agree21 && agree22)
    ) {
      Swal.fire({
        icon: "warning",
        title: "동의 필요",
        text: "모든 필수 약관에 동의해야 결제할 수 있습니다.",
      });
      return;
    }

    // 필수 약관에 모두 동의했을 경우 결제 페이지로 이동
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

    window.location.href = "/payment"; // 결제 페이지로 이동
  };

  return (
    <section className="sec reservation-wrap">
      {/* ... 생략된 코드 ... */}

      <div style={{ margin: "50px 0px" }} className="line"></div>

      <div>
        <button
          onClick={handlePayment}
          style={{ padding: "23.5px 0", width: "100%", display: "block" }}
          className="btn-primary lg"
        >
          결제하기
        </button>
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
