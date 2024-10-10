package kr.co.iei.user.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.user.model.dto.UserDTO;
import kr.co.iei.util.PageInfo;

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

	int checkPhone(String userPhone);

	int updateUser(UserDTO user);

	int deleteUser(String userEmail);

	int checkBusinessRegNo(String businessRegNo);

	int selectUserByEmail(String memberEmail);
	
	UserDTO selectUserEmail(String email);

	List selectReportUserList(PageInfo pi);

	int reportUserTotalCount();

	int suspendUser(String userEmail);

}
