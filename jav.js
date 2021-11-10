// ==UserScript==
// @name        JavID����
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

/*������һҳ�Ƿ�����һҳ
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
      items=$('div.grid-item'),pNum=$(selectors.current).text().trim();
  if (arguments.length!=0){
    items=$(arguments[0]).find('div.grid-item'),pNum=$(arguments[0]).find(selectors.current).text().trim()
  }
  items.each(( index, element )=>{
    let id=$(element).find('div.uid').text().trim(),
        meta=$(element).find('div.meta').text().trim();
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

$("<button id='jsonDown'>����json</button>").appendTo($(".title"));
const downloadEvent=new MouseEvent("click",{
			bubbles:true,
			cancelable:true,
			view:window
		}),
json=document.querySelector("#jsonDown");
json.addEventListener("click",()=>{
  List().then(lt=>list2a(JSON.stringify(lt)).dispatchEvent(downloadEvent))
});

