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

import jakarta.servlet.http.HttpServletRequest;
import kr.co.iei.Domestic.model.service.DomesticService;
import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.foreignPlan.model.service.ForeignPlanService;
import kr.co.iei.pay.model.dto.PayDTO;
import kr.co.iei.pay.model.service.PayService;
import kr.co.iei.product.model.service.ProductService;
import kr.co.iei.reviewboard.model.service.ReviewBoardService;
import kr.co.iei.user.model.dto.LoginUserDTO;
import kr.co.iei.user.model.dto.UserDTO;
import kr.co.iei.user.model.dto.VerifyInfoDTO;
import kr.co.iei.user.model.service.UserService;
import kr.co.iei.util.EmailSender;
import kr.co.iei.util.JwtUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/user")
public class UserController {
	
	@Autowired
	private JwtUtils jwtUtil;
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
	@Autowired
	private ReviewBoardService reviewBoardService;

	
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
		if(user.getUserType() == 0 && user.getUserName().equals( user.getUserNick())) {
			user.setUserType(2);
		}
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
	
	@GetMapping(value = "/checkToken")
	public ResponseEntity<LoginUserDTO> checkToken(HttpServletRequest request){
		 String token = request.getHeader("Authorization").substring(7);
		 if (jwtUtil.validateToken(token)) {
		        LoginUserDTO loginUser = jwtUtil.checkToken(token);
		        return ResponseEntity.ok(loginUser);
		    } else {
		        return ResponseEntity.ok(null);
		    }
	}
	
	@PostMapping(value = "/api/naver")
	public ResponseEntity<LoginUserDTO> naverLogin(@RequestBody Map<String, String> authInfo){
		LoginUserDTO naverLoginUser = null;
		String accessToken = userService.getNaverAccessToken(authInfo);
		
		UserDTO naverUser = userService.naverUserInfo(accessToken);
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
		String userNick = userService.getNick(token);
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
	
	@GetMapping(value = "/paymentInfo/{orderNo}")
	public ResponseEntity<PayDTO> paymentInfo(@PathVariable int orderNo){
		PayDTO paymentInfo = payService.getPaymentInfo(orderNo);
		return ResponseEntity.ok(paymentInfo);
	}
	
	@GetMapping(value = "/myWish/{userNick}/{reqPage}")
	public ResponseEntity<Map> myWish(@PathVariable String userNick, @PathVariable int reqPage){
		Map map = productService.getMyWish(userNick, reqPage);
		return ResponseEntity.ok(map);
	}
	
	@GetMapping(value= "/myReviewBoardList/{userNick}/{reviewBoardReqPage}")
	public ResponseEntity<Map> myReviewBoardList(@PathVariable String userNick, @PathVariable int reviewBoardReqPage){
		Map map = reviewBoardService.myReviewBoardList(userNick, reviewBoardReqPage);
		return ResponseEntity.ok(map);
	}
	
	@GetMapping(value = "/myTravel/{userNick}/{reqPage}")
	public ResponseEntity<Map> myTravel(@PathVariable String userNick, @PathVariable int reqPage){
		Map map = userService.myTravel(userNick, reqPage);
		return ResponseEntity.ok(map);
	}
	
	@GetMapping(value = "/shareTravelList/{userNick}/{reqPage}")
	public ResponseEntity<Map> shareTravelList(@PathVariable String userNick, @PathVariable int reqPage){
		Map map = userService.shareTravelList(userNick, reqPage);
		return ResponseEntity.ok(map);
	}
	
	@PatchMapping(value = "/suspendUser/{userEmail}")
	public ResponseEntity<Integer> suspendUser(@PathVariable String userEmail){
		int result = userService.suspendUser(userEmail);
		return ResponseEntity.ok(result);
	}
	
}
