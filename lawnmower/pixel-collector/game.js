var redAmounts = [];
var greenAmounts = [];
var blueAmounts = [];
var size = 1;
var money = 10;
var redPrice = 10;
var greenPrice = 25;
var bluePrice = 50;
var completions = 0;
var mps = 0;
var rainbowPixels = 0;

var redUPrice = 2;
var blueUPrice = 2;
var greenUPrice = 2;
var pixelSizePrice = 4;

var rn = 0;
var bn = 0;
var gn = 0;

var redTick = 1;
var greenTick = 3;
var blueTick = 5;
var pixelSize = 5;

function load(){
    if(localStorage.size != null){
        redAmounts = JSON.parse(localStorage.redAmounts);
        blueAmounts = JSON.parse(localStorage.blueAmounts);
        greenAmounts = JSON.parse(localStorage.greenAmounts);
        size = parseInt(localStorage.size);
        money = parseFloat(localStorage.money);
        redPrice = parseFloat(localStorage.redPrice);
        greenPrice = parseFloat(localStorage.greenPrice);
        bluePrice = parseFloat(localStorage.bluePrice);
        completions = parseInt(localStorage.completions);
        rainbowPixels = parseInt(localStorage.rainbowPixels);
        redUPrice = parseInt(localStorage.redUPrice);
        greenUPrice = parseInt(localStorage.greenUPrice);
        blueUPrice = parseInt(localStorage.blueUPrice);
        pixelSizePrice = parseInt(localStorage.pixelSizePrice);
        rn = parseInt(localStorage.rn);
        bn = parseInt(localStorage.bn);
        gn = parseInt(localStorage.gn);
        redTick = parseInt(localStorage.redTick);
        blueTick = parseInt(localStorage.blueTick);
        greenTick = parseInt(localStorage.greenTick);
        pixelSize = parseInt(localStorage.pixelSize);
    }
}

function save(){
    localStorage.redAmounts = JSON.stringify(redAmounts);
    localStorage.greenAmounts = JSON.stringify(greenAmounts);
    localStorage.blueAmounts = JSON.stringify(blueAmounts);
    localStorage.size = size;
    localStorage.money = money;
    localStorage.redPrice = redPrice;
    localStorage.greenPrice = greenPrice;
    localStorage.bluePrice = bluePrice;
    localStorage.completions = completions;
    localStorage.rainbowPixels = rainbowPixels;
    localStorage.redUPrice = redUPrice;
    localStorage.blueUPrice = blueUPrice;
    localStorage.greenUPrice = greenUPrice;
    localStorage.pixelSizePrice = pixelSizePrice;
    localStorage.rn = rn;
    localStorage.bn = bn;
    localStorage.gn = gn;
    localStorage.redTick = redTick;
    localStorage.blueTick = blueTick;
    localStorage.greenTick = greenTick;
    localStorage.pixelSize = pixelSize;
}

setInterval(save, 10000);

function prestige(add){
    redAmounts = [];
    greenAmounts = [];
    blueAmounts = [];
    size = 1;
    rn = 0;
    bn = 0;
    gn = 0;
    money = 10;
    redPrice = 10;
    greenPrice = 25;
    bluePrice = 50;
    if(add){
        rainbowPixels+= completions * completions;
    }
    completions = 0;
    mps = 0;
    start();
}

/*global localStorage*/

function start(){
    
    for(var x = 0; x < size; x++){
        console.log(x)
        redAmounts.push([]);
        greenAmounts.push([]);
        blueAmounts.push([]);
        for(var y = 0; y < size; y++){
            redAmounts[x].push(0);
            greenAmounts[x].push(0);
            blueAmounts[x].push(0);
        }
    }
    /*if(localStorage.red != null){
        redAmounts = JSON.parse(localStorage.red);
        greenAmounts = JSON.parse(localStorage.green);
        blueAmounts = JSON.parse(localStorage.blue);
    }*/
}

function first(){
    if(parseInt(localStorage.size) >= 1){
        load();
    }else{
        start();
    }
    setInterval(update, 100);
}

window.onload = first;

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function complete(){
    if((rOpen()) || (gOpen()) || (bOpen())){
        return false;
    }
    return true;
}

