/** ====== TS Libraries ====== */

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));

var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var key in m) {
        if ("default" === key || Object.prototype.hasOwnProperty.call(exports, key)) {
            continue;
        }
        __createBinding(exports, m, key);
    }
};

var __assign = (this && this.__assign) || function () {
    return __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            for (var p in s = arguments[i]) {
                if (Object.prototype.hasOwnProperty.call(s, p)) {
                    t[p] = s[p];
                }
            }
        }
        return t;
    }, __assign.apply(this, arguments);
};

var __spreadArray = (this && this.__spreadArray) || function (targetArray, sourceArray, shouldCopy) {
    if (shouldCopy || arguments.length === 2) {
        var copiedArray, sourceIndex = 0, sourceLength = sourceArray.length;
        for (; sourceIndex < sourceLength; sourceIndex++) {
            if (!copiedArray && sourceIndex in sourceArray) {
                copiedArray || (copiedArray = Array.prototype.slice.call(sourceArray, 0, sourceIndex));
                copiedArray[sourceIndex] = sourceArray[sourceIndex];
            }
        }
    }
    return targetArray.concat(copiedArray || Array.prototype.slice.call(sourceArray));
};

/** ====== CommonJS Require System ====== */

var _modules = {},
    _modulesPool = {};

function _require(key) {
    var _module = _modulesPool[key];
    if (undefined !== _module) return _module.exports;
    var module = _modulesPool[key] = {
        'exports': {}
    };
    _modules[key].call(module.exports, module, module.exports, _require);
    return module.exports;
}

_require.g = function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
        return this || new Function("return this")();
    } catch (e) {
        if ("object" == typeof window) return window;
    }
}();

/** ====== Main ====== */

