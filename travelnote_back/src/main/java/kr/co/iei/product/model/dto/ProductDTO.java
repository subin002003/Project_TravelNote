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
	private String productLatitude;
	private String productLongitude;
	private String productWriter;
	private int productStatus;
	private String enrollDate;
	private List<ProductFileDTO> fileList;
	private int[] delProductFileNo;
	// 위시 상품
	private int likeCount;
	private int isLike;
	// 리뷰 추가
	private List<ReviewDTO> reviews;
	private int reviewLike;
	private int reviewLikeCount;
}
