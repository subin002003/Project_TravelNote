package kr.co.iei.pay.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="pay")
public class PayDTO {
	private int orderNo;
	private int userNo;
	private int productNo;
	private String orderDate;
	private String startDate;
	private String endDate;
	private int people;
	private int price;
	private int paymentType;
}
