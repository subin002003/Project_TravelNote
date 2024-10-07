import { useRecoilState } from "recoil";
import { loginEmailState } from "../utils/RecoilData";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { getDate, getMonth, getYear } from "date-fns";
import Swal from "sweetalert2";

const ForeignEditItinerary = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const itineraryNo = useParams().itineraryNo;
  const [region, setRegion] = useState({});
  const [itinerary, setItinerary] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isInvitationAvailable, setIsInvitationAvailable] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // 여행 정보 조회
  useEffect(() => {
    axios
      .get(`${backServer}/foreign/getItineraryInfo/${itineraryNo}`)
      .then((res) => {
        setItinerary(res.data);
        setStartDate(res.data.itineraryStartDate);
        setEndDate(res.data.itineraryEndDate);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 지역 정보 조회
  useEffect(() => {
    axios
      .get(`${backServer}/foreign/regionInfo/${itinerary.regionNo}`)
      .then((res) => {
        setRegion(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [itinerary]);

  // 날짜 변경 핸들러
  const changeStartDate = (e) => {
    const year = getYear(e);
    const month = String(getMonth(e) + 1).padStart(2, "0");
    const date = String(getDate(e)).padStart(2, "0");
    setStartDate(year + "-" + month + "-" + date);
  };
  const changeEndDate = (e) => {
    const year = getYear(e);
    const month = String(getMonth(e) + 1).padStart(2, "0");
    const date = String(getDate(e)).padStart(2, "0");
    setEndDate(year + "-" + month + "-" + date);
  };

  // 버튼 클릭 시 일정 수정 적용
  const editItinerary = () => {
    const obj = itinerary;
    obj.itineraryStartDate = startDate;
    obj.itineraryEndDate = endDate;
    console.log(itinerary);
    if (itinerary.itineraryTitle === "") {
      obj.itineraryTitle = `${region.regionName}에 갑니다!`;
    } else {
      obj.itineraryTitle = itinerary.itineraryTitle.trim();
    }
    axios
      .post(`${backServer}/foreign/editItinerary`, obj)
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({
            icon: "success",
            text: "일정이 수정되었습니다.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 일정 삭제
  const deleteItinerary = () => {
    Swal.fire({
      icon: "warning",
      text: "일정과 관련 정보를 모두 삭제할까요?",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        // 삭제 버튼을 클릭한 경우 DB 삭제 진행
        axios
          .delete(`${backServer}/foreign/deleteItinerary/${itineraryNo}`)
          .then((res) => {
            if (res.data == true) {
              Swal.fire({
                icon: "success",
                text: "일정이 삭제되었습니다.",
              });
              navigate("/foreign/list");
            } else {
              console.log(res);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  // 초대 이메일 입력 핸들러
  const changeEmailInput = (e) => {
    setEmailInput(e.target.value);
  };

  // 초대 발송
  const sendInvitation = () => {
    const memberEmail = emailInput.trim();
    if (memberEmail === "") return;
    if (memberEmail === loginEmail) {
      Swal.fire({
        icon: "info",
        text: "초대 받을 다른 회원의 이메일을 입력해 주세요.",
      });
    } else {
      axios
        .get(`${backServer}/foreign/inviteCompanion`, {
          params: {
            memberEmail: memberEmail,
            userEmail: loginEmail,
          },
        })
        .then((res) => {
          console.log(res);
          // 발송 성공 시 1, 실패 시 0, 회원이 없을 시 -1 받아 옴
          if (res.data > 0) {
            setIsInvitationAvailable(false);
            setEmailInput("");
            Swal.fire({
              icon: "success",
              html: "초대장이 발송되었습니다.",
            });
          } else if (res.data === 0) {
            Swal.fire({
              icon: "error",
              html: "메일 발송 중 오류가 발생했습니다.<br>잠시 후 다시 시도해 주세요.",
            });
          } else {
            Swal.fire({
              icon: "warning",
              html: "해당 이메일로 회원을 찾을 수 없습니다..<br>다른 이메일을 입력해 주세요.",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {/* 다시 여행 조회로 이동 버튼 만들기 */}

      <section className="section">
        <form
          className="itinerary-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {/* 여행지 정보 */}
          <div className="foreign-info-box">
            <h2>
              {region.countryName} {region.regionName}
            </h2>
            <div className="region-info-box">
              {isInvitationAvailable ? (
                <>
                  <input
                    className="invitation-input"
                    placeholder="초대를 받을 분의 이메일을 입력해 주세요."
                    value={emailInput}
                    onChange={changeEmailInput}
                  ></input>
                  <span
                    className="invitation-button"
                    id="invitation-button"
                    onClick={sendInvitation}
                  >
                    초대 발송하기
                  </span>
                </>
              ) : (
                <span
                  className="companion-button"
                  onClick={() => {
                    setIsInvitationAvailable(true);
                  }}
                >
                  동행자 추가하기
                </span>
              )}
            </div>
          </div>

          {/* 이미지, 인풋 3개 */}
          <div className="foregin-itinerary-box">
            <div className="region-img">
              <img
                src={
                  region.regionImg
                    ? `${backServer}/foreign/${region.regionImg}`
                    : "/image/default_img.png"
                }
              ></img>
            </div>
            <div className="itinerary-input-box">
              <div className="itinerary-input-item">
                <p>여행 제목</p>
                <input
                  className="itinerary-input"
                  name="itineraryTitle"
                  value={itinerary.itineraryTitle}
                  placeholder={region.regionName + "에 갑니다!"}
                  onChange={(e) => {
                    setItinerary({
                      ...itinerary,
                      itineraryTitle: e.target.value,
                    });
                  }}
                ></input>
              </div>
              <div className="itinerary-input-item">
                <p>시작 날짜</p>
                <DatePicker
                  className="itinerary-input"
                  name="itineraryStartDate"
                  selected={startDate}
                  dateFormat="YYYY년 MM월 dd일"
                  onChange={changeStartDate}
                  maxDate={endDate}
                  locale={ko}
                />
              </div>
              <div className="itinerary-input-item">
                <p>종료 날짜</p>
                <DatePicker
                  className="itinerary-input"
                  name="itineraryEndDate"
                  selected={endDate}
                  dateFormat="YYYY년 MM월 dd일"
                  onChange={changeEndDate}
                  minDate={startDate}
                  locale={ko}
                />
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="create-button-box">
            <button
              id="itinerary-edit-button"
              type="button"
              onClick={editItinerary}
            >
              여행 일정 수정하기
            </button>
          </div>
          <div className="delete-itinerary-box">
            <span className="delete-button" onClick={deleteItinerary}>
              여행 일정 삭제하기
            </span>
          </div>
        </form>
      </section>
    </>
  );
};

export default ForeignEditItinerary;
