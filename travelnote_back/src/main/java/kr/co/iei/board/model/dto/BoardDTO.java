package kr.co.iei.board.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "board")
public class BoardDTO {
	private int boardNo;
	private String boardWriter;
	private String boardTitle;
	private String boardContent;
	private String boardDate;
	private String boardCategory;
	private int boardReadCount;
	private int boardStatus;
	private int boardType;
	private List<BoardFileDTO> fileList;
	private int[] delBoardFileNo;
}
