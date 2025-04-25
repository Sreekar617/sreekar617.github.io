let isNew=false;
let id=localStorage.getItem("session");
console.log(`id=${id}`);
if (id==null) {
  isNew=true;
  let newId = ( typeof self.crypto !== "undefined" && typeof self.crypto.randomUUID !== "undefined" ? "uuid:"+self.crypto.randomUUID() : "rand:"+Math.floor(Math.random()*10000000).toString());
  console.log(newId);
  localStorage.setItem("session",newId);
  console.log("set session token");
  id=newId;
}

let count=0;
let start=Date.now();
while (Date.now()-start<1000)
  count++;
console.log(count);

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-L6VPS22YJG');

// if (false)
fetch(`https://home.calschwick.net/analytics/submit?type=sreekar-website&url=${encodeURIComponent(window.location)}&token=${encodeURIComponent(id)}&new=${isNew?1:0}&count=${count}`, {

  method: "POST",

}).then(res => {

  console.log("Request complete! response:", res);

});