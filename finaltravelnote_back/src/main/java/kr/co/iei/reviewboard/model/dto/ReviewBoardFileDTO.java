package kr.co.iei.reviewboard.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "reviewBoardFile")
public class ReviewBoardFileDTO {
	private int reviewBoardFileNo;
	private int reviewBoardNo;
	private String filename;
	private String filepath;
}
