package kr.co.iei.product.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.product.model.dto.ProductDTO;
import kr.co.iei.product.model.dto.ProductFileDTO;
import kr.co.iei.product.model.dto.ReviewDTO;
import kr.co.iei.user.model.dto.UserDTO;
import kr.co.iei.util.PageInfo;

@Mapper
public interface ProductDao {

	int totalCount();
	
	int reviewTotalCount(int productNo);

	int totalCountSearch(String keyword);
	
	List<ProductDTO> searchProduct(String keyword);

	List<ProductDTO> searchProductList(PageInfo pi, String keyword);

	List<ProductDTO> selectProductList(PageInfo pi);

	List<ProductDTO> selectProductListEmail(PageInfo pi, String userEmail);

	// 상품 정렬
	List<ProductDTO> selectProductListMostLiked(PageInfo pi, String userEmail);
	List<ProductDTO> selectProductListNewest(PageInfo pi, String userEmail);

	int insertProduct(ProductDTO product);

	int insertProductFile(ProductFileDTO productFile);

	// 상품 기본 정보 조회
    ProductDTO selectOneProduct(int productNo);

    // 상품 파일 리스트 조회
    List<ProductFileDTO> selectOneProductFileList(int productNo);

    // 사용자 번호 조회
    int selectOneUser(String userEmail);

    // 리뷰 리스트 조회(이메일 없을 때)
	List<ReviewDTO> selectOneProductReviews(int productNo, PageInfo pi);
    // 리뷰 답글 조회(이메일 없을 때)
	List<ReviewDTO> selectOneProductReviewReCommentList(int productNo, PageInfo pi);
	
	// 리뷰 리스트 조회(이메일 있을 때)
    List<ReviewDTO> selectOneProductUserReviews(int productNo, int userNo, PageInfo pi);
    // 리뷰 답글 조회
 	List<ReviewDTO> selectOneProductUserReviewReCommentList(int productNo, int userNo, PageInfo pi);
 	
    // 리뷰 리스트 (좋아요 순 정렬)
    List<ReviewDTO> selectReviewListMostLiked(int productNo, int userNo);
    // 리뷰 리스트 (최신순 정렬)
    List<ReviewDTO> selectReviewListNewest(int productNo, int userNo);
    // 리뷰 리스트 (별점순 정렬)
	List<ReviewDTO> selectReviewListScore(int productNo, int userNo);
	
    // 리뷰 답글 리스트 (좋아요 순 정렬)
    List<ReviewDTO> selectReviewReCommentListMostLiked(int productNo, int userNo);
    // 리뷰 답글 리스트 (최신순 정렬)
    List<ReviewDTO> selectReviewReCommentListNewest(int productNo, int userNo);
    // 리뷰 답글 리스트 (별점순 정렬)
	List<ReviewDTO> selectReviewReCommentListScore(int productNo, int userNo);

	ProductFileDTO getProductFile(int productFileNo);

	int deleteProduct(int productNo);

	int updateProduct(ProductDTO product);

	List<ProductFileDTO> selectProductFile(int[] delProductFileNo);

	int deleteProductFile(int[] delProductFileNo);
	
	int insertWish(int productNo, List<UserDTO> user);
	int deleteWish(int productNo, List<UserDTO> user);
	int checkExistingWish(int productNo, List<UserDTO> user);

	int insertReview(ReviewDTO review);

	int insertReviewComment(ReviewDTO review);

	int updateReview(ReviewDTO review);

	int deleteReview(ReviewDTO review);

	// 리뷰 좋아요 추가
	int insertReviewLike(int reviewNo, int userNo);
	// 리뷰 좋아요 취소
	int deleteReviewLike(int reviewNo, int userNo);
	// 리뷰 좋아요 수 조회
	int selectReviewLikeCount(int reviewNo);

	// 상품 찜
	int insertWishLike(int productNo, int userNo);
	// 상품 찜 취소
	int deleteWishLike(int productNo, int userNo);
	// 상품 찜 수 조회
	int selectProductLikeCount(int productNo);

	int selectOneProductReview(ReviewDTO review);

	int selectParentProduct(int productNo);

	int selectParentreview(int reviewCommentRef);

	int checkProductExists(int productNo);



	//오건하 작성 2024-10-04
	int myReviewTotalCount(String userNick);

	//오건하 작성 2024-10-04
	List myReviewList(PageInfo pi);
	
	//오건하 작성 2024-10-04
	int myProductTotalCount(String userNick);
	
	//오건하 작성 2024-10-04
	List myProductList(PageInfo pi);
	
	//오건하 작성 2024-10-07
	int myWishTotalCount(String userNick);

	//오건하 작성 2024-10-07
	List myWishList(PageInfo pi);

}
