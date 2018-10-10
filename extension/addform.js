export default function addForm(json,element,position){
		const html=`
		<a href="#bkmodal">
		Formodal
		</a>
		<div class="modal" id="bkmodal">
		<div class="modal-inner">
		<h5 class="modal-header modal-title">Post to Pounch
		<button class="modal-close">
		<span>&times</span>
		</button>
		</h5>
		<form id="bkfm" class="modal-body">
		</form>
		<div class="modal-footer">
		<button id="add">add</button>
		<button id="send">send</button>
		<button id="csv">csv</button>
		</div>
		</div>
		</div>`
		element.insertAdjacentHTML(position,html)
		const modal=document.querySelector("#bkmodal")
		const form=modal.querySelector("#bkfm")
		// json2form
		Object.entries(json).forEach(
			([key,val])=>{
				if (val != null){
					const item=`
					<label for=${key}>${key}:</label>
					<input name=${key} value="${val}">`
					form.insertAdjacentHTML("beforeend",item)
				}
			})
		// 自定义补充
		const add=modal.querySelector("#add")
		add.addEventListener("click",()=>{
			const kv=`
			<div>
			<input onchange="
			this.nextElementSibling.nextElementSibling.name=this.value
			">:</br>
			<input>
			</div>`
			form.insertAdjacentHTML("beforeend",kv)
		})
		// css show
		const toggle=document.querySelector("a[href='#bkmodal']")
		toggle.addEventListener("click",()=>{
			modal.classList.add("open-o")
		})
		// css close
		const close=modal.querySelector(".modal-close")
		close.addEventListener("click",()=>{
			modal.classList.remove("open-o")
		})
		// send formdata
		const send=modal.querySelector("#send")
		function form2json(formdata){
			let json={}
			for (const kv of formdata){
				json[kv[0]]=kv[1]
			}
			return json
		}
		send.addEventListener("click",()=>{
			let formdata=new FormData(form)
			browser.runtime.sendMessage(form2json(formdata))
		})
		// download csv
		function json2csv(json){
			let head=Object.keys(json).join(),
			row=Object.values(json).map(val=>
				typeof val == "string" && val.includes(",") ? val=`"${val}"` : val
			) // if contains ",",add ""
			let csv=encodeURI(`${head}\n${row}\n`),
			uri=`data:,${csv}`,
			a=document.createElement('a')
			//a.textContent="download csv"
			a.href=uri
			a.download=`${json.name}.csv`
			return a
		}
		const downloadEvent=new MouseEvent("click",{
			bubbles:true,
			cancelable:true,
			view:window
		}),
		csv=modal.querySelector("#csv")
		csv.addEventListener("click",()=>{
			let formdata=new FormData(form)
			json2csv(form2json(formdata)).dispatchEvent(downloadEvent)
		})

	}
