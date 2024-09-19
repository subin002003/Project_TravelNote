package kr.co.iei.Domestic.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "companion")
public class CompanionDTO {

	private int companionNo;
	private int itinearyNo;
	private int userNo;
}
