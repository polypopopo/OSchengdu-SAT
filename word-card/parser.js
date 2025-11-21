const fs = require("fs");
const path = require("path");

let txt = fs.readFileSync(path.join(__dirname, "dc.txt")).toString();

// 改进的正则表达式，匹配以下结构：
// 数字 单词
// [音标]
// 词性.释义
// 英文例句 中文翻译
let regexp = /(\d+)\s+([a-zA-Z\-]+)\s*\n\s*(\[[^\]]+\])\s*\n\s*([^\n]+)\s*\n\s*([^\n]+)\s*\n/g;

let words = [];
let re = null;

while ((re = regexp.exec(txt))) {
  const [_, id, word, phonetic, definition, example] = re;
  
  // 从定义中分离词性和释义
  const definitionMatch = definition.match(/^([a-z.]+)\s*(.+)$/);
  let partOfSpeech = "";
  let meaning = "";
  
  if (definitionMatch) {
    partOfSpeech = definitionMatch[1].trim();
    meaning = definitionMatch[2].trim();
  } else {
    meaning = definition.trim();
  }
  
  words.push({
    id: parseInt(id),
    word: word.trim(),
    phonetic: phonetic.trim(),
    partOfSpeech: partOfSpeech,
    definition: meaning,
    example: example.trim()
  });
}

// 输出前几个检查格式
words.slice(0, 2371).forEach(word => {
  console.log(word);
});

// 保存为JSON文件
const output = {
  metadata: {
    totalWords: words.length,
    generatedAt: new Date().toISOString()
  },
  words: words
};

fs.writeFileSync(
  path.join(__dirname, "word-cards.json"), 
  JSON.stringify(output, null, 2)
);

console.log(`\n成功提取 ${words.length} 个单词，已保存到 word-cards.json`);