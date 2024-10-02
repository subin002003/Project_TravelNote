import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";
import Swal from "sweetalert2";
import * as PortOne from "@portone/browser-sdk/v2";
import { useEffect } from "react";

const Payment = () => {
  const productName = localStorage.getItem("productName");
  const startDate = localStorage.getItem("startDate");
  const endDate = localStorage.getItem("endDate");
  const people = Number(localStorage.getItem("people")) || 0;
  const productPrice = Number(localStorage.getItem("productPrice")) || 0;
  const totalPrice = Number(localStorage.getItem("totalPrice")) || 0;
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userPhone = localStorage.getItem("userPhone");

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
    const loadIMP = () => {
      const script = document.createElement("script");
      script.src = "https://cdn.iamport.kr/v1/iamport.js";
      script.async = true;
      script.onload = () => {
        const IMP = window.IMP;
        if (IMP) {
          IMP.init(process.env.REACT_APP_IMP_KEY); // 가맹점 식별 코드
        } else {
          console.error("IMP 객체가 정의되지 않았습니다.");
        }
      };
      document.body.appendChild(script);
    };

    loadIMP();
  }, []);

  const handlePayment = () => {
    const { IMP } = window;
    IMP.init("imp73014035"); // 'imp00000000' 대신 발급받은 가맹점 식별코드를 사용합니다.
    // const IMP = window.IMP;
    // IMP.init("imp73014035"); // YOUR_IMP_KEY를 실제 가맹점 키로 바꿔주세요.
    // if (!IMP) {
    //   console.error("IMP 객체가 정의되지 않았습니다.");
    //   return;
    // }

    console.log(typeof totalPrice);

    const data = {
      pg: "tosspay_v2.tosstest", // 상점 MID (storeId로 대체)
      pay_method: "tosspay", // 'tosspay_card', 'tosspay_money'도 지원
      merchant_uid: `order_${Math.random().toString(36).slice(2)}`, // 고유 주문 번호
      name: productName, // 주문명
      buyer_email: userEmail, // 구매자 이메일
      buyer_name: userName, // 구매자 이름
      buyer_tel: userPhone, // 구매자 전화번호
      m_redirect_url: `${backServer}/mypage`, // 결제 완료 후 리디렉션 URL
      amount: totalPrice, // 결제 금액
      card: {
        useInstallment: false, // 할부 사용 여부 (true or false)
      },
      bypass: {
        expiredTime: new Date(new Date().getTime() + 15 * 60 * 1000)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "), // 만료 시간 (15분 후)
        cashReceiptTradeOption: "GENERAL", // 현금영수증 발급 타입 (일반)
      },
    }
    function callback(response) {
        const {
          success,
          merchant_uid,
          error_msg,
          ...
        } = response;
      
        if (success) {
          alert('결제 성공');
        } else {
          alert(`결제 실패: ${error_msg}`);
        }
      };

    IMP.request_pay(
      {
        pg: "tosspay_v2.tosstest", // 상점 MID (storeId로 대체)
        pay_method: "tosspay", // 'tosspay_card', 'tosspay_money'도 지원
        merchant_uid: `order_${Math.random().toString(36).slice(2)}`, // 고유 주문 번호
        name: productName, // 주문명
        buyer_email: userEmail, // 구매자 이메일
        buyer_name: userName, // 구매자 이름
        buyer_tel: userPhone, // 구매자 전화번호
        m_redirect_url: `${backServer}/mypage`, // 결제 완료 후 리디렉션 URL
        amount: totalPrice, // 결제 금액
        card: {
          useInstallment: false, // 할부 사용 여부 (true or false)
        },
        bypass: {
          expiredTime: new Date(new Date().getTime() + 15 * 60 * 1000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " "), // 만료 시간 (15분 후)
          cashReceiptTradeOption: "GENERAL", // 현금영수증 발급 타입 (일반)
        },
      },
      function (rsp) {
        console.log("결제 응답:", rsp); // 추가 로그
        if (rsp.success) {
          // 결제 성공 시 서버로 결제 정보 전달
          const orderPay = {
            orderDate: new Date(), // 현재 날짜를 예약일자로 설정
            startDay: startDate,
            endDay: endDate,
            people: people,
            price: totalPrice,
            paymentType: 2, // 토스페이로 결제: 2
          };

          axios
            .post(`${backServer}/pay/saveOrder/${userEmail}`, orderPay, {
              headers: {
                "Content-Type": "application/json",
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

    if (!isLogin) {
      Swal.fire({
        title: "로그인 필요",
        text: "결제를 진행하기 위해 로그인해주세요.",
        icon: "warning",
      });
      return;
    }

    const IMP = window.IMP;
    // 판매자 코드 설정 (여기에 실제 가맹점 코드 입력)
    IMP.init("imp73014035"); // YOUR_IMP_KEY를 실제 가맹점 키로 바꿔주세요.

    const merchantUid = `order_no_${Date.now()}`; // 고유 주문 번호 생성

    if (!IMP) {
      console.error("IMP 객체가 정의되지 않았습니다.");
      return;
    }

    IMP.request_pay(
      {
        pg: "kakaopay", // 또는 적절한 PG 코드를 입력
        pay_method: "card",
        merchant_uid: merchantUid,
        name: productName || "주문명:결제테스트",
        amount: totalPrice, // 동적 금액
        buyer_email: userEmail, // 로그인된 사용자 이메일
        buyer_name: userName, // 사용자 이름도 동적으로 가져오는 게 좋습니다.
        buyer_tel: userPhone,
        // buyer_addr: "서울특별시 강남구 삼성동",
        buyer_postcode: "123-456",
        m_redirect_url: `${backServer}/mypage`,
        // m_redirect_url: process.env.REACT_APP_REDIRECT_URL, // 리디렉션 URL
      },
      function (rsp) {
        if (rsp.success) {
          const orderPay = {
            people: people,
            startDate: startDate,
            endDate: endDate,
            totalPrice: totalPrice,
            merchantUid: merchantUid,
            userEmail: userEmail,
            userName: userName,
            userPhone: userPhone,
          };

          axios
            .post(`${backServer}/pay/payment/${loginEmail}`, orderPay, {
              headers: {
                "Content-Type": "application/json", // JSON 형식 명시
              },
            })
            .then((res) => {
              console.log(res);
              console.log("결제 성공:", rsp);
              Swal.fire({
                title: "결제 성공",
                text: rsp.success_msg || "결제가 완료되었습니다.",
                icon: "success",
              });
            })
            .catch((err) => {
              console.error(err);
              Swal.fire({
                title: "결제에 실패했습니다.",
                text: "다시 시도해 주세요.",
                icon: "error",
              });
            });
        } else {
          console.error("결제 실패:", rsp);
          Swal.fire({
            title: "결제 실패",
            text: rsp.error_msg || "결제가 실패했습니다.",
            icon: "error",
          });
        }
      }
    );
  };

  const productPayment = () => {
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
        <button onClick={handlePayment}>카카오페이</button>
      </div>
    </section>
  );
};

export default Payment;
