import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const ChangePw = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userEmail: "",
    userPw: "",
  });
  const changeUser = (e) => {
    const name = e.target.name;
    setUser({ ...user, [name]: e.target.value });
  };
  const backServer = process.env.REACT_APP_BACK_SERVER;
  // 0-> 입력 안한 상태 / 1 -> 존재하지 않는 메일 / 2 -> 존재하는 메일(인증 가능)
  const [emailStatus, setEmailStatus] = useState(0);
  // 0-> 인증 안된 상태 / 1 -> 인증성공한 상태
  const [verificationStatus, setVerificationStatus] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyToken, setVerifyToken] = useState(null);
  // 이메일이 있는 이메일인지, 양식에 맞게 입력했는지 check -> 그후 존재하는 이메일이면 인증번호 보내기.
  const emailMessage = useRef(null);
  const checkEmail = () => {
    axios
      .get(`${backServer}/user/checkEmail/${user.userEmail}`)
      .then((res) => {
        if (res.data === 1) {
          emailMessage.current.classList.add("valid");
          emailMessage.current.innerText = "이메일 인증을 진행해주세요.";
          setEmailStatus(2);
        } else {
          emailMessage.current.classList.add("invalid");
          emailMessage.current.innerText = "존재하지 않는 이메일 입니다.";
          setEmailStatus(1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const verificationCodeBox = useRef(null);
  const verifyBtnBox = useRef(null);
  const verifyEmail = () => {
    if (emailStatus === 2) {
      verificationCodeBox.current.classList.remove("hidden");
      verifyBtnBox.current.classList.add("hidden");
      axios
        .post(`${backServer}/user/verifyEmail/${user.userEmail}`)
        .then((res) => {
          Swal.fire({
            title: "인증코드 전송 완료",
            icon: "success",
          });
          setVerifyToken(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal.fire({
        title: "올바른 이메일을 입력해주세요.",
        icon: "warning",
      });
    }
  };

  const changeVerificationCode = (e) => {
    setVerificationCode(e.target.value);
  };

  const verifyMessage = useRef(null);
  const newPwBox = useRef(null);
  const verifyCode = () => {
    axios
      .post(`${backServer}/user/verifyCode`, {
        verifyToken: verifyToken,
        verificationCode: verificationCode,
      })
      .then((res) => {
        if (res.data === 1) {
          verifyMessage.current.classList.add("valid");
          verifyMessage.current.innerText =
            "이메일 인증 성공! 새로운 비밀번호를 입력해주세요.";
          setVerificationStatus(1);

          newPwBox.current.classList.remove("hidden");
        } else {
          verifyMessage.current.classList.add("invalid");
          verifyMessage.current.innerText = "인증번호를 다시 확인해주세요.";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [pwState, setPwState] = useState(0);
  const pwRef = useRef(null);
  const pwReRef = useRef(null);
  const pwCheck = () => {
    pwRef.current.classList.remove("invalid");
    pwRef.current.classList.remove("valid");
    const pwReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
    if (!pwReg.test(user.userPw)) {
      setPwState(1);
      pwRef.current.classList.add("invalid");
      pwRef.current.innerText =
        "비밀번호는 6~12자의 영어와 숫자를 포함해야 합니다.";
    } else {
      setPwState(2);
      pwRef.current.classList.add("valid");
      pwRef.current.innerText = "사용가능한 비밀번호 입니다.";
    }
  };

  const pwReCheck = () => {
    pwReRef.current.classList.remove("invalid");
    pwReRef.current.classList.remove("valid");
    if (userNewPwRe === user.userPw) {
      setPwState(3);
      pwReRef.current.classList.add("valid");
      pwReRef.current.innerText = "비밀번호가 일치합니다.";
    } else {
      setPwState(2);
      pwReRef.current.classList.add("invalid");
      pwReRef.current.innerText = "비밀번호가 일치하지 않습니다.";
    }
  };

  const [userNewPwRe, setUserNewPwRe] = useState("");
  const changeNewPwRe = (e) => {
    setUserNewPwRe(e.target.value);
  };
  const changePw = () => {
    if (verificationStatus === 1 && pwState === 3) {
      axios
        .patch(`${backServer}/user/changePw`, user)
        .then((res) => {
          if (res.data === 1) {
            Swal.fire({
              title: "비밀번호 변경 완료 !",
              icon: "success",
            });
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal({
        title: "비밀번호를 확인해주세요.",
        icon: "warning",
      });
    }
  };

  return (
    <section className="section">
      <div style={{ width: "100%" }} className="page-title">
        <h1>비밀번호 변경하기</h1>
      </div>
      <div className="find-email-box">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyEmail();
          }}
        >
          <div className="login-input-group">
            <div className="label-box">
              <label htmlFor="userEmail">이메일</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="text"
                name="userEmail"
                id="userEmail"
                onChange={changeUser}
                onBlur={checkEmail}
              ></input>
            </div>
            <p ref={emailMessage}></p>
          </div>
          <div ref={verificationCodeBox} className="login-input-group hidden">
            <div className="label-box">
              <label htmlFor="verificationCode">인증번호</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="text"
                name="verificationCode"
                id="verificationCode"
                onChange={changeVerificationCode}
              ></input>
              <p ref={verifyMessage}></p>
            </div>
            <div className="verify-btn">
              <button type="button" onClick={verifyCode}>
                인증하기
              </button>
            </div>
          </div>
          <div ref={verifyBtnBox} className="login-btn-box">
            <button className="login-btn" type="submit">
              이메일 인증하기
            </button>
          </div>
        </form>
        <div ref={newPwBox} className="new-pw-box hidden">
          <div className="login-input-group">
            <div className="label-box">
              <label htmlFor="userPw">새 비밀번호 입력</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="password"
                name="userPw"
                id="userPw"
                onChange={changeUser}
                onBlur={pwCheck}
              ></input>
            </div>
            <p ref={pwRef}></p>
          </div>
          <div className="login-input-group">
            <div className="label-box">
              <label htmlFor="userNewPwRe">새 비밀번호 확인</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="password"
                name="userNewPwRe"
                id="userNewPwRe"
                onChange={changeNewPwRe}
                onBlur={pwReCheck}
              ></input>
            </div>
            <p ref={pwReRef}></p>
          </div>
          <div className="login-btn-box">
            <button className="login-btn" onClick={changePw}>
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePw;
