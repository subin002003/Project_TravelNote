package kr.co.iei.personalboard.model.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PersonalBoardDao {

	int totalCount(String userNick);

}
