package kr.co.iei.board.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.type.Alias;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

import kr.co.iei.board.model.dto.BoardCommentDTO;
import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.dto.BoardFileDTO;

import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.user.model.dto.UserDTO;
import kr.co.iei.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping("/board")
public class BoardController {
	@Autowired
	private BoardService boardService;
	
	@Autowired
	private FileUtils fileUtil;
	
	@Value("${file.root}")
	public String root;
	
	
	// 게시물 전체 조회
	@GetMapping(value = "/list/{reqPage}")
	public ResponseEntity<Map> list(@PathVariable int reqPage){
		//조회결과는 게시물목록, pageNavi생성 시 필요한 데이터들
		Map map = boardService.selectBoardList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	// 게시물 검색 조회
	@GetMapping(value = "/search/{reqPage}")
	public ResponseEntity<Map> searchlist(@PathVariable int reqPage,  // URL 경로에서 페이지 번호 받기
											@RequestParam String searchTerm, // 쿼리 파라미터에서 검색어 받기
	        								@RequestParam String searchFilter) // 쿼리 파라미터에서 필터 타입 받기)
	{
		// 조회결과는 게시물 목록과 pageNavi 생성 시 필요한 데이터들
		Map<String, Object> map = boardService.selectBoardSearchList(reqPage, searchTerm, searchFilter);
	    return ResponseEntity.ok(map); // 결과를 JSON 형식으로 반환
	}
	
	
	// 한 게시물 상세보기
	@GetMapping(value = "/boardNo/{boardNo}")
	public ResponseEntity<BoardDTO> selectOneBoard(@PathVariable int boardNo){
		BoardDTO board = boardService.selectOneBoard(boardNo);
		return ResponseEntity.ok(board);
	}
	
	// 조회수
	@GetMapping("/view/{boardNo}")
	public BoardDTO getBoard(@PathVariable int boardNo) {
		// 조회수를 증가시키고 게시판 정보를 반환
		boardService.incrementViewCount(boardNo);
		return boardService.getBoardById(boardNo);
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
	public ResponseEntity<Boolean> insertBoard(@ModelAttribute BoardDTO board, @ModelAttribute MultipartFile[] boardFile){
		
		List<BoardFileDTO> boardFileList = new ArrayList<BoardFileDTO>();
		if(boardFile != null) {
			String savepath = root+"/board/";
			for(MultipartFile file : boardFile) {
				BoardFileDTO fileDTO = new BoardFileDTO();
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.upload(savepath, file);
				fileDTO.setFilename(filename);
				fileDTO.setFilepath(filepath);
				boardFileList.add(fileDTO);
			}
		}
		int result = boardService.insertBoard(board, boardFileList);
		return ResponseEntity.ok(result == 1+boardFileList.size());
	}
	
	
	// 파일 다운로드
	@GetMapping(value="/file/{boardFileNo}")
	public ResponseEntity<Resource> filedown(@PathVariable int boardFileNo) throws FileNotFoundException{
		BoardFileDTO boardFile = boardService.getBoardFile(boardFileNo);
		String savepath = root+"/board/";
		File file = new File(savepath+boardFile.getFilepath());
		
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
	@DeleteMapping(value="/{boardNo}")
	public ResponseEntity<Integer> deleteBoard(@PathVariable int boardNo){
		List<BoardFileDTO> delFileList = boardService.deleteBoard(boardNo);
		if(delFileList != null) {
			String savepath = root+"/board/";
			for(BoardFileDTO boardFile :delFileList) {
				File delFile = new File(savepath + boardFile.getFilepath());
				delFile.delete();
			}
			return ResponseEntity.ok(1);
		}else {
			return ResponseEntity.ok(0);
		}
	}
	
	// 게시물 수정
	@PatchMapping
	public ResponseEntity<Boolean> updateBoard(@ModelAttribute BoardDTO board,
												@ModelAttribute MultipartFile[] boardFile){
		
		List<BoardFileDTO> boardFileList = new ArrayList<BoardFileDTO>();
		if(boardFile != null) {
			String savepath = root+"/board/";
			for(MultipartFile file : boardFile) {
				BoardFileDTO boardFileDTO = new BoardFileDTO();
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.upload(savepath, file);
				boardFileDTO.setFilename(filename);
				boardFileDTO.setFilepath(filepath);
				boardFileDTO.setBoardNo(board.getBoardNo());
				boardFileList.add(boardFileDTO);
			}
		}
		List<BoardFileDTO> delFileList = boardService.updateBoard(board,boardFileList);
		if(delFileList != null) {
			String savepath = root+"/board/";
			for(BoardFileDTO deleteFile : delFileList) {
				File delFile = new File(savepath + deleteFile.getFilepath());
				delFile.delete();
			}
			return ResponseEntity.ok(true);
		}else {
			return ResponseEntity.ok(false);
		}
	}
	
	// 좋아요
	@PostMapping("/like/{boardNo}")
    public ResponseEntity<Map<String, Object>> toggleLike(
    	@PathVariable int boardNo,
    	@RequestBody Map<String, String> requestBody){
		String userNick = requestBody.get("userNick");
		String action = requestBody.get("action");
        boolean success = false;
        String message = "";
        if ("add".equals(action)) {
            success = boardService.addLike(userNick, boardNo);
            message = success ? "좋아요 추가 성공" : "좋아요 추가 실패";
        } else if ("remove".equals(action)) {
            success = boardService.removeLike(userNick, boardNo);
            message = success ? "좋아요 제거 성공" : "좋아요 제거 실패";
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
	
	
	
	// 댓글 등록
	@PostMapping("/{boardNo}/comments")
	public ResponseEntity<String> addComment(@PathVariable int boardNo, @RequestBody BoardCommentDTO comment) {
		comment.setBoardRef(boardNo);
		boardService.addComment(comment);
		return ResponseEntity.status(HttpStatus.CREATED).body("Comment added successfully");
	}

	// 댓글 조회
    @GetMapping("/{boardNo}")
    public ResponseEntity<List<BoardCommentDTO>> getComments(@PathVariable int boardNo) {
        List<BoardCommentDTO> comments = boardService.getComments(boardNo);
        return ResponseEntity.ok(comments);
    }
	
    //댓글 삭제
    @DeleteMapping("/{boardNo}/comments/{commentNo}")
    public ResponseEntity<String> deleteComment(@PathVariable int boardNo, @PathVariable int commentNo) {
        boardService.deleteComment(commentNo);
        return ResponseEntity.ok("Comment deleted successfully");
    }
    
    // 댓글 수정
    @PutMapping("/{boardNo}/comments/{commentNo}")
    public ResponseEntity<String> updateComment(@PathVariable int boardNo, @PathVariable int commentNo, @RequestBody BoardCommentDTO boardCommentDTO) {
        boardService.updateComment(boardNo, commentNo, boardCommentDTO);
        return ResponseEntity.ok("Update success");
    }
    
   // 신고
   @PostMapping("/report/{boardNo}")
   public ResponseEntity<String> boardViewReport(@RequestBody UserDTO userDTO, @PathVariable int boardNo){
	   String userNick = userDTO.getUserNick();
	   boardService.boardViewReport(userNick, boardNo);
	   return ResponseEntity.ok("Report Success");
   }
   
  
   	
}
























