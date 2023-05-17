window.onload = setup;

var width = 500;
var height = 500;

var money = 0;
var totalMoney = 0;

var canvas;
var ctx;

var fields = [];

var nextMulch = 0;
var tileSizes = [50,25,20,10,5,4,2,1];

var maxGrowth = 15;

var mulch = 0;

var activeField;
var growthBonus = 0;

var currentPosition = 0;
var unlockedFields = 1;

var growthBasePrice = 10;

var speedBasePrice = 50;
var sizeBasePrice = 75;
var tileBasePrice = 150;

var tickBasePrice = 5;

var growthRateMultiplier = 1.2;
var tickBaseMultiplier = 1.2;
var mowerRateMultiplier = 2.5;
var mowerSizeMultiplier = 1.5;
var tileSizeMultiplier = 3.5;
var currentlyPrestiging = false;

function Area(name, multiplierBuff, initialBuff, baseColor, grownColor, machineColor, unlockPrice, message, value, machineName, hmm){
    
    this.baseColor = baseColor;
    this.grownColor = grownColor;
    this.message = message;
    this.whyDoIDoThis = hmm;
    this.upgrades = [
        new Upgrade("machineSpeed", speedBasePrice*initialBuff, mowerRateMultiplier+multiplierBuff, function(){activeField.machineSpeed++}, "%tpt% tiles/tick", "%name% Speed", function(){return activeField.machineSpeed<20;}),
        new Upgrade("machineSize", sizeBasePrice*initialBuff, mowerSizeMultiplier+multiplierBuff, function(){if(activeField.machineWidth==activeField.machineHeight){activeField.machineWidth++}else{activeField.machineHeight++}activeField.machineX=0;activeField.machineY=0;}, "%w%x%h%", "%name% Size", function(){console.log(activeField.machineHeight + " " + tileSizes[activeField.tileSize]); return activeField.machineHeight < height/tileSizes[activeField.tileSize];}),
        new Upgrade("tileSize", tileBasePrice*initialBuff, tileSizeMultiplier+multiplierBuff, function(){activeField.tileSize=Math.min(activeField.tileSize+1,tileSizes.length-1);activeField.regenerate();}, "%sz%x%sz%", "Tile Size", function(){return activeField.tileSize < tileSizes.length - 1;}),
        new Upgrade("growthRate", growthBasePrice*initialBuff, growthRateMultiplier+multiplierBuff, function(){activeField.growthAmount+=2;}, "%gr% growth/tick", "Growth Rate", function(){return activeField.growthAmount<60;}),
        new Upgrade("tickRate", tickBasePrice*initialBuff, tickBaseMultiplier+multiplierBuff, function(){activeField.tickRate=Math.max(1,Math.floor(activeField.tickRate*0.9));}, "%ms% ms", "Tick Rate", function(){return activeField.tickRate > 4;})
    ];
    
    this.machineName = machineName;
    this.superExtra = 0;
    this.superTicks = 0;
    this.name = name;
    this.lastTick;
    this.growthAmount = 4;
    this.machineX = 0;
    this.machineY = 0;
    this.value=value;
    this.machineWidth = 1;
    this.machineHeight = 1;
    this.machineSpeed = 1;
    this.machineGoingUp = false;
    this.machineColor = machineColor;
    this.totalMowed = 0;
    this.field = [];
    this.tileSize = 0;
    this.tickRate = 1000;
    this.unlockPrice=unlockPrice;
    this.generateField = function(){
        for(var i = 0; i < width/tileSizes[this.tileSize]; i++){
            this.field.push(new Array());
            for(var j = 0; j < height/tileSizes[this.tileSize]; j++){
                this.field[i].push(Math.floor(Math.random()*maxGrowth));
                updateTile(this, i, j);
            }
        }
        this.lastTick = +new Date();
    }
    this.unlockField = function(){
        if(money >= this.unlockPrice){
            money -= this.unlockPrice;
            unlockedFields++;
            currentPosition = unlockedFields-1;
            activeField = this;
            this.generateField();
            tick(this);
        }
    }
    
    this.getUpgradeText = function(upgrade){
        return upgrade.displayText.replace("%tpt%", this.machineSpeed).replace("%w%", this.machineWidth).replace("%h%", this.machineHeight).replace(/%sz%/g, width/tileSizes[this.tileSize]).replace("%ms%", this.tickRate).replace("%gr%", this.growthAmount);
    }
    
    this.regenerate = function(){
        this.field = [];
        this.generateField();
    }
    
    this.machineTick = function(){
        var currentTime = +new Date();
        var timeDifference = currentTime - this.lastTick;
        this.lastTick = currentTime;
        this.superExtra += timeDifference - this.tickRate;
        if(this.superExtra > this.tickRate * 5){
            this.superTicks += Math.floor(this.superExtra / 5 / this.tickRate);
            this.superExtra %= this.tickRate  * 5;
        }
        for(var i  = 0; i < this.machineSpeed; i++){
            var cX = this.machineX;
            var cY = this.machineY;
            for(var x = 0; x < this.machineWidth; x++){
                for(var y = 0; y < this.machineHeight; y++){
                    var tX = x + cX;
                    var tY = y + cY;
                    if(this.field[tX][tY] >= 5){
                        this.field[tX][tY]=0;
                        money+=this.value*(this.superTicks>0?5:1)*(1+mulch/100);
                        totalMoney+=this.value*(this.superTicks>0?5:1)*(1+mulch/100);
                        this.superTicks = Math.max(0, this.superTicks-1);
                        this.totalMowed++;
                        
                        
                    }
                    if(activeField == this)
                            updateTile(this, tX,tY);
                }
            }
            if(activeField == this)
                document.getElementById("totalMowed").innerHTML = this.message + this.totalMowed;
            updateMoney();
            if(this.goingUp){
                if(this.machineY > 0){
                    this.machineY--;
                }else{
                    if(this.machineX >= width / tileSizes[this.tileSize]-this.machineWidth){
                        this.goingUp=false;
                        this.machineX = 0;
                        this.machineY = 0;
                    }else{
                        this.machineX=Math.min(this.machineX + this.machineWidth, width / tileSizes[this.tileSize]-this.machineWidth);
                        this.goingUp = false;
                    }
                }
            }else{
                if(this.machineY < height / tileSizes[this.tileSize]-this.machineHeight){
                    this.machineY++;
                }else{
                    if(this.machineX >= width / tileSizes[this.tileSize]-this.machineWidth){
                        this.goingUp=false;
                        this.machineX = 0;
                        this.machineY = 0;
                    }else{
                        this.machineX=Math.min(this.machineX + this.machineWidth, width / tileSizes[this.tileSize]-this.machineWidth);
                        this.goingUp = true;
                    }
                }
            }
            if(activeField==this){
                ctx.fillStyle = this.machineColor;
                ctx.fillRect(this.machineX *tileSizes[this.tileSize],this.machineY*tileSizes[this.tileSize],tileSizes[this.tileSize]*this.machineWidth,tileSizes[this.tileSize]*this.machineHeight);
            }
            
        }
    }
    
    this.growthTick = function(){

        var x = Math.floor(Math.random()*width/tileSizes[this.tileSize]);
        var y = Math.floor(Math.random()*height/tileSizes[this.tileSize]);
        if(this.field[x][y]<maxGrowth){
            
            this.field[x][y]=Math.min(maxGrowth, this.field[x][y]+1+growthBonus);
        }
        if(activeField == this)
            updateTile(this, x, y);
    }
    
}

