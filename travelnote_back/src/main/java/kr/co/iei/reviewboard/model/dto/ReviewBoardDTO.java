package kr.co.iei.reviewboard.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "reviewBoard")
public class ReviewBoardDTO {
	private int reviewBoardNo;
	private String reviewBoardWriter;
	private String reviewBoardTitle;
	private String reviewBoardContent;
	private String reviewBoardDate;
	private String reviewBoardCategory;
	private int reviewBoardReadCount;
	private int reviewBoardStatus;
	private String reviewBoardThumbNail;
	private String reviewBoardSubContent;
	private String likeCount;
	private List<ReviewBoardFileDTO> fileList;
	private int[] delReviewBoardFileNo;
	
	//신고횟수를 위한 변수 추가 2024-10-10 오건하
	private int reportCount;
}
	

