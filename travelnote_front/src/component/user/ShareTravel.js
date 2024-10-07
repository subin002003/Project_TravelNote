import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import axios from "axios";

const ShareTravel = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});
  const [shareTravelList, setShareTrevelList] = useState([]);
  const [userNick, setUserNick] = useRecoilState(userNickState);

  useEffect(() => {
    axios
      .get(`${backServer}/user/shareTravelList/${userNick}/${reqPage}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);
};

export default ShareTravel;
