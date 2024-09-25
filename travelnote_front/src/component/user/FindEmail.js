import axios from "axios";
import { useRef, useState } from "react";
import Swal from "sweetalert2";

const FindEmail = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [user, setUser] = useState({
    userName: "",
    userPhone: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const changeUser = (e) => {
    const name = e.target.name;
    setUser({ ...user, [name]: e.target.value });
  };
  const emailInfoRef = useRef(null);
  const findEmail = () => {
    axios
      .post(`${backServer}/user/findEmail`, user)
      .then((res) => {
        if (res.data === "X") {
          Swal.fire({
            title: "회원 정보를 다시 확인해주세요.",
            icon: "warning",
          });
          return;
        }
        setUserEmail(res.data);
        emailInfoRef.current.classList.remove("hidden");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="id-section">
      <div className="page-title">
        <h1>이메일 찾기</h1>
      </div>

      <div className="find-email-box">
        <div className="img-box">
          <img className="logo" src="/image/logo1.png"></img>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            findEmail();
          }}
        >
          <div className="login-input-group">
            <div className="label-box">
              <label htmlFor="userName">이름</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="text"
                name="userName"
                id="userName"
                onChange={changeUser}
              ></input>
            </div>
          </div>
          <div className="login-input-group">
            <div className="label-box">
              <label htmlFor="userPhone">전화번호</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="text"
                name="userPhone"
                id="userPhone"
                onChange={changeUser}
              ></input>
            </div>
          </div>
          <div className="login-btn-box">
            <button className="login-btn" type="submit">
              이메일 찾기
            </button>
          </div>
        </form>
        <div ref={emailInfoRef} className="email-info-wrap hidden">
          <span>
            당신의 이메일은<strong>[{userEmail}]</strong>입니다.
          </span>
        </div>
      </div>
    </section>
  );
};

export default FindEmail;
