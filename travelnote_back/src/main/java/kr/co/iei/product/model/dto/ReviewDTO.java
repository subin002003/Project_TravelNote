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
	
	private int reviewLikeCount;
	private int reviewLike;
}
