package kr.co.iei.pay.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.pay.model.dto.PayDTO;
import kr.co.iei.util.PageInfo;

@Mapper
public interface PayDao {

	int selectOneUser(String userEmail);
	
	int payment(PayDTO pay);
	
	//오건하 작성 2024-10-04
	int myReservationTotalCount(String userNick);

	//오건하 작성 2024-10-04
	List selectMyReservation(PageInfo pi);

	//오건하 작성 2024-10-04
	PayDTO reservationInfo(int orderNo);

	//오건하 작성 2024-10-04
	int myPaymentTotalCount(String userNick);
	
	//오건하 작성 2024-10-04
	List myPaymentList(PageInfo pi);
	
	//오건하 작성 2024-10-06
	PayDTO getPaymentInfo(int orderNo);

}
