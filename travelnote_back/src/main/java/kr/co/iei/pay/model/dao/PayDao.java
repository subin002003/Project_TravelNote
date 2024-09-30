package kr.co.iei.pay.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.pay.model.dto.PayDTO;

@Mapper
public interface PayDao {

	int selectOneUser(String userEmail);
	
	int payment(PayDTO pay);

}
