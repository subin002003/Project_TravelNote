package kr.co.iei.pay.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.pay.model.dao.PayDao;
import kr.co.iei.pay.model.dto.PayDTO;
import kr.co.iei.util.PageInfo;
import kr.co.iei.util.PageUtil;

@Service
public class PayService {
	@Autowired
	private PayDao payDao;
	@Autowired
	private PageUtil pageUtil;
	
	@Transactional
	public int payment(PayDTO pay) {
		int result = payDao.payment(pay);
		return result;
	}

	//오건하 작성 2024-10-04
	public Map myReservation(String userNick, int reqPage) {
		int numPerPage = 5;
		int pageNaviSize = 5;
		int totalCount = payDao.myReservationTotalCount(userNick);
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		pi.setUserNick(userNick);
		List list = payDao.selectMyReservation(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi",pi);
		return map;
	}
	
	//오건하 작성 2024-10-04
	public PayDTO reservationInfo(int orderNo) {
		PayDTO reservationInfo = payDao.reservationInfo(orderNo);
		return reservationInfo;
	}
}
