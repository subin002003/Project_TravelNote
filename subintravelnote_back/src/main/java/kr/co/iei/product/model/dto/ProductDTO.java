package kr.co.iei.product.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="product")
public class ProductDTO {
	private int productNo;
	private String productName;
	private String productSubName;
	private String productThumb;
	private int productPrice;
	private String productInfo;
	private double productLatitude;
	private double productLongitude;
	private String productWriter;
	private int productStatus;
	private String enrollDate;
	private List<ProductFileDTO> productFileList;
	private int[] delProductFileNo;
	// 위시 상품
	private int productLike;
	private int productLikeCount;
	// 리뷰
	private List<ReviewDTO> productReviewList;
	
	// 각 상품 리뷰 평균 점수
	private double avgReviewScore;
}
