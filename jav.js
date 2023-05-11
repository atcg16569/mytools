// ==UserScript==
// @name        JavID下载
// @namespace   jenhao-js
// @include     /https:\/\/javdb\d*\.com\/lists\/*/
// @grant       none
// @run-at      document-end
// @version     1.0
// @author      Jenhao
// @description download jav id list
// ==/UserScript==
const head={headers:{'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml'}},
      pagecss={title:".title>span[class*='name']",pages:'.pagination-link',current:'.is-current'},
      moviecss={item:"div.item",id:".video-title>strong",date:"div.meta"};

var page={current:document.querySelector(pagecss.current),pages:document.querySelectorAll(pagecss.pages),title:document.querySelector(pagecss.title)},
    current2last=[],currentIndex;
for(let entry of page.pages.entries()) {
  if(entry[1]==page.current){
    currentIndex=entry[0];
  }
  if(entry[0]>currentIndex){
    current2last.push(entry[1]);
  }
}

function Movies(){
  let mp=[],
      movies=document.querySelectorAll(moviecss.item),
      pNum;
  if(page.current==null){
    pNum=1
  }else{
    pNum=page.current.textContent.trim()
  }
  if (arguments.length!=0){
    movies=arguments[0].querySelectorAll(moviecss.item),pNum=arguments[0].querySelector(pagecss.current).textContent.trim();
  }
  for(let mItem of movies.values()){
    let id=mItem.querySelector(moviecss.id).textContent.trim(),
        date=mItem.querySelector(moviecss.date).textContent.trim();
    mp.push({id:id,date:date})
  }
  return {page:pNum,movies:mp}
}
function reqNext(url){
  let nextFetch=new Promise(resolve=>{
    setTimeout(resolve,getRandomArbitrary(1, 10)*1000,
               fetch(url,head).then(response => response.text())
               .then(html => new DOMParser().parseFromString(html, 'text/html'))
               .then(doc => Movies(doc))
              )
  });
  return nextFetch
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function c2lMovieList(){
  let cMovies=Movies(),totalList=[];
  totalList.push(cMovies);//当前页
  if(current2last.length!=0){
    current2last.forEach(p=>totalList.push(reqNext(p.href))
               );
  }
  return Promise.all(totalList)
}
//c2lMovieList().then(console.log);

function title(total){
  let title;
  if (current2last.length==0){
    title=`${page.title.textContent.trim()}_${total}.json`;
  }else{
    title=`${page.title.textContent.trim()}_${total}p${page.current.textContent.trim()}-${current2last[current2last.length-1].textContent.trim()}.json`;
  }
	return title
}
function list2a(listString,total){
  let uri=`data:,${listString}`,
  a=document.createElement('a');
  //a.textContent="download json";
  a.href=uri;
  a.download=title(total);
	return a
}
page.title.insertAdjacentHTML('afterend',"<button id='jsonDown'>下载json</button>");

const downloadEvent=new MouseEvent("click",{
			bubbles:true,
			cancelable:true,
			view:window
		}),
json=document.querySelector("#jsonDown");
json.addEventListener("click",()=>{
  c2lMovieList().then(lt=>{
    let total=0;
    lt.forEach(p=>{
      total=total+p.movies.length;
    });
    list2a(JSON.stringify(lt),total).dispatchEvent(downloadEvent);
    console.log(total);
  })
});


// ==UserScript==  
// @name         dbsearch  
// @namespace    https://viayoo.com/  
// @version      0.1  
// @run-at       document-end  
// @match        https://javdb*.com/lists/*  
// @match        https://javdb*.com/users/list*  
// @include      /https:\/\/www\.javbus\.com\/.+-.+/  
// @grant        none  
// ==/UserScript==  
var appendlocation="a.box",idlocation="div.video-title>strong";  
  
if (location.hostname.match("users")!=null){  
    appendlocation="div.item";  
};  
if (location.hostname=="www.javbus.com"){  
    appendlocation=".info";  
    idlocation=".info>p:nth-child(1)>span:nth-child(2)";  
};  
  
function search(url,id){  
    let a=document.createElement("a");  
    a.href = url.link.replace('$id',id);  
    a.target="_blank";  
    a.style="margin-right:15px;";  
    a.innerText = `${url.title}.${id}`;  
    return a;  
};  
  
const netflav = {title : "netflav", link : "https://netflav.com/search?type=code&keyword=$id"},  
    jable = {title : "jable", link : "https://jable.tv/search/$id/"},  
    javhd={title:"javhd",link:"https://javhd.today/search/video/?s=$id"};  
  
try{  
    let boxs = document.querySelectorAll(appendlocation);  
    for (var box of boxs){  
        let id = box.querySelector(idlocation).innerText;  
        box.append(search(netflav,id),search(jable,id),search(javhd,id));  
    };  
}catch(e){  
    alert(e);  
};
