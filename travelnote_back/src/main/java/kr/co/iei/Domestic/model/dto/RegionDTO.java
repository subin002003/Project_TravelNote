package kr.co.iei.Domestic.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RegionDTO {
	private int regionNo;
	private String regionName;
	private String countryName;
}
