package kr.co.iei.foreignPlan.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ForeignPlanDao {

	List selectRegionList(int startNum, int endNum);

}
