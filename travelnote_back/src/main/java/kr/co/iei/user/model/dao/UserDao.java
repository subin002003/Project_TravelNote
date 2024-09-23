package kr.co.iei.user.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.user.model.dto.UserDTO;

@Mapper
public interface UserDao {

	int checkEmail(String userEmail);

	int checkNick(String userNick);

	int joinUser(UserDTO user);

	UserDTO selectOneUser(String userEmail);

	int joinSocialUser(UserDTO naverUser);

	String findEmail(UserDTO user);

	int changePw(UserDTO user);

	UserDTO selectUserInfo(String userEmail);

}
