package kr.co.iei.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.user.model.dto.LoginUserDTO;
import kr.co.iei.user.model.dto.UserDTO;
import kr.co.iei.user.model.dto.VerifyInfoDTO;
import kr.co.iei.user.model.service.UserService;
import kr.co.iei.util.EmailSender;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/user")
public class UserController {
	
	@Autowired
	private UserService userService;
	@Autowired
	private EmailSender sender;
	
	@GetMapping(value="/checkEmail/{userEmail}")
	public ResponseEntity<Integer> checkEmail(@PathVariable String userEmail){
		int result = userService.checkEmail(userEmail);
		return ResponseEntity.ok(result);	
	}
	
	@PostMapping(value = "/verifyEmail/{userEmail}")
	public ResponseEntity<String> verifyEmail(@PathVariable String userEmail){
		String verifyToken = userService.sendVerificationCode(userEmail);
		return ResponseEntity.ok(verifyToken);	
	}
	
	@PostMapping(value = "/verifyCode")
	public ResponseEntity<Integer> verifyCode(@RequestBody VerifyInfoDTO verifyInfo){
		int result = userService.verifyCode(verifyInfo);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/checkNick/{userNick}")
	public ResponseEntity<Integer> checkNick(@PathVariable String userNick){
		int result = userService.checkNick(userNick);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping
	public ResponseEntity<Integer> joinUser(@RequestBody UserDTO user){
		int result = userService.joinUser(user);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value = "/login")
	public ResponseEntity<LoginUserDTO> login(@RequestBody UserDTO user){
		LoginUserDTO loginUser = userService.login(user);
		if(loginUser != null) {			
			return ResponseEntity.ok(loginUser);
		}else {
			return ResponseEntity.status(404).build();
		}
	}
	
	@PostMapping(value = "/refresh")
	public ResponseEntity<LoginUserDTO> refresh(@RequestHeader("Authorization") String token){
		LoginUserDTO loginUser = userService.refresh(token);
		if(loginUser != null) {
			return ResponseEntity.ok(loginUser);
		}else {
			return ResponseEntity.status(404).build();
		}
		
	}
	
	@PostMapping(value = "/api/naver")
	public ResponseEntity<LoginUserDTO> naverLogin(@RequestBody Map<String, String> authInfo){
		LoginUserDTO naverLoginUser = null;
		String accessToken = userService.getNaverAccessToken(authInfo);
		
		UserDTO naverUser = userService.naverUserInfo(accessToken);
		System.out.println("네이버 로그인 불러온 정보 : "+naverUser);
		int checkUser = userService.checkEmail(naverUser.getUserEmail());
		if(checkUser > 0 && naverUser.getSocialType().equals("naver")) {
			naverLoginUser = userService.socialLogin(naverUser);
			return ResponseEntity.ok(naverLoginUser);
		}else if(checkUser > 0 && !naverUser.getSocialType().equals("naver")){
			//다른 소셜 혹은 이메일로 가입한 회원
			return ResponseEntity.ok(naverLoginUser);
		}else {
			int result = userService.joinSocialUser(naverUser);
			if(result > 0) {
				naverLoginUser = userService.socialLogin(naverUser);
				System.out.println("네이버 로그인 유저 정보 : " + naverLoginUser);
				return ResponseEntity.ok(naverLoginUser);
			}
			return ResponseEntity.ok(naverLoginUser);
		}
		
	}
	
}