function rOpen(){
    for(var x = 0; x < size; x++){
        for(var y = 0; y < size; y++){
            if(redAmounts[x][y] < 255){
                return true;
            }
        }
    }
    return false;
}
function gOpen(){
    for(var x = 0; x < size; x++){
        for(var y = 0; y < size; y++){
            if(greenAmounts[x][y] < 255){
                return true;
            }
        }
    }
    return false;
}
function bOpen(){
    for(var x = 0; x < size; x++){
        for(var y = 0; y < size; y++){
            if(blueAmounts[x][y] < 255){
                return true;
            }
        }
    }
    return false;
}

function percentage(){
    
    var redTotal = 0;
    var greenTotal = 0;
    var blueTotal = 0;
    for(var x = 0; x < size; x++){
        for(var y = 0; y < size; y++){
            redTotal += redAmounts[x][y];
            greenTotal += greenAmounts[x][y];
            blueTotal += blueAmounts[x][y];
        }
    }
    return Math.floor((redTotal + greenTotal + blueTotal) / (3* 255 * size * size)*10000)/100;
    

}
function percentagered(){
    
    var redTotal = 0;

    for(var x = 0; x < size; x++){
        for(var y = 0; y < size; y++){
            redTotal += redAmounts[x][y];

        }
    }
    return Math.floor((redTotal) / (255 * size * size)*10000)/100;
}
function percentagegreen(){
    
    var greenTotal = 0;

    for(var x = 0; x < size; x++){
        for(var y = 0; y < size; y++){
            greenTotal += greenAmounts[x][y];

        }
    }
    return Math.floor((greenTotal) / (255 * size * size)*10000)/100;
}
function percentageblue(){
    
    var blueTotal = 0;

    for(var x = 0; x < size; x++){
        for(var y = 0; y < size; y++){
            blueTotal += blueAmounts[x][y];

        }
    }
    return Math.floor((blueTotal) / (255 * size * size)*10000)/100;
}

function update(){
    
    if(redAmounts.length == 0){
        redAmounts = [[0]];
        greenAmounts = [[0]];
        blueAmounts = [[0]];
        size = 1;
    }
    
    mps = rn * redTick + bn * blueTick + gn * greenTick;
    document.getElementById("rp").innerHTML = percentagered() + "%";
    document.getElementById("gp").innerHTML = percentagegreen() + "%";
    document.getElementById("bp").innerHTML = percentageblue() + "%";
    document.getElementById("red2").innerHTML = "Upgrade Red | " + redUPrice + "px";
    document.getElementById("green2").innerHTML = "Upgrade Green | " + greenUPrice + "px";
    document.getElementById("blue2").innerHTML = "Upgrade Blue | " + blueUPrice + "px";
    document.getElementById("pixelSize").innerHTML = "Pixel Size | " + pixelSizePrice + "px";
    
    document.getElementById("percent").innerHTML = percentage() + "%";
    document.getElementById("prestige").innerHTML = "You will earn " + (completions * completions) + " Rainbow Pixels if you prestige."
    document.getElementById("rainbow").innerHTML = "You have " + rainbowPixels + " Rainbow Pixel"
    money += mps * (1 + (rainbowPixels * 0.3)) / 10 ;
    document.getElementById("money").innerHTML = "$" + Math.floor(money);
    document.getElementById("red").innerHTML = "Buy R Pixel | $" + Math.floor(redPrice);
    document.getElementById("green").innerHTML = "Buy G Pixel | $" + Math.floor(greenPrice);
    document.getElementById("blue").innerHTML = "Buy B Pixel | $" + Math.floor(bluePrice);
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size , size);
    for(var x = 0; x < size; x++){
        for(var y = 0; y < size; y++){
            var hex = rgbToHex(redAmounts[x][y], greenAmounts[x][y], blueAmounts[x][y]);
            ctx.fillStyle = hex;
            ctx.fillRect(x * window.innerHeight / size, y * window.innerHeight / size, window.innerHeight / size + 1, window.innerHeight / size + 1);
        }
    }
    if(complete()){
        redAmounts = [];
        greenAmounts = [];
        blueAmounts = [];
        rn = 0;
        bn = 0;
        gn = 0;
        redPrice = 10;
        bluePrice = 50;
        greenPrice = 25;
        completions++;
        size+=1;
        money = 10;
        mps = 0;
        document.getElementById("red").style.color = "black";
        document.getElementById("green").style.color = "black";
        document.getElementById("blue").style.color = "black";
        start();
    }
}

