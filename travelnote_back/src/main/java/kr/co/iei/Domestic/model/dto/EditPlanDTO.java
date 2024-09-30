package kr.co.iei.Domestic.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EditPlanDTO {
	private int planNo;
	private String planTime;
	private String planMemo;
}
