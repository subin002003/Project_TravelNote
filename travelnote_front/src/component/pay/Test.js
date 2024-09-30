import { useLocation } from "react-router-dom";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";
import Swal from "sweetalert2";

const Payment = () => {
  const location = useLocation();
  const { startDate, endDate, people, productPrice } = location.state || {};

  const backServer = process.env.REACT_APP_BACK_SERVER;
  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const userEmail = loginEmail;
  const [userType, setUserType] = useRecoilState(userTypeState);

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
      <h2>결제 정보</h2>
      <div>
        <p>
          시작 날짜:{" "}
          {startDate
            ? new Date(startDate).toLocaleDateString()
            : "선택되지 않음"}
        </p>
        <p>
          종료 날짜:{" "}
          {endDate ? new Date(endDate).toLocaleDateString() : "선택되지 않음"}
        </p>
        <p>인원 수: {people}</p>
        <p>상품 가격: {productPrice} 원</p>
      </div>
      <button onClick={productPayment}>결제하기</button>
    </section>
  );
};

export default Payment;
