package kr.co.iei.faqboard.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "faqBoard")
public class FaqBoardDTO {
	private int faqBoardNo;
	private String faqBoardTitle;
	private String faqBoardContent;
	private String faqBoardWriter;
	private String faqWriteDate;
}
