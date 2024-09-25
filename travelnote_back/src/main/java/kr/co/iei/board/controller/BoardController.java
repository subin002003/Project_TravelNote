package kr.co.iei.board.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.dto.BoardFileDTO;
import kr.co.iei.board.model.service.BoardService;
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
	
	@GetMapping(value = "/list/{reqPage}")
	public ResponseEntity<Map> list(@PathVariable int reqPage){
		//조회결과는 게시물목록, pageNavi생성 시 필요한 데이터들
		Map map = boardService.selectBoardList(reqPage);
		return ResponseEntity.ok(map);
	}
	@PostMapping(value="/editorImage")//formData()로 데이터를 보내면 @ModelAttribute로 받음 
	public ResponseEntity<String> editorImage (@ModelAttribute MultipartFile image){
		String savepath = root + "/editor/";
		String filepath = fileUtil.upload(savepath, image);
		return ResponseEntity.ok("/editor/"+filepath);
	}
	
	@PostMapping
	public ResponseEntity<Boolean> insertBoard(@ModelAttribute BoardDTO board,@ModelAttribute MultipartFile[] boardFile){
		
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
	
	@GetMapping(value = "/boardNo/{boardNo}")
	public ResponseEntity<BoardDTO> selectOneBoard(@PathVariable int boardNo){
		BoardDTO board = boardService.selectOneBoard(boardNo);
		return ResponseEntity.ok(board);
	}
	
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
}
























