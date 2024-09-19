package kr.co.iei.foreignPlan.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.foreignPlan.model.dao.ForeignPlanDao;

@Service
public class ForeignPlanService {
	@Autowired
	private ForeignPlanDao foreignPlanDao;

	public List selectRegionList(int reqPage) {
		int itemNum = 6;
		int endNum = reqPage * itemNum;
		System.out.println(endNum);
		int startNum = endNum - itemNum + 1;
		System.out.println(startNum);
		List list = foreignPlanDao.selectRegionList(startNum, endNum);
		return list;
	}
	
}
