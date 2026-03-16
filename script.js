let btn=document.createElement("button");

btn.innerText="Chat";

btn.style.position="fixed";
btn.style.bottom="20px";
btn.style.right="20px";
btn.style.padding="12px 18px";
btn.style.background="black";
btn.style.color="white";
btn.style.borderRadius="20px";

document.body.appendChild(btn);

btn.onclick=function(){
alert("MuBChatPro Chatbot Demo");
};
