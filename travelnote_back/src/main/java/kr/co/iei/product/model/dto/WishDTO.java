package kr.co.iei.product.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
//@Alias(value="wish")
public class WishDTO {
	private int wishNo;
	private int userNo;
	private int productNo;
}
