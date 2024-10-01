import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";
import Swal from "sweetalert2";
import { useEffect } from "react";

const Payment = () => {
  const productNo = localStorage.getItem("productNo");
  const productName = localStorage.getItem("productName");
  const startDate = localStorage.getItem("startDate");
  const endDate = localStorage.getItem("endDate");
  const people = Number(localStorage.getItem("people")) || 0;
  const productPrice = Number(localStorage.getItem("productPrice")) || 0;
  const totalPrice = Number(localStorage.getItem("totalPrice")) || 0;
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userPhone = localStorage.getItem("userPhone");

  //   console.log("productNo", productNo);
  //   console.log("productName", productName);
  //   console.log("startDate:", startDate);
  //   console.log("endDate:", endDate);
  //   console.log("people:", people);
  //   console.log("productPrice:", productPrice);
  //   console.log("totalPrice:", totalPrice);

  const backServer = process.env.REACT_APP_BACK_SERVER;
  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);

  useEffect(() => {
    let script = document.querySelector(
      `script[src="https://cdn.iamport.kr/v1/iamport.js"]`
    );
  }, []);

  const handleKakaopay = () => {
    const { IMP } = window;
    IMP.init("imp73014035"); // 'imp00000000' 대신 발급받은 가맹점 식별코드를 사용합니다.
    // const IMP = window.IMP;
    // IMP.init("imp73014035"); // YOUR_IMP_KEY를 실제 가맹점 키로 바꿔주세요.
    // if (!IMP) {
    //   console.error("IMP 객체가 정의되지 않았습니다.");
    //   return;
    // }

    console.log(typeof totalPrice);

    IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card", // 생략가
        merchant_uid: `order_${Math.random().toString(36).slice(2)}`, // 상점에서 생성한 고유 주문번호
        name: productName, // 필수 파라미터 입니다.
        amount: 1,
        buyer_email: userEmail,
        buyer_name: userName,
        buyer_tel: userPhone,
        buyer_postcode: "123-456",
        m_redirect_url: `${backServer}/mypage`,
      },
      function (rsp) {
        console.log("결제 응답:", rsp); // 추가 로그
        if (rsp.success) {
          // 결제 성공 시 서버로 결제 정보 전달
          const form = new FormData();
          form.append("userEmail", userEmail);
          form.append("productNo", productNo);
          form.append("startDate", startDate);
          form.append("endDate", endDate);
          form.append("people", people);
          form.append("price", 1);
          form.append("paymentType", 1);

          console.log(form);

          axios
            .post(`${backServer}/pay/saveOrder`, form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              Swal.fire({
                title: "결제 성공",
                text: "결제가 완료되었습니다.",
                icon: "success",
              });
            })
            .catch((err) => {
              console.error(
                "결제 정보 저장 중 오류:",
                err.response ? err.response.data : err
              );
              Swal.fire({
                title: "오류",
                text: "결제 정보 저장 중 오류가 발생했습니다.",
                icon: "error",
              });
            });
        } else {
          Swal.fire({
            title: "결제 실패",
            text: rsp.error_msg, // 결제 실패 시 에러 메시지
            icon: "error",
          });
        }
      }
    );
  };

  const handleSettlebank = () => {
    const { IMP } = window;
    IMP.init("imp73014035"); // 'imp00000000' 대신 발급받은 가맹점 식별코드를 사용합니다.

    console.log(typeof totalPrice);

    IMP.request_pay(
      {
        pg: "settle.portone1",
        pay_method: "card", // 생략가
        merchant_uid: `order_${Math.random().toString(36).slice(2)}`, // 상점에서 생성한 고유 주문번호
        name: productName, // 필수 파라미터 입니다.
        amount: 100,
        buyer_email: userEmail,
        buyer_name: userName,
        buyer_tel: userPhone, // 누락시 오류 발생
        buyer_addr: "서울특별시 강남구 삼성동",
        company: "포트원", // 가상계좌 발급시 권고사항
        buyer_postcode: "123-456",
        m_redirect_url: `${backServer}/mypage`,
      },
      function (rsp) {
        console.log("결제 응답:", rsp); // 추가 로그
        if (rsp.success) {
          // 결제 성공 시 서버로 결제 정보 전달
          const form = new FormData();
          form.append("userEmail", userEmail);
          form.append("productNo", productNo);
          form.append("startDate", startDate);
          form.append("endDate", endDate);
          form.append("people", people);
          form.append("price", 1);
          form.append("paymentType", 2);

          console.log(form);

          axios
            .post(`${backServer}/pay/saveOrder`, form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              Swal.fire({
                title: "결제 성공",
                text: "결제가 완료되었습니다.",
                icon: "success",
              });
            })
            .catch((err) => {
              Swal.fire({
                title: "오류",
                text: "결제 정보 저장 중 오류가 발생했습니다.",
                icon: "error",
              });
            });
        } else {
          Swal.fire({
            title: "결제 실패",
            text: rsp.error_msg, // 결제 실패 시 에러 메시지
            icon: "error",
          });
        }
      }
    );
  };

  return (
    <section className="sec payment-wrap">
      <div className="payment-guide">
        <h2>결제 내용 확인</h2>
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
        <h2>결제 정보</h2>
        <p>예약 금액</p>
        <p>
          <span>성인 {people}</span>
          <span> x </span>
          <span>{productPrice.toLocaleString()}원</span>
          <span> = </span>
          <span className="total-price">{totalPrice.toLocaleString()}원</span>
        </p>
        <p>총 결제 금액</p>
        <p className="total-price">{totalPrice.toLocaleString()}원</p>
      </div>

      <div style={{ margin: "50px 0px" }} className="line"></div>

      <div>
        <h2>결제 수단</h2>
        <button onClick={handleKakaopay}>카카오페이</button>
        <button onClick={handleSettlebank}>헥토파이낸셜</button>
      </div>
    </section>
  );
};

export default Payment;
