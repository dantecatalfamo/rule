'use strict'

// const rule = 110;

const set = "\u2588";
const unset = " ";
const maxRepeats = 30;
const linesPerRule = 600;
const interval = 200;

const auto = document.getElementById("auto");
const ruleEl = document.getElementById("rule");
const containerEl = document.getElementById("container");

let tab = [];
let maxLines;
let lineNumber;
let repeats;

function initRule(rule) {
    maxLines = 1;
    lineNumber = 0;
    repeats = 0;
    tab = [];
    for (let i = 0; i < 8; i++) {
        tab[i] = (rule >> i) & 1
    }

    let hue = Math.floor((Math.random()  * 1000)%365);
    containerEl.style.color = `hsl(${hue}, 20%, 50%)`;
    ruleEl.style.color = `hsl(${hue}, 20%, 50%)`;

    const widthCh = Math.floor(getWidthInCh(auto));
    let init = new Array(widthCh).fill(unset);
    for (let i = 0; i < widthCh; i++) {
        if (Math.random() > 0.5) {
            init[i] = set;
        }
    }

    auto.innerHTML = init.join("");
    ruleEl.innerText = `Rule ${rule}`;
    document.title = `Rule ${rule}`;
}

function iterRule() {
    if (lineNumber++ > linesPerRule) {
        console.log("linesPerRule");
        newRule();
    }

    if (!enoughLines()) {
        maxLines++;
    }
    const text = auto.innerText;
    let lines = text.split("\n");
    const chars = lines[lines.length-1].split('');
    let newchars = [];
    for (let chr = 0; chr < chars.length; chr++) {
        const prev = (chars[chr-1] && chars[chr-1] != unset && 1) || 0;
        const cur = (chars[chr] && chars[chr] != unset && 1) || 0;
        const next = (chars[chr+1] && chars[chr+1] != unset && 1) || 0;
        const idx = (prev<<2) | (cur<<1) | next;
        newchars[chr] = tab[idx] ? set : unset;
    }
    const newline = newchars.join("");
    if (newline == lines[lines.length-1] && repeats++ > maxRepeats) {
        console.log("maxReleats");
        newRule();
    }
    lines.push(newline);
    lines = lines.slice(Math.max(lines.length-maxLines, 0));
    auto.innerText = lines.join("\n");
}

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

function newRule() {
    initRule(Math.floor(Math.random() * 1000 % 256));
}

newRule();
setInterval(iterRule, interval);
