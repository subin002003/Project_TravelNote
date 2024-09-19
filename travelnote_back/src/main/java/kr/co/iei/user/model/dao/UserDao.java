package kr.co.iei.user.model.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserDao {

	int checkEmail(String userEmail);

}
