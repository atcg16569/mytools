const hostname=window.location.hostname
switch (hostname) {
	case "www.amazon.com":
		const device=$("script:contains('deviceType')").text()
		const dev=JSON.parse(device)
		if (dev.deviceType=="mobile"){
			let authName,
				authorEle=$("a[href*='/ref=mw_dp_a_']")
			if (authorEle.length>1){
				let names=[]
				authorEle.find("span.a-text-bold").each(
					(ind,ele)=>names.push($(ele).text())
				)
				authName=names.join()
			}
			else{
				authName=authorEle.text()
			}
			const json={
				"author":authName,
				"ISBN":$("th:contains('ISBN-13')+td").text(),
				"name":$("h1#title").text(),
				"pubdate":$("th:contains('Publication date')+td:first").text(),
				"publisher":$("th:contains('Publisher')+td:first").text()
			}
		}
		else{

		}
		break
	case "book.douban.com":
		const url=`https://api.douban.com/v2/book/${window.location.pathname.match(/\d+/)[0]}`
		function getJson(url){
			let req=new XMLHttpRequest(),
			json={}
			req.open("GET",url)
			req.setRequestHeader("Content-Type","application/json")
			req.onload=(res)=>{
				if (res.status==200){
					json=JSON.parse(res.responseText)
				}
			}
			req.send()
			return json
		}
		break
	case "www.goodreads.com":
		break
	case "m.douban.com":
		break
	default:
}