function Upgrade(name, price, multiplier, onBuy, displayText, displayName, canBuy){
    this.name = name;
    this.displayName = displayName;
    this.price = price;
    this.multiplier = multiplier;
    this.displayText = displayText;
    this.buyUpgrade = function(){
        if(canBuy() && money >= this.price){
            money -= this.price;
            onBuy();
            this.price = Math.floor(this.price*this.multiplier);
            updateText();
            updateMoney();
        }
    }
    this.canBuy=canBuy;
}

function upgrade(name){
    getUpgrade(activeField, name).buyUpgrade();
}

function getField(name){
    for(var i = 0; i < fields.length; i++){
        if(fields[i].name == name)
            return fields[i];
    }
    return fields[0];
}

function getUpgrade(field, name){
    for(var i = 0; i < field.upgrades.length; i++){
        if(field.upgrades[i].name==name){
            return field.upgrades[i];
        }
    }
    return field.upgrades[0];
}

function next(){
    if(currentPosition < unlockedFields - 1){
        currentPosition++;
        activeField = fields[currentPosition];
        updateText();
        for(var x = 0; x < activeField.field.length; x++){
            for(var y = 0; y < activeField.field[0].length; y++){
                updateTile(activeField, x, y);
            }
        }
    }
    document.getElementById("desc").innerHTML = activeField.whyDoIDoThis;
    
}

