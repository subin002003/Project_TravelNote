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
	private String userEmail;
	private int productNo;
	private String orderDate;
	private String startDate;
	private String endDate;
	private int people;
	private int price;
	private int paymentType;
	
	//내 예약 정보에서 사용하기 위한 변수들 추가 (오건하 2024-10-04)
	private String productName;
	private String userNick;
	private String productThumb;
	private String buyerName;
	private String buyerPhone;
	private String sellerNick;
	private String sellerPhone;
}
