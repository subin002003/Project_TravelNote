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
	private String ReviewBoardCategory;
	private int reviewBoardCount;
	private int reviewBoardStatus;
	private String reviewBoardThumbnail;
	private String reviewBoardSubContent;
	private String likeCount;
	private List<ReviewBoardFileDTO> fileList;
	private int[] delBoardFileNo;
	
}
