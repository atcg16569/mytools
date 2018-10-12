export default function text(str){
	const nodeText=(node)=>{
		let nodeType=node.nodeType,
			ret=""
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) { 
			if ( typeof node.textContent === "string" ) { 
				return node.textContent; 
			} 
			else { 
				// Traverse its children 
				for ( node = node.firstChild; node; node = node.nextSibling ) { 
					ret += nodeText( node ); 
				} 
			}
		}
		else if ( nodeType === 3 || nodeType === 4 ) { 
			return node.nodeValue; 
		}
		return ret
	}

	let list=document.querySelectorAll(str),
		ret=""
	for (let item of list){
		ret+=nodeText(item)
	}
	return ret
}
