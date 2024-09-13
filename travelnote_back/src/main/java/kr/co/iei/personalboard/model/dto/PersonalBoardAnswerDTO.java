package kr.co.iei.personalboard.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "personalBoardAnswer")
public class PersonalBoardAnswerDTO {
	private int personalBoardNo;
	private String personalBoardAnswerContent;
	private String personalBoardAnswerWriter;
}
