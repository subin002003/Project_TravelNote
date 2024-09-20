package kr.co.iei.Domestic.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface DomesticDao {

	List getAllRegions(int startNum, int endNum);

}