package kr.co.iei.foreignPlan.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.foreignPlan.model.dao.ForeignPlanDao;

@Service
public class ForeignPlanService {
	@Autowired
	private ForeignPlanDao foreignPlanDao;
	
}