function emptyRed(){
    var x = Math.floor(Math.random()*size);
    var y = Math.floor(Math.random()*size);
    while(redAmounts[x][y] >= 255){
        x = Math.floor(Math.random()*size);
        y = Math.floor(Math.random()*size);
    }
    return [x, y];
}
function emptyGreen(){
    var x = Math.floor(Math.random()*size);
    var y = Math.floor(Math.random()*size);
    while(greenAmounts[x][y] >= 255){
        x = Math.floor(Math.random()*size);
        y = Math.floor(Math.random()*size);
    }
    return [x, y];
}
function emptyBlue(){
    var x = Math.floor(Math.random()*size);
    var y = Math.floor(Math.random()*size);
    while(blueAmounts[x][y] >= 255){
        x = Math.floor(Math.random()*size);
        y = Math.floor(Math.random()*size);
    }
    return [x, y];
}
function buyRed(){
    if(document.getElementById("max").checked){
        while(money >= redPrice && rOpen()){
            money -= redPrice;
            redPrice = redPrice * 1.02;
            var pos = emptyRed();
            redAmounts[pos[0]][pos[1]] += pixelSize;
            redAmounts[pos[0]][pos[1]] = Math.min(redAmounts[pos[0]][pos[1]], 255);
            rn++;
            if(!rOpen()){
                document.getElementById("red").style.color = "red";
            }
        }
    }else{
        if(money >= redPrice && rOpen()){
            money -= redPrice;
            redPrice = redPrice * 1.02;
            var pos = emptyRed();
            redAmounts[pos[0]][pos[1]] += pixelSize;
            redAmounts[pos[0]][pos[1]] = Math.min(redAmounts[pos[0]][pos[1]], 255);
            rn++;
            if(!rOpen()){
                document.getElementById("red").style.color = "red";
            }
        }
    }
}
function buyGreen(){
    if(document.getElementById("max").checked){
        while(money >= greenPrice && gOpen()){
            money -= greenPrice;
            greenPrice = greenPrice * 1.02;
            var pos = emptyGreen();
            greenAmounts[pos[0]][pos[1]] += pixelSize;
            greenAmounts[pos[0]][pos[1]] = Math.min(greenAmounts[pos[0]][pos[1]], 255);
            gn++;
            if(!gOpen()){
                document.getElementById("green").style.color = "red";
            }
        }
    }else{
        if(money >= greenPrice && gOpen()){
            money -= greenPrice;
            greenPrice = greenPrice * 1.02;
            var pos = emptyGreen();
            greenAmounts[pos[0]][pos[1]] += pixelSize;
            greenAmounts[pos[0]][pos[1]] = Math.min(greenAmounts[pos[0]][pos[1]], 255);
            gn++;
            if(!gOpen()){
                document.getElementById("green").style.color = "red";
            }
        }
    }
}
function buyBlue(){
    if(document.getElementById("max").checked){
        while(money >= bluePrice && bOpen()){
            money -= bluePrice;
            bluePrice = bluePrice * 1.02;
            var pos = emptyBlue();
            blueAmounts[pos[0]][pos[1]] += pixelSize;
            blueAmounts[pos[0]][pos[1]] = Math.min(blueAmounts[pos[0]][pos[1]], 255);
            bn++;
            if(!bOpen()){
                document.getElementById("blue").style.color = "red";
            }
        }
    }else{
        if(money >= bluePrice && bOpen()){
            money -= bluePrice;
            bluePrice = bluePrice * 1.02;
            var pos = emptyBlue();
            blueAmounts[pos[0]][pos[1]] += pixelSize;
            blueAmounts[pos[0]][pos[1]] = Math.min(blueAmounts[pos[0]][pos[1]], 255);
            bn++;
            if(!bOpen()){
                document.getElementById("blue").style.color = "red";
            }
        }
    }
}

function upgradeRed(){
    if(rainbowPixels >= redUPrice){
        redTick++;
        rainbowPixels -= redUPrice;
        redUPrice *= 2;
    }
}
function upgradeGreen(){
    if(rainbowPixels >= greenUPrice){
        greenTick+=2;
        rainbowPixels -= greenUPrice;
        greenUPrice *= 2;
    }
}
function upgradeBlue(){
    if(rainbowPixels >= blueUPrice){
        blueTick+=3;
        rainbowPixels -= blueUPrice;
        blueUPrice *= 2;
    }
}

function pixelSizeUp(){
    if(rainbowPixels >= pixelSizePrice){
        pixelSize++;
        rainbowPixels -= pixelSizePrice;
        pixelSizePrice *= 2;
    }
}