function previous(){
    if(currentPosition > 0){
        currentPosition--;
        activeField = fields[currentPosition];
        updateText();
        for(var x = 0; x < activeField.field.length; x++){
            for(var y = 0; y < activeField.field[0].length; y++){
                updateTile(activeField, x, y);
            }
        }
    }
    document.getElementById("desc").innerHTML = activeField.whyDoIDoThis;
}

function unlockNext(){
    if(unlockedFields < fields.length){
        fields[unlockedFields].unlockField();
        if(unlockedFields == fields.length){
            document.getElementById("unlock").innerHTML = "All Fields Unlocked";
        }else{
            document.getElementById("unlock").innerHTML = "Unlock " + fields[unlockedFields].name + " Field for $" + fields[unlockedFields].unlockPrice;
        }
        updateText();
        
    }
    document.getElementById("desc").innerHTML = activeField.whyDoIDoThis;
}

function updateText(){
    var field = activeField;
    var name = field.name;
    for(var j = 0; j < field.upgrades.length; j++){
        
        var upgrade = field.upgrades[j];
        document.getElementById("upgrade" + upgrade.name).innerHTML = (upgrade.canBuy() ? "Upgrade " + upgrade.displayName.replace("%name%", activeField.machineName) + " - $" + upgrade.price : "MAXED");
        document.getElementById("text" + upgrade.name).innerHTML = field.getUpgradeText(upgrade);
        
        
    }
    document.getElementById("totalMowed").innerHTML = activeField.message + activeField.totalMowed;


}

function buyUpgrade(upgradeName){
    getUpgrade(activeField,upgradeName).buyUpgrade();
}

function tick(field){
    for(var i = 0; i < field.growthAmount; i++){
        
        field.growthTick();
        
    }
    
    field.machineTick();
    if(!currentlyPrestiging){
        setTimeout(function(){tick(field);}, field.tickRate);
    }
    
}



function updateMoney(){
    document.getElementById("money").innerHTML = "$" + Math.floor(money);
    if(activeField.superTicks > 0){
        document.getElementById("superTicks").innerHTML = "Super Ticks: " + activeField.superTicks;
    }else{
        document.getElementById("superTicks").innerHTML = "";
    }
}

