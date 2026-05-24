'use strict'

const auto = document.getElementById("auto");
const ruleEl = document.getElementById("rule");
const containerEl = document.getElementById("container");
const hue = Math.floor((Math.random()  * 1000)%365);
containerEl.style.color = `hsl(${hue}, 20%, 50%)`;
ruleEl.style.color = `hsl(${hue}, 20%, 50%)`;

const widthCh = getWidthInCh(auto);

// const rule = 110;
const rule = Math.floor(Math.random() * 1000 % 256);
const set = "█";
const unset = " ";
const len = Math.floor(widthCh);
let maxlines = 1;
let init = new Array(len).fill(unset);
for (let i = 0; i < len; i++) {
    if (Math.random() > 0.5) {
        init[i] = set;
    }
}
auto.innerHTML = init.join("");
ruleEl.innerText = `Rule ${rule}`;
document.title = `Rule ${rule}`;

let tab = [];
for (let i = 0; i < 8; i++) {
    tab[i] = (rule>>i)&1
}

function iterRule() {
    if (!enoughLines()) {
        maxlines++;
    }
    const text = auto.innerText;
    let lines = text.split("\n");
    const chars = lines[lines.length-1].split('');
    let newline = [];
    for (let chr = 0; chr < chars.length; chr++) {
        const prev = (chars[chr-1] && chars[chr-1] != unset && 1) || 0;
        const cur = (chars[chr] && chars[chr] != unset && 1) || 0;
        const next = (chars[chr+1] && chars[chr+1] != unset && 1) || 0;
        const idx = (prev<<2) | (cur<<1) | next;
        newline[chr] = tab[idx] ? set : unset;
    }
    lines.push(newline.join(""));
    lines = lines.slice(Math.max(lines.length-maxlines, 0));
    auto.innerText = lines.join("\n");
}

setInterval(iterRule, 200);
console.log("rule", rule);

function getWidthInCh(element) {
    const ruler = document.createElement('div');
    ruler.style.width = '1ch';
    ruler.style.position = 'absolute';
    ruler.style.visibility = 'hidden';

    const style = window.getComputedStyle(element);
    ruler.style.fontFamily = style.fontFamily;
    ruler.style.fontSize = style.fontSize;
    ruler.style.fontWeight = style.fontWeight;
    ruler.style.lineHeight = style.lineHeight;

    document.body.appendChild(ruler);
    const oneChPx = ruler.getBoundingClientRect().width;
    document.body.removeChild(ruler);

    const elementPx = element.getBoundingClientRect().width;
    return elementPx / oneChPx;
}

function enoughLines() {
    return Math.floor(auto.getBoundingClientRect().height) > window.innerHeight;
}
