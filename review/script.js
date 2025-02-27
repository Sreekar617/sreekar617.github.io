// call me luigi cuz i make spaghetti

// advanced words
// chars = ["家","学校","饭店","商店","医院","火车站","中国","北京","上","下","前面","后面","里","今天","明天","昨天","上午","中午","下午","年","月","日","星期","点","分钟","现在","时候","爸爸","妈妈","儿子","女儿","老师","学生","同学","朋友","医生","先生","小姐","衣服","水","菜","米饭","水果","苹果","茶","杯子","钱","飞机","出租车","电视","电脑","电影","天气","猫","狗","东西","人","名字","书","汉语","字","桌子","椅子"];
// pinyin = ["jiā", "xuéxiào", "fàndiàn", "shāngdiàn", "yīyuàn", "huǒchēzhàn", "zhōngguó", "běijīng", "shàng", "xià", "qiánmiàn", "hòumiàn", "lǐmiàn", "jīntiān", "míngtiān", "zuótiān", "shàngwǔ", "zhōngwǔ", "xiàwǔ", "nián", "yuè", "rì", "xīngqī", "diǎn", "fēnzhōng", "xiànzài", "shíhou", "bàba", "māma", "érzi", "nǚér", "lǎoshī", "xuéshēng", "tóngxué", "péngyou", "yīshēng", "xiānsheng", "xiǎojiě", "yīfu", "shuǐ", "cài", "mǐfàn", "shuǐguǒ", "píngguǒ", "chá", "bēizi", "qián", "fēijī", "chūzūchē", "diànshì", "diànnǎo", "diànyǐng", "tiānqì", "māo", "gǒu", "dōngxi", "rén", "míngzi", "shū", "hànyǔ", "zì", "zhuōzi", "yǐzi"];

// charsets
chars1 = ["家", "学校", "中国", "北京", "上", "下", "今天", "明天", "昨天", "年", "月", "日", "星期", "点", "爸爸", "妈妈", "儿子", "女儿", "老师", "学生", "同学", "朋友", "医生", "先生", "小姐", "衣服", "水", "菜", "米饭", "水果", "苹果", "茶", "杯子", "钱", "飞机", "出租车", "电视", "电脑", "电影", "天气", "猫", "狗", "东西", "人", "名字", "书", "汉语", "字", "桌子", "椅子"];
pinyin1 = ["jiā", "xuéxiào", "zhōngguó", "běijīng", "shàng", "xià", "jīntiān", "míngtiān", "zuótiān", "nián", "yuè", "rì", "xīngqī", "diǎn", "bàba", "māma", "érzi", "nǚér", "lǎoshī", "xuéshēng", "tóngxué", "péngyou", "yīshēng", "xiānsheng", "xiǎojiě", "yīfu", "shuǐ", "cài", "mǐfàn", "shuǐguǒ", "píngguǒ", "chá", "bēizi", "qián", "fēijī", "chūzūchē", "diànshì", "diànnǎo", "diànyǐng", "tiānqì", "māo", "gǒu", "dōngxi", "rén", "míngzi", "shū", "hànyǔ", "zì", "zhuōzi", "yǐzi"]; questionID = 0;
chars50 = ["不", "大", "但", "的", "都", "对", "而", "个", "各", "还", "好", "和", "很", "会", "或", "及", "就", "可", "可以", "来", "了", "两", "们", "那", "能", "你", "年", "人", "上", "说", "所", "他", "她", "他们", "为", "为", "我", "要", "也", "以", "一", "有", "与", "在", "着", "这", "种", "自己", "最"];
pinyin50 = ["bù", "dà", "dàn", "de", "dōu", "duì", "ér", "gè", "gè", "hái", "hǎo", "hé", "hěn", "huì", "huò", "jí", "jiù", "kě", "kěyǐ", "lái", "le", "liǎng", "men", "nà", "néng", "nǐ", "nián", "rén", "shàng", "shuō", "suǒ", "tā", "tā", "tāmen", "wéi", "wéi", "wǒ", "yào", "yě", "yǐ", "yī", "yǒu", "yǔ", "zài", "zhe", "zhè", "zhǒng", "zìjǐ", "zuì"];

chars = [] // buffer
pinyin = [] //same here, what did you expect?

points = 0;
alerted = false;
guess = document.getElementById("input");
question = document.getElementById("char");
guess.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submit();
    }
});

function chooseSet() {
    if (document.getElementById("set").value == "L1") {
        chars = chars1
        pinyin = pinyin1
    } else if (document.getElementById("set").value == "T50") {
        chars = chars50
        pinyin = pinyin50
    }
    questionID = Math.floor(Math.random() * chars.length)
    question.innerHTML = chars[questionID]
}

function submit() {
    console.log(guess.value);
    console.log(removeAccents(pinyin[questionID]))
    if (guess.value == removeAccents(pinyin[questionID])) {
        points += 1
        console.log(points)
        questionID = Math.floor(Math.random() * chars.length)
        guess.value = ""
    }

    if (document.getElementById("missed").checked && guess.value != removeAccents(pinyin[questionID])) {
        chars.push(chars[questionID])
        pinyin.push(pinyin[questionID])
    }
    question.innerHTML = chars[questionID]
}

function buttonSubmit() {
    if (alerted == false) {
        alert("You can press enter to submit your answer!")
        alerted = true
    }
    submit()
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


// glowy thing
const blob = document.getElementById("blob");

window.onpointermove = (event) => {
    const { clientX, clientY } = event;

    blob.animate(
        {
            left: `${clientX}px`,
            top: `${clientY}px`,
        },
        { duration: 3000, fill: "forwards" }
    );
};
