import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, userTypeState } from "../utils/RecoilData";
import Swal from "sweetalert2";
import axios from "axios";
import PageNavi from "../utils/PagiNavi";
import { useNavigate } from "react-router-dom";

const ManageUser = () => {
  const isLogin = useRecoilValue(isLoginState);
  const [userType, setUserType] = useRecoilState(userTypeState);
  const [reportUserList, setReportUserList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  useEffect(() => {
    if (userType !== 3) {
      Swal.fire({
        icon: "warning",
        title: "관리자만 접근할 수 있습니다.",
      });
      navigate("/");
    }

    axios
      .get(`${backServer}/admin/reportUserList/${reqPage}`)
      .then((res) => {
        setReportUserList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [navigate, userType, reqPage, backServer]);

  const updateUserStatus = (userType, newType) => {
    setReportUserList((prevList) =>
      prevList.map((user) =>
        user.userType === userType ? { ...user, userType: newType } : user
      )
    );
  };

  return (
    <div className="manage-user-wrap">
      <div className="mypage-title">정지회원 목록</div>
      <table className="report-board-list">
        <tbody>
          <tr>
            <th>회원 닉네임</th>
            <th>회원 이메일</th>
            <th>신고된 게시글 수</th>
            <th>정지 여부</th>
            <th>정지 버튼</th>
          </tr>
          {reportUserList.map((reportUser, i) => (
            <ReportUserItem
              key={"reportUser" + i}
              reportUser={reportUser}
              updateUserStatus={updateUserStatus}
            />
          ))}
        </tbody>
      </table>
      <div className="manage-board-page-navi">
        <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
      </div>
    </div>
  );
};

const ReportUserItem = (props) => {
  const reportUser = props.reportUser;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const updateUserStatus = props.updateUserStatus;

  const SuspendUser = () => {
    axios
      .patch(`${backServer}/user/suspendUser/${reportUser.userEmail}`)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          Swal.fire({
            icon: "success",
            title: "정지 성공",
          });
          updateUserStatus(reportUser.userType, 4);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <tr>
      <td>{reportUser.userNick}</td>
      <td>{reportUser.userEmail}</td>
      <td>{reportUser.inactiveBoards}</td>
      <td>{reportUser.userType === 4 ? "Y" : "N"}</td>
      <td>
        <button onClick={SuspendUser}>정지</button>
      </td>
    </tr>
  );
};

export default ManageUser;
