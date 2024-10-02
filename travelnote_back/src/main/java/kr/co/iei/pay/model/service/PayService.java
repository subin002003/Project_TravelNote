package kr.co.iei.pay.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.pay.model.dao.PayDao;
import kr.co.iei.pay.model.dto.PayDTO;

@Service
public class PayService {
	@Autowired
	private PayDao payDao;

	@Transactional
	public int payment(PayDTO pay) {
		int result = payDao.payment(pay);
		return result;
	}
}
