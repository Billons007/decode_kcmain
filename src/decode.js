const fs = require('fs')
const babel = require('@babel/core')
const generator = require('@babel/generator').default
const t = require('@babel/types')
const names = require('./const/names')
const { js_beautify } = require('js-beautify')
const args = process.argv.slice(2);
const path = require('path');

let code = fs.readFileSync(args[0], 'utf-8')
let ast = babel.parse(code)
let filename = path.basename(args[0])



/** ====== Util ====== */

function isValidIdentifier(str) {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str);
}

/** ====== Decode KanColle Obfuscation ====== */

let decodeFuncName = null
let decodeFuncsIdx = []
let decodeFuncCode = ''

/** Get Identifier Decode Function */
for (let i in ast.program.body) {
    node = ast.program.body[i]

    if (node.type == "FunctionDeclaration") {
        let funcCode = generator(node).code;
        decodeFuncCode += funcCode + ';\n';
        decodeFuncsIdx.push(i)
        if (node.id && !decodeFuncName && funcCode.includes('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='))
            decodeFuncName = node.id.name;
    }
    else if (node.type == "ExpressionStatement") {
        if (node.expression.type == "SequenceExpression") {
            for (let j in node.expression.expressions) {
                expression = node.expression.expressions[j]
                if (expression.type == "CallExpression") {
                    node.expression.expressions.splice(j, 1)
                    decodeFuncCode += generator(t.parenthesizedExpression(expression)).code + ';\n';
                    break;
                }
            }
        }
        else if (node.expression.type == "CallExpression") {
            decodeFuncsIdx.push(i)
            decodeFuncCode += generator(t.parenthesizedExpression(node.expression)).code + ';\n';
        }
    }
}

eval(decodeFuncCode)

/** Remove Identifier Decode Function in AST */
for (let i of decodeFuncsIdx.sort((a, b) => b - a)) {
    ast.program.body.splice(i, 1)
}


let decodeFuncAlias = []

/** First Traverse */
babel.traverse(ast, {

    /** Find All Decode Functions Alias and Remove The Declaration */
    VariableDeclarator(path) {
        let node = path.node;
        if (node.init && node.init.name && (node.init.name == decodeFuncName || decodeFuncAlias.includes(node.init.name))) {
            if (!decodeFuncAlias.includes(node.id.name)) {
                decodeFuncAlias.push(node.id.name)
            }
            path.remove();
        }
    },

    /** Find And Replace Encode Identifier To Before */
    CallExpression(path) {
        let node = path.node;
        if (node.callee.name && decodeFuncAlias.includes(node.callee.name)) {
            let decodedString = eval(`${decodeFuncName}(${node.arguments[0].value})`)
            let newNode = t.stringLiteral(decodedString)
            path.replaceWith(newNode)
        }
    },

    /** Covert The Hex Number To Decimal */
    NumericLiteral(path) {
        let node = path.node;
        if (node.extra && node.extra.raw) {
            node.extra.raw = node.extra.rawValue.toString()
        }
    }
})


/** Reparse Ast */
ast = babel.parse(generator(ast).code)

/** Second Traverse */
babel.traverse(ast, {

    /** Replace Bracket Notation To Dot Notation */
    MemberExpression(path) {
        let node = path.node;
        if (node.property.type == "StringLiteral" && isValidIdentifier(node.property.value)) {
            node.property = babel.types.identifier(node.property.value)
            node.computed = false;
        }
    },

    StringLiteral(path) {
        let node = path.node
        /** Decode The Unicode String */
        if (node.extra && node.extra.raw && (node.extra.raw.includes("\\u") || node.extra.raw.includes("\\x"))) {
            node.extra.raw = JSON.stringify(node.value, null, 0)
        }
    }
})


/** ====== Parse Compiled Code ====== */

let mainFuncParams = []
let mainFuncAst = ast.program.body[0].expression.argument.arguments[1]    // Get Main Function

/** Get Axios Module Alias And Window Alias */
for (let i of mainFuncAst.params) {
    mainFuncParams.push(i.name)
}
let axiosModuleName = mainFuncParams[0]
let windowModuleName = mainFuncParams[1]

let requireCallFuncName = ""
let entryFuncKey

/** Get RequireCall Function's Name */
for (let statement of mainFuncAst.body.callee.body.body) {
    if (statement.type === 'ReturnStatement') {
        if (statement.argument && statement.argument.type === 'AssignmentExpression') {
            let AssignmentExpression = statement.argument
            let MemberExpression = AssignmentExpression.right
            if (MemberExpression.property.name === 'default') {
                requireCallFuncName = (MemberExpression.object.name)
                break
            }
        }
    }
}

