package kr.co.iei.product.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.product.model.dao.ProductDao;
import kr.co.iei.util.PageInfo;
import kr.co.iei.util.PageUtil;

@Service
public class ProductService {
	@Autowired
	private ProductDao productDao;
	
	@Autowired
	private PageUtil pageUtil;

	public Map selectProductList(int reqPage) {
		// 게시물 조회 및 페이징에 필요한 데이터를 모두 취합
		int numPerPage = 12;						// 한 페이지당 출력할 상품 갯수
		int pageNaviSize = 7;						// 페이지네비 길이
		int totalCount = productDao.totalCount();	// 전체 상품 수
		// 페이징에 필요한 값들을 연산해서 객체로 리턴받음
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = productDao.selectProductList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi", pi);
		return map;
	}
}
