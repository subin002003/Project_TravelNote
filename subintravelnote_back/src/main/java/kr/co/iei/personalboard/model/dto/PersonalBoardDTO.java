package kr.co.iei.personalboard.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "personalBoard")
public class PersonalBoardDTO {
	private int personalBoardNo;
	private String personalBoardTitle;
	private String personalBoardContent;
	private String personalBoardWriter;
	private String personalBoardWriteDate;
	private String personalBoardAnswerDate;
	private String personalBoardStatus;
	private List<PersonalBoardFileDTO> personalBoardFileList;
	private int[] delPersonalBoardFileNo;
}
