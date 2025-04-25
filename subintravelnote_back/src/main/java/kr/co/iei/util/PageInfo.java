package kr.co.iei.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PageInfo {
	private int start;
	private int end;
	private int pageNo;
	private int pageNaviSize;
	private int totalPage;
	private String userNick;
	
	public PageInfo(int start, int end, int pageNo, int pageNaviSize, int totalPage) {
		super();
		this.start = start;
		this.end = end;
		this.pageNo = pageNo;
		this.pageNaviSize = pageNaviSize;
		this.totalPage = totalPage;
	}
	
}
