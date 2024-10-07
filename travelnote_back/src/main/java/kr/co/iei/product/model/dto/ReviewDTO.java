package kr.co.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="review")
public class ReviewDTO {
	private int reviewNo;
	private int productNo;
	private String reviewWriter;
	private double reviewScore;
	private String reviewContent;
	private String reviewDate;
	private int reviewCommentRef;
	
	private int reviewLike;
	private int reviewLikeCount;
	private int reviewReplyCount;
	
	//마이페이지 내가쓴 리뷰에서 어떤 글에 작성했는지 확인할 수 있도록 변수 추가
	private String productName;
}
