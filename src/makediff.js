const fs = require('fs')
const babel = require('@babel/core')
const generator = require('@babel/generator').default
const { js_beautify } = require('./util/jsbeautify')
const diff = require('diff');
const args = process.argv.slice(2);

let astOld = babel.parse(fs.readFileSync(args[0], 'utf-8').split("/** ====== Main ====== */")[1].split("/** ====== Export Main ====== */")[0])
let astNew = babel.parse(fs.readFileSync(args[1], 'utf-8').split("/** ====== Main ====== */")[1].split("/** ====== Export Main ====== */")[0])

let oldModulesAst = astOld.program.body[0].expression.right.properties
let newModulesAst = astNew.program.body[0].expression.right.properties

let oldModuleCodes = {}
let newModuleCodes = {}

let oldDiffKey = []
let newDiffKey = []

let oldDiffStr = 'modules = {'
let newDiffStr = 'modules = {'

for (let prop of oldModulesAst) {
    oldModuleCodes[parseInt(prop.key.value)] = generator(prop.value).code.replace(/_require\((\d+)\)/g, "_require()")
}
for (let prop of newModulesAst) {
    newModuleCodes[parseInt(prop.key.value)] = generator(prop.value).code.replace(/_require\((\d+)\)/g, "_require()")
}

for (let idx in oldModuleCodes) {
    let code = oldModuleCodes[idx]
    if (!Object.values(newModuleCodes).includes(code)) {
        oldDiffKey.push(idx)
    }
}
for (let idx in newModuleCodes) {
    let code = newModuleCodes[idx]
    if (!Object.values(oldModuleCodes).includes(code)) {
        newDiffKey.push(idx)
    }
}

for (let i of oldDiffKey) {
    oldDiffStr += `${i}: ${generator(oldModulesAst[i].value).code} ,\n`
}
for (let i of newDiffKey) {
    newDiffStr += `${i}: ${generator(newModulesAst[i].value).code} ,\n`
}

oldDiffStr += ' }'
newDiffStr += ' }'

oldDiffStr = js_beautify(oldDiffStr)
newDiffStr = js_beautify(newDiffStr)

let diffOutput = diff.createPatch('./diff/change.diff', oldDiffStr, newDiffStr)
    .replace('--- ./diff/change.diff', '--- ./diff/old.js')
    .replace('+++ ./diff/change.diff', '+++ ./diff/new.js');

fs.existsSync('diff') || fs.mkdirSync('diff')
fs.writeFileSync('diff/old.js', oldDiffStr)
fs.writeFileSync('diff/new.js', newDiffStr)

fs.writeFileSync('diff/change.diff', diffOutput, 'utf-8');

console.log("Maked Diff File!")
