window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-L6VPS22YJG');


fetch(`https://home.calschwick.net/analytics/submit?type=sreekar-website&url=${encodeURIComponent(window.location)}`, {

  method: "POST",

}).then(res => {

  console.log("Request complete! response:", res);

});