package kr.co.iei.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.pay.model.dto.PayDTO;
import kr.co.iei.pay.model.service.PayService;
import kr.co.iei.product.model.service.ProductService;
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
	@Autowired
	private BoardService boardService;
	@Autowired
	private ProductService productService;
	@Autowired
	private PayService payService;
	
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
	
	@GetMapping(value = "/checkPhone/{userPhone}")
	public ResponseEntity<Integer> checkPhone(@PathVariable String userPhone){
		int result = userService.checkPhone(userPhone);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping
	public ResponseEntity<Integer> joinUser(@RequestBody UserDTO user){
		System.out.println("가입한 유저 정보 : "+user);
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
	
	@PostMapping(value = "/findEmail")
	public ResponseEntity<String> findEmail(@RequestBody UserDTO user){
		String findEmail = userService.findUser(user);
		if(findEmail == null) {
			return ResponseEntity.ok("X");
		}
		return ResponseEntity.ok(findEmail);
	}
	
	@PatchMapping(value = "/changePw")
	public ResponseEntity<Integer> changePw(@RequestBody UserDTO user){
		int result = userService.changePw(user);
		
		return ResponseEntity.ok(result);
	}
	
	@GetMapping
	public ResponseEntity<UserDTO> userInfo(@RequestHeader("Authorization") String token){
		UserDTO userInfo = userService.userInfo(token);
		return ResponseEntity.ok(userInfo);
	}

	@PatchMapping
	public ResponseEntity<Integer> updateUser(@RequestBody UserDTO user){
		int result = userService.updateUser(user);
		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping
	public ResponseEntity<Integer> deleteUser(@RequestHeader("Authorization") String token){
		int result = userService.deleteUser(token);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/getNick")
	public ResponseEntity<String> getNick(@RequestHeader("Authorization") String token){
		System.out.println("유저닉네임 가져오기 실행");
		System.out.println("토큰" + token);
		String userNick = userService.getNick(token);
		System.out.println("userNick 출력 : "+userNick);
		return ResponseEntity.ok(userNick);
	}
	
	@GetMapping(value = "/checkBusinessRegNo/{businessRegNo}")
	public ResponseEntity<Integer> checkBusinessRegNo(@PathVariable String businessRegNo){
		int result = userService.checkBusinessRegNo(businessRegNo);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/myBoardList/{userNick}/{boardReqPage}")
	public ResponseEntity<Map> myBoardList(@PathVariable String userNick,@PathVariable int boardReqPage){
		Map map = boardService.selectMyBoardList(userNick, boardReqPage);
		return ResponseEntity.ok(map);
	}
	
	@GetMapping(value = "/myReviewList/{userNick}/{reqPage}")
	public ResponseEntity<Map> myReviewList(@PathVariable String userNick, @PathVariable int reqPage){
		Map map = productService.myReviewList(userNick, reqPage);
		System.out.println("리뷰 리스트 : "+map.get("list"));
		return ResponseEntity.ok(map);
	}
	
	@GetMapping(value = "/myReservation/{userNick}/{reqPage}")
	public ResponseEntity<Map> myReservation(@PathVariable String userNick, @PathVariable int reqPage){
		Map map = payService.myReservation(userNick, reqPage);
		return ResponseEntity.ok(map);
	}
	
	@GetMapping(value = "/reservationInfo/{orderNo}")
	public ResponseEntity<PayDTO> reservationInfo(@PathVariable int orderNo){
		PayDTO reservationInfo = payService.reservationInfo(orderNo);
		return ResponseEntity.ok(reservationInfo);
	}
	
	@GetMapping(value = "/myProduct/{userNick}/{reqPage}")
	public ResponseEntity<Map> myProduct(@PathVariable String userNick, @PathVariable int reqPage){
		Map map = productService.myProduct(userNick, reqPage);
		return ResponseEntity.ok(map);
	}
	
	@GetMapping(value = "/myPayment/{userNick}/{reqPage}")
	public ResponseEntity<Map> myPayment(@PathVariable String userNick, @PathVariable int reqPage){
		Map map = payService.myPayment(userNick, reqPage);
		return ResponseEntity.ok(map);
	}
}
