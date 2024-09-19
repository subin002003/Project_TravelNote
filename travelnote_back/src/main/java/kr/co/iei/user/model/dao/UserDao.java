package kr.co.iei.user.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.user.model.dto.UserDTO;

@Mapper
public interface UserDao {

	int checkEmail(String userEmail);

	int checkNick(String userNick);

	int joinUser(UserDTO user);

}
