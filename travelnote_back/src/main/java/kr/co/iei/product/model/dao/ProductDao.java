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

	List selectProductList(PageInfo pi);

	int insertProduct(ProductDTO product);

	int insertProductFile(ProductFileDTO productFile);

	ProductDTO selectOneProduct(int productNo);

	List<ProductFileDTO> selectOneProductFileList(int productNo);

	List<ReviewDTO> selectOneProductReviews(int productNo, int userNo);

	ProductFileDTO getProductFile(int productFileNo);

	int deleteProduct(int productNo);

	int updateProduct(ProductDTO product);

	List<ProductFileDTO> selectProductFile(int[] delProductFileNo);

	int deleteProductFile(int[] delProductFileNo);

	int selectOneUser(String userEmail);
	
	int insertWish(int productNo, List<UserDTO> user);
	int deleteWish(int productNo, List<UserDTO> user);
	int checkExistingWish(int productNo, List<UserDTO> user);

	int insertReview(ReviewDTO review);

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

}
