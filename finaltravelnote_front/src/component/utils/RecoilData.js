import { atom, selector } from "recoil";

//로그인한 이메일을 저장하는 저장소
const loginEmailState = atom({
  key: "loginEmailState",
  default: "",
});

//로그인한 회원의 타입을 저장하는 저장소
const userTypeState = atom({
  key: "userTypeState",
  default: 0,
});

//로그인한 회원의 닉네임을 저장하는 저장소
const userNickState = atom({
  key: "userNickState",
  default: "",
});

//로그인 여부 체크
const isLoginState = selector({
  key: "isLoginState",
  get: (state) => {
    const loginEmail = state.get(loginEmailState);
    const userType = state.get(userTypeState);
    const userNick = state.get(userNickState);

    return loginEmail !== "" && userType !== 0 && userNick !== "";
  },
});

export { loginEmailState, userTypeState, userNickState, isLoginState };
