import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useState } from "react";

const TravelReservation = () => {
  const productName = localStorage.getItem("productName");
  const startDate = localStorage.getItem("startDate");
  const endDate = localStorage.getItem("endDate");
  const people = localStorage.getItem("people");
  const productPrice = localStorage.getItem("productPrice");

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

  const productPayment = () => {
    // 로그인 체크
    if (!isLogin) {
      Swal.fire({
        title: "로그인 필요",
        text: "결제를 진행하기 위해 로그인해주세요.",
        icon: "warning",
      });
      return;
    }

    const form = new FormData();
    form.append("people", people);
    form.append("startDate", startDate);
    form.append("endDate", endDate);
    form.append("productPrice", productPrice);

    /*
        {
          "orderNo": 0,
          "userNo": 0,
          "productNo": 0,
          "orderDate": "string",
          "startDate": "string",
          "endDate": "string",
          "people": 0,
          "price": 0,
          "paymentType": 0
        }
        */

    axios
      .post(`${backServer}/pay/payment/${userEmail}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: "결제 성공",
          text: "결제가 완료되었습니다.",
          icon: "success",
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "결제에 실패했습니다.",
          text: "다시 시도해 주세요.",
          icon: "error",
        });
      });
  };
  return (
    <section className="section payment-wrap">
      <h2>여행 정보</h2>
      <div>
        <ul>
          <li>
            <p>선택 패키지</p>
            <p>{productName}</p>
          </li>
          <li>
            <p>여행 예정일</p>{" "}
            {startDate
              ? new Date(startDate).toLocaleDateString()
              : "선택되지 않음"}
            <p>여행 기간</p>
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
            <p>여행 인원</p>
            <p>성인 x {people}</p>
          </li>
        </ul>
      </div>

      <div style={{ margin: "50px 0px" }} className="line"></div>

      <div>
        <h2>결제 내역 안내</h2>
        <p>총 결제 금액</p>
        <div>
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
        </div>
        <p>{productPrice.toLocaleString()}원</p>
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
          />
        </div>

        <div style={{ margin: "31.5px 0" }} className="input-item">
          <label htmlFor="productName">이메일</label>
          <input
            type="text"
            name="userEmail"
            id="userEmail"
            value={userEmail}
            onChange={inputUserEmail}
          />
        </div>

        <div style={{ margin: "31.5px 0" }} className="input-item">
          <label htmlFor="productName">휴대전화번호</label>
          <input
            type="text"
            name="userPhone"
            id="userPhone"
            value={userPhone}
            onChange={inputUserPhone}
          />
        </div>
      </div>

      <div style={{ margin: "50px 0px" }} className="line"></div>

      <div>
        <h2>대표 예약자 정보</h2>
      </div>

      <div style={{ margin: "50px 0px" }} className="line"></div>

      <div>
        <Link
          to="/payment"
          onClick={() => {
            // localStorage.setItem("productName", product.productName);
            // localStorage.setItem("startDate", startDate);
            // localStorage.setItem("endDate", endDate);
            // localStorage.setItem("people", people);
            // localStorage.setItem("productPrice", product.productPrice);
          }}
          style={{ padding: "23.5px 0", width: "100%", display: "block" }}
          className="btn-primary lg"
        >
          결제하기
        </Link>
      </div>
    </section>
  );
};

export default TravelReservation;
