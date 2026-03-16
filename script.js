(function(){

const API="https://script.google.com/macros/s/AKfycbyS5Ow_FZMgsluQUDKiYf2Nzz9odewnSj-U2zQfAmVT7c84HO2FpL1KQ2dZJBim6d6mSg/exec";

let site=document.currentScript.dataset.site || "default";

let chatBtn=document.createElement("div");
chatBtn.innerHTML="Chat";

chatBtn.style.position="fixed";
chatBtn.style.bottom="20px";
chatBtn.style.right="20px";
chatBtn.style.background="#000";
chatBtn.style.color="#fff";
chatBtn.style.padding="12px 18px";
chatBtn.style.borderRadius="20px";
chatBtn.style.cursor="pointer";
chatBtn.style.zIndex="9999";

document.body.appendChild(chatBtn);

let box=document.createElement("div");

box.style.position="fixed";
box.style.bottom="80px";
box.style.right="20px";
box.style.width="300px";
box.style.height="400px";
box.style.background="#fff";
box.style.borderRadius="10px";
box.style.boxShadow="0 0 15px rgba(0,0,0,0.2)";
box.style.display="none";
box.style.flexDirection="column";
box.style.zIndex="9999";

box.innerHTML=`

<div style="background:#000;color:#fff;padding:10px">
MuBChatPro
</div>

<div id="chatMessages"
style="flex:1;overflow:auto;padding:10px;height:300px">
</div>

<div style="display:flex;border-top:1px solid #eee">

<input id="chatInput"
style="flex:1;border:none;padding:10px"
placeholder="Type message">

<button id="sendBtn"
style="background:#000;color:#fff;border:none;padding:10px">
Send
</button>

</div>

`;

document.body.appendChild(box);

chatBtn.onclick=()=>{

box.style.display=
box.style.display==="none"
?"flex":"none";

};

function addMessage(text,type){

let div=document.createElement("div");

div.style.margin="5px 0";
div.style.padding="6px 8px";
div.style.borderRadius="6px";

if(type==="user"){
div.style.background="#007bff";
div.style.color="#fff";
div.style.textAlign="right";
}

if(type==="bot"){
div.style.background="#eee";
}

div.innerText=text;

document.getElementById("chatMessages").appendChild(div);

}

async function sendMessage(){

let input=document.getElementById("chatInput");

let text=input.value.trim();

if(!text) return;

addMessage(text,"user");

input.value="";

let res=await fetch(API,{
method:"POST",
body:JSON.stringify({
site:site,
name:"visitor",
phone:"",
question:text
})
});

let data=await res.json();

addMessage(data.reply || "OK","bot");

}

document
.getElementById("sendBtn")
.onclick=sendMessage;

})();
