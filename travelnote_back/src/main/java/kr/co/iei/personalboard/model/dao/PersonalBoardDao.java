package kr.co.iei.personalboard.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.personalboard.model.dto.PersonalBoardDTO;
import kr.co.iei.personalboard.model.dto.PersonalBoardFileDTO;

@Mapper
public interface PersonalBoardDao {

	int totalCount(String userNick);

	int insertPersonalBoard(PersonalBoardDTO personalBoard);

	int insertPersonalBoardFile(PersonalBoardFileDTO personalBoardFile);

}
