import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Viewer } from "@toast-ui/react-editor";
import "react-day-picker/dist/style.css";
import axios from "axios";
import "./product.css";

// Import MUI components
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Rating,
} from "@mui/material";

// Import Swiper core and required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./swiper.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import DateRangePickerComponent from "./DatePickerComponent";
import Review from "./review/Review";
import Swal from "sweetalert2";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    isLoginState,
    loginEmailState,
    userTypeState,
} from "../utils/RecoilData";
import ChannelTalk from "./ChannelTalk";
// MUI select
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import GoogleMap from "./GoogleMap";

const sortOptions = [
    { label: '좋아요순', value: 'mostLiked' },
    { label: '최신순', value: 'newest' },
];

const ProductView = () => {
    const backServer = process.env.REACT_APP_BACK_SERVER;
    // 로그인 회원 정보
    const isLogin = useRecoilValue(isLoginState);
    const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
    const userEmail = loginEmail;
    const [userType, setUserType] = useRecoilState(userTypeState);

    const params = useParams();
    const productNo = params.productNo;
    const [product, setProduct] = useState({ productFileList: [], productReviewList: [] });
    const [productFileList, setProductFileList] = useState([]);
    const [productReviewList, setProductReviewList] = useState([]);

    const navigate = useNavigate();
    const [people, setPeople] = useState(1); // 초기 수량을 1로 설정
    const [dateRange, setDateRange] = useState("여행 날짜를 선택하세요."); // 선택된 날짜 범위를 상태로 관리
    const [openReviewDialog, setOpenReviewDialog] = useState(false); // 다이얼로그 상태

    useEffect(() => {
        if (!productNo || !userEmail) {
            console.error("productNo 또는 userEmail이 유효하지 않습니다.");
            return;
        }

        axios
            .get(`${backServer}/product/productNo/${productNo}/${userEmail}`)
            .then((res) => {
                console.log(res.data);
                setProduct(res.data.product);
                setProductFileList(res.data.productFileList); // 첨부파일 관리
                setProductReviewList(res.data.productReviewList); // 리뷰 관리
            })
            .catch((err) => {
                console.log("Error:", err.response ? err.response.data : err.message);
                Swal.fire({
                    title: "상품 정보를 불러오는 데 실패했습니다.",
                    text: "다시 시도하세요.",
                    icon: "error",
                });
            });
    }, [productNo, userEmail]);

    // 각 정렬 옵션에 따른 클릭 이벤트 처리
    const handleSortClick = (sortOption) => {
        console.log(sortOption);

        axios.get(`${backServer}/product/productNo/${productNo}/${userEmail}/${sortOption}`)
            .then((res) => {
                console.log(res.data); // 응답 데이터 로그
                const newReviews = res.data.productReviewList; // 새 리뷰 리스트
                setProductReviewList(newReviews); // 리뷰 관리
            })
            .catch((err) => {
                console.error('Axios error:', err);
                console.error('Error response data:', err.response ? err.response.data : 'No response data');
            });
    };

    // 날짜 범위 상태
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // DatePicker로 선택된 날짜 처리
    const handleDateRangeChange = (startDate, endDate) => {
        if (startDate && endDate) {
            const options = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            const startFormatted = new Date(startDate).toLocaleDateString(
                "ko-KR",
                options
            );
            const endFormatted = new Date(endDate).toLocaleDateString(
                "ko-KR",
                options
            );

            setDateRange(`선택된 날짜: ${startFormatted} ~ ${endFormatted}`);
            setStartDate(startDate); // startDate 상태 업데이트
            setEndDate(endDate); // endDate 상태 업데이트
        }
    };

    // 패키지 상품 삭제
    const deleteProduct = () => {
        Swal.fire({
            title: "상품을 삭제하시겠습니까?",
            text: "삭제 후 복구할 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then((res) => {
            if (res.isConfirmed) {
                // 사용자가 삭제를 확인했을 경우에만 Axios 요청 실행
                axios
                    .delete(`${backServer}/product/${product.productNo}`)
                    .then((res) => {
                        // 응답 처리
                        if (res.data === 1) {
                            Swal.fire({
                                title: "상품이 삭제되었습니다.",
                                icon: "success",
                            });
                            navigate("/product/list");
                        } else {
                            Swal.fire({
                                title: "상품 삭제에 실패했습니다.",
                                text: "다시 시도해 주세요.",
                                icon: "error",
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire({
                            title: "오류 발생",
                            text: "상품 삭제 중 오류가 발생했습니다.",
                            icon: "error",
                        });
                    });
            }
        });
    };

    const minus = () => {
        if (people === 1) {
            Swal.fire({
                title: "최소 구매 수량은 1개 입니다.",
                icon: "warning",
            });
        } else {
            setPeople((prevCount) => prevCount - 1); // 이전 값을 기반으로 상태 업데이트
        }
    };

    const plus = () => {
        if (people === 10) {
            Swal.fire({
                title: "최대 구매 수량은 10개 입니다.",
                icon: "warning",
            });
        } else {
            setPeople((prevCount) => prevCount + 1); // 이전 값을 기반으로 상태 업데이트
        }
    };

    // 리뷰 작성 팝업 열기
    const handleOpenReviewDialog = () => {
        setOpenReviewDialog(true);
    };

    // 리뷰 작성 팝업 닫기
    const handleCloseReviewDialog = () => {
        setOpenReviewDialog(false);
    };

    return (
        <section className="section product-view-wrap">
            <div className="product-view-content">
                <div className="product-view-info">
                    <div className="product-thumbnail-swiper">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            slidesPerView={1}
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
                            {productFileList && productFileList.length > 0 ? (
                                productFileList.map((file, i) => (
                                    <SwiperSlide key={"file-" + i}>
                                        <img
                                            src={`${backServer}/product/${file.filepath}`}
                                            alt={`Slide ${i}`}
                                            style={{
                                                height: "780px",
                                                width: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </SwiperSlide>
                                ))
                            ) : (
                                <SwiperSlide>
                                    <img src="/image/default_img.png" alt="기본 이미지" />
                                </SwiperSlide>
                            )}

                            {/* Navigation 버튼 추가 */}
                            <div className="swiper-button-next"></div>
                            <div className="swiper-button-prev"></div>
                            {/* Pagination 추가 */}
                            <div className="swiper-pagination"></div>
                        </Swiper>
                    </div>
                    <div className="product-view-preview">
                        {/* 상품 정보 출력 */}
                        <h2>{product.productName}</h2>
                        <p>{product.productSubName}</p>
                    </div>
                </div>

                <div className="line"></div>

                <div className="sec product-view-reservation">
                    <h3 className="section-title">여행 예약</h3>

                    <DateRangePickerComponent onDateRangeChange={handleDateRangeChange} />

                    <div className="people">
                        <button className="btn-count" onClick={minus}>
                            -
                        </button>
                        <span>{people}</span>
                        <button className="btn-count" onClick={plus}>
                            +
                        </button>
                    </div>
                    <p>{dateRange}</p>

                    <div className="actions">
                        {userType === "관리자" && (
                            <Button variant="contained" color="error" onClick={deleteProduct}>
                                상품 삭제
                            </Button>
                        )}
                        <Button variant="contained" color="primary" onClick={handleOpenReviewDialog}>
                            리뷰 작성
                        </Button>
                    </div>
                </div>

                <div className="line"></div>

                {/* 정렬 기능 추가 */}
                <div className="review-sort">
                    <FormControl variant="outlined">
                        <Select
                            value=""
                            onChange={(e) => handleSortClick(e.target.value)} // 정렬 클릭 이벤트 처리
                            displayEmpty
                            inputProps={{ 'aria-label': 'Sort Reviews' }}
                        >
                            <MenuItem value="" disabled>리뷰 정렬</MenuItem>
                            {sortOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* 리뷰 출력 */}
                <div className="commentBox">
                    <div className="posting-review-wrap">
                        <ul>
                            {productReviewList.length > 0 ? (
                                productReviewList.map((review, i) => (
                                    <ReviewItem
                                        key={`review-${i}`}
                                        product={product}
                                        review={review}
                                        parentReviewNo={review.reviewNo} // 부모 리뷰 ID 전달
                                    />
                                ))
                            ) : (
                                <li style={{ textAlign: "center", color: "gray" }}>
                                    등록된 리뷰가 없습니다.
                                </li>
                            )}
                        </ul>
                    </div>
                    {/* 리뷰 전체보기 */}
                </div>

                <ChannelTalk />
            </div>

            {/* 리뷰 작성 다이얼로그 */}
            <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog}>
                <DialogTitle>리뷰 작성</DialogTitle>
                <DialogContent>
                    <Review
                        productNo={productNo}
                        onClose={handleCloseReviewDialog}
                        setProductReviewList={setProductReviewList} // 리뷰 리스트 업데이트를 위한 함수 전달
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReviewDialog} color="primary">
                        취소
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Google Map 컴포넌트 */}
            <GoogleMap latitude={product.latitude} longitude={product.longitude} />
        </section>
    );
};

export default ProductView;
