package kr.co.iei.foreignPlan.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.foreignPlan.model.dao.ForeignPlanDao;
import kr.co.iei.foreignPlan.model.dto.ForeignRegionDTO;

@Service
public class ForeignPlanService {
	@Autowired
	private ForeignPlanDao foreignPlanDao;

	// 여행지 목록 6개씩 조회
	public List selectRegionList(int reqPage, String searchInput) {
		int itemNum = 6;
		int endNum = reqPage * itemNum;
		int startNum = endNum - itemNum + 1;
		List list = foreignPlanDao.selectRegionList(startNum, endNum, searchInput);
		return list;
	}
	
	// 여행지 정보 조회
	public ForeignRegionDTO selectOneRegion(int regionNo) {
		ForeignRegionDTO region = foreignPlanDao.selectOneRegion(regionNo);
		return region;
	}

}
