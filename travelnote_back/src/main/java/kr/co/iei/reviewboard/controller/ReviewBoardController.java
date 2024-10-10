package kr.co.iei.reviewboard.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import kr.co.iei.reviewboard.model.dto.ReviewBoardCommentDTO;
import kr.co.iei.reviewboard.model.dto.ReviewBoardDTO;
import kr.co.iei.reviewboard.model.dto.ReviewBoardFileDTO;
import kr.co.iei.reviewboard.model.service.ReviewBoardService;
import kr.co.iei.user.model.dto.UserDTO;
import kr.co.iei.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping("/reviewBoard")
public class ReviewBoardController {
	@Autowired
	private ReviewBoardService reviewBoardService;
	
	@Autowired
	private FileUtils fileUtil;
	
	@Value("${file.root}")
	public String root;
	
	// 게시물 전체 조회
	@GetMapping(value = "/list/{reqPage}")
	public ResponseEntity<Map> list(@PathVariable int reqPage){
		//조회결과는 게시물목록, pageNavi생성 시 필요한 데이터들
		Map map = reviewBoardService.selectReviewBoardList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	// 게시물 검색 조회
	@GetMapping(value = "/search/{reqPage}")
	public ResponseEntity<Map> searchlist(@PathVariable int reqPage,  // URL 경로에서 페이지 번호 받기
											@RequestParam String searchTerm, // 쿼리 파라미터에서 검색어 받기
	        								@RequestParam String searchFilter) // 쿼리 파라미터에서 필터 타입 받기)
	{
		// 조회결과는 게시물 목록과 pageNavi 생성 시 필요한 데이터들
		Map<String, Object> map = reviewBoardService.selectReviewBoardSearchList(reqPage, searchTerm, searchFilter);
	    return ResponseEntity.ok(map); // 결과를 JSON 형식으로 반환
	}
	
	// 한 게시물 상세보기
	@GetMapping(value = "/reviewBoardNo/{reviewBoardNo}")
	public ResponseEntity<ReviewBoardDTO> selectOneReviewBoard(@PathVariable int reviewBoardNo){
		ReviewBoardDTO reviewBoard = reviewBoardService.selectOneReviewBoard(reviewBoardNo);
		return ResponseEntity.ok(reviewBoard);
	}
	
	// 조회수
	@GetMapping("/view/{reviewBoardNo}")
	public ReviewBoardDTO getReviewBoard(@PathVariable int reviewBoardNo) {
		// 조회수를 증가시키고 게시판 정보를 반환
		reviewBoardService.incrementViewCount(reviewBoardNo);
		return reviewBoardService.getReviewBoardById(reviewBoardNo);
	}
	
	// 토스트에디터에서 이미지 삽입
	@PostMapping(value="/editorImage")//formData()로 데이터를 보내면 @ModelAttribute로 받음 
	public ResponseEntity<String> editorImage (@ModelAttribute MultipartFile image){
		String savepath = root + "/editor/";
		String filepath = fileUtil.upload(savepath, image);
		return ResponseEntity.ok("/editor/"+filepath);
	}
	
	// 게시물 등록
	@PostMapping
	public ResponseEntity<Boolean> insertReviewBoard(@ModelAttribute ReviewBoardDTO reviewBoard,@ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] reviewBoardFile){
		if(thumbnail != null) {
			String savepath = root + "/reviewBoard/thumb/";
			String filepath = fileUtil.upload(savepath, thumbnail);
			reviewBoard.setReviewBoardThumbNail(filepath);
		}
		
		List<ReviewBoardFileDTO> reviewBoardFileList = new ArrayList<ReviewBoardFileDTO>();
		if(reviewBoardFile != null) {
			String savepath = root+"/reviewBoard/";
			for(MultipartFile file : reviewBoardFile) {
				ReviewBoardFileDTO fileDTO = new ReviewBoardFileDTO();
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.upload(savepath, file);
				fileDTO.setFilename(filename);
				fileDTO.setFilepath(filepath);
				reviewBoardFileList.add(fileDTO);
			}
		}
		int result = reviewBoardService.insertReviewBoard(reviewBoard, reviewBoardFileList);
		return ResponseEntity.ok(result == 1+reviewBoardFileList.size());
	}
	
	// 파일 다운로드
	@GetMapping(value="/file/{reviewBoardFileNo}")
	public ResponseEntity<Resource> filedown(@PathVariable int reviewBoardFileNo) throws FileNotFoundException{
		ReviewBoardFileDTO reviewBoardFile = reviewBoardService.getReviewBoardFile(reviewBoardFileNo);
		String savepath = root+"/reviewBoard/";
		File file = new File(savepath+reviewBoardFile.getFilepath());
		
		Resource resource = new InputStreamResource(new FileInputStream(file));
		//파일다운로드를 위한 헤더 설정
		HttpHeaders header = new HttpHeaders();
		//header.add("Content-Disposition", "attachment; fileName=\""+boardFile.getFilename()+"\""); //파일명 한글이면 에러발생
		header.add("Cache-Control","no-cache, no-store, must-revalidate");
		header.add("Pragma", "no-cache");
		header.add("Expires", "0");
		
		return ResponseEntity
				.status(HttpStatus.OK)
				.headers(header)
				.contentLength(file.length())
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.body(resource);
	}
	