function addFields(){
    fields.push(new Area("Grass", 0, 1, [0,210,0], [0,130,0], "rgb(255,0,0)", 0, "Total Grass Mowed: ", 1, "Lawnmower", "Wow this lawn grows fast."));
    fields.push(new Area("Dirt", 0.15, 10, [175, 175, 175], [122, 96, 0], "rgb(68, 130, 206)", 100000, "Total Dirt Vacuumed: ", 5, "Vacuum", "Vroom, vroom"));
    fields.push(new Area("Weed", 0.25, 50, [239, 233, 112], [145,233,124], "rgb(255,127,0)", 1000000, "Total Weeds Whacked: ", 20, "Weed Whacker", "Good thing you don't need to keep replacing the trimming stuff."));
    fields.push(new Area("Pumpkin", 0.35, 100, [181, 155, 105], [255, 188, 61], "rgb(119, 119, 119)", 10000000, "Total Pumpkins Thwacked: ", 50, "Harvester", "For when you can't find the hippogriff."));
    fields.push(new Area("Tree", 0.45, 500, [122, 81, 0], [54, 109, 0], "rgb(97, 175, 191)", 100000000, "Total Trees Chopped: ", 100, "Chainsaw", "No, it's only for trees."));
    fields.push(new Area("Fire", 0.55, 1000, [255,0,0],[255,255,0],"rgb(0,0,255)", 1000000000, "Total Fires Extinguished: ", 200, "Wave", "I'm impressed that you know how to create a wave out of thin air."));
    fields.push(new Area("Stone", 0.65, 5000, [255,255,255],[124, 124, 124],"rgb(122, 73, 33)", 10000000000, "Total Stone Mined: ", 500, "Wooden Pickaxe", "I swear this one's not a reference to anything."));
    fields.push(new Area("Iron", 0.75, 10000, [124, 124, 124],[221, 206, 193],"rgb(100, 100, 100)", 100000000000, "Total Iron Mined: ", 1000, "Stone Pickaxe", "Nor is this one."));
    fields.push(new Area("Diamond", 0.85, 50000, [124, 124, 124], [124, 239, 228], "rgb(221, 206, 193)", 1000000000000, "Total Diamonds Mined: ", 2000, "Iron Pickaxe", "Ok - last one I swear."));
    fields.push(new Area("Gold", 0.95, 100000, [138, 202, 216], [211, 176, 0], "rgb(143, 158, 139)", 10000000000000, "Total Gold Panned: ", 5000, "Pan", "There's no rush ;)"));
    fields.push(new Area("People", 0.65, 5000, [255, 67, 50], [255, 211, 168], "rgb(100, 100, 100)", 100000000000000, "Total People Killed: ", 10000, "Terminator", "I'll be back"));
}

function setup(){
    canvas = document.getElementById("lawn");
    ctx = canvas.getContext('2d');
    
    addFields();
    activeField = fields[0];
    activeField.generateField();
    ctx.fillStyle = "green";
    tick(activeField);
    updateText(activeField);
    setInterval(updatePrestigeValues, 500);
    
}

function updatePrestigeValues(){
    calculateGrowthBonus();
    nextMulch =Math.floor(Math.max(0, Math.pow(Math.max(0, totalMoney/10 - 7500), 0.575)-mulch));
    document.getElementById("mulch").innerHTML = "Mulch: " + mulch;
    document.getElementById("prestigeButton").innerHTML = "Prestige for " + nextMulch + " Mulch";
    document.getElementById("valueBonus").innerHTML = "Current Value Bonus: " + mulch + "%";
    document.getElementById("growthBonus").innerHTML = "Current Growth Bonus: " + (growthBonus+1) + "x";
}

function calculateGrowthBonus(){
    growthBonus = Math.floor(Math.log(Math.max(1,mulch))/Math.log(15));
}

function attemptPrestige(){
    if(nextMulch > 0){
        currentlyPrestiging = true;
        setTimeout(reset, 2000);
        
    }
}

function reset(){
    mulch += nextMulch;
    money = 0;
    totalMoney = 0;
    
    
    fields = [];
    addFields();
    activeField = fields[0];
    activeField.generateField();
    ctx.fillStyle = "green";
    currentPosition = 0;
    unlockedFields = 1;
    currentlyPrestiging = false;
    tick(activeField);
    updateText(activeField);
    
}

function updateTile(field, x, y){
    
    var ratio = field.field[x][y]/maxGrowth;
    
    var r = field.baseColor[0]+Math.round(ratio*(field.grownColor[0]-field.baseColor[0]));
    var g = field.baseColor[1]+Math.round(ratio*(field.grownColor[1]-field.baseColor[1]));
    var b = field.baseColor[2]+Math.round(ratio*(field.grownColor[2]-field.baseColor[2]));
    
    ctx.fillStyle = "rgb("+r+","+g+","+b+")";
    ctx.fillRect(x*tileSizes[field.tileSize], y*tileSizes[field.tileSize], tileSizes[field.tileSize], tileSizes[field.tileSize]);
    
}