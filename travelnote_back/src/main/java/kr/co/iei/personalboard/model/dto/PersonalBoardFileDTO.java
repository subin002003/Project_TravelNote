package kr.co.iei.personalboard.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.Data;

import lombok.AllArgsConstructor;

import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "personalBoardFile")
public class PersonalBoardFileDTO {
	private int personalBoardFileNo;
	private int personalBoardNo;
	private String personalBoardFilename;
	private String personalBoardFilepath;
}
