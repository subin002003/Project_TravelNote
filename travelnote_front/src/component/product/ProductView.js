import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Swal from "sweetalert2";
import { Viewer } from "@toast-ui/react-editor";
import axios from "axios";
import "./product.css";

// import Swiper core and required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./swiper.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const ProductView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const productNo = params.productNo;
  const [product, setProduct] = useState({});
  const navigate = useNavigate();
  const [count, setCount] = useState(1); // 초기 수량을 1로 설정

  useEffect(() => {
    axios
      .get(`${backServer}/product/productNo/${productNo}`)
      .then((res) => {
        console.log(res);
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 날짜 선택
  const [range, setRange] = useState({ from: null, to: null });
  const [swalShown, setSwalShown] = useState(false);

  const showSwalWithReactDayPicker = () => {
    Swal.fire({
      title: "날짜를 선택하세요!",
      html: "<div id='swal-datepicker'></div>",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      preConfirm: () => {
        if (!range.from || !range.to) {
          Swal.showValidationMessage("날짜를 모두 선택해주세요.");
          return false; // 오류가 있을 경우 false 반환
        }
        return true; // 날짜가 모두 선택되었을 경우 true 반환
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          `선택된 날짜: 시작 ${range.from?.toLocaleDateString()} - 종료 ${range.to?.toLocaleDateString()}`
        );
      }
    });

    // 날짜 선택 모달을 보여줍니다.
    setSwalShown(true);
  };

  // 날짜 선택 시 상태 업데이트
  const handleDaySelect = (selectedRange) => {
    setRange(selectedRange);
  };

  // 패키지 상품 삭제
  const deleteProduct = () => {
    axios
      .delete(`${backServer}/product/${product.productNo}`)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          navigate("/product/list");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const minus = () => {
    if (count === 1) {
      alert("최소 주문 수량은 1개 입니다.");
    } else {
      setCount((prevCount) => prevCount - 1); // 이전 값을 기반으로 상태 업데이트
    }
  };

  const plus = () => {
    if (count === 10) {
      alert("최대 주문 수량은 10개 입니다.");
    } else {
      setCount((prevCount) => prevCount + 1); // 이전 값을 기반으로 상태 업데이트
    }
  };

  return (
    <section className="section product-view-wrap">
      <div className="product-view-content">
        <div className="product-view-info">
          <div className="product-thumbnail-swiper">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              pagination={{
                el: ".swiper-pagination",
                type: "fraction",
                clickable: true,
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              autoplay={{ delay: 2500 }}
            >
              {product.fileList ? (
                product.fileList.map((file, i) => (
                  <SwiperSlide key={"file-" + i} file={file}>
                    <img
                      src={`${backServer}/product/${file.filepath}`} // 서버의 URL과 결합
                      alt={`Slide ${i}`}
                      style={{
                        height: "780px", // 원하는 높이 설정
                        width: "100%", // 너비를 100%로 설정
                        objectFit: "cover", // 이미지 비율 유지하면서 잘림
                      }}
                    />
                  </SwiperSlide>
                ))
              ) : (
                <img src="/image/default_img.png" />
              )}
            </Swiper>
          </div>
          <div className="product-view-preview">
            {/* 상품 정보 출력 */}
            <h2>{product.productName}</h2>
            <p>{product.productSubName}</p>
            {/* <p>찜 갯수: {product.wishCount}</p>
            <p>리뷰 별점: {product.reviewRating}</p> */}
          </div>
        </div>

        <div className="line"></div>

        <div className="sec product-view-reservation">
          <h3 className="section-title">여행 예약</h3>

          {swalShown &&
            createPortal(
              <DayPicker
                mode="range"
                selected={range}
                onSelect={handleDaySelect} // 상태 업데이트
                style={{ display: "inline-block" }}
              />,
              Swal.getHtmlContainer()
            )}

          <div className="date-picker" onClick={showSwalWithReactDayPicker}>
            {!range?.from && !range?.to ? (
              "여행 날짜를 선택하세요!"
            ) : (
              <>
                {range?.from &&
                  `시작 날짜: ${range.from?.toLocaleDateString()} `}
                {range?.to && `종료 날짜: ${range.to?.toLocaleDateString()}`}
              </>
            )}
          </div>

          <div className="people">
            <button className="btn-primary sm" onClick={minus}>
              -
            </button>
            <input
              type="number"
              id="count"
              value={count}
              style={{
                margin: "0 7px",
                // width: "29px",
                height: "28px",
                textAlign: "center",
                border: "none",
                backgroundColor: "transparent",
              }}
              readOnly
            />
            <button className="btn-primary sm" onClick={plus}>
              +
            </button>
          </div>

          <div style={{ margin: "50px 0" }}>
            <p>{product.productName}</p>
            <p>
              {range?.from && `시작 날짜: ${range.from?.toLocaleDateString()} `}
              {range?.to && `종료 날짜: ${range.to?.toLocaleDateString()}`}
            </p>
            <p className="price">{product.productPrice}</p>
          </div>

          <div style={{ padding: "23.5px 0" }} className="btn-primary lg">
            여행 예약하기
          </div>
        </div>

        <div className="line"></div>

        <div className="sec">
          <h3 className="section-title">여행지 소개</h3>
          <div>
            {product.productInfo ? (
              <Viewer initialValue={product.productInfo} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="clear"></div>
      <div className="line"></div>

      <div className="sec comment">
        <div className="section-title">
          <span style={{ fontSize: "20px" }}>
            <strong>리뷰({}개)</strong>
          </span>
        </div>

        {/* 댓글 입력 */}
        <div className="inputCommentBox"></div>

        {/* 댓글 출력 */}
        <div className="commentBox"></div>
      </div>

      <div className="clear"></div>
      <div className="line"></div>

      <div className="button-box">
        <Link
          className="btn-primary lg"
          to={`/product/update/${product.productNo}`}
        >
          수정
        </Link>
        <button
          type="button"
          className="btn-secondary lg"
          onClick={deleteProduct}
        >
          삭제
        </button>
      </div>
    </section>
  );
};

export default ProductView;