	// 게시물 삭제
	@DeleteMapping(value="/{reviewBoardNo}")
	public ResponseEntity<Integer> deleteReviewBoard(@PathVariable int reviewBoardNo){
		List<ReviewBoardFileDTO> delFileList = reviewBoardService.deleteReviewBoard(reviewBoardNo);
		if(delFileList != null) {
			String savepath = root+"/reviewBoard/";
			for(ReviewBoardFileDTO reviewBoardFile :delFileList) {
				File delFile = new File(savepath + reviewBoardFile.getFilepath());
				delFile.delete();
			}
			return ResponseEntity.ok(1);
		}else {
			return ResponseEntity.ok(0);
		}
	}
	
	// 게시물 수정
	@PatchMapping
	public ResponseEntity<Boolean> updateReviewBoard(@ModelAttribute ReviewBoardDTO reviewBoard,
												@ModelAttribute MultipartFile thumbnail,
												@ModelAttribute MultipartFile[] reviewBoardFile){
		
		if(thumbnail != null) {
			String savepath = root + "/reviewBoard/thumb/";
			String filepath = fileUtil.upload(savepath, thumbnail);
			reviewBoard.setReviewBoardThumbNail(filepath);
		}
		List<ReviewBoardFileDTO> reviewBoardFileList = new ArrayList<ReviewBoardFileDTO>();
		if(reviewBoardFile != null) {
			String savepath = root+"/reviewBoard/";
			for(MultipartFile file : reviewBoardFile) {
				ReviewBoardFileDTO reviewBoardFileDTO = new ReviewBoardFileDTO();
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.upload(savepath, file);
				reviewBoardFileDTO.setFilename(filename);
				reviewBoardFileDTO.setFilepath(filepath);
				reviewBoardFileDTO.setReviewBoardNo(reviewBoard.getReviewBoardNo());
				reviewBoardFileList.add(reviewBoardFileDTO);
			}
		}
		List<ReviewBoardFileDTO> delFileList = reviewBoardService.updateReviewBoard(reviewBoard,reviewBoardFileList);
		if(delFileList != null) {
			String savepath = root+"/reviewBoard/";
			for(ReviewBoardFileDTO deleteFile : delFileList) {
				File delFile = new File(savepath + deleteFile.getFilepath());
				delFile.delete();
			}
			return ResponseEntity.ok(true);
		}else {
			return ResponseEntity.ok(false);
		}
	}
	
	// 좋아요
	@PostMapping("/like/{reviewBoardNo}")
    public ResponseEntity<Map<String, Object>> toggleLike(
    	@PathVariable int reviewBoardNo,
    	@RequestBody Map<String, String> requestBody){
		String userNick = requestBody.get("userNick");
		String action = requestBody.get("action");
        boolean success = false;
        String message = "";
        if ("add".equals(action)) {
            success = reviewBoardService.addLike(userNick, reviewBoardNo);
            message = success ? "좋아요 추가 성공" : "좋아요 추가 실패";
        } else if ("remove".equals(action)) {
            success = reviewBoardService.removeLike(userNick, reviewBoardNo);
            message = success ? "좋아요 제거 성공" : "좋아요 제거 실패";
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
	
	// 특정 사용자의 좋아요 상태 조회
    @GetMapping("/like/{reviewBoardNo}")
    public ResponseEntity<Map<String, Object>> checkLikeStatus(
            @PathVariable int reviewBoardNo,
            @RequestParam String userNick) {
        boolean liked = reviewBoardService.checkLikeStatus(userNick, reviewBoardNo);
        Map<String, Object> response = new HashMap<>();
        response.put("liked", liked);
        return ResponseEntity.ok(response);
    }
	
	
	
	// 댓글 등록
	@PostMapping("/{reviewBoardNo}/comments")
	public ResponseEntity<String> addComment(@PathVariable int reviewBoardNo, @RequestBody ReviewBoardCommentDTO comment) {
		comment.setReviewBoardRef(reviewBoardNo);
		reviewBoardService.addComment(comment);
		return ResponseEntity.status(HttpStatus.CREATED).body("Comment added successfully");
	}

	// 댓글 목록 조회
    @GetMapping("/{reviewBoardNo}")
    public ResponseEntity<List<ReviewBoardCommentDTO>> getComments(@PathVariable int reviewBoardNo) {
        List<ReviewBoardCommentDTO> comments = reviewBoardService.getComments(reviewBoardNo);
        return ResponseEntity.ok(comments);
    }
	
    // 댓글 삭제
    @DeleteMapping("/{reviewBoardNo}/comments/{commentNo}")
    public ResponseEntity<String> deleteComment(@PathVariable int reviewBoardNo, @PathVariable int commentNo) {
        reviewBoardService.deleteComment(commentNo);
        return ResponseEntity.ok("Comment deleted successfully");
    }
	
    // 댓글 수정
    @PutMapping("/{reviewBoardNo}/comments/{commentNo}")
    public ResponseEntity<String> updateComment(@PathVariable int reviewBoardNo, @PathVariable int commentNo, @RequestBody ReviewBoardCommentDTO reviewBoardCommentDTO) {
        reviewBoardService.updateComment(reviewBoardNo, commentNo, reviewBoardCommentDTO);
        return ResponseEntity.ok("Update success");
    }
	
	// 신고
	@PostMapping("/report/{reviewBoardNo}")
	public ResponseEntity<String> reviewBoardViewReport(@RequestBody UserDTO userDTO, @PathVariable int reviewBoardNo){
	   String userNick = userDTO.getUserNick();
	   reviewBoardService.reviewBoardViewReport(userNick, reviewBoardNo);
	   return ResponseEntity.ok("Report Success");
	}
}




































