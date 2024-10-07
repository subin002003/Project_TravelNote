package kr.co.iei.api.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RegionInfoDTO {
	private String contactRemark;
	private String continentName;
	private String countryName;
	private String wrtDate;
}
