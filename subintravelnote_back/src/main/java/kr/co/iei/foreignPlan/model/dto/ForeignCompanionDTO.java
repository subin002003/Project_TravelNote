package kr.co.iei.foreignPlan.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="foreginCompanion")
public class ForeignCompanionDTO {
	private int companionNo;
	private int itineraryNo;
	private int userNo;
}
