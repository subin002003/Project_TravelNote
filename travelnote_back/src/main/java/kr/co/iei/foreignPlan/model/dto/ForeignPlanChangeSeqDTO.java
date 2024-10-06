package kr.co.iei.foreignPlan.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="foreignPlanChangeSeq")
public class ForeignPlanChangeSeqDTO {
	private int planNo;
	private int itineraryNo;
	private int planDay;
	private int planSeq;
}
