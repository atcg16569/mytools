// ==UserScript==
// @name        JavID下载
// @namespace   jenhao-js
// @include     /https:\/\/javdb\d*\.com\/lists\/*/
// @grant       none
// @version     1.0
// @author      Jenhao
// @description download jav id list
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// ==/UserScript==
const host=`${location.protocol}//${location.hostname}`,
      head={headers:{'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml'}},
      selectors={name:".title>span[class*='name']",pages:'.pagination-link',current:'.is-current'};

/*检测最后一页是否含有下一页
function checkNext(url){
  return fetch(url,head).then(response => response.text())
    .then(html => new DOMParser().parseFromString(html, 'text/html'))
    .then(doc => {
      let next_a=$(doc).find(selectors.next);
      if(next_a){
        return next_a.attr('href')
      }else{
        return false
      }
    })
}
*/
let current=$(selectors.current),pages=$(selectors.pages),name=$(selectors.name).text().trim(),
    c2l=$(selectors.pages).map((index,page)=>{
      if(index>current.index(selectors.pages)){
        return page;
      }
    }).get();

function Movies(){
  let movies=[],
      // listCSS=".movie-list",
      itemCSS="div.item",
      idCSS=".video-title>strong",
      dateCSS="div.meta",
      list=$(itemCSS),
      pNum=$(selectors.current).text().trim();
  if (arguments.length!=0){
    list=$(arguments[0]).find(itemCSS),pNum=$(arguments[0]).find(selectors.current).text().trim()
  }
  list.each(( index, element )=>{
    let id=$(element).find(idCSS).text().trim(),
        meta=$(element).find(dateCSS).text().trim();
    movies.push({id:id,date:meta})
  });
  return {page:pNum,movies:movies}
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

function List(){
  let cMovies=Movies(),list=[];
  list.push(cMovies);
  if(c2l.length!=0){
    c2l.forEach(p=>list.push(reqNext(p.href))
               );
  }
  return Promise.all(list)
}
//List().then(console.log);
function list2a(list){
  let uri=`data:,${list}`,
  a=document.createElement('a');
  //a.textContent="download json";
  a.href=uri;
  if (c2l.length==0){
    a.download=`${name}.json`;
  }else{
    a.download=`${name}_p${current.text().trim()}-${c2l[c2l.length-1].textContent.trim()}.json`;
  }
	return a
}

$("<button id='jsonDown'>下载json</button>").appendTo($(".title"));
const downloadEvent=new MouseEvent("click",{
			bubbles:true,
			cancelable:true,
			view:window
		}),
json=document.querySelector("#jsonDown");
json.addEventListener("click",()=>{
  List().then(lt=>{
    list2a(JSON.stringify(lt)).dispatchEvent(downloadEvent);
    let total=0;
    lt.forEach(p=>{
      total=total+p.movies.length;
    });
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
// @grant        none
// ==/UserScript==
var appendlocation="a.box",
    idlocation="div.video-title>strong";

if (location.hostname.match("users")!=null){
	appendlocation="div.item";
};

function search(url,id){
	let a=document.createElement("a");
	a.href = url.link.replace('$id',id);
	a.target="_blank";
	a.style="margin:0 auto;";
	a.innerText = `${url.title}.${id}`;
	let br = document.createElement("br");
	a.appendChild(br);
	return a;
};

const netflav = {title : "netflav", link : "https://netflav.com/search?type=code&keyword=$id"},
      jable = {title : "jable", link : "https://jable.tv/search/$id/"};

try{
	let boxs = document.querySelectorAll(appendlocation);
	for (var box of boxs){
		let id = box.querySelector(idlocation).innerText;
		let netflavA = search(netflav,id),jableA = search(jable,id);
		box.append(netflavA);
		box.append(jableA);
	};
}catch(e){
	alert(e);
};
