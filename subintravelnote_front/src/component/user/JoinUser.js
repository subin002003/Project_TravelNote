import { useRef, useState } from "react";
import "../common/default.css";
import "./user.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const JoinUser = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userEmail: "",
    userPw: "",
    userName: "",
    userPhone: "",
    userNick: "",
    userType: "1",
    businessRegNo: "",
  });
  const [category, setCategory] = useState("user"); // 회원 유형 상태
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyToken, setVerifyToken] = useState(null);
  const changeUser = (e) => {
    const name = e.target.name;
    setUser({ ...user, [name]: e.target.value });
  };
  const changeVerificationCode = (e) => {
    setVerificationCode(e.target.value);
  };
  const changeCategory = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    setUser((prevUser) => ({
      ...prevUser,
      userType: selectedCategory === "agency" ? 2 : 1,
      businessRegNo: "",
    }));

    if (businessRegNoRef.current) {
      businessRegNoRef.current.classList.remove("invalid");
      businessRegNoRef.current.classList.remove("valid");
      businessRegNoRef.current.innerText = "";
    }
    if (emailMessage.current) {
      emailMessage.current.classList.remove("valid");
      emailMessage.current.classList.remove("invalid");
      emailMessage.current.innerText = "";
    }
    if (pwRef.current) {
      pwRef.current.classList.remove("invalid");
      pwRef.current.classList.remove("valid");
      pwRef.current.innerText = "6~12자. 영어와 숫자를 반드시 입력해주세요.";
    }
    if (pwReRef.current) {
      pwReRef.current.classList.remove("invalid");
      pwReRef.current.classList.remove("valid");
      pwReRef.current.innerText = "";
    }
    if (phoneRef.current) {
      phoneRef.current.classList.remove("invalid");
      phoneRef.current.classList.remove("valid");
      phoneRef.current.innerText = "";
    }
    if (nameRef.current) {
      nameRef.current.classList.remove("invalid");
      nameRef.current.classList.remove("valid");
      nameRef.current.innerText = "";
    }
    if (nickRef.current) {
      nickRef.current.classList.remove("invalid");
      nickRef.current.classList.remove("valid");
      nickRef.current.innerText = "";
    }

    // 여행사일 때 userNick을 userName과 동일하게 설정
    if (selectedCategory === "agency") {
      setNameState(2);
      setUser((prevUser) => ({
        ...prevUser,
        userNick: prevUser.userName,
      }));
    }
  };

  //email 중복 체크
  // 입력안한상태 -> 0 / 중복 상태 -> 1 / 이메일 형식 아님 -> 2 /
  // 이메일 인증 가능한 상태 -> 3 / 모든 인증이 끝나고 회원가입 가능 -> 4
  const [emailCheck, setEmailCheck] = useState(0);
  const emailMessage = useRef(null);
  const verifyBox = useRef(null);
  const verifyBtn = useRef(null);
  const verifyCodeBtn = useRef(null);
  const verifyCode = () => {
    axios
      .post(`${backServer}/user/verifyCode`, {
        verifyToken: verifyToken,
        verificationCode: verificationCode,
      })
      .then((res) => {
        if (res.data === 1) {
          emailMessage.current.classList.add("valid");
          emailMessage.current.innerText = "인증 완료";
          setEmailCheck(4);
        } else {
          emailMessage.current.classList.add("invalid");
          emailMessage.current.innerText = "인증번호가 일치하지 않습니다.";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const verifyEmail = () => {
    if (emailCheck === 3) {
      verifyBox.current.classList.remove("check");
      verifyCodeBtn.current.classList.add("hidden");
      verifyBtn.current.classList.remove("hidden");
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

  ///////////////////////////////PW정규표현식 check////////////////////////////////

  // 0 -> 아무것도 입력하지 않은 상태 / 1 -> 정규 표현식 통과 x
  // 2 -> 정규표현식 통과 O 그러나 비밀번호 확인과 일치 X / 3 -> 사용 가능한 비밀번호
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

  const [pwRe, setPwRe] = useState("");
  const pwReChange = (e) => {
    setPwRe(e.target.value);
  };
  const pwReCheck = () => {
    pwReRef.current.classList.remove("invalid");
    pwReRef.current.classList.remove("valid");
    if (pwRe === user.userPw) {
      setPwState(3);
      pwReRef.current.classList.add("valid");
      pwReRef.current.innerText = "비밀번호가 일치합니다.";
    } else {
      setPwState(2);
      pwReRef.current.classList.add("invalid");
      pwReRef.current.innerText = "비밀번호가 일치하지 않습니다.";
    }
  };

  /////////////////////////////전화번호 양식 체크//////////////////////////////////////////////

  // 0 -> 아무것도 입력 x / 1 -> 양식에 올바르지 않음 / 2 -> 중복된 전화번호 / 3 -> 사용 가능
  const phoneRef = useRef(null);
  const [phoneState, setPhoneState] = useState(0);
  const phoneCheck = () => {
    phoneRef.current.classList.remove("invalid");
    phoneRef.current.classList.remove("valid");
    const phoneReg = /^\d{2,3}-\d{3,4}-\d{3,4}$/;
    if (!phoneReg.test(user.userPhone)) {
      setPhoneState(1);
      phoneRef.current.classList.add("invalid");
      phoneRef.current.innerText = "양식에 맞춰 입력해주세요.";
    } else {
      axios
        .get(`${backServer}/user/checkPhone/${user.userPhone}`)
        .then((res) => {
          if (res.data === 0) {
            setPhoneState(3);
            phoneRef.current.classList.add("valid");
            phoneRef.current.innerText = "사용가능한 전화번호 입니다.";
          } else {
            setPhoneState(2);
            phoneRef.current.classList.add("invalid");
            phoneRef.current.innerText = "중복된 전화번호 입니다.";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  /////////////////////////////////이름 체크///////////////////////////////////
  const nameRef = useRef(null);
  const [nameState, setNameState] = useState(0);
  // 0 -> 아무것도 입력 x / 1 -> 양식에 올바르지 않음 / 2 -> 사용 가능
  const nameCheck = () => {
    nameRef.current.classList.remove("invalid");
    nameRef.current.classList.remove("valid");
    const nameReg = /^[가-힣]{1,7}$/;
    if (!nameReg.test(user.userName)) {
      setNameState(1);
      nameRef.current.classList.add("invalid");
      nameRef.current.innerText = "양식에 맞춰 입력해주세요.";
    } else {
      setNameState(2);
      nameRef.current.classList.add("valid");
      nameRef.current.innerText = "";
    }
  };

  //////////////////////////////닉네임 중복 체크/////////////////////////////////////////////////////////////
  // 0 -> 입력 X / 1 -> 양식위반 / 2 -> 중복 / 3 -> 사용 가능
  const nickRef = useRef(null);
  const [nickState, setNickState] = useState(0);
  const nickCheck = () => {
    nickRef.current.classList.remove("invalid");
    nickRef.current.classList.remove("valid");
    const nickReg = /^[가-힣a-zA-Z0-9]{1,8}$/;
    if (!nickReg.test(user.userNick)) {
      setNickState(1);
      if (category === "agency") {
        nickRef.current.classList.add("invalid");
        nickRef.current.innerText = "여행사명은 8자 이하로만 사용 가능합니다.";
      } else {
        nickRef.current.classList.add("invalid");
        nickRef.current.innerText = "닉네임은 8자 이하로만 사용 가능합니다.";
      }
    } else {
      axios.get(`${backServer}/user/checkNick/${user.userNick}`).then((res) => {
        if (res.data === 0) {
          setNickState(3);
          if (category === "agency") {
            nickRef.current.classList.add("valid");
            nickRef.current.innerText = "사용 가능한 여행사명 입니다.";
          } else {
            nickRef.current.classList.add("valid");
            nickRef.current.innerText = "사용 가능한 닉네임 입니다.";
          }
        } else {
          setNickState(2);
          if (category === "agency") {
            nickRef.current.classList.add("invalid");
            nickRef.current.innerText = "중복된 여행사명 입니다.";
          } else {
            nickRef.current.classList.add("invalid");
            nickRef.current.innerText = "중복된 닉네임 입니다.";
          }
        }
      });
    }
  };
  /////////////////////////사업자 번호 체크///////////////////////////////////
  const businessRegNoRef = useRef();
  // 0 -> 입력 x / 1 -> 양식 위반 / 2 -> 중복 / 3-> 사용가능
  const [businessRegNoState, setBusinessRegNoState] = useState(0);

  const businessRegNoCheck = async () => {
    businessRegNoRef.current.classList.remove("invalid");
    businessRegNoRef.current.classList.remove("valid");

    const businessNoReg = /^\d{1,10}$/;
    if (!businessNoReg.test(user.businessRegNo)) {
      setBusinessRegNoState(1);
      businessRegNoRef.current.classList.add("invalid");
      businessRegNoRef.current.innerText =
        "사업자 번호를 올바르게 입력해주세요.";
    }

    const apiKey =
      "dSiINCFp60y42Zq8nlU%2FT8m%2FNJaNn0JeIQ6Is%2BMXJdEGdciAH%2Fd03MTkDY3Wdz%2BF0MkaCXwN7VJdZK2R9iVkHA%3D%3D"; // 발급받은 API 키를 여기에 입력
    const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${apiKey}`;

    const payload = {
      b_no: [user.businessRegNo], // 사업자등록번호를 배열로 전달
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      axios
        .get(`${backServer}/user/checkBusinessRegNo/${user.businessRegNo}`)
        .then((res) => {
          if (res.data === 1) {
            setBusinessRegNoState(2);
            businessRegNoRef.current.classList.add("invalid");
            businessRegNoRef.current.innerText =
              "이미 가입한 사업자 번호 입니다.";
          }
        })
        .catch((err) => {
          console.log(err);
        });
      if (
        response.data.data[0].tax_type ===
        "국세청에 등록되지 않은 사업자등록번호입니다."
      ) {
        setBusinessRegNoState(1);
        businessRegNoRef.current.classList.add("invalid");
        businessRegNoRef.current.innerText =
          "국세청에 등록되지 않은 사업자등록번호입니다.";
      } else {
        setBusinessRegNoState(3);
        businessRegNoRef.current.classList.add("valid");
        businessRegNoRef.current.innerText = "사용 가능한 사업자 번호입니다.";
      }
    } catch (error) {
      console.error("사업자 상태 조회 중 오류 발생:", error);
    }
  };

  const join = () => {
    if (category === "agency") {
      user.userName = user.userNick;
      if (
        //emailCheck === 4 &&
        pwState === 3 &&
        phoneState === 3 &&
        nameState === 2 &&
        nickState === 3
        //&&businessRegNoState === 3
      ) {
        setUser((prevUser) => ({
          ...prevUser,
          userType: 2,
        }));

        axios
          .post(`${backServer}/user`, user)
          .then((res) => {
            if (res.data === 1) {
              Swal.fire({
                title: "가입 성공 !",
                icon: "success",
              });
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Swal.fire({
          title: "입력값을 확인해주세요.",
          icon: "success",
        });
      }
    } else if (category === "user") {
      if (
        //emailCheck === 4 &&
        pwState === 3 &&
        phoneState === 3 &&
        nameState === 2 &&
        nickState === 3
      ) {
        setUser({ userType: 1 });
        axios
          .post(`${backServer}/user`, user)
          .then((res) => {
            if (res.data === 1) {
              Swal.fire({
                title: "가입 성공 !",
                icon: "success",
              });
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Swal.fire({
          title: "입력값을 확인해주세요.",
          icon: "success",
        });
      }
    }
  };

  return (
    <section className="section" style={{ marginBottom: "30px" }}>
      <div className="page-title">
        <h1>회원가입</h1>
      </div>

      <div className="join-frm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            join();
          }}
        >
          <div className="select-box">
            <label>
              <input
                type="radio"
                name="category"
                value="user"
                defaultChecked
                onChange={changeCategory}
              />{" "}
              유저
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="agency"
                onChange={changeCategory}
              />{" "}
              여행사
            </label>
          </div>
          <div style={{ marginBottom: "15px" }} className="img-box">
            <img className="user-logo" src="/image/logo1.png"></img>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userEmail">이메일</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="text"
                name="userEmail"
                id="userEmail"
                value={user.userEmail}
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
                className="user-input"
                type="text"
                placeholder="인증 번호를 입력해주세요."
                onChange={changeVerificationCode}
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

          <div className="input-group pw-group">
            <div className="label-box">
              <label htmlFor="userPw">비밀번호</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="password"
                name="userPw"
                id="userPw"
                value={user.userPw}
                onChange={changeUser}
                onBlur={pwCheck}
              ></input>
              <div className="msg-box">
                <p ref={pwRef}>6~12자. 영어와 숫자를 반드시 입력해주세요.</p>
              </div>
            </div>
          </div>
          <div className="input-group pw-check-box">
            <div className="label-box">
              <label htmlFor="userPwRe">비밀번호 확인</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="password"
                name="userPwRe"
                id="userPwRe"
                value={pwRe}
                onChange={pwReChange}
                onBlur={pwReCheck}
              ></input>
            </div>
            <div className="msg-box">
              <p ref={pwReRef}></p>
            </div>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userPhone">전화번호</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="text"
                placeholder="ex)010-0000-0000"
                id="userPhone"
                name="userPhone"
                value={user.userPhone}
                onChange={changeUser}
                onBlur={phoneCheck}
              ></input>
              <div className="msg-box">
                <p ref={phoneRef}></p>
              </div>
            </div>
          </div>
          {category === "user" ? (
            <div className="input-group">
              <div className="label-box">
                <label htmlFor="userNick">닉네임</label>
              </div>
              <div className="input-box">
                <input
                  className="user-input"
                  type="text"
                  id="userNick"
                  name="userNick"
                  value={user.userNick}
                  onChange={changeUser}
                  onBlur={nickCheck}
                ></input>
              </div>
              <div className="msg-box">
                <p ref={nickRef}></p>
              </div>
            </div>
          ) : (
            <div className="input-group">
              <div className="label-box">
                <label htmlFor="userNick">여행사 이름</label>
              </div>
              <div className="input-box">
                <input
                  className="user-input"
                  type="text"
                  id="userNick"
                  name="userNick"
                  onChange={changeUser}
                  onBlur={nickCheck}
                ></input>
                <div className="msg-box">
                  <p ref={nickRef}></p>
                </div>
              </div>
            </div>
          )}

          {category === "user" ? (
            <div className="input-group">
              <div className="label-box">
                <label htmlFor="userName">이름</label>
              </div>
              <div className="input-box">
                <input
                  className="user-input"
                  type="text"
                  id="userName"
                  name="userName"
                  value={user.userName}
                  onChange={changeUser}
                  onBlur={nameCheck}
                ></input>
                <div className="msg-box">
                  <p ref={nameRef}></p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="input-group">
                <div className="label-box">
                  <label htmlFor="businessRegNo">사업자 번호</label>
                </div>
                <div className="input-box">
                  <input
                    className="user-input"
                    type="text"
                    id="businessRegNo"
                    name="businessRegNo"
                    value={user.businessRegNo}
                    onChange={changeUser}
                    onBlur={businessRegNoCheck}
                    placeholder=" - 없이 입력해주세요."
                  ></input>
                </div>
                <div className="msg-box">
                  <p ref={businessRegNoRef}></p>
                </div>
              </div>
            </>
          )}
          <div className="join-btn-box">
            <button type="submit">가입하기</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default JoinUser;
