import { useRef, useState } from "react";
import "../common/default.css";
import "./user.css";
import axios from "axios";
import Swal from "sweetalert2";
const JoinUser = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [user, setUser] = useState({
    userEmail: "",
    userPw: "",
    userName: "",
    userPhone: "",
    userNick: "",
  });
  const [verifiCationCode, setVerifiCationCode] = useState("");
  const changeUser = (e) => {
    const name = e.target.name;
    setUser({ ...user, [name]: e.target.value });
  };
  const changeVerifiCationCode = (e) => {
    setVerifiCationCode(e.target.value);
  };
  //email 중복 체크
  // 입력안한상태 -> 0 / 중복 상태 -> 1 / 이메일 형식 아님 -> 2 /
  // 이메일 인증 가능한 상태 -> 3 / 모든 인증이 끝나고 회원가입 가능 -> 4
  const [emailCheck, setEmailCheck] = useState(0);
  const emailMessage = useRef(null);
  const verifyBox = useRef(null);
  const verifyBtn = useRef(null);
  const verifyCodeBtn = useRef(null);
  const verifyCode = () => {};
  const verifyEmail = () => {
    if (emailCheck === 3) {
      verifyBox.current.classList.remove("check");
      verifyCodeBtn.current.classList.add("hidden");
      verifyBtn.current.classList.remove("hidden");
      axios
        .post(`${backServer}/user/verifyEmail/${user.userEmail}`)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal.fire({
        title: "이메일 확인 후 진행해주세요",
        icon: "warning",
      });
    }
  };
  const checkEmail = () => {
    emailMessage.current.classList.remove("valid");
    emailMessage.current.classList.remove("invalid");
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(user.userEmail)) {
      setEmailCheck(2);
      emailMessage.current.classList.add("invalid");
      emailMessage.current.innerText = "이메일 형식을 확인해주세요";
    } else {
      axios
        .get(`${backServer}/user/checkEmail/${user.userEmail}`)
        .then((res) => {
          console.log(res);
          if (res.data === 0) {
            emailMessage.current.classList.add("valid");
            emailMessage.current.innerText =
              "사용 가능한 이메일 입니다. 인증을 진행해주세요.";
            setEmailCheck(3);
          } else {
            setEmailCheck(1);
            emailMessage.current.classList.add("invalid");
            emailMessage.current.innerText = "중복된 이메일 입니다.";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //닉네임 중복 체크
  const [nickCheck, setNickCheck] = useState(0);
  return (
    <section className="section">
      <div className="page-title">
        <h1>회원가입</h1>
      </div>

      <div className="join-frm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="select-box">
            <label>
              <input type="radio" name="category" defaultChecked /> 유저
            </label>
            <label>
              <input type="radio" name="category" /> 여행사
            </label>
          </div>
          <div className="logo-box">
            <img src=""></img>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userEmail">이메일</label>
            </div>
            <div className="input-box">
              <input
                type="text"
                name="userEmail"
                id="userEmail"
                placeholder="ex)travelnote@gmail.com"
                onChange={changeUser}
                onBlur={checkEmail}
              ></input>
              <p ref={emailMessage}></p>
            </div>
          </div>
          <div className="input-group check verify-box" ref={verifyBox}>
            <div className="label-box">
              <label>인증번호</label>
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="인증 번호를 입력해주세요."
                onChange={changeVerifiCationCode}
              ></input>
            </div>
          </div>
          <div className="button-box">
            <button
              type="button"
              className="verify-btn"
              ref={verifyCodeBtn}
              onClick={verifyEmail}
            >
              인증번호 받기
            </button>
            <button
              type="button"
              className="verify-btn hidden"
              ref={verifyBtn}
              onClick={verifyCode}
            >
              인증하기
            </button>
          </div>

          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userPw">비밀번호</label>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="userPw"
                id="userPw"
                onChange={changeUser}
              ></input>
            </div>
          </div>
          <div className="input-group pw-check-box">
            <div className="label-box">
              <label htmlFor="userPwRe">비밀번호 확인</label>
            </div>
            <div className="input-box">
              <input type="password" name="userPwRe" id="userPwRe"></input>
            </div>
            <p>비밀번호 확인 문구</p>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userPhone">전화번호</label>
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="ex)010-0000-0000"
                id="userPhone"
                name="userPhone"
                onChange={changeUser}
              ></input>
            </div>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userName">이름</label>
            </div>
            <div className="input-box">
              <input
                type="text"
                id="userName"
                name="userName"
                onChange={changeUser}
              ></input>
            </div>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label id="userNick">닉네임</label>
            </div>
            <div className="input-box">
              <input
                type="text"
                id="userNick"
                name="userNick"
                onChange={changeUser}
              ></input>
            </div>
            <p>닉네임 확인 문구</p>
          </div>
          <div className="join-btn-box">
            <button type="button">가입하기</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default JoinUser;
