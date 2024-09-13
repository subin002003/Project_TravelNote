package kr.co.iei.Domestic.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PlaceDTO {

	private int placeNo;
	private String placeName;
	private String placeAddress;
	private String placeLatitude;
	private String placeLongitude;
	private int regionNo;
}
