import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { loginEmailState, userTypeState } from "../utils/RecoilData";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MyInfo = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);
  //이름 변경 유효성 검사 / 0 -> 입력하지 않은 상태, 1 -> 유효성 검사 실패 , 2 -> 변경 가능한 이름
  const [nameStatus, setNameStatus] = useState(0);
  const nameStatusMessage = useRef(null);
  //닉네임 변경 유효성 검사 / 0 -> 입력하지 않은 상태, 1 -> 유효성 검사 실패, 2 -> 중복 닉네임 , 3 -> 변경 가능한 이름
  const [nickStatus, setNickStatus] = useState(0);
  const nickStatusMessage = useRef(null);
  //전화번호 변경 유효성 검사 / 0 -> 입력하지 않은 상태, 1 -> 유효성 검사 실패, 2 -> 변경 가능한 번호
  const [phoneStatus, setPhoneStatus] = useState(0);
  const phoneStatusMessage = useRef(null);
  useEffect(() => {
    axios
      .get(`${backServer}/user`)
      .then((res) => {
        setUser(res.data);
        setOriginalUser(res.data); // 초기 상태 저장
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loginEmail]);

  // user가 null일 때 로딩 처리
  if (!user) {
    return <div>Loading...</div>; // 로딩 스피너 또는 메시지 표시
  }

  const changeUser = (e) => {
    const name = e.target.name;
    setUser({ ...user, [name]: e.target.value });
    console.log(user);
  };

  const checkName = () => {
    const nameReg = /^[가-힣]{1,7}$/;
    if (!nameReg.test(user.userName)) {
      setNameStatus(1);
      nameStatusMessage.current.classList.add("invalid");
      nameStatusMessage.current.innerText = "양식에 맞춰 입력해주세요.";
    } else {
      setNameStatus(2);
      nameStatusMessage.current.classList.add("valid");
      nameStatusMessage.current.innerText = "";
    }
  };
  const checkNick = () => {
    nickStatusMessage.current.classList.remove("invalid");
    nickStatusMessage.current.classList.remove("valid");
    const nickReg = /^[가-힣a-zA-Z0-9]{1,8}$/;
    if (!nickReg.test(user.userNick)) {
      setNickStatus(1);
      nickStatusMessage.current.classList.add("invalid");
      nickStatusMessage.current.innerText =
        "닉네임은 8자 이하로만 사용 가능합니다.";
    } else {
      axios.get(`${backServer}/user/checkNick/${user.userNick}`).then((res) => {
        if (res.data === 0) {
          setNickStatus(3);
          nickStatusMessage.current.classList.add("valid");
          nickStatusMessage.current.innerText = "사용 가능한 닉네임 입니다.";
        } else {
          setNickStatus(2);
          nickStatusMessage.current.classList.add("invalid");
          nickStatusMessage.current.innerText = "중복된 닉네임 입니다.";
        }
      });
    }
  };

  const checkPhone = () => {
    phoneStatusMessage.current.classList.remove("invalid");
    phoneStatusMessage.current.classList.remove("valid");
    const phoneReg = /^\d{2,3}-\d{3,4}-\d{3,4}$/;
    if (!phoneReg.test(user.userPhone)) {
      setPhoneStatus(1);
      phoneStatusMessage.current.classList.add("invalid");
      phoneStatusMessage.current.innerText = "양식에 맞춰 입력해주세요.";
    } else {
      axios
        .get(`${backServer}/user/checkPhone/${user.userPhone}`)
        .then((res) => {
          console.log(res);
          if (res.data === 0) {
            setPhoneStatus(3);
            phoneStatusMessage.current.classList.add("valid");
            phoneStatusMessage.current.innerText =
              "사용가능한 전화번호 입니다.";
          } else {
            setPhoneStatus(2);
            phoneStatusMessage.current.classList.add("invalid");
            phoneStatusMessage.current.innerText = "중복된 전화번호 입니다.";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const updateUser = () => {
    const updatedFields = {};

    if (user.userName !== originalUser.userName && nameStatus === 2) {
      updatedFields.userName = user.userName;
    }

    if (user.userNick !== originalUser.userNick && nickStatus === 3) {
      updatedFields.userNick = user.userNick;
    }

    if (user.userPhone !== originalUser.userPhone && phoneStatus === 3) {
      updatedFields.userPhone = user.userPhone;
    }

    if (Object.keys(updatedFields).length > 0) {
      updatedFields.userEmail = loginEmail;

      axios
        .patch(`${backServer}/user`, updatedFields)
        .then((res) => {
          if (res.data === 1) {
            Swal.fire({
              title: "수정 성공",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "수정 실패",
              icon: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal.fire({
        title: "변경된 값이 없습니다.",
        icon: "warning",
      });
    }
  };

  const deleteUser = () => {
    Swal.fire({
      icon: "warning",
      title: "회원 탈퇴",
      text: "회원을 탈퇴 하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(`${backServer}/user`)
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              Swal.fire({
                title: "탈퇴 성공",
                icon: "success",
              });
              setLoginEmail("");
              setUserType(0);
              delete axios.defaults.headers.common["Authorization"];
              window.localStorage.removeItem("refreshToken");
              navigate("/");
            } else {
              Swal.fire({
                title: "탈퇴 실패",
                icon: "warning",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
      }
    });
  };

  const navigateChangePw = () => {
    navigate("/mypage/changePw");
  };

  return (
    <div className="info-wrap">
      <div className="page-title-info">
        <h1>내 정보</h1>
      </div>
      {userType === 1 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser();
          }}
        >
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
                disabled
              ></input>
            </div>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userName">이름</label>
            </div>
            <div className="input-box">
              {user.socialType === null ? (
                <input
                  className="user-input"
                  type="text"
                  name="userName"
                  id="userName"
                  value={user.userName}
                  onChange={changeUser}
                  onBlur={checkName}
                ></input>
              ) : (
                <>
                  <input
                    className="user-input"
                    type="text"
                    name="userName"
                    id="userName"
                    value={user.userName}
                    disabled
                  ></input>
                  <p>소셜로그인 유저는 닉네임을 수정할 수 없습니다.</p>
                </>
              )}
            </div>
            <p ref={nameStatusMessage}></p>
          </div>

          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userNic">닉네임</label>
            </div>
            <div className="input-box">
              {user.socialType === null ? (
                <input
                  className="user-input"
                  type="text"
                  name="userNick"
                  id="userNick"
                  value={user.userNick}
                  onChange={changeUser}
                  onBlur={checkNick}
                  disabled
                ></input>
              ) : (
                <>
                  <input
                    className="user-input"
                    type="text"
                    name="userNick"
                    id="userNick"
                    value={user.userNick}
                    disabled
                  ></input>
                  <p>소셜로그인 유저는 닉네임을 수정할 수 없습니다.</p>
                </>
              )}
            </div>
            <p ref={nickStatusMessage}></p>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userPhone">전화번호</label>
            </div>
            <div className="input-box">
              {user.socialType === null ? (
                <input
                  className="user-input"
                  type="text"
                  name="userPhone"
                  id="userPhone"
                  value={user.userPhone}
                  onChange={changeUser}
                  onBlur={checkPhone}
                ></input>
              ) : (
                <>
                  <input
                    className="user-input"
                    type="text"
                    name="userPhone"
                    id="userPhone"
                    value={user.userPhone}
                    disabled
                  ></input>
                  <p>소셜로그인 유저는 전화번호를 수정할 수 없습니다.</p>
                </>
              )}
            </div>
            <p ref={phoneStatusMessage}></p>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userPhone">비밀번호</label>
            </div>
            <div className="input-box">
              {user.socialType === null ? (
                <button onClick={navigateChangePw} className="change-pw-btn">
                  비밀번호 변경하기
                </button>
              ) : (
                <button className="change-pw-btn disable-btn" disabled>
                  소셜 로그인 유저는 비밀번호를 변경할 수 없습니다.
                </button>
              )}
            </div>
          </div>
          <div className="btn-box">
            {user.socialType === null ? (
              <button type="submit" className="change-info-btn">
                회원정보 수정
              </button>
            ) : (
              <button
                type="disabled"
                className="change-info-btn disable-btn"
                disabled
              >
                회원정보 수정 불가
              </button>
            )}
            <button
              className="delete-user-btn"
              onClick={(e) => {
                e.preventDefault();
                deleteUser();
              }}
            >
              회원탈퇴 하기
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser();
          }}
        >
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
                disabled
              ></input>
            </div>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userName">여행사명</label>
            </div>
            <div className="input-box">
              {user.socialType === null ? (
                <input
                  className="user-input"
                  type="text"
                  name="userName"
                  id="userName"
                  value={user.userName}
                  onChange={changeUser}
                  onBlur={checkName}
                ></input>
              ) : (
                <>
                  <input
                    className="user-input"
                    type="text"
                    name="userName"
                    id="userName"
                    value={user.userName}
                    disabled
                  ></input>
                  <p>소셜로그인 유저는 닉네임을 수정할 수 없습니다.</p>
                </>
              )}
            </div>
            <p ref={nameStatusMessage}></p>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userPhone">전화번호</label>
            </div>
            <div className="input-box">
              {user.socialType === null ? (
                <input
                  className="user-input"
                  type="text"
                  name="userPhone"
                  id="userPhone"
                  value={user.userPhone}
                  onChange={changeUser}
                  onBlur={checkPhone}
                ></input>
              ) : (
                <>
                  <input
                    className="user-input"
                    type="text"
                    name="userPhone"
                    id="userPhone"
                    value={user.userPhone}
                    disabled
                  ></input>
                  <p>소셜로그인 유저는 전화번호를 수정할 수 없습니다.</p>
                </>
              )}
            </div>
            <p ref={phoneStatusMessage}></p>
          </div>
          <div className="input-group">
            <div className="label-box">
              <label htmlFor="userPhone">비밀번호</label>
            </div>
            <div className="input-box">
              {user.socialType === null ? (
                <button onClick={navigateChangePw} className="change-pw-btn">
                  비밀번호 변경하기
                </button>
              ) : (
                <button className="change-pw-btn disable-btn" disabled>
                  소셜 로그인 유저는 비밀번호를 변경할 수 없습니다.
                </button>
              )}
            </div>
          </div>
          <div className="btn-box">
            {user.socialType === null ? (
              <button type="submit" className="change-info-btn">
                회원정보 수정
              </button>
            ) : (
              <button
                type="disabled"
                className="change-info-btn disable-btn"
                disabled
              >
                회원정보 수정 불가
              </button>
            )}
            <button
              className="delete-user-btn"
              onClick={(e) => {
                e.preventDefault();
                deleteUser();
              }}
            >
              회원탈퇴 하기
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MyInfo;