/** Get Entry Function Key */
for (let node of mainFuncAst.body.callee.body.body) {
    if (node.type == "VariableDeclaration") {
        for (let _node of node.declarations) {
            if (_node.id.name == requireCallFuncName && _node.init && _node.init.type == "CallExpression") {
                requireCallFuncName = _node.init.callee.name
                entryFuncKey = _node.init.arguments[0].value
                break
            }
        }
    }

}

let newParamsIdentifier = ['_module', '_exports', '_require']
let axios_key = null;
let window_key = null;

let modulesCode = null;

/** Third Traverse */
babel.traverse(ast, {
    ObjectExpression(path) {
        let node = path.node
        let propPaths = path.get("properties")
        /** Find Main Dict */
        if (node.properties.length >= 2000) {
            /** First Function Dict Traverse */
            let removeList = []
            for (let idx in propPaths) {
                let propPath = propPaths[idx]
                let params = []
                let prop = propPath.node
                if ((prop.value.type == "ArrowFunctionExpression" || prop.value.type == "FunctionExpression") && prop.value.params.length > 0 && prop.value.params.length <= 3) {
                    for (let param of prop.value.params) {
                        params.push(param.name)
                    }
                    if (prop.value.params.length == 3) prop.value.params.pop();

                    let tslibIdentifier = ["__extends", "__createBinding", "__setModuleDefault", "__importStar", "__importDefault", "__exportStar", "__assign", "__spreadArray"]
                    let newIdentifier = [];
                    let oldIdentifier = []

                    let removeProp = false

                    propPath.traverse({
                        /** Get Axios/Window Module's Key */
                        AssignmentExpression(path) {
                            let node = path.node
                            if ((!axios_key || !window_key) && node.operator == "=" && node.left.type == "MemberExpression" &&
                                node.right.type == "Identifier" && node.left.property.type == "Identifier" && node.left.property.name == "exports") {
                                if (!axios_key && node.right.name == axiosModuleName) {
                                    axios_key = prop.key.value
                                    removeProp = true;
                                }
                                else if (!window_key && node.right.name == windowModuleName) {
                                    window_key = prop.key.value
                                    removeProp = true;
                                }
                            }
                        },
                        /** Replace Identifier To Readable */
                        Identifier(path) {
                            let node = path.node
                            if (params.indexOf(node.name) != -1) {
                                node.name = newParamsIdentifier[params.indexOf(node.name)]
                            }
                        },
                        /** Replace Property's String Key To Identifier */
                        ObjectProperty(path) {
                            let node = path.node
                            if (node.key.type == "StringLiteral" && isValidIdentifier(node.key.value)) {
                                path.get("key").replaceWith(t.identifier(node.key.value))
                            }
                        },
                        /** Find And Remove TS Compiler Util Function's Declaration */
                        VariableDeclaration(path) {
                            let declarators = path.node.declarations
                            let removePathIdxs = []
                            for (let i = 0; i < declarators.length; i++) {
                                let _varPath = path.get("declarations")[i]
                                let var_node = _varPath.node
                                if (var_node.init && var_node.init.type == "LogicalExpression" && var_node.init.left.type == "LogicalExpression" &&
                                    var_node.init.left.operator == "&&" && var_node.init.left.left.type == "ThisExpression" && var_node.init.left.right.type == "MemberExpression" &&
                                    var_node.init.left.right.property.type == "Identifier" && tslibIdentifier.includes(var_node.init.left.right.property.name)) {
                                    newIdentifier.push(var_node.init.left.right.property.name)
                                    oldIdentifier.push(var_node.id.name)
                                    if (var_node.init.left.right.property.name == "__extends") removePathIdxs.push(i - 1);
                                    removePathIdxs.push(i)
                                }
                            }
                            for (let i of removePathIdxs.sort((a, b) => b - a)) {
                                path.get("declarations")[i].remove();
                            }
                        }
                    })

                    propPath.traverse({
                        /** Find TS Compiler Util Functions */
                        CallExpression(path) {
                            let call_node = path.node;
                            if (call_node.callee.type == "Identifier" && oldIdentifier.includes(call_node.callee.name)) {
                                call_node.callee.name = newIdentifier[oldIdentifier.indexOf(call_node.callee.name)]
                            }
                        }
                    })

                    /** If Need Remove */
                    if (removeProp) removeList.push(idx);

                    /** Covert ArrowFunction To Normal Anonymous Function */
                    if (prop.value.type == "ArrowFunctionExpression") prop.value.type = "FunctionExpression";
                }
            }

            for (let i of removeList.sort((a, b) => b - a)) {
                propPaths.splice(i, 1)
                node.properties.splice(i, 1)
            }

            let propKeys = {}

            /** Second Function Dict Traverse */
            for (let idx in propPaths) {

                let propPath = propPaths[idx]
                let window_alias = []
                let axios_alias = []

                /** Save Keys And Index */
                propKeys[propPath.node.key.value] = idx
                /** Update Entry Function Key To Index */
                if (propPath.node.key.value == entryFuncKey) entryFuncKey = idx;
                /** Update Key To Index */
                propPath.node.key.value = idx

                /** Replace TS Compiler Util Function's Call To Global */
                propPath.traverse({
                    VariableDeclarator(_varPath) {
                        let var_node = _varPath.node
                        if (var_node.init && var_node.init.type == "CallExpression" && var_node.init.callee.type == "Identifier" &&
                            var_node.init.callee.name == "_require" && var_node.init.arguments && var_node.init.arguments.length == 1 &&
                            ((var_node.init.arguments[0].type == "NumericLiteral" && var_node.init.arguments[0].value == window_key) ||
                                (var_node.init.arguments[0].type == "Identifier" && window_alias.includes(var_node.init.arguments[0].name)))) {
                            window_alias.push(var_node.id.name);
                            _varPath.remove();
                        }
                        else if (var_node.init && var_node.init.type == "CallExpression" && var_node.init.callee.type == "Identifier" &&
                            var_node.init.callee.name == "__importDefault" && var_node.init.arguments && var_node.init.arguments.length == 1 &&
                            var_node.init.arguments[0].type == "CallExpression" && var_node.init.arguments[0].callee.type == "Identifier" &&
                            var_node.init.arguments[0].callee.name == "_require" && var_node.init.arguments[0].arguments && var_node.init.arguments[0].arguments.length == 1 &&
                            ((var_node.init.arguments[0].arguments[0].type == "NumericLiteral" && var_node.init.arguments[0].arguments[0].value == axios_key) ||
                                (var_node.init.arguments[0].arguments[0].type == "Identifier" && axios_alias.includes(var_node.init.arguments[0].arguments[0].name)))) {
                            axios_alias.push(var_node.id.name);
                            _varPath.remove();
                        }
                    }
                })

                /** Replace Window/Axios Module Call To Global */
                propPath.traverse({
                    MemberExpression(_memberExpPath) {
                        let _memberExpNode = _memberExpPath.node
                        if (_memberExpNode.object.type == "Identifier" && window_alias.includes(_memberExpNode.object.name)) {
                            _memberExpPath.replaceWith(_memberExpNode.property)
                        }
                        else if (_memberExpNode.object.type == "Identifier" && axios_alias.includes(_memberExpNode.object.name) &&
                            _memberExpNode.property.type == "Identifier" && _memberExpNode.property.name == "default") {
                            _memberExpPath.replaceWith(t.identifier("axios"))
                        }
                        /** Fix NumericLiteral's Case */
                        if (_memberExpNode.object.type == "NumericLiteral") {
                            _memberExpNode.object = t.parenthesizedExpression(t.numericLiteral(_memberExpNode.object.value))
                        }
                    }
                })


                let oldIdentifiers = []
                let newIdentifiers = []

                let nameList = Array.from(names).reverse()

                /** Rename Identifer To Shorter */
                propPath.traverse({
                    Identifier(path) {
                        let node = path.node;
                        if (node.name.includes('_0x') && !oldIdentifiers.includes(node.name)) {
                            oldIdentifiers.push(node.name)
                            let newIdentifier = nameList.pop()
                            newIdentifiers.push(newIdentifier)
                            node.name = newIdentifier
                        }
                        else if (oldIdentifiers.includes(node.name)) {
                            node.name = newIdentifiers[oldIdentifiers.indexOf(node.name)]
                        }
                    }
                })

            }

            /** Third Function Dict Traverse */
            for (let propPath of propPaths) {
                propPath.traverse({
                    /** Replace Require Call Argument To Index */
                    CallExpression(path) {
                        let node = path.node
                        if (node.callee.type == "Identifier" && node.callee.name == "_require") {
                            node.arguments[0].value = propKeys[node.arguments[0].value]
                        }
                    }
                })
            }

            modulesCode = "_modules = " + generator(node).code
            path.stop();
        }
    }
})

/** Replace Something */
let output = modulesCode.replace(/!0/g, 'true').replace(/!1/g, 'false').replace(/void 0/g, 'undefined')


/** ====== Output ====== */

/** Add Header/Footer And Format */
let header = fs.readFileSync('src/header.js', 'utf-8');
let footer = fs.readFileSync('src/footer.js', 'utf-8').replace("_require()", `_require(${entryFuncKey})`)
output = header + output + "\n\n" + footer;
output = js_beautify(output)

/** Output File */
fs.existsSync('dist') || fs.mkdirSync('dist')
fs.writeFileSync(`dist/${filename}`, output)

/** Export The Output For Other Modules */
module.exports.code = output;

console.log("Decode Compeleted!")