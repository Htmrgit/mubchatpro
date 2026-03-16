(function(){

let api="https://script.google.com/macros/s/AKfycbyS5Ow_FZMgsluQUDKiYf2Nzz9odewnSj-U2zQfAmVT7c84HO2FpL1KQ2dZJBim6d6mSg/exec";

let site=document.currentScript.dataset.site;

let name="";
let phone="";

let box=document.createElement("div");
box.innerHTML=`

<div id="mubchatbox">

<div id="mubheader">
MuBChatPro
<span>Powered by MarketingUB</span>
</div>

<div id="mubmessages"></div>

<div id="mubinput">

<input id="mubtext" placeholder="Type your question">
<button id="mubsend">Send</button>

</div>

</div>

<button id="mubtoggle">Chat</button>

`;

document.body.appendChild(box);

let toggle=document.getElementById("mubtoggle");
let chat=document.getElementById("mubchatbox");

toggle.onclick=()=>{

chat.style.display=
chat.style.display=="block"
?"none":"block";

};

let messages=document.getElementById("mubmessages");

function bot(msg){

messages.innerHTML+=
"<div class='bot'>"+msg+"</div>";

}

function user(msg){

messages.innerHTML+=
"<div class='user'>"+msg+"</div>";

}

async function send(q){

user(q);

let res=await fetch(api,{
method:"POST",
body:JSON.stringify({
site:site,
name:name,
phone:phone,
question:q
})
});

let data=await res.json();

bot(data.reply);

}

document
.getElementById("mubsend")
.onclick=()=>{

let q=document.getElementById("mubtext").value;

send(q);

};

bot("Hi 👋 Welcome! What is your name?");

})();