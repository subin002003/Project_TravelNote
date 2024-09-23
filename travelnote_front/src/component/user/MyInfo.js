import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loginEmailState, userTypeState } from "../utils/RecoilData";

const MyInfo = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);

  useEffect(() => {
    axios
      .get(`${backServer}/user`)
      .then((res) => {
        console.log(res);
        setUser(res.data); // 사용자 정보 세팅
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loginEmail]);

  // user가 null일 때 로딩 처리
  if (!user) {
    return <div>Loading...</div>; // 로딩 스피너 또는 메시지 표시
  }

  return (
    <div className="info-wrap">
      <div className="page-title-info">
        <h1>내 정보</h1>
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
          <input
            type="text"
            name="userName"
            id="userName"
            value={user.userName}
            disabled
          ></input>
        </div>
      </div>

      <div className="input-group">
        <div className="label-box">
          <label htmlFor="userNic">닉네임</label>
        </div>
        <div className="input-box">
          {user.socialType === null ? (
            <input
              type="text"
              name="userNick"
              id="userNick"
              value={user.userNick}
            ></input>
          ) : (
            <input
              type="text"
              name="userNick"
              id="userNick"
              value={user.userNick}
              disabled
            ></input>
          )}
        </div>
      </div>
      <div className="input-group">
        <div className="label-box">
          <label htmlFor="userPhone">전화번호</label>
        </div>
        <div className="input-box">
          <input
            type="text"
            name="userPhone"
            id="userPhone"
            value={user.userPhone}
          ></input>
        </div>
      </div>
      <div className="input-group">
        <div className="label-box">
          <label htmlFor="userPhone">비밀번호</label>
        </div>
        <div className="input-box">
          <button className="change-pw-btn">비밀번호 변경하기</button>
        </div>
      </div>
      <div className="btn-box">
        <button className="change-info-btn">회원정보 수정</button>
        <button className="delete-user-btn">회원탈퇴 하기</button>
      </div>
    </div>
  );
};

export default MyInfo;
