package kr.co.iei.pay.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.pay.model.dao.PayDao;

@Service
public class PayService {
	@Autowired
	private PayDao payDao;
}
