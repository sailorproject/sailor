////////////////////////////////////////////////////////////////////////////////
// lua5.1.5.js: Lua 5.1.5 in JavaScript
// This file is a part of lua5.1.js project:
// https://github.com/logiceditor-com/lua5.1.js/
// Copyright (c) LogicEditor <info@logiceditor.com>
// Copyright (c) lua5.1.js authors
// Distributed under the terms of the MIT license:
// https://github.com/logiceditor-com/lua5.1.js/tree/master/COPYRIGHT
// Based on original Lua 5.1.5 header files:
// Copyright (c) 1994-2012 Lua.org, PUC-Rio
////////////////////////////////////////////////////////////////////////////////
// WARNING: Emscriptenized code does not like minification.
//          Keep this file as is and enable compression in your HTTP server.
////////////////////////////////////////////////////////////////////////////////

var Lua5_1 = Lua5_1 || { };

////////////////////////////////////////////////////////////////////////////////

(function(Lua5_1) {

////////////////////////////////////////////////////////////////////////////////

// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function(filename) { return Module['read'](filename, true) };
  Module['load'] = function(f) {
    globalEval(read(f));
  };
  Module['arguments'] = process['argv'].slice(2);
  module.exports = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function() { throw 'no read() available (jsc?)' };
  }
  Module['readBinary'] = function(f) {
    return read(f, 'binary');
  };
  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  this['Module'] = Module;
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  if (ENVIRONMENT_IS_WEB) {
    Module['print'] = function(x) {
      console.log(x);
    };
    Module['printErr'] = function(x) {
      console.log(x);
    };
    this['Module'] = Module;
  } else if (ENVIRONMENT_IS_WORKER) {
    // We can do very little here...
    var TRY_USE_DUMP = false;
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];
// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type.charAt(type.length-1) == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (type == 'i64' || type == 'double' || vararg) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2 + 2*i;
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;
      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }
      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = ((((STACKTOP)+7)>>3)<<3); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = ((((STATICTOP)+7)>>3)<<3); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = ((((DYNAMICTOP)+7)>>3)<<3); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+(((low)>>>(0))))+((+(((high)>>>(0))))*(+(4294967296)))) : ((+(((low)>>>(0))))+((+(((high)|(0))))*(+(4294967296))))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
function jsCall() {
  var args = Array.prototype.slice.call(arguments);
  return Runtime.functionPointers[args[0]].apply(null, args.slice(1));
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math.abs(tempDouble))) >= (+(1)) ? (tempDouble > (+(0)) ? ((Math.min((+(Math.floor((tempDouble)/(+(4294967296))))), (+(4294967295))))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+(4294967296)))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr', 
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0
}
Module['stringToUTF16'] = stringToUTF16;
// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr', 
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0
}
Module['stringToUTF32'] = stringToUTF32;
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited
var runtimeInitialized = false;
function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;
function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;
function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math['imul']) Math['imul'] = function(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyTracking = {};
var calledInit = false, calledRun = false;
var runDependencyWatcher = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    } 
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun && shouldRunNow) run();
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
function loadMemoryInitializer(filename) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  // always do this asynchronously, to keep shell and web as similar as possible
  addOnPreRun(function() {
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      applyData(Module['readBinary'](filename));
    } else {
      Browser.asyncLoad(filename, function(data) {
        applyData(data);
      }, function(data) {
        throw 'could not load memory initializer ' + filename;
      });
    }
  });
}
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 11056;
/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });
var _stdout;
var _stdin;
var _stderr;
var _stdout = _stdout=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var _stdin = _stdin=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var _stderr = _stderr=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
/* memory initializer */ allocate([16,36,0,0,244,1,0,0,64,28,0,0,2,2,0,0,0,22,0,0,0,2,0,0,88,17,0,0,28,2,0,0,208,14,0,0,210,1,0,0,128,12,0,0,80,1,0,0,152,10,0,0,172,1,0,0,64,9,0,0,102,1,0,0,104,8,0,0,40,2,0,0,0,0,0,0,0,0,0,0,80,36,0,0,34,1,0,0,200,28,0,0,4,2,0,0,32,22,0,0,180,1,0,0,112,17,0,0,36,2,0,0,224,14,0,0,6,2,0,0,136,12,0,0,214,1,0,0,160,10,0,0,52,1,0,0,72,9,0,0,242,1,0,0,112,8,0,0,194,1,0,0,56,40,0,0,46,1,0,0,144,39,0,0,108,1,0,0,0,0,0,0,0,0,0,0,200,14,0,0,192,1,0,0,120,12,0,0,44,1,0,0,144,10,0,0,86,1,0,0,56,9,0,0,56,1,0,0,96,8,0,0,116,1,0,0,24,28,0,0,168,1,0,0,224,35,0,0,98,1,0,0,48,40,0,0,122,1,0,0,72,39,0,0,234,1,0,0,40,38,0,0,184,1,0,0,96,37,0,0,62,1,0,0,136,36,0,0,106,1,0,0,216,35,0,0,42,1,0,0,88,35,0,0,226,1,0,0,224,34,0,0,82,1,0,0,0,0,0,0,0,0,0,0,32,23,0,0,96,40,0,0,184,39,0,0,160,38,0,0,6,6,6,6,7,7,7,7,7,7,10,9,5,4,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,1,0,0,0,0,0,0,0,0,36,64,0,0,0,0,0,0,89,64,0,0,0,0,0,136,195,64,0,0,0,0,132,215,151,65,0,128,224,55,121,195,65,67,23,110,5,181,181,184,147,70,245,249,63,233,3,79,56,77,50,29,48,249,72,119,130,90,60,191,115,127,221,79,21,117,128,16,0,0,16,2,0,0,80,16,0,0,20,2,0,0,0,0,0,0,0,0,0,0,240,31,0,0,216,30,0,0,200,29,0,0,40,29,0,0,32,28,0,0,56,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,0,15,0,0,16,1,0,0,144,12,0,0,22,1,0,0,184,10,0,0,104,1,0,0,80,9,0,0,138,1,0,0,128,8,0,0,6,1,0,0,64,40,0,0,160,1,0,0,152,39,0,0,32,2,0,0,128,38,0,0,164,1,0,0,152,37,0,0,58,1,0,0,208,36,0,0,78,1,0,0,0,36,0,0,74,1,0,0,80,22,0,0,204,1,0,0,104,35,0,0,158,1,0,0,240,34,0,0,208,1,0,0,88,34,0,0,10,1,0,0,120,33,0,0,222,1,0,0,216,32,0,0,190,1,0,0,248,31,0,0,186,1,0,0,224,30,0,0,92,1,0,0,208,29,0,0,144,1,0,0,56,29,0,0,66,1,0,0,40,28,0,0,126,1,0,0,128,27,0,0,196,1,0,0,208,26,0,0,14,1,0,0,104,26,0,0,254,1,0,0,0,26,0,0,30,2,0,0,96,25,0,0,166,1,0,0,192,24,0,0,150,1,0,0,0,0,0,0,0,0,0,0,24,13,0,0,128,35,0,0,120,27,0,0,128,21,0,0,168,16,0,0,152,14,0,0,216,11,0,0,96,10,0,0,24,9,0,0,16,8,0,0,24,40,0,0,56,39,0,0,16,38,0,0,72,37,0,0,112,36,0,0,200,35,0,0,72,35,0,0,168,34,0,0,248,33,0,0,56,33,0,0,112,32,0,0,120,31,0,0,96,31,0,0,128,30,0,0,136,29,0,0,208,28,0,0,56,27,0,0,40,27,0,0,152,26,0,0,32,26,0,0,184,25,0,0,0,0,0,0,128,31,0,0,216,38,0,0,64,31,0,0,56,24,0,0,232,18,0,0,168,15,0,0,104,13,0,0,64,31,0,0,72,11,0,0,240,9,0,0,200,8,0,0,0,0,0,0,136,40,0,0,216,39,0,0,184,38,0,0,224,37,0,0,32,37,0,0,48,36,0,0,176,35,0,0,32,35,0,0,128,34,0,0,176,33,0,0,0,33,0,0,40,32,0,0,56,31,0,0,96,30,0,0,112,29,0,0,136,28,0,0,192,27,0,0,0,0,0,0,96,113,84,96,80,113,108,49,16,60,84,108,124,124,124,124,124,124,96,96,96,104,34,188,188,188,228,228,84,84,16,98,98,132,20,0,81,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,0,0,0,0,120,11,0,0,112,11,0,0,80,11,0,0,8,11,0,0,200,10,0,0,168,10,0,0,128,10,0,0,0,0,0,0,208,35,0,0,46,2,0,0,80,35,0,0,118,1,0,0,0,0,0,0,0,0,0,0,136,8,0,0,120,1,0,0,72,40,0,0,42,2,0,0,160,39,0,0,10,2,0,0,136,38,0,0,84,1,0,0,160,37,0,0,220,1,0,0,216,36,0,0,170,1,0,0,200,17,0,0,154,1,0,0,8,36,0,0,206,1,0,0,112,35,0,0,50,1,0,0,248,34,0,0,252,1,0,0,96,34,0,0,2,1,0,0,0,0,0,0,0,0,0,0,136,26,0,0,16,26,0,0,136,25,0,0,224,24,0,0,248,23,0,0,0,0,0,0,136,8,0,0,120,1,0,0,72,40,0,0,200,1,0,0,136,38,0,0,28,1,0,0,8,36,0,0,130,1,0,0,104,22,0,0,252,0,0,0,248,21,0,0,44,2,0,0,96,34,0,0,38,1,0,0,168,21,0,0,32,1,0,0,32,21,0,0,250,1,0,0,0,0,0,0,0,0,0,0,200,19,0,0,48,19,0,0,200,18,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,18,0,0,168,17,0,0,80,17,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,21,0,0,238,1,0,0,80,37,0,0,54,1,0,0,144,29,0,0,18,1,0,0,152,22,0,0,88,1,0,0,232,17,0,0,36,1,0,0,48,15,0,0,198,1,0,0,208,12,0,0,4,1,0,0,208,10,0,0,110,1,0,0,120,9,0,0,176,1,0,0,144,8,0,0,178,1,0,0,80,40,0,0,230,1,0,0,168,39,0,0,90,1,0,0,144,38,0,0,48,1,0,0,168,37,0,0,236,1,0,0,0,0,0,0,0,0,0,0,216,37,0,0,114,1,0,0,88,30,0,0,232,1,0,0,32,23,0,0,136,1,0,0,40,18,0,0,224,1,0,0,64,15,0,0,134,1,0,0,248,12,0,0,174,1,0,0,0,0,0,0,0,0,0,0,88,29,0,0,70,1,0,0,96,28,0,0,18,2,0,0,184,27,0,0,188,1,0,0,248,26,0,0,182,1,0,0,144,26,0,0,152,1,0,0,24,26,0,0,22,2,0,0,144,25,0,0,202,1,0,0,232,24,0,0,212,1,0,0,48,24,0,0,24,2,0,0,16,23,0,0,218,1,0,0,120,22,0,0,8,1,0,0,24,22,0,0,162,1,0,0,216,21,0,0,216,1,0,0,72,21,0,0,12,1,0,0,208,20,0,0,34,2,0,0,104,20,0,0,14,2,0,0,224,19,0,0,8,2,0,0,72,19,0,0,24,1,0,0,216,18,0,0,240,1,0,0,24,18,0,0,112,1,0,0,184,17,0,0,72,1,0,0,104,17,0,0,0,1,0,0,240,16,0,0,228,1,0,0,160,16,0,0,128,1,0,0,0,0,0,0,0,0,0,0,105,102,0,0,0,0,0,0,46,47,63,46,115,111,59,47,117,115,114,47,108,111,99,97,108,47,108,105,98,47,108,117,97,47,53,46,49,47,63,46,115,111,59,47,117,115,114,47,108,111,99,97,108,47,108,105,98,47,108,117,97,47,53,46,49,47,108,111,97,100,97,108,108,46,115,111,0,0,0,0,102,111,114,109,97,116,0,0,115,111,114,116,0,0,0,0,115,101,116,108,111,99,97,108,101,0,0,0,0,0,0,0,97,116,97,110,0,0,0,0,99,108,111,115,101,0,0,0,115,101,116,104,111,111,107,0,116,111,111,32,109,97,110,121,32,114,101,115,117,108,116,115,32,116,111,32,114,101,115,117,109,101,0,0,0,0,0,0,98,97,100,32,104,101,97,100,101,114,0,0,0,0,0,0,117,112,118,97,108,0,0,0,105,116,101,109,115,32,105,110,32,97,32,99,111,110,115,116,114,117,99,116,111,114,0,0,102,105,101,108,100,0,0,0,109,101,109,111,114,121,32,97,108,108,111,99,97,116,105,111,110,32,101,114,114,111,114,58,32,98,108,111,99,107,32,116,111,111,32,98,105,103,0,0,102,117,110,99,116,105,111,110,0,0,0,0,0,0,0,0,76,85,65,95,67,80,65,84,72,0,0,0,0,0,0,0,102,105,110,100,0,0,0,0,115,101,116,110,0,0,0,0,114,101,110,97,109,101,0,0,97,116,97,110,50,0,0,0,99,97,110,110,111,116,32,99,108,111,115,101,32,115,116,97,110,100,97,114,100,32,102,105,108,101,0,0,0,0,0,0,115,101,116,102,101,110,118,0,99,97,110,110,111,116,32,114,101,115,117,109,101,32,37,115,32,99,111,114,111,117,116,105,110,101,0,0,0,0,0,0,37,115,58,37,100,58,32,0,99,97,108,108,0,0,0,0,39,102,111,114,39,32,115,116,101,112,32,109,117,115,116,32,98,101,32,97,32,110,117,109,98,101,114,0,0,0,0,0,37,115,58,32,37,115,32,105,110,32,112,114,101,99,111,109,112,105,108,101,100,32,99,104,117,110,107,0,0,0,0,0,112,114,111,116,111,0,0,0,116,111,111,32,109,97,110,121,32,108,111,99,97,108,32,118,97,114,105,97,98,108,101,115,0,0,0,0,0,0,0,0,103,108,111,98,97,108,0,0,97,116,116,101,109,112,116,32,116,111,32,37,115,32,37,115,32,39,37,115,39,32,40,97,32,37,115,32,118,97,108,117,101,41,0,0,0,0,0,0,97,115,115,101,114,116,105,111,110,32,102,97,105,108,101,100,33,0,0,0,0,0,0,0,102,111,114,0,0,0,0,0,37,115,0,0,0,0,0,0,100,101,98,117,103,0,0,0,99,112,97,116,104,0,0,0,115,101,116,115,116,101,112,109,117,108,0,0,0,0,0,0,100,117,109,112,0,0,0,0,114,101,109,111,118,101,0,0,114,101,109,111,118,101,0,0,115,101,116,112,97,117,115,101,0,0,0,0,0,0,0,0,97,115,105,110,0,0,0,0,37,115,0,0,0,0,0,0,115,116,101,112,0,0,0,0,103,101,116,117,112,118,97,108,117,101,0,0,0,0,0,0,116,111,111,32,109,97,110,121,32,97,114,103,117,109,101,110,116,115,32,116,111,32,114,101,115,117,109,101,0,0,0,0,83,108,0,0,0,0,0,0,99,111,117,110,116,0,0,0,39,102,111,114,39,32,108,105,109,105,116,32,109,117,115,116,32,98,101,32,97,32,110,117,109,98,101,114,0,0,0,0,110,0,0,0,0,0,0,0,98,97,100,32,105,110,116,101,103,101,114,0,0,0,0,0,116,104,114,101,97,100,0,0,99,111,108,108,101,99,116,0,108,111,99,97,108,32,118,97,114,105,97,98,108,101,115,0,34,93,0,0,0,0,0,0,114,101,115,116,97,114,116,0,115,116,111,112,0,0,0,0,108,111,99,97,108,0,0,0,114,101,97,100,101,114,32,102,117,110,99,116,105,111,110,32,109,117,115,116,32,114,101,116,117,114,110,32,97,32,115,116,114,105,110,103,0,0,0,0,116,111,111,32,109,97,110,121,32,110,101,115,116,101,100,32,102,117,110,99,116,105,111,110,115,0,0,0,0,0,0,0,61,40,108,111,97,100,41,0,102,97,108,115,101,0,0,0,109,97,116,104,0,0,0,0,46,47,63,46,108,117,97,59,47,117,115,114,47,108,111,99,97,108,47,115,104,97,114,101,47,108,117,97,47,53,46,49,47,63,46,108,117,97,59,47,117,115,114,47,108,111,99,97,108,47,115,104,97,114,101,47,108,117,97,47,53,46,49,47,63,47,105,110,105,116,46,108,117,97,59,47,117,115,114,47,108,111,99,97,108,47,108,105,98,47,108,117,97,47,53,46,49,47,63,46,108,117,97,59,47,117,115,114,47,108,111,99,97,108,47,108,105,98,47,108,117,97,47,53,46,49,47,63,47,105,110,105,116,46,108,117,97,0,0,0,0,0,0,0,99,104,97,114,0,0,0,0,105,110,115,101,114,116,0,0,103,101,116,101,110,118,0,0,97,99,111,115,0,0,0,0,37,115,58,32,37,115,0,0,39,116,111,115,116,114,105,110,103,39,32,109,117,115,116,32,114,101,116,117,114,110,32,97,32,115,116,114,105,110,103,32,116,111,32,39,112,114,105,110,116,39,0,0,0,0,0,0,103,101,116,109,101,116,97,116,97,98,108,101,0,0,0,0,105,110,100,101,120,32,111,117,116,32,111,102,32,114,97,110,103,101,0,0,0,0,0,0,121,105,101,108,100,0,0,0,37,115,32,101,120,112,101,99,116,101,100,44,32,103,111,116,32,37,115,0,0,0,0,0,97,110,100,0,0,0,0,0,39,102,111,114,39,32,105,110,105,116,105,97,108,32,118,97,108,117,101,32,109,117,115,116,32,98,101,32,97,32,110,117,109,98,101,114,0,0,0,0,115,116,97,99,107,32,111,118,101,114,102,108,111,119,0,0,98,97,100,32,99,111,110,115,116,97,110,116,0,0,0,0,102,117,110,99,116,105,111,110,0,0,0,0,0,0,0,0,110,111,32,102,117,110,99,116,105,111,110,32,101,110,118,105,114,111,110,109,101,110,116,32,102,111,114,32,116,97,105,108,32,99,97,108,108,32,97,116,32,108,101,118,101,108,32,37,100,0,0,0,0,0,0,0,60,110,97,109,101,62,32,111,114,32,39,46,46,46,39,32,101,120,112,101,99,116,101,100,0,0,0,0,0,0,0,0,91,115,116,114,105,110,103,32,34,0,0,0,0,0,0,0,102,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,108,101,118,101,108,0,0,0,37,115,58,37,100,58,32,37,115,0,0,0,0,0,0,0,95,76,79,65,68,76,73,66,0,0,0,0,0,0,0,0,108,101,118,101,108,32,109,117,115,116,32,98,101,32,110,111,110,45,110,101,103,97,116,105,118,101,0,0,0,0,0,0,39,115,101,116,102,101,110,118,39,32,99,97,110,110,111,116,32,99,104,97,110,103,101,32,101,110,118,105,114,111,110,109,101,110,116,32,111,102,32,103,105,118,101,110,32,111,98,106,101,99,116,0,0,0,0,0,99,97,110,110,111,116,32,99,104,97,110,103,101,32,97,32,112,114,111,116,101,99,116,101,100,32,109,101,116,97,116,97,98,108,101,0,0,0,0,0,101,110,100,0,0,0,0,0,115,116,114,105,110,103,0,0,95,95,109,101,116,97,116,97,98,108,101,0,0,0,0,0,76,85,65,95,80,65,84,72,0,0,0,0,0,0,0,0,98,121,116,101,0,0,0,0,109,97,120,110,0,0,0,0,115,116,114,105,110,103,0,0,101,120,105,116,0,0,0,0,110,105,108,32,111,114,32,116,97,98,108,101,32,101,120,112,101,99,116,101,100,0,0,0,97,98,115,0,0,0,0,0,70,73,76,69,42,0,0,0,98,97,115,101,32,111,117,116,32,111,102,32,114,97,110,103,101,0,0,0,0,0,0,0,116,97,98,108,101,0,0,0,103,101,116,114,101,103,105,115,116,114,121,0,0,0,0,0,119,114,97,112,0,0,0,0,98,97,100,32,97,114,103,117,109,101,110,116,32,35,37,100,32,116,111,32,39,37,115,39,32,40,37,115,41,0,0,0,37,115,58,32,37,112,0,0,103,101,116,32,108,101,110,103,116,104,32,111,102,0,0,0,117,110,101,120,112,101,99,116,101,100,32,101,110,100,0,0,61,40,100,101,98,117,103,32,99,111,109,109,97,110,100,41,0,0,0,0,0,0,0,0,116,97,98,108,101,0,0,0,110,105,108,0,0,0,0,0,105,110,105,116,0,0,0,0,97,114,103,0,0,0,0,0,99,111,110,116,10,0,0,0,10,13,0,0,0,0,0,0,102,97,108,115,101,0,0,0,111,115,0,0,0,0,0,0,97,98,115,101,110,116,0,0,108,117,97,95,100,101,98,117,103,62,32,0,0,0,0,0,116,114,117,101,0,0,0,0,97,116,116,101,109,112,116,32,116,111,32,99,111,109,112,97,114,101,32,37,115,32,119,105,116,104,32,37,115,0,0,0,95,95,105,110,100,101,120,0,101,120,116,101,114,110,97,108,32,104,111,111,107,0,0,0,95,95,116,111,115,116,114,105,110,103,0,0,0,0,0,0,115,101,101,97,108,108,0,0,102,117,110,99,0,0,0,0,116,111,111,32,109,97,110,121,32,114,101,115,117,108,116,115,32,116,111,32,117,110,112,97,99,107,0,0,0,0,0,0,108,111,97,100,108,105,98,0,97,99,116,105,118,101,108,105,110,101,115,0,0,0,0,0,109,97,116,104,0,0,0,0,120,112,99,97,108,108,0,0,101,108,115,101,105,102,0,0,10,9,110,111,32,102,105,101,108,100,32,112,97,99,107,97,103,101,46,112,114,101,108,111,97,100,91,39,37,115,39,93,0,0,0,0,0,0,0,0,111,115,0,0,0,0,0,0,110,97,109,101,119,104,97,116,0,0,0,0,0,0,0,0,117,110,112,97,99,107,0,0,99,104,117,110,107,32,104,97,115,32,116,111,111,32,109,97,110,121,32,108,105,110,101,115,0,0,0,0,0,0,0,0,112,97,116,104,0,0,0,0,39,112,97,99,107,97,103,101,46,112,114,101,108,111,97,100,39,32,109,117,115,116,32,98,101,32,97,32,116,97,98,108,101,0,0,0,0,0,0,0,95,95,105,110,100,101,120,0,101,110,100,0,0,0,0,0,103,101,116,110,0,0,0,0,110,97,109,101,0,0,0,0,116,121,112,101,0,0,0,0,101,120,101,99,117,116,101,0,110,101,115,116,105,110,103,32,111,102,32,91,91,46,46,46,93,93,32,105,115,32,100,101,112,114,101,99,97,116,101,100,0,0,0,0,0,0,0,0,109,111,100,0,0,0,0,0,99,117,114,0,0,0,0,0,110,117,112,115,0,0,0,0,116,111,115,116,114,105,110,103,0,0,0,0,0,0,0,0,112,111,112,101,110,0,0,0,117,110,102,105,110,105,115,104,101,100,32,108,111,110,103,32,99,111,109,109,101,110,116,0,103,101,116,108,111,99,97,108,0,0,0,0,0,0,0,0,114,0,0,0,0,0,0,0,115,101,116,0,0,0,0,0,99,117,114,114,101,110,116,108,105,110,101,0,0,0,0,0,116,111,110,117,109,98,101,114,0,0,0,0,0,0,0,0,115,116,97,116,117,115,0,0,63,0,0,0,0,0,0,0,117,110,102,105,110,105,115,104,101,100,32,108,111,110,103,32,115,116,114,105,110,103,0,0,115,116,114,105,110,103,32,108,101,110,103,116,104,32,111,118,101,114,102,108,111,119,0,0,105,111,0,0,0,0,0,0,10,9,110,111,32,102,105,108,101,32,39,37,115,39,0,0,98,97,100,32,99,111,100,101,0,0,0,0,0,0,0,0,97,116,116,101,109,112,116,32,116,111,32,121,105,101,108,100,32,97,99,114,111,115,115,32,109,101,116,97,109,101,116,104,111,100,47,67,45,99,97,108,108,32,98,111,117,110,100,97,114,121,0,0,0,0,0,0,108,105,110,101,0,0,0,0,119,104,97,116,0,0,0,0,115,101,116,109,101,116,97,116,97,98,108,101,0,0,0,0,115,116,114,105,110,103,0,0,101,115,99,97,112,101,32,115,101,113,117,101,110,99,101,32,116,111,111,32,108,97,114,103,101,0,0,0,0,0,0,0,63,0,0,0,0,0,0,0,99,111,110,115,116,97,110,116,32,116,97,98,108,101,32,111,118,101,114,102,108,111,119,0,102,117,108,108,0,0,0,0,108,97,115,116,108,105,110,101,100,101,102,105,110,101,100,0,115,101,116,102,101,110,118,0,97,116,116,101,109,112,116,32,116,111,32,99,111,109,112,97,114,101,32,116,119,111,32,37,115,32,118,97,108,117,101,115,0,0,0,0,0,0,0,0,117,110,102,105,110,105,115,104,101,100,32,115,116,114,105,110,103,0,0,0,0,0,0,0,39,112,97,99,107,97,103,101,46,37,115,39,32,109,117,115,116,32,98,101,32,97,32,115,116,114,105,110,103,0,0,0,115,116,114,105,110,103,32,115,108,105,99,101,32,116,111,111,32,108,111,110,103,0,0,0,110,111,0,0,0,0,0,0,108,105,110,101,100,101,102,105,110,101,100,0,0,0,0,0,115,101,108,101,99,116,0,0,108,101,120,105,99,97,108,32,101,108,101,109,101,110,116,32,116,111,111,32,108,111,110,103,0,0,0,0,0,0,0,0,102,117,110,99,116,105,111,110,32,111,114,32,101,120,112,114,101,115,115,105,111,110,32,116,111,111,32,99,111,109,112,108,101,120,0,0,0,0,0,0,47,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,118,97,108,117,101,0,0,0,102,105,108,101,32,40,37,112,41,0,0,0,0,0,0,0,115,104,111,114,116,95,115,114,99,0,0,0,0,0,0,0,114,97,119,115,101,116,0,0,109,97,108,102,111,114,109,101,100,32,110,117,109,98,101,114,0,0,0,0,0,0,0,0,108,117,97,111,112,101,110,95,37,115,0,0,0,0,0,0,117,110,97,98,108,101,32,116,111,32,100,117,109,112,32,103,105,118,101,110,32,102,117,110,99,116,105,111,110,0,0,0,102,105,108,101,32,40,99,108,111,115,101,100,41,0,0,0,115,111,117,114,99,101,0,0,114,97,119,103,101,116,0,0,43,45,0,0,0,0,0,0,69,101,0,0,0,0,0,0,95,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,102,111,114,109,97,116,32,40,119,105,100,116,104,32,111,114,32,112,114,101,99,105,115,105,111,110,32,116,111,111,32,108,111,110,103,41,0,0,0,0,95,95,116,111,115,116,114,105,110,103,0,0,0,0,0,0,105,110,118,97,108,105,100,32,111,112,116,105,111,110,0,0,100,101,98,117,103,0,0,0,114,97,119,101,113,117,97,108,0,0,0,0,0,0,0,0,99,111,110,116,114,111,108,32,115,116,114,117,99,116,117,114,101,32,116,111,111,32,108,111,110,103,0,0,0,0,0,0,46,0,0,0,0,0,0,0,101,108,115,101,0,0,0,0,105,110,118,97,108,105,100,32,102,111,114,109,97,116,32,40,114,101,112,101,97,116,101,100,32,102,108,97,103,115,41,0,95,95,103,99,0,0,0,0,105,111,0,0,0,0,0,0,102,117,110,99,116,105,111,110,32,111,114,32,108,101,118,101,108,32,101,120,112,101,99,116,101,100,0,0,0,0,0,0,112,114,105,110,116,0,0,0,46,0,0,0,0,0,0,0,108,111,97,100,101,114,115,0,45,43,32,35,48,0,0,0,115,101,116,118,98,117,102,0,102,111,114,101,97,99,104,105,0,0,0,0,0,0,0,0,62,37,115,0,0,0,0,0,112,99,97,108,108,0,0,0,100,105,102,102,116,105,109,101,0,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,108,111,110,103,32,115,116,114,105,110,103,32,100,101,108,105,109,105,116,101,114,0,0,0,102,109,111,100,0,0,0,0,76,79,65,68,76,73,66,58,32,0,0,0,0,0,0,0,115,101,101,107,0,0,0,0,102,108,110,83,117,0,0,0,110,101,120,116,0,0,0,0,115,116,100,101,114,114,0,0,37,115,32,110,101,97,114,32,39,37,115,39,0,0,0,0,103,101,116,105,110,102,111,0,37,115,37,115,0,0,0,0,92,48,48,48,0,0,0,0,119,114,111,110,103,32,110,117,109,98,101,114,32,111,102,32,97,114,103,117,109,101,110,116,115,0,0,0,0,0,0,0,95,95,105,110,100,101,120,0,39,115,101,116,102,101,110,118,39,32,99,97,110,110,111,116,32,99,104,97,110,103,101,32,101,110,118,105,114,111,110,109,101,110,116,32,111,102,32,103,105,118,101,110,32,111,98,106,101,99,116,0,0,0,0,0,108,111,97,100,115,116,114,105,110,103,0,0,0,0,0,0,114,117,110,110,105,110,103,0,99,97,108,108,105,110,103,32,39,37,115,39,32,111,110,32,98,97,100,32,115,101,108,102,32,40,37,115,41,0,0,0,37,115,58,37,100,58,32,37,115,0,0,0,0,0,0,0,108,111,111,112,32,105,110,32,115,101,116,116,97,98,108,101,0,0,0,0,0,0,0,0,100,121,110,97,109,105,99,32,108,105,98,114,97,114,105,101,115,32,110,111,116,32,101,110,97,98,108,101,100,59,32,99,104,101,99,107,32,121,111,117,114,32,76,117,97,32,105,110,115,116,97,108,108,97,116,105,111,110,0,0,0,0,0,0,99,111,114,111,117,116,105,110,101,0,0,0,0,0,0,0,92,114,0,0,0,0,0,0,99,111,100,101,32,116,111,111,32,100,101,101,112,0,0,0,105,110,116,101,114,118,97,108,32,105,115,32,101,109,112,116,121,0,0,0,0,0,0,0,95,95,99,108,111,115,101,0,116,97,105,108,32,114,101,116,117,114,110,0,0,0,0,0,99,97,110,110,111,116,32,114,101,115,117,109,101,32,110,111,110,45,115,117,115,112,101,110,100,101,100,32,99,111,114,111,117,116,105,110,101,0,0,0,108,111,97,100,0,0,0,0,110,117,109,98,101,114,0,0,37,99,0,0,0,0,0,0,105,110,118,97,108,105,100,32,107,101,121,32,116,111,32,39,110,101,120,116,39,0,0,0,101,114,114,111,114,32,108,111,97,100,105,110,103,32,109,111,100,117,108,101,32,39,37,115,39,32,102,114,111,109,32,102,105,108,101,32,39,37,115,39,58,10,9,37,115,0,0,0,105,110,118,97,108,105,100,32,111,112,116,105,111,110,32,39,37,37,37,99,39,32,116,111,32,39,102,111,114,109,97,116,39,0,0,0,0,0,0,0,115,101,108,102,0,0,0,0,116,97,110,0,0,0,0,0,102,105,108,101,32,105,115,32,97,108,114,101,97,100,121,32,99,108,111,115,101,100,0,0,99,111,117,110,116,0,0,0,108,111,97,100,102,105,108,101,0,0,0,0,0,0,0,0,112,101,114,102,111,114,109,32,97,114,105,116,104,109,101,116,105,99,32,111,110,0,0,0,37,0,0,0,0,0,0,0,99,104,97,114,40,37,100,41,0,0,0,0,0,0,0,0,10,9,110,111,32,109,111,100,117,108,101,32,39,37,115,39,32,105,110,32,102,105,108,101,32,39,37,115,39,0,0,0,110,111,32,118,97,108,117,101,0,0,0,0,0,0,0,0,121,100,97,121,0,0,0,0,116,97,110,104,0,0,0,0,97,116,116,101,109,112,116,32,116,111,32,117,115,101,32,97,32,99,108,111,115,101,100,32,102,105,108,101,0,0,0,0,108,105,110,101,0,0,0,0,103,101,116,109,101,116,97,116,97,98,108,101,0,0,0,0,98,97,100,32,97,114,103,117,109,101,110,116,32,35,37,100,32,40,37,115,41,0,0,0,60,101,111,102,62,0,0,0,1,0,0,0,0,0,0,0,39,115,116,114,105,110,103,46,103,102,105,110,100,39,32,119,97,115,32,114,101,110,97,109,101,100,32,116,111,32,39,115,116,114,105,110,103,46,103,109,97,116,99,104,39,0,0,0,119,100,97,121,0,0,0,0,115,113,114,116,0,0,0,0,119,0,0,0,0,0,0,0,114,101,116,117,114,110,0,0,103,101,116,102,101,110,118,0,60,115,116,114,105,110,103,62,0,0,0,0,0,0,0,0,59,1,59,0,0,0,0,0,105,110,118,97,108,105,100,32,114,101,112,108,97,99,101,109,101,110,116,32,118,97,108,117,101,32,40,97,32,37,115,41,0,0,0,0,0,0,0,0,42,116,0,0,0,0,0,0,115,105,110,0,0,0,0,0,39,112,111,112,101,110,39,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,0,0,99,97,108,108,0,0,0,0,103,99,105,110,102,111,0,0,60,110,97,109,101,62,0,0,59,59,0,0,0,0,0,0,115,116,114,105,110,103,47,102,117,110,99,116,105,111,110,47,116,97,98,108,101,32,101,120,112,101,99,116,101,100,0,0,37,99,0,0,0,0,0,0,115,105,110,104,0,0,0,0,114,0,0,0,0,0,0,0,108,101,118,101,108,32,111,117,116,32,111,102,32,114,97,110,103,101,0,0,0,0,0,0,101,114,114,111,114,0,0,0,99,104,117,110,107,32,104,97,115,32,116,111,111,32,109,97,110,121,32,115,121,110,116,97,120,32,108,101,118,101,108,115,0,0,0,0,0,0,0,0,60,110,117,109,98,101,114,62,0,0,0,0,0,0,0,0,126,61,0,0,0,0,0,0,95,80,65,67,75,65,71,69,0,0,0,0,0,0,0,0,37,46,49,52,103,0,0,0,105,110,118,97,108,105,100,32,112,97,116,116,101,114,110,32,99,97,112,116,117,114,101,0,37,115,58,32,37,115,0,0,100,111,0,0,0,0,0,0,114,97,110,100,111,109,115,101,101,100,0,0,0,0,0,0,37,108,102,0,0,0,0,0,116,97,98,108,101,0,0,0,110,105,108,32,111,114,32,116,97,98,108,101,32,101,120,112,101,99,116,101,100,0,0,0,100,111,102,105,108,101,0,0,95,95,99,97,108,108,0,0,39,37,115,39,32,101,120,112,101,99,116,101,100,0,0,0,99,111,110,115,116,97,110,116,32,116,97,98,108,101,32,111,118,101,114,102,108,111,119,0,112,97,99,107,97,103,101,0,95,77,0,0,0,0,0,0,117,110,98,97,108,97,110,99,101,100,32,112,97,116,116,101,114,110,0,0,0,0,0,0,103,102,105,110,100,0,0,0,110,117,109,101,114,105,99,0,114,97,110,100,111,109,0,0,105,110,118,97,108,105,100,32,102,111,114,109,97,116,0,0,102,111,114,101,97,99,104,0,32,105,110,32,102,117,110,99,116,105,111,110,32,60,37,115,58,37,100,62,0,0,0,0,99,111,108,108,101,99,116,103,97,114,98,97,103,101,0,0,99,97,110,110,111,116,32,37,115,32,37,115,58,32,37,115,0,0,0,0,0,0,0,0,95,95,99,111,110,99,97,116,0,0,0,0,0,0,0,0,39,37,115,39,32,101,120,112,101,99,116,101,100,32,40,116,111,32,99,108,111,115,101,32,39,37,115,39,32,97,116,32,108,105,110,101,32,37,100,41,0,0,0,0,0,0,0,0,100,97,116,101,0,0,0,0,60,61,0,0,0,0,0,0,104,117,103,101,0,0,0,0,39,109,111,100,117,108,101,39,32,110,111,116,32,99,97,108,108,101,100,32,102,114,111,109,32,97,32,76,117,97,32,102,117,110,99,116,105,111,110,0,109,97,108,102,111,114,109,101,100,32,112,97,116,116,101,114,110,32,40,109,105,115,115,105,110,103,32,39,93,39,41,0,109,111,110,101,116,97,114,121,0,0,0,0,0,0,0,0,114,97,100,0,0,0,0,0,105,110,118,97,108,105,100,32,111,112,116,105,111,110,0,0,32,63,0,0,0,0,0,0,97,115,115,101,114,116,0,0,10,0,0,0,0,0,0,0,115,116,100,111,117,116,0,0,95,95,108,101,0,0,0,0,40,102,111,114,32,115,116,101,112,41,0,0,0,0,0,0,62,61,0,0,0,0,0,0,103,101,116,104,111,111,107,0,102,0,0,0,0,0,0,0,109,97,108,102,111,114,109,101,100,32,112,97,116,116,101,114,110,32,40,101,110,100,115,32,119,105,116,104,32,39,37,37,39,41,0,0,0,0,0,0,99,116,121,112,101,0,0,0,112,111,119,0,0,0,0,0,116,111,111,32,109,97,110,121,32,97,114,103,117,109,101,110,116,115,0,0,0,0,0,0,32,105,110,32,109,97,105,110,32,99,104,117,110,107,0,0,98,111,111,108,101,97,110,32,111,114,32,112,114,111,120,121,32,101,120,112,101,99,116,101,100,0,0,0,0,0,0,0,80,65,78,73,67,58,32,117,110,112,114,111,116,101,99,116,101,100,32,101,114,114,111,114,32,105,110,32,99,97,108,108,32,116,111,32,76,117,97,32,65,80,73,32,40,37,115,41,10,0,0,0,0,0,0,0,114,101,115,117,109,101,0,0,95,95,108,116,0,0,0,0,40,102,111,114,32,108,105,109,105,116,41,0,0,0,0,0,109,101,116,104,111,100,0,0,61,61,0,0,0,0,0,0,108,111,111,112,32,105,110,32,103,101,116,116,97,98,108,101,0,0,0,0,0,0,0,0,95,78,65,77,69,0,0,0,109,105,115,115,105,110,103,32,39,91,39,32,97,102,116,101,114,32,39,37,37,102,39,32,105,110,32,112,97,116,116,101,114,110,0,0,0,0,0,0,61,63,0,0,0,0,0,0,99,111,108,108,97,116,101,0,109,111,100,102,0,0,0,0,102,105,108,101,0,0,0,0,32,105,110,32,102,117,110,99,116,105,111,110,32,39,37,115,39,0,0,0,0,0,0,0,110,101,119,112,114,111,120,121,0,0,0,0,0,0,0,0,114,101,97,100,0,0,0,0,67,32,115,116,97,99,107,32,111,118,101,114,102,108,111,119,0,0,0,0,0,0,0,0,95,95,108,101,110,0,0,0,117,115,101,114,100,97,116,97,0,0,0,0,0,0,0,0,40,102,111,114,32,105,110,100,101,120,41,0,0,0,0,0,46,46,46,0,0,0,0,0,116,97,98,108,101,32,111,118,101,114,102,108,111,119,0,0,46,46,0,0,0,0,0,0,110,105,108,0,0,0,0,0,110,97,109,101,32,99,111,110,102,108,105,99,116,32,102,111,114,32,109,111,100,117,108,101,32,39,37,115,39,0,0,0,117,110,102,105,110,105,115,104,101,100,32,99,97,112,116,117,114,101,0,0,0,0,0,0,99,97,110,110,111,116,32,117,115,101,32,39,46,46,46,39,32,111,117,116,115,105,100,101,32,97,32,118,97,114,97,114,103,32,102,117,110,99,116,105,111,110,0,0,0,0,0,0,97,108,108,0,0,0,0,0,109,105,110,0,0,0,0,0,99,108,111,115,101,100,32,102,105,108,101,0,0,0,0,0,37,100,58,0,0,0,0,0,95,95,109,111,100,101,0,0,114,101,111,112,101,110,0,0,95,95,117,110,109,0,0,0,40,102,111,114,32,99,111,110,116,114,111,108,41,0,0,0,37,112,0,0,0,0,0,0,99,111,110,99,97,116,101,110,97,116,101,0,0,0,0,0,110,111,116,32,101,110,111,117,103,104,32,109,101,109,111,114,121,0,0,0,0,0,0,0,119,104,105,108,101,0,0,0,109,111,100,117,108,101,32,39,37,115,39,32,110,111,116,32,102,111,117,110,100,58,37,115,0,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,99,97,112,116,117,114,101,32,105,110,100,101,120,0,0,0,102,105,101,108,100,32,39,37,115,39,32,109,105,115,115,105,110,103,32,105,110,32,100,97,116,101,32,116,97,98,108,101,0,0,0,0,0,0,0,0,109,97,120,0,0,0,0,0,37,46,49,52,103,0,0,0,37,115,58,0,0,0,0,0,107,118,0,0,0,0,0,0,114,98,0,0,0,0,0,0,95,95,112,111,119,0,0,0,40,102,111,114,32,115,116,97,116,101,41,0,0,0,0,0,40,42,116,101,109,112,111,114,97,114,121,41,0,0,0,0,63,0,0,0,0,0,0,0,40,110,117,108,108,41,0,0,117,110,116,105,108,0,0,0,116,97,98,108,101,32,105,110,100,101,120,32,105,115,32,110,105,108,0,0,0,0,0,0,116,111,111,32,109,97,110,121,32,99,97,112,116,117,114,101,115,0,0,0,0,0,0,0,105,115,100,115,116,0,0,0,108,111,103,0,0,0,0,0,115,116,97,110,100,97,114,100,32,37,115,32,102,105,108,101,32,105,115,32,99,108,111,115,101,100,0,0,0,0,0,0,83,110,108,0,0,0,0,0,112,97,105,114,115,0,0,0,95,95,109,111,100,0,0,0,40,102,111,114,32,103,101,110,101,114,97,116,111,114,41,0,61,40,116,97,105,108,32,99,97,108,108,41,0,0,0,0,97,116,116,101,109,112,116,32,116,111,32,37,115,32,97,32,37,115,32,118,97,108,117,101,0,0,0,0,0,0,0,0,116,114,117,101,0,0,0,0,39,112,97,99,107,97,103,101,46,108,111,97,100,101,114,115,39,32,109,117,115,116,32,98,101,32,97,32,116,97,98,108,101,0,0,0,0,0,0,0,94,36,42,43,63,46,40,91,37,45,0,0,0,0,0,0,121,101,97,114,0,0,0,0,110,111,116,32,101,110,111,117,103,104,32,109,101,109,111,114,121,0,0,0,0,0,0,0,108,111,103,49,48,0,0,0,119,114,105,116,101,0,0,0,10,9,0,0,0,0,0,0,105,112,97,105,114,115,0,0,111,112,101,110,0,0,0,0,95,95,100,105,118,0,0,0,39,61,39,32,111,114,32,39,105,110,39,32,101,120,112,101,99,116,101,100,0,0,0,0,116,97,105,108,0,0,0,0,116,104,101,110,0,0,0,0,108,111,111,112,32,111,114,32,112,114,101,118,105,111,117,115,32,101,114,114,111,114,32,108,111,97,100,105,110,103,32,109,111,100,117,108,101,32,39,37,115,39,0,0,0,0,0,0,117,112,112,101,114,0,0,0,109,111,110,116,104,0,0,0,108,100,101,120,112,0,0,0,116,121,112,101,0,0,0,0,10,9,46,46,46,0,0,0,95,86,69,82,83,73,79,78,0,0,0,0,0,0,0,0,114,0,0,0,0,0,0,0,95,95,109,117,108,0,0,0,110,111,32,108,111,111,112,32,116,111,32,98,114,101,97,107,0,0,0,0,0,0,0,0,76,117,97,0,0,0,0,0,114,101,116,117,114,110,0,0,114,101,113,117,105,114,101,0,115,117,98,0,0,0,0,0,100,97,121,0,0,0,0,0,102,114,101,120,112,0,0,0,116,109,112,102,105,108,101,0,112,97,99,107,97,103,101,0,98,114,101,97,107,0,0,0,115,116,97,99,107,32,116,114,97,99,101,98,97,99,107,58,0,0,0,0,0,0,0,0,76,117,97,32,53,46,49,0,64,37,115,0,0,0,0,0,95,95,115,117,98,0,0,0,109,97,105,110,0,0,0,0,95,95,103,99,0,0,0,0,114,101,112,101,97,116,0,0,109,111,100,117,108,101,0,0,114,101,118,101,114,115,101,0,103,109,97,116,99,104,0,0,104,111,117,114,0,0,0,0,115,121,110,116,97,120,32,101,114,114,111,114,0,0,0,0,102,108,111,111,114,0,0,0,114,101,97,100,0,0,0,0,99,111,110,99,97,116,0,0,10,0,0,0,0,0,0,0,95,71,0,0,0,0,0,0,61,115,116,100,105,110,0,0,95,95,97,100,100,0,0,0,117,112,118,97,108,117,101,115,0,0,0,0,0,0,0,0,67,0,0,0,0,0,0,0,99,108,111,99,107,0,0,0,99,111,100,101,32,115,105,122,101,32,111,118,101,114,102,108,111,119,0,0,0,0,0,0,111,114,0,0,0,0,0,0,112,105,0,0,0,0,0,0,112,114,101,108,111,97,100,0,114,101,112,0,0,0,0,0,105,110,118,97,108,105,100,32,118,97,108,117,101,32,40,37,115,41,32,97,116,32,105,110,100,101,120,32,37,100,32,105,110,32,116,97,98,108,101,32,102,111,114,32,39,99,111,110,99,97,116,39,0,0,0,0,109,105,110,0,0,0,0,0,101,120,112,0,0,0,0,0,111,117,116,112,117,116,0,0,76,117,97,32,102,117,110,99,116,105,111,110,32,101,120,112,101,99,116,101,100,0,0,0,110,97,109,101,32,99,111,110,102,108,105,99,116,32,102,111,114,32,109,111,100,117,108,101,32,39,37,115,39,0,0,0,115,116,100,105,110,0,0,0,95,95,101,113,0,0,0,0,117,110,101,120,112,101,99,116,101,100,32,115,121,109,98,111,108,0,0,0,0,0,0,0,61,91,67,93,0,0,0,0,110,111,116,0,0,0,0,0,103,101,116,102,101,110,118,0,108,111,97,100,101,100,0,0,109,97,116,99,104,0,0,0,119,114,111,110,103,32,110,117,109,98,101,114,32,111,102,32,97,114,103,117,109,101,110,116,115,32,116,111,32,39,105,110,115,101,114,116,39,0,0,0,115,101,99,0,0,0,0,0,100,101,103,0,0,0,0,0,111,112,101,110,0,0,0,0,116,114,97,99,101,98,97,99,107,0,0,0,0,0,0,0,99,111,114,111,117,116,105,110,101,32,101,120,112,101,99,116,101,100,0,0,0,0,0,0,95,76,79,65,68,69,68,0,99,114,101,97,116,101,0,0,95,95,109,111,100,101,0,0,102,117,110,99,116,105,111,110,32,97,114,103,117,109,101,110,116,115,32,101,120,112,101,99,116,101,100,0,0,0,0,0,110,0,0,0,0,0,0,0,110,105,108,0,0,0,0,0,105,110,100,101,120,0,0,0,95,76,79,65,68,69,68,0,108,111,119,101,114,0,0,0,39,115,101,116,110,39,32,105,115,32,111,98,115,111,108,101,116,101,0,0,0,0,0,0,98,105,110,97,114,121,32,115,116,114,105,110,103,0,0,0,117,110,97,98,108,101,32,116,111,32,103,101,110,101,114,97,116,101,32,97,32,117,110,105,113,117,101,32,102,105,108,101,110,97,109,101,0,0,0,0,99,111,115,0,0,0,0,0,108,105,110,101,115,0,0,0,115,101,116,117,112,118,97,108,117,101,0,0,0,0,0,0,100,101,97,100,0,0,0,0,118,97,108,117,101,32,101,120,112,101,99,116,101,100,0,0,95,95,103,99,0,0,0,0,101,114,114,111,114,32,105,110,32,101,114,114,111,114,32,104,97,110,100,108,105,110,103,0,98,111,111,108,101,97,110,0,97,109,98,105,103,117,111,117,115,32,115,121,110,116,97,120,32,40,102,117,110,99,116,105,111,110,32,99,97,108,108,32,120,32,110,101,119,32,115,116,97,116,101,109,101,110,116,41,0,0,0,0,0,0,0,0,109,101,116,104,111,100,0,0,116,97,98,108,101,32,105,110,100,101,120,32,105,115,32,78,97,78,0,0,0,0,0,0,108,111,99,97,108,0,0,0,99,111,110,102,105,103,0,0,108,101,110,0,0,0,0,0,118,97,114,105,97,98,108,101,115,32,105,110,32,97,115,115,105,103,110,109,101,110,116,0,105,110,118,97,108,105,100,32,111,114,100,101,114,32,102,117,110,99,116,105,111,110,32,102,111,114,32,115,111,114,116,105,110,103,0,0,0,0,0,0,116,109,112,110,97,109,101,0,99,111,115,104,0,0,0,0,105,110,112,117,116,0,0,0,115,101,116,109,101,116,97,116,97,98,108,101,0,0,0,0,110,111,114,109,97,108,0,0,115,116,97,99,107,32,111,118,101,114,102,108,111,119,32,40,37,115,41,0,0,0,0,0,95,95,110,101,119,105,110,100,101,120,0,0,0,0,0,0,102,117,110,99,116,105,111,110,32,97,116,32,108,105,110,101,32,37,100,32,104,97,115,32,109,111,114,101,32,116,104,97].concat([110,32,37,100,32,37,115,0,117,112,118,97,108,117,101,0,105,110,0,0,0,0,0,0,47,10,59,10,63,10,33,10,45,0,0,0,0,0,0,0,103,115,117,98,0,0,0,0,116,105,109,101,0,0,0,0,99,101,105,108,0,0,0,0,102,108,117,115,104,0,0,0,115,101,116,108,111,99,97,108,0,0,0,0,0,0,0,0,115,117,115,112,101,110,100,101,100,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,111,112,116,105,111,110,32,39,37,115,39,0,0,0,0,0,95,95,105,110,100,101,120,0,109,97,105,110,32,102,117,110,99,116,105,111,110,32,104,97,115,32,109,111,114,101,32,116,104,97,110,32,37,100,32,37,115,0,0,0,0,0,0,0,63,0,0,0,0,0,0,0,110,111,32,118,97,108,117,101,0,0,0,0,0,0,0,0,110,111,32,99,97,108,108,105,110,103,32,101,110,118,105,114,111,110,109,101,110,116,0,0,104,0,0,0,0,0,0,0])
, "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  Module["_strlen"] = _strlen;
  var _llvm_va_start=undefined;
  function _llvm_va_end() {}
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  var _floor=Math.floor;
  var _llvm_pow_f64=Math.pow;
  function _llvm_lifetime_start() {}
  function _llvm_lifetime_end() {}
  function _strchr(ptr, chr) {
      ptr--;
      do {
        ptr++;
        var val = HEAP8[(ptr)];
        if (val == chr) return ptr;
      } while (val);
      return 0;
    }
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:35,EIDRM:36,ECHRNG:37,EL2NSYNC:38,EL3HLT:39,EL3RST:40,ELNRNG:41,EUNATCH:42,ENOCSI:43,EL2HLT:44,EDEADLK:45,ENOLCK:46,EBADE:50,EBADR:51,EXFULL:52,ENOANO:53,EBADRQC:54,EBADSLT:55,EDEADLOCK:56,EBFONT:57,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:74,EDOTDOT:76,EBADMSG:77,ENOTUNIQ:80,EBADFD:81,EREMCHG:82,ELIBACC:83,ELIBBAD:84,ELIBSCN:85,ELIBMAX:86,ELIBEXEC:87,ENOSYS:88,ENOTEMPTY:90,ENAMETOOLONG:91,ELOOP:92,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:106,EPROTOTYPE:107,ENOTSOCK:108,ENOPROTOOPT:109,ESHUTDOWN:110,ECONNREFUSED:111,EADDRINUSE:112,ECONNABORTED:113,ENETUNREACH:114,ENETDOWN:115,ETIMEDOUT:116,EHOSTDOWN:117,EHOSTUNREACH:118,EINPROGRESS:119,EALREADY:120,EDESTADDRREQ:121,EMSGSIZE:122,EPROTONOSUPPORT:123,ESOCKTNOSUPPORT:124,EADDRNOTAVAIL:125,ENETRESET:126,EISCONN:127,ENOTCONN:128,ETOOMANYREFS:129,EUSERS:131,EDQUOT:132,ESTALE:133,ENOTSUP:134,ENOMEDIUM:135,EILSEQ:138,EOVERFLOW:139,ECANCELED:140,ENOTRECOVERABLE:141,EOWNERDEAD:142,ESTRPIPE:143};
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"No message of desired type",36:"Identifier removed",37:"Channel number out of range",38:"Level 2 not synchronized",39:"Level 3 halted",40:"Level 3 reset",41:"Link number out of range",42:"Protocol driver not attached",43:"No CSI structure available",44:"Level 2 halted",45:"Deadlock condition",46:"No record locks available",50:"Invalid exchange",51:"Invalid request descriptor",52:"Exchange full",53:"No anode",54:"Invalid request code",55:"Invalid slot",56:"File locking deadlock error",57:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",74:"Multihop attempted",76:"Cross mount point (not really error)",77:"Trying to read unreadable message",80:"Given log. name not unique",81:"f.d. invalid for this operation",82:"Remote address changed",83:"Can   access a needed shared lib",84:"Accessing a corrupted shared lib",85:".lib section in a.out corrupted",86:"Attempting to link in too many libs",87:"Attempting to exec a shared library",88:"Function not implemented",90:"Directory not empty",91:"File or path name too long",92:"Too many symbolic links",95:"Operation not supported on transport endpoint",96:"Protocol family not supported",104:"Connection reset by peer",105:"No buffer space available",106:"Address family not supported by protocol family",107:"Protocol wrong type for socket",108:"Socket operation on non-socket",109:"Protocol not available",110:"Can't send after socket shutdown",111:"Connection refused",112:"Address already in use",113:"Connection aborted",114:"Network is unreachable",115:"Network interface is not configured",116:"Connection timed out",117:"Host is down",118:"Host is unreachable",119:"Connection already in progress",120:"Socket already connected",121:"Destination address required",122:"Message too long",123:"Unknown protocol",124:"Socket type not supported",125:"Address not available",126:"Connection reset by network",127:"Socket is already connected",128:"Socket is not connected",129:"Too many references",131:"Too many users",132:"Quota exceeded",133:"Stale file handle",134:"Not supported",135:"No medium (in tape drive)",138:"Illegal byte sequence",139:"Value too large for defined data type",140:"Operation canceled",141:"State not recoverable",142:"Previous owner died",143:"Streams pipe error"};
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value
      return value;
    }
  var VFS=undefined;
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path, ext) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var f = PATH.splitPath(path)[2];
        if (ext && f.substr(-1 * ext.length) === ext) {
          f = f.substr(0, f.length - ext.length);
        }
        return f;
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.filter(function(p, index) {
          if (typeof p !== 'string') {
            throw new TypeError('Arguments to path.join must be strings');
          }
          return p;
        }).join('/'));
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  var MEMFS={CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },mount:function (mount) {
        return MEMFS.create_node(null, '/', 0040000 | 0777, 0);
      },create_node:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            lookup: MEMFS.node_ops.lookup,
            mknod: MEMFS.node_ops.mknod,
            mknod: MEMFS.node_ops.mknod,
            rename: MEMFS.node_ops.rename,
            unlink: MEMFS.node_ops.unlink,
            rmdir: MEMFS.node_ops.rmdir,
            readdir: MEMFS.node_ops.readdir,
            symlink: MEMFS.node_ops.symlink
          };
          node.stream_ops = {
            llseek: MEMFS.stream_ops.llseek
          };
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          };
          node.stream_ops = {
            llseek: MEMFS.stream_ops.llseek,
            read: MEMFS.stream_ops.read,
            write: MEMFS.stream_ops.write,
            allocate: MEMFS.stream_ops.allocate,
            mmap: MEMFS.stream_ops.mmap
          };
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            readlink: MEMFS.node_ops.readlink
          };
          node.stream_ops = {};
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          };
          node.stream_ops = FS.chrdev_stream_ops;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.create_node(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.create_node(parent, newname, 0777 | 0120000, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          var size = Math.min(contents.length - position, length);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            assert(buffer.length);
            if (canOwn && buffer.buffer === HEAP8.buffer && offset === 0) {
              node.contents = buffer; // this is a subarray of the heap, and we can own it
              node.contentMode = MEMFS.CONTENT_OWNING;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 0x02) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,devices:[null],streams:[null],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
        },handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + new Error().stack;
        return ___setErrNo(e.errno);
      },cwd:function () {
        return FS.currentPath;
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.currentPath, path);
        opts = opts || { recurse_count: 0 };
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
        // start at the root
        var current = FS.root;
        var current_path = '/';
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join(current_path, parts[i]);
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            current = current.mount.root;
          }
          // follow symlinks
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            return path ? PATH.join(node.mount.mountpoint, path) : node.mount.mountpoint;
          }
          path = path ? PATH.join(node.name, path) : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          if (node.parent.id === parent.id && node.name === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        var node = {
          id: FS.nextInode++,
          name: name,
          mode: mode,
          node_ops: {},
          stream_ops: {},
          rdev: rdev,
          parent: null,
          mount: null
        };
        if (!parent) {
          parent = node;  // root node sets parent to itself
        }
        node.parent = parent;
        node.mount = parent.mount;
        // compatibility
        var readMode = 292 | 73;
        var writeMode = 146;
        // NOTE we must use Object.defineProperties instead of individual calls to
        // Object.defineProperty in order to make closure compiler happy
        Object.defineProperties(node, {
          read: {
            get: function() { return (node.mode & readMode) === readMode; },
            set: function(val) { val ? node.mode |= readMode : node.mode &= ~readMode; }
          },
          write: {
            get: function() { return (node.mode & writeMode) === writeMode; },
            set: function(val) { val ? node.mode |= writeMode : node.mode &= ~writeMode; }
          },
          isFolder: {
            get: function() { return FS.isDir(node.mode); },
          },
          isDevice: {
            get: function() { return FS.isChrdev(node.mode); },
          },
        });
        FS.hashAddNode(node);
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return node.mounted;
      },isFile:function (mode) {
        return (mode & 0170000) === 0100000;
      },isDir:function (mode) {
        return (mode & 0170000) === 0040000;
      },isLink:function (mode) {
        return (mode & 0170000) === 0120000;
      },isChrdev:function (mode) {
        return (mode & 0170000) === 0020000;
      },isBlkdev:function (mode) {
        return (mode & 0170000) === 0060000;
      },isFIFO:function (mode) {
        return (mode & 0170000) === 0010000;
      },isSocket:function (mode) {
        return (mode & 0140000) === 0140000;
      },flagModes:{"r":0,"rs":8192,"r+":2,"w":1537,"wx":3585,"xw":3585,"w+":1538,"wx+":3586,"xw+":3586,"a":521,"ax":2569,"xa":2569,"a+":522,"ax+":2570,"xa+":2570},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 3;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 1024)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.currentPath) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 3) !== 0 ||  // opening for write
              (flags & 1024)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 1;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        // compatibility
        Object.defineProperties(stream, {
          object: {
            get: function() { return stream.node; },
            set: function(val) { stream.node = val; }
          },
          isRead: {
            get: function() { return (stream.flags & 3) !== 1; }
          },
          isWrite: {
            get: function() { return (stream.flags & 3) !== 0; }
          },
          isAppend: {
            get: function() { return (stream.flags & 8); }
          }
        });
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },mount:function (type, opts, mountpoint) {
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          root: null
        };
        var lookup;
        if (mountpoint) {
          lookup = FS.lookupPath(mountpoint, { follow: false });
        }
        // create a root node for the fs
        var root = type.mount(mount);
        root.mount = mount;
        mount.root = root;
        // assign the mount info to the mountpoint's node
        if (lookup) {
          lookup.node.mount = mount;
          lookup.node.mounted = true;
          // compatibility update FS.root if we mount to /
          if (mountpoint === '/') {
            FS.root = mount.root;
          }
        }
        return root;
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 0666;
        mode &= 4095;
        mode |= 0100000;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 0777;
        mode &= 511 | 0001000;
        mode |= 0040000;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 0666;
        }
        mode |= 0020000;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path, { follow: false });
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 3) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        path = PATH.normalize(path);
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 0666 : mode;
        if ((flags & 512)) {
          mode = (mode & 4095) | 0100000;
        } else {
          mode = 0;
        }
        var node;
        try {
          var lookup = FS.lookupPath(path, {
            follow: !(flags & 0200000)
          });
          node = lookup.node;
          path = lookup.path;
        } catch (e) {
          // ignore
        }
        // perhaps we need to create the node
        if ((flags & 512)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 2048)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~1024;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 1024)) {
          FS.truncate(node, 0);
        }
        // register the stream with the filesystem
        var stream = FS.createStream({
          path: path,
          node: node,
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 3) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 3) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 8) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 3) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 3) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.errnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0);
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=stdin.fd;
        assert(stdin.fd === 1, 'invalid handle for stdin (' + stdin.fd + ')');
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=stdout.fd;
        assert(stdout.fd === 2, 'invalid handle for stdout (' + stdout.fd + ')');
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=stderr.fd;
        assert(stderr.fd === 3, 'invalid handle for stderr (' + stderr.fd + ')');
      },staticInit:function () {
        FS.nameTable = new Array(4096);
        FS.root = FS.createNode(null, '/', 0040000 | 0777, 0);
        FS.mount(MEMFS, {}, '/');
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(path, mode | 146);
          var stream = FS.open(path, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(path, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          var LazyUint8Array = function() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
              if (!hasByteServing) chunkSize = datalength;
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          var size = Math.min(contents.length - position, length);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 0040000 | 0777, 0);
      },nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 0140000, 0);
        node.sock = sock;
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {} : ['binary'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
          var handleMessage = function(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (0 /* XXX missing C define POLLRDNORM */ | 1) : 0;
          }
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (0 /* XXX missing C define POLLRDNORM */ | 1);
          }
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 2;
          }
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 1:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr
      var ret = _write(stream, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _putchar(c) {
      // int putchar(int c);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/putchar.html
      return _fputc(c, HEAP32[((_stdout)>>2)]);
    } 
  Module["_saveSetjmp"] = _saveSetjmp;
  Module["_testSetjmp"] = _testSetjmp;function _longjmp(env, value) {
      asm['setThrew'](env, value || 1);
      throw 'longjmp';
    }
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module.print('exit(' + status + ') called');
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }
  var _setjmp=undefined;
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i64=_memset;
  function _iscntrl(chr) {
      return (0 <= chr && chr <= 0x1F) || chr === 0x7F;
    }
  function _isspace(chr) {
      return (chr == 32) || (chr >= 9 && chr <= 13);
    }
  function _isalpha(chr) {
      return (chr >= 97 && chr <= 122) ||
             (chr >= 65 && chr <= 90);
    }
  function _isalnum(chr) {
      return (chr >= 48 && chr <= 57) ||
             (chr >= 97 && chr <= 122) ||
             (chr >= 65 && chr <= 90);
    }
  function _localeconv() {
      // %struct.timeval = type { char* decimal point, other stuff... }
      // var indexes = Runtime.calculateStructAlignment({ fields: ['i32', 'i32'] });
      var me = _localeconv;
      if (!me.ret) {
        me.ret = allocate([allocate(intArrayFromString('.'), 'i8', ALLOC_NORMAL)], 'i8*', ALLOC_NORMAL); // just decimal point, for now
      }
      return me.ret;
    }
  function _memchr(ptr, chr, num) {
      chr = unSign(chr);
      for (var i = 0; i < num; i++) {
        if (HEAP8[(ptr)] == chr) return ptr;
        ptr++;
      }
      return 0;
    }
  function __parseInt(str, endptr, base, min, max, bits, unsign) {
      // Skip space.
      while (_isspace(HEAP8[(str)])) str++;
      // Check for a plus/minus sign.
      var multiplier = 1;
      if (HEAP8[(str)] == 45) {
        multiplier = -1;
        str++;
      } else if (HEAP8[(str)] == 43) {
        str++;
      }
      // Find base.
      var finalBase = base;
      if (!finalBase) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            finalBase = 16;
            str += 2;
          } else {
            finalBase = 8;
            str++;
          }
        }
      } else if (finalBase==16) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            str += 2;
          }
        }
      }
      if (!finalBase) finalBase = 10;
      // Get digits.
      var chr;
      var ret = 0;
      while ((chr = HEAP8[(str)]) != 0) {
        var digit = parseInt(String.fromCharCode(chr), finalBase);
        if (isNaN(digit)) {
          break;
        } else {
          ret = ret * finalBase + digit;
          str++;
        }
      }
      // Apply sign.
      ret *= multiplier;
      // Set end pointer.
      if (endptr) {
        HEAP32[((endptr)>>2)]=str
      }
      // Unsign if needed.
      if (unsign) {
        if (Math.abs(ret) > max) {
          ret = max;
          ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          ret = unSign(ret, bits);
        }
      }
      // Validate range.
      if (ret > max || ret < min) {
        ret = ret > max ? max : min;
        ___setErrNo(ERRNO_CODES.ERANGE);
      }
      if (bits == 64) {
        return ((asm["setTempRet0"]((tempDouble=ret,(+(Math.abs(tempDouble))) >= (+(1)) ? (tempDouble > (+(0)) ? ((Math.min((+(Math.floor((tempDouble)/(+(4294967296))))), (+(4294967295))))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+(4294967296)))))))>>>0) : 0)),ret>>>0)|0);
      }
      return ret;
    }function _strtoul(str, endptr, base) {
      return __parseInt(str, endptr, base, 0, 4294967295, 32, true);  // ULONG_MAX.
    }
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false;
          if (next == 46) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          } else {
            var precision = 6; // Standard default.
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (flagAlwaysSigned) {
                if (currArg < 0) {
                  prefix = '-' + prefix;
                } else {
                  prefix = '+' + prefix;
                }
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (flagAlwaysSigned && currArg >= 0) {
                  argText = '+' + argText;
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }
  Module["_strncpy"] = _strncpy;
  Module["_strcat"] = _strcat;
  function _strcspn(pstr, pset) {
      var str = pstr, set, strcurr, setcurr;
      while (1) {
        strcurr = HEAP8[(str)];
        if (!strcurr) return str - pstr;
        set = pset;
        while (1) {
          setcurr = HEAP8[(set)];
          if (!setcurr || setcurr == strcurr) break;
          set++;
        }
        if (setcurr) return str - pstr;
        str++;
      }
    }
  function _strncat(pdest, psrc, num) {
      var len = _strlen(pdest);
      var i = 0;
      while(1) {
        HEAP8[((pdest+len+i)|0)]=HEAP8[((psrc+i)|0)];
        if (HEAP8[(((pdest)+(len+i))|0)] == 0) break;
        i ++;
        if (i == num) {
          HEAP8[(((pdest)+(len+i))|0)]=0
          break;
        }
      }
      return pdest;
    }
  var _llvm_memset_p0i8_i32=_memset;
  Module["_memcmp"] = _memcmp;
  function _strncmp(px, py, n) {
      var i = 0;
      while (i < n) {
        var x = HEAPU8[(((px)+(i))|0)];
        var y = HEAPU8[(((py)+(i))|0)];
        if (x == y && x == 0) return 0;
        if (x == 0) return -1;
        if (y == 0) return 1;
        if (x == y) {
          i ++;
          continue;
        } else {
          return x > y ? 1 : -1;
        }
      }
      return 0;
    }function _strcmp(px, py) {
      return _strncmp(px, py, TOTAL_MEMORY);
    }var _strcoll=_strcmp;
  function _strstr(ptr1, ptr2) {
      var check = 0, start;
      do {
        if (!check) {
          start = ptr1;
          check = ptr2;
        }
        var curr1 = HEAP8[((ptr1++)|0)];
        var curr2 = HEAP8[((check++)|0)];
        if (curr2 == 0) return start;
        if (curr2 != curr1) {
          // rewind to one character after start, to find ez in eeez
          ptr1 = start + 1;
          check = 0;
        }
      } while (curr1);
      return 0;
    }
  var ___dirent_struct_layout={__size__:1040,d_ino:0,d_name:4,d_off:1028,d_reclen:1032,d_type:1036};function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 1024;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 8;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var ret = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return (ret == -1) ? 0 : ret;
    }
  function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStream(stream);
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop()
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(stream, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) return -1;
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _fread(_fgetc.ret, 1, 1, stream);
      if (ret == 0) {
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)|0)];
      }
    }var _getc=_fgetc;
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      _fsync(stream);
      return _close(stream);
    }function _freopen(filename, mode, stream) {
      // FILE *freopen(const char *restrict filename, const char *restrict mode, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/freopen.html
      if (!filename) {
        var streamObj = FS.getStream(stream);
        if (!streamObj) {
          ___setErrNo(ERRNO_CODES.EBADF);
          return 0;
        }
        if (_freopen.buffer) _free(_freopen.buffer);
        filename = intArrayFromString(streamObj.path);
        filename = allocate(filename, 'i8', ALLOC_NORMAL);
      }
      _fclose(stream);
      return _fopen(filename, mode);
    }
  function _ungetc(c, stream) {
      // int ungetc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ungetc.html
      stream = FS.getStream(stream);
      if (!stream) {
        return -1;
      }
      if (c === -1) {
        // do nothing for EOF character
        return c;
      }
      c = unSign(c & 0xFF);
      stream.ungotten.push(c);
      stream.eof = false;
      return c;
    }
  function _ferror(stream) {
      // int ferror(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ferror.html
      stream = FS.getStream(stream);
      return Number(stream && stream.error);
    }
  function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }
  function _feof(stream) {
      // int feof(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/feof.html
      stream = FS.getStream(stream);
      return Number(stream && stream.eof);
    }
  function _strerror_r(errnum, strerrbuf, buflen) {
      if (errnum in ERRNO_MESSAGES) {
        if (ERRNO_MESSAGES[errnum].length > buflen - 1) {
          return ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          var msg = ERRNO_MESSAGES[errnum];
          for (var i = 0; i < msg.length; i++) {
            HEAP8[(((strerrbuf)+(i))|0)]=msg.charCodeAt(i)
          }
          HEAP8[(((strerrbuf)+(i))|0)]=0
          return 0;
        }
      } else {
        return ___setErrNo(ERRNO_CODES.EINVAL);
      }
    }function _strerror(errnum) {
      if (!_strerror.buffer) _strerror.buffer = _malloc(256);
      _strerror_r(errnum, _strerror.buffer, 256);
      return _strerror.buffer;
    }
  function ___errno_location() {
      return ___errno_state;
    }var ___errno=___errno_location;
  function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      return _write(stream, s, _strlen(s));
    }
  function _fgets(s, n, stream) {
      // char *fgets(char *restrict s, int n, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgets.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) return 0;
      if (streamObj.error || streamObj.eof) return 0;
      var byte_;
      for (var i = 0; i < n - 1 && byte_ != 10; i++) {
        byte_ = _fgetc(stream);
        if (byte_ == -1) {
          if (streamObj.error || (streamObj.eof && i == 0)) return 0;
          else if (streamObj.eof) break;
        }
        HEAP8[(((s)+(i))|0)]=byte_
      }
      HEAP8[(((s)+(i))|0)]=0
      return s;
    }
  function _tmpnam(s, dir, prefix) {
      // char *tmpnam(char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/tmpnam.html
      // NOTE: The dir and prefix arguments are for internal use only.
      var folder = FS.findObject(dir || '/tmp');
      if (!folder || !folder.isFolder) {
        dir = '/tmp';
        folder = FS.findObject(dir);
        if (!folder || !folder.isFolder) return 0;
      }
      var name = prefix || 'file';
      do {
        name += String.fromCharCode(65 + Math.floor(Math.random() * 25));
      } while (name in folder.contents);
      var result = dir + '/' + name;
      if (!_tmpnam.buffer) _tmpnam.buffer = _malloc(256);
      if (!s) s = _tmpnam.buffer;
      for (var i = 0; i < result.length; i++) {
        HEAP8[(((s)+(i))|0)]=result.charCodeAt(i);
      }
      HEAP8[(((s)+(i))|0)]=0;
      return s;
    }function _tmpfile() {
      // FILE *tmpfile(void);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/tmpfile.html
      // TODO: Delete the created file on closing.
      if (_tmpfile.mode) {
        _tmpfile.mode = allocate(intArrayFromString('w+'), 'i8', ALLOC_NORMAL);
      }
      return _fopen(_tmpnam(0), _tmpfile.mode);
    }
  function _clearerr(stream) {
      // void clearerr(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/clearerr.html
      stream = FS.getStream(stream);
      if (!stream) {
        return;
      }
      stream.eof = false;
      stream.error = false;
    }
  function __isFloat(text) {
      return !!(/^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?$/.exec(text));
    }function __scanString(format, get, unget, varargs) {
      if (!__scanString.whiteSpace) {
        __scanString.whiteSpace = {};
        __scanString.whiteSpace[32] = 1;
        __scanString.whiteSpace[9] = 1;
        __scanString.whiteSpace[10] = 1;
        __scanString.whiteSpace[11] = 1;
        __scanString.whiteSpace[12] = 1;
        __scanString.whiteSpace[13] = 1;
        __scanString.whiteSpace[' '] = 1;
        __scanString.whiteSpace['\t'] = 1;
        __scanString.whiteSpace['\n'] = 1;
        __scanString.whiteSpace['\v'] = 1;
        __scanString.whiteSpace['\f'] = 1;
        __scanString.whiteSpace['\r'] = 1;
      }
      // Supports %x, %4x, %d.%d, %lld, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var soFar = 0;
      if (format.indexOf('%n') >= 0) {
        // need to track soFar
        var _get = get;
        get = function() {
          soFar++;
          return _get();
        }
        var _unget = unget;
        unget = function() {
          soFar--;
          return _unget();
        }
      }
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      var next;
      mainLoop:
      for (var formatIndex = 0; formatIndex < format.length;) {
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'n') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          HEAP32[((argPtr)>>2)]=soFar;
          formatIndex += 2;
          continue;
        }
        if (format[formatIndex] === '%') {
          var nextC = format.indexOf('c', formatIndex+1);
          if (nextC > 0) {
            var maxx = 1;
            if (nextC > formatIndex+1) {
              var sub = format.substring(formatIndex+1, nextC)
              maxx = parseInt(sub);
              if (maxx != sub) maxx = 0;
            }
            if (maxx) {
              var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
              argIndex += Runtime.getAlignSize('void*', null, true);
              fields++;
              for (var i = 0; i < maxx; i++) {
                next = get();
                HEAP8[((argPtr++)|0)]=next;
              }
              formatIndex += nextC - formatIndex + 1;
              continue;
            }
          }
        }
        // remove whitespace
        while (1) {
          next = get();
          if (next == 0) return fields;
          if (!(next in __scanString.whiteSpace)) break;
        }
        unget();
        if (format[formatIndex] === '%') {
          formatIndex++;
          var suppressAssignment = false;
          if (format[formatIndex] == '*') {
            suppressAssignment = true;
            formatIndex++;
          }
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= 48 &&
                 format[formatIndex].charCodeAt(0) <= 57) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          var long_ = false;
          var half = false;
          var longLong = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
            if (format[formatIndex] == 'l') {
              longLong = true;
              formatIndex++;
            }
          } else if (format[formatIndex] == 'h') {
            half = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f' || type == 'e' || type == 'g' ||
              type == 'F' || type == 'E' || type == 'G') {
            var last = 0;
            next = get();
            while (next > 0) {
              buffer.push(String.fromCharCode(next));
              if (__isFloat(buffer.join(''))) {
                last = buffer.length;
              }
              next = get();
            }
            for (var i = 0; i < buffer.length - last + 1; i++) {
              unget();
            }
            buffer.length = last;
          } else {
            next = get();
            var first = true;
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if (!(next in __scanString.whiteSpace) && // stop on whitespace
                  (type == 's' ||
                   ((type === 'd' || type == 'u' || type == 'i') && ((next >= 48 && next <= 57) ||
                                                                     (first && next == 45))) ||
                   ((type === 'x' || type === 'X') && (next >= 48 && next <= 57 ||
                                     next >= 97 && next <= 102 ||
                                     next >= 65 && next <= 70))) &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
                first = false;
              } else {
                break;
              }
            }
            unget();
          }
          if (buffer.length === 0) return 0;  // Failure.
          if (suppressAssignment) continue;
          var text = buffer.join('');
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          switch (type) {
            case 'd': case 'u': case 'i':
              if (half) {
                HEAP16[((argPtr)>>1)]=parseInt(text, 10);
              } else if (longLong) {
                (tempI64 = [parseInt(text, 10)>>>0,(tempDouble=parseInt(text, 10),(+(Math.abs(tempDouble))) >= (+(1)) ? (tempDouble > (+(0)) ? ((Math.min((+(Math.floor((tempDouble)/(+(4294967296))))), (+(4294967295))))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+(4294967296)))))))>>>0) : 0)],HEAP32[((argPtr)>>2)]=tempI64[0],HEAP32[(((argPtr)+(4))>>2)]=tempI64[1]);
              } else {
                HEAP32[((argPtr)>>2)]=parseInt(text, 10);
              }
              break;
            case 'X':
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16)
              break;
            case 'F':
            case 'f':
            case 'E':
            case 'e':
            case 'G':
            case 'g':
            case 'E':
              // fallthrough intended
              if (long_) {
                HEAPF64[((argPtr)>>3)]=parseFloat(text)
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text)
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(((argPtr)+(j))|0)]=array[j]
              }
              break;
          }
          fields++;
        } else if (format[formatIndex] in __scanString.whiteSpace) {
          next = get();
          while (next in __scanString.whiteSpace) {
            if (next <= 0) break mainLoop;  // End of input.
            next = get();
          }
          unget(next);
          formatIndex++;
        } else {
          // Not a specifier.
          next = get();
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            break mainLoop;
          }
          formatIndex++;
        }
      }
      return fields;
    }function _fscanf(stream, format, varargs) {
      // int fscanf(FILE *restrict stream, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) {
        return -1;
      }
      var buffer = [];
      var get = function() {
        var c = _fgetc(stream);
        buffer.push(c);
        return c;
      };
      var unget = function() {
        _ungetc(buffer.pop(), stream);
      };
      return __scanString(format, get, unget, varargs);
    }
  function _setvbuf(stream, buf, type, size) {
      // int setvbuf(FILE *restrict stream, char *restrict buf, int type, size_t size);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/setvbuf.html
      // TODO: Implement custom buffering.
      return 0;
    }
  function _lseek(fildes, offset, whence) {
      // off_t lseek(int fildes, off_t offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/lseek.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        return FS.llseek(stream, offset, whence);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fseek(stream, offset, whence) {
      // int fseek(FILE *stream, long offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fseek.html
      var ret = _lseek(stream, offset, whence);
      if (ret == -1) {
        return -1;
      }
      stream = FS.getStream(stream);
      stream.eof = false;
      return 0;
    }
  function _ftell(stream) {
      // long ftell(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ftell.html
      stream = FS.getStream(stream);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (FS.isChrdev(stream.node.mode)) {
        ___setErrNo(ERRNO_CODES.ESPIPE);
        return -1;
      } else {
        return stream.position;
      }
    }
  var _tan=Math.tan;
  function _sinh(x) {
      var p = Math.pow(Math.E, x);
      return (p - (1 / p)) / 2;
    }
  function _cosh(x) {
      var p = Math.pow(Math.E, x);
      return (p + (1 / p)) / 2;
    }function _tanh(x) {
      return _sinh(x) / _cosh(x);
    }
  var _sqrt=Math.sqrt;
  var _sin=Math.sin;
  function _srand(seed) {}
  function _rand() {
      return Math.floor(Math.random()*0x80000000);
    }
  function _modf(x, intpart) {
      HEAPF64[((intpart)>>3)]=Math.floor(x)
      return x - HEAPF64[((intpart)>>3)];
    }
  var _log=Math.log;
  function _log10(x) {
      return Math.log(x) / Math.LN10;
    }
  function _ldexp(x, exp_) {
      return x * Math.pow(2, exp_);
    }
  function _frexp(x, exp_addr) {
      var sig = 0, exp_ = 0;
      if (x !== 0) {
        var sign = 1;
        if (x < 0) {
          x = -x;
          sign = -1;
        }
        var raw_exp = Math.log(x)/Math.log(2);
        exp_ = Math.ceil(raw_exp);
        if (exp_ === raw_exp) exp_ += 1;
        sig = sign*x/Math.pow(2, exp_);
      }
      HEAP32[((exp_addr)>>2)]=exp_
      return sig;
    }
  function _fmod(x, y) {
      return x % y;
    }
  var _exp=Math.exp;
  var _cos=Math.cos;
  var _ceil=Math.ceil;
  var _atan=Math.atan;
  var _atan2=Math.atan2;
  var _asin=Math.asin;
  var _acos=Math.acos;
  var _fabs=Math.abs;
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
  var ___tm_struct_layout={__size__:44,tm_sec:0,tm_min:4,tm_hour:8,tm_mday:12,tm_mon:16,tm_year:20,tm_wday:24,tm_yday:28,tm_isdst:32,tm_gmtoff:36,tm_zone:40};
  var __tzname=allocate(8, "i32*", ALLOC_STATIC);
  var __daylight=allocate(1, "i32*", ALLOC_STATIC);
  var __timezone=allocate(1, "i32*", ALLOC_STATIC);function _tzset() {
      // TODO: Use (malleable) environment variables instead of system settings.
      if (_tzset.called) return;
      _tzset.called = true;
      HEAP32[((__timezone)>>2)]=-(new Date()).getTimezoneOffset() * 60
      var winter = new Date(2000, 0, 1);
      var summer = new Date(2000, 6, 1);
      HEAP32[((__daylight)>>2)]=Number(winter.getTimezoneOffset() != summer.getTimezoneOffset())
      var winterName = 'GMT'; // XXX do not rely on browser timezone info, it is very unpredictable | winter.toString().match(/\(([A-Z]+)\)/)[1];
      var summerName = 'GMT'; // XXX do not rely on browser timezone info, it is very unpredictable | summer.toString().match(/\(([A-Z]+)\)/)[1];
      var winterNamePtr = allocate(intArrayFromString(winterName), 'i8', ALLOC_NORMAL);
      var summerNamePtr = allocate(intArrayFromString(summerName), 'i8', ALLOC_NORMAL);
      HEAP32[((__tzname)>>2)]=winterNamePtr
      HEAP32[(((__tzname)+(4))>>2)]=summerNamePtr
    }function _mktime(tmPtr) {
      _tzset();
      var offsets = ___tm_struct_layout;
      var year = HEAP32[(((tmPtr)+(offsets.tm_year))>>2)];
      var timestamp = new Date(year >= 1900 ? year : year + 1900,
                               HEAP32[(((tmPtr)+(offsets.tm_mon))>>2)],
                               HEAP32[(((tmPtr)+(offsets.tm_mday))>>2)],
                               HEAP32[(((tmPtr)+(offsets.tm_hour))>>2)],
                               HEAP32[(((tmPtr)+(offsets.tm_min))>>2)],
                               HEAP32[(((tmPtr)+(offsets.tm_sec))>>2)],
                               0).getTime() / 1000;
      HEAP32[(((tmPtr)+(offsets.tm_wday))>>2)]=new Date(timestamp).getDay()
      var yday = Math.round((timestamp - (new Date(year, 0, 1)).getTime()) / (1000 * 60 * 60 * 24));
      HEAP32[(((tmPtr)+(offsets.tm_yday))>>2)]=yday
      return timestamp;
    }
  function _setlocale(category, locale) {
      if (!_setlocale.ret) _setlocale.ret = allocate([0], 'i8', ALLOC_NORMAL);
      return _setlocale.ret;
    }
  function _rename(old_path, new_path) {
      // int rename(const char *old, const char *new);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/rename.html
      old_path = Pointer_stringify(old_path);
      new_path = Pointer_stringify(new_path);
      try {
        FS.rename(old_path, new_path);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  function _unlink(path) {
      // int unlink(const char *path);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/unlink.html
      path = Pointer_stringify(path);
      try {
        FS.unlink(path);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  function _rmdir(path) {
      // int rmdir(const char *path);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/rmdir.html
      path = Pointer_stringify(path);
      try {
        FS.rmdir(path);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _remove(path) {
      // int remove(const char *path);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/remove.html
      var ret = _unlink(path);
      if (ret == -1) ret = _rmdir(path);
      return ret;
    }
  var _environ=allocate(1, "i32*", ALLOC_STATIC);var ___environ=_environ;function ___buildEnvironment(env) {
      // WARNING: Arbitrary limit!
      var MAX_ENV_VALUES = 64;
      var TOTAL_ENV_SIZE = 1024;
      // Statically allocate memory for the environment.
      var poolPtr;
      var envPtr;
      if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        // Set default values. Use string keys for Closure Compiler compatibility.
        ENV['USER'] = 'root';
        ENV['PATH'] = '/';
        ENV['PWD'] = '/';
        ENV['HOME'] = '/home/emscripten';
        ENV['LANG'] = 'en_US.UTF-8';
        ENV['_'] = './this.program';
        // Allocate memory.
        poolPtr = allocate(TOTAL_ENV_SIZE, 'i8', ALLOC_STATIC);
        envPtr = allocate(MAX_ENV_VALUES * 4,
                          'i8*', ALLOC_STATIC);
        HEAP32[((envPtr)>>2)]=poolPtr
        HEAP32[((_environ)>>2)]=envPtr;
      } else {
        envPtr = HEAP32[((_environ)>>2)];
        poolPtr = HEAP32[((envPtr)>>2)];
      }
      // Collect key=value lines.
      var strings = [];
      var totalSize = 0;
      for (var key in env) {
        if (typeof env[key] === 'string') {
          var line = key + '=' + env[key];
          strings.push(line);
          totalSize += line.length;
        }
      }
      if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error('Environment size exceeded TOTAL_ENV_SIZE!');
      }
      // Make new.
      var ptrSize = 4;
      for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        for (var j = 0; j < line.length; j++) {
          HEAP8[(((poolPtr)+(j))|0)]=line.charCodeAt(j);
        }
        HEAP8[(((poolPtr)+(j))|0)]=0;
        HEAP32[(((envPtr)+(i * ptrSize))>>2)]=poolPtr;
        poolPtr += line.length + 1;
      }
      HEAP32[(((envPtr)+(strings.length * ptrSize))>>2)]=0;
    }var ENV={};function _getenv(name) {
      // char *getenv(const char *name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/getenv.html
      if (name === 0) return 0;
      name = Pointer_stringify(name);
      if (!ENV.hasOwnProperty(name)) return 0;
      if (_getenv.ret) _free(_getenv.ret);
      _getenv.ret = allocate(intArrayFromString(ENV[name]), 'i8', ALLOC_NORMAL);
      return _getenv.ret;
    }
  function _system(command) {
      // int system(const char *command);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/system.html
      // Can't call external programs.
      ___setErrNo(ERRNO_CODES.EAGAIN);
      return -1;
    }
  function _difftime(time1, time0) {
      return time1 - time0;
    }
  var ___tm_current=allocate(4*26, "i8", ALLOC_STATIC);
  var ___tm_timezone=allocate(intArrayFromString("GMT"), "i8", ALLOC_STATIC);function _gmtime_r(time, tmPtr) {
      var date = new Date(HEAP32[((time)>>2)]*1000);
      var offsets = ___tm_struct_layout;
      HEAP32[(((tmPtr)+(offsets.tm_sec))>>2)]=date.getUTCSeconds()
      HEAP32[(((tmPtr)+(offsets.tm_min))>>2)]=date.getUTCMinutes()
      HEAP32[(((tmPtr)+(offsets.tm_hour))>>2)]=date.getUTCHours()
      HEAP32[(((tmPtr)+(offsets.tm_mday))>>2)]=date.getUTCDate()
      HEAP32[(((tmPtr)+(offsets.tm_mon))>>2)]=date.getUTCMonth()
      HEAP32[(((tmPtr)+(offsets.tm_year))>>2)]=date.getUTCFullYear()-1900
      HEAP32[(((tmPtr)+(offsets.tm_wday))>>2)]=date.getUTCDay()
      HEAP32[(((tmPtr)+(offsets.tm_gmtoff))>>2)]=0
      HEAP32[(((tmPtr)+(offsets.tm_isdst))>>2)]=0
      var start = new Date(date); // define date using UTC, start from Jan 01 00:00:00 UTC
      start.setUTCDate(1);
      start.setUTCMonth(0);
      start.setUTCHours(0);
      start.setUTCMinutes(0);
      start.setUTCSeconds(0);
      start.setUTCMilliseconds(0);
      var yday = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      HEAP32[(((tmPtr)+(offsets.tm_yday))>>2)]=yday
      HEAP32[(((tmPtr)+(offsets.tm_zone))>>2)]=___tm_timezone
      return tmPtr;
    }function _gmtime(time) {
      return _gmtime_r(time, ___tm_current);
    }
  function _localtime_r(time, tmPtr) {
      _tzset();
      var offsets = ___tm_struct_layout;
      var date = new Date(HEAP32[((time)>>2)]*1000);
      HEAP32[(((tmPtr)+(offsets.tm_sec))>>2)]=date.getSeconds()
      HEAP32[(((tmPtr)+(offsets.tm_min))>>2)]=date.getMinutes()
      HEAP32[(((tmPtr)+(offsets.tm_hour))>>2)]=date.getHours()
      HEAP32[(((tmPtr)+(offsets.tm_mday))>>2)]=date.getDate()
      HEAP32[(((tmPtr)+(offsets.tm_mon))>>2)]=date.getMonth()
      HEAP32[(((tmPtr)+(offsets.tm_year))>>2)]=date.getFullYear()-1900
      HEAP32[(((tmPtr)+(offsets.tm_wday))>>2)]=date.getDay()
      var start = new Date(date.getFullYear(), 0, 1);
      var yday = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      HEAP32[(((tmPtr)+(offsets.tm_yday))>>2)]=yday
      HEAP32[(((tmPtr)+(offsets.tm_gmtoff))>>2)]=start.getTimezoneOffset() * 60
      var dst = Number(start.getTimezoneOffset() != date.getTimezoneOffset());
      HEAP32[(((tmPtr)+(offsets.tm_isdst))>>2)]=dst
      HEAP32[(((tmPtr)+(offsets.tm_zone))>>2)]=___tm_timezone
      return tmPtr;
    }function _localtime(time) {
      return _localtime_r(time, ___tm_current);
    }
  function __isLeapYear(year) {
        return year%4 === 0 && (year%100 !== 0 || year%400 === 0);
    }
  function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]);
      return sum;
    }
  var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];
  var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while(days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth-newDate.getDate()) {
          // we spill over to next month
          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {
          // we stay in current month 
          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }
      return newDate;
    }function _strftime(s, maxsize, format, tm) {
      // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
      var date = {
        tm_sec: HEAP32[(((tm)+(___tm_struct_layout.tm_sec))>>2)],
        tm_min: HEAP32[(((tm)+(___tm_struct_layout.tm_min))>>2)],
        tm_hour: HEAP32[(((tm)+(___tm_struct_layout.tm_hour))>>2)],
        tm_mday: HEAP32[(((tm)+(___tm_struct_layout.tm_mday))>>2)],
        tm_mon: HEAP32[(((tm)+(___tm_struct_layout.tm_mon))>>2)],
        tm_year: HEAP32[(((tm)+(___tm_struct_layout.tm_year))>>2)],
        tm_wday: HEAP32[(((tm)+(___tm_struct_layout.tm_wday))>>2)],
        tm_yday: HEAP32[(((tm)+(___tm_struct_layout.tm_yday))>>2)],
        tm_isdst: HEAP32[(((tm)+(___tm_struct_layout.tm_isdst))>>2)]
      };
      var pattern = Pointer_stringify(format);
      // expand format
      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',     // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
        '%D': '%m/%d/%y',                 // Equivalent to %m / %d / %y
        '%F': '%Y-%m-%d',                 // Equivalent to %Y - %m - %d
        '%h': '%b',                       // Equivalent to %b
        '%r': '%I:%M:%S %p',              // Replaced by the time in a.m. and p.m. notation
        '%R': '%H:%M',                    // Replaced by the time in 24-hour notation
        '%T': '%H:%M:%S',                 // Replaced by the time
        '%x': '%m/%d/%y',                 // Replaced by the locale's appropriate date representation
        '%X': '%H:%M:%S',                 // Replaced by the locale's appropriate date representation
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var leadingSomething = function(value, digits, character) {
        var str = typeof value === 'number' ? value.toString() : (value || '');
        while (str.length < digits) {
          str = character[0]+str;
        }
        return str;
      };
      var leadingNulls = function(value, digits) {
        return leadingSomething(value, digits, '0');
      };
      var compareByDay = function(date1, date2) {
        var sgn = function(value) {
          return value < 0 ? -1 : (value > 0 ? 1 : 0);
        };
        var compare;
        if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
            compare = sgn(date1.getDate()-date2.getDate());
          }
        }
        return compare;
      };
      var getFirstWeekStartDate = function(janFourth) {
          switch (janFourth.getDay()) {
            case 0: // Sunday
              return new Date(janFourth.getFullYear()-1, 11, 29);
            case 1: // Monday
              return janFourth;
            case 2: // Tuesday
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3: // Wednesday
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4: // Thursday
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5: // Friday
              return new Date(janFourth.getFullYear()-1, 11, 31);
            case 6: // Saturday
              return new Date(janFourth.getFullYear()-1, 11, 30);
          }
      };
      var getWeekBasedYear = function(date) {
          var thisDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            // this date is after the start of the first week of this year
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear()+1;
            } else {
              return thisDate.getFullYear();
            }
          } else { 
            return thisDate.getFullYear()-1;
          }
      };
      var EXPANSION_RULES_2 = {
        '%a': function(date) {
          return WEEKDAYS[date.tm_wday].substring(0,3);
        },
        '%A': function(date) {
          return WEEKDAYS[date.tm_wday];
        },
        '%b': function(date) {
          return MONTHS[date.tm_mon].substring(0,3);
        },
        '%B': function(date) {
          return MONTHS[date.tm_mon];
        },
        '%C': function(date) {
          var year = date.tm_year+1900;
          return leadingNulls(Math.floor(year/100),2);
        },
        '%d': function(date) {
          return leadingNulls(date.tm_mday, 2);
        },
        '%e': function(date) {
          return leadingSomething(date.tm_mday, 2, ' ');
        },
        '%g': function(date) {
          // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year. 
          // In this system, weeks begin on a Monday and week 1 of the year is the week that includes 
          // January 4th, which is also the week that includes the first Thursday of the year, and 
          // is also the first week that contains at least four days in the year. 
          // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of 
          // the last week of the preceding year; thus, for Saturday 2nd January 1999, 
          // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th, 
          // or 31st is a Monday, it and any following days are part of week 1 of the following year. 
          // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
          return getWeekBasedYear(date).toString().substring(2);
        },
        '%G': function(date) {
          return getWeekBasedYear(date);
        },
        '%H': function(date) {
          return leadingNulls(date.tm_hour, 2);
        },
        '%I': function(date) {
          return leadingNulls(date.tm_hour < 13 ? date.tm_hour : date.tm_hour-12, 2);
        },
        '%j': function(date) {
          // Day of the year (001-366)
          return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
        },
        '%m': function(date) {
          return leadingNulls(date.tm_mon+1, 2);
        },
        '%M': function(date) {
          return leadingNulls(date.tm_min, 2);
        },
        '%n': function() {
          return '\n';
        },
        '%p': function(date) {
          if (date.tm_hour > 0 && date.tm_hour < 13) {
            return 'AM';
          } else {
            return 'PM';
          }
        },
        '%S': function(date) {
          return leadingNulls(date.tm_sec, 2);
        },
        '%t': function() {
          return '\t';
        },
        '%u': function(date) {
          var day = new Date(date.tm_year+1900, date.tm_mon+1, date.tm_mday, 0, 0, 0, 0);
          return day.getDay() || 7;
        },
        '%U': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53]. 
          // The first Sunday of January is the first day of week 1; 
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year+1900, 0, 1);
          var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7-janFirst.getDay());
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
          // is target date after the first Sunday?
          if (compareByDay(firstSunday, endDate) < 0) {
            // calculate difference in days between first Sunday and endDate
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstSundayUntilEndJanuary = 31-firstSunday.getDate();
            var days = firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
          return compareByDay(firstSunday, janFirst) === 0 ? '01': '00';
        },
        '%V': function(date) {
          // Replaced by the week number of the year (Monday as the first day of the week) 
          // as a decimal number [01,53]. If the week containing 1 January has four 
          // or more days in the new year, then it is considered week 1. 
          // Otherwise, it is the last week of the previous year, and the next week is week 1. 
          // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
          var janFourthThisYear = new Date(date.tm_year+1900, 0, 4);
          var janFourthNextYear = new Date(date.tm_year+1901, 0, 4);
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
          var endDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            // if given date is before this years first week, then it belongs to the 53rd week of last year
            return '53';
          } 
          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            // if given date is after next years first week, then it belongs to the 01th week of next year
            return '01';
          }
          // given date is in between CW 01..53 of this calendar year
          var daysDifference;
          if (firstWeekStartThisYear.getFullYear() < date.tm_year+1900) {
            // first CW of this year starts last year
            daysDifference = date.tm_yday+32-firstWeekStartThisYear.getDate()
          } else {
            // first CW of this year starts this year
            daysDifference = date.tm_yday+1-firstWeekStartThisYear.getDate();
          }
          return leadingNulls(Math.ceil(daysDifference/7), 2);
        },
        '%w': function(date) {
          var day = new Date(date.tm_year+1900, date.tm_mon+1, date.tm_mday, 0, 0, 0, 0);
          return day.getDay();
        },
        '%W': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53]. 
          // The first Monday of January is the first day of week 1; 
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year, 0, 1);
          var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7-janFirst.getDay()+1);
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
          // is target date after the first Monday?
          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstMondayUntilEndJanuary = 31-firstMonday.getDate();
            var days = firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
          return compareByDay(firstMonday, janFirst) === 0 ? '01': '00';
        },
        '%y': function(date) {
          // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
          return (date.tm_year+1900).toString().substring(2);
        },
        '%Y': function(date) {
          // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
          return date.tm_year+1900;
        },
        '%z': function(date) {
          // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ),
          // or by no characters if no timezone is determinable. 
          // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich). 
          // If tm_isdst is zero, the standard time offset is used. 
          // If tm_isdst is greater than zero, the daylight savings time offset is used. 
          // If tm_isdst is negative, no characters are returned. 
          // FIXME: we cannot determine time zone (or can we?)
          return '';
        },
        '%Z': function(date) {
          // Replaced by the timezone name or abbreviation, or by no bytes if no timezone information exists. [ tm_isdst]
          // FIXME: we cannot determine time zone (or can we?)
          return '';
        },
        '%%': function() {
          return '%';
        }
      };
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      } 
      writeArrayToMemory(bytes, s);
      return bytes.length-1;
    }
  function _clock() {
      if (_clock.start === undefined) _clock.start = Date.now();
      return Math.floor((Date.now() - _clock.start) * (1000/1000));
    }
  function _toupper(chr) {
      if (chr >= 97 && chr <= 122) {
        return chr - 97 + 65;
      } else {
        return chr;
      }
    }
  function _strpbrk(ptr1, ptr2) {
      var curr;
      var searchSet = {};
      while (1) {
        var curr = HEAP8[((ptr2++)|0)];
        if (!curr) break;
        searchSet[curr] = 1;
      }
      while (1) {
        curr = HEAP8[(ptr1)];
        if (!curr) break;
        if (curr in searchSet) return ptr1;
        ptr1++;
      }
      return 0;
    }
  Module["_tolower"] = _tolower;
  function _islower(chr) {
      return chr >= 97 && chr <= 122;
    }
  function _ispunct(chr) {
      return (chr >= 33 && chr <= 47) ||
             (chr >= 58 && chr <= 64) ||
             (chr >= 91 && chr <= 96) ||
             (chr >= 123 && chr <= 126);
    }
  function _isupper(chr) {
      return chr >= 65 && chr <= 90;
    }
  function _isxdigit(chr) {
      return (chr >= 48 && chr <= 57) ||
             (chr >= 97 && chr <= 102) ||
             (chr >= 65 && chr <= 70);
    }
  function _strrchr(ptr, chr) {
      var ptr2 = ptr + _strlen(ptr);
      do {
        if (HEAP8[(ptr2)] == chr) return ptr2;
        ptr2--;
      } while (ptr2 >= ptr);
      return 0;
    }
  function _abort() {
      Module['abort']();
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 8: return PAGE_SIZE;
        case 54:
        case 56:
        case 21:
        case 61:
        case 63:
        case 22:
        case 67:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 69:
        case 28:
        case 101:
        case 70:
        case 71:
        case 29:
        case 30:
        case 199:
        case 75:
        case 76:
        case 32:
        case 43:
        case 44:
        case 80:
        case 46:
        case 47:
        case 45:
        case 48:
        case 49:
        case 42:
        case 82:
        case 33:
        case 7:
        case 108:
        case 109:
        case 107:
        case 112:
        case 119:
        case 121:
          return 200809;
        case 13:
        case 104:
        case 94:
        case 95:
        case 34:
        case 35:
        case 77:
        case 81:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 91:
        case 94:
        case 95:
        case 110:
        case 111:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 120:
        case 40:
        case 16:
        case 79:
        case 19:
          return -1;
        case 92:
        case 93:
        case 5:
        case 72:
        case 6:
        case 74:
        case 92:
        case 93:
        case 96:
        case 97:
        case 98:
        case 99:
        case 102:
        case 103:
        case 105:
          return 1;
        case 38:
        case 66:
        case 50:
        case 51:
        case 4:
          return 1024;
        case 15:
        case 64:
        case 41:
          return 32;
        case 55:
        case 37:
        case 17:
          return 2147483647;
        case 18:
        case 1:
          return 47839;
        case 59:
        case 57:
          return 99;
        case 68:
        case 58:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 14: return 32768;
        case 73: return 32767;
        case 39: return 16384;
        case 60: return 1000;
        case 106: return 700;
        case 52: return 256;
        case 62: return 255;
        case 2: return 100;
        case 65: return 64;
        case 36: return 20;
        case 100: return 16;
        case 20: return 6;
        case 53: return 4;
        case 10: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        var imagePlugin = {};
        imagePlugin['canHandle'] = function(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule) {
        var ctx;
        try {
          if (useWebGL) {
            ctx = canvas.getContext('experimental-webgl', {
              alpha: false
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function (func) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                         window['mozRequestAnimationFrame'] ||
                                         window['webkitRequestAnimationFrame'] ||
                                         window['msRequestAnimationFrame'] ||
                                         window['oRequestAnimationFrame'] ||
                                         window['setTimeout'];
        }
        window.requestAnimationFrame(func);
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (window.scrollX + rect.left);
              y = t.pageY - (window.scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (window.scrollX + rect.left);
            y = event.pageY - (window.scrollY + rect.top);
          }
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
___buildEnvironment(ENV);
Module["requestFullScreen"] = function(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
var Math_min = Math.min;
function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiii(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_iiiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env._stdin|0;var n=env._stderr|0;var o=env._stdout|0;var p=+env.NaN;var q=+env.Infinity;var r=0;var s=0;var t=0;var u=0;var v=0,w=0,x=0,y=0,z=0.0,A=0,B=0,C=0,D=0.0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=0;var O=global.Math.floor;var P=global.Math.abs;var Q=global.Math.sqrt;var R=global.Math.pow;var S=global.Math.cos;var T=global.Math.sin;var U=global.Math.tan;var V=global.Math.acos;var W=global.Math.asin;var X=global.Math.atan;var Y=global.Math.atan2;var Z=global.Math.exp;var _=global.Math.log;var $=global.Math.ceil;var aa=global.Math.imul;var ab=env.abort;var ac=env.assert;var ad=env.asmPrintInt;var ae=env.asmPrintFloat;var af=env.min;var ag=env.jsCall;var ah=env.invoke_ii;var ai=env.invoke_vi;var aj=env.invoke_vii;var ak=env.invoke_iiiii;var al=env.invoke_iiii;var am=env.invoke_v;var an=env.invoke_iii;var ao=env._llvm_lifetime_end;var ap=env._lseek;var aq=env.__scanString;var ar=env._fclose;var as=env._strtoul;var at=env.__isFloat;var au=env._fflush;var av=env._fputc;var aw=env._fwrite;var ax=env._strncmp;var ay=env._send;var az=env._fputs;var aA=env._tmpnam;var aB=env._isspace;var aC=env._localtime;var aD=env._read;var aE=env._ceil;var aF=env._strstr;var aG=env._fsync;var aH=env._fscanf;var aI=env._fmod;var aJ=env._remove;var aK=env._modf;var aL=env._strcmp;var aM=env._memchr;var aN=env._llvm_va_end;var aO=env._tmpfile;var aP=env._snprintf;var aQ=env._fgetc;var aR=env._cosh;var aS=env._fgets;var aT=env._close;var aU=env._strchr;var aV=env._asin;var aW=env._clock;var aX=env.___setErrNo;var aY=env._isxdigit;var aZ=env._ftell;var a_=env._exit;var a$=env._sprintf;var a0=env._strrchr;var a1=env._freopen;var a2=env._strcspn;var a3=env.__isLeapYear;var a4=env._ferror;var a5=env._gmtime;var a6=env._localtime_r;var a7=env._sinh;var a8=env._recv;var a9=env._cos;var ba=env._putchar;var bb=env._islower;var bc=env.__exit;var bd=env._isupper;var be=env._strftime;var bf=env._rand;var bg=env._tzset;var bh=env._setlocale;var bi=env._ldexp;var bj=env._toupper;var bk=env._pread;var bl=env._fopen;var bm=env._open;var bn=env._frexp;var bo=env.__arraySum;var bp=env._log;var bq=env._isalnum;var br=env._mktime;var bs=env._system;var bt=env._isalpha;var bu=env._rmdir;var bv=env._log10;var bw=env._fread;var bx=env.__reallyNegative;var by=env.__formatString;var bz=env._getenv;var bA=env._llvm_pow_f64;var bB=env._sbrk;var bC=env._tanh;var bD=env._localeconv;var bE=env.___errno_location;var bF=env._strerror;var bG=env._llvm_lifetime_start;var bH=env.__parseInt;var bI=env._ungetc;var bJ=env._rename;var bK=env._sysconf;var bL=env._srand;var bM=env._abort;var bN=env._fprintf;var bO=env._tan;var bP=env.___buildEnvironment;var bQ=env._feof;var bR=env.__addDays;var bS=env._strncat;var bT=env._gmtime_r;var bU=env._ispunct;var bV=env._clearerr;var bW=env._fabs;var bX=env._floor;var bY=env._fseek;var bZ=env._sqrt;var b_=env._write;var b$=env._sin;var b0=env._longjmp;var b1=env._atan;var b2=env._strpbrk;var b3=env._unlink;var b4=env._acos;var b5=env._pwrite;var b6=env._strerror_r;var b7=env._difftime;var b8=env._iscntrl;var b9=env._atan2;var ca=env._exp;var cb=env._time;var cc=env._setvbuf;
// EMSCRIPTEN_START_FUNCS
function ck(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7>>3<<3;return b|0}function cl(){return i|0}function cm(a){a=a|0;i=a}function cn(a,b){a=a|0;b=b|0;if((r|0)==0){r=a;s=b}}function co(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function cp(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function cq(a){a=a|0;E=a}function cr(a){a=a|0;F=a}function cs(a){a=a|0;G=a}function ct(a){a=a|0;H=a}function cu(a){a=a|0;I=a}function cv(a){a=a|0;J=a}function cw(a){a=a|0;K=a}function cx(a){a=a|0;L=a}function cy(a){a=a|0;M=a}function cz(a){a=a|0;N=a}function cA(){}function cB(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=a+8|0;a=c[d>>2]|0;e=b;f=a;g=c[e+4>>2]|0;c[f>>2]=c[e>>2];c[f+4>>2]=g;c[a+8>>2]=c[b+8>>2];c[d>>2]=(c[d>>2]|0)+16;return}function cC(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;if((a|0)==(b|0)){return}e=a+8|0;a=(c[e>>2]|0)+(-d<<4)|0;c[e>>2]=a;if((d|0)<=0){return}f=b+8|0;b=0;g=a;while(1){a=c[f>>2]|0;c[f>>2]=a+16;h=g+(b<<4)|0;i=a;j=c[h+4>>2]|0;c[i>>2]=c[h>>2];c[i+4>>2]=j;c[a+8>>2]=c[g+(b<<4)+8>>2];a=b+1|0;if((a|0)>=(d|0)){break}b=a;g=c[e>>2]|0}return}function cD(a,c){a=a|0;c=c|0;b[c+52>>1]=b[a+52>>1]|0;return}function cE(a,b){a=a|0;b=b|0;var d=0;d=(c[a+16>>2]|0)+88|0;a=c[d>>2]|0;c[d>>2]=b;return a|0}function cF(a){a=a|0;return(c[a+8>>2]|0)-(c[a+12>>2]|0)>>4|0}function cG(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0;if((b|0)<=-1){d=a+8|0;c[d>>2]=(c[d>>2]|0)+(b+1<<4);return}d=a+8|0;e=c[d>>2]|0;f=a+12|0;a=(c[f>>2]|0)+(b<<4)|0;if(e>>>0<a>>>0){g=e;while(1){c[d>>2]=g+16;c[g+8>>2]=0;e=c[d>>2]|0;h=(c[f>>2]|0)+(b<<4)|0;if(e>>>0<h>>>0){g=e}else{i=h;break}}}else{i=a}c[d>>2]=i;return}function cH(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=f+16|0;g=a+8|0;a=c[g>>2]|0;if(b>>>0<a>>>0){h=f;i=b}else{j=a;k=j-16|0;c[g>>2]=k;return}while(1){a=i;b=h;f=c[a+4>>2]|0;c[b>>2]=c[a>>2];c[b+4>>2]=f;c[h+8>>2]=c[h+24>>2];f=i+16|0;b=c[g>>2]|0;if(f>>>0<b>>>0){h=i;i=f}else{j=b;break}}k=j-16|0;c[g>>2]=k;return}function cI(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=a+8|0;a=c[b>>2]|0;if(a>>>0>f>>>0){h=a}else{i=a;j=i;k=f;l=j|0;m=c[l>>2]|0;n=j+4|0;o=c[n>>2]|0;p=k|0;c[p>>2]=m;q=k+4|0;c[q>>2]=o;r=i+8|0;s=c[r>>2]|0;t=f+8|0;c[t>>2]=s;return}while(1){a=h-16|0;g=a;e=h;u=c[g+4>>2]|0;c[e>>2]=c[g>>2];c[e+4>>2]=u;c[h+8>>2]=c[h-16+8>>2];if(a>>>0>f>>>0){h=a}else{break}}i=c[b>>2]|0;j=i;k=f;l=j|0;m=c[l>>2]|0;n=j+4|0;o=c[n>>2]|0;p=k|0;c[p>>2]=m;q=k+4|0;c[q>>2]=o;r=i+8|0;s=c[r>>2]|0;t=f+8|0;c[t>>2]=s;return}function cJ(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=a+8|0;a=c[b>>2]|0;g=f;e=a;h=c[g+4>>2]|0;c[e>>2]=c[g>>2];c[e+4>>2]=h;c[a+8>>2]=c[f+8>>2];c[b>>2]=(c[b>>2]|0)+16;return}function cK(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){h=-1;return h|0}else{f=e+24+(g-1<<4)|0;break}}}}while(0);if((f|0)==1032){h=-1;return h|0}h=c[f+8>>2]|0;return h|0}function cL(a,b){a=a|0;b=b|0;var d=0;if((b|0)==-1){d=10432}else{d=c[872+(b<<2)>>2]|0}return d|0}function cM(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0;do{if((e|0)>0){f=(c[b+12>>2]|0)+(e-1<<4)|0;g=f>>>0<(c[b+8>>2]|0)>>>0?f:1032}else{if((e|0)>-1e4){g=(c[b+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-1e4|0)){g=(c[b+16>>2]|0)+96|0;break}else if((e|0)==(-10001|0)){f=b+88|0;c[f>>2]=c[(c[c[(c[b+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[b+96>>2]=5;g=f;break}else if((e|0)==(-10002|0)){g=b+72|0;break}else{f=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;h=-10002-e|0;if((h|0)>(d[f+7|0]|0)){g=1032;break}g=f+24+(h-1<<4)|0;break}}}while(0);if((c[g+8>>2]|0)!=6){i=0;return i|0}i=(a[(c[g>>2]|0)+6|0]|0)!=0|0;return i|0}function cN(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;if((b|0)>8e3){d=0;return d|0}e=a+8|0;f=c[e>>2]|0;g=f;if(((g-(c[a+12>>2]|0)>>4)+b|0)>8e3){d=0;return d|0}if((b|0)<=0){d=1;return d|0}if(((c[a+28>>2]|0)-g|0)>(b<<4|0)){h=f}else{eA(a,b);h=c[e>>2]|0}e=(c[a+20>>2]|0)+8|0;a=h+(b<<4)|0;if((c[e>>2]|0)>>>0>=a>>>0){d=1;return d|0}c[e>>2]=a;d=1;return d|0}function cO(a){a=a|0;var b=0,d=0;b=c[a+16>>2]|0;if((c[b+68>>2]|0)>>>0>=(c[b+64>>2]|0)>>>0){e1(a)}b=fT(a)|0;d=a+8|0;a=c[d>>2]|0;c[a>>2]=b;c[a+8>>2]=8;c[d>>2]=(c[d>>2]|0)+16;return b|0}function cP(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;g=(e|0)==-10001;do{if(g){h=c[b+20>>2]|0;if((h|0)!=(c[b+40>>2]|0)){j=h;k=124;break}es(b,10448,(h=i,i=i+1|0,i=i+7>>3<<3,c[h>>2]=0,h)|0);i=h;k=117}else{k=117}}while(0);do{if((k|0)==117){if((e|0)>0){h=(c[b+12>>2]|0)+(e-1<<4)|0;l=h>>>0<(c[b+8>>2]|0)>>>0?h:1032;break}if((e|0)>-1e4){l=(c[b+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-1e4|0)){l=(c[b+16>>2]|0)+96|0;break}else if((e|0)==(-10001|0)){j=c[b+20>>2]|0;k=124;break}else if((e|0)==(-10002|0)){l=b+72|0;break}else{h=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;m=-10002-e|0;if((m|0)>(d[h+7|0]|0|0)){l=1032;break}l=h+24+(m-1<<4)|0;break}}}while(0);if((k|0)==124){k=b+88|0;c[k>>2]=c[(c[c[j+4>>2]>>2]|0)+12>>2];c[b+96>>2]=5;l=k}do{if(g){k=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;j=b+8|0;c[k+12>>2]=c[(c[j>>2]|0)-16>>2];m=c[j>>2]|0;if((c[m-16+8>>2]|0)<=3){break}j=c[m-16>>2]|0;if((a[j+5|0]&3)==0){break}if((a[k+5|0]&4)==0){break}e7(b,k,j)}else{j=b+8|0;k=c[j>>2]|0;m=k-16|0;h=l;n=c[m+4>>2]|0;c[h>>2]=c[m>>2];c[h+4>>2]=n;c[l+8>>2]=c[k-16+8>>2];if((e|0)>=-10002){break}k=c[j>>2]|0;if((c[k-16+8>>2]|0)<=3){break}j=c[k-16>>2]|0;if((a[j+5|0]&3)==0){break}k=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;if((a[k+5|0]&4)==0){break}e7(b,k,j)}}while(0);e=b+8|0;c[e>>2]=(c[e>>2]|0)-16;i=f;return}function cQ(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032;g=149}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;g=149;break}if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;g=149;break}else if((b|0)==(-10002|0)){f=a+72|0;g=149;break}else if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;g=149;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;h=-10002-b|0;if((h|0)>(d[e+7|0]|0|0)){i=-1;break}f=e+24+(h-1<<4)|0;g=149;break}}}while(0);do{if((g|0)==149){if((f|0)==1032){i=-1;break}b=c[f+8>>2]|0;if((b|0)==4){j=1}else{i=b;break}return j|0}}while(0);j=(i|0)==3|0;return j|0}function cR(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=c[f+8>>2]|0;if((b|0)==7){h=1;return h|0}h=(b|0)==2|0;return h|0}function cS(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+16|0;f=e|0;do{if((b|0)>0){g=(c[a+12>>2]|0)+(b-1<<4)|0;h=g>>>0<(c[a+8>>2]|0)>>>0?g:1032}else{if((b|0)>-1e4){h=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10001|0)){g=a+88|0;c[g>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;h=g;break}else if((b|0)==(-1e4|0)){h=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10002|0)){h=a+72|0;break}else{g=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;j=-10002-b|0;if((j|0)>(d[g+7|0]|0|0)){h=1032;break}h=g+24+(j-1<<4)|0;break}}}while(0);if((c[h+8>>2]|0)==3){k=1;i=e;return k|0}k=(gk(h,f)|0)!=0|0;i=e;return k|0}function cT(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;do{if((b|0)>0){f=(c[a+12>>2]|0)+(b-1<<4)|0;g=f>>>0<(c[a+8>>2]|0)>>>0?f:1032}else{if((b|0)>-1e4){g=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10002|0)){g=a+72|0;break}else if((b|0)==(-10001|0)){f=a+88|0;c[f>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;g=f;break}else if((b|0)==(-1e4|0)){g=(c[a+16>>2]|0)+96|0;break}else{f=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;h=-10002-b|0;if((h|0)>(d[f+7|0]|0|0)){g=1032;break}g=f+24+(h-1<<4)|0;break}}}while(0);do{if((e|0)>0){b=(c[a+12>>2]|0)+(e-1<<4)|0;i=b>>>0<(c[a+8>>2]|0)>>>0?b:1032}else{if((e|0)>-1e4){i=(c[a+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-10001|0)){b=a+88|0;c[b>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;i=b;break}else if((e|0)==(-10002|0)){i=a+72|0;break}else if((e|0)==(-1e4|0)){i=(c[a+16>>2]|0)+96|0;break}else{b=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;h=-10002-e|0;if((h|0)>(d[b+7|0]|0|0)){j=0;return j|0}else{i=b+24+(h-1<<4)|0;break}}}}while(0);if((g|0)==1032|(i|0)==1032){j=0;return j|0}j=fr(g,i)|0;return j|0}function cU(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;do{if((b|0)>0){f=(c[a+12>>2]|0)+(b-1<<4)|0;g=f>>>0<(c[a+8>>2]|0)>>>0?f:1032}else{if((b|0)>-1e4){g=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10002|0)){g=a+72|0;break}else if((b|0)==(-1e4|0)){g=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){f=a+88|0;c[f>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;g=f;break}else{f=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;h=-10002-b|0;if((h|0)>(d[f+7|0]|0|0)){g=1032;break}g=f+24+(h-1<<4)|0;break}}}while(0);do{if((e|0)>0){b=(c[a+12>>2]|0)+(e-1<<4)|0;i=b>>>0<(c[a+8>>2]|0)>>>0?b:1032}else{if((e|0)>-1e4){i=(c[a+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-10001|0)){b=a+88|0;c[b>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;i=b;break}else if((e|0)==(-10002|0)){i=a+72|0;break}else if((e|0)==(-1e4|0)){i=(c[a+16>>2]|0)+96|0;break}else{b=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;h=-10002-e|0;if((h|0)>(d[b+7|0]|0|0)){j=0;return j|0}else{i=b+24+(h-1<<4)|0;break}}}}while(0);if((g|0)==1032|(i|0)==1032){j=0;return j|0}if((c[g+8>>2]|0)!=(c[i+8>>2]|0)){j=0;return j|0}j=(gp(a,g,i)|0)!=0|0;return j|0}function cV(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;do{if((b|0)>0){f=(c[a+12>>2]|0)+(b-1<<4)|0;g=f>>>0<(c[a+8>>2]|0)>>>0?f:1032}else{if((b|0)>-1e4){g=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10002|0)){g=a+72|0;break}else if((b|0)==(-10001|0)){f=a+88|0;c[f>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;g=f;break}else if((b|0)==(-1e4|0)){g=(c[a+16>>2]|0)+96|0;break}else{f=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;h=-10002-b|0;if((h|0)>(d[f+7|0]|0|0)){g=1032;break}g=f+24+(h-1<<4)|0;break}}}while(0);do{if((e|0)>0){b=(c[a+12>>2]|0)+(e-1<<4)|0;i=b>>>0<(c[a+8>>2]|0)>>>0?b:1032}else{if((e|0)>-1e4){i=(c[a+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-10001|0)){b=a+88|0;c[b>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;i=b;break}else if((e|0)==(-10002|0)){i=a+72|0;break}else if((e|0)==(-1e4|0)){i=(c[a+16>>2]|0)+96|0;break}else{b=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;h=-10002-e|0;if((h|0)>(d[b+7|0]|0|0)){j=0;return j|0}else{i=b+24+(h-1<<4)|0;break}}}}while(0);if((g|0)==1032|(i|0)==1032){j=0;return j|0}j=go(a,g,i)|0;return j|0}function cW(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,j=0,k=0,l=0,m=0.0;e=i;i=i+16|0;f=e|0;do{if((b|0)>0){g=(c[a+12>>2]|0)+(b-1<<4)|0;j=g>>>0<(c[a+8>>2]|0)>>>0?g:1032}else{if((b|0)>-1e4){j=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10001|0)){g=a+88|0;c[g>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;j=g;break}else if((b|0)==(-10002|0)){j=a+72|0;break}else if((b|0)==(-1e4|0)){j=(c[a+16>>2]|0)+96|0;break}else{g=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;k=-10002-b|0;if((k|0)>(d[g+7|0]|0|0)){j=1032;break}j=g+24+(k-1<<4)|0;break}}}while(0);do{if((c[j+8>>2]|0)==3){l=j}else{b=gk(j,f)|0;if((b|0)==0){m=0.0}else{l=b;break}i=e;return+m}}while(0);m=+h[l>>3];i=e;return+m}function cX(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=c[f+8>>2]|0;if((b|0)==0){h=0;return h|0}if((b|0)!=1){h=1;return h|0}h=(c[f>>2]|0)!=0|0;return h|0}function cY(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0;do{if((e|0)>0){f=(c[b+12>>2]|0)+(e-1<<4)|0;g=f>>>0<(c[b+8>>2]|0)>>>0?f:1032}else{if((e|0)>-1e4){g=(c[b+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-10001|0)){f=b+88|0;c[f>>2]=c[(c[c[(c[b+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[b+96>>2]=5;g=f;break}else if((e|0)==(-1e4|0)){g=(c[b+16>>2]|0)+96|0;break}else if((e|0)==(-10002|0)){g=b+72|0;break}else{f=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;h=-10002-e|0;if((h|0)>(d[f+7|0]|0)){g=1032;break}g=f+24+(h-1<<4)|0;break}}}while(0);if((c[g+8>>2]|0)!=6){i=0;return i|0}e=c[g>>2]|0;if((a[e+6|0]|0)==0){i=0;return i|0}i=c[e+16>>2]|0;return i|0}function cZ(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=c[f+8>>2]|0;if((b|0)==7){h=(c[f>>2]|0)+24|0;return h|0}else if((b|0)==2){h=c[f>>2]|0;return h|0}else{h=0;return h|0}return 0}function c_(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);if((c[f+8>>2]|0)!=8){h=0;return h|0}h=c[f>>2]|0;return h|0}function c$(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,j=0,k=0,l=0,m=0;e=i;i=i+16|0;f=e|0;do{if((b|0)>0){g=(c[a+12>>2]|0)+(b-1<<4)|0;j=g>>>0<(c[a+8>>2]|0)>>>0?g:1032}else{if((b|0)>-1e4){j=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10002|0)){j=a+72|0;break}else if((b|0)==(-1e4|0)){j=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){g=a+88|0;c[g>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;j=g;break}else{g=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;k=-10002-b|0;if((k|0)>(d[g+7|0]|0|0)){j=1032;break}j=g+24+(k-1<<4)|0;break}}}while(0);do{if((c[j+8>>2]|0)==3){l=j}else{b=gk(j,f)|0;if((b|0)==0){m=0}else{l=b;break}i=e;return m|0}}while(0);m=~~+h[l>>3];i=e;return m|0}function c0(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0;f=(b|0)>0;do{if(f){g=(c[a+12>>2]|0)+(b-1<<4)|0;h=g>>>0<(c[a+8>>2]|0)>>>0?g:1032}else{if((b|0)>-1e4){h=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10001|0)){g=a+88|0;c[g>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;h=g;break}else if((b|0)==(-1e4|0)){h=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10002|0)){h=a+72|0;break}else{g=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;i=-10002-b|0;if((i|0)>(d[g+7|0]|0|0)){h=1032;break}h=g+24+(i-1<<4)|0;break}}}while(0);do{if((c[h+8>>2]|0)==4){j=h}else{if((gl(a,h)|0)==0){if((e|0)==0){k=0;return k|0}c[e>>2]=0;k=0;return k|0}i=a+16|0;g=c[i>>2]|0;if((c[g+68>>2]|0)>>>0>=(c[g+64>>2]|0)>>>0){e1(a)}if(f){g=(c[a+12>>2]|0)+(b-1<<4)|0;j=g>>>0<(c[a+8>>2]|0)>>>0?g:1032;break}if((b|0)>-1e4){j=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){j=(c[i>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){i=a+88|0;c[i>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;j=i;break}else if((b|0)==(-10002|0)){j=a+72|0;break}else{i=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[i+7|0]|0|0)){j=1032;break}j=i+24+(g-1<<4)|0;break}}}while(0);b=j;if((e|0)!=0){c[e>>2]=c[(c[b>>2]|0)+12>>2]}k=(c[b>>2]|0)+16|0;return k|0}function c1(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=c[f+8>>2]|0;if((b|0)==4){h=c[(c[f>>2]|0)+12>>2]|0;return h|0}else if((b|0)==3){if((gl(a,f)|0)==0){h=0;return h|0}h=c[(c[f>>2]|0)+12>>2]|0;return h|0}else if((b|0)==7){h=c[(c[f>>2]|0)+16>>2]|0;return h|0}else if((b|0)==5){h=ga(c[f>>2]|0)|0;return h|0}else{h=0;return h|0}return 0}function c2(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=(b|0)>0;do{if(e){f=(c[a+12>>2]|0)+(b-1<<4)|0;g=f>>>0<(c[a+8>>2]|0)>>>0?f:1032}else{if((b|0)>-1e4){g=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){g=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10002|0)){g=a+72|0;break}else if((b|0)==(-10001|0)){f=a+88|0;c[f>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;g=f;break}else{f=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;h=-10002-b|0;if((h|0)>(d[f+7|0]|0|0)){g=1032;break}g=f+24+(h-1<<4)|0;break}}}while(0);switch(c[g+8>>2]|0){case 5:{i=c[g>>2]|0;return i|0};case 6:{i=c[g>>2]|0;return i|0};case 8:{i=c[g>>2]|0;return i|0};case 7:case 2:{do{if(e){g=(c[a+12>>2]|0)+(b-1<<4)|0;j=g>>>0<(c[a+8>>2]|0)>>>0?g:1032}else{if((b|0)>-1e4){j=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10002|0)){j=a+72|0;break}else if((b|0)==(-10001|0)){g=a+88|0;c[g>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;j=g;break}else if((b|0)==(-1e4|0)){j=(c[a+16>>2]|0)+96|0;break}else{g=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;h=-10002-b|0;if((h|0)>(d[g+7|0]|0|0)){j=1032;break}j=g+24+(h-1<<4)|0;break}}}while(0);b=c[j+8>>2]|0;if((b|0)==2){i=c[j>>2]|0;return i|0}else if((b|0)==7){i=(c[j>>2]|0)+24|0;return i|0}else{i=0;return i|0}break};default:{i=0;return i|0}}return 0}function c3(a){a=a|0;var b=0;b=a+8|0;c[(c[b>>2]|0)+8>>2]=0;c[b>>2]=(c[b>>2]|0)+16;return}function c4(a,b){a=a|0;b=+b;var d=0;d=a+8|0;a=c[d>>2]|0;h[a>>3]=b;c[a+8>>2]=3;c[d>>2]=(c[d>>2]|0)+16;return}function c5(a,b){a=a|0;b=b|0;var d=0;d=a+8|0;a=c[d>>2]|0;h[a>>3]=+(b|0);c[a+8>>2]=3;c[d>>2]=(c[d>>2]|0)+16;return}function c6(a,b){a=a|0;b=b|0;var d=0;d=a+8|0;a=c[d>>2]|0;c[a>>2]=(b|0)!=0;c[a+8>>2]=1;c[d>>2]=(c[d>>2]|0)+16;return}function c7(a,b){a=a|0;b=b|0;var d=0;d=a+8|0;a=c[d>>2]|0;c[a>>2]=b;c[a+8>>2]=2;c[d>>2]=(c[d>>2]|0)+16;return}function c8(a){a=a|0;var b=0,d=0;b=a+8|0;d=c[b>>2]|0;c[d>>2]=a;c[d+8>>2]=8;c[b>>2]=(c[b>>2]|0)+16;return(c[(c[a+16>>2]|0)+112>>2]|0)==(a|0)|0}function c9(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=c[a+16>>2]|0;if((c[e+68>>2]|0)>>>0>=(c[e+64>>2]|0)>>>0){e1(a)}e=a+8|0;f=c[e>>2]|0;c[f>>2]=f_(a,b,d)|0;c[f+8>>2]=4;c[e>>2]=(c[e>>2]|0)+16;return}function da(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;if((b|0)==0){d=a+8|0;c[(c[d>>2]|0)+8>>2]=0;c[d>>2]=(c[d>>2]|0)+16;return}d=j_(b|0)|0;e=c[a+16>>2]|0;if((c[e+68>>2]|0)>>>0>=(c[e+64>>2]|0)>>>0){e1(a)}e=a+8|0;f=c[e>>2]|0;c[f>>2]=f_(a,b,d)|0;c[f+8>>2]=4;c[e>>2]=(c[e>>2]|0)+16;return}function db(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=c[a+16>>2]|0;if((c[e+68>>2]|0)>>>0>=(c[e+64>>2]|0)>>>0){e1(a)}return fx(a,b,d)|0}function dc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+16|0;f=e|0;g=c[a+16>>2]|0;if((c[g+68>>2]|0)>>>0>=(c[g+64>>2]|0)>>>0){e1(a)}g=f;c[g>>2]=d;c[g+4>>2]=0;g=fx(a,b,f|0)|0;i=e;return g|0}function dd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;e=c[a+16>>2]|0;if((c[e+68>>2]|0)>>>0>=(c[e+64>>2]|0)>>>0){e1(a)}e=c[a+20>>2]|0;if((e|0)==(c[a+40>>2]|0)){f=c[a+72>>2]|0}else{f=c[(c[c[e+4>>2]>>2]|0)+12>>2]|0}e=eO(a,d,f)|0;c[e+16>>2]=b;b=a+8|0;a=(c[b>>2]|0)+(-d<<4)|0;c[b>>2]=a;if((d|0)==0){g=a;h=e;i=g;c[i>>2]=h;j=g+8|0;c[j>>2]=6;k=c[b>>2]|0;l=k+16|0;c[b>>2]=l;return}else{m=d;n=a}while(1){a=m-1|0;d=n+(a<<4)|0;f=e+24+(a<<4)|0;o=c[d+4>>2]|0;c[f>>2]=c[d>>2];c[f+4>>2]=o;c[e+24+(a<<4)+8>>2]=c[n+(a<<4)+8>>2];o=c[b>>2]|0;if((a|0)==0){g=o;break}else{m=a;n=o}}h=e;i=g;c[i>>2]=h;j=g+8|0;c[j>>2]=6;k=c[b>>2]|0;l=k+16|0;c[b>>2]=l;return}function de(a,b){a=a|0;b=b|0;var e=0,f=0,g=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=(c[a+8>>2]|0)-16|0;gm(a,f,b,b);return}function df(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+16|0;g=f|0;do{if((b|0)>0){h=(c[a+12>>2]|0)+(b-1<<4)|0;j=h>>>0<(c[a+8>>2]|0)>>>0?h:1032}else{if((b|0)>-1e4){j=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){j=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){h=a+88|0;c[h>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;j=h;break}else if((b|0)==(-10002|0)){j=a+72|0;break}else{h=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;k=-10002-b|0;if((k|0)>(d[h+7|0]|0|0)){j=1032;break}j=h+24+(k-1<<4)|0;break}}}while(0);c[g>>2]=f_(a,e,j_(e|0)|0)|0;c[g+8>>2]=4;e=a+8|0;gm(a,j,g,c[e>>2]|0);c[e>>2]=(c[e>>2]|0)+16;i=f;return}function dg(a,b){a=a|0;b=b|0;var e=0,f=0,g=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=a+8|0;a=f8(c[f>>2]|0,(c[b>>2]|0)-16|0)|0;f=c[b>>2]|0;b=a;g=f-16|0;e=c[b+4>>2]|0;c[g>>2]=c[b>>2];c[g+4>>2]=e;c[f-16+8>>2]=c[a+8>>2];return}function dh(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0;do{if((b|0)>0){f=(c[a+12>>2]|0)+(b-1<<4)|0;g=f>>>0<(c[a+8>>2]|0)>>>0?f:1032}else{if((b|0)>-1e4){g=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){g=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){f=a+88|0;c[f>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;g=f;break}else if((b|0)==(-10002|0)){g=a+72|0;break}else{f=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;h=-10002-b|0;if((h|0)>(d[f+7|0]|0|0)){g=1032;break}g=f+24+(h-1<<4)|0;break}}}while(0);b=f3(c[g>>2]|0,e)|0;e=a+8|0;a=c[e>>2]|0;g=b;h=a;f=c[g+4>>2]|0;c[h>>2]=c[g>>2];c[h+4>>2]=f;c[a+8>>2]=c[b+8>>2];c[e>>2]=(c[e>>2]|0)+16;return}function di(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=c[a+16>>2]|0;if((c[e+68>>2]|0)>>>0>=(c[e+64>>2]|0)>>>0){e1(a)}e=a+8|0;f=c[e>>2]|0;c[f>>2]=f5(a,b,d)|0;c[f+8>>2]=5;c[e>>2]=(c[e>>2]|0)+16;return}function dj(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=c[f+8>>2]|0;if((b|0)==5){h=c[(c[f>>2]|0)+8>>2]|0}else if((b|0)==7){h=c[(c[f>>2]|0)+8>>2]|0}else{h=c[(c[a+16>>2]|0)+152+(b<<2)>>2]|0}if((h|0)==0){i=0;return i|0}b=a+8|0;a=c[b>>2]|0;c[a>>2]=h;c[a+8>>2]=5;c[b>>2]=(c[b>>2]|0)+16;i=1;return i|0}function dk(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=c[f+8>>2]|0;if((b|0)==6){g=c[a+8>>2]|0;c[g>>2]=c[(c[f>>2]|0)+12>>2];c[g+8>>2]=5;h=a+8|0;i=c[h>>2]|0;j=i+16|0;c[h>>2]=j;return}else if((b|0)==7){g=c[a+8>>2]|0;c[g>>2]=c[(c[f>>2]|0)+12>>2];c[g+8>>2]=5;h=a+8|0;i=c[h>>2]|0;j=i+16|0;c[h>>2]=j;return}else if((b|0)==8){b=c[f>>2]|0;f=c[a+8>>2]|0;g=b+72|0;e=f;k=c[g+4>>2]|0;c[e>>2]=c[g>>2];c[e+4>>2]=k;c[f+8>>2]=c[b+80>>2];h=a+8|0;i=c[h>>2]|0;j=i+16|0;c[h>>2]=j;return}else{c[(c[a+8>>2]|0)+8>>2]=0;h=a+8|0;i=c[h>>2]|0;j=i+16|0;c[h>>2]=j;return}}function dl(a,b){a=a|0;b=b|0;var e=0,f=0,g=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else if((b|0)==(-10002|0)){f=a+72|0;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=a+8|0;g=c[b>>2]|0;gn(a,f,g-32|0,g-16|0);c[b>>2]=(c[b>>2]|0)-32;return}function dm(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+16|0;g=f|0;do{if((b|0)>0){h=(c[a+12>>2]|0)+(b-1<<4)|0;j=h>>>0<(c[a+8>>2]|0)>>>0?h:1032}else{if((b|0)>-1e4){j=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10001|0)){h=a+88|0;c[h>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;j=h;break}else if((b|0)==(-1e4|0)){j=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10002|0)){j=a+72|0;break}else{h=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;k=-10002-b|0;if((k|0)>(d[h+7|0]|0|0)){j=1032;break}j=h+24+(k-1<<4)|0;break}}}while(0);c[g>>2]=f_(a,e,j_(e|0)|0)|0;c[g+8>>2]=4;e=a+8|0;gn(a,j,g,(c[e>>2]|0)-16|0);c[e>>2]=(c[e>>2]|0)-16;i=f;return}function dn(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;do{if((e|0)>0){f=(c[b+12>>2]|0)+(e-1<<4)|0;g=f>>>0<(c[b+8>>2]|0)>>>0?f:1032}else{if((e|0)>-1e4){g=(c[b+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-1e4|0)){g=(c[b+16>>2]|0)+96|0;break}else if((e|0)==(-10001|0)){f=b+88|0;c[f>>2]=c[(c[c[(c[b+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[b+96>>2]=5;g=f;break}else if((e|0)==(-10002|0)){g=b+72|0;break}else{f=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;h=-10002-e|0;if((h|0)>(d[f+7|0]|0|0)){g=1032;break}g=f+24+(h-1<<4)|0;break}}}while(0);e=b+8|0;h=c[e>>2]|0;f=g;g=f9(b,c[f>>2]|0,h-32|0)|0;i=h-16|0;j=g;k=c[i+4>>2]|0;c[j>>2]=c[i>>2];c[j+4>>2]=k;c[g+8>>2]=c[h-16+8>>2];h=c[e>>2]|0;if((c[h-16+8>>2]|0)<=3){l=h;m=l-32|0;c[e>>2]=m;return}if((a[(c[h-16>>2]|0)+5|0]&3)==0){l=h;m=l-32|0;c[e>>2]=m;return}g=c[f>>2]|0;if((a[g+5|0]&4)==0){l=h;m=l-32|0;c[e>>2]=m;return}e2(b,g);l=c[e>>2]|0;m=l-32|0;c[e>>2]=m;return}function dp(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0;do{if((e|0)>0){g=(c[b+12>>2]|0)+(e-1<<4)|0;h=g>>>0<(c[b+8>>2]|0)>>>0?g:1032}else{if((e|0)>-1e4){h=(c[b+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-10001|0)){g=b+88|0;c[g>>2]=c[(c[c[(c[b+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[b+96>>2]=5;h=g;break}else if((e|0)==(-10002|0)){h=b+72|0;break}else if((e|0)==(-1e4|0)){h=(c[b+16>>2]|0)+96|0;break}else{g=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;i=-10002-e|0;if((i|0)>(d[g+7|0]|0|0)){h=1032;break}h=g+24+(i-1<<4)|0;break}}}while(0);e=b+8|0;i=c[e>>2]|0;g=h;h=gc(b,c[g>>2]|0,f)|0;f=i-16|0;j=h;k=c[f+4>>2]|0;c[j>>2]=c[f>>2];c[j+4>>2]=k;c[h+8>>2]=c[i-16+8>>2];i=c[e>>2]|0;if((c[i-16+8>>2]|0)<=3){l=i;m=l-16|0;c[e>>2]=m;return}if((a[(c[i-16>>2]|0)+5|0]&3)==0){l=i;m=l-16|0;c[e>>2]=m;return}h=c[g>>2]|0;if((a[h+5|0]&4)==0){l=i;m=l-16|0;c[e>>2]=m;return}e2(b,h);l=c[e>>2]|0;m=l-16|0;c[e>>2]=m;return}function dq(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;do{if((e|0)>0){f=(c[b+12>>2]|0)+(e-1<<4)|0;g=f>>>0<(c[b+8>>2]|0)>>>0?f:1032}else{if((e|0)>-1e4){g=(c[b+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-10001|0)){f=b+88|0;c[f>>2]=c[(c[c[(c[b+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[b+96>>2]=5;g=f;break}else if((e|0)==(-1e4|0)){g=(c[b+16>>2]|0)+96|0;break}else if((e|0)==(-10002|0)){g=b+72|0;break}else{f=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;h=-10002-e|0;if((h|0)>(d[f+7|0]|0|0)){g=1032;break}g=f+24+(h-1<<4)|0;break}}}while(0);e=b+8|0;h=c[e>>2]|0;if((c[h-16+8>>2]|0)==0){i=0}else{i=c[h-16>>2]|0}h=c[g+8>>2]|0;do{if((h|0)==5){f=g;c[(c[f>>2]|0)+8>>2]=i;if((i|0)==0){break}if((a[i+5|0]&3)==0){break}j=c[f>>2]|0;if((a[j+5|0]&4)==0){break}e2(b,j)}else if((h|0)==7){j=g;c[(c[j>>2]|0)+8>>2]=i;if((i|0)==0){break}if((a[i+5|0]&3)==0){break}f=c[j>>2]|0;if((a[f+5|0]&4)==0){break}e7(b,f,i)}else{c[(c[b+16>>2]|0)+152+(h<<2)>>2]=i}}while(0);c[e>>2]=(c[e>>2]|0)-16;return 1}function dr(a){a=a|0;return d[a+6|0]|0|0}function ds(a,b){a=a|0;b=b|0;var d=0;d=a+16|0;if((b|0)!=0){c[b>>2]=c[(c[d>>2]|0)+16>>2]}return c[(c[d>>2]|0)+12>>2]|0}function dt(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=a+16|0;c[(c[e>>2]|0)+16>>2]=d;c[(c[e>>2]|0)+12>>2]=b;return}function du(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0;do{if((e|0)>0){g=(c[b+12>>2]|0)+(e-1<<4)|0;h=g>>>0<(c[b+8>>2]|0)>>>0?g:1032}else{if((e|0)>-1e4){h=(c[b+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-10002|0)){h=b+72|0;break}else if((e|0)==(-10001|0)){g=b+88|0;c[g>>2]=c[(c[c[(c[b+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[b+96>>2]=5;h=g;break}else if((e|0)==(-1e4|0)){h=(c[b+16>>2]|0)+96|0;break}else{g=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;i=-10002-e|0;if((i|0)>(d[g+7|0]|0)){h=1032;break}h=g+24+(i-1<<4)|0;break}}}while(0);if((c[h+8>>2]|0)!=6){j=0;return j|0}e=c[h>>2]|0;h=e;do{if((a[e+6|0]|0)==0){i=c[e+16>>2]|0;if((f|0)<=0){j=0;return j|0}if((c[i+36>>2]|0)<(f|0)){j=0;return j|0}g=f-1|0;k=(c[(c[i+28>>2]|0)+(g<<2)>>2]|0)+16|0;if((k|0)==0){j=0;return j|0}else{l=c[(c[e+20+(g<<2)>>2]|0)+8>>2]|0;m=k;break}}else{if((f|0)<=0){j=0;return j|0}if((d[h+7|0]|0)<(f|0)){j=0;return j|0}else{l=e+24+(f-1<<4)|0;m=10544;break}}}while(0);f=b+8|0;b=c[f>>2]|0;e=l;h=b;k=c[e+4>>2]|0;c[h>>2]=c[e>>2];c[h+4>>2]=k;c[b+8>>2]=c[l+8>>2];c[f>>2]=(c[f>>2]|0)+16;j=m;return j|0}function dv(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0;do{if((e|0)>0){f=(c[b+12>>2]|0)+(e-1<<4)|0;g=f>>>0<(c[b+8>>2]|0)>>>0?f:1032}else{if((e|0)>-1e4){g=(c[b+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-10002|0)){g=b+72|0;break}else if((e|0)==(-10001|0)){f=b+88|0;c[f>>2]=c[(c[c[(c[b+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[b+96>>2]=5;g=f;break}else if((e|0)==(-1e4|0)){g=(c[b+16>>2]|0)+96|0;break}else{f=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;h=-10002-e|0;if((h|0)>(d[f+7|0]|0|0)){g=1032;break}g=f+24+(h-1<<4)|0;break}}}while(0);e=c[g+8>>2]|0;if((e|0)==7){c[(c[g>>2]|0)+12>>2]=c[(c[b+8>>2]|0)-16>>2]}else if((e|0)==6){c[(c[g>>2]|0)+12>>2]=c[(c[b+8>>2]|0)-16>>2]}else if((e|0)==8){e=c[g>>2]|0;c[e+72>>2]=c[(c[b+8>>2]|0)-16>>2];c[e+80>>2]=5}else{i=0;j=b+8|0;k=c[j>>2]|0;l=k-16|0;c[j>>2]=l;return i|0}e=b+8|0;h=c[(c[e>>2]|0)-16>>2]|0;if((a[h+5|0]&3)==0){i=1;j=e;k=c[j>>2]|0;l=k-16|0;c[j>>2]=l;return i|0}f=c[g>>2]|0;if((a[f+5|0]&4)==0){i=1;j=e;k=c[j>>2]|0;l=k-16|0;c[j>>2]=l;return i|0}e7(b,f,h);i=1;j=e;k=c[j>>2]|0;l=k-16|0;c[j>>2]=l;return i|0}function dw(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=a+8|0;eG(a,(c[e>>2]|0)+(~b<<4)|0,d);if((d|0)!=-1){return}d=c[e>>2]|0;e=(c[a+20>>2]|0)+8|0;if(d>>>0<(c[e>>2]|0)>>>0){return}c[e>>2]=d;return}function dx(a,b,e,f){a=a|0;b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0;g=i;i=i+8|0;h=g|0;if((f|0)==0){j=0;k=c[a+32>>2]|0}else{do{if((f|0)>0){l=(c[a+12>>2]|0)+(f-1<<4)|0;m=l>>>0<(c[a+8>>2]|0)>>>0?l:1032}else{if((f|0)>-1e4){m=(c[a+8>>2]|0)+(f<<4)|0;break}if((f|0)==(-1e4|0)){m=(c[a+16>>2]|0)+96|0;break}else if((f|0)==(-10002|0)){m=a+72|0;break}else if((f|0)==(-10001|0)){l=a+88|0;c[l>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;m=l;break}else{l=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;n=-10002-f|0;if((n|0)>(d[l+7|0]|0|0)){m=1032;break}m=l+24+(n-1<<4)|0;break}}}while(0);f=c[a+32>>2]|0;j=m-f|0;k=f}f=a+8|0;m=(c[f>>2]|0)+(~b<<4)|0;c[h>>2]=m;c[h+4>>2]=e;b=eJ(a,252,h,m-k|0,j)|0;if((e|0)!=-1){i=g;return b|0}e=c[f>>2]|0;f=(c[a+20>>2]|0)+8|0;if(e>>>0<(c[f>>2]|0)>>>0){i=g;return b|0}c[f>>2]=e;i=g;return b|0}function dy(a,b){a=a|0;b=b|0;eG(a,c[b>>2]|0,c[b+4>>2]|0);return}function dz(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;i=i+8|0;f=e|0;c[f>>2]=b;c[f+4>>2]=d;d=eJ(a,264,f,(c[a+8>>2]|0)-(c[a+32>>2]|0)|0,0)|0;i=e;return d|0}function dA(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=c[a+20>>2]|0;if((d|0)==(c[a+40>>2]|0)){e=c[a+72>>2]|0}else{e=c[(c[c[d+4>>2]>>2]|0)+12>>2]|0}d=eO(a,0,e)|0;c[d+16>>2]=c[b>>2];e=a+8|0;f=c[e>>2]|0;c[f>>2]=d;c[f+8>>2]=6;f=c[e>>2]|0;d=f+16|0;c[e>>2]=d;c[d>>2]=c[b+4>>2];c[f+24>>2]=2;f=c[e>>2]|0;c[e>>2]=f+16;eG(a,f-16|0,0);return}function dB(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=i;i=i+24|0;f=e|0;gs(a,f,b,c);c=eK(a,f,(d|0)==0?8488:d)|0;i=e;return c|0}function dC(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=c[b+8>>2]|0;if((c[f-16+8>>2]|0)!=6){g=1;return g|0}h=c[f-16>>2]|0;if((a[h+6|0]|0)!=0){g=1;return g|0}g=eM(b,c[h+16>>2]|0,d,e,0)|0;return g|0}function dD(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;f=c[b+16>>2]|0;L931:do{switch(d|0){case 0:{c[f+64>>2]=-3;g=0;break};case 1:{c[f+64>>2]=c[f+68>>2];g=0;break};case 5:{h=e<<10;i=f+68|0;j=c[i>>2]|0;if(h>>>0>j>>>0){c[f+64>>2]=0;k=0}else{l=j-h|0;c[f+64>>2]=l;k=l}l=f+64|0;h=f+21|0;m=k;n=j;while(1){if(m>>>0>n>>>0){g=0;break L931}e1(b);if((a[h]|0)==0){g=1;break L931}m=c[l>>2]|0;n=c[i>>2]|0}break};case 2:{e5(b);g=0;break};case 6:{i=f+80|0;n=c[i>>2]|0;c[i>>2]=e;g=n;break};case 7:{n=f+84|0;i=c[n>>2]|0;c[n>>2]=e;g=i;break};case 4:{g=c[f+68>>2]&1023;break};case 3:{g=(c[f+68>>2]|0)>>>10;break};default:{g=-1}}}while(0);return g|0}function dE(a){a=a|0;ew(a);return 0}function dF(a,b){a=a|0;b=b|0;var e=0,f=0,g=0;do{if((b|0)>0){e=(c[a+12>>2]|0)+(b-1<<4)|0;f=e>>>0<(c[a+8>>2]|0)>>>0?e:1032}else{if((b|0)>-1e4){f=(c[a+8>>2]|0)+(b<<4)|0;break}if((b|0)==(-10002|0)){f=a+72|0;break}else if((b|0)==(-1e4|0)){f=(c[a+16>>2]|0)+96|0;break}else if((b|0)==(-10001|0)){e=a+88|0;c[e>>2]=c[(c[c[(c[a+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[a+96>>2]=5;f=e;break}else{e=c[c[(c[a+20>>2]|0)+4>>2]>>2]|0;g=-10002-b|0;if((g|0)>(d[e+7|0]|0|0)){f=1032;break}f=e+24+(g-1<<4)|0;break}}}while(0);b=a+8|0;g=f0(a,c[f>>2]|0,(c[b>>2]|0)-16|0)|0;f=c[b>>2]|0;c[b>>2]=(g|0)==0?f-16|0:f+16|0;return g|0}function dG(a,b){a=a|0;b=b|0;var d=0;if((b|0)>1){d=c[a+16>>2]|0;if((c[d+68>>2]|0)>>>0>=(c[d+64>>2]|0)>>>0){e1(a)}d=a+8|0;gq(a,b,((c[d>>2]|0)-(c[a+12>>2]|0)>>4)-1|0);c[d>>2]=(c[d>>2]|0)+(1-b<<4);return}else{if((b|0)!=0){return}b=a+8|0;d=c[b>>2]|0;c[d>>2]=f_(a,10544,0)|0;c[d+8>>2]=4;c[b>>2]=(c[b>>2]|0)+16;return}}function dH(a,b){a=a|0;b=b|0;var d=0,e=0;d=c[a+16>>2]|0;if((c[d+68>>2]|0)>>>0>=(c[d+64>>2]|0)>>>0){e1(a)}d=c[a+20>>2]|0;if((d|0)==(c[a+40>>2]|0)){e=c[a+72>>2]|0}else{e=c[(c[c[d+4>>2]>>2]|0)+12>>2]|0}d=f$(a,b,e)|0;e=a+8|0;a=c[e>>2]|0;c[a>>2]=d;c[a+8>>2]=7;c[e>>2]=(c[e>>2]|0)+16;return d+24|0}function dI(a){a=a|0;var b=0;b=c[a+24>>2]|0;c[a+28>>2]=b;return b|0}function dJ(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;do{if((e|0)>0){g=(c[b+12>>2]|0)+(e-1<<4)|0;h=g>>>0<(c[b+8>>2]|0)>>>0?g:1032}else{if((e|0)>-1e4){h=(c[b+8>>2]|0)+(e<<4)|0;break}if((e|0)==(-10002|0)){h=b+72|0;break}else if((e|0)==(-10001|0)){g=b+88|0;c[g>>2]=c[(c[c[(c[b+20>>2]|0)+4>>2]>>2]|0)+12>>2];c[b+96>>2]=5;h=g;break}else if((e|0)==(-1e4|0)){h=(c[b+16>>2]|0)+96|0;break}else{g=c[c[(c[b+20>>2]|0)+4>>2]>>2]|0;i=-10002-e|0;if((i|0)>(d[g+7|0]|0)){h=1032;break}h=g+24+(i-1<<4)|0;break}}}while(0);if((c[h+8>>2]|0)!=6){j=0;return j|0}e=h;h=c[e>>2]|0;i=h;do{if((a[h+6|0]|0)==0){g=c[h+16>>2]|0;if((f|0)<=0){j=0;return j|0}if((c[g+36>>2]|0)<(f|0)){j=0;return j|0}k=f-1|0;l=(c[(c[g+28>>2]|0)+(k<<2)>>2]|0)+16|0;if((l|0)==0){j=0;return j|0}else{m=c[(c[h+20+(k<<2)>>2]|0)+8>>2]|0;n=l;break}}else{if((f|0)<=0){j=0;return j|0}if((d[i+7|0]|0)<(f|0)){j=0;return j|0}else{m=h+24+(f-1<<4)|0;n=10544;break}}}while(0);f=b+8|0;h=c[f>>2]|0;i=h-16|0;c[f>>2]=i;l=i;i=m;k=c[l+4>>2]|0;c[i>>2]=c[l>>2];c[i+4>>2]=k;c[m+8>>2]=c[h-16+8>>2];h=c[f>>2]|0;if((c[h+8>>2]|0)<=3){j=n;return j|0}f=c[h>>2]|0;if((a[f+5|0]&3)==0){j=n;return j|0}h=c[e>>2]|0;if((a[h+5|0]&4)==0){j=n;return j|0}e7(b,h,f);j=n;return j|0}function dK(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;f=c[a+24>>2]|0;do{if((f|0)>(c[a+28>>2]|0)){if((f|0)==0){if((d[a+50|0]|0|0)>(b|0)){break}return}g=(c[(c[a>>2]|0)+12>>2]|0)+(f-1<<2)|0;h=c[g>>2]|0;if((h&63|0)!=3){break}i=h>>>23;if((h>>>6&255|0)>(b|0)){break}if((i+1|0)<(b|0)){break}j=b-1+e|0;if((j|0)<=(i|0)){return}c[g>>2]=h&8388607|j<<23;return}}while(0);ec(a,b<<6|(e+b<<23)-8388608|3,c[(c[a+12>>2]|0)+8>>2]|0)|0;return}function dL(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;return ec(a,d<<6|b|e<<23|f<<14,c[(c[a+12>>2]|0)+8>>2]|0)|0}function dM(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;b=a+32|0;d=c[b>>2]|0;c[b>>2]=-1;b=a+12|0;e=ec(a,2147450902,c[(c[b>>2]|0)+8>>2]|0)|0;if((d|0)==-1){f=e;return f|0}if((e|0)==-1){f=d;return f|0}g=c[(c[a>>2]|0)+12>>2]|0;a=e;while(1){h=g+(a<<2)|0;i=c[h>>2]|0;j=(i>>>14)-131071|0;if((j|0)==-1){break}k=a+1+j|0;if((k|0)==-1){break}else{a=k}}g=d+~a|0;if((((g|0)>-1?g:-g|0)|0)>131071){ff(c[b>>2]|0,5464);l=c[h>>2]|0}else{l=i}c[h>>2]=l&16383|(g<<14)+2147467264;f=e;return f|0}function dN(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;return ec(a,d<<6|b|e<<14,c[(c[a+12>>2]|0)+8>>2]|0)|0}function dO(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;if((d|0)==-1){return}e=c[b>>2]|0;if((e|0)==-1){c[b>>2]=d;return}b=c[(c[a>>2]|0)+12>>2]|0;f=e;while(1){g=b+(f<<2)|0;h=c[g>>2]|0;e=(h>>>14)-131071|0;if((e|0)==-1){break}i=f+1+e|0;if((i|0)==-1){break}else{f=i}}b=~f+d|0;if((((b|0)>-1?b:-b|0)|0)>131071){ff(c[a+12>>2]|0,5464);j=c[g>>2]|0}else{j=h}c[g>>2]=j&16383|(b<<14)+2147467264;return}function dP(a,b,d){a=a|0;b=b|0;d=d|0;ec(a,b<<6|(d<<23)+8388608|30,c[(c[a+12>>2]|0)+8>>2]|0)|0;return}function dQ(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;if((c[b+24>>2]|0)==(e|0)){c[b+28>>2]=e;f=b+32|0;if((d|0)==-1){return}g=c[f>>2]|0;if((g|0)==-1){c[f>>2]=d;return}f=c[(c[b>>2]|0)+12>>2]|0;h=g;while(1){i=f+(h<<2)|0;j=c[i>>2]|0;g=(j>>>14)-131071|0;if((g|0)==-1){break}k=h+1+g|0;if((k|0)==-1){break}else{h=k}}f=~h+d|0;if((((f|0)>-1?f:-f|0)|0)>131071){ff(c[b+12>>2]|0,5464);l=c[i>>2]|0}else{l=j}c[i>>2]=l&16383|(f<<14)+2147467264;return}if((d|0)==-1){return}f=b|0;l=b+12|0;b=d;while(1){d=c[(c[f>>2]|0)+12>>2]|0;i=d+(b<<2)|0;j=c[i>>2]|0;h=(j>>>14)-131071|0;if((h|0)==-1){m=-1}else{m=b+1+h|0}if((b|0)>0){h=d+(b-1<<2)|0;d=c[h>>2]|0;if((a[992+(d&63)|0]|0)<0){n=h;o=d}else{p=890}}else{p=890}if((p|0)==890){p=0;n=i;o=j}if((o&63|0)==27){c[n>>2]=o&8372224|o>>>23<<6|26;d=(c[(c[f>>2]|0)+12>>2]|0)+(b<<2)|0;h=~b+e|0;if((((h|0)>-1?h:-h|0)|0)>131071){ff(c[l>>2]|0,5464)}c[d>>2]=c[d>>2]&16383|(h<<14)+2147467264}else{h=~b+e|0;if((((h|0)>-1?h:-h|0)|0)>131071){ff(c[l>>2]|0,5464);q=c[i>>2]|0}else{q=j}c[i>>2]=q&16383|(h<<14)+2147467264}if((m|0)==-1){break}else{b=m}}return}function dR(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;c[a+28>>2]=c[a+24>>2];d=a+32|0;if((b|0)==-1){return}e=c[d>>2]|0;if((e|0)==-1){c[d>>2]=b;return}d=c[(c[a>>2]|0)+12>>2]|0;f=e;while(1){g=d+(f<<2)|0;h=c[g>>2]|0;e=(h>>>14)-131071|0;if((e|0)==-1){break}i=f+1+e|0;if((i|0)==-1){break}else{f=i}}d=~f+b|0;if((((d|0)>-1?d:-d|0)|0)>131071){ff(c[a+12>>2]|0,5464);j=c[g>>2]|0}else{j=h}c[g>>2]=j&16383|(d<<14)+2147467264;return}function dS(b,e){b=b|0;e=e|0;var f=0,g=0,h=0;f=(c[b+36>>2]|0)+e|0;e=b|0;g=c[e>>2]|0;if((f|0)<=(d[g+75|0]|0|0)){return}if((f|0)>249){ff(c[b+12>>2]|0,5128);h=c[e>>2]|0}else{h=g}a[h+75|0]=f&255;return}function dT(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;f=b+36|0;g=c[f>>2]|0;h=g+e|0;i=b|0;j=c[i>>2]|0;if((h|0)<=(d[j+75|0]|0|0)){k=g;l=k+e|0;c[f>>2]=l;return}if((h|0)>249){ff(c[b+12>>2]|0,5128);m=c[i>>2]|0}else{m=j}a[m+75|0]=h&255;k=c[f>>2]|0;l=k+e|0;c[f>>2]=l;return}function dU(a,b){a=a|0;b=b|0;var d=0,e=0;d=i;i=i+16|0;e=d|0;c[e>>2]=b;c[e+8>>2]=4;b=dV(a,e,e)|0;i=d;return b|0}function dV(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0;f=c[b+16>>2]|0;g=f9(f,c[b+4>>2]|0,d)|0;d=c[b>>2]|0;i=d+40|0;j=c[i>>2]|0;k=g+8|0;if((c[k>>2]|0)==3){l=~~+h[g>>3];return l|0}m=b+40|0;h[g>>3]=+(c[m>>2]|0);c[k>>2]=3;k=c[i>>2]|0;if(((c[m>>2]|0)+1|0)>(k|0)){g=d+8|0;c[g>>2]=ft(f,c[g>>2]|0,i,16,262143,7128)|0;n=c[i>>2]|0}else{n=k}k=d+8|0;if((j|0)<(n|0)){n=j;while(1){j=n+1|0;c[(c[k>>2]|0)+(n<<4)+8>>2]=0;if((j|0)<(c[i>>2]|0)){n=j}else{break}}}n=c[m>>2]|0;i=c[k>>2]|0;k=e;j=i+(n<<4)|0;g=c[k+4>>2]|0;c[j>>2]=c[k>>2];c[j+4>>2]=g;g=e+8|0;c[i+(n<<4)+8>>2]=c[g>>2];do{if((c[g>>2]|0)>3){n=c[e>>2]|0;if((a[n+5|0]&3)==0){break}if((a[d+5|0]&4)==0){break}e7(f,d,n)}}while(0);d=c[m>>2]|0;c[m>>2]=d+1;l=d;return l|0}function dW(a,b){a=a|0;b=+b;var d=0,e=0,f=0;d=i;i=i+16|0;e=d|0;h[e>>3]=b;c[e+8>>2]=3;f=dV(a,e,e)|0;i=d;return f|0}function dX(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0;g=c[e>>2]|0;if((g|0)==13){h=(c[(c[b>>2]|0)+12>>2]|0)+(c[e+8>>2]<<2)|0;c[h>>2]=c[h>>2]&-8372225|(f<<14)+16384&8372224;return}else if((g|0)==14){g=e+8|0;e=b|0;h=(c[(c[e>>2]|0)+12>>2]|0)+(c[g>>2]<<2)|0;c[h>>2]=c[h>>2]&8388607|(f<<23)+8388608;f=(c[(c[e>>2]|0)+12>>2]|0)+(c[g>>2]<<2)|0;g=b+36|0;c[f>>2]=c[g>>2]<<6&16320|c[f>>2]&-16321;f=c[g>>2]|0;h=f+1|0;i=c[e>>2]|0;if((h|0)>(d[i+75|0]|0|0)){if((h|0)>249){ff(c[b+12>>2]|0,5128);j=c[e>>2]|0}else{j=i}a[j+75|0]=h&255;k=c[g>>2]|0}else{k=f}c[g>>2]=k+1;return}else{return}}function dY(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b|0;e=c[d>>2]|0;if((e|0)==13){c[d>>2]=12;f=b+8|0;c[f>>2]=(c[(c[(c[a>>2]|0)+12>>2]|0)+(c[f>>2]<<2)>>2]|0)>>>6&255;return}else if((e|0)==14){e=(c[(c[a>>2]|0)+12>>2]|0)+(c[b+8>>2]<<2)|0;c[e>>2]=c[e>>2]&8388607|16777216;c[d>>2]=11;return}else{return}}function dZ(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=b|0;switch(c[e>>2]|0){case 6:{c[e>>2]=12;return};case 8:{f=b+8|0;c[f>>2]=ec(a,c[f>>2]<<14|5,c[(c[a+12>>2]|0)+8>>2]|0)|0;c[e>>2]=11;return};case 14:{f=(c[(c[a>>2]|0)+12>>2]|0)+(c[b+8>>2]<<2)|0;c[f>>2]=c[f>>2]&8388607|16777216;c[e>>2]=11;return};case 7:{f=b+8|0;c[f>>2]=ec(a,c[f>>2]<<23|4,c[(c[a+12>>2]|0)+8>>2]|0)|0;c[e>>2]=11;return};case 9:{f=b+8|0;g=f+4|0;h=c[g>>2]|0;do{if((h&256|0)==0){if((d[a+50|0]|0|0)>(h|0)){break}i=a+36|0;c[i>>2]=(c[i>>2]|0)-1}}while(0);h=f;f=c[h>>2]|0;do{if((f&256|0)==0){if((d[a+50|0]|0|0)>(f|0)){j=f;break}i=a+36|0;c[i>>2]=(c[i>>2]|0)-1;j=c[h>>2]|0}else{j=f}}while(0);c[h>>2]=ec(a,j<<23|c[g>>2]<<14|6,c[(c[a+12>>2]|0)+8>>2]|0)|0;c[e>>2]=11;return};case 13:{c[e>>2]=12;e=b+8|0;c[e>>2]=(c[(c[(c[a>>2]|0)+12>>2]|0)+(c[e>>2]<<2)>>2]|0)>>>6&255;return};default:{return}}}function d_(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;dZ(b,e);do{if((c[e>>2]|0)==12){f=c[e+8>>2]|0;if((f&256|0)!=0){break}if((d[b+50|0]|0|0)>(f|0)){break}f=b+36|0;c[f>>2]=(c[f>>2]|0)-1}}while(0);f=b+36|0;g=c[f>>2]|0;h=g+1|0;i=b|0;j=c[i>>2]|0;if((h|0)<=(d[j+75|0]|0|0)){k=g;l=k+1|0;c[f>>2]=l;d$(b,e,k);return}if((h|0)>249){ff(c[b+12>>2]|0,5128);m=c[i>>2]|0}else{m=j}a[m+75|0]=h&255;k=c[f>>2]|0;l=k+1|0;c[f>>2]=l;d$(b,e,k);return}function d$(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0;ek(b,d,e);f=d|0;g=d+16|0;do{if((c[f>>2]|0)==10){h=c[d+8>>2]|0;if((h|0)==-1){break}i=c[g>>2]|0;if((i|0)==-1){c[g>>2]=h;break}j=c[(c[b>>2]|0)+12>>2]|0;k=i;while(1){l=j+(k<<2)|0;m=c[l>>2]|0;i=(m>>>14)-131071|0;if((i|0)==-1){break}n=k+1+i|0;if((n|0)==-1){break}else{k=n}}j=h+~k|0;if((((j|0)>-1?j:-j|0)|0)>131071){ff(c[b+12>>2]|0,5464);o=c[l>>2]|0}else{o=m}c[l>>2]=o&16383|(j<<14)+2147467264}}while(0);o=c[g>>2]|0;l=d+20|0;m=c[l>>2]|0;if((o|0)==(m|0)){c[g>>2]=-1;c[l>>2]=-1;p=d+8|0;q=p;c[q>>2]=e;c[f>>2]=12;return}L1250:do{if((o|0)==-1){r=1017}else{j=c[(c[b>>2]|0)+12>>2]|0;n=o;while(1){i=j+(n<<2)|0;if((n|0)>0){s=c[j+(n-1<<2)>>2]|0;if((a[992+(s&63)|0]|0)<0){t=s}else{r=1013}}else{r=1013}if((r|0)==1013){r=0;t=c[i>>2]|0}if((t&63|0)!=27){r=1025;break L1250}s=((c[i>>2]|0)>>>14)-131071|0;if((s|0)==-1){r=1017;break L1250}i=n+1+s|0;if((i|0)==-1){r=1017;break}else{n=i}}}}while(0);L1261:do{if((r|0)==1017){if((m|0)==-1){u=-1;v=-1;break}t=c[(c[b>>2]|0)+12>>2]|0;o=m;while(1){n=t+(o<<2)|0;if((o|0)>0){j=c[t+(o-1<<2)>>2]|0;if((a[992+(j&63)|0]|0)<0){w=j}else{r=1021}}else{r=1021}if((r|0)==1021){r=0;w=c[n>>2]|0}if((w&63|0)!=27){r=1025;break L1261}j=((c[n>>2]|0)>>>14)-131071|0;if((j|0)==-1){u=-1;v=-1;break L1261}n=o+1+j|0;if((n|0)==-1){u=-1;v=-1;break}else{o=n}}}}while(0);do{if((r|0)==1025){do{if((c[f>>2]|0)==10){x=-1;y=b+12|0;z=b+32|0}else{w=b+32|0;m=c[w>>2]|0;c[w>>2]=-1;o=b+12|0;t=ec(b,2147450902,c[(c[o>>2]|0)+8>>2]|0)|0;if((m|0)==-1){x=t;y=o;z=w;break}if((t|0)==-1){x=m;y=o;z=w;break}n=c[(c[b>>2]|0)+12>>2]|0;j=t;while(1){A=n+(j<<2)|0;B=c[A>>2]|0;k=(B>>>14)-131071|0;if((k|0)==-1){break}h=j+1+k|0;if((h|0)==-1){break}else{j=h}}n=m+~j|0;if((((n|0)>-1?n:-n|0)|0)>131071){ff(c[o>>2]|0,5464);C=c[A>>2]|0}else{C=B}c[A>>2]=C&16383|(n<<14)+2147467264;x=t;y=o;z=w}}while(0);n=b+24|0;h=b+28|0;c[h>>2]=c[n>>2];k=e<<6;i=ec(b,k|16386,c[(c[y>>2]|0)+8>>2]|0)|0;c[h>>2]=c[n>>2];s=ec(b,k|8388610,c[(c[y>>2]|0)+8>>2]|0)|0;c[h>>2]=c[n>>2];if((x|0)==-1){u=i;v=s;break}n=c[z>>2]|0;if((n|0)==-1){c[z>>2]=x;u=i;v=s;break}h=c[(c[b>>2]|0)+12>>2]|0;k=n;while(1){D=h+(k<<2)|0;E=c[D>>2]|0;n=(E>>>14)-131071|0;if((n|0)==-1){break}F=k+1+n|0;if((F|0)==-1){break}else{k=F}}h=x+~k|0;if((((h|0)>-1?h:-h|0)|0)>131071){ff(c[y>>2]|0,5464);G=c[D>>2]|0}else{G=E}c[D>>2]=G&16383|(h<<14)+2147467264;u=i;v=s}}while(0);G=c[b+24>>2]|0;c[b+28>>2]=G;D=c[l>>2]|0;if((D|0)!=-1){E=b|0;y=(e|0)==255;x=b+12|0;z=e<<6&16320;C=D;while(1){D=c[(c[E>>2]|0)+12>>2]|0;A=D+(C<<2)|0;B=c[A>>2]|0;h=(B>>>14)-131071|0;if((h|0)==-1){H=-1}else{H=C+1+h|0}if((C|0)>0){h=D+(C-1<<2)|0;D=c[h>>2]|0;if((a[992+(D&63)|0]|0)<0){I=h;J=D}else{r=1050}}else{r=1050}if((r|0)==1050){r=0;I=A;J=B}if((J&63|0)==27){D=J>>>23;if(y|(D|0)==(e|0)){K=J&8372224|D<<6|26}else{K=J&-16321|z}c[I>>2]=K;D=(c[(c[E>>2]|0)+12>>2]|0)+(C<<2)|0;h=G+~C|0;if((((h|0)>-1?h:-h|0)|0)>131071){ff(c[x>>2]|0,5464)}c[D>>2]=c[D>>2]&16383|(h<<14)+2147467264}else{h=u+~C|0;if((((h|0)>-1?h:-h|0)|0)>131071){ff(c[x>>2]|0,5464);L=c[A>>2]|0}else{L=B}c[A>>2]=L&16383|(h<<14)+2147467264}if((H|0)==-1){break}else{C=H}}}H=c[g>>2]|0;if((H|0)==-1){c[g>>2]=-1;c[l>>2]=-1;p=d+8|0;q=p;c[q>>2]=e;c[f>>2]=12;return}C=b|0;L=b+12|0;b=e<<6;x=b&16320;if((e|0)==255){u=H;while(1){E=c[(c[C>>2]|0)+12>>2]|0;K=E+(u<<2)|0;I=c[K>>2]|0;z=(I>>>14)-131071|0;if((z|0)==-1){M=-1}else{M=u+1+z|0}if((u|0)>0){z=E+(u-1<<2)|0;E=c[z>>2]|0;if((a[992+(E&63)|0]|0)<0){N=z;O=E}else{r=1068}}else{r=1068}if((r|0)==1068){r=0;N=K;O=I}if((O&63|0)==27){c[N>>2]=O&8372224|O>>>23<<6|26;E=(c[(c[C>>2]|0)+12>>2]|0)+(u<<2)|0;z=G+~u|0;if((((z|0)>-1?z:-z|0)|0)>131071){ff(c[L>>2]|0,5464)}c[E>>2]=c[E>>2]&16383|(z<<14)+2147467264}else{z=v+~u|0;if((((z|0)>-1?z:-z|0)|0)>131071){ff(c[L>>2]|0,5464);P=c[K>>2]|0}else{P=I}c[K>>2]=P&16383|(z<<14)+2147467264}if((M|0)==-1){break}else{u=M}}c[g>>2]=-1;c[l>>2]=-1;p=d+8|0;q=p;c[q>>2]=e;c[f>>2]=12;return}else{Q=H}while(1){H=c[(c[C>>2]|0)+12>>2]|0;M=H+(Q<<2)|0;u=c[M>>2]|0;P=(u>>>14)-131071|0;if((P|0)==-1){R=-1}else{R=Q+1+P|0}if((Q|0)>0){P=H+(Q-1<<2)|0;H=c[P>>2]|0;if((a[992+(H&63)|0]|0)<0){S=P;T=H}else{r=1081}}else{r=1081}if((r|0)==1081){r=0;S=M;T=u}if((T&63|0)==27){if((T>>>23|0)==(e|0)){U=T&8372224|b|26}else{U=T&-16321|x}c[S>>2]=U;H=(c[(c[C>>2]|0)+12>>2]|0)+(Q<<2)|0;P=G+~Q|0;if((((P|0)>-1?P:-P|0)|0)>131071){ff(c[L>>2]|0,5464)}c[H>>2]=c[H>>2]&16383|(P<<14)+2147467264}else{P=v+~Q|0;if((((P|0)>-1?P:-P|0)|0)>131071){ff(c[L>>2]|0,5464);V=c[M>>2]|0}else{V=u}c[M>>2]=V&16383|(P<<14)+2147467264}if((R|0)==-1){break}else{Q=R}}c[g>>2]=-1;c[l>>2]=-1;p=d+8|0;q=p;c[q>>2]=e;c[f>>2]=12;return}function d0(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;dZ(a,b);do{if((c[b>>2]|0)==12){e=b+8|0;f=c[e>>2]|0;if((c[b+16>>2]|0)==(c[b+20>>2]|0)){g=f;return g|0}if((f|0)<(d[a+50|0]|0|0)){h=e;break}d$(a,b,f);g=c[e>>2]|0;return g|0}else{h=b+8|0}}while(0);d_(a,b);g=c[h>>2]|0;return g|0}function d1(a,b){a=a|0;b=b|0;var e=0,f=0,g=0;e=b+16|0;f=b+20|0;if((c[e>>2]|0)==(c[f>>2]|0)){dZ(a,b);return}dZ(a,b);do{if((c[b>>2]|0)==12){g=c[b+8>>2]|0;if((c[e>>2]|0)==(c[f>>2]|0)){return}if((g|0)<(d[a+50|0]|0|0)){break}d$(a,b,g);return}}while(0);d_(a,b);return}function d2(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;e=i;i=i+64|0;f=e|0;g=e+16|0;j=e+32|0;k=e+48|0;l=b+16|0;m=b+20|0;n=(c[l>>2]|0)==(c[m>>2]|0);dZ(a,b);o=b|0;L1403:do{if(!n){do{if((c[o>>2]|0)==12){p=c[b+8>>2]|0;if((c[l>>2]|0)==(c[m>>2]|0)){break L1403}if((p|0)<(d[a+50|0]|0|0)){break}d$(a,b,p);break L1403}}while(0);d_(a,b)}}while(0);n=c[o>>2]|0;L1411:do{switch(n|0){case 5:case 2:case 3:case 1:{if((c[a+40>>2]|0)>=256){break L1411}if((n|0)==5){h[g>>3]=+h[b+8>>3];c[g+8>>2]=3;q=dV(a,g,g)|0}else if((n|0)==1){c[k+8>>2]=0;c[j>>2]=c[a+4>>2];c[j+8>>2]=5;q=dV(a,j,k)|0}else{c[f>>2]=(n|0)==2;c[f+8>>2]=1;q=dV(a,f,f)|0}c[b+8>>2]=q;c[o>>2]=4;r=q|256;i=e;return r|0};case 4:{p=c[b+8>>2]|0;if((p|0)>=256){break L1411}r=p|256;i=e;return r|0};default:{}}}while(0);dZ(a,b);do{if((c[o>>2]|0)==12){q=b+8|0;f=c[q>>2]|0;if((c[l>>2]|0)==(c[m>>2]|0)){r=f;i=e;return r|0}if((f|0)<(d[a+50|0]|0|0)){s=q;break}d$(a,b,f);r=c[q>>2]|0;i=e;return r|0}else{s=b+8|0}}while(0);d_(a,b);r=c[s>>2]|0;i=e;return r|0}function d3(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;f=c[b>>2]|0;if((f|0)==6){do{if((c[e>>2]|0)==12){g=c[e+8>>2]|0;if((g&256|0)!=0){break}if((d[a+50|0]|0|0)>(g|0)){break}g=a+36|0;c[g>>2]=(c[g>>2]|0)-1}}while(0);d$(a,e,c[b+8>>2]|0);return}else if((f|0)==7){dZ(a,e);do{if((c[e>>2]|0)==12){g=e+8|0;h=c[g>>2]|0;if((c[e+16>>2]|0)==(c[e+20>>2]|0)){i=h;break}if((h|0)<(d[a+50|0]|0|0)){j=g;k=1158;break}d$(a,e,h);i=c[g>>2]|0}else{j=e+8|0;k=1158}}while(0);if((k|0)==1158){d_(a,e);i=c[j>>2]|0}ec(a,i<<6|c[b+8>>2]<<23|8,c[(c[a+12>>2]|0)+8>>2]|0)|0}else if((f|0)==9){i=d2(a,e)|0;j=b+8|0;ec(a,i<<14|c[j>>2]<<6|c[j+4>>2]<<23|9,c[(c[a+12>>2]|0)+8>>2]|0)|0}else if((f|0)==8){dZ(a,e);do{if((c[e>>2]|0)==12){f=e+8|0;j=c[f>>2]|0;if((c[e+16>>2]|0)==(c[e+20>>2]|0)){l=j;break}if((j|0)<(d[a+50|0]|0|0)){m=f;k=1165;break}d$(a,e,j);l=c[f>>2]|0}else{m=e+8|0;k=1165}}while(0);if((k|0)==1165){d_(a,e);l=c[m>>2]|0}ec(a,l<<6|c[b+8>>2]<<14|7,c[(c[a+12>>2]|0)+8>>2]|0)|0}if((c[e>>2]|0)!=12){return}b=c[e+8>>2]|0;if((b&256|0)!=0){return}if((d[a+50|0]|0|0)>(b|0)){return}b=a+36|0;c[b>>2]=(c[b>>2]|0)-1;return}function d4(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;dZ(b,e);g=e|0;do{if((c[g>>2]|0)==12){h=c[e+8>>2]|0;if((c[e+16>>2]|0)==(c[e+20>>2]|0)){break}if((h|0)<(d[b+50|0]|0|0)){i=1182;break}d$(b,e,h)}else{i=1182}}while(0);if((i|0)==1182){d_(b,e)}do{if((c[g>>2]|0)==12){i=c[e+8>>2]|0;if((i&256|0)!=0){break}if((d[b+50|0]|0|0)>(i|0)){break}i=b+36|0;c[i>>2]=(c[i>>2]|0)-1}}while(0);i=b+36|0;h=c[i>>2]|0;j=h+2|0;k=b|0;l=c[k>>2]|0;if((j|0)>(d[l+75|0]|0|0)){if((j|0)>249){ff(c[b+12>>2]|0,5128);m=c[k>>2]|0}else{m=l}a[m+75|0]=j&255;n=c[i>>2]|0}else{n=h}c[i>>2]=n+2;n=e+8|0;e=c[n>>2]|0;j=h<<6|e<<23|(d2(b,f)|0)<<14|11;ec(b,j,c[(c[b+12>>2]|0)+8>>2]|0)|0;if((c[f>>2]|0)!=12){c[n>>2]=h;c[g>>2]=12;return}j=c[f+8>>2]|0;if((j&256|0)!=0){c[n>>2]=h;c[g>>2]=12;return}if((d[b+50|0]|0|0)>(j|0)){c[n>>2]=h;c[g>>2]=12;return}c[i>>2]=(c[i>>2]|0)-1;c[n>>2]=h;c[g>>2]=12;return}function d5(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;dZ(b,e);f=e|0;g=c[f>>2]|0;L1503:do{if((g|0)==10){h=c[(c[b>>2]|0)+12>>2]|0;i=e+8|0;j=c[i>>2]|0;k=h+(j<<2)|0;if((j|0)>0){l=h+(j-1<<2)|0;j=c[l>>2]|0;if((a[992+(j&63)|0]|0)<0){m=l;n=j}else{o=1203}}else{o=1203}if((o|0)==1203){m=k;n=c[k>>2]|0}c[m>>2]=((n&16320|0)==0)<<6|n&-16321;p=c[i>>2]|0;o=1217}else if(!((g|0)==4|(g|0)==5|(g|0)==2)){i=e+8|0;do{if((g|0)==11){k=c[(c[(c[b>>2]|0)+12>>2]|0)+(c[i>>2]<<2)>>2]|0;if((k&63|0)!=19){o=1208;break}j=b+24|0;c[j>>2]=(c[j>>2]|0)-1;p=ee(b,26,k>>>23,0,1)|0;o=1217;break L1503}else if((g|0)==12){o=1213}else{o=1208}}while(0);if((o|0)==1208){k=b+36|0;j=c[k>>2]|0;l=j+1|0;h=b|0;q=c[h>>2]|0;if((l|0)>(d[q+75|0]|0)){if((l|0)>249){ff(c[b+12>>2]|0,5128);r=c[h>>2]|0}else{r=q}a[r+75|0]=l&255;s=c[k>>2]|0}else{s=j}c[k>>2]=s+1;ek(b,e,s);if((c[f>>2]|0)==12){o=1213}}do{if((o|0)==1213){k=c[i>>2]|0;if((k&256|0)!=0){break}if((d[b+50|0]|0)>(k|0)){break}k=b+36|0;c[k>>2]=(c[k>>2]|0)-1}}while(0);p=ee(b,27,255,c[i>>2]|0,0)|0;o=1217}}while(0);do{if((o|0)==1217){f=e+20|0;if((p|0)==-1){break}s=c[f>>2]|0;if((s|0)==-1){c[f>>2]=p;break}f=c[(c[b>>2]|0)+12>>2]|0;r=s;while(1){t=f+(r<<2)|0;u=c[t>>2]|0;s=(u>>>14)-131071|0;if((s|0)==-1){break}g=r+1+s|0;if((g|0)==-1){break}else{r=g}}f=p+~r|0;if((((f|0)>-1?f:-f|0)|0)>131071){ff(c[b+12>>2]|0,5464);v=c[t>>2]|0}else{v=u}c[t>>2]=v&16383|(f<<14)+2147467264}}while(0);v=e+16|0;e=c[v>>2]|0;c[b+28>>2]=c[b+24>>2];t=b+32|0;if((e|0)==-1){c[v>>2]=-1;return}u=c[t>>2]|0;if((u|0)==-1){c[t>>2]=e;c[v>>2]=-1;return}t=c[(c[b>>2]|0)+12>>2]|0;p=u;while(1){w=t+(p<<2)|0;x=c[w>>2]|0;u=(x>>>14)-131071|0;if((u|0)==-1){break}o=p+1+u|0;if((o|0)==-1){break}else{p=o}}t=e+~p|0;if((((t|0)>-1?t:-t|0)|0)>131071){ff(c[b+12>>2]|0,5464);y=c[w>>2]|0}else{y=x}c[w>>2]=y&16383|(t<<14)+2147467264;c[v>>2]=-1;return}function d6(a,b,d){a=a|0;b=b|0;d=d|0;c[b+12>>2]=d2(a,d)|0;c[b>>2]=9;return}function d7(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;g=i;i=i+24|0;j=g|0;c[j+20>>2]=-1;c[j+16>>2]=-1;c[j>>2]=5;h[j+8>>3]=0.0;if((e|0)==0){k=f|0;do{if((c[k>>2]|0)==5){if((c[f+16>>2]|0)!=-1){l=1244;break}if((c[f+20>>2]|0)!=-1){l=1244}}else{l=1244}}while(0);L1563:do{if((l|0)==1244){dZ(b,f);do{if((c[k>>2]|0)==12){m=c[f+8>>2]|0;if((c[f+16>>2]|0)==(c[f+20>>2]|0)){break L1563}if((m|0)<(d[b+50|0]|0)){break}d$(b,f,m);break L1563}}while(0);d_(b,f)}}while(0);d8(b,18,f,j);i=g;return}else if((e|0)==2){dZ(b,f);do{if((c[f>>2]|0)==12){k=c[f+8>>2]|0;if((c[f+16>>2]|0)==(c[f+20>>2]|0)){break}if((k|0)<(d[b+50|0]|0)){l=1290;break}d$(b,f,k)}else{l=1290}}while(0);if((l|0)==1290){d_(b,f)}d8(b,20,f,j);i=g;return}else if((e|0)==1){dZ(b,f);e=f|0;L1583:do{switch(c[e>>2]|0){case 1:case 3:{c[e>>2]=2;break};case 4:case 5:case 2:{c[e>>2]=3;break};case 10:{j=c[(c[b>>2]|0)+12>>2]|0;k=c[f+8>>2]|0;m=j+(k<<2)|0;if((k|0)>0){n=j+(k-1<<2)|0;k=c[n>>2]|0;if((a[992+(k&63)|0]|0)<0){o=n;p=k}else{l=1255}}else{l=1255}if((l|0)==1255){o=m;p=c[m>>2]|0}c[o>>2]=((p&16320|0)==0)<<6|p&-16321;break};case 11:{m=b+36|0;k=c[m>>2]|0;n=k+1|0;j=b|0;q=c[j>>2]|0;if((n|0)>(d[q+75|0]|0)){if((n|0)>249){ff(c[b+12>>2]|0,5128);r=c[j>>2]|0}else{r=q}a[r+75|0]=n&255;s=c[m>>2]|0}else{s=k}c[m>>2]=s+1;ek(b,f,s);if((c[e>>2]|0)==12){l=1263;break L1583}t=f+8|0;l=1266;break};case 12:{l=1263;break};default:{}}}while(0);do{if((l|0)==1263){s=f+8|0;r=c[s>>2]|0;if((r&256|0)!=0){t=s;l=1266;break}if((d[b+50|0]|0)>(r|0)){t=s;l=1266;break}r=b+36|0;c[r>>2]=(c[r>>2]|0)-1;t=s;l=1266}}while(0);if((l|0)==1266){c[t>>2]=ec(b,c[t>>2]<<23|19,c[(c[b+12>>2]|0)+8>>2]|0)|0;c[e>>2]=11}e=f+20|0;t=c[e>>2]|0;s=f+16|0;f=c[s>>2]|0;c[e>>2]=f;c[s>>2]=t;if((f|0)==-1){u=t}else{t=b|0;e=f;f=c[(c[t>>2]|0)+12>>2]|0;while(1){r=f+(e<<2)|0;if((e|0)>0){p=f+(e-1<<2)|0;o=c[p>>2]|0;if((a[992+(o&63)|0]|0)<0){v=p;w=o}else{l=1271}}else{l=1271}if((l|0)==1271){l=0;v=r;w=c[r>>2]|0}if((w&63|0)==27){c[v>>2]=w&8372224|w>>>23<<6|26;x=c[(c[t>>2]|0)+12>>2]|0}else{x=f}r=((c[x+(e<<2)>>2]|0)>>>14)-131071|0;if((r|0)==-1){break}o=e+1+r|0;if((o|0)==-1){break}else{e=o;f=x}}u=c[s>>2]|0}if((u|0)==-1){i=g;return}s=b|0;b=u;u=c[(c[s>>2]|0)+12>>2]|0;while(1){x=u+(b<<2)|0;if((b|0)>0){f=u+(b-1<<2)|0;e=c[f>>2]|0;if((a[992+(e&63)|0]|0)<0){y=f;z=e}else{l=1281}}else{l=1281}if((l|0)==1281){l=0;y=x;z=c[x>>2]|0}if((z&63|0)==27){c[y>>2]=z&8372224|z>>>23<<6|26;A=c[(c[s>>2]|0)+12>>2]|0}else{A=u}x=((c[A+(b<<2)>>2]|0)>>>14)-131071|0;if((x|0)==-1){l=1297;break}e=b+1+x|0;if((e|0)==-1){l=1298;break}else{b=e;u=A}}if((l|0)==1297){i=g;return}else if((l|0)==1298){i=g;return}}else{i=g;return}}function d8(a,b,e,f){a=a|0;b=b|0;e=e|0;f=f|0;var g=0,i=0,j=0,k=0.0,l=0.0,m=0.0,n=0,o=0.0;g=e|0;L1640:do{if((c[g>>2]|0)==5){if((c[e+16>>2]|0)!=-1){i=1317;break}if((c[e+20>>2]|0)!=-1){i=1317;break}if((c[f>>2]|0)!=5){i=1317;break}if((c[f+16>>2]|0)!=-1){i=1317;break}if((c[f+20>>2]|0)!=-1){i=1317;break}j=e+8|0;k=+h[j>>3];l=+h[f+8>>3];switch(b|0){case 12:{m=k+l;i=1315;break};case 16:{if(l==0.0){i=1318;break L1640}m=k-l*+O(+(k/l));i=1315;break};case 18:{m=-0.0-k;i=1315;break};case 13:{m=k-l;i=1315;break};case 15:{if(l==0.0){i=1318;break L1640}m=k/l;i=1315;break};case 14:{m=k*l;i=1315;break};case 20:{n=0;break L1640;break};case 17:{m=+R(+k,+l);i=1315;break};default:{o=0.0}}if((i|0)==1315){if(m==m&!(D=0.0,D!=D)){o=m}else{i=1317;break}}h[j>>3]=o;return}else{i=1317}}while(0);if((i|0)==1317){if((b|0)==20|(b|0)==18){n=0}else{i=1318}}if((i|0)==1318){n=d2(a,f)|0}i=d2(a,e)|0;do{if((i|0)>(n|0)){do{if((c[g>>2]|0)==12){j=c[e+8>>2]|0;if((j&256|0)!=0){break}if((d[a+50|0]|0|0)>(j|0)){break}j=a+36|0;c[j>>2]=(c[j>>2]|0)-1}}while(0);if((c[f>>2]|0)!=12){break}j=c[f+8>>2]|0;if((j&256|0)!=0){break}if((d[a+50|0]|0|0)>(j|0)){break}j=a+36|0;c[j>>2]=(c[j>>2]|0)-1}else{do{if((c[f>>2]|0)==12){j=c[f+8>>2]|0;if((j&256|0)!=0){break}if((d[a+50|0]|0|0)>(j|0)){break}j=a+36|0;c[j>>2]=(c[j>>2]|0)-1}}while(0);if((c[g>>2]|0)!=12){break}j=c[e+8>>2]|0;if((j&256|0)!=0){break}if((d[a+50|0]|0|0)>(j|0)){break}j=a+36|0;c[j>>2]=(c[j>>2]|0)-1}}while(0);c[e+8>>2]=ec(a,n<<14|b|i<<23,c[(c[a+12>>2]|0)+8>>2]|0)|0;c[g>>2]=11;return}function d9(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;switch(e|0){case 13:{d5(b,f);return};case 14:{dZ(b,f);e=f|0;g=c[e>>2]|0;L1692:do{if((g|0)==10){h=c[f+8>>2]|0;i=1357}else if(!((g|0)==1|(g|0)==3)){j=f+8|0;do{if((g|0)==11){k=c[b>>2]|0;l=c[(c[k+12>>2]|0)+(c[j>>2]<<2)>>2]|0;if((l&63|0)!=19){m=k;i=1348;break}k=b+24|0;c[k>>2]=(c[k>>2]|0)-1;h=ee(b,26,l>>>23,0,0)|0;i=1357;break L1692}else if((g|0)==12){i=1353}else{m=c[b>>2]|0;i=1348}}while(0);if((i|0)==1348){l=b+36|0;k=c[l>>2]|0;n=k+1|0;o=b|0;if((n|0)>(d[m+75|0]|0|0)){if((n|0)>249){ff(c[b+12>>2]|0,5128);p=c[o>>2]|0}else{p=m}a[p+75|0]=n&255;q=c[l>>2]|0}else{q=k}c[l>>2]=q+1;ek(b,f,q);if((c[e>>2]|0)==12){i=1353}}do{if((i|0)==1353){l=c[j>>2]|0;if((l&256|0)!=0){break}if((d[b+50|0]|0|0)>(l|0)){break}l=b+36|0;c[l>>2]=(c[l>>2]|0)-1}}while(0);h=ee(b,27,255,c[j>>2]|0,1)|0;i=1357}}while(0);do{if((i|0)==1357){e=f+16|0;if((h|0)==-1){break}q=c[e>>2]|0;if((q|0)==-1){c[e>>2]=h;break}e=c[(c[b>>2]|0)+12>>2]|0;p=q;while(1){r=e+(p<<2)|0;s=c[r>>2]|0;q=(s>>>14)-131071|0;if((q|0)==-1){break}m=p+1+q|0;if((m|0)==-1){break}else{p=m}}e=h+~p|0;if((((e|0)>-1?e:-e|0)|0)>131071){ff(c[b+12>>2]|0,5464);t=c[r>>2]|0}else{t=s}c[r>>2]=t&16383|(e<<14)+2147467264}}while(0);t=f+20|0;r=c[t>>2]|0;c[b+28>>2]=c[b+24>>2];s=b+32|0;do{if((r|0)!=-1){h=c[s>>2]|0;if((h|0)==-1){c[s>>2]=r;break}i=c[(c[b>>2]|0)+12>>2]|0;e=h;while(1){u=i+(e<<2)|0;v=c[u>>2]|0;h=(v>>>14)-131071|0;if((h|0)==-1){break}j=e+1+h|0;if((j|0)==-1){break}else{e=j}}i=r+~e|0;if((((i|0)>-1?i:-i|0)|0)>131071){ff(c[b+12>>2]|0,5464);w=c[u>>2]|0}else{w=v}c[u>>2]=w&16383|(i<<14)+2147467264}}while(0);c[t>>2]=-1;return};case 6:{d_(b,f);return};case 0:case 1:case 2:case 3:case 4:case 5:{do{if((c[f>>2]|0)==5){if((c[f+16>>2]|0)!=-1){break}if((c[f+20>>2]|0)!=-1){break}return}}while(0);d2(b,f)|0;return};default:{d2(b,f)|0;return}}}function ea(a,b){a=a|0;b=b|0;c[(c[(c[a>>2]|0)+20>>2]|0)+((c[a+24>>2]|0)-1<<2)>>2]=b;return}function eb(a,b,e,f){a=a|0;b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;switch(b|0){case 13:{dZ(a,f);b=f+20|0;g=c[e+20>>2]|0;do{if((g|0)!=-1){h=c[b>>2]|0;if((h|0)==-1){c[b>>2]=g;break}i=c[(c[a>>2]|0)+12>>2]|0;j=h;while(1){k=i+(j<<2)|0;l=c[k>>2]|0;h=(l>>>14)-131071|0;if((h|0)==-1){break}m=j+1+h|0;if((m|0)==-1){break}else{j=m}}i=g+~j|0;if((((i|0)>-1?i:-i|0)|0)>131071){ff(c[a+12>>2]|0,5464);n=c[k>>2]|0}else{n=l}c[k>>2]=n&16383|(i<<14)+2147467264}}while(0);n=e;k=f;c[n>>2]=c[k>>2];c[n+4>>2]=c[k+4>>2];c[n+8>>2]=c[k+8>>2];c[n+12>>2]=c[k+12>>2];c[n+16>>2]=c[k+16>>2];c[n+20>>2]=c[k+20>>2];return};case 10:{k=d2(a,e)|0;n=d2(a,f)|0;do{if((c[f>>2]|0)==12){l=c[f+8>>2]|0;if((l&256|0)!=0){break}if((d[a+50|0]|0|0)>(l|0)){break}l=a+36|0;c[l>>2]=(c[l>>2]|0)-1}}while(0);l=e|0;g=e+8|0;do{if((c[l>>2]|0)==12){b=c[g>>2]|0;if((b&256|0)!=0){break}if((d[a+50|0]|0|0)>(b|0)){break}b=a+36|0;c[b>>2]=(c[b>>2]|0)-1}}while(0);c[g>>2]=ee(a,25,1,k,n)|0;c[l>>2]=10;return};case 9:{l=d2(a,e)|0;n=d2(a,f)|0;do{if((c[f>>2]|0)==12){k=c[f+8>>2]|0;if((k&256|0)!=0){break}if((d[a+50|0]|0|0)>(k|0)){break}k=a+36|0;c[k>>2]=(c[k>>2]|0)-1}}while(0);k=e|0;g=e+8|0;do{if((c[k>>2]|0)==12){b=c[g>>2]|0;if((b&256|0)!=0){break}if((d[a+50|0]|0|0)>(b|0)){break}b=a+36|0;c[b>>2]=(c[b>>2]|0)-1}}while(0);c[g>>2]=ee(a,24,1,l,n)|0;c[k>>2]=10;return};case 11:{k=d2(a,e)|0;n=d2(a,f)|0;do{if((c[f>>2]|0)==12){l=c[f+8>>2]|0;if((l&256|0)!=0){break}if((d[a+50|0]|0|0)>(l|0)){break}l=a+36|0;c[l>>2]=(c[l>>2]|0)-1}}while(0);l=e|0;g=e+8|0;do{if((c[l>>2]|0)==12){b=c[g>>2]|0;if((b&256|0)!=0){break}if((d[a+50|0]|0|0)>(b|0)){break}b=a+36|0;c[b>>2]=(c[b>>2]|0)-1}}while(0);c[g>>2]=ee(a,24,1,n,k)|0;c[l>>2]=10;return};case 14:{dZ(a,f);l=f+16|0;k=c[e+16>>2]|0;do{if((k|0)!=-1){n=c[l>>2]|0;if((n|0)==-1){c[l>>2]=k;break}g=c[(c[a>>2]|0)+12>>2]|0;b=n;while(1){o=g+(b<<2)|0;p=c[o>>2]|0;n=(p>>>14)-131071|0;if((n|0)==-1){break}i=b+1+n|0;if((i|0)==-1){break}else{b=i}}g=k+~b|0;if((((g|0)>-1?g:-g|0)|0)>131071){ff(c[a+12>>2]|0,5464);q=c[o>>2]|0}else{q=p}c[o>>2]=q&16383|(g<<14)+2147467264}}while(0);q=e;o=f;c[q>>2]=c[o>>2];c[q+4>>2]=c[o+4>>2];c[q+8>>2]=c[o+8>>2];c[q+12>>2]=c[o+12>>2];c[q+16>>2]=c[o+16>>2];c[q+20>>2]=c[o+20>>2];return};case 6:{o=f+16|0;q=f+20|0;p=(c[o>>2]|0)==(c[q>>2]|0);dZ(a,f);k=f|0;L1821:do{if(!p){do{if((c[k>>2]|0)==12){l=c[f+8>>2]|0;if((c[o>>2]|0)==(c[q>>2]|0)){break L1821}if((l|0)<(d[a+50|0]|0|0)){break}d$(a,f,l);break L1821}}while(0);d_(a,f)}}while(0);do{if((c[k>>2]|0)==11){q=f+8|0;o=c[q>>2]|0;p=(c[a>>2]|0)+12|0;b=c[p>>2]|0;l=c[b+(o<<2)>>2]|0;if((l&63|0)!=21){break}g=e|0;j=e+8|0;do{if((c[g>>2]|0)==12){i=c[j>>2]|0;if((i&256|0)!=0){r=o;s=b;t=l;break}if((d[a+50|0]|0|0)>(i|0)){r=o;s=b;t=l;break}i=a+36|0;c[i>>2]=(c[i>>2]|0)-1;i=c[q>>2]|0;n=c[p>>2]|0;r=i;s=n;t=c[n+(i<<2)>>2]|0}else{r=o;s=b;t=l}}while(0);c[s+(r<<2)>>2]=c[j>>2]<<23|t&8388607;c[g>>2]=11;c[j>>2]=c[q>>2];return}}while(0);d_(a,f);d8(a,21,e,f);return};case 0:{d8(a,12,e,f);return};case 1:{d8(a,13,e,f);return};case 2:{d8(a,14,e,f);return};case 3:{d8(a,15,e,f);return};case 4:{d8(a,16,e,f);return};case 5:{d8(a,17,e,f);return};case 8:{t=d2(a,e)|0;r=d2(a,f)|0;do{if((c[f>>2]|0)==12){s=c[f+8>>2]|0;if((s&256|0)!=0){break}if((d[a+50|0]|0|0)>(s|0)){break}s=a+36|0;c[s>>2]=(c[s>>2]|0)-1}}while(0);s=e|0;k=e+8|0;do{if((c[s>>2]|0)==12){l=c[k>>2]|0;if((l&256|0)!=0){break}if((d[a+50|0]|0|0)>(l|0)){break}l=a+36|0;c[l>>2]=(c[l>>2]|0)-1}}while(0);c[k>>2]=ee(a,23,1,t,r)|0;c[s>>2]=10;return};case 7:{s=d2(a,e)|0;r=d2(a,f)|0;do{if((c[f>>2]|0)==12){t=c[f+8>>2]|0;if((t&256|0)!=0){break}if((d[a+50|0]|0|0)>(t|0)){break}t=a+36|0;c[t>>2]=(c[t>>2]|0)-1}}while(0);t=e|0;k=e+8|0;do{if((c[t>>2]|0)==12){l=c[k>>2]|0;if((l&256|0)!=0){break}if((d[a+50|0]|0|0)>(l|0)){break}l=a+36|0;c[l>>2]=(c[l>>2]|0)-1}}while(0);c[k>>2]=ee(a,23,0,s,r)|0;c[t>>2]=10;return};case 12:{t=d2(a,e)|0;r=d2(a,f)|0;do{if((c[f>>2]|0)==12){s=c[f+8>>2]|0;if((s&256|0)!=0){break}if((d[a+50|0]|0|0)>(s|0)){break}s=a+36|0;c[s>>2]=(c[s>>2]|0)-1}}while(0);f=e|0;s=e+8|0;do{if((c[f>>2]|0)==12){e=c[s>>2]|0;if((e&256|0)!=0){break}if((d[a+50|0]|0|0)>(e|0)){break}e=a+36|0;c[e>>2]=(c[e>>2]|0)-1}}while(0);c[s>>2]=ee(a,25,1,r,t)|0;c[f>>2]=10;return};default:{return}}}function ec(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;f=b|0;g=c[f>>2]|0;h=b+32|0;i=c[h>>2]|0;j=b+24|0;k=c[j>>2]|0;if((i|0)==-1){l=k}else{m=b+12|0;n=i;i=g;while(1){o=c[i+12>>2]|0;p=o+(n<<2)|0;q=c[p>>2]|0;r=(q>>>14)-131071|0;if((r|0)==-1){s=-1}else{s=n+1+r|0}if((n|0)>0){r=o+(n-1<<2)|0;o=c[r>>2]|0;if((a[992+(o&63)|0]|0)<0){t=r;u=o}else{v=1509}}else{v=1509}if((v|0)==1509){v=0;t=p;u=q}if((u&63|0)==27){c[t>>2]=u&8372224|u>>>23<<6|26;o=(c[(c[f>>2]|0)+12>>2]|0)+(n<<2)|0;r=k+~n|0;if((((r|0)>-1?r:-r|0)|0)>131071){ff(c[m>>2]|0,5464)}c[o>>2]=c[o>>2]&16383|(r<<14)+2147467264}else{r=k+~n|0;if((((r|0)>-1?r:-r|0)|0)>131071){ff(c[m>>2]|0,5464);w=c[p>>2]|0}else{w=q}c[p>>2]=w&16383|(r<<14)+2147467264}if((s|0)==-1){break}n=s;i=c[f>>2]|0}l=c[j>>2]|0}c[h>>2]=-1;h=g+44|0;if((l+1|0)>(c[h>>2]|0)){f=g+12|0;i=ft(c[b+16>>2]|0,c[f>>2]|0,h,4,2147483645,9304)|0;c[f>>2]=i;x=c[j>>2]|0;y=i}else{x=l;y=c[g+12>>2]|0}c[y+(x<<2)>>2]=d;d=c[j>>2]|0;x=g+48|0;if((d+1|0)>(c[x>>2]|0)){y=g+20|0;l=ft(c[b+16>>2]|0,c[y>>2]|0,x,4,2147483645,9304)|0;c[y>>2]=l;z=c[j>>2]|0;A=l;B=A+(z<<2)|0;c[B>>2]=e;C=c[j>>2]|0;D=C+1|0;c[j>>2]=D;return C|0}else{z=d;A=c[g+20>>2]|0;B=A+(z<<2)|0;c[B>>2]=e;C=c[j>>2]|0;D=C+1|0;c[j>>2]=D;return C|0}return 0}function ed(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=((d-1|0)/50|0)+1|0;d=b<<6|((e|0)==-1?0:e<<23)|34;if((f|0)<512){e=f<<14|d;g=c[(c[a+12>>2]|0)+8>>2]|0;ec(a,e,g)|0;h=b+1|0;i=a+36|0;c[i>>2]=h;return}else{g=a+12|0;e=c[(c[g>>2]|0)+8>>2]|0;ec(a,d,e)|0;e=c[(c[g>>2]|0)+8>>2]|0;ec(a,f,e)|0;h=b+1|0;i=a+36|0;c[i>>2]=h;return}}function ee(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0;g=a+12|0;ec(a,d<<6|b|e<<23|f<<14,c[(c[g>>2]|0)+8>>2]|0)|0;f=a+32|0;e=c[f>>2]|0;c[f>>2]=-1;f=ec(a,2147450902,c[(c[g>>2]|0)+8>>2]|0)|0;if((e|0)==-1){h=f;return h|0}if((f|0)==-1){h=e;return h|0}b=c[(c[a>>2]|0)+12>>2]|0;a=f;while(1){i=b+(a<<2)|0;j=c[i>>2]|0;d=(j>>>14)-131071|0;if((d|0)==-1){break}k=a+1+d|0;if((k|0)==-1){break}else{a=k}}b=e+~a|0;if((((b|0)>-1?b:-b|0)|0)>131071){ff(c[g>>2]|0,5464);l=c[i>>2]|0}else{l=j}c[i>>2]=l&16383|(b<<14)+2147467264;h=f;return h|0}function ef(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;if((d|0)==0){g=1549}else{if((e|0)==0){g=1549}else{h=d;i=e&255}}if((g|0)==1549){h=0;i=0}c[b+68>>2]=h;c[b+60>>2]=f;c[b+64>>2]=f;a[b+56|0]=i;return 1}function eg(a){a=a|0;return c[a+68>>2]|0}function eh(a){a=a|0;return d[a+56|0]|0|0}function ei(a){a=a|0;return c[a+60>>2]|0}function ej(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;f=c[b+20>>2]|0;L1955:do{if((d|0)>0){g=c[b+40>>2]|0;h=d;i=f;while(1){if(i>>>0<=g>>>0){j=0;break}k=h-1|0;if((a[(c[c[i+4>>2]>>2]|0)+6|0]|0)==0){l=k-(c[i+20>>2]|0)|0}else{l=k}k=i-24|0;if((l|0)>0){h=l;i=k}else{m=l;n=k;break L1955}}return j|0}else{m=d;n=f}}while(0);if((m|0)!=0){c[e+96>>2]=0;j=1;return j|0}m=c[b+40>>2]|0;if(n>>>0<=m>>>0){j=0;return j|0}c[e+96>>2]=(n-m|0)/24|0;j=1;return j|0}function ek(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0;f=i;i=i+16|0;g=f|0;dZ(a,b);j=b|0;k=c[j>>2]|0;L1974:do{switch(k|0){case 1:{l=c[a+24>>2]|0;do{if((l|0)>(c[a+28>>2]|0)){if((l|0)==0){if((d[a+50|0]|0|0)>(e|0)){break}else{break L1974}}m=(c[(c[a>>2]|0)+12>>2]|0)+(l-1<<2)|0;n=c[m>>2]|0;if((n&63|0)!=3){break}o=n>>>23;if((n>>>6&255|0)>(e|0)){break}if((o+1|0)<(e|0)){break}if((o|0)>=(e|0)){break L1974}c[m>>2]=n&8388607|e<<23;break L1974}}while(0);ec(a,e<<23|e<<6|3,c[(c[a+12>>2]|0)+8>>2]|0)|0;break};case 5:{h[g>>3]=+h[b+8>>3];c[g+8>>2]=3;ec(a,e<<6|(dV(a,g,g)|0)<<14|1,c[(c[a+12>>2]|0)+8>>2]|0)|0;break};case 4:{ec(a,e<<6|c[b+8>>2]<<14|1,c[(c[a+12>>2]|0)+8>>2]|0)|0;break};case 11:{l=(c[(c[a>>2]|0)+12>>2]|0)+(c[b+8>>2]<<2)|0;c[l>>2]=c[l>>2]&-16321|e<<6&16320;break};case 12:{l=c[b+8>>2]|0;if((l|0)==(e|0)){break L1974}ec(a,l<<23|e<<6,c[(c[a+12>>2]|0)+8>>2]|0)|0;break};case 3:case 2:{ec(a,e<<6|((k|0)==2)<<23|2,c[(c[a+12>>2]|0)+8>>2]|0)|0;break};default:{i=f;return}}}while(0);c[b+8>>2]=e;c[j>>2]=12;i=f;return}function el(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;f=c[b+40>>2]|0;g=c[d+96>>2]|0;d=f+(g*24|0)|0;h=c[f+(g*24|0)+4>>2]|0;do{if((c[h+8>>2]|0)==6){i=h;j=c[i>>2]|0;if((a[j+6|0]|0)!=0){k=1597;break}l=c[j+16>>2]|0;if((l|0)==0){k=1597;break}if((c[b+20>>2]|0)==(d|0)){j=c[b+24>>2]|0;c[f+(g*24|0)+12>>2]=j;m=j;n=c[(c[i>>2]|0)+16>>2]|0}else{m=c[f+(g*24|0)+12>>2]|0;n=l}i=eT(l,e,(m-(c[n+12>>2]|0)>>2)-1|0)|0;if((i|0)==0){k=1597;break}o=i;p=c[d>>2]|0}else{k=1597}}while(0);do{if((k|0)==1597){n=c[d>>2]|0;m=((c[((c[b+20>>2]|0)==(d|0)?b+8|0:f+((g+1|0)*24|0)+4|0)>>2]|0)-n>>4|0)>=(e|0)&(e|0)>0;if(m){o=m?8472:0;p=n;break}else{q=0}return q|0}}while(0);cB(b,p+(e-1<<4)|0);q=o;return q|0}function em(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;f=c[b+40>>2]|0;g=c[d+96>>2]|0;d=f+(g*24|0)|0;h=c[f+(g*24|0)+4>>2]|0;do{if((c[h+8>>2]|0)==6){i=h;j=c[i>>2]|0;if((a[j+6|0]|0)!=0){k=1610;break}l=c[j+16>>2]|0;if((l|0)==0){k=1610;break}if((c[b+20>>2]|0)==(d|0)){j=c[b+24>>2]|0;c[f+(g*24|0)+12>>2]=j;m=j;n=c[(c[i>>2]|0)+16>>2]|0}else{m=c[f+(g*24|0)+12>>2]|0;n=l}i=eT(l,e,(m-(c[n+12>>2]|0)>>2)-1|0)|0;if((i|0)==0){k=1610;break}o=i;p=c[d>>2]|0;q=b+8|0}else{k=1610}}while(0);do{if((k|0)==1610){n=b+8|0;m=c[d>>2]|0;h=((c[((c[b+20>>2]|0)==(d|0)?n:f+((g+1|0)*24|0)+4|0)>>2]|0)-m>>4|0)>=(e|0)&(e|0)>0;if(h){o=h?8472:0;p=m;q=n;break}else{r=0}s=b+8|0;t=c[s>>2]|0;u=t-16|0;c[s>>2]=u;return r|0}}while(0);g=c[q>>2]|0;q=e-1|0;e=g-16|0;f=p+(q<<4)|0;d=c[e+4>>2]|0;c[f>>2]=c[e>>2];c[f+4>>2]=d;c[p+(q<<4)+8>>2]=c[g-16+8>>2];r=o;s=b+8|0;t=c[s>>2]|0;u=t-16|0;c[s>>2]=u;return r|0}function en(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0;do{if((a[e]|0)==62){g=b+8|0;h=(c[g>>2]|0)-16|0;i=c[h>>2]|0;c[g>>2]=h;j=e+1|0;k=i;l=0;m=1619}else{i=c[f+96>>2]|0;if((i|0)==0){n=e;m=1622;break}h=c[b+40>>2]|0;j=e;k=c[c[h+(i*24|0)+4>>2]>>2]|0;l=h+(i*24|0)|0;m=1619}}while(0);L2030:do{if((m|0)==1619){e=k;if((k|0)==0){n=j;m=1622;break}i=a[j]|0;if(i<<24>>24==0){o=1;p=e;q=j;r=0;break}h=k+6|0;g=k+16|0;s=f+16|0;t=f+28|0;u=f+32|0;v=f+12|0;w=f+36|0;x=(l|0)==0;y=f+20|0;z=l+4|0;A=b+20|0;B=b+24|0;C=l+12|0;D=e+7|0;E=f+24|0;F=f+8|0;G=f+4|0;H=l+20|0;I=l-24|0;J=l-24+4|0;K=l-24+12|0;L=j;M=1;N=i;while(1){L2036:do{switch(N<<24>>24|0){case 110:{L2038:do{if(x){m=1649}else{i=c[z>>2]|0;do{if((c[i+8>>2]|0)==6){if((a[(c[i>>2]|0)+6|0]|0)!=0){break}if((c[H>>2]|0)>0){m=1649;break L2038}}}while(0);i=c[J>>2]|0;if((c[i+8>>2]|0)!=6){m=1649;break}O=i;i=c[O>>2]|0;if((a[i+6|0]|0)!=0){m=1649;break}if((c[A>>2]|0)==(I|0)){P=c[B>>2]|0;c[K>>2]=P;Q=c[O>>2]|0;R=P}else{Q=i;R=c[K>>2]|0}i=c[(c[Q+16>>2]|0)+12>>2]|0;P=c[i+((R-i>>2)-1<<2)>>2]|0;i=P&63;if(!((i|0)==28|(i|0)==29|(i|0)==33)){m=1649;break}i=er(b,I,P>>>6&255,G)|0;c[F>>2]=i;if((i|0)!=0){S=M;break L2036}}}while(0);if((m|0)==1649){m=0;c[F>>2]=0}c[F>>2]=10576;c[G>>2]=0;S=M;break};case 117:{c[E>>2]=d[D]|0;S=M;break};case 108:{do{if(x){T=-1}else{i=c[z>>2]|0;if((c[i+8>>2]|0)!=6){T=-1;break}P=i;i=c[P>>2]|0;if((a[i+6|0]|0)!=0){T=-1;break}if((c[A>>2]|0)==(l|0)){O=c[B>>2]|0;c[C>>2]=O;U=c[P>>2]|0;V=O}else{U=i;V=c[C>>2]|0}i=c[U+16>>2]|0;O=(V-(c[i+12>>2]|0)>>2)-1|0;if((O|0)<0){T=-1;break}P=c[i+20>>2]|0;if((P|0)==0){T=0;break}T=c[P+(O<<2)>>2]|0}}while(0);c[y>>2]=T;S=M;break};case 83:{if((a[h]|0)==0){O=(c[(c[g>>2]|0)+32>>2]|0)+16|0;c[s>>2]=O;P=c[(c[g>>2]|0)+60>>2]|0;c[t>>2]=P;c[u>>2]=c[(c[g>>2]|0)+64>>2];W=O;X=(P|0)==0?9144:9024}else{c[s>>2]=9536;c[t>>2]=-1;c[u>>2]=-1;W=9536;X=9288}c[v>>2]=X;fz(w,W,60);S=M;break};case 76:case 102:{S=M;break};default:{S=0}}}while(0);P=L+1|0;O=a[P]|0;if(O<<24>>24==0){o=S;p=e;q=j;r=0;break L2030}else{L=P;M=S;N=O}}}}while(0);if((m|0)==1622){c[f+8>>2]=10576;c[f+4>>2]=10576;c[f+12>>2]=8864;c[f+20>>2]=-1;c[f+28>>2]=-1;c[f+32>>2]=-1;c[f+16>>2]=8648;fz(f+36|0,8648,60);c[f+24>>2]=0;o=1;p=0;q=n;r=1}if((aU(q|0,102)|0)!=0){n=b+8|0;f=c[n>>2]|0;if(r){c[f+8>>2]=0}else{c[f>>2]=p;c[f+8>>2]=6}f=c[n>>2]|0;if(((c[b+28>>2]|0)-f|0)<17){eA(b,1);Y=c[n>>2]|0}else{Y=f}c[n>>2]=Y+16}if((aU(q|0,76)|0)==0){return o|0}do{if(r){m=1664}else{if((a[p+6|0]|0)!=0){m=1664;break}q=f5(b,0,0)|0;Y=p+16|0;n=c[Y>>2]|0;f=c[n+20>>2]|0;if((c[n+48>>2]|0)>0){n=0;do{S=gc(b,q,c[f+(n<<2)>>2]|0)|0;c[S>>2]=1;c[S+8>>2]=1;n=n+1|0;}while((n|0)<(c[(c[Y>>2]|0)+48>>2]|0))}Y=c[b+8>>2]|0;c[Y>>2]=q;c[Y+8>>2]=5}}while(0);if((m|0)==1664){c[(c[b+8>>2]|0)+8>>2]=0}m=b+8|0;p=c[m>>2]|0;if(((c[b+28>>2]|0)-p|0)<17){eA(b,1);Z=c[m>>2]|0}else{Z=p}c[m>>2]=Z+16;return o|0}function eo(a){a=a|0;return(ep(a,c[a+44>>2]|0,255)|0)!=0|0}function ep(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;g=c[b+44>>2]|0;h=a[b+75|0]|0;if((h&255)>=251){i=0;return i|0}j=h&255;k=a[b+74|0]|0;l=k&255;if(((l&1)+(d[b+73|0]|0)|0)>(j|0)|(l&5|0)==4){i=0;return i|0}l=d[b+72|0]|0;if((c[b+36>>2]|0)>(l|0)){i=0;return i|0}m=c[b+48>>2]|0;if(!(((m|0)==(g|0)|(m|0)==0)&(g|0)>0)){i=0;return i|0}m=g-1|0;n=c[b+12>>2]|0;o=c[n+(m<<2)>>2]|0;if((o&63|0)!=30){i=0;return i|0}if((e|0)<=0){i=o;return i|0}o=b+8|0;p=(f|0)==255;q=b+52|0;r=b+16|0;s=b+40|0;b=m;m=0;L2124:while(1){t=c[n+(m<<2)>>2]|0;u=t&63;v=t>>>6&255;if(u>>>0>=38){i=0;w=1754;break}x=h&255;if(v>>>0>=x>>>0){i=0;w=1755;break}y=a[992+u|0]|0;z=y&255;A=z&3;do{if((A|0)==0){B=t>>>23;C=t>>>14;D=C&511;E=z>>>4&3;do{if((E|0)==0){if((B|0)!=0){i=0;w=1763;break L2124}}else if((E|0)==2){if(x>>>0<=B>>>0){i=0;w=1764;break L2124}}else if((E|0)==3){if((B&256|0)==0){if(x>>>0>B>>>0){break}else{i=0;w=1766;break L2124}}else{if((B&255|0)<(c[s>>2]|0)){break}else{i=0;w=1765;break L2124}}}}while(0);E=z>>>2&3;if((E|0)==0){if((D|0)==0){F=B;G=0;break}else{i=0;w=1767;break L2124}}else if((E|0)==2){if(j>>>0>D>>>0){F=B;G=D;break}else{i=0;w=1768;break L2124}}else if((E|0)==3){if((C&256|0)==0){if(j>>>0>D>>>0){F=B;G=D;break}else{i=0;w=1770;break L2124}}else{if((C&255|0)<(c[s>>2]|0)){F=B;G=D;break}else{i=0;w=1769;break L2124}}}else{F=B;G=D;break}}else if((A|0)==1){E=t>>>14;if((z&48|0)!=48){F=E;G=0;break}if((E|0)<(c[s>>2]|0)){F=E;G=0}else{i=0;w=1771;break L2124}}else if((A|0)==2){E=(t>>>14)-131071|0;if((z&48|0)!=32){F=E;G=0;break}H=m+1+E|0;if(!((H|0)>-1&(H|0)<(g|0))){i=0;w=1772;break L2124}if((H|0)<=0){F=E;G=0;break}I=E+m|0;J=0;while(1){if((J|0)>=(H|0)){break}if((c[n+(I-J<<2)>>2]&8372287|0)==34){J=J+1|0}else{break}}if((J&1|0)==0){F=E;G=0}else{i=0;w=1773;break L2124}}else{F=0;G=0}}while(0);z=(y&64)!=0&(v|0)==(f|0)?m:b;if(y<<24>>24<0){if((m+2|0)>=(g|0)){i=0;w=1774;break}if((c[n+(m+1<<2)>>2]&63|0)!=22){i=0;w=1775;break}}L2160:do{switch(u|0){case 2:{if((G|0)!=1){K=m;L=z;break L2160}if((m+2|0)>=(g|0)){i=0;w=1776;break L2124}if((c[n+(m+1<<2)>>2]&8372287|0)==34){i=0;w=1777;break L2124}else{K=m;L=z}break};case 3:{K=m;L=(v|0)>(f|0)|(F|0)<(f|0)?z:m;break};case 4:case 8:{if((F|0)<(l|0)){K=m;L=z}else{i=0;w=1778;break L2124}break};case 5:case 7:{if((c[(c[o>>2]|0)+(F<<4)+8>>2]|0)==4){K=m;L=z}else{i=0;w=1779;break L2124}break};case 11:{t=v+1|0;if(t>>>0>=(h&255)>>>0){i=0;w=1780;break L2124}K=m;L=(t|0)==(f|0)?m:z;break};case 21:{if((F|0)<(G|0)){K=m;L=z}else{i=0;w=1781;break L2124}break};case 33:{if((G|0)==0){i=0;w=1782;break L2124}t=v+2|0;if((G+t|0)>=(h&255|0)){i=0;w=1783;break L2124}K=m;L=(t|0)>(f|0)?z:m;break};case 31:case 32:{if((v+3|0)>>>0<(h&255)>>>0){w=1723}else{i=0;w=1784;break L2124}break};case 22:{w=1723;break};case 28:case 29:{if((F|0)!=0){if((v-1+F|0)>=(h&255|0)){i=0;w=1785;break L2124}}t=G-1|0;do{if((G|0)==0){A=c[n+(m+1<<2)>>2]|0;x=A&63;if(!((x|0)==28|(x|0)==29|(x|0)==30|(x|0)==34)){i=0;w=1786;break L2124}if(A>>>0>=8388608){i=0;w=1787;break L2124}}else{if((t|0)==0){break}if((v-1+t|0)>=(h&255|0)){i=0;w=1788;break L2124}}}while(0);K=m;L=(v|0)>(f|0)?z:m;break};case 30:{t=F-1|0;if((t|0)<=0){K=m;L=z;break L2160}if((v-1+t|0)<(h&255|0)){K=m;L=z}else{i=0;w=1789;break L2124}break};case 34:{if((F|0)>0){if((F+v|0)>=(h&255|0)){i=0;w=1790;break L2124}}if((G|0)!=0){K=m;L=z;break L2160}t=m+1|0;if((t|0)<(g-1|0)){K=t;L=z}else{i=0;w=1791;break L2124}break};case 36:{if((F|0)>=(c[q>>2]|0)){i=0;w=1792;break L2124}t=a[(c[(c[r>>2]|0)+(F<<2)>>2]|0)+72|0]|0;E=t&255;J=E+m|0;if((J|0)>=(g|0)){i=0;w=1793;break L2124}if(t<<24>>24!=0){t=1;do{A=c[n+(t+m<<2)>>2]&63;if(!((A|0)==4|(A|0)==0)){i=0;w=1794;break L2124}t=t+1|0;}while((t|0)<=(E|0))}K=p?m:J;L=z;break};case 37:{if((k&6)!=2){i=0;w=1795;break L2124}if((F|0)==0){E=c[n+(m+1<<2)>>2]|0;t=E&63;if(!((t|0)==28|(t|0)==29|(t|0)==30|(t|0)==34)){i=0;w=1796;break L2124}if(E>>>0>=8388608){i=0;w=1760;break L2124}}if((v-2+F|0)<(h&255|0)){K=m;L=z}else{i=0;w=1761;break L2124}break};default:{K=m;L=z}}}while(0);if((w|0)==1723){w=0;v=m+1+F|0;K=((m|0)>=(v|0)|p|(v|0)>(e|0)?0:F)+m|0;L=z}v=K+1|0;if((v|0)<(e|0)){b=L;m=v}else{w=1750;break}}if((w|0)==1750){i=c[n+(L<<2)>>2]|0;return i|0}else if((w|0)==1754){return i|0}else if((w|0)==1755){return i|0}else if((w|0)==1760){return i|0}else if((w|0)==1761){return i|0}else if((w|0)==1763){return i|0}else if((w|0)==1764){return i|0}else if((w|0)==1765){return i|0}else if((w|0)==1766){return i|0}else if((w|0)==1767){return i|0}else if((w|0)==1768){return i|0}else if((w|0)==1769){return i|0}else if((w|0)==1770){return i|0}else if((w|0)==1771){return i|0}else if((w|0)==1772){return i|0}else if((w|0)==1773){return i|0}else if((w|0)==1774){return i|0}else if((w|0)==1775){return i|0}else if((w|0)==1776){return i|0}else if((w|0)==1777){return i|0}else if((w|0)==1778){return i|0}else if((w|0)==1779){return i|0}else if((w|0)==1780){return i|0}else if((w|0)==1781){return i|0}else if((w|0)==1782){return i|0}else if((w|0)==1783){return i|0}else if((w|0)==1784){return i|0}else if((w|0)==1785){return i|0}else if((w|0)==1786){return i|0}else if((w|0)==1787){return i|0}else if((w|0)==1788){return i|0}else if((w|0)==1789){return i|0}else if((w|0)==1790){return i|0}else if((w|0)==1791){return i|0}else if((w|0)==1792){return i|0}else if((w|0)==1793){return i|0}else if((w|0)==1794){return i|0}else if((w|0)==1795){return i|0}else if((w|0)==1796){return i|0}return 0}function eq(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;i=i+8|0;f=e|0;c[f>>2]=0;g=c[872+(c[b+8>>2]<<2)>>2]|0;h=c[a+20>>2]|0;j=c[h+8>>2]|0;k=c[h>>2]|0;while(1){if(k>>>0>=j>>>0){break}if((k|0)==(b|0)){l=1800;break}else{k=k+16|0}}do{if((l|0)==1800){k=er(a,h,b-(c[a+12>>2]|0)>>4,f)|0;if((k|0)==0){break}j=c[f>>2]|0;es(a,2592,(m=i,i=i+32|0,c[m>>2]=d,c[m+8>>2]=k,c[m+16>>2]=j,c[m+24>>2]=g,m)|0);i=m;i=e;return}}while(0);es(a,8664,(m=i,i=i+16|0,c[m>>2]=d,c[m+8>>2]=g,m)|0);i=m;i=e;return}function er(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=d+4|0;h=b+20|0;i=b+24|0;b=d+12|0;j=e;L2260:while(1){e=c[g>>2]|0;if((c[e+8>>2]|0)!=6){k=0;l=1828;break}m=e;e=c[m>>2]|0;if((a[e+6|0]|0)!=0){k=0;l=1831;break}n=c[e+16>>2]|0;e=n;if((c[h>>2]|0)==(d|0)){o=c[i>>2]|0;c[b>>2]=o;p=o;q=c[(c[m>>2]|0)+16>>2]|0}else{p=c[b>>2]|0;q=n}m=(p-(c[q+12>>2]|0)>>2)-1|0;o=eT(e,j+1|0,m)|0;c[f>>2]=o;if((o|0)!=0){k=2944;l=1829;break}r=ep(e,m,j)|0;switch(r&63|0){case 4:{l=1820;break L2260;break};case 0:{break};case 5:{l=1814;break L2260;break};case 11:{l=1823;break L2260;break};case 6:{l=1816;break L2260;break};default:{k=0;l=1830;break L2260}}m=r>>>23;if(m>>>0<(r>>>6&255)>>>0){j=m}else{k=0;l=1832;break}}if((l|0)==1828){return k|0}else if((l|0)==1820){j=c[n+28>>2]|0;if((j|0)==0){s=10424}else{s=(c[j+(r>>>23<<2)>>2]|0)+16|0}c[f>>2]=s;k=10256;return k|0}else if((l|0)==1831){return k|0}else if((l|0)==1814){c[f>>2]=(c[(c[n+8>>2]|0)+(r>>>14<<4)>>2]|0)+16;k=2584;return k|0}else if((l|0)==1823){s=r>>>14;do{if((s&256|0)==0){t=10424}else{j=s&255;q=c[n+8>>2]|0;if((c[q+(j<<4)+8>>2]|0)!=4){t=10424;break}t=(c[q+(j<<4)>>2]|0)+16|0}}while(0);c[f>>2]=t;k=10008;return k|0}else if((l|0)==1830){return k|0}else if((l|0)==1832){return k|0}else if((l|0)==1829){return k|0}else if((l|0)==1816){l=r>>>14;do{if((l&256|0)==0){u=10424}else{r=l&255;t=c[n+8>>2]|0;if((c[t+(r<<4)+8>>2]|0)!=4){u=10424;break}u=(c[t+(r<<4)>>2]|0)+16|0}}while(0);c[f>>2]=u;k=2280;return k|0}return 0}function es(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+80|0;g=f+64|0;h=g;c[h>>2]=e;c[h+4>>2]=0;h=fx(b,d,g|0)|0;g=f|0;d=c[b+20>>2]|0;e=c[d+4>>2]|0;if((c[e+8>>2]|0)!=6){ew(b);i=f;return}j=e;if((a[(c[j>>2]|0)+6|0]|0)!=0){ew(b);i=f;return}e=c[b+24>>2]|0;c[d+12>>2]=e;d=c[(c[j>>2]|0)+16>>2]|0;j=(e-(c[d+12>>2]|0)>>2)-1|0;do{if((j|0)<0){k=-1}else{e=c[d+20>>2]|0;if((e|0)==0){k=0;break}k=c[e+(j<<2)>>2]|0}}while(0);fz(g,(c[d+32>>2]|0)+16|0,60);fy(b,3576,(d=i,i=i+24|0,c[d>>2]=g,c[d+8>>2]=k,c[d+16>>2]=h,d)|0)|0;i=d;ew(b);i=f;return}function et(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;e=i;i=i+8|0;f=e|0;g=((c[b+8>>2]|0)-3|0)>>>0<2?d:b;c[f>>2]=0;b=c[872+(c[g+8>>2]<<2)>>2]|0;d=c[a+20>>2]|0;h=c[d+8>>2]|0;j=c[d>>2]|0;while(1){if(j>>>0>=h>>>0){break}if((j|0)==(g|0)){k=1850;break}else{j=j+16|0}}do{if((k|0)==1850){j=er(a,d,g-(c[a+12>>2]|0)>>4,f)|0;if((j|0)==0){break}h=c[f>>2]|0;es(a,2592,(l=i,i=i+32|0,c[l>>2]=8264,c[l+8>>2]=j,c[l+16>>2]=h,c[l+24>>2]=b,l)|0);i=l;i=e;return}}while(0);es(a,8664,(l=i,i=i+16|0,c[l>>2]=8264,c[l+8>>2]=b,l)|0);i=l;i=e;return}function eu(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;e=i;i=i+24|0;f=e|0;g=(gk(b,e+8|0)|0)==0?b:d;c[f>>2]=0;d=c[872+(c[g+8>>2]<<2)>>2]|0;b=c[a+20>>2]|0;h=c[b+8>>2]|0;j=c[b>>2]|0;while(1){if(j>>>0>=h>>>0){break}if((j|0)==(g|0)){k=1859;break}else{j=j+16|0}}do{if((k|0)==1859){j=er(a,b,g-(c[a+12>>2]|0)>>4,f)|0;if((j|0)==0){break}h=c[f>>2]|0;es(a,2592,(l=i,i=i+32|0,c[l>>2]=6392,c[l+8>>2]=j,c[l+16>>2]=h,c[l+24>>2]=d,l)|0);i=l;i=e;return}}while(0);es(a,8664,(l=i,i=i+16|0,c[l>>2]=6392,c[l+8>>2]=d,l)|0);i=l;i=e;return}function ev(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=i;g=c[872+(c[d+8>>2]<<2)>>2]|0;d=c[872+(c[e+8>>2]<<2)>>2]|0;if((a[g+2|0]|0)==(a[d+2|0]|0)){es(b,4944,(h=i,i=i+8|0,c[h>>2]=g,h)|0);i=h;i=f;return 0}else{es(b,4104,(h=i,i=i+16|0,c[h>>2]=g,c[h+8>>2]=d,h)|0);i=h;i=f;return 0}return 0}function ew(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;b=c[a+116>>2]|0;if((b|0)==0){eC(a,2);return}d=c[a+32>>2]|0;e=d+(b+8)|0;if((c[e>>2]|0)!=6){eC(a,5)}f=a+8|0;g=c[f>>2]|0;h=g-16|0;i=g;j=c[h+4>>2]|0;c[i>>2]=c[h>>2];c[i+4>>2]=j;c[g+8>>2]=c[g-16+8>>2];g=c[f>>2]|0;j=d+b|0;b=g-16|0;d=c[j+4>>2]|0;c[b>>2]=c[j>>2];c[b+4>>2]=d;c[g-16+8>>2]=c[e>>2];e=c[f>>2]|0;if(((c[a+28>>2]|0)-e|0)<17){eA(a,1);k=c[f>>2]|0}else{k=e}c[f>>2]=k+16;eG(a,k-16|0,1);eC(a,2);return}function ex(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;e=i;i=i+48|0;f=1;g=0;h=i;i=i+168|0;c[h>>2]=0;while(1)switch(f|0){case 1:j=e|0;k=j+44|0;c[k>>2]=0;l=a+112|0;m=j|0;c[m>>2]=c[l>>2];c[l>>2]=j;n=j0(j+4|0,f,h)|0;f=4;break;case 4:if((n|0)==0){f=2;break}else{f=3;break};case 2:aj(b|0,a|0,d|0);if((r|0)!=0&(s|0)!=0){g=j1(c[r>>2]|0,h)|0;if((g|0)>0){f=-1;break}else return 0}r=s=0;f=3;break;case 3:c[l>>2]=c[m>>2];i=e;return c[k>>2]|0;case-1:if((g|0)==1){n=s;f=4}r=s=0;break}return 0}function ey(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;d=a+32|0;e=c[d>>2]|0;f=b+6|0;if((b+7|0)>>>0<268435456){g=a+44|0;h=fu(a,e,c[g>>2]<<4,f<<4)|0;i=g}else{h=fv(a)|0;i=a+44|0}g=h;c[d>>2]=g;c[i>>2]=f;c[a+28>>2]=g+(b<<4);b=a+8|0;f=e;c[b>>2]=g+((c[b>>2]|0)-f>>4<<4);b=c[a+104>>2]|0;do{if((b|0)!=0){e=b+8|0;c[e>>2]=g+((c[e>>2]|0)-f>>4<<4);e=c[b>>2]|0;if((e|0)==0){break}else{j=e}do{e=j+8|0;c[e>>2]=(c[d>>2]|0)+((c[e>>2]|0)-f>>4<<4);j=c[j>>2]|0;}while((j|0)!=0)}}while(0);j=c[a+40>>2]|0;b=a+20|0;if(j>>>0>(c[b>>2]|0)>>>0){k=a+12|0;l=c[k>>2]|0;m=l;n=m-f|0;o=n>>4;p=c[d>>2]|0;q=p+(o<<4)|0;c[k>>2]=q;return}else{r=j}do{j=r+8|0;c[j>>2]=(c[d>>2]|0)+((c[j>>2]|0)-f>>4<<4);j=r|0;c[j>>2]=(c[d>>2]|0)+((c[j>>2]|0)-f>>4<<4);j=r+4|0;c[j>>2]=(c[d>>2]|0)+((c[j>>2]|0)-f>>4<<4);r=r+24|0;}while(r>>>0<=(c[b>>2]|0)>>>0);k=a+12|0;l=c[k>>2]|0;m=l;n=m-f|0;o=n>>4;p=c[d>>2]|0;q=p+(o<<4)|0;c[k>>2]=q;return}function ez(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=a+40|0;e=c[d>>2]|0;if((b+1|0)>>>0<178956971){f=a+48|0;g=fu(a,e,(c[f>>2]|0)*24|0,b*24|0)|0;h=f}else{g=fv(a)|0;h=a+48|0}f=g;c[d>>2]=f;c[h>>2]=b;h=a+20|0;c[h>>2]=f+((((c[h>>2]|0)-e|0)/24|0)*24|0);c[a+36>>2]=f+((b-1|0)*24|0);return}function eA(a,b){a=a|0;b=b|0;var d=0;d=c[a+44>>2]|0;if((d|0)<(b|0)){ey(a,d+b|0);return}else{ey(a,d<<1);return}}function eB(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;f=i;i=i+104|0;g=f|0;h=c[b+68>>2]|0;if((h|0)==0){i=f;return}j=b+57|0;if((a[j]|0)==0){i=f;return}k=b+8|0;l=b+32|0;m=c[k>>2]|0;n=c[l>>2]|0;o=m-n|0;p=b+20|0;q=c[p>>2]|0;r=(c[q+8>>2]|0)-n|0;c[g>>2]=d;c[g+20>>2]=e;if((d|0)==4){c[g+96>>2]=0}else{c[g+96>>2]=(q-(c[b+40>>2]|0)|0)/24|0}do{if(((c[b+28>>2]|0)-m|0)<321){q=c[b+44>>2]|0;if((q|0)<20){ey(b,q+20|0);break}else{ey(b,q<<1);break}}}while(0);c[(c[p>>2]|0)+8>>2]=(c[k>>2]|0)+320;a[j]=0;cf[h&511](b,g);a[j]=1;c[(c[p>>2]|0)+8>>2]=(c[l>>2]|0)+r;c[k>>2]=(c[l>>2]|0)+o;i=f;return}function eC(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;f=d+112|0;g=c[f>>2]|0;if((g|0)!=0){c[g+44>>2]=e;b0((c[f>>2]|0)+4|0,1)}a[d+6|0]=e&255;g=d+16|0;if((c[(c[g>>2]|0)+88>>2]|0)==0){a_(1)}h=d+40|0;i=c[h>>2]|0;j=d+20|0;c[j>>2]=i;k=c[i>>2]|0;i=d+12|0;c[i>>2]=k;eU(d,k);k=c[i>>2]|0;if((e|0)==4){c[k>>2]=f_(d,8280,17)|0;c[k+8>>2]=4}else if((e|0)==3|(e|0)==2){i=c[d+8>>2]|0;l=i-16|0;m=k;n=c[l+4>>2]|0;c[m>>2]=c[l>>2];c[m+4>>2]=n;c[k+8>>2]=c[i-16+8>>2]}else if((e|0)==5){c[k>>2]=f_(d,9920,23)|0;c[k+8>>2]=4}c[d+8>>2]=k+16;b[d+52>>1]=b[d+54>>1]|0;a[d+57|0]=1;k=d+48|0;e=c[k>>2]|0;do{if((e|0)>2e4){i=c[h>>2]|0;n=i;if(((((c[j>>2]|0)-n|0)/24|0)+1|0)>=2e4){break}m=fu(d,i,e*24|0,48e4)|0;i=m;c[h>>2]=i;c[k>>2]=2e4;c[j>>2]=i+((((c[j>>2]|0)-n|0)/24|0)*24|0);c[d+36>>2]=m+479976}}while(0);c[d+116>>2]=0;c[f>>2]=0;cd[c[(c[g>>2]|0)+88>>2]&1023](d)|0;a_(1)}function eD(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;e=b+56|0;if((a[e]&2)==0){f=d;g=b+20|0}else{h=b+32|0;i=d-(c[h>>2]|0)|0;eB(b,1,-1);d=b+20|0;j=c[d>>2]|0;L2409:do{if((a[(c[c[j+4>>2]>>2]|0)+6|0]|0)==0){if((a[e]&2)==0){break}k=j+20|0;l=c[k>>2]|0;c[k>>2]=l-1;if((l|0)==0){break}do{eB(b,4,-1);if((a[e]&2)==0){break L2409}l=(c[d>>2]|0)+20|0;k=c[l>>2]|0;c[l>>2]=k-1;}while((k|0)!=0)}}while(0);f=(c[h>>2]|0)+i|0;g=d}d=c[g>>2]|0;i=d-24|0;c[g>>2]=i;g=c[d+4>>2]|0;h=c[d+16>>2]|0;c[b+12>>2]=c[i>>2];c[b+24>>2]=c[d-24+12>>2];d=b+8|0;if((h|0)==0){m=g;c[d>>2]=m;n=h+1|0;return n|0}else{o=h;p=g;q=f}while(1){if(q>>>0>=(c[d>>2]|0)>>>0){break}f=p+16|0;g=q;b=p;i=c[g+4>>2]|0;c[b>>2]=c[g>>2];c[b+4>>2]=i;c[p+8>>2]=c[q+8>>2];i=o-1|0;if((i|0)==0){m=f;r=1946;break}else{o=i;p=f;q=q+16|0}}if((r|0)==1946){c[d>>2]=m;n=h+1|0;return n|0}if((o|0)>0){s=o;t=p}else{m=p;c[d>>2]=m;n=h+1|0;return n|0}while(1){r=s-1|0;c[t+8>>2]=0;if((r|0)>0){s=r;t=t+16|0}else{break}}m=p+(o<<4)|0;c[d>>2]=m;n=h+1|0;return n|0}function eE(e,f){e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;g=e+6|0;h=a[g]|0;if((h<<24>>24|0)==0){i=c[e+20>>2]|0;if((i|0)!=(c[e+40>>2]|0)){j=i;k=1951}}else if((h<<24>>24|0)!=1){j=c[e+20>>2]|0;k=1951}if((k|0)==1951){k=c[j>>2]|0;j=e+8|0;c[j>>2]=k;c[k>>2]=f_(e,6152,37)|0;c[k+8>>2]=4;do{if(((c[e+28>>2]|0)-(c[j>>2]|0)|0)<17){k=c[e+44>>2]|0;if((k|0)<1){ey(e,k+1|0);break}else{ey(e,k<<1);break}}}while(0);c[j>>2]=(c[j>>2]|0)+16;l=2;return l|0}j=e+52|0;k=b[j>>1]|0;if((k&65535)>199){h=c[c[e+20>>2]>>2]|0;i=e+8|0;c[i>>2]=h;c[h>>2]=f_(e,7968,16)|0;c[h+8>>2]=4;do{if(((c[e+28>>2]|0)-(c[i>>2]|0)|0)<17){h=c[e+44>>2]|0;if((h|0)<1){ey(e,h+1|0);break}else{ey(e,h<<1);break}}}while(0);c[i>>2]=(c[i>>2]|0)+16;l=2;return l|0}i=k+1&65535;b[j>>1]=i;b[e+54>>1]=i;i=e+8|0;k=ex(e,260,(c[i>>2]|0)+(-f<<4)|0)|0;if((k|0)==0){m=d[g]|0}else{a[g]=k&255;g=c[i>>2]|0;if((k|0)==4){c[g>>2]=f_(e,8280,17)|0;c[g+8>>2]=4}else if((k|0)==5){c[g>>2]=f_(e,9920,23)|0;c[g+8>>2]=4}else if((k|0)==3|(k|0)==2){f=g-16|0;h=g;n=c[f+4>>2]|0;c[h>>2]=c[f>>2];c[h+4>>2]=n;c[g+8>>2]=c[g-16+8>>2]}n=g+16|0;c[i>>2]=n;c[(c[e+20>>2]|0)+8>>2]=n;m=k}b[j>>1]=(b[j>>1]|0)-1&65535;l=m;return l|0}function eF(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0;g=i;if((c[e+8>>2]|0)==6){j=e;k=b+32|0}else{l=gg(b,e,16)|0;m=b+32|0;n=e-(c[m>>2]|0)|0;o=l+8|0;if((c[o>>2]|0)!=6){eq(b,e,2472)}p=b+8|0;q=c[p>>2]|0;if(q>>>0>e>>>0){r=q;while(1){s=r-16|0;t=s;u=r;v=c[t+4>>2]|0;c[u>>2]=c[t>>2];c[u+4>>2]=v;c[r+8>>2]=c[r-16+8>>2];if(s>>>0>e>>>0){r=s}else{break}}w=c[p>>2]|0}else{w=q}do{if(((c[b+28>>2]|0)-w|0)<17){q=c[b+44>>2]|0;if((q|0)<1){ey(b,q+1|0);break}else{ey(b,q<<1);break}}}while(0);c[p>>2]=(c[p>>2]|0)+16;p=c[m>>2]|0;w=p+n|0;q=l;l=w;r=c[q+4>>2]|0;c[l>>2]=c[q>>2];c[l+4>>2]=r;c[p+(n+8)>>2]=c[o>>2];j=w;k=m}m=j-(c[k>>2]|0)|0;w=c[j>>2]|0;j=b+24|0;o=b+20|0;c[(c[o>>2]|0)+12>>2]=c[j>>2];if((a[w+6|0]|0)!=0){n=b+8|0;do{if(((c[b+28>>2]|0)-(c[n>>2]|0)|0)<321){p=c[b+44>>2]|0;if((p|0)<20){ey(b,p+20|0);break}else{ey(b,p<<1);break}}}while(0);p=c[o>>2]|0;r=b+36|0;do{if((p|0)==(c[r>>2]|0)){l=b+48|0;q=c[l>>2]|0;if((q|0)>2e4){eC(b,5);return 0}e=q<<1;s=b+40|0;v=c[s>>2]|0;if((e|1)>>>0<178956971){x=fu(b,v,q*24|0,q*48|0)|0}else{x=fv(b)|0}q=x;c[s>>2]=q;c[l>>2]=e;l=q+((((c[o>>2]|0)-v|0)/24|0)*24|0)|0;c[o>>2]=l;c[r>>2]=q+((e-1|0)*24|0);if((e|0)<=2e4){y=l;break}es(b,3400,(z=i,i=i+1|0,i=i+7>>3<<3,c[z>>2]=0,z)|0);i=z;y=c[o>>2]|0}else{y=p}}while(0);p=y+24|0;c[o>>2]=p;r=c[k>>2]|0;c[y+28>>2]=r+m;x=r+(m+16)|0;c[p>>2]=x;c[b+12>>2]=x;c[y+32>>2]=(c[n>>2]|0)+320;c[y+40>>2]=f;if((a[b+56|0]&1)!=0){eB(b,0,-1)}y=cd[c[(c[c[(c[o>>2]|0)+4>>2]>>2]|0)+16>>2]&1023](b)|0;if((y|0)<0){A=2;i=g;return A|0}x=(c[n>>2]|0)+(-y<<4)|0;eD(b,x)|0;A=1;i=g;return A|0}x=c[w+16>>2]|0;w=x;y=b+28|0;n=b+8|0;p=w+75|0;r=d[p]|0;do{if(((c[y>>2]|0)-(c[n>>2]|0)|0)<=(r<<4|0)){l=c[b+44>>2]|0;if((l|0)<(r|0)){ey(b,l+r|0);break}else{ey(b,l<<1);break}}}while(0);r=c[k>>2]|0;l=r+m|0;e=l;q=w+74|0;v=a[q]|0;do{if(v<<24>>24==0){s=r+(m+16)|0;u=s+(d[w+73|0]<<4)|0;if((c[n>>2]|0)>>>0<=u>>>0){B=e;C=s;break}c[n>>2]=u;B=e;C=s}else{s=c[n>>2]|0;u=(s-l>>4)-1|0;t=a[w+73|0]|0;D=t&255;if((D|0)>(u|0)){E=u;F=s;while(1){c[n>>2]=F+16;c[F+8>>2]=0;s=E+1|0;if((s|0)>=(D|0)){break}E=s;F=c[n>>2]|0}G=D;H=a[q]|0}else{G=u;H=v}if((H&4)==0){I=0}else{F=G-D|0;E=c[b+16>>2]|0;if((c[E+68>>2]|0)>>>0>=(c[E+64>>2]|0)>>>0){e1(b)}E=d[p]|0;do{if(((c[y>>2]|0)-(c[n>>2]|0)|0)<=(E<<4|0)){s=c[b+44>>2]|0;if((s|0)<(E|0)){ey(b,s+E|0);break}else{ey(b,s<<1);break}}}while(0);E=f5(b,F,1)|0;if((F|0)>0){u=0;do{s=c[n>>2]|0;J=u-F|0;u=u+1|0;K=gc(b,E,u)|0;L=s+(J<<4)|0;M=K;N=c[L+4>>2]|0;c[M>>2]=c[L>>2];c[M+4>>2]=N;c[K+8>>2]=c[s+(J<<4)+8>>2];}while((u|0)<(F|0))}u=gd(b,E,f_(b,2864,1)|0)|0;h[u>>3]=+(F|0);c[u+8>>2]=3;I=E}u=c[n>>2]|0;do{if(t<<24>>24!=0){J=-G|0;c[n>>2]=u+16;s=u+(J<<4)|0;K=u;N=c[s+4>>2]|0;c[K>>2]=c[s>>2];c[K+4>>2]=N;N=u+(J<<4)+8|0;c[u+8>>2]=c[N>>2];c[N>>2]=0;if((t&255)>1){O=1}else{break}do{N=c[n>>2]|0;J=O-G|0;c[n>>2]=N+16;K=u+(J<<4)|0;s=N;M=c[K+4>>2]|0;c[s>>2]=c[K>>2];c[s+4>>2]=M;M=u+(J<<4)+8|0;c[N+8>>2]=c[M>>2];c[M>>2]=0;O=O+1|0;}while((O|0)<(D|0))}}while(0);if((I|0)!=0){D=c[n>>2]|0;c[n>>2]=D+16;c[D>>2]=I;c[D+8>>2]=5}B=(c[k>>2]|0)+m|0;C=u}}while(0);m=c[o>>2]|0;k=b+36|0;do{if((m|0)==(c[k>>2]|0)){I=b+48|0;O=c[I>>2]|0;if((O|0)>2e4){eC(b,5);return 0}G=O<<1;y=b+40|0;H=c[y>>2]|0;if((G|1)>>>0<178956971){P=fu(b,H,O*24|0,O*48|0)|0}else{P=fv(b)|0}O=P;c[y>>2]=O;c[I>>2]=G;I=O+((((c[o>>2]|0)-H|0)/24|0)*24|0)|0;c[o>>2]=I;c[k>>2]=O+((G-1|0)*24|0);if((G|0)<=2e4){Q=I;break}es(b,3400,(z=i,i=i+1|0,i=i+7>>3<<3,c[z>>2]=0,z)|0);i=z;Q=c[o>>2]|0}else{Q=m}}while(0);m=Q+24|0;c[o>>2]=m;c[Q+28>>2]=B;c[m>>2]=C;c[b+12>>2]=C;m=Q+32|0;c[m>>2]=C+(d[p]<<4);c[j>>2]=c[x+12>>2];c[Q+44>>2]=0;c[Q+40>>2]=f;f=c[n>>2]|0;Q=c[m>>2]|0;if(f>>>0<Q>>>0){x=f;while(1){c[x+8>>2]=0;f=x+16|0;p=c[m>>2]|0;if(f>>>0<p>>>0){x=f}else{R=p;break}}}else{R=Q}c[n>>2]=R;if((a[b+56|0]&1)==0){A=0;i=g;return A|0}c[j>>2]=(c[j>>2]|0)+4;eB(b,0,-1);c[j>>2]=(c[j>>2]|0)-4;A=0;i=g;return A|0}function eG(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;g=a+52|0;h=(b[g>>1]|0)+1&65535;b[g>>1]=h;do{if((h&65535)>199){if(h<<16>>16==200){es(a,7968,(j=i,i=i+1|0,i=i+7>>3<<3,c[j>>2]=0,j)|0);i=j;break}if((h&65535)<=224){break}eC(a,5)}}while(0);if((eF(a,d,e)|0)==0){gr(a,1)}b[g>>1]=(b[g>>1]|0)-1&65535;g=c[a+16>>2]|0;if((c[g+68>>2]|0)>>>0<(c[g+64>>2]|0)>>>0){i=f;return}e1(a);i=f;return}function eH(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=d;f=b+20|0;g=b+6|0;do{if((a[g]|0)==0){if((eF(b,d-16|0,-1)|0)==0){break}return}else{h=c[f>>2]|0;a[g]=0;if((a[(c[c[h+4>>2]>>2]|0)+6|0]|0)==0){c[b+12>>2]=c[h>>2];break}if((eD(b,e)|0)==0){break}c[b+8>>2]=c[(c[f>>2]|0)+8>>2]}}while(0);gr(b,((c[f>>2]|0)-(c[b+40>>2]|0)|0)/24|0);return}function eI(b,d){b=b|0;d=d|0;var f=0,g=0;f=i;if((e[b+52>>1]|0)>(e[b+54>>1]|0)){es(b,4752,(g=i,i=i+1|0,i=i+7>>3<<3,c[g>>2]=0,g)|0);i=g}c[b+12>>2]=(c[b+8>>2]|0)+(-d<<4);a[b+6|0]=1;i=f;return-1|0}function eJ(d,e,f,g,h){d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;i=d+52|0;j=b[i>>1]|0;k=d+20|0;l=c[k>>2]|0;m=d+40|0;n=c[m>>2]|0;o=d+57|0;p=a[o]|0;q=d+116|0;r=c[q>>2]|0;c[q>>2]=h;h=ex(d,e,f)|0;if((h|0)==0){c[q>>2]=r;return h|0}f=l-n|0;n=c[d+32>>2]|0;l=n+g|0;eU(d,l);if((h|0)==4){c[l>>2]=f_(d,8280,17)|0;c[n+(g+8)>>2]=4}else if((h|0)==3|(h|0)==2){e=c[d+8>>2]|0;s=e-16|0;t=l;u=c[s+4>>2]|0;c[t>>2]=c[s>>2];c[t+4>>2]=u;c[n+(g+8)>>2]=c[e-16+8>>2]}else if((h|0)==5){c[l>>2]=f_(d,9920,23)|0;c[n+(g+8)>>2]=4}c[d+8>>2]=n+(g+16);b[i>>1]=j;j=c[m>>2]|0;i=j;g=i+f|0;c[k>>2]=g;c[d+12>>2]=c[g>>2];c[d+24>>2]=c[i+(f+12)>>2];a[o]=p;p=d+48|0;o=c[p>>2]|0;if((o|0)<=2e4){c[q>>2]=r;return h|0}f=j;if((((g-f|0)/24|0)+1|0)>=2e4){c[q>>2]=r;return h|0}g=fu(d,i,o*24|0,48e4)|0;o=g;c[m>>2]=o;c[p>>2]=2e4;c[k>>2]=o+((((c[k>>2]|0)-f|0)/24|0)*24|0);c[d+36>>2]=g+479976;c[q>>2]=r;return h|0}function eK(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+24|0;f=e|0;c[f>>2]=b;c[f+16>>2]=d;d=f+4|0;c[d>>2]=0;b=f+12|0;c[b>>2]=0;g=eJ(a,258,f,(c[a+8>>2]|0)-(c[a+32>>2]|0)|0,c[a+116>>2]|0)|0;fu(a,c[d>>2]|0,c[b>>2]|0,0)|0;i=e;return g|0}function eL(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;f=e;g=gv(c[f>>2]|0)|0;h=c[b+16>>2]|0;if((c[h+68>>2]|0)>>>0>=(c[h+64>>2]|0)>>>0){e1(b)}h=cg[((g|0)==27?256:258)&511](b,c[f>>2]|0,e+4|0,c[e+16>>2]|0)|0;e=h+72|0;f=eP(b,d[e]|0,c[b+72>>2]|0)|0;g=f;c[f+16>>2]=h;if((a[e]|0)!=0){h=0;do{c[g+20+(h<<2)>>2]=eQ(b)|0;h=h+1|0;}while((h|0)<(d[e]|0))}e=b+8|0;h=c[e>>2]|0;c[h>>2]=f;c[h+8>>2]=6;if(((c[b+28>>2]|0)-(c[e>>2]|0)|0)>=17){i=c[e>>2]|0;j=i+16|0;c[e>>2]=j;return}h=c[b+44>>2]|0;if((h|0)<1){ey(b,h+1|0);i=c[e>>2]|0;j=i+16|0;c[e>>2]=j;return}else{ey(b,h<<1);i=c[e>>2]|0;j=i+16|0;c[e>>2]=j;return}}function eM(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0;g=i;i=i+40|0;h=g+16|0;c[h>>2]=a;c[h+4>>2]=d;c[h+8>>2]=e;c[h+12>>2]=f;f=h+16|0;j=g|0;gj(j);c[f>>2]=cg[d&511](a,j,12,e)|0;eN(b,0,h);i=g;return c[f>>2]|0}function eN(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0;f=i;i=i+200|0;g=f|0;j=f+8|0;k=f+16|0;l=f+24|0;m=f+32|0;n=f+40|0;o=f+48|0;p=f+56|0;q=f+64|0;r=f+72|0;s=f+80|0;t=f+88|0;u=f+96|0;v=f+104|0;w=f+112|0;x=f+120|0;y=f+128|0;z=f+136|0;A=f+144|0;B=f+152|0;C=f+160|0;D=f+168|0;E=f+176|0;F=f+184|0;G=f+192|0;H=b+32|0;I=c[H>>2]|0;do{if((I|0)==(d|0)){J=w;K=x;L=2103}else{M=(c[e+12>>2]|0)==0?I:0;N=w;O=x;if((M|0)==0){J=N;K=O;L=2103;break}P=M+16|0;if((P|0)==0){J=N;K=O;L=2103;break}c[x>>2]=(c[M+12>>2]|0)+1;M=e+16|0;if((c[M>>2]|0)!=0){Q=N;R=O;break}S=e+4|0;T=e|0;U=e+8|0;V=cg[c[S>>2]&511](c[T>>2]|0,O,4,c[U>>2]|0)|0;c[M>>2]=V;if((V|0)!=0){Q=N;R=O;break}c[M>>2]=cg[c[S>>2]&511](c[T>>2]|0,P,c[x>>2]|0,c[U>>2]|0)|0;Q=N;R=O}}while(0);do{if((L|0)==2103){c[w>>2]=0;x=e+16|0;if((c[x>>2]|0)!=0){Q=J;R=K;break}c[x>>2]=cg[c[e+4>>2]&511](c[e>>2]|0,J,4,c[e+8>>2]|0)|0;Q=J;R=K}}while(0);c[v>>2]=c[b+60>>2];K=e+16|0;R=c[K>>2]|0;if((R|0)==0){J=cg[c[e+4>>2]&511](c[e>>2]|0,v,4,c[e+8>>2]|0)|0;c[K>>2]=J;W=J}else{W=R}c[u>>2]=c[b+64>>2];if((W|0)==0){R=cg[c[e+4>>2]&511](c[e>>2]|0,u,4,c[e+8>>2]|0)|0;c[K>>2]=R;X=R}else{X=W}a[t]=a[b+72|0]|0;if((X|0)==0){W=cg[c[e+4>>2]&511](c[e>>2]|0,t,1,c[e+8>>2]|0)|0;c[K>>2]=W;Y=W}else{Y=X}a[s]=a[b+73|0]|0;if((Y|0)==0){X=cg[c[e+4>>2]&511](c[e>>2]|0,s,1,c[e+8>>2]|0)|0;c[K>>2]=X;Z=X}else{Z=Y}a[r]=a[b+74|0]|0;if((Z|0)==0){Y=cg[c[e+4>>2]&511](c[e>>2]|0,r,1,c[e+8>>2]|0)|0;c[K>>2]=Y;_=Y}else{_=Z}a[q]=a[b+75|0]|0;if((_|0)==0){Z=cg[c[e+4>>2]&511](c[e>>2]|0,q,1,c[e+8>>2]|0)|0;c[K>>2]=Z;$=Z}else{$=_}_=c[b+12>>2]|0;Z=c[b+44>>2]|0;c[p>>2]=Z;do{if(($|0)==0){q=e+4|0;Y=e|0;r=e+8|0;X=cg[c[q>>2]&511](c[Y>>2]|0,p,4,c[r>>2]|0)|0;c[K>>2]=X;if((X|0)!=0){aa=X;L=2122;break}X=cg[c[q>>2]&511](c[Y>>2]|0,_,Z<<2,c[r>>2]|0)|0;c[K>>2]=X;r=c[b+40>>2]|0;c[o>>2]=r;if((X|0)!=0){ab=X;ac=r;break}X=cg[c[e+4>>2]&511](c[e>>2]|0,o,4,c[e+8>>2]|0)|0;c[K>>2]=X;ab=X;ac=r}else{aa=$;L=2122}}while(0);if((L|0)==2122){$=c[b+40>>2]|0;c[o>>2]=$;ab=aa;ac=$}if((ac|0)>0){$=b+8|0;aa=e+4|0;o=e|0;Z=e+8|0;_=j;p=k;r=l;X=0;Y=ab;while(1){q=c[$>>2]|0;s=q+(X<<4)|0;W=q+(X<<4)+8|0;q=c[W>>2]|0;a[n]=q&255;if((Y|0)==0){t=cg[c[aa>>2]&511](c[o>>2]|0,n,1,c[Z>>2]|0)|0;c[K>>2]=t;ad=t;ae=c[W>>2]|0}else{ad=Y;ae=q}L2679:do{if((ae|0)==3){h[l>>3]=+h[s>>3];if((ad|0)!=0){af=ad;break}q=cg[c[aa>>2]&511](c[o>>2]|0,r,8,c[Z>>2]|0)|0;c[K>>2]=q;af=q}else if((ae|0)==1){a[m]=c[s>>2]&255;if((ad|0)!=0){af=ad;break}q=cg[c[aa>>2]&511](c[o>>2]|0,m,1,c[Z>>2]|0)|0;c[K>>2]=q;af=q}else if((ae|0)==4){q=c[s>>2]|0;do{if((q|0)!=0){W=q+16|0;if((W|0)==0){break}c[k>>2]=(c[q+12>>2]|0)+1;if((ad|0)!=0){af=ad;break L2679}t=cg[c[aa>>2]&511](c[o>>2]|0,p,4,c[Z>>2]|0)|0;c[K>>2]=t;if((t|0)!=0){af=t;break L2679}t=cg[c[aa>>2]&511](c[o>>2]|0,W,c[k>>2]|0,c[Z>>2]|0)|0;c[K>>2]=t;af=t;break L2679}}while(0);c[j>>2]=0;if((ad|0)!=0){af=ad;break}q=cg[c[aa>>2]&511](c[o>>2]|0,_,4,c[Z>>2]|0)|0;c[K>>2]=q;af=q}else{af=ad}}while(0);s=X+1|0;if((s|0)<(ac|0)){X=s;Y=af}else{ag=af;break}}}else{ag=ab}ab=c[b+52>>2]|0;c[g>>2]=ab;if((ag|0)==0){c[K>>2]=cg[c[e+4>>2]&511](c[e>>2]|0,g,4,c[e+8>>2]|0)|0}if((ab|0)>0){g=b+16|0;ag=0;do{eN(c[(c[g>>2]|0)+(ag<<2)>>2]|0,c[H>>2]|0,e);ag=ag+1|0;}while((ag|0)<(ab|0))}ab=e+12|0;if((c[ab>>2]|0)==0){ah=c[b+48>>2]|0}else{ah=0}ag=c[b+20>>2]|0;c[G>>2]=ah;H=c[K>>2]|0;do{if((H|0)==0){g=e+4|0;af=e|0;Y=e+8|0;X=cg[c[g>>2]&511](c[af>>2]|0,G,4,c[Y>>2]|0)|0;c[K>>2]=X;if((X|0)!=0){ai=X;break}X=cg[c[g>>2]&511](c[af>>2]|0,ag,ah<<2,c[Y>>2]|0)|0;c[K>>2]=X;ai=X}else{ai=H}}while(0);if((c[ab>>2]|0)==0){aj=c[b+56>>2]|0}else{aj=0}c[F>>2]=aj;if((ai|0)==0){H=cg[c[e+4>>2]&511](c[e>>2]|0,F,4,c[e+8>>2]|0)|0;c[K>>2]=H;ak=H}else{ak=ai}if((aj|0)>0){ai=b+24|0;H=D;F=E;ah=e+4|0;ag=e|0;G=e+8|0;X=C;Y=B;af=0;g=ak;while(1){ac=c[(c[ai>>2]|0)+(af*12|0)>>2]|0;do{if((ac|0)==0){L=2160}else{ad=ac+16|0;if((ad|0)==0){L=2160;break}c[E>>2]=(c[ac+12>>2]|0)+1;if((g|0)!=0){al=g;break}Z=cg[c[ah>>2]&511](c[ag>>2]|0,F,4,c[G>>2]|0)|0;c[K>>2]=Z;if((Z|0)!=0){al=Z;break}Z=cg[c[ah>>2]&511](c[ag>>2]|0,ad,c[E>>2]|0,c[G>>2]|0)|0;c[K>>2]=Z;al=Z}}while(0);do{if((L|0)==2160){L=0;c[D>>2]=0;if((g|0)!=0){al=g;break}ac=cg[c[ah>>2]&511](c[ag>>2]|0,H,4,c[G>>2]|0)|0;c[K>>2]=ac;al=ac}}while(0);ac=c[ai>>2]|0;c[C>>2]=c[ac+(af*12|0)+4>>2];if((al|0)==0){Z=cg[c[ah>>2]&511](c[ag>>2]|0,X,4,c[G>>2]|0)|0;c[K>>2]=Z;am=c[ai>>2]|0;an=Z}else{am=ac;an=al}c[B>>2]=c[am+(af*12|0)+8>>2];if((an|0)==0){ac=cg[c[ah>>2]&511](c[ag>>2]|0,Y,4,c[G>>2]|0)|0;c[K>>2]=ac;ao=ac}else{ao=an}ac=af+1|0;if((ac|0)<(aj|0)){af=ac;g=ao}else{ap=ao;break}}}else{ap=ak}if((c[ab>>2]|0)==0){aq=c[b+36>>2]|0}else{aq=0}c[A>>2]=aq;if((ap|0)==0){ab=cg[c[e+4>>2]&511](c[e>>2]|0,A,4,c[e+8>>2]|0)|0;c[K>>2]=ab;ar=ab}else{ar=ap}if((aq|0)<=0){i=f;return}ap=b+28|0;b=y;ab=z;A=e+4|0;ak=e|0;ao=e+8|0;e=0;g=ar;while(1){ar=c[(c[ap>>2]|0)+(e<<2)>>2]|0;do{if((ar|0)==0){L=2178}else{af=ar+16|0;if((af|0)==0){L=2178;break}c[z>>2]=(c[ar+12>>2]|0)+1;if((g|0)!=0){as=g;break}aj=cg[c[A>>2]&511](c[ak>>2]|0,ab,4,c[ao>>2]|0)|0;c[K>>2]=aj;if((aj|0)!=0){as=aj;break}aj=cg[c[A>>2]&511](c[ak>>2]|0,af,c[z>>2]|0,c[ao>>2]|0)|0;c[K>>2]=aj;as=aj}}while(0);do{if((L|0)==2178){L=0;c[y>>2]=0;if((g|0)!=0){as=g;break}ar=cg[c[A>>2]&511](c[ak>>2]|0,b,4,c[ao>>2]|0)|0;c[K>>2]=ar;as=ar}}while(0);ar=e+1|0;if((ar|0)<(aq|0)){e=ar;g=as}else{break}}i=f;return}function eO(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=fu(b,0,0,(d<<4)+24|0)|0;e3(b,f,6);a[f+6|0]=1;c[f+12>>2]=e;a[f+7|0]=d&255;return f|0}function eP(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0;f=fu(b,0,0,(d<<2)+20|0)|0;g=f;e3(b,f,6);a[f+6|0]=0;c[f+12>>2]=e;a[f+7|0]=d&255;if((d|0)==0){return g|0}e=f+20|0;f=d;do{f=f-1|0;c[e+(f<<2)>>2]=0;}while((f|0)!=0);return g|0}function eQ(a){a=a|0;var b=0;b=fu(a,0,0,32)|0;e3(a,b,10);c[b+8>>2]=b+16;c[b+24>>2]=0;return b|0}function eR(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0;f=c[b+16>>2]|0;g=b+104|0;while(1){h=c[g>>2]|0;if((h|0)==0){i=2201;break}j=c[h+8>>2]|0;if(j>>>0<e>>>0){i=2201;break}k=h;if((j|0)==(e|0)){break}else{g=h|0}}if((i|0)==2201){i=fu(b,0,0,32)|0;b=i;a[i+4|0]=10;a[i+5|0]=a[f+20|0]&3;c[i+8>>2]=e;c[i>>2]=c[g>>2];c[g>>2]=i;c[i+16>>2]=f+120;g=f+140|0;e=c[g>>2]|0;c[i+20>>2]=e;c[e+16>>2]=b;c[g>>2]=b;l=b;return l|0}b=h+5|0;h=a[b]|0;if((h&3&((d[f+20|0]|0)^3)|0)==0){l=k;return l|0}a[b]=h^3;l=k;return l|0}function eS(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;if((c[b+8>>2]|0)==(b+16|0)){d=b;e=fu(a,d,32,0)|0;return}f=b+16|0;g=f;h=f+4|0;c[(c[h>>2]|0)+16>>2]=c[g>>2];c[(c[g>>2]|0)+20>>2]=c[h>>2];d=b;e=fu(a,d,32,0)|0;return}function eT(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=c[a+56>>2]|0;if((e|0)<=0){f=0;return f|0}g=c[a+24>>2]|0;a=b;b=0;while(1){if((c[g+(b*12|0)+4>>2]|0)>(d|0)){f=0;h=2220;break}if((c[g+(b*12|0)+8>>2]|0)>(d|0)){i=a-1|0;if((i|0)==0){h=2216;break}else{j=i}}else{j=a}i=b+1|0;if((i|0)<(e|0)){a=j;b=i}else{f=0;h=2219;break}}if((h|0)==2216){f=(c[g+(b*12|0)>>2]|0)+16|0;return f|0}else if((h|0)==2220){return f|0}else if((h|0)==2219){return f|0}return 0}function eU(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;f=b+104|0;g=c[f>>2]|0;if((g|0)==0){return}h=(c[b+16>>2]|0)+20|0;i=g;while(1){g=i+8|0;if((c[g>>2]|0)>>>0<e>>>0){j=2234;break}c[f>>2]=c[i>>2];if((a[i+5|0]&3&((d[h]|0)^3)|0)==0){k=i+16|0;l=k+4|0;c[(c[l>>2]|0)+16>>2]=c[k>>2];c[(c[k>>2]|0)+20>>2]=c[l>>2];l=c[g>>2]|0;m=l;n=k;o=c[m+4>>2]|0;c[n>>2]=c[m>>2];c[n+4>>2]=o;c[k+8>>2]=c[l+8>>2];c[g>>2]=k;e9(b,i)}else{k=i+16|0;if((c[g>>2]|0)!=(k|0)){g=k+4|0;c[(c[g>>2]|0)+16>>2]=c[k>>2];c[(c[k>>2]|0)+20>>2]=c[g>>2]}g=i;fu(b,g,32,0)|0}g=c[f>>2]|0;if((g|0)==0){j=2235;break}else{i=g}}if((j|0)==2235){return}else if((j|0)==2234){return}}function eV(b){b=b|0;var c=0;c=fu(b,0,0,76)|0;e3(b,c,9);j2(c+8|0,0,60);b=c+72|0;w=0;a[b]=w&255;w=w>>8;a[b+1|0]=w&255;w=w>>8;a[b+2|0]=w&255;w=w>>8;a[b+3|0]=w&255;return c|0}function eW(a,b){a=a|0;b=b|0;fu(a,c[b+12>>2]|0,c[b+44>>2]<<2,0)|0;fu(a,c[b+16>>2]|0,c[b+52>>2]<<2,0)|0;fu(a,c[b+8>>2]|0,c[b+40>>2]<<4,0)|0;fu(a,c[b+20>>2]|0,c[b+48>>2]<<2,0)|0;fu(a,c[b+24>>2]|0,(c[b+56>>2]|0)*12|0,0)|0;fu(a,c[b+28>>2]|0,c[b+36>>2]<<2,0)|0;fu(a,b,76,0)|0;return}function eX(b,c){b=b|0;c=c|0;var e=0,f=0;e=d[c+7|0]|0;if((a[c+6|0]|0)==0){f=(e<<2)+20|0}else{f=(e<<4)+24|0}fu(b,c,f,0)|0;return}function eY(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;e=b+16|0;b=c[e>>2]|0;f=c[b+112>>2]|0;g=c[f>>2]|0;if((g|0)==0){h=0;return h|0}i=(d|0)==0;d=b+48|0;b=f;f=0;j=g;L2826:while(1){L2828:do{if(i){g=f;k=j;while(1){l=k+5|0;m=a[l]|0;if(!((m&3)!=0&(m&8)==0)){n=g;o=k;break L2828}m=c[k+8>>2]|0;p=m;if((m|0)==0){q=g;r=k;s=l;t=2258;break L2828}if((a[p+6|0]&4)!=0){q=g;r=k;s=l;t=2258;break L2828}if((gf(p,2,c[(c[e>>2]|0)+196>>2]|0)|0)==0){q=g;r=k;s=l;t=2258;break L2828}p=g+24+(c[k+16>>2]|0)|0;a[l]=a[l]|8;l=k|0;c[b>>2]=c[l>>2];m=c[d>>2]|0;if((m|0)==0){c[l>>2]=k}else{c[l>>2]=c[m>>2];c[c[d>>2]>>2]=k}c[d>>2]=k;m=c[b>>2]|0;if((m|0)==0){h=p;t=2265;break L2826}else{g=p;k=m}}}else{k=f;g=j;while(1){m=g+5|0;if((a[m]&8)!=0){n=k;o=g;break L2828}p=c[g+8>>2]|0;l=p;if((p|0)==0){q=k;r=g;s=m;t=2258;break L2828}if((a[l+6|0]&4)!=0){q=k;r=g;s=m;t=2258;break L2828}if((gf(l,2,c[(c[e>>2]|0)+196>>2]|0)|0)==0){q=k;r=g;s=m;t=2258;break L2828}l=k+24+(c[g+16>>2]|0)|0;a[m]=a[m]|8;m=g|0;c[b>>2]=c[m>>2];p=c[d>>2]|0;if((p|0)==0){c[m>>2]=g}else{c[m>>2]=c[p>>2];c[c[d>>2]>>2]=g}c[d>>2]=g;p=c[b>>2]|0;if((p|0)==0){h=l;t=2266;break L2826}else{k=l;g=p}}}}while(0);if((t|0)==2258){t=0;a[s]=a[s]|8;n=q;o=r}g=o|0;k=c[g>>2]|0;if((k|0)==0){h=n;t=2267;break}else{b=g;f=n;j=k}}if((t|0)==2266){return h|0}else if((t|0)==2267){return h|0}else if((t|0)==2265){return h|0}return 0}function eZ(a){a=a|0;var b=0;b=a+16|0;if((c[(c[b>>2]|0)+48>>2]|0)==0){return}do{e_(a);}while((c[(c[b>>2]|0)+48>>2]|0)!=0);return}function e_(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=b+16|0;e=c[d>>2]|0;f=e+48|0;g=c[f>>2]|0;h=g|0;i=c[h>>2]|0;if((i|0)==(g|0)){c[f>>2]=0;j=i|0}else{f=i|0;c[h>>2]=c[f>>2];j=f}f=e+112|0;c[j>>2]=c[c[f>>2]>>2];c[c[f>>2]>>2]=i;f=i+5|0;a[f]=a[e+20|0]&3|a[f]&-8;f=c[i+8>>2]|0;j=f;if((f|0)==0){return}if((a[j+6|0]&4)!=0){return}f=gf(j,2,c[(c[d>>2]|0)+196>>2]|0)|0;if((f|0)==0){return}d=b+57|0;j=a[d]|0;h=e+64|0;g=c[h>>2]|0;a[d]=0;c[h>>2]=c[e+68>>2]<<1;e=b+8|0;k=c[e>>2]|0;l=f;m=k;n=c[l+4>>2]|0;c[m>>2]=c[l>>2];c[m+4>>2]=n;c[k+8>>2]=c[f+8>>2];f=c[e>>2]|0;c[f+16>>2]=i;c[f+24>>2]=7;f=c[e>>2]|0;c[e>>2]=f+32;eG(b,f,0);a[d]=j;c[h>>2]=g;return}function e$(b){b=b|0;var d=0,e=0,f=0;d=c[b+16>>2]|0;a[d+20|0]=67;e0(b,d+28|0,-3)|0;e=d+8|0;if((c[e>>2]|0)<=0){return}f=d|0;d=0;do{e0(b,(c[f>>2]|0)+(d<<2)|0,-3)|0;d=d+1|0;}while((d|0)<(c[e>>2]|0));return}function e0(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;g=b+16|0;h=c[g>>2]|0;i=h+20|0;j=d[i]^3;k=c[e>>2]|0;if((k|0)==0){l=e;return l|0}m=h+28|0;h=f;f=e;e=k;while(1){k=h-1|0;if((h|0)==0){l=f;n=2310;break}o=e+4|0;if((a[o]|0)==8){p=e+104|0;e0(b,p,-3)|0}p=e+5|0;q=a[p]|0;L2894:do{if(((q&255^3)&j|0)==0){r=e|0;c[f>>2]=c[r>>2];if((e|0)==(c[m>>2]|0)){c[m>>2]=c[r>>2]}switch(d[o]|0){case 5:{f7(b,e);s=f;break L2894;break};case 4:{r=(c[g>>2]|0)+4|0;c[r>>2]=(c[r>>2]|0)-1;fu(b,e,(c[e+12>>2]|0)+17|0,0)|0;s=f;break L2894;break};case 7:{fu(b,e,(c[e+16>>2]|0)+24|0,0)|0;s=f;break L2894;break};case 9:{eW(b,e);s=f;break L2894;break};case 6:{eX(b,e);s=f;break L2894;break};case 8:{fU(b,e|0);s=f;break L2894;break};case 10:{eS(b,e);s=f;break L2894;break};default:{s=f;break L2894}}}else{a[p]=a[i]&3|q&-8;s=e|0}}while(0);q=c[s>>2]|0;if((q|0)==0){l=s;n=2312;break}else{h=k;f=s;e=q}}if((n|0)==2310){return l|0}else if((n|0)==2312){return l|0}return 0}function e1(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;d=c[b+16>>2]|0;e=(c[d+84>>2]|0)*10|0;f=d+68|0;g=d+64|0;h=d+76|0;c[h>>2]=(c[f>>2]|0)-(c[g>>2]|0)+(c[h>>2]|0);i=d+21|0;j=(e|0)==0?2147483646:e;do{j=j-(e4(b)|0)|0;k=a[i]|0;}while(k<<24>>24!=0&(j|0)>0);if(k<<24>>24==0){c[g>>2]=aa(c[d+80>>2]|0,((c[d+72>>2]|0)>>>0)/100|0)|0;return}d=c[h>>2]|0;if(d>>>0<1024){c[g>>2]=(c[f>>2]|0)+1024;return}else{c[h>>2]=d-1024;c[g>>2]=c[f>>2];return}}function e2(b,d){b=b|0;d=d|0;var e=0;e=c[b+16>>2]|0;b=d+5|0;a[b]=a[b]&-5;b=e+40|0;c[d+24>>2]=c[b>>2];c[b>>2]=d;return}function e3(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=c[b+16>>2]|0;b=f+28|0;c[d>>2]=c[b>>2];c[b>>2]=d;a[d+5|0]=a[f+20|0]&3;a[d+4|0]=e;return}function e4(b){b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;e=b+16|0;f=c[e>>2]|0;g=f+21|0;switch(d[g]|0|0){case 0:{e6(b);h=0;return h|0};case 1:{i=f+36|0;if((c[i>>2]|0)!=0){h=fb(f)|0;return h|0}j=f+120|0;k=c[f+140>>2]|0;do{if((k|0)!=(j|0)){l=k;do{do{if((a[l+5|0]&7)==0){m=c[l+8>>2]|0;if((c[m+8>>2]|0)<=3){break}n=c[m>>2]|0;if((a[n+5|0]&3)==0){break}e8(f,n)}}while(0);l=c[l+20>>2]|0;}while((l|0)!=(j|0));if((c[i>>2]|0)==0){break}do{fb(f)|0;}while((c[i>>2]|0)!=0)}}while(0);j=f+44|0;c[i>>2]=c[j>>2];c[j>>2]=0;if((a[b+5|0]&3)!=0){e8(f,b)}fa(f);if((c[i>>2]|0)!=0){do{fb(f)|0;}while((c[i>>2]|0)!=0)}k=f+40|0;l=c[k>>2]|0;c[i>>2]=l;c[k>>2]=0;if((l|0)!=0){do{fb(f)|0;}while((c[i>>2]|0)!=0)}l=eY(b,0)|0;k=f+48|0;n=c[k>>2]|0;if((n|0)!=0){m=f+20|0;o=n;do{o=c[o>>2]|0;n=o+5|0;a[n]=a[m]&3|a[n]&-8;e8(f,o);}while((o|0)!=(c[k>>2]|0))}if((c[i>>2]|0)==0){p=0}else{k=0;while(1){o=(fb(f)|0)+k|0;if((c[i>>2]|0)==0){p=o;break}else{k=o}}}k=c[j>>2]|0;if((k|0)!=0){j=k;do{k=j;i=c[j+28>>2]|0;if(!((a[j+5|0]&16)==0|(i|0)==0)){o=j+12|0;m=i;do{m=m-1|0;i=c[o>>2]|0;n=i+(m<<4)+8|0;q=c[n>>2]|0;do{if((q|0)>3){r=(c[i+(m<<4)>>2]|0)+5|0;s=a[r]|0;if((q|0)==4){a[r]=s&-4;break}if((s&3)==0){if((q|0)!=7){break}if((s&8)==0){break}}c[n>>2]=0}}while(0);}while((m|0)!=0)}m=j+16|0;o=1<<(d[k+7|0]|0);do{o=o-1|0;n=c[m>>2]|0;q=n+(o<<5)|0;i=n+(o<<5)+8|0;s=c[i>>2]|0;L2988:do{if((s|0)!=0){r=n+(o<<5)+24|0;t=c[r>>2]|0;do{if((t|0)>3){u=(c[n+(o<<5)+16>>2]|0)+5|0;v=a[u]|0;if((t|0)==4){a[u]=v&-4;w=c[i>>2]|0;x=2367;break}else{if((v&3)==0){w=s;x=2367;break}else{break}}}else{w=s;x=2367}}while(0);do{if((x|0)==2367){x=0;if((w|0)<=3){break L2988}t=(c[q>>2]|0)+5|0;v=a[t]|0;if((w|0)==4){a[t]=v&-4;break L2988}if((v&3)!=0){break}if((w|0)!=7){break L2988}if((v&8)==0){break L2988}}}while(0);c[i>>2]=0;if((c[r>>2]|0)<=3){break}c[r>>2]=11}}while(0);}while((o|0)!=0);j=c[j+24>>2]|0;}while((j|0)!=0)}j=f+20|0;a[j]=a[j]^3;c[f+24>>2]=0;c[f+32>>2]=f+28;a[g]=2;c[f+72>>2]=(c[f+68>>2]|0)-(p+l);h=0;return h|0};case 4:{if((c[f+48>>2]|0)==0){a[g]=0;c[f+76>>2]=0;h=0;return h|0}e_(b);l=f+72|0;p=c[l>>2]|0;if(p>>>0<=100){h=100;return h|0}c[l>>2]=p-100;h=100;return h|0};case 2:{p=f+68|0;l=c[p>>2]|0;j=f+24|0;w=c[j>>2]|0;c[j>>2]=w+1;e0(b,(c[f>>2]|0)+(w<<2)|0,-3)|0;if((c[j>>2]|0)>=(c[f+8>>2]|0)){a[g]=3}j=f+72|0;c[j>>2]=(c[p>>2]|0)-l+(c[j>>2]|0);h=10;return h|0};case 3:{j=f+68|0;l=c[j>>2]|0;p=f+32|0;w=e0(b,c[p>>2]|0,40)|0;c[p>>2]=w;if((c[w>>2]|0)==0){w=c[e>>2]|0;e=c[w+8>>2]|0;if((c[w+4>>2]|0)>>>0<((e|0)/4|0)>>>0&(e|0)>64){fZ(b,(e|0)/2|0)}e=w+52|0;p=w+60|0;w=c[p>>2]|0;if(w>>>0>64){x=w>>>1;if((x+1|0)>>>0<4294967294){o=e|0;y=fu(b,c[o>>2]|0,w,x)|0;z=o}else{y=fv(b)|0;z=e|0}c[z>>2]=y;c[p>>2]=x}a[g]=4}g=f+72|0;c[g>>2]=(c[j>>2]|0)-l+(c[g>>2]|0);h=400;return h|0};default:{h=0;return h|0}}return 0}function e5(b){b=b|0;var d=0,e=0,f=0,g=0;d=c[b+16>>2]|0;e=d+21|0;f=a[e]|0;if((f&255)<2){c[d+24>>2]=0;c[d+32>>2]=d+28;c[d+36>>2]=0;c[d+40>>2]=0;c[d+44>>2]=0;a[e]=2;g=2407}else{if(f<<24>>24!=4){g=2407}}if((g|0)==2407){while(1){g=0;e4(b)|0;if((a[e]|0)==4){break}else{g=2407}}}e6(b);if((a[e]|0)!=0){do{e4(b)|0;}while((a[e]|0)!=0)}c[d+64>>2]=aa(c[d+80>>2]|0,((c[d+72>>2]|0)>>>0)/100|0)|0;return}function e6(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b+16|0;b=c[d>>2]|0;c[b+36>>2]=0;c[b+40>>2]=0;c[b+44>>2]=0;e=b+112|0;f=c[e>>2]|0;if((a[f+5|0]&3)==0){g=f}else{e8(b,f);g=c[e>>2]|0}do{if((c[g+80>>2]|0)>3){e=c[g+72>>2]|0;if((a[e+5|0]&3)==0){break}e8(b,e)}}while(0);g=c[d>>2]|0;if((c[g+104>>2]|0)<=3){fa(b);h=b+21|0;a[h]=1;return}d=c[g+96>>2]|0;if((a[d+5|0]&3)==0){fa(b);h=b+21|0;a[h]=1;return}e8(b,d);fa(b);h=b+21|0;a[h]=1;return}function e7(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=c[b+16>>2]|0;if((a[f+21|0]|0)==1){e8(f,e);return}else{e=d+5|0;a[e]=a[f+20|0]&3|a[e]&-8;return}}function e8(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0;f=e;L3073:while(1){g=f+5|0;e=a[g]&-4;a[g]=e;switch(d[f+4|0]|0|0){case 7:{break};case 5:{h=2442;break L3073;break};case 6:{h=2441;break L3073;break};case 9:{h=2444;break L3073;break};case 8:{h=2443;break L3073;break};case 10:{h=2436;break L3073;break};default:{h=2446;break L3073}}i=c[f+8>>2]|0;a[g]=e|4;do{if((i|0)!=0){if((a[i+5|0]&3)==0){break}e8(b,i)}}while(0);i=c[f+12>>2]|0;if((a[i+5|0]&3)==0){h=2448;break}f=i}if((h|0)==2442){i=b+36|0;c[f+24>>2]=c[i>>2];c[i>>2]=f;return}else if((h|0)==2441){i=b+36|0;c[f+8>>2]=c[i>>2];c[i>>2]=f;return}else if((h|0)==2444){i=b+36|0;c[f+68>>2]=c[i>>2];c[i>>2]=f;return}else if((h|0)==2443){i=b+36|0;c[f+108>>2]=c[i>>2];c[i>>2]=f;return}else if((h|0)==2436){i=f+8|0;e=c[i>>2]|0;do{if((c[e+8>>2]|0)>3){j=c[e>>2]|0;if((a[j+5|0]&3)==0){k=e;break}e8(b,j);k=c[i>>2]|0}else{k=e}}while(0);if((k|0)!=(f+16|0)){return}a[g]=a[g]|4;return}else if((h|0)==2446){return}else if((h|0)==2448){return}}function e9(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=b+16|0;b=c[e>>2]|0;f=b+28|0;c[d>>2]=c[f>>2];c[f>>2]=d;f=d+5|0;g=a[f]|0;if((g&7)!=0){return}if((a[b+21|0]|0)!=1){a[f]=a[b+20|0]&3|g&-8;return}a[f]=g|4;b=c[d+8>>2]|0;if((c[b+8>>2]|0)<=3){return}d=c[b>>2]|0;if((a[d+5|0]&3)==0){return}b=c[e>>2]|0;if((a[b+21|0]|0)==1){e8(b,d);return}else{a[f]=a[b+20|0]&3|g&-8;return}}function fa(b){b=b|0;var d=0;d=c[b+152>>2]|0;do{if((d|0)!=0){if((a[d+5|0]&3)==0){break}e8(b,d)}}while(0);d=c[b+156>>2]|0;do{if((d|0)!=0){if((a[d+5|0]&3)==0){break}e8(b,d)}}while(0);d=c[b+160>>2]|0;do{if((d|0)!=0){if((a[d+5|0]&3)==0){break}e8(b,d)}}while(0);d=c[b+164>>2]|0;do{if((d|0)!=0){if((a[d+5|0]&3)==0){break}e8(b,d)}}while(0);d=c[b+168>>2]|0;do{if((d|0)!=0){if((a[d+5|0]&3)==0){break}e8(b,d)}}while(0);d=c[b+172>>2]|0;do{if((d|0)!=0){if((a[d+5|0]&3)==0){break}e8(b,d)}}while(0);d=c[b+176>>2]|0;do{if((d|0)!=0){if((a[d+5|0]&3)==0){break}e8(b,d)}}while(0);d=c[b+180>>2]|0;do{if((d|0)!=0){if((a[d+5|0]&3)==0){break}e8(b,d)}}while(0);d=c[b+184>>2]|0;if((d|0)==0){return}if((a[d+5|0]&3)==0){return}e8(b,d);return}function fb(b){b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0;e=b+36|0;f=c[e>>2]|0;g=f+5|0;a[g]=a[g]|4;h=d[f+4|0]|0;if((h|0)==5){i=f;j=f+24|0;c[e>>2]=c[j>>2];k=f+8|0;l=c[k>>2]|0;m=l;do{if((l|0)==0){n=0;o=2512}else{if((a[m+5|0]&3)==0){p=m}else{e8(b,l);q=c[k>>2]|0;if((q|0)==0){n=0;o=2512;break}else{p=q}}if((a[p+6|0]&8)!=0){n=0;o=2512;break}q=gf(p,3,c[b+200>>2]|0)|0;if((q|0)==0){n=0;o=2512;break}if((c[q+8>>2]|0)!=4){n=0;o=2512;break}r=(c[q>>2]|0)+16|0;q=(aU(r|0,107)|0)!=0;s=(aU(r|0,118)|0)!=0;r=s&1;if(q|s){a[g]=(r<<4|(q&1)<<3|a[g]&-25&255)&255;t=b+44|0;c[j>>2]=c[t>>2];c[t>>2]=f}if(q&s){u=i+7|0;o=2541;break}else{if(s){v=q;w=r;x=1;o=2518;break}else{n=q;o=2512;break}}}}while(0);do{if((o|0)==2512){j=c[f+28>>2]|0;if((j|0)==0){v=n;w=0;x=0;o=2518;break}p=f+12|0;k=j;while(1){j=k-1|0;l=c[p>>2]|0;do{if((c[l+(j<<4)+8>>2]|0)>3){m=c[l+(j<<4)>>2]|0;if((a[m+5|0]&3)==0){break}e8(b,m)}}while(0);if((j|0)==0){v=n;w=0;x=0;o=2518;break}else{k=j}}}}while(0);if((o|0)==2518){n=i+7|0;i=(1<<d[n])-1|0;k=f+16|0;L3188:do{if(v){p=x^1;l=i;while(1){m=c[k>>2]|0;q=m+(l<<5)|0;r=c[m+(l<<5)+8>>2]|0;do{if((r|0)==0){s=m+(l<<5)+24|0;if((c[s>>2]|0)<=3){break}c[s>>2]=11}else{if(!((r|0)>3&p)){break}s=c[q>>2]|0;if((a[s+5|0]&3)==0){break}e8(b,s)}}while(0);if((l|0)==0){break L3188}l=l-1|0}}else{l=i;while(1){p=c[k>>2]|0;q=p+(l<<5)|0;r=p+(l<<5)+8|0;m=p+(l<<5)+24|0;j=(c[m>>2]|0)>3;do{if((c[r>>2]|0)==0){if(!j){break}c[m>>2]=11}else{do{if(j){s=c[p+(l<<5)+16>>2]|0;if((a[s+5|0]&3)==0){break}e8(b,s)}}while(0);if(x){break}if((c[r>>2]|0)<=3){break}s=c[q>>2]|0;if((a[s+5|0]&3)==0){break}e8(b,s)}}while(0);if((l|0)==0){break L3188}l=l-1|0}}}while(0);if((w|0)==0&(v^1)){y=n}else{u=n;o=2541}}if((o|0)==2541){a[g]=a[g]&-5;y=u}z=(c[f+28>>2]<<4)+32+(32<<d[y])|0;return z|0}else if((h|0)==6){y=f;c[e>>2]=c[f+8>>2];u=c[f+12>>2]|0;if((a[u+5|0]&3)!=0){e8(b,u)}u=f+6|0;do{if((a[u]|0)==0){o=f;n=c[f+16>>2]|0;if((a[n+5|0]&3)!=0){e8(b,n)}n=y+7|0;v=a[n]|0;if(v<<24>>24==0){A=0;break}else{B=0;C=v}while(1){v=c[o+20+(B<<2)>>2]|0;if((a[v+5|0]&3)==0){D=C}else{e8(b,v);D=a[n]|0}v=B+1|0;if((v|0)<(D&255|0)){B=v;C=D}else{A=D;break}}}else{n=y+7|0;o=a[n]|0;if(o<<24>>24==0){A=0;break}else{E=0;F=o}while(1){do{if((c[y+24+(E<<4)+8>>2]|0)>3){o=c[y+24+(E<<4)>>2]|0;if((a[o+5|0]&3)==0){G=F;break}e8(b,o);G=a[n]|0}else{G=F}}while(0);o=E+1|0;if((o|0)<(G&255|0)){E=o;F=G}else{A=G;break}}}}while(0);G=A&255;if((a[u]|0)==0){z=(G<<2)+20|0;return z|0}else{z=(G<<4)+24|0;return z|0}}else if((h|0)==8){G=f|0;u=f+108|0;c[e>>2]=c[u>>2];A=b+40|0;c[u>>2]=c[A>>2];c[A>>2]=f;a[g]=a[g]&-5;do{if((c[f+80>>2]|0)>3){g=c[f+72>>2]|0;if((a[g+5|0]&3)==0){break}e8(b,g)}}while(0);g=f+8|0;A=c[g>>2]|0;u=f+40|0;F=c[u>>2]|0;E=f+20|0;y=c[E>>2]|0;if(F>>>0>y>>>0){H=A}else{D=A;C=F;while(1){F=c[C+8>>2]|0;B=D>>>0<F>>>0?F:D;F=C+24|0;if(F>>>0>y>>>0){H=B;break}else{D=B;C=F}}}C=f+32|0;D=c[C>>2]|0;if(D>>>0<A>>>0){y=D;F=A;while(1){do{if((c[y+8>>2]|0)>3){A=c[y>>2]|0;if((a[A+5|0]&3)==0){I=F;break}e8(b,A);I=c[g>>2]|0}else{I=F}}while(0);A=y+16|0;if(A>>>0<I>>>0){y=A;F=I}else{J=A;break}}}else{J=D}if(J>>>0<=H>>>0){D=J;do{c[D+8>>2]=0;D=D+16|0;}while(D>>>0<=H>>>0)}D=H-(c[C>>2]|0)|0;C=f+48|0;H=c[C>>2]|0;do{if((H|0)>2e4){K=f+44|0}else{if(((((c[E>>2]|0)-(c[u>>2]|0)|0)/24|0)<<2|0)<(H|0)&(H|0)>16){ez(G,(H|0)/2|0)}J=f+44|0;I=c[J>>2]|0;if(!((D>>2|0)<(I|0)&(I|0)>90)){K=J;break}ey(G,(I|0)/2|0);K=J}}while(0);z=(c[K>>2]<<4)+120+((c[C>>2]|0)*24|0)|0;return z|0}else if((h|0)==9){c[e>>2]=c[f+68>>2];e=c[f+32>>2]|0;if((e|0)!=0){h=e+5|0;a[h]=a[h]&-4}h=f+40|0;e=c[h>>2]|0;if((e|0)>0){C=f+8|0;K=0;G=e;while(1){e=c[C>>2]|0;do{if((c[e+(K<<4)+8>>2]|0)>3){D=c[e+(K<<4)>>2]|0;if((a[D+5|0]&3)==0){L=G;break}e8(b,D);L=c[h>>2]|0}else{L=G}}while(0);e=K+1|0;if((e|0)<(L|0)){K=e;G=L}else{break}}}L=f+36|0;G=c[L>>2]|0;if((G|0)>0){K=f+28|0;C=0;e=G;while(1){G=c[(c[K>>2]|0)+(C<<2)>>2]|0;if((G|0)==0){M=e}else{D=G+5|0;a[D]=a[D]&-4;M=c[L>>2]|0}D=C+1|0;if((D|0)<(M|0)){C=D;e=M}else{break}}}M=f+52|0;e=c[M>>2]|0;if((e|0)>0){C=f+16|0;K=0;D=e;while(1){G=c[(c[C>>2]|0)+(K<<2)>>2]|0;do{if((G|0)==0){N=D}else{if((a[G+5|0]&3)==0){N=D;break}e8(b,G);N=c[M>>2]|0}}while(0);G=K+1|0;if((G|0)<(N|0)){K=G;D=N}else{O=N;break}}}else{O=e}e=f+56|0;N=c[e>>2]|0;if((N|0)>0){D=f+24|0;K=0;b=N;while(1){C=c[(c[D>>2]|0)+(K*12|0)>>2]|0;if((C|0)==0){P=b}else{G=C+5|0;a[G]=a[G]&-4;P=c[e>>2]|0}G=K+1|0;if((G|0)<(P|0)){K=G;b=P}else{break}}Q=c[M>>2]|0;R=P}else{Q=O;R=N}z=(c[h>>2]<<4)+76+(R*12|0)+(Q+(c[f+44>>2]|0)+(c[f+48>>2]|0)+(c[L>>2]|0)<<2)|0;return z|0}else{z=0;return z|0}return 0}function fc(b){b=b|0;var d=0,e=0,f=0;d=0;do{e=c[744+(d<<2)>>2]|0;f=f_(b,e,j_(e|0)|0)|0;e=f+5|0;a[e]=a[e]|32;d=d+1|0;a[f+6|0]=d&255;}while((d|0)<21);return}function fd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;if((b|0)>=257){e=c[744+(b-257<<2)>>2]|0;i=d;return e|0}f=(b8(b|0)|0)==0;g=c[a+52>>2]|0;if(f){f=fy(g,6208,(h=i,i=i+8|0,c[h>>2]=b,h)|0)|0;i=h;e=f;i=d;return e|0}else{f=fy(g,6424,(h=i,i=i+8|0,c[h>>2]=b,h)|0)|0;i=h;e=f;i=d;return e|0}return 0}function fe(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;f=i;i=i+160|0;g=f|0;h=f+80|0;j=b+64|0;fz(h,(c[j>>2]|0)+16|0,80);k=b+52|0;l=b+4|0;m=c[l>>2]|0;n=fy(c[k>>2]|0,5960,(o=i,i=i+24|0,c[o>>2]=h,c[o+8>>2]=m,c[o+16>>2]=d,o)|0)|0;i=o;if((e|0)==0){p=c[k>>2]|0;eC(p,3);i=f;return}d=c[k>>2]|0;do{if((e-284|0)>>>0<3){m=b+60|0;h=c[m>>2]|0;q=h+4|0;r=c[q>>2]|0;s=h+8|0;t=c[s>>2]|0;if((r+1|0)>>>0>t>>>0){if(t>>>0>2147483645){u=g|0;fz(u,(c[j>>2]|0)+16|0,80);v=c[k>>2]|0;w=c[l>>2]|0;fy(v,5960,(o=i,i=i+24|0,c[o>>2]=u,c[o+8>>2]=w,c[o+16>>2]=5096,o)|0)|0;i=o;eC(c[k>>2]|0,3);x=c[s>>2]|0;y=c[k>>2]|0}else{x=t;y=d}t=x<<1;if((t|0)==-2){z=fv(y)|0;A=h|0}else{w=h|0;z=fu(y,c[w>>2]|0,x,t)|0;A=w}c[A>>2]=z;c[s>>2]=t;B=c[q>>2]|0;C=z}else{B=r;C=c[h>>2]|0}c[q>>2]=B+1;a[C+B|0]=0;D=c[c[m>>2]>>2]|0}else{if((e|0)>=257){D=c[744+(e-257<<2)>>2]|0;break}m=(b8(e|0)|0)==0;q=c[k>>2]|0;if(m){m=fy(q,6208,(o=i,i=i+8|0,c[o>>2]=e,o)|0)|0;i=o;D=m;break}else{m=fy(q,6424,(o=i,i=i+8|0,c[o>>2]=e,o)|0)|0;i=o;D=m;break}}}while(0);fy(d,5768,(o=i,i=i+16|0,c[o>>2]=n,c[o+8>>2]=D,o)|0)|0;i=o;p=c[k>>2]|0;eC(p,3);i=f;return}function ff(a,b){a=a|0;b=b|0;fe(a,b,c[a+16>>2]|0);return}function fg(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=c[a+52>>2]|0;f=f_(e,b,d)|0;d=gd(e,c[(c[a+48>>2]|0)+4>>2]|0,f)|0;a=d+8|0;if((c[a>>2]|0)!=0){return f|0}c[d>>2]=1;c[a>>2]=1;a=c[e+16>>2]|0;if((c[a+68>>2]|0)>>>0<(c[a+64>>2]|0)>>>0){return f|0}e1(e);return f|0}function fh(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0;a[e+68|0]=46;c[e+52>>2]=b;c[e+32>>2]=287;h=e+56|0;c[h>>2]=f;c[e+48>>2]=0;c[e+4>>2]=1;c[e+8>>2]=1;c[e+64>>2]=g;g=e+60|0;f=c[g>>2]|0;i=fu(b,c[f>>2]|0,c[f+8>>2]|0,32)|0;c[c[g>>2]>>2]=i;c[(c[g>>2]|0)+8>>2]=32;g=c[h>>2]|0;i=c[g>>2]|0;c[g>>2]=i-1;g=c[h>>2]|0;if((i|0)==0){j=gu(g)|0;k=e|0;c[k>>2]=j;return}else{i=g+4|0;g=c[i>>2]|0;c[i>>2]=g+1;j=d[g]|0;k=e|0;c[k>>2]=j;return}}function fi(a){a=a|0;var b=0,d=0,e=0;c[a+8>>2]=c[a+4>>2];b=a+32|0;d=b|0;if((c[d>>2]|0)==287){c[a+16>>2]=fj(a,a+24|0)|0;return}else{e=a+16|0;a=b;c[e>>2]=c[a>>2];c[e+4>>2]=c[a+4>>2];c[e+8>>2]=c[a+8>>2];c[e+12>>2]=c[a+12>>2];c[d>>2]=287;return}}function fj(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aN=0,aO=0,aP=0,aQ=0,aR=0,aS=0,aT=0,aU=0,aV=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0,a0=0,a1=0,a2=0,a3=0,a4=0,a5=0,a6=0,a7=0,a8=0,a9=0,ba=0,bb=0,bc=0,bd=0,be=0,bf=0,bg=0,bh=0,bi=0,bj=0,bk=0,bl=0,bm=0,bn=0,bo=0;f=i;i=i+960|0;g=f|0;h=f+80|0;j=f+160|0;k=f+240|0;l=f+320|0;m=f+400|0;n=f+480|0;o=f+560|0;p=f+640|0;q=f+720|0;r=f+800|0;s=f+880|0;t=b+60|0;c[(c[t>>2]|0)+4>>2]=0;u=b|0;v=b+56|0;L3380:while(1){w=c[u>>2]|0;L3382:while(1){switch(w|0){case 126:{x=2712;break L3380;break};case 62:{x=2704;break L3380;break};case 10:case 13:{x=2667;break L3382;break};case 91:{x=2684;break L3380;break};case 60:{x=2696;break L3380;break};case 45:{break L3382;break};case 34:case 39:{x=2720;break L3380;break};case 61:{break L3380;break};case 46:{x=2827;break L3380;break};case-1:{y=287;x=2903;break L3380;break};default:{}}if((aB(w|0)|0)==0){x=2873;break L3380}z=c[v>>2]|0;A=c[z>>2]|0;c[z>>2]=A-1;z=c[v>>2]|0;if((A|0)==0){B=gu(z)|0}else{A=z+4|0;z=c[A>>2]|0;c[A>>2]=z+1;B=d[z]|0}c[u>>2]=B;w=B}if((x|0)==2667){x=0;fl(b);continue}z=c[v>>2]|0;A=c[z>>2]|0;c[z>>2]=A-1;z=c[v>>2]|0;if((A|0)==0){C=gu(z)|0}else{A=z+4|0;z=c[A>>2]|0;c[A>>2]=z+1;C=d[z]|0}c[u>>2]=C;if((C|0)!=45){y=45;x=2904;break}z=c[v>>2]|0;A=c[z>>2]|0;c[z>>2]=A-1;z=c[v>>2]|0;if((A|0)==0){D=gu(z)|0}else{A=z+4|0;z=c[A>>2]|0;c[A>>2]=z+1;D=d[z]|0}c[u>>2]=D;do{if((D|0)==91){z=fm(b)|0;c[(c[t>>2]|0)+4>>2]=0;if((z|0)>-1){fn(b,0,z);c[(c[t>>2]|0)+4>>2]=0;continue L3380}else{E=c[u>>2]|0;break}}else{E=D}}while(0);while(1){if((E|0)==10|(E|0)==13|(E|0)==(-1|0)){continue L3380}z=c[v>>2]|0;A=c[z>>2]|0;c[z>>2]=A-1;z=c[v>>2]|0;if((A|0)==0){F=gu(z)|0}else{A=z+4|0;z=c[A>>2]|0;c[A>>2]=z+1;F=d[z]|0}c[u>>2]=F;E=F}}do{if((x|0)==2712){F=c[v>>2]|0;E=c[F>>2]|0;c[F>>2]=E-1;F=c[v>>2]|0;if((E|0)==0){G=gu(F)|0}else{E=F+4|0;F=c[E>>2]|0;c[E>>2]=F+1;G=d[F]|0}c[u>>2]=G;if((G|0)!=61){y=126;i=f;return y|0}F=c[v>>2]|0;E=c[F>>2]|0;c[F>>2]=E-1;F=c[v>>2]|0;if((E|0)==0){H=gu(F)|0}else{E=F+4|0;F=c[E>>2]|0;c[E>>2]=F+1;H=d[F]|0}c[u>>2]=H;y=283;i=f;return y|0}else if((x|0)==2704){F=c[v>>2]|0;E=c[F>>2]|0;c[F>>2]=E-1;F=c[v>>2]|0;if((E|0)==0){I=gu(F)|0}else{E=F+4|0;F=c[E>>2]|0;c[E>>2]=F+1;I=d[F]|0}c[u>>2]=I;if((I|0)!=61){y=62;i=f;return y|0}F=c[v>>2]|0;E=c[F>>2]|0;c[F>>2]=E-1;F=c[v>>2]|0;if((E|0)==0){J=gu(F)|0}else{E=F+4|0;F=c[E>>2]|0;c[E>>2]=F+1;J=d[F]|0}c[u>>2]=J;y=281;i=f;return y|0}else if((x|0)==2684){F=fm(b)|0;if((F|0)>-1){fn(b,e,F);y=286;i=f;return y|0}if((F|0)==-1){y=91;i=f;return y|0}else{fe(b,5680,286);break}}else if((x|0)==2696){F=c[v>>2]|0;E=c[F>>2]|0;c[F>>2]=E-1;F=c[v>>2]|0;if((E|0)==0){K=gu(F)|0}else{E=F+4|0;F=c[E>>2]|0;c[E>>2]=F+1;K=d[F]|0}c[u>>2]=K;if((K|0)!=61){y=60;i=f;return y|0}F=c[v>>2]|0;E=c[F>>2]|0;c[F>>2]=E-1;F=c[v>>2]|0;if((E|0)==0){L=gu(F)|0}else{E=F+4|0;F=c[E>>2]|0;c[E>>2]=F+1;L=d[F]|0}c[u>>2]=L;y=282;i=f;return y|0}else if((x|0)==2720){F=c[t>>2]|0;E=F+4|0;D=c[E>>2]|0;C=F+8|0;B=c[C>>2]|0;if((D+1|0)>>>0>B>>>0){if(B>>>0>2147483645){z=r|0;fz(z,(c[b+64>>2]|0)+16|0,80);A=b+52|0;M=c[A>>2]|0;N=c[b+4>>2]|0;fy(M,5960,(O=i,i=i+24|0,c[O>>2]=z,c[O+8>>2]=N,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[A>>2]|0,3);P=c[C>>2]|0;Q=A}else{P=B;Q=b+52|0}B=P<<1;A=c[Q>>2]|0;if((B|0)==-2){R=fv(A)|0;S=F|0}else{N=F|0;R=fu(A,c[N>>2]|0,P,B)|0;S=N}c[S>>2]=R;c[C>>2]=B;T=c[E>>2]|0;U=R}else{T=D;U=c[F>>2]|0}F=w&255;c[E>>2]=T+1;a[U+T|0]=F;E=c[v>>2]|0;D=c[E>>2]|0;c[E>>2]=D-1;E=c[v>>2]|0;if((D|0)==0){V=gu(E)|0}else{D=E+4|0;E=c[D>>2]|0;c[D>>2]=E+1;V=d[E]|0}c[u>>2]=V;if((V|0)==(w|0)){W=V&255}else{E=m|0;D=b+64|0;B=b+52|0;C=b+4|0;N=s|0;A=p|0;z=o|0;M=n|0;X=q|0;Y=V;while(1){L3483:do{if((Y|0)==(-1|0)){fz(N,(c[D>>2]|0)+16|0,80);Z=c[C>>2]|0;_=fy(c[B>>2]|0,5960,(O=i,i=i+24|0,c[O>>2]=N,c[O+8>>2]=Z,c[O+16>>2]=4984,O)|0)|0;i=O;Z=c[B>>2]|0;fy(Z,5768,(O=i,i=i+16|0,c[O>>2]=_,c[O+8>>2]=6584,O)|0)|0;i=O;eC(c[B>>2]|0,3);x=2734}else if((Y|0)==10|(Y|0)==13){fe(b,4984,286);x=2734}else if((Y|0)==92){_=c[v>>2]|0;Z=c[_>>2]|0;c[_>>2]=Z-1;_=c[v>>2]|0;if((Z|0)==0){$=gu(_)|0}else{Z=_+4|0;_=c[Z>>2]|0;c[Z>>2]=_+1;$=d[_]|0}c[u>>2]=$;switch($|0){case 98:{aa=8;break};case 102:{aa=12;break};case 110:{aa=10;break};case 114:{aa=13;break};case 116:{aa=9;break};case-1:{ab=-1;break L3483;break};case 118:{aa=11;break};case 10:case 13:{_=c[t>>2]|0;Z=_+4|0;ac=c[Z>>2]|0;ad=_+8|0;ae=c[ad>>2]|0;if((ac+1|0)>>>0>ae>>>0){if(ae>>>0>2147483645){fz(X,(c[D>>2]|0)+16|0,80);af=c[B>>2]|0;ag=c[C>>2]|0;fy(af,5960,(O=i,i=i+24|0,c[O>>2]=X,c[O+8>>2]=ag,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[B>>2]|0,3);ah=c[ad>>2]|0}else{ah=ae}ae=ah<<1;ag=c[B>>2]|0;if((ae|0)==-2){ai=fv(ag)|0;aj=_|0}else{af=_|0;ai=fu(ag,c[af>>2]|0,ah,ae)|0;aj=af}c[aj>>2]=ai;c[ad>>2]=ae;ak=c[Z>>2]|0;al=ai}else{ak=ac;al=c[_>>2]|0}c[Z>>2]=ak+1;a[al+ak|0]=10;fl(b);x=2734;break L3483;break};case 97:{aa=7;break};default:{if(($-48|0)>>>0<10){am=0;an=0;ao=$}else{Z=c[t>>2]|0;_=Z+4|0;ac=c[_>>2]|0;ae=Z+8|0;ad=c[ae>>2]|0;if((ac+1|0)>>>0>ad>>>0){if(ad>>>0>2147483645){fz(A,(c[D>>2]|0)+16|0,80);af=c[B>>2]|0;ag=c[C>>2]|0;fy(af,5960,(O=i,i=i+24|0,c[O>>2]=A,c[O+8>>2]=ag,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[B>>2]|0,3);ap=c[ae>>2]|0}else{ap=ad}ad=ap<<1;ag=c[B>>2]|0;if((ad|0)==-2){aq=fv(ag)|0;ar=Z|0}else{af=Z|0;aq=fu(ag,c[af>>2]|0,ap,ad)|0;ar=af}c[ar>>2]=aq;c[ae>>2]=ad;as=c[_>>2]|0;at=aq}else{as=ac;at=c[Z>>2]|0}c[_>>2]=as+1;a[at+as|0]=$&255;_=c[v>>2]|0;Z=c[_>>2]|0;c[_>>2]=Z-1;_=c[v>>2]|0;if((Z|0)==0){au=gu(_)|0}else{Z=_+4|0;_=c[Z>>2]|0;c[Z>>2]=_+1;au=d[_]|0}c[u>>2]=au;ab=au;break L3483}while(1){av=ao-48+(an*10|0)|0;_=c[v>>2]|0;Z=c[_>>2]|0;c[_>>2]=Z-1;_=c[v>>2]|0;if((Z|0)==0){aw=gu(_)|0}else{Z=_+4|0;_=c[Z>>2]|0;c[Z>>2]=_+1;aw=d[_]|0}c[u>>2]=aw;_=am+1|0;if((_|0)>=3){break}if((aw-48|0)>>>0<10){am=_;an=av;ao=aw}else{break}}if((av|0)>255){fe(b,4848,286)}_=c[t>>2]|0;Z=_+4|0;ac=c[Z>>2]|0;ad=_+8|0;ae=c[ad>>2]|0;if((ac+1|0)>>>0>ae>>>0){if(ae>>>0>2147483645){fz(z,(c[D>>2]|0)+16|0,80);af=c[B>>2]|0;ag=c[C>>2]|0;fy(af,5960,(O=i,i=i+24|0,c[O>>2]=z,c[O+8>>2]=ag,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[B>>2]|0,3);ax=c[ad>>2]|0}else{ax=ae}ae=ax<<1;ag=c[B>>2]|0;if((ae|0)==-2){ay=fv(ag)|0;az=_|0}else{af=_|0;ay=fu(ag,c[af>>2]|0,ax,ae)|0;az=af}c[az>>2]=ay;c[ad>>2]=ae;aA=c[Z>>2]|0;aC=ay}else{aA=ac;aC=c[_>>2]|0}c[Z>>2]=aA+1;a[aC+aA|0]=av&255;x=2734;break L3483}}Z=c[t>>2]|0;_=Z+4|0;ac=c[_>>2]|0;ae=Z+8|0;ad=c[ae>>2]|0;if((ac+1|0)>>>0>ad>>>0){if(ad>>>0>2147483645){fz(M,(c[D>>2]|0)+16|0,80);af=c[B>>2]|0;ag=c[C>>2]|0;fy(af,5960,(O=i,i=i+24|0,c[O>>2]=M,c[O+8>>2]=ag,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[B>>2]|0,3);aD=c[ae>>2]|0}else{aD=ad}ad=aD<<1;ag=c[B>>2]|0;if((ad|0)==-2){aE=fv(ag)|0;aF=Z|0}else{af=Z|0;aE=fu(ag,c[af>>2]|0,aD,ad)|0;aF=af}c[aF>>2]=aE;c[ae>>2]=ad;aG=c[_>>2]|0;aH=aE}else{aG=ac;aH=c[Z>>2]|0}c[_>>2]=aG+1;a[aH+aG|0]=aa;_=c[v>>2]|0;Z=c[_>>2]|0;c[_>>2]=Z-1;_=c[v>>2]|0;if((Z|0)==0){aI=gu(_)|0}else{Z=_+4|0;_=c[Z>>2]|0;c[Z>>2]=_+1;aI=d[_]|0}c[u>>2]=aI;ab=aI}else{_=c[t>>2]|0;Z=_+4|0;ac=c[Z>>2]|0;ad=_+8|0;ae=c[ad>>2]|0;if((ac+1|0)>>>0>ae>>>0){if(ae>>>0>2147483645){fz(E,(c[D>>2]|0)+16|0,80);af=c[B>>2]|0;ag=c[C>>2]|0;fy(af,5960,(O=i,i=i+24|0,c[O>>2]=E,c[O+8>>2]=ag,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[B>>2]|0,3);aJ=c[ad>>2]|0}else{aJ=ae}ae=aJ<<1;ag=c[B>>2]|0;if((ae|0)==-2){aK=fv(ag)|0;aL=_|0}else{af=_|0;aK=fu(ag,c[af>>2]|0,aJ,ae)|0;aL=af}c[aL>>2]=aK;c[ad>>2]=ae;aN=c[Z>>2]|0;aO=aK}else{aN=ac;aO=c[_>>2]|0}c[Z>>2]=aN+1;a[aO+aN|0]=Y&255;Z=c[v>>2]|0;_=c[Z>>2]|0;c[Z>>2]=_-1;Z=c[v>>2]|0;if((_|0)==0){aP=gu(Z)|0}else{_=Z+4|0;Z=c[_>>2]|0;c[_>>2]=Z+1;aP=d[Z]|0}c[u>>2]=aP;ab=aP}}while(0);if((x|0)==2734){x=0;ab=c[u>>2]|0}if((ab|0)==(w|0)){W=F;break}else{Y=ab}}}Y=c[t>>2]|0;F=Y+4|0;B=c[F>>2]|0;E=Y+8|0;C=c[E>>2]|0;if((B+1|0)>>>0>C>>>0){if(C>>>0>2147483645){D=l|0;fz(D,(c[b+64>>2]|0)+16|0,80);M=b+52|0;z=c[M>>2]|0;A=c[b+4>>2]|0;fy(z,5960,(O=i,i=i+24|0,c[O>>2]=D,c[O+8>>2]=A,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[M>>2]|0,3);aQ=c[E>>2]|0;aR=M}else{aQ=C;aR=b+52|0}C=aQ<<1;M=c[aR>>2]|0;if((C|0)==-2){aS=fv(M)|0;aT=Y|0}else{A=Y|0;aS=fu(M,c[A>>2]|0,aQ,C)|0;aT=A}c[aT>>2]=aS;c[E>>2]=C;aU=c[F>>2]|0;aV=aS}else{aU=B;aV=c[Y>>2]|0}c[F>>2]=aU+1;a[aV+aU|0]=W;F=c[v>>2]|0;Y=c[F>>2]|0;c[F>>2]=Y-1;F=c[v>>2]|0;if((Y|0)==0){aW=gu(F)|0}else{Y=F+4|0;F=c[Y>>2]|0;c[Y>>2]=F+1;aW=d[F]|0}c[u>>2]=aW;F=c[t>>2]|0;Y=c[b+52>>2]|0;B=f_(Y,(c[F>>2]|0)+1|0,(c[F+4>>2]|0)-2|0)|0;F=gd(Y,c[(c[b+48>>2]|0)+4>>2]|0,B)|0;C=F+8|0;do{if((c[C>>2]|0)==0){c[F>>2]=1;c[C>>2]=1;E=c[Y+16>>2]|0;if((c[E+68>>2]|0)>>>0<(c[E+64>>2]|0)>>>0){break}e1(Y)}}while(0);c[e>>2]=B;y=286;i=f;return y|0}else if((x|0)==2827){Y=c[t>>2]|0;C=Y+4|0;F=c[C>>2]|0;E=Y+8|0;A=c[E>>2]|0;if((F+1|0)>>>0>A>>>0){if(A>>>0>2147483645){M=k|0;fz(M,(c[b+64>>2]|0)+16|0,80);D=b+52|0;z=c[D>>2]|0;X=c[b+4>>2]|0;fy(z,5960,(O=i,i=i+24|0,c[O>>2]=M,c[O+8>>2]=X,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[D>>2]|0,3);aX=c[E>>2]|0;aY=D}else{aX=A;aY=b+52|0}A=aX<<1;D=c[aY>>2]|0;if((A|0)==-2){aZ=fv(D)|0;a_=Y|0}else{X=Y|0;aZ=fu(D,c[X>>2]|0,aX,A)|0;a_=X}c[a_>>2]=aZ;c[E>>2]=A;a$=c[C>>2]|0;a0=aZ}else{a$=F;a0=c[Y>>2]|0}c[C>>2]=a$+1;a[a0+a$|0]=46;C=c[v>>2]|0;Y=c[C>>2]|0;c[C>>2]=Y-1;C=c[v>>2]|0;if((Y|0)==0){a1=gu(C)|0}else{Y=C+4|0;C=c[Y>>2]|0;c[Y>>2]=C+1;a1=d[C]|0}c[u>>2]=a1;if((aM(5600,a1|0,2)|0)==0){if((a1-48|0)>>>0>=10){y=46;i=f;return y|0}fs(b,e);y=284;i=f;return y|0}C=c[t>>2]|0;Y=C+4|0;F=c[Y>>2]|0;A=C+8|0;E=c[A>>2]|0;if((F+1|0)>>>0>E>>>0){if(E>>>0>2147483645){X=h|0;fz(X,(c[b+64>>2]|0)+16|0,80);D=b+52|0;M=c[D>>2]|0;z=c[b+4>>2]|0;fy(M,5960,(O=i,i=i+24|0,c[O>>2]=X,c[O+8>>2]=z,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[D>>2]|0,3);a2=c[A>>2]|0;a3=D}else{a2=E;a3=b+52|0}E=a2<<1;D=c[a3>>2]|0;if((E|0)==-2){a4=fv(D)|0;a5=C|0}else{z=C|0;a4=fu(D,c[z>>2]|0,a2,E)|0;a5=z}c[a5>>2]=a4;c[A>>2]=E;a6=c[Y>>2]|0;a7=a4}else{a6=F;a7=c[C>>2]|0}c[Y>>2]=a6+1;a[a7+a6|0]=a1&255;Y=c[v>>2]|0;C=c[Y>>2]|0;c[Y>>2]=C-1;Y=c[v>>2]|0;if((C|0)==0){a8=gu(Y)|0}else{C=Y+4|0;Y=c[C>>2]|0;c[C>>2]=Y+1;a8=d[Y]|0}c[u>>2]=a8;if((aM(5600,a8|0,2)|0)==0){y=278;i=f;return y|0}Y=c[t>>2]|0;C=Y+4|0;F=c[C>>2]|0;E=Y+8|0;A=c[E>>2]|0;if((F+1|0)>>>0>A>>>0){if(A>>>0>2147483645){z=g|0;fz(z,(c[b+64>>2]|0)+16|0,80);D=b+52|0;X=c[D>>2]|0;M=c[b+4>>2]|0;fy(X,5960,(O=i,i=i+24|0,c[O>>2]=z,c[O+8>>2]=M,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[D>>2]|0,3);a9=c[E>>2]|0;ba=D}else{a9=A;ba=b+52|0}A=a9<<1;D=c[ba>>2]|0;if((A|0)==-2){bb=fv(D)|0;bc=Y|0}else{M=Y|0;bb=fu(D,c[M>>2]|0,a9,A)|0;bc=M}c[bc>>2]=bb;c[E>>2]=A;bd=c[C>>2]|0;be=bb}else{bd=F;be=c[Y>>2]|0}c[C>>2]=bd+1;a[be+bd|0]=a8&255;C=c[v>>2]|0;Y=c[C>>2]|0;c[C>>2]=Y-1;C=c[v>>2]|0;if((Y|0)==0){bf=gu(C)|0}else{Y=C+4|0;C=c[Y>>2]|0;c[Y>>2]=C+1;bf=d[C]|0}c[u>>2]=bf;y=279;i=f;return y|0}else if((x|0)==2873){C=c[u>>2]|0;if((C-48|0)>>>0<10){fs(b,e);y=284;i=f;return y|0}do{if((bt(C|0)|0)==0){Y=c[u>>2]|0;if((Y|0)==95){break}F=c[v>>2]|0;A=c[F>>2]|0;c[F>>2]=A-1;F=c[v>>2]|0;if((A|0)==0){bg=gu(F)|0}else{A=F+4|0;F=c[A>>2]|0;c[A>>2]=F+1;bg=d[F]|0}c[u>>2]=bg;y=Y;i=f;return y|0}}while(0);C=j|0;B=b+64|0;Y=b+52|0;F=b+4|0;while(1){A=c[u>>2]|0;E=c[t>>2]|0;M=E+4|0;D=c[M>>2]|0;z=E+8|0;X=c[z>>2]|0;if((D+1|0)>>>0>X>>>0){if(X>>>0>2147483645){fz(C,(c[B>>2]|0)+16|0,80);N=c[Y>>2]|0;Z=c[F>>2]|0;fy(N,5960,(O=i,i=i+24|0,c[O>>2]=C,c[O+8>>2]=Z,c[O+16>>2]=5096,O)|0)|0;i=O;eC(c[Y>>2]|0,3);bh=c[z>>2]|0}else{bh=X}X=bh<<1;Z=c[Y>>2]|0;if((X|0)==-2){bi=fv(Z)|0;bj=E|0}else{N=E|0;bi=fu(Z,c[N>>2]|0,bh,X)|0;bj=N}c[bj>>2]=bi;c[z>>2]=X;bk=c[M>>2]|0;bl=bi}else{bk=D;bl=c[E>>2]|0}c[M>>2]=bk+1;a[bl+bk|0]=A&255;A=c[v>>2]|0;M=c[A>>2]|0;c[A>>2]=M-1;A=c[v>>2]|0;if((M|0)==0){bm=gu(A)|0}else{M=A+4|0;A=c[M>>2]|0;c[M>>2]=A+1;bm=d[A]|0}c[u>>2]=bm;if((bq(bm|0)|0)!=0){continue}if((c[u>>2]|0)!=95){break}}C=c[t>>2]|0;F=c[Y>>2]|0;B=f_(F,c[C>>2]|0,c[C+4>>2]|0)|0;C=gd(F,c[(c[b+48>>2]|0)+4>>2]|0,B)|0;A=C+8|0;do{if((c[A>>2]|0)==0){c[C>>2]=1;c[A>>2]=1;M=c[F+16>>2]|0;if((c[M+68>>2]|0)>>>0<(c[M+64>>2]|0)>>>0){break}e1(F)}}while(0);F=a[B+6|0]|0;if(F<<24>>24==0){c[e>>2]=B;y=285;i=f;return y|0}else{y=F&255|256;i=f;return y|0}}else if((x|0)==2903){i=f;return y|0}else if((x|0)==2904){i=f;return y|0}}while(0);x=c[v>>2]|0;e=c[x>>2]|0;c[x>>2]=e-1;x=c[v>>2]|0;if((e|0)==0){bn=gu(x)|0}else{e=x+4|0;x=c[e>>2]|0;c[e>>2]=x+1;bn=d[x]|0}c[u>>2]=bn;if((bn|0)!=61){y=61;i=f;return y|0}bn=c[v>>2]|0;x=c[bn>>2]|0;c[bn>>2]=x-1;bn=c[v>>2]|0;if((x|0)==0){bo=gu(bn)|0}else{x=bn+4|0;bn=c[x>>2]|0;c[x>>2]=bn+1;bo=d[bn]|0}c[u>>2]=bo;y=280;i=f;return y|0}function fk(a){a=a|0;c[a+32>>2]=fj(a,a+40|0)|0;return}function fl(a){a=a|0;var b=0,e=0,f=0,g=0,h=0,i=0,j=0;b=a|0;e=c[b>>2]|0;f=a+56|0;g=c[f>>2]|0;h=c[g>>2]|0;c[g>>2]=h-1;g=c[f>>2]|0;if((h|0)==0){i=gu(g)|0}else{h=g+4|0;g=c[h>>2]|0;c[h>>2]=g+1;i=d[g]|0}c[b>>2]=i;do{if((i|0)==10|(i|0)==13){if((i|0)==(e|0)){break}g=c[f>>2]|0;h=c[g>>2]|0;c[g>>2]=h-1;g=c[f>>2]|0;if((h|0)==0){j=gu(g)|0}else{h=g+4|0;g=c[h>>2]|0;c[h>>2]=g+1;j=d[g]|0}c[b>>2]=j}}while(0);j=a+4|0;b=(c[j>>2]|0)+1|0;c[j>>2]=b;if((b|0)<=2147483644){return}fe(a,4344,c[a+16>>2]|0);return}function fm(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;e=i;i=i+160|0;f=e|0;g=e+80|0;h=b|0;j=c[h>>2]|0;k=b+60|0;l=c[k>>2]|0;m=l+4|0;n=c[m>>2]|0;o=l+8|0;p=c[o>>2]|0;if((n+1|0)>>>0>p>>>0){if(p>>>0>2147483645){q=g|0;fz(q,(c[b+64>>2]|0)+16|0,80);g=b+52|0;r=c[g>>2]|0;s=c[b+4>>2]|0;fy(r,5960,(t=i,i=i+24|0,c[t>>2]=q,c[t+8>>2]=s,c[t+16>>2]=5096,t)|0)|0;i=t;eC(c[g>>2]|0,3);u=c[o>>2]|0;v=g}else{u=p;v=b+52|0}p=u<<1;g=c[v>>2]|0;if((p|0)==-2){w=fv(g)|0;x=l|0}else{v=l|0;w=fu(g,c[v>>2]|0,u,p)|0;x=v}c[x>>2]=w;c[o>>2]=p;y=c[m>>2]|0;z=w}else{y=n;z=c[l>>2]|0}c[m>>2]=y+1;a[z+y|0]=j&255;y=b+56|0;z=c[y>>2]|0;m=c[z>>2]|0;c[z>>2]=m-1;z=c[y>>2]|0;if((m|0)==0){A=gu(z)|0}else{m=z+4|0;z=c[m>>2]|0;c[m>>2]=z+1;A=d[z]|0}c[h>>2]=A;if((A|0)!=61){B=A;C=0;D=(B|0)!=(j|0);E=D<<31>>31;F=E^C;i=e;return F|0}A=f|0;f=b+64|0;z=b+52|0;m=b+4|0;b=61;l=0;while(1){n=c[k>>2]|0;w=n+4|0;p=c[w>>2]|0;o=n+8|0;x=c[o>>2]|0;if((p+1|0)>>>0>x>>>0){if(x>>>0>2147483645){fz(A,(c[f>>2]|0)+16|0,80);v=c[z>>2]|0;u=c[m>>2]|0;fy(v,5960,(t=i,i=i+24|0,c[t>>2]=A,c[t+8>>2]=u,c[t+16>>2]=5096,t)|0)|0;i=t;eC(c[z>>2]|0,3);G=c[o>>2]|0}else{G=x}x=G<<1;u=c[z>>2]|0;if((x|0)==-2){H=fv(u)|0;I=n|0}else{v=n|0;H=fu(u,c[v>>2]|0,G,x)|0;I=v}c[I>>2]=H;c[o>>2]=x;J=c[w>>2]|0;K=H}else{J=p;K=c[n>>2]|0}c[w>>2]=J+1;a[K+J|0]=b;w=c[y>>2]|0;n=c[w>>2]|0;c[w>>2]=n-1;w=c[y>>2]|0;if((n|0)==0){L=gu(w)|0}else{n=w+4|0;w=c[n>>2]|0;c[n>>2]=w+1;L=d[w]|0}c[h>>2]=L;w=l+1|0;if((L|0)==61){b=L&255;l=w}else{B=L;C=w;break}}D=(B|0)!=(j|0);E=D<<31>>31;F=E^C;i=e;return F|0}function fn(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0;g=i;i=i+480|0;h=g|0;j=g+80|0;k=g+160|0;l=g+240|0;m=g+320|0;n=g+400|0;o=b|0;p=c[o>>2]|0;q=b+60|0;r=c[q>>2]|0;s=r+4|0;t=c[s>>2]|0;u=r+8|0;v=c[u>>2]|0;if((t+1|0)>>>0>v>>>0){if(v>>>0>2147483645){w=m|0;fz(w,(c[b+64>>2]|0)+16|0,80);m=b+52|0;x=c[m>>2]|0;y=c[b+4>>2]|0;fy(x,5960,(z=i,i=i+24|0,c[z>>2]=w,c[z+8>>2]=y,c[z+16>>2]=5096,z)|0)|0;i=z;eC(c[m>>2]|0,3);A=c[u>>2]|0;B=m}else{A=v;B=b+52|0}v=A<<1;m=c[B>>2]|0;if((v|0)==-2){C=fv(m)|0;D=r|0}else{B=r|0;C=fu(m,c[B>>2]|0,A,v)|0;D=B}c[D>>2]=C;c[u>>2]=v;E=c[s>>2]|0;F=C}else{E=t;F=c[r>>2]|0}c[s>>2]=E+1;a[F+E|0]=p&255;p=b+56|0;E=c[p>>2]|0;F=c[E>>2]|0;c[E>>2]=F-1;E=c[p>>2]|0;if((F|0)==0){G=gu(E)|0}else{F=E+4|0;E=c[F>>2]|0;c[F>>2]=E+1;G=d[E]|0}c[o>>2]=G;if((G|0)==10|(G|0)==13){fl(b);H=2981}else{I=G}L3799:while(1){if((H|0)==2981){H=0;I=c[o>>2]|0}J=(e|0)==0;G=h|0;K=b+64|0;L=b+52|0;M=b+4|0;E=l|0;F=(f|0)==0;s=I;L3803:while(1){L3805:do{if(J){r=s;while(1){switch(r|0){case 10:case 13:{H=3018;break L3803;break};case 93:{H=3005;break L3803;break};case 91:{break L3805;break};case-1:{H=2990;break L3803;break};default:{}}t=c[p>>2]|0;C=c[t>>2]|0;c[t>>2]=C-1;t=c[p>>2]|0;if((C|0)==0){N=gu(t)|0}else{C=t+4|0;t=c[C>>2]|0;c[C>>2]=t+1;N=d[t]|0}c[o>>2]=N;r=N}}else{r=s;while(1){switch(r|0){case 10:case 13:{H=3018;break L3803;break};case 93:{H=3005;break L3803;break};case 91:{break L3805;break};case-1:{H=2990;break L3803;break};default:{}}t=c[q>>2]|0;C=t+4|0;v=c[C>>2]|0;u=t+8|0;D=c[u>>2]|0;if((v+1|0)>>>0>D>>>0){if(D>>>0>2147483645){fz(G,(c[K>>2]|0)+16|0,80);B=c[L>>2]|0;A=c[M>>2]|0;fy(B,5960,(z=i,i=i+24|0,c[z>>2]=G,c[z+8>>2]=A,c[z+16>>2]=5096,z)|0)|0;i=z;eC(c[L>>2]|0,3);O=c[u>>2]|0}else{O=D}D=O<<1;A=c[L>>2]|0;if((D|0)==-2){P=fv(A)|0;Q=t|0}else{B=t|0;P=fu(A,c[B>>2]|0,O,D)|0;Q=B}c[Q>>2]=P;c[u>>2]=D;R=c[C>>2]|0;S=P}else{R=v;S=c[t>>2]|0}c[C>>2]=R+1;a[S+R|0]=r&255;C=c[p>>2]|0;t=c[C>>2]|0;c[C>>2]=t-1;C=c[p>>2]|0;if((t|0)==0){T=gu(C)|0}else{t=C+4|0;C=c[t>>2]|0;c[t>>2]=C+1;T=d[C]|0}c[o>>2]=T;r=T}}}while(0);if((fm(b)|0)!=(f|0)){H=2981;continue L3799}r=c[o>>2]|0;C=c[q>>2]|0;t=C+4|0;v=c[t>>2]|0;D=C+8|0;u=c[D>>2]|0;if((v+1|0)>>>0>u>>>0){if(u>>>0>2147483645){fz(E,(c[K>>2]|0)+16|0,80);B=c[L>>2]|0;A=c[M>>2]|0;fy(B,5960,(z=i,i=i+24|0,c[z>>2]=E,c[z+8>>2]=A,c[z+16>>2]=5096,z)|0)|0;i=z;eC(c[L>>2]|0,3);U=c[D>>2]|0}else{U=u}u=U<<1;A=c[L>>2]|0;if((u|0)==-2){V=fv(A)|0;W=C|0}else{B=C|0;V=fu(A,c[B>>2]|0,U,u)|0;W=B}c[W>>2]=V;c[D>>2]=u;X=c[t>>2]|0;Y=V}else{X=v;Y=c[C>>2]|0}c[t>>2]=X+1;a[Y+X|0]=r&255;r=c[p>>2]|0;t=c[r>>2]|0;c[r>>2]=t-1;r=c[p>>2]|0;if((t|0)==0){Z=gu(r)|0}else{t=r+4|0;r=c[t>>2]|0;c[t>>2]=r+1;Z=d[r]|0}c[o>>2]=Z;if(F){H=3004;break}else{s=Z}}if((H|0)==3018){H=0;s=c[q>>2]|0;F=s+4|0;E=c[F>>2]|0;G=s+8|0;r=c[G>>2]|0;if((E+1|0)>>>0>r>>>0){if(r>>>0>2147483645){t=j|0;fz(t,(c[K>>2]|0)+16|0,80);C=c[L>>2]|0;v=c[M>>2]|0;fy(C,5960,(z=i,i=i+24|0,c[z>>2]=t,c[z+8>>2]=v,c[z+16>>2]=5096,z)|0)|0;i=z;eC(c[L>>2]|0,3);_=c[G>>2]|0}else{_=r}r=_<<1;v=c[L>>2]|0;if((r|0)==-2){$=fv(v)|0;aa=s|0}else{t=s|0;$=fu(v,c[t>>2]|0,_,r)|0;aa=t}c[aa>>2]=$;c[G>>2]=r;ab=c[F>>2]|0;ac=$}else{ab=E;ac=c[s>>2]|0}c[F>>2]=ab+1;a[ac+ab|0]=10;fl(b);if(!J){H=2981;continue}c[(c[q>>2]|0)+4>>2]=0;H=2981;continue}else if((H|0)==3004){H=0;fe(b,4472,91);H=2981;continue}else if((H|0)==3005){H=0;if((fm(b)|0)==(f|0)){break}else{H=2981;continue}}else if((H|0)==2990){H=0;F=n|0;fz(F,(c[K>>2]|0)+16|0,80);s=c[M>>2]|0;E=fy(c[L>>2]|0,5960,(z=i,i=i+24|0,c[z>>2]=F,c[z+8>>2]=s,c[z+16>>2]=(e|0)!=0?4664:4560,z)|0)|0;i=z;fy(c[L>>2]|0,5768,(z=i,i=i+16|0,c[z>>2]=E,c[z+8>>2]=6584,z)|0)|0;i=z;eC(c[L>>2]|0,3);H=2981;continue}}H=c[o>>2]|0;n=c[q>>2]|0;ab=n+4|0;ac=c[ab>>2]|0;$=n+8|0;aa=c[$>>2]|0;if((ac+1|0)>>>0>aa>>>0){if(aa>>>0>2147483645){_=k|0;fz(_,(c[K>>2]|0)+16|0,80);K=c[L>>2]|0;k=c[M>>2]|0;fy(K,5960,(z=i,i=i+24|0,c[z>>2]=_,c[z+8>>2]=k,c[z+16>>2]=5096,z)|0)|0;i=z;eC(c[L>>2]|0,3);ad=c[$>>2]|0}else{ad=aa}aa=ad<<1;z=c[L>>2]|0;if((aa|0)==-2){ae=fv(z)|0;af=n|0}else{k=n|0;ae=fu(z,c[k>>2]|0,ad,aa)|0;af=k}c[af>>2]=ae;c[$>>2]=aa;ag=c[ab>>2]|0;ah=ae}else{ag=ac;ah=c[n>>2]|0}c[ab>>2]=ag+1;a[ah+ag|0]=H&255;H=c[p>>2]|0;ag=c[H>>2]|0;c[H>>2]=ag-1;H=c[p>>2]|0;if((ag|0)==0){ai=gu(H)|0}else{ag=H+4|0;H=c[ag>>2]|0;c[ag>>2]=H+1;ai=d[H]|0}c[o>>2]=ai;if(J){i=g;return}J=c[q>>2]|0;q=f+2|0;f=c[L>>2]|0;L=f_(f,(c[J>>2]|0)+q|0,(c[J+4>>2]|0)-(q<<1)|0)|0;q=gd(f,c[(c[b+48>>2]|0)+4>>2]|0,L)|0;b=q+8|0;do{if((c[b>>2]|0)==0){c[q>>2]=1;c[b>>2]=1;J=c[f+16>>2]|0;if((c[J+68>>2]|0)>>>0<(c[J+64>>2]|0)>>>0){break}e1(f)}}while(0);c[e>>2]=L;i=g;return}function fo(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;if(a>>>0>15){b=a;c=1;do{d=b+1|0;b=d>>>1;c=c+1|0;}while(d>>>0>31);e=b;f=c<<3}else{e=a;f=8}if(e>>>0<8){g=e;return g|0}g=f|e-8;return g|0}function fp(a){a=a|0;var b=0,c=0;b=a>>>3&31;if((b|0)==0){c=a;return c|0}c=(a&7|8)<<b-1;return c|0}function fq(a){a=a|0;var b=0,c=0,e=0,f=0,g=0,h=0;if(a>>>0>255){b=a;c=-1;while(1){e=c+8|0;f=b>>>8;if(b>>>0>65535){b=f;c=e}else{g=f;h=e;break}}}else{g=a;h=-1}return(d[1048+g|0]|0)+h|0}function fr(a,b){a=a|0;b=b|0;var d=0,e=0;d=c[a+8>>2]|0;if((d|0)!=(c[b+8>>2]|0)){e=0;return e|0}if((d|0)==1){e=(c[a>>2]|0)==(c[b>>2]|0)|0;return e|0}else if((d|0)==2){e=(c[a>>2]|0)==(c[b>>2]|0)|0;return e|0}else if((d|0)==0){e=1;return e|0}else if((d|0)==3){e=+h[a>>3]==+h[b>>3]|0;return e|0}else{e=(c[a>>2]|0)==(c[b>>2]|0)|0;return e|0}return 0}function fs(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0;f=i;i=i+400|0;g=f|0;h=f+80|0;j=f+160|0;k=f+240|0;l=b|0;m=b+60|0;n=f+320|0;o=b+64|0;p=b+52|0;q=b+4|0;r=b+56|0;s=c[l>>2]&255;while(1){t=c[m>>2]|0;u=t+4|0;v=c[u>>2]|0;w=t+8|0;x=c[w>>2]|0;if((v+1|0)>>>0>x>>>0){if(x>>>0>2147483645){fz(n,(c[o>>2]|0)+16|0,80);y=c[p>>2]|0;z=c[q>>2]|0;fy(y,5960,(A=i,i=i+24|0,c[A>>2]=n,c[A+8>>2]=z,c[A+16>>2]=5096,A)|0)|0;i=A;eC(c[p>>2]|0,3);B=c[w>>2]|0}else{B=x}x=B<<1;z=c[p>>2]|0;if((x|0)==-2){C=fv(z)|0;D=t|0}else{y=t|0;C=fu(z,c[y>>2]|0,B,x)|0;D=y}c[D>>2]=C;c[w>>2]=x;E=c[u>>2]|0;F=C}else{E=v;F=c[t>>2]|0}c[u>>2]=E+1;a[F+E|0]=s;u=c[r>>2]|0;t=c[u>>2]|0;c[u>>2]=t-1;u=c[r>>2]|0;if((t|0)==0){G=gu(u)|0}else{t=u+4|0;u=c[t>>2]|0;c[t>>2]=u+1;G=d[u]|0}c[l>>2]=G;if((G-48|0)>>>0<10){s=G&255;continue}if((G|0)==46){s=46}else{break}}do{if((aM(5344,G|0,3)|0)==0){H=G}else{s=c[m>>2]|0;E=s+4|0;F=c[E>>2]|0;C=s+8|0;D=c[C>>2]|0;if((F+1|0)>>>0>D>>>0){if(D>>>0>2147483645){B=h|0;fz(B,(c[o>>2]|0)+16|0,80);n=c[p>>2]|0;u=c[q>>2]|0;fy(n,5960,(A=i,i=i+24|0,c[A>>2]=B,c[A+8>>2]=u,c[A+16>>2]=5096,A)|0)|0;i=A;eC(c[p>>2]|0,3);I=c[C>>2]|0}else{I=D}D=I<<1;u=c[p>>2]|0;if((D|0)==-2){J=fv(u)|0;K=s|0}else{B=s|0;J=fu(u,c[B>>2]|0,I,D)|0;K=B}c[K>>2]=J;c[C>>2]=D;L=c[E>>2]|0;M=J}else{L=F;M=c[s>>2]|0}c[E>>2]=L+1;a[M+L|0]=G&255;E=c[r>>2]|0;s=c[E>>2]|0;c[E>>2]=s-1;E=c[r>>2]|0;if((s|0)==0){N=gu(E)|0}else{s=E+4|0;E=c[s>>2]|0;c[s>>2]=E+1;N=d[E]|0}c[l>>2]=N;if((aM(5336,N|0,3)|0)==0){H=N;break}E=c[m>>2]|0;s=E+4|0;F=c[s>>2]|0;D=E+8|0;C=c[D>>2]|0;if((F+1|0)>>>0>C>>>0){if(C>>>0>2147483645){B=g|0;fz(B,(c[o>>2]|0)+16|0,80);u=c[p>>2]|0;n=c[q>>2]|0;fy(u,5960,(A=i,i=i+24|0,c[A>>2]=B,c[A+8>>2]=n,c[A+16>>2]=5096,A)|0)|0;i=A;eC(c[p>>2]|0,3);O=c[D>>2]|0}else{O=C}C=O<<1;n=c[p>>2]|0;if((C|0)==-2){P=fv(n)|0;Q=E|0}else{B=E|0;P=fu(n,c[B>>2]|0,O,C)|0;Q=B}c[Q>>2]=P;c[D>>2]=C;R=c[s>>2]|0;S=P}else{R=F;S=c[E>>2]|0}c[s>>2]=R+1;a[S+R|0]=N&255;s=c[r>>2]|0;E=c[s>>2]|0;c[s>>2]=E-1;s=c[r>>2]|0;if((E|0)==0){T=gu(s)|0}else{E=s+4|0;s=c[E>>2]|0;c[E>>2]=s+1;T=d[s]|0}c[l>>2]=T;H=T}}while(0);T=k|0;k=H;while(1){H=(bq(k|0)|0)==0;N=c[l>>2]|0;if(H){if((N|0)==95){U=95}else{break}}else{U=N&255}N=c[m>>2]|0;H=N+4|0;R=c[H>>2]|0;S=N+8|0;P=c[S>>2]|0;if((R+1|0)>>>0>P>>>0){if(P>>>0>2147483645){fz(T,(c[o>>2]|0)+16|0,80);Q=c[p>>2]|0;O=c[q>>2]|0;fy(Q,5960,(A=i,i=i+24|0,c[A>>2]=T,c[A+8>>2]=O,c[A+16>>2]=5096,A)|0)|0;i=A;eC(c[p>>2]|0,3);V=c[S>>2]|0}else{V=P}P=V<<1;O=c[p>>2]|0;if((P|0)==-2){W=fv(O)|0;X=N|0}else{Q=N|0;W=fu(O,c[Q>>2]|0,V,P)|0;X=Q}c[X>>2]=W;c[S>>2]=P;Y=c[H>>2]|0;Z=W}else{Y=R;Z=c[N>>2]|0}c[H>>2]=Y+1;a[Z+Y|0]=U;H=c[r>>2]|0;N=c[H>>2]|0;c[H>>2]=N-1;H=c[r>>2]|0;if((N|0)==0){_=gu(H)|0}else{N=H+4|0;H=c[N>>2]|0;c[N>>2]=H+1;_=d[H]|0}c[l>>2]=_;k=_}_=c[m>>2]|0;k=_+4|0;l=c[k>>2]|0;r=_+8|0;U=c[r>>2]|0;if((l+1|0)>>>0>U>>>0){if(U>>>0>2147483645){Y=j|0;fz(Y,(c[o>>2]|0)+16|0,80);o=c[p>>2]|0;j=c[q>>2]|0;fy(o,5960,(A=i,i=i+24|0,c[A>>2]=Y,c[A+8>>2]=j,c[A+16>>2]=5096,A)|0)|0;i=A;eC(c[p>>2]|0,3);$=c[r>>2]|0}else{$=U}U=$<<1;A=c[p>>2]|0;if((U|0)==-2){aa=fv(A)|0;ab=_|0}else{p=_|0;aa=fu(A,c[p>>2]|0,$,U)|0;ab=p}c[ab>>2]=aa;c[r>>2]=U;ac=c[k>>2]|0;ad=aa}else{ac=l;ad=c[_>>2]|0}c[k>>2]=ac+1;a[ad+ac|0]=0;ac=b+68|0;ad=a[ac]|0;k=c[m>>2]|0;_=c[k>>2]|0;l=c[k+4>>2]|0;if((l|0)==0){ae=_}else{k=l;do{k=k-1|0;l=_+k|0;if((a[l]|0)==46){a[l]=ad}}while((k|0)!=0);ae=c[c[m>>2]>>2]|0}k=e|0;if((fw(ae,k)|0)!=0){i=f;return}ae=bD()|0;e=a[ac]|0;if((ae|0)==0){af=46}else{af=a[c[ae>>2]|0]|0}a[ac]=af;ae=c[m>>2]|0;ad=c[ae>>2]|0;_=c[ae+4>>2]|0;if((_|0)==0){ag=ad}else{ae=_;do{ae=ae-1|0;_=ad+ae|0;if((a[_]|0)==e<<24>>24){a[_]=af}}while((ae|0)!=0);ag=c[c[m>>2]>>2]|0}if((fw(ag,k)|0)!=0){i=f;return}k=a[ac]|0;ac=c[m>>2]|0;m=c[ac>>2]|0;ag=c[ac+4>>2]|0;if((ag|0)!=0){ac=ag;do{ac=ac-1|0;ag=m+ac|0;if((a[ag]|0)==k<<24>>24){a[ag]=46}}while((ac|0)!=0)}fe(b,5232,284);i=f;return}function ft(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0;h=i;j=c[d>>2]|0;do{if((j|0)<((f|0)/2|0|0)){k=j<<1;l=(k|0)<4?4:k}else{if((j|0)<(f|0)){l=f;break}es(a,g,(m=i,i=i+1|0,i=i+7>>3<<3,c[m>>2]=0,m)|0);i=m;l=f}}while(0);if((l+1|0)>>>0>(4294967293/(e>>>0)|0)>>>0){es(a,2288,(m=i,i=i+1|0,i=i+7>>3<<3,c[m>>2]=0,m)|0);i=m;n=0;c[d>>2]=l;i=h;return n|0}m=aa(c[d>>2]|0,e)|0;f=aa(l,e)|0;e=c[a+16>>2]|0;g=cg[c[e+12>>2]&511](c[e+16>>2]|0,b,m,f)|0;if(!((g|0)!=0|(f|0)==0)){eC(a,4)}a=e+68|0;c[a>>2]=f-m+(c[a>>2]|0);n=g;c[d>>2]=l;i=h;return n|0}function fu(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=c[a+16>>2]|0;g=cg[c[f+12>>2]&511](c[f+16>>2]|0,b,d,e)|0;if(!((g|0)!=0|(e|0)==0)){eC(a,4)}a=f+68|0;c[a>>2]=e-d+(c[a>>2]|0);return g|0}function fv(a){a=a|0;var b=0;b=i;es(a,2288,(a=i,i=i+1|0,i=i+7>>3<<3,c[a>>2]=0,a)|0);i=a;i=b;return 0}function fw(b,e){b=b|0;e=e|0;var f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0;f=i;i=i+8|0;g=f|0;h[e>>3]=+jZ(b,g);j=c[g>>2]|0;if((j|0)==(b|0)){k=0;i=f;return k|0}l=a[j]|0;if((l<<24>>24|0)==120|(l<<24>>24|0)==88){h[e>>3]=+((as(b|0,g|0,16)|0)>>>0>>>0);b=c[g>>2]|0;m=b;n=a[b]|0}else{m=j;n=l}if(n<<24>>24==0){k=1;i=f;return k|0}if((aB(n&255|0)|0)==0){o=m}else{n=m;do{n=n+1|0;}while((aB(d[n]|0)|0)!=0);c[g>>2]=n;o=n}k=(a[o]|0)==0|0;i=f;return k|0}function fx(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0;f=i;i=i+40|0;g=f|0;j=f+32|0;k=b+8|0;l=c[k>>2]|0;c[l>>2]=f_(b,10512,0)|0;c[l+8>>2]=4;l=b+28|0;m=c[k>>2]|0;if(((c[l>>2]|0)-m|0)<17){eA(b,1);n=c[k>>2]|0}else{n=m}m=n+16|0;c[k>>2]=m;n=aU(d|0,37)|0;L4082:do{if((n|0)==0){o=1;p=d;q=m}else{r=j|0;s=j+1|0;t=j+2|0;u=g|0;w=g+1|0;x=f+8|0;y=1;z=d;A=n;B=m;while(1){c[B>>2]=f_(b,z,A-z|0)|0;c[B+8>>2]=4;C=c[k>>2]|0;if(((c[l>>2]|0)-C|0)<17){eA(b,1);D=c[k>>2]|0}else{D=C}C=D+16|0;c[k>>2]=C;E=A+1|0;switch(a[E]|0){case 115:{F=(v=c[e+4>>2]|0,c[e+4>>2]=v+8,c[(c[e>>2]|0)+v>>2]|0);G=(F|0)==0?8496:F;F=c[k>>2]|0;c[F>>2]=f_(b,G,j_(G|0)|0)|0;c[F+8>>2]=4;F=c[k>>2]|0;if(((c[l>>2]|0)-F|0)<17){eA(b,1);H=c[k>>2]|0}else{H=F}F=H+16|0;c[k>>2]=F;I=F;break};case 100:{h[C>>3]=+((v=c[e+4>>2]|0,c[e+4>>2]=v+8,c[(c[e>>2]|0)+v>>2]|0)|0);c[D+24>>2]=3;F=c[k>>2]|0;if(((c[l>>2]|0)-F|0)<17){eA(b,1);J=c[k>>2]|0}else{J=F}F=J+16|0;c[k>>2]=F;I=F;break};case 99:{a[u]=(v=c[e+4>>2]|0,c[e+4>>2]=v+8,c[(c[e>>2]|0)+v>>2]|0)&255;a[w]=0;F=c[k>>2]|0;c[F>>2]=f_(b,u,j_(u|0)|0)|0;c[F+8>>2]=4;F=c[k>>2]|0;if(((c[l>>2]|0)-F|0)<17){eA(b,1);K=c[k>>2]|0}else{K=F}F=K+16|0;c[k>>2]=F;I=F;break};case 112:{F=(v=c[e+4>>2]|0,c[e+4>>2]=v+8,c[(c[e>>2]|0)+v>>2]|0);a$(x|0,8256,(G=i,i=i+8|0,c[G>>2]=F,G)|0)|0;i=G;G=c[k>>2]|0;c[G>>2]=f_(b,x,j_(x|0)|0)|0;c[G+8>>2]=4;G=c[k>>2]|0;if(((c[l>>2]|0)-G|0)<17){eA(b,1);L=c[k>>2]|0}else{L=G}G=L+16|0;c[k>>2]=G;I=G;break};case 37:{c[C>>2]=f_(b,6416,1)|0;c[D+24>>2]=4;G=c[k>>2]|0;if(((c[l>>2]|0)-G|0)<17){eA(b,1);M=c[k>>2]|0}else{M=G}G=M+16|0;c[k>>2]=G;I=G;break};case 102:{h[C>>3]=(v=c[e+4>>2]|0,c[e+4>>2]=v+8,+h[(c[e>>2]|0)+v>>3]);c[D+24>>2]=3;G=c[k>>2]|0;if(((c[l>>2]|0)-G|0)<17){eA(b,1);N=c[k>>2]|0}else{N=G}G=N+16|0;c[k>>2]=G;I=G;break};default:{a[r]=37;a[s]=a[E]|0;a[t]=0;c[C>>2]=f_(b,r,j_(r|0)|0)|0;c[D+24>>2]=4;C=c[k>>2]|0;if(((c[l>>2]|0)-C|0)<17){eA(b,1);O=c[k>>2]|0}else{O=C}C=O+16|0;c[k>>2]=C;I=C}}C=y+2|0;E=A+2|0;G=aU(E|0,37)|0;if((G|0)==0){o=C;p=E;q=I;break L4082}else{y=C;z=E;A=G;B=I}}}}while(0);c[q>>2]=f_(b,p,j_(p|0)|0)|0;c[q+8>>2]=4;q=c[k>>2]|0;if(((c[l>>2]|0)-q|0)>=17){P=q;Q=P+16|0;c[k>>2]=Q;R=o+1|0;S=b+12|0;T=c[S>>2]|0;U=Q;V=T;W=U-V|0;X=W>>4;Y=X-1|0;gq(b,R,Y);Z=c[k>>2]|0;_=-o|0;$=Z+(_<<4)|0;c[k>>2]=$;aa=~o;ab=Z+(aa<<4)|0;ac=ab;ad=c[ac>>2]|0;ae=ad+16|0;af=ae;i=f;return af|0}eA(b,1);P=c[k>>2]|0;Q=P+16|0;c[k>>2]=Q;R=o+1|0;S=b+12|0;T=c[S>>2]|0;U=Q;V=T;W=U-V|0;X=W>>4;Y=X-1|0;gq(b,R,Y);Z=c[k>>2]|0;_=-o|0;$=Z+(_<<4)|0;c[k>>2]=$;aa=~o;ab=Z+(aa<<4)|0;ac=ab;ad=c[ac>>2]|0;ae=ad+16|0;af=ae;i=f;return af|0}function fy(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+16|0;f=e|0;g=f;c[g>>2]=d;c[g+4>>2]=0;g=fx(a,b,f|0)|0;i=e;return g|0}function fz(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;e=a[c]|0;if((e<<24>>24|0)==61){f=c+1|0;j3(b|0,f|0,d|0)|0;a[b+(d-1)|0]=0;return}else if((e<<24>>24|0)==64){e=c+1|0;f=j_(e|0)|0;a[b]=0;if(f>>>0>(d-8|0)>>>0){g=b+(j_(b|0)|0)|0;w=3026478;a[g]=w&255;w=w>>8;a[g+1|0]=w&255;w=w>>8;a[g+2|0]=w&255;w=w>>8;a[g+3|0]=w&255;h=c+(8-d+1+f)|0}else{h=e}j4(b|0,h|0)|0;return}else{h=a2(c|0,4048)|0;e=d-17|0;d=h>>>0>e>>>0?e:h;j$(b|0,3536,10)|0;if((a[c+d|0]|0)==0){j4(b|0,c|0)|0}else{bS(b|0,c|0,d|0)|0;d=b+(j_(b|0)|0)|0;w=3026478;a[d]=w&255;w=w>>8;a[d+1|0]=w&255;w=w>>8;a[d+2|0]=w&255;w=w>>8;a[d+3|0]=w&255}d=b+(j_(b|0)|0)|0;a[d]=a[2920]|0;a[d+1|0]=a[2921|0]|0;a[d+2|0]=a[2922|0]|0;return}}function fA(e,f,g,h){e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0;j=i;i=i+648|0;k=j|0;l=j+72|0;c[k+60>>2]=g;fh(e,k,f,f_(e,h,j_(h|0)|0)|0);fB(k,l);h=l|0;a[(c[h>>2]|0)+74|0]=2;fi(k);l=k+52|0;e=(c[l>>2]|0)+52|0;f=(b[e>>1]|0)+1&65535;b[e>>1]=f;if((f&65535)>200){fe(k,6912,0)}f=k+16|0;e=k+48|0;L4144:do{switch(c[f>>2]|0){case 260:case 261:case 262:case 276:case 287:{break L4144;break};default:{}}g=fD(k)|0;if((c[f>>2]|0)==59){fi(k)}m=c[e>>2]|0;c[m+36>>2]=d[m+50|0]|0;}while((g|0)==0);e=(c[l>>2]|0)+52|0;b[e>>1]=(b[e>>1]|0)-1&65535;if((c[f>>2]|0)==287){fC(k);n=c[h>>2]|0;i=j;return n|0}f=c[l>>2]|0;l=fd(k,287)|0;e=fy(f,7112,(f=i,i=i+8|0,c[f>>2]=l,f)|0)|0;i=f;ff(k,e);fC(k);n=c[h>>2]|0;i=j;return n|0}function fB(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=c[b+52>>2]|0;f=eV(e)|0;c[d>>2]=f;g=b+48|0;c[d+8>>2]=c[g>>2];c[d+12>>2]=b;c[d+16>>2]=e;c[g>>2]=d;c[d+24>>2]=0;c[d+28>>2]=-1;c[d+32>>2]=-1;c[d+20>>2]=0;j2(d+36|0,0,15);c[f+32>>2]=c[b+64>>2];a[f+75|0]=2;b=f5(e,0,0)|0;c[d+4>>2]=b;d=e+8|0;g=c[d>>2]|0;c[g>>2]=b;c[g+8>>2]=5;g=e+28|0;b=c[d>>2]|0;if(((c[g>>2]|0)-b|0)<17){eA(e,1);h=c[d>>2]|0}else{h=b}b=h+16|0;c[d>>2]=b;c[b>>2]=f;c[h+24>>2]=9;h=c[d>>2]|0;if(((c[g>>2]|0)-h|0)>=17){i=h;j=i+16|0;c[d>>2]=j;return}eA(e,1);i=c[d>>2]|0;j=i+16|0;c[d>>2]=j;return}function fC(f){f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;g=c[f+52>>2]|0;h=f+48|0;i=c[h>>2]|0;j=i|0;k=c[j>>2]|0;l=i+50|0;m=a[l]|0;n=i+24|0;L4164:do{if(m<<24>>24!=0){o=m;p=k;while(1){q=c[n>>2]|0;r=o-1&255;a[l]=r;c[(c[p+24>>2]|0)+((e[i+172+((r&255)<<1)>>1]|0)*12|0)+8>>2]=q;q=a[l]|0;if(q<<24>>24==0){break L4164}o=q;p=c[j>>2]|0}}}while(0);dP(i,0,0);j=c[n>>2]|0;if((j+1|0)>>>0<1073741824){l=k+12|0;m=k+44|0;s=fu(g,c[l>>2]|0,c[m>>2]<<2,j<<2)|0;t=l;u=m}else{s=fv(g)|0;t=k+12|0;u=k+44|0}c[t>>2]=s;c[u>>2]=c[n>>2];u=c[n>>2]|0;if((u+1|0)>>>0<1073741824){s=k+20|0;t=k+48|0;v=fu(g,c[s>>2]|0,c[t>>2]<<2,u<<2)|0;w=s;x=t}else{v=fv(g)|0;w=k+20|0;x=k+48|0}c[w>>2]=v;c[x>>2]=c[n>>2];n=i+40|0;x=c[n>>2]|0;if((x+1|0)>>>0<268435456){v=k+8|0;w=k+40|0;y=fu(g,c[v>>2]|0,c[w>>2]<<4,x<<4)|0;z=v;A=w}else{y=fv(g)|0;z=k+8|0;A=k+40|0}c[z>>2]=y;c[A>>2]=c[n>>2];n=i+44|0;A=c[n>>2]|0;if((A+1|0)>>>0<1073741824){y=k+16|0;z=k+52|0;B=fu(g,c[y>>2]|0,c[z>>2]<<2,A<<2)|0;C=y;D=z}else{B=fv(g)|0;C=k+16|0;D=k+52|0}c[C>>2]=B;c[D>>2]=c[n>>2];n=i+48|0;D=b[n>>1]|0;if((D+1|0)>>>0<357913942){B=k+24|0;C=k+56|0;E=fu(g,c[B>>2]|0,(c[C>>2]|0)*12|0,D*12|0)|0;F=B;G=C}else{E=fv(g)|0;F=k+24|0;G=k+56|0}c[F>>2]=E;c[G>>2]=b[n>>1]|0;n=k+72|0;G=k+28|0;E=k+36|0;c[G>>2]=fu(g,c[G>>2]|0,c[E>>2]<<2,d[n]<<2)|0;c[E>>2]=d[n]|0;c[h>>2]=c[i+8>>2];if((i|0)==0){H=g+8|0;I=c[H>>2]|0;J=I-32|0;c[H>>2]=J;return}if(((c[f+16>>2]|0)-285|0)>>>0>=2){H=g+8|0;I=c[H>>2]|0;J=I-32|0;c[H>>2]=J;return}i=c[f+24>>2]|0;fg(f,i+16|0,c[i+12>>2]|0)|0;H=g+8|0;I=c[H>>2]|0;J=I-32|0;c[H>>2]=J;return}function fD(f){f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0;g=i;i=i+392|0;h=g|0;j=g+24|0;k=g+48|0;l=g+72|0;m=g+104|0;n=g+128|0;o=g+152|0;p=g+176|0;q=g+200|0;r=g+224|0;s=g+248|0;t=g+272|0;u=g+288|0;v=g+304|0;w=g+328|0;x=g+344|0;y=g+368|0;z=g+384|0;A=f+4|0;B=c[A>>2]|0;C=f+16|0;switch(c[C>>2]|0){case 266:{D=c[f+48>>2]|0;c[z>>2]=-1;E=fS(f)|0;while(1){F=c[C>>2]|0;if((F|0)==260){G=3286;break}else if((F|0)!=261){G=3287;break}dO(D,z,dM(D)|0);dR(D,E);E=fS(f)|0}if((G|0)==3286){dO(D,z,dM(D)|0);dR(D,E);fi(f);fE(f)}else if((G|0)==3287){dO(D,z,E)}dR(D,c[z>>2]|0);fF(f,262,266,B);H=0;i=g;return H|0};case 277:{z=f+48|0;D=c[z>>2]|0;fi(f);E=dI(D)|0;fI(f,x,0)|0;F=x|0;if((c[F>>2]|0)==1){c[F>>2]=3}d5(c[z>>2]|0,x);z=c[x+20>>2]|0;c[y+4>>2]=-1;a[y+10|0]=1;x=D+50|0;a[y+8|0]=a[x]|0;a[y+9|0]=0;F=D+20|0;c[y>>2]=c[F>>2];c[F>>2]=y;if((c[C>>2]|0)!=259){y=c[f+52>>2]|0;I=fd(f,259)|0;J=fy(y,7112,(K=i,i=i+8|0,c[K>>2]=I,K)|0)|0;i=K;ff(f,J)}fi(f);fE(f);dQ(D,dM(D)|0,E);fF(f,262,277,B);E=c[F>>2]|0;c[F>>2]=c[E>>2];F=E+8|0;J=a[F]|0;I=c[(c[D+12>>2]|0)+48>>2]|0;y=I+50|0;L=a[y]|0;if((L&255)>(J&255)){M=I+24|0;N=I|0;O=L;do{L=c[M>>2]|0;P=O-1&255;a[y]=P;c[(c[(c[N>>2]|0)+24>>2]|0)+((e[I+172+((P&255)<<1)>>1]|0)*12|0)+8>>2]=L;O=a[y]|0;}while((O&255)>(J&255))}if((a[E+9|0]|0)!=0){J=d[F]|0;dL(D,35,J,0,0)|0}c[D+36>>2]=d[x]|0;dR(D,c[E+4>>2]|0);dR(D,z);H=0;i=g;return H|0};case 272:{z=f+48|0;D=c[z>>2]|0;E=dI(D)|0;c[t+4>>2]=-1;a[t+10|0]=1;x=D+50|0;a[t+8|0]=a[x]|0;a[t+9|0]=0;J=D+20|0;c[t>>2]=c[J>>2];c[J>>2]=t;c[u+4>>2]=-1;a[u+10|0]=0;a[u+8|0]=a[x]|0;t=u+9|0;a[t]=0;c[u>>2]=c[J>>2];c[J>>2]=u;fi(f);u=f+52|0;F=(c[u>>2]|0)+52|0;O=(b[F>>1]|0)+1&65535;b[F>>1]=O;if((O&65535)>200){fe(f,6912,0)}L4226:do{switch(c[C>>2]|0){case 260:case 261:case 262:case 276:case 287:{break L4226;break};default:{}}O=fD(f)|0;if((c[C>>2]|0)==59){fi(f)}F=c[z>>2]|0;c[F+36>>2]=d[F+50|0]|0;}while((O|0)==0);O=(c[u>>2]|0)+52|0;b[O>>1]=(b[O>>1]|0)-1&65535;fF(f,276,272,B);fI(f,s,0)|0;O=s|0;if((c[O>>2]|0)==1){c[O>>2]=3}d5(c[z>>2]|0,s);O=c[s+20>>2]|0;if((a[t]|0)==0){t=c[J>>2]|0;c[J>>2]=c[t>>2];s=t+8|0;u=a[s]|0;F=c[(c[D+12>>2]|0)+48>>2]|0;y=F+50|0;I=a[y]|0;if((I&255)>(u&255)){N=F+24|0;M=F|0;L=I;do{I=c[N>>2]|0;P=L-1&255;a[y]=P;c[(c[(c[M>>2]|0)+24>>2]|0)+((e[F+172+((P&255)<<1)>>1]|0)*12|0)+8>>2]=I;L=a[y]|0;}while((L&255)>(u&255))}if((a[t+9|0]|0)!=0){u=d[s]|0;dL(D,35,u,0,0)|0}c[D+36>>2]=d[x]|0;dR(D,c[t+4>>2]|0);dQ(c[z>>2]|0,O,E)}else{t=c[z>>2]|0;u=c[t+20>>2]|0;L4238:do{if((u|0)==0){Q=0;G=3353}else{s=0;L=u;while(1){if((a[L+10|0]|0)!=0){R=s;S=L;break L4238}y=d[L+9|0]|s;F=c[L>>2]|0;if((F|0)==0){Q=y;G=3353;break}else{s=y;L=F}}}}while(0);if((G|0)==3353){ff(f,9e3);R=Q;S=0}if((R|0)!=0){R=d[S+8|0]|0;dL(t,35,R,0,0)|0}dO(t,S+4|0,dM(t)|0);dR(c[z>>2]|0,O);O=c[J>>2]|0;c[J>>2]=c[O>>2];t=O+8|0;S=a[t]|0;R=c[(c[D+12>>2]|0)+48>>2]|0;Q=R+50|0;u=a[Q]|0;if((u&255)>(S&255)){L=R+24|0;s=R|0;F=u;do{u=c[L>>2]|0;y=F-1&255;a[Q]=y;c[(c[(c[s>>2]|0)+24>>2]|0)+((e[R+172+((y&255)<<1)>>1]|0)*12|0)+8>>2]=u;F=a[Q]|0;}while((F&255)>(S&255))}if((a[O+9|0]|0)!=0){S=d[t]|0;dL(D,35,S,0,0)|0}c[D+36>>2]=d[x]|0;dR(D,c[O+4>>2]|0);O=c[z>>2]|0;dQ(O,dM(D)|0,E)}E=c[J>>2]|0;c[J>>2]=c[E>>2];J=E+8|0;O=a[J]|0;z=c[(c[D+12>>2]|0)+48>>2]|0;S=z+50|0;t=a[S]|0;if((t&255)>(O&255)){F=z+24|0;Q=z|0;R=t;do{t=c[F>>2]|0;s=R-1&255;a[S]=s;c[(c[(c[Q>>2]|0)+24>>2]|0)+((e[z+172+((s&255)<<1)>>1]|0)*12|0)+8>>2]=t;R=a[S]|0;}while((R&255)>(O&255))}if((a[E+9|0]|0)!=0){O=d[J]|0;dL(D,35,O,0,0)|0}c[D+36>>2]=d[x]|0;dR(D,c[E+4>>2]|0);H=0;i=g;return H|0};case 259:{fi(f);fE(f);fF(f,262,259,B);H=0;i=g;return H|0};case 258:{fi(f);E=c[f+48>>2]|0;D=c[E+20>>2]|0;L4278:do{if((D|0)==0){T=0;G=3412}else{x=0;O=D;while(1){if((a[O+10|0]|0)!=0){U=x;V=O;break L4278}J=d[O+9|0]|x;R=c[O>>2]|0;if((R|0)==0){T=J;G=3412;break}else{x=J;O=R}}}}while(0);if((G|0)==3412){ff(f,9e3);U=T;V=0}if((U|0)!=0){U=d[V+8|0]|0;dL(E,35,U,0,0)|0}dO(E,V+4|0,dM(E)|0);H=1;i=g;return H|0};case 273:{E=f+48|0;V=c[E>>2]|0;fi(f);L4296:do{switch(c[C>>2]|0){case 260:case 261:case 262:case 276:case 287:case 59:{W=0;X=0;break};default:{fI(f,m,0)|0;if((c[C>>2]|0)==44){U=1;while(1){fi(f);d_(c[E>>2]|0,m);fI(f,m,0)|0;T=U+1|0;if((c[C>>2]|0)==44){U=T}else{Y=T;break}}}else{Y=1}U=m|0;if(((c[U>>2]|0)-13|0)>>>0<2){dX(V,m,-1);if((c[U>>2]|0)==13&(Y|0)==1){U=(c[(c[V>>2]|0)+12>>2]|0)+(c[m+8>>2]<<2)|0;c[U>>2]=c[U>>2]&-64|29}W=-1;X=d[V+50|0]|0;break L4296}else{if((Y|0)==1){W=1;X=d0(V,m)|0;break L4296}else{d_(V,m);W=Y;X=d[V+50|0]|0;break L4296}}}}}while(0);dP(V,X,W);H=1;i=g;return H|0};case 264:{W=f+48|0;X=c[W>>2]|0;c[w+4>>2]=-1;a[w+10|0]=1;V=X+50|0;a[w+8|0]=a[V]|0;a[w+9|0]=0;Y=X+20|0;c[w>>2]=c[Y>>2];c[Y>>2]=w;fi(f);if((c[C>>2]|0)!=285){w=c[f+52>>2]|0;m=fd(f,285)|0;E=fy(w,7112,(K=i,i=i+8|0,c[K>>2]=m,K)|0)|0;i=K;ff(f,E)}E=f+24|0;m=c[E>>2]|0;fi(f);w=c[C>>2]|0;if((w|0)==44|(w|0)==267){U=c[W>>2]|0;T=c[U+36>>2]|0;fL(f,fg(f,8632,15)|0,0);fL(f,fg(f,8456,11)|0,1);fL(f,fg(f,8240,13)|0,2);fL(f,m,3);D=c[C>>2]|0;if((D|0)==44){O=f+52|0;x=4;while(1){fi(f);if((c[C>>2]|0)!=285){R=c[O>>2]|0;J=fd(f,285)|0;S=fy(R,7112,(K=i,i=i+8|0,c[K>>2]=J,K)|0)|0;i=K;ff(f,S)}S=c[E>>2]|0;fi(f);fL(f,S,x);Z=c[C>>2]|0;if((Z|0)==44){x=x+1|0}else{break}}_=x-2|0;$=Z}else{_=1;$=D}if(($|0)!=267){$=c[f+52>>2]|0;D=fd(f,267)|0;Z=fy($,7112,(K=i,i=i+8|0,c[K>>2]=D,K)|0)|0;i=K;ff(f,Z)}fi(f);Z=c[A>>2]|0;fI(f,v,0)|0;if((c[C>>2]|0)==44){D=1;while(1){fi(f);d_(c[W>>2]|0,v);fI(f,v,0)|0;$=D+1|0;if((c[C>>2]|0)==44){D=$}else{aa=$;break}}}else{aa=1}D=c[W>>2]|0;$=3-aa|0;aa=c[v>>2]|0;do{if((aa|0)==13|(aa|0)==14){x=$+1|0;E=(x|0)<0?0:x;dX(D,v,E);if((E|0)<=1){break}dT(D,E-1|0)}else if((aa|0)==0){G=3325}else{d_(D,v);G=3325}}while(0);do{if((G|0)==3325){if(($|0)<=0){break}v=c[D+36>>2]|0;dT(D,$);dK(D,v,$)}}while(0);dS(U,3);fR(f,T,Z,_,0)}else if((w|0)==61){w=c[W>>2]|0;_=w+36|0;Z=c[_>>2]|0;fL(f,fg(f,8016,11)|0,0);fL(f,fg(f,7784,11)|0,1);fL(f,fg(f,7544,10)|0,2);fL(f,m,3);if((c[C>>2]|0)!=61){m=c[f+52>>2]|0;T=fd(f,61)|0;U=fy(m,7112,(K=i,i=i+8|0,c[K>>2]=T,K)|0)|0;i=K;ff(f,U)}fi(f);fI(f,k,0)|0;d_(c[W>>2]|0,k);if((c[C>>2]|0)!=44){k=c[f+52>>2]|0;U=fd(f,44)|0;T=fy(k,7112,(K=i,i=i+8|0,c[K>>2]=U,K)|0)|0;i=K;ff(f,T)}fi(f);fI(f,j,0)|0;d_(c[W>>2]|0,j);if((c[C>>2]|0)==44){fi(f);fI(f,h,0)|0;d_(c[W>>2]|0,h)}else{h=c[_>>2]|0;_=dW(w,1.0)|0;dN(w,1,h,_)|0;dT(w,1)}fR(f,Z,B,1,1)}else{ff(f,8840)}fF(f,262,264,B);Z=c[Y>>2]|0;c[Y>>2]=c[Z>>2];Y=Z+8|0;w=a[Y]|0;_=c[(c[X+12>>2]|0)+48>>2]|0;h=_+50|0;W=a[h]|0;if((W&255)>(w&255)){j=_+24|0;T=_|0;U=W;do{W=c[j>>2]|0;k=U-1&255;a[h]=k;c[(c[(c[T>>2]|0)+24>>2]|0)+((e[_+172+((k&255)<<1)>>1]|0)*12|0)+8>>2]=W;U=a[h]|0;}while((U&255)>(w&255))}if((a[Z+9|0]|0)!=0){w=d[Y]|0;dL(X,35,w,0,0)|0}c[X+36>>2]=d[V]|0;dR(X,c[Z+4>>2]|0);H=0;i=g;return H|0};case 265:{fi(f);if((c[C>>2]|0)!=285){Z=c[f+52>>2]|0;X=fd(f,285)|0;V=fy(Z,7112,(K=i,i=i+8|0,c[K>>2]=X,K)|0)|0;i=K;ff(f,V)}V=c[f+24>>2]|0;fi(f);X=f+48|0;Z=c[X>>2]|0;if((fQ(Z,V,q,1)|0)==8){c[q+8>>2]=dU(Z,V)|0}while(1){V=c[C>>2]|0;if((V|0)==58){G=3374;break}else if((V|0)!=46){ab=0;break}fO(f,q)}if((G|0)==3374){fO(f,q);ab=1}fK(f,r,ab,B);d3(c[X>>2]|0,q,r);ea(c[X>>2]|0,B);H=0;i=g;return H|0};case 268:{fi(f);B=c[C>>2]|0;if((B|0)==265){fi(f);X=f+48|0;r=c[X>>2]|0;if((c[C>>2]|0)!=285){q=c[f+52>>2]|0;ab=fd(f,285)|0;V=fy(q,7112,(K=i,i=i+8|0,c[K>>2]=ab,K)|0)|0;i=K;ff(f,V)}V=c[f+24>>2]|0;fi(f);fL(f,V,0);V=c[r+36>>2]|0;c[o+16>>2]=-1;c[o+20>>2]=-1;c[o>>2]=6;c[o+8>>2]=V;dT(r,1);V=c[X>>2]|0;X=V+50|0;ab=(a[X]|0)+1&255;a[X]=ab;c[(c[(c[V>>2]|0)+24>>2]|0)+((e[V+172+((ab&255)-1<<1)>>1]|0)*12|0)+4>>2]=c[V+24>>2];fK(f,p,0,c[A>>2]|0);d3(r,o,p);c[(c[(c[r>>2]|0)+24>>2]|0)+((e[r+172+((d[r+50|0]|0)-1<<1)>>1]|0)*12|0)+4>>2]=c[r+24>>2];H=0;i=g;return H|0}r=f+24|0;p=f+52|0;o=0;A=B;while(1){if((A|0)!=285){B=c[p>>2]|0;V=fd(f,285)|0;ab=fy(B,7112,(K=i,i=i+8|0,c[K>>2]=V,K)|0)|0;i=K;ff(f,ab)}ab=c[r>>2]|0;fi(f);ac=o+1|0;fL(f,ab,o);ab=c[C>>2]|0;if((ab|0)==61){G=3385;break}else if((ab|0)!=44){G=3388;break}fi(f);o=ac;A=c[C>>2]|0}do{if((G|0)==3385){fi(f);fI(f,n,0)|0;if((c[C>>2]|0)==44){A=f+48|0;r=1;while(1){fi(f);d_(c[A>>2]|0,n);fI(f,n,0)|0;K=r+1|0;if((c[C>>2]|0)==44){r=K}else{ad=K;break}}}else{ad=1}r=c[n>>2]|0;A=f+48|0;K=c[A>>2]|0;p=ac-ad|0;if((r|0)==0){ae=A;af=K;ag=p;G=3393;break}else if(!((r|0)==13|(r|0)==14)){d_(K,n);ae=A;af=K;ag=p;G=3393;break}r=p+1|0;p=(r|0)<0?0:r;dX(K,n,p);if((p|0)<=1){ah=A;break}dT(K,p-1|0);ah=A}else if((G|0)==3388){c[n>>2]=0;A=f+48|0;ae=A;af=c[A>>2]|0;ag=ac;G=3393}}while(0);do{if((G|0)==3393){if((ag|0)<=0){ah=ae;break}n=c[af+36>>2]|0;dT(af,ag);dK(af,n,ag);ah=ae}}while(0);ae=c[ah>>2]|0;ah=ae+50|0;ag=(d[ah]|0)+ac|0;a[ah]=ag&255;if((ac|0)==0){H=0;i=g;return H|0}af=ae+24|0;G=ae|0;c[(c[(c[G>>2]|0)+24>>2]|0)+((e[ae+172+((ag&255)-ac<<1)>>1]|0)*12|0)+4>>2]=c[af>>2];if((o|0)==0){H=0;i=g;return H|0}else{ai=o}while(1){c[(c[(c[G>>2]|0)+24>>2]|0)+((e[ae+172+((d[ah]|0)-ai<<1)>>1]|0)*12|0)+4>>2]=c[af>>2];o=ai-1|0;if((o|0)==0){H=0;break}else{ai=o}}i=g;return H|0};default:{ai=c[f+48>>2]|0;af=l+8|0;fG(f,af);if((c[af>>2]|0)==13){af=(c[(c[ai>>2]|0)+12>>2]|0)+(c[l+16>>2]<<2)|0;c[af>>2]=c[af>>2]&-8372225|16384;H=0;i=g;return H|0}else{c[l>>2]=0;fH(f,l,1);H=0;i=g;return H|0}}}return 0}function fE(f){f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;g=i;i=i+16|0;h=g|0;j=f+48|0;k=c[j>>2]|0;c[h+4>>2]=-1;a[h+10|0]=0;l=k+50|0;a[h+8|0]=a[l]|0;a[h+9|0]=0;m=k+20|0;c[h>>2]=c[m>>2];c[m>>2]=h;h=f+52|0;n=(c[h>>2]|0)+52|0;o=(b[n>>1]|0)+1&65535;b[n>>1]=o;if((o&65535)>200){fe(f,6912,0)}o=f+16|0;L4:do{switch(c[o>>2]|0){case 260:case 261:case 262:case 276:case 287:{break L4;break};default:{}}n=fD(f)|0;if((c[o>>2]|0)==59){fi(f)}p=c[j>>2]|0;c[p+36>>2]=d[p+50|0]|0;}while((n|0)==0);j=(c[h>>2]|0)+52|0;b[j>>1]=(b[j>>1]|0)-1&65535;j=c[m>>2]|0;c[m>>2]=c[j>>2];m=j+8|0;h=a[m]|0;f=c[(c[k+12>>2]|0)+48>>2]|0;o=f+50|0;n=a[o]|0;if((n&255)>(h&255)){p=f+24|0;q=f|0;r=n;do{n=c[p>>2]|0;s=r-1&255;a[o]=s;c[(c[(c[q>>2]|0)+24>>2]|0)+((e[f+172+((s&255)<<1)>>1]|0)*12|0)+8>>2]=n;r=a[o]|0;}while((r&255)>(h&255))}if((a[j+9|0]|0)==0){t=a[l]|0;u=t&255;v=k+36|0;c[v>>2]=u;w=j+4|0;x=c[w>>2]|0;dR(k,x);i=g;return}dL(k,35,d[m]|0,0,0)|0;t=a[l]|0;u=t&255;v=k+36|0;c[v>>2]=u;w=j+4|0;x=c[w>>2]|0;dR(k,x);i=g;return}function fF(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;if((c[a+16>>2]|0)==(b|0)){fi(a);i=f;return}g=(c[a+4>>2]|0)==(e|0);h=c[a+52>>2]|0;j=fd(a,b)|0;if(g){g=fy(h,7112,(k=i,i=i+8|0,c[k>>2]=j,k)|0)|0;i=k;ff(a,g);i=f;return}else{g=fd(a,d)|0;d=fy(h,7320,(k=i,i=i+24|0,c[k>>2]=j,c[k+8>>2]=g,c[k+16>>2]=e,k)|0)|0;i=k;ff(a,d);i=f;return}}function fG(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;d=i;i=i+48|0;e=d|0;f=d+24|0;g=a+48|0;h=c[g>>2]|0;j=a+16|0;k=c[j>>2]|0;do{if((k|0)==40){l=c[a+4>>2]|0;fi(a);fI(a,b,0)|0;fF(a,41,40,l);dZ(c[g>>2]|0,b)}else if((k|0)==285){l=c[a+24>>2]|0;fi(a);m=c[g>>2]|0;if((fQ(m,l,b,1)|0)!=8){break}c[b+8>>2]=dU(m,l)|0}else{ff(a,9512)}}while(0);k=a+24|0;l=f+16|0;m=f+20|0;n=f|0;o=f+8|0;p=a+52|0;L37:while(1){switch(c[j>>2]|0){case 46:{fO(a,b);continue L37;break};case 91:{d0(h,b)|0;fN(a,e);d6(h,b,e);continue L37;break};case 58:{fi(a);if((c[j>>2]|0)!=285){q=c[p>>2]|0;r=fd(a,285)|0;s=fy(q,7112,(q=i,i=i+8|0,c[q>>2]=r,q)|0)|0;i=q;ff(a,s)}s=c[k>>2]|0;fi(a);q=dU(c[g>>2]|0,s)|0;c[l>>2]=-1;c[m>>2]=-1;c[n>>2]=4;c[o>>2]=q;d4(h,b,f);fP(a,b);continue L37;break};case 40:case 286:case 123:{d_(h,b);fP(a,b);continue L37;break};default:{break L37}}}i=d;return}function fH(a,b,d){a=a|0;b=b|0;d=d|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;f=i;i=i+56|0;g=f|0;h=f+24|0;j=b+8|0;if(((c[j>>2]|0)-6|0)>>>0>=4){ff(a,9200)}k=a+16|0;l=c[k>>2]|0;if((l|0)==61){m=60}else if((l|0)==44){fi(a);c[h>>2]=b;l=h+8|0;fG(a,l);do{if((c[l>>2]|0)==6){n=c[a+48>>2]|0;o=n+36|0;p=c[o>>2]|0;if((b|0)==0){break}q=h+16|0;r=b;s=0;while(1){do{if((c[r+8>>2]|0)==9){t=r+16|0;u=t;v=c[q>>2]|0;if((c[u>>2]|0)==(v|0)){c[u>>2]=p;w=1;x=c[q>>2]|0}else{w=s;x=v}v=t+4|0;if((c[v>>2]|0)!=(x|0)){y=w;break}c[v>>2]=p;y=1}else{y=s}}while(0);v=c[r>>2]|0;if((v|0)==0){break}else{r=v;s=y}}if((y|0)==0){break}dL(n,0,c[o>>2]|0,c[q>>2]|0,0)|0;dT(n,1)}}while(0);y=200-(e[(c[a+52>>2]|0)+52>>1]|0)|0;w=a+48|0;if((y|0)<(d|0)){x=c[w>>2]|0;b=c[(c[x>>2]|0)+60>>2]|0;l=c[x+16>>2]|0;if((b|0)==0){s=fy(l,10384,(z=i,i=i+16|0,c[z>>2]=y,c[z+8>>2]=10064,z)|0)|0;i=z;A=s}else{s=fy(l,10216,(z=i,i=i+24|0,c[z>>2]=b,c[z+8>>2]=y,c[z+16>>2]=10064,z)|0)|0;i=z;A=s}fe(c[x+12>>2]|0,A,0)}fH(a,h,d+1|0);B=w;C=g|0}else{w=c[a+52>>2]|0;h=fd(a,61)|0;A=fy(w,7112,(z=i,i=i+8|0,c[z>>2]=h,z)|0)|0;i=z;ff(a,A);m=60}do{if((m|0)==60){fi(a);fI(a,g,0)|0;A=a+48|0;if((c[k>>2]|0)==44){z=1;while(1){fi(a);d_(c[A>>2]|0,g);fI(a,g,0)|0;h=z+1|0;if((c[k>>2]|0)==44){z=h}else{D=h;break}}}else{D=1}z=c[A>>2]|0;if((D|0)==(d|0)){dY(z,g);d3(c[A>>2]|0,j,g);i=f;return}n=d-D|0;q=g|0;o=c[q>>2]|0;do{if((o|0)==13|(o|0)==14){h=n+1|0;w=(h|0)<0?0:h;dX(z,g,w);if((w|0)<=1){break}dT(z,w-1|0)}else if((o|0)==0){m=67}else{d_(z,g);m=67}}while(0);do{if((m|0)==67){if((n|0)<=0){break}o=c[z+36>>2]|0;dT(z,n);dK(z,o,n)}}while(0);if((D|0)<=(d|0)){B=A;C=q;break}z=(c[A>>2]|0)+36|0;c[z>>2]=n+(c[z>>2]|0);B=A;C=q}}while(0);d=c[B>>2]|0;B=(c[d+36>>2]|0)-1|0;c[g+16>>2]=-1;c[g+20>>2]=-1;c[C>>2]=12;c[g+8>>2]=B;d3(d,j,g);i=f;return}function fI(e,f,g){e=e|0;f=f|0;g=g|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;j=i;i=i+24|0;k=j|0;l=e+52|0;m=(c[l>>2]|0)+52|0;n=(b[m>>1]|0)+1&65535;b[m>>1]=n;if((n&65535)>200){fe(e,6912,0)}n=e+16|0;switch(c[n>>2]|0){case 265:{fi(e);fK(e,f,0,c[e+4>>2]|0);break};case 45:{o=0;p=81;break};case 35:{o=2;p=81;break};case 270:{o=1;p=81;break};case 284:{c[f+16>>2]=-1;c[f+20>>2]=-1;c[f>>2]=5;c[f+8>>2]=0;h[f+8>>3]=+h[e+24>>3];p=93;break};case 286:{m=dU(c[e+48>>2]|0,c[e+24>>2]|0)|0;c[f+16>>2]=-1;c[f+20>>2]=-1;c[f>>2]=4;c[f+8>>2]=m;p=93;break};case 269:{c[f+16>>2]=-1;c[f+20>>2]=-1;c[f>>2]=1;c[f+8>>2]=0;p=93;break};case 275:{c[f+16>>2]=-1;c[f+20>>2]=-1;c[f>>2]=2;c[f+8>>2]=0;p=93;break};case 263:{c[f+16>>2]=-1;c[f+20>>2]=-1;c[f>>2]=3;c[f+8>>2]=0;p=93;break};case 279:{m=c[e+48>>2]|0;q=m|0;r=c[q>>2]|0;s=a[r+74|0]|0;if(s<<24>>24==0){ff(e,8128);t=c[q>>2]|0;u=t;v=a[t+74|0]|0}else{u=r;v=s}a[u+74|0]=v&-5;v=dL(m,37,0,1,0)|0;c[f+16>>2]=-1;c[f+20>>2]=-1;c[f>>2]=14;c[f+8>>2]=v;p=93;break};case 123:{fJ(e|0,f|0);break};default:{fG(e,f)}}if((p|0)==93){fi(e)}else if((p|0)==81){fi(e);fI(e,f,8)|0;d7(c[e+48>>2]|0,o,f)}switch(c[n>>2]|0){case 45:{w=1;break};case 42:{w=2;break};case 47:{w=3;break};case 37:{w=4;break};case 94:{w=5;break};case 278:{w=6;break};case 283:{w=7;break};case 280:{w=8;break};case 60:{w=9;break};case 282:{w=10;break};case 62:{w=11;break};case 281:{w=12;break};case 257:{w=13;break};case 271:{w=14;break};case 43:{w=0;break};default:{x=15;y=c[l>>2]|0;z=y+52|0;A=b[z>>1]|0;B=A-1&65535;b[z>>1]=B;i=j;return x|0}}n=e+48|0;o=w;while(1){if((d[328+(o<<1)|0]|0)>>>0<=g>>>0){x=o;p=114;break}fi(e);d9(c[n>>2]|0,o,f);w=fI(e,k,d[329+(o<<1)|0]|0)|0;eb(c[n>>2]|0,o,f,k);if((w|0)==15){x=15;p=115;break}else{o=w}}if((p|0)==114){y=c[l>>2]|0;z=y+52|0;A=b[z>>1]|0;B=A-1&65535;b[z>>1]=B;i=j;return x|0}else if((p|0)==115){y=c[l>>2]|0;z=y+52|0;A=b[z>>1]|0;B=A-1&65535;b[z>>1]=B;i=j;return x|0}return 0}function fJ(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;d=i;i=i+40|0;e=d|0;f=a+48|0;g=c[f>>2]|0;h=c[a+4>>2]|0;j=dL(g,10,0,0,0)|0;k=e+36|0;c[k>>2]=0;l=e+28|0;c[l>>2]=0;m=e+32|0;c[m>>2]=0;n=e+24|0;c[n>>2]=b;c[b+16>>2]=-1;c[b+20>>2]=-1;c[b>>2]=11;c[b+8>>2]=j;o=e|0;c[e+16>>2]=-1;c[e+20>>2]=-1;p=e|0;c[p>>2]=0;c[e+8>>2]=0;d_(c[f>>2]|0,b);b=a+16|0;if((c[b>>2]|0)!=123){q=c[a+52>>2]|0;r=fd(a,123)|0;s=fy(q,7112,(t=i,i=i+8|0,c[t>>2]=r,t)|0)|0;i=t;ff(a,s)}fi(a);L148:do{if((c[b>>2]|0)!=125){s=a+32|0;do{do{if((c[p>>2]|0)!=0){d_(g,o);c[p>>2]=0;if((c[k>>2]|0)!=50){break}ed(g,c[(c[n>>2]|0)+8>>2]|0,c[m>>2]|0,50);c[k>>2]=0}}while(0);r=c[b>>2]|0;do{if((r|0)==91){fM(a,e)}else if((r|0)==285){fk(a);if((c[s>>2]|0)==61){fM(a,e);break}fI(a,o,0)|0;q=c[m>>2]|0;if((q|0)>2147483645){u=c[f>>2]|0;v=c[(c[u>>2]|0)+60>>2]|0;w=c[u+16>>2]|0;if((v|0)==0){x=fy(w,10384,(t=i,i=i+16|0,c[t>>2]=2147483645,c[t+8>>2]=2256,t)|0)|0;i=t;y=x}else{x=fy(w,10216,(t=i,i=i+24|0,c[t>>2]=v,c[t+8>>2]=2147483645,c[t+16>>2]=2256,t)|0)|0;i=t;y=x}fe(c[u+12>>2]|0,y,0);z=c[m>>2]|0}else{z=q}c[m>>2]=z+1;c[k>>2]=(c[k>>2]|0)+1}else{fI(a,o,0)|0;q=c[m>>2]|0;if((q|0)>2147483645){u=c[f>>2]|0;x=c[(c[u>>2]|0)+60>>2]|0;v=c[u+16>>2]|0;if((x|0)==0){w=fy(v,10384,(t=i,i=i+16|0,c[t>>2]=2147483645,c[t+8>>2]=2256,t)|0)|0;i=t;A=w}else{w=fy(v,10216,(t=i,i=i+24|0,c[t>>2]=x,c[t+8>>2]=2147483645,c[t+16>>2]=2256,t)|0)|0;i=t;A=w}fe(c[u+12>>2]|0,A,0);B=c[m>>2]|0}else{B=q}c[m>>2]=B+1;c[k>>2]=(c[k>>2]|0)+1}}while(0);r=c[b>>2]|0;if((r|0)==44){fi(a)}else if((r|0)==59){fi(a)}else{break L148}}while((c[b>>2]|0)!=125)}}while(0);fF(a,125,123,h);h=c[k>>2]|0;do{if((h|0)!=0){a=c[p>>2]|0;if((a|0)==13|(a|0)==14){dX(g,o,-1);ed(g,c[(c[n>>2]|0)+8>>2]|0,c[m>>2]|0,-1);c[m>>2]=(c[m>>2]|0)-1;break}else if((a|0)==0){C=h}else{d_(g,o);C=c[k>>2]|0}ed(g,c[(c[n>>2]|0)+8>>2]|0,c[m>>2]|0,C)}}while(0);C=g|0;g=c[(c[(c[C>>2]|0)+12>>2]|0)+(j<<2)>>2]&8388607;n=(fo(c[m>>2]|0)|0)<<23|g;c[(c[(c[C>>2]|0)+12>>2]|0)+(j<<2)>>2]=n;n=c[(c[(c[C>>2]|0)+12>>2]|0)+(j<<2)>>2]&-8372225;g=(fo(c[l>>2]|0)|0)<<14&8372224|n;c[(c[(c[C>>2]|0)+12>>2]|0)+(j<<2)>>2]=g;i=d;return}function fK(f,g,h,j){f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;k=i;i=i+576|0;l=k|0;fB(f,l);m=l|0;c[(c[m>>2]|0)+60>>2]=j;n=f+16|0;if((c[n>>2]|0)!=40){o=c[f+52>>2]|0;p=fd(f,40)|0;q=fy(o,7112,(r=i,i=i+8|0,c[r>>2]=p,r)|0)|0;i=r;ff(f,q)}fi(f);if((h|0)==0){s=f+48|0}else{fL(f,fg(f,6328,4)|0,0);h=f+48|0;q=c[h>>2]|0;p=q+50|0;o=(a[p]|0)+1&255;a[p]=o;c[(c[(c[q>>2]|0)+24>>2]|0)+((e[q+172+((o&255)-1<<1)>>1]|0)*12|0)+4>>2]=c[q+24>>2];s=h}h=c[s>>2]|0;q=c[h>>2]|0;o=q+74|0;a[o]=0;p=c[n>>2]|0;L198:do{if((p|0)==41){t=0}else{u=f+24|0;v=0;w=p;while(1){if((w|0)==279){break}else if((w|0)==285){x=c[u>>2]|0;fi(f);fL(f,x,v);y=v+1|0}else{ff(f,3504);y=v}if((a[o]|0)!=0){t=y;break L198}if((c[n>>2]|0)!=44){t=y;break L198}fi(f);v=y;w=c[n>>2]|0}fi(f);fL(f,fg(f,4032,3)|0,v);a[o]=7;t=v+1|0}}while(0);y=c[s>>2]|0;p=y+50|0;w=(d[p]|0)+t|0;a[p]=w&255;do{if((t|0)!=0){u=y+24|0;x=y|0;c[(c[(c[x>>2]|0)+24>>2]|0)+((e[y+172+((w&255)-t<<1)>>1]|0)*12|0)+4>>2]=c[u>>2];z=t-1|0;if((z|0)==0){break}else{A=z}do{c[(c[(c[x>>2]|0)+24>>2]|0)+((e[y+172+((d[p]|0)-A<<1)>>1]|0)*12|0)+4>>2]=c[u>>2];A=A-1|0;}while((A|0)!=0)}}while(0);A=h+50|0;a[q+73|0]=(a[A]|0)-(a[o]&1)&255;dT(h,d[A]|0);A=f+52|0;if((c[n>>2]|0)!=41){h=c[A>>2]|0;o=fd(f,41)|0;q=fy(h,7112,(r=i,i=i+8|0,c[r>>2]=o,r)|0)|0;i=r;ff(f,q)}fi(f);q=(c[A>>2]|0)+52|0;r=(b[q>>1]|0)+1&65535;b[q>>1]=r;if((r&65535)>200){fe(f,6912,0)}L220:do{switch(c[n>>2]|0){case 260:case 261:case 262:case 276:case 287:{break L220;break};default:{}}r=fD(f)|0;if((c[n>>2]|0)==59){fi(f)}q=c[s>>2]|0;c[q+36>>2]=d[q+50|0]|0;}while((r|0)==0);n=(c[A>>2]|0)+52|0;b[n>>1]=(b[n>>1]|0)-1&65535;c[(c[m>>2]|0)+64>>2]=c[f+4>>2];fF(f,262,265,j);fC(f);f=c[s>>2]|0;s=c[f>>2]|0;j=s+52|0;n=c[j>>2]|0;r=f+44|0;if(((c[r>>2]|0)+1|0)>(n|0)){q=s+16|0;c[q>>2]=ft(c[A>>2]|0,c[q>>2]|0,j,4,262143,4888)|0;B=c[j>>2]|0;C=q}else{B=n;C=s+16|0}if((n|0)<(B|0)){B=n;while(1){n=B+1|0;c[(c[C>>2]|0)+(B<<2)>>2]=0;if((n|0)<(c[j>>2]|0)){B=n}else{break}}}B=c[m>>2]|0;j=c[r>>2]|0;c[r>>2]=j+1;c[(c[C>>2]|0)+(j<<2)>>2]=B;B=c[m>>2]|0;j=B;do{if((a[B+5|0]&3)!=0){if((a[s+5|0]&4)==0){break}e7(c[A>>2]|0,s,j)}}while(0);j=dN(f,36,0,(c[r>>2]|0)-1|0)|0;c[g+16>>2]=-1;c[g+20>>2]=-1;c[g>>2]=11;c[g+8>>2]=j;if((a[(c[m>>2]|0)+72|0]|0)==0){i=k;return}else{D=0}do{dL(f,(a[l+51+(D<<1)|0]|0)==6?0:4,0,d[l+51+(D<<1)+1|0]|0,0)|0;D=D+1|0;}while((D|0)<(d[(c[m>>2]|0)+72|0]|0));i=k;return}function fL(e,f,g){e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;h=i;j=e+48|0;k=c[j>>2]|0;l=k+50|0;if((g+1+(d[l]|0)|0)>200){m=c[(c[k>>2]|0)+60>>2]|0;n=c[k+16>>2]|0;if((m|0)==0){o=fy(n,10384,(p=i,i=i+16|0,c[p>>2]=200,c[p+8>>2]=2904,p)|0)|0;i=p;q=o}else{o=fy(n,10216,(p=i,i=i+24|0,c[p>>2]=m,c[p+8>>2]=200,c[p+16>>2]=2904,p)|0)|0;i=p;q=o}fe(c[k+12>>2]|0,q,0);r=c[j>>2]|0}else{r=k}j=c[r>>2]|0;q=j+56|0;o=c[q>>2]|0;p=r+48|0;if(((b[p>>1]|0)+1|0)>(o|0)){r=j+24|0;c[r>>2]=ft(c[e+52>>2]|0,c[r>>2]|0,q,12,32767,2552)|0;s=c[q>>2]|0;t=r}else{s=o;t=j+24|0}if((o|0)<(s|0)){s=o;while(1){o=s+1|0;c[(c[t>>2]|0)+(s*12|0)>>2]=0;if((o|0)<(c[q>>2]|0)){s=o}else{break}}}c[(c[t>>2]|0)+((b[p>>1]|0)*12|0)>>2]=f;if((a[f+5|0]&3)==0){u=b[p>>1]|0;v=u+1&65535;b[p>>1]=v;w=a[l]|0;x=w&255;y=x+g|0;z=k+172+(y<<1)|0;b[z>>1]=u;i=h;return}if((a[j+5|0]&4)==0){u=b[p>>1]|0;v=u+1&65535;b[p>>1]=v;w=a[l]|0;x=w&255;y=x+g|0;z=k+172+(y<<1)|0;b[z>>1]=u;i=h;return}e7(c[e+52>>2]|0,j,f);u=b[p>>1]|0;v=u+1&65535;b[p>>1]=v;w=a[l]|0;x=w&255;y=x+g|0;z=k+172+(y<<1)|0;b[z>>1]=u;i=h;return}function fM(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;d=i;i=i+48|0;e=d|0;f=d+24|0;g=a+48|0;h=c[g>>2]|0;j=h+36|0;k=c[j>>2]|0;l=a+16|0;if((c[l>>2]|0)==285){m=b+28|0;do{if((c[m>>2]|0)>2147483645){n=c[(c[h>>2]|0)+60>>2]|0;o=c[h+16>>2]|0;if((n|0)==0){p=fy(o,10384,(q=i,i=i+16|0,c[q>>2]=2147483645,c[q+8>>2]=2256,q)|0)|0;i=q;r=p}else{p=fy(o,10216,(q=i,i=i+24|0,c[q>>2]=n,c[q+8>>2]=2147483645,c[q+16>>2]=2256,q)|0)|0;i=q;r=p}fe(c[h+12>>2]|0,r,0);if((c[l>>2]|0)==285){break}p=c[a+52>>2]|0;n=fd(a,285)|0;o=fy(p,7112,(q=i,i=i+8|0,c[q>>2]=n,q)|0)|0;i=q;ff(a,o)}}while(0);r=c[a+24>>2]|0;fi(a);o=dU(c[g>>2]|0,r)|0;c[e+16>>2]=-1;c[e+20>>2]=-1;c[e>>2]=4;c[e+8>>2]=o;s=m}else{fN(a,e);s=b+28|0}c[s>>2]=(c[s>>2]|0)+1;if((c[l>>2]|0)==61){fi(a);t=d2(h,e)|0;u=fI(a,f,0)|0;v=b+24|0;w=c[v>>2]|0;x=w+8|0;y=x;z=c[y>>2]|0;A=d2(h,f)|0;B=dL(h,9,z,t,A)|0;c[j>>2]=k;i=d;return}l=c[a+52>>2]|0;s=fd(a,61)|0;m=fy(l,7112,(q=i,i=i+8|0,c[q>>2]=s,q)|0)|0;i=q;ff(a,m);fi(a);t=d2(h,e)|0;u=fI(a,f,0)|0;v=b+24|0;w=c[v>>2]|0;x=w+8|0;y=x;z=c[y>>2]|0;A=d2(h,f)|0;B=dL(h,9,z,t,A)|0;c[j>>2]=k;i=d;return}function fN(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;fi(a);fI(a,b,0)|0;d1(c[a+48>>2]|0,b);if((c[a+16>>2]|0)==93){fi(a);i=d;return}b=c[a+52>>2]|0;e=fd(a,93)|0;f=fy(b,7112,(b=i,i=i+8|0,c[b>>2]=e,b)|0)|0;i=b;ff(a,f);fi(a);i=d;return}function fO(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;d=i;i=i+24|0;e=d|0;f=a+48|0;g=c[f>>2]|0;d0(g,b)|0;fi(a);if((c[a+16>>2]|0)!=285){h=c[a+52>>2]|0;j=fd(a,285)|0;k=fy(h,7112,(h=i,i=i+8|0,c[h>>2]=j,h)|0)|0;i=h;ff(a,k)}k=c[a+24>>2]|0;fi(a);a=dU(c[f>>2]|0,k)|0;c[e+16>>2]=-1;c[e+20>>2]=-1;c[e>>2]=4;c[e+8>>2]=a;d6(g,b,e);i=d;return}function fP(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;i=i+24|0;e=d|0;f=a+48|0;g=c[f>>2]|0;h=c[a+4>>2]|0;j=a+16|0;k=c[j>>2]|0;if((k|0)==123){fJ(a|0,e|0)}else if((k|0)==286){l=dU(g,c[a+24>>2]|0)|0;c[e+16>>2]=-1;c[e+20>>2]=-1;c[e>>2]=4;c[e+8>>2]=l;fi(a)}else if((k|0)==40){if((h|0)!=(c[a+8>>2]|0)){ff(a,9952)}fi(a);if((c[j>>2]|0)==41){c[e>>2]=0}else{fI(a,e,0)|0;if((c[j>>2]|0)==44){do{fi(a);d_(c[f>>2]|0,e);fI(a,e,0)|0;}while((c[j>>2]|0)==44)}dX(g,e,-1)}fF(a,41,40,h)}else{ff(a,9704);i=d;return}a=b+8|0;j=c[a>>2]|0;f=c[e>>2]|0;if((f|0)==0){m=240}else if((f|0)==13|(f|0)==14){n=0}else{d_(g,e);m=240}if((m|0)==240){n=(c[g+36>>2]|0)-j|0}m=dL(g,28,j,n,2)|0;c[b+16>>2]=-1;c[b+20>>2]=-1;c[b>>2]=13;c[a>>2]=m;ea(g,h);c[g+36>>2]=j+1;i=d;return}function fQ(b,f,g,h){b=b|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;j=i;if((b|0)==0){c[g+16>>2]=-1;c[g+20>>2]=-1;c[g>>2]=8;c[g+8>>2]=255;k=8;i=j;return k|0}l=b|0;m=d[b+50|0]|0;while(1){n=m-1|0;if((m|0)<=0){break}if((c[(c[(c[l>>2]|0)+24>>2]|0)+((e[b+172+(n<<1)>>1]|0)*12|0)>>2]|0)==(f|0)){o=250;break}else{m=n}}if((o|0)==250){c[g+16>>2]=-1;c[g+20>>2]=-1;c[g>>2]=6;c[g+8>>2]=n;if((h|0)!=0){k=6;i=j;return k|0}h=b+20|0;while(1){p=c[h>>2]|0;if((p|0)==0){k=6;o=279;break}if((d[p+8|0]|0|0)>(n|0)){h=p|0}else{break}}if((o|0)==279){i=j;return k|0}a[p+9|0]=1;k=6;i=j;return k|0}if((fQ(c[b+8>>2]|0,f,g,0)|0)==8){k=8;i=j;return k|0}p=c[l>>2]|0;l=p+36|0;h=c[l>>2]|0;n=p+72|0;m=a[n]|0;q=m&255;L342:do{if(m<<24>>24==0){r=0;o=261}else{s=c[g>>2]|0;t=g+8|0;u=0;while(1){if((d[b+51+(u<<1)|0]|0|0)==(s|0)){if((d[b+51+(u<<1)+1|0]|0|0)==(c[t>>2]|0)){v=u;break L342}}w=u+1|0;if((w|0)<(q|0)){u=w}else{r=m;o=261;break}}}}while(0);if((o|0)==261){if((q+1|0)>>>0>60){q=c[p+60>>2]|0;o=c[b+16>>2]|0;if((q|0)==0){m=fy(o,10384,(x=i,i=i+16|0,c[x>>2]=60,c[x+8>>2]=9272,x)|0)|0;i=x;y=m}else{m=fy(o,10216,(x=i,i=i+24|0,c[x>>2]=q,c[x+8>>2]=60,c[x+16>>2]=9272,x)|0)|0;i=x;y=m}fe(c[b+12>>2]|0,y,0);z=a[n]|0;A=c[l>>2]|0}else{z=r;A=h}if(((z&255)+1|0)>(A|0)){z=p+28|0;c[z>>2]=ft(c[b+16>>2]|0,c[z>>2]|0,l,4,2147483645,10560)|0;B=c[l>>2]|0;C=z}else{B=A;C=p+28|0}if((h|0)<(B|0)){B=h;while(1){h=B+1|0;c[(c[C>>2]|0)+(B<<2)>>2]=0;if((h|0)<(c[l>>2]|0)){B=h}else{break}}}c[(c[C>>2]|0)+((d[n]|0)<<2)>>2]=f;C=f;do{if((a[f+5|0]&3)!=0){if((a[p+5|0]&4)==0){break}e7(c[b+16>>2]|0,p,C)}}while(0);a[b+51+((d[n]|0)<<1)|0]=c[g>>2]&255;a[b+51+((d[n]|0)<<1)+1|0]=c[g+8>>2]&255;b=a[n]|0;a[n]=b+1&255;v=b&255}c[g+8>>2]=v;c[g>>2]=7;k=7;i=j;return k|0}function fR(b,f,g,h,j){b=b|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;k=i;i=i+16|0;l=k|0;m=b+48|0;n=c[m>>2]|0;o=n+50|0;p=(a[o]|0)+3&255;a[o]=p;q=n+24|0;r=n|0;c[(c[(c[r>>2]|0)+24>>2]|0)+((e[n+172+((p&255)-3<<1)>>1]|0)*12|0)+4>>2]=c[q>>2];c[(c[(c[r>>2]|0)+24>>2]|0)+((e[n+172+((d[o]|0)-2<<1)>>1]|0)*12|0)+4>>2]=c[q>>2];c[(c[(c[r>>2]|0)+24>>2]|0)+((e[n+172+((d[o]|0)-1<<1)>>1]|0)*12|0)+4>>2]=c[q>>2];if((c[b+16>>2]|0)!=259){q=c[b+52>>2]|0;r=fd(b,259)|0;p=fy(q,7112,(q=i,i=i+8|0,c[q>>2]=r,q)|0)|0;i=q;ff(b,p)}fi(b);p=(j|0)!=0;if(p){s=dN(n,32,f,131070)|0}else{s=dM(n)|0}c[l+4>>2]=-1;a[l+10|0]=0;a[l+8|0]=a[o]|0;a[l+9|0]=0;j=n+20|0;c[l>>2]=c[j>>2];c[j>>2]=l;l=c[m>>2]|0;m=l+50|0;q=(d[m]|0)+h|0;a[m]=q&255;do{if((h|0)!=0){r=l+24|0;t=l|0;c[(c[(c[t>>2]|0)+24>>2]|0)+((e[l+172+((q&255)-h<<1)>>1]|0)*12|0)+4>>2]=c[r>>2];u=h-1|0;if((u|0)==0){break}else{v=u}do{c[(c[(c[t>>2]|0)+24>>2]|0)+((e[l+172+((d[m]|0)-v<<1)>>1]|0)*12|0)+4>>2]=c[r>>2];v=v-1|0;}while((v|0)!=0)}}while(0);dT(n,h);fE(b);b=c[j>>2]|0;c[j>>2]=c[b>>2];j=b+8|0;v=a[j]|0;m=c[(c[n+12>>2]|0)+48>>2]|0;l=m+50|0;q=a[l]|0;if((q&255)>(v&255)){r=m+24|0;t=m|0;u=q;do{q=c[r>>2]|0;w=u-1&255;a[l]=w;c[(c[(c[t>>2]|0)+24>>2]|0)+((e[m+172+((w&255)<<1)>>1]|0)*12|0)+8>>2]=q;u=a[l]|0;}while((u&255)>(v&255))}if((a[b+9|0]|0)!=0){v=d[j]|0;dL(n,35,v,0,0)|0}c[n+36>>2]=d[o]|0;dR(n,c[b+4>>2]|0);dR(n,s);if(p){p=dN(n,31,f,131070)|0;ea(n,g);x=p;y=s+1|0;dQ(n,x,y);i=k;return}else{dL(n,33,f,0,h)|0;ea(n,g);x=dM(n)|0;y=s+1|0;dQ(n,x,y);i=k;return}}function fS(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;i=i+24|0;d=b|0;fi(a);fI(a,d,0)|0;e=d|0;if((c[e>>2]|0)==1){c[e>>2]=3}d5(c[a+48>>2]|0,d);e=c[d+20>>2]|0;if((c[a+16>>2]|0)==274){fi(a);fE(a);i=b;return e|0}d=c[a+52>>2]|0;f=fd(a,274)|0;g=fy(d,7112,(d=i,i=i+8|0,c[d>>2]=f,d)|0)|0;i=d;ff(a,g);fi(a);fE(a);i=b;return e|0}function fT(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;d=fu(b,0,0,120)|0;e3(b,d,8);c[d+16>>2]=c[b+16>>2];e=d+32|0;c[e>>2]=0;f=d+44|0;c[f>>2]=0;c[d+112>>2]=0;g=d+68|0;c[g>>2]=0;h=d+56|0;a[h]=0;i=d+60|0;c[i>>2]=0;a[d+57|0]=1;j=d+64|0;c[j>>2]=0;c[d+104>>2]=0;k=d+48|0;a[d+6|0]=0;l=d+20|0;c[l>>2]=0;m=d+40|0;c[m>>2]=0;c[d+24>>2]=0;c[d+116>>2]=0;n=d+80|0;c[n>>2]=0;o=k;c[o>>2]=0;c[o+4>>2]=0;o=fu(b,0,0,192)|0;p=o;c[m>>2]=p;c[l>>2]=p;c[k>>2]=8;c[d+36>>2]=o+168;o=fu(b,0,0,720)|0;k=o;c[e>>2]=k;c[f>>2]=45;f=d+8|0;c[f>>2]=k;c[d+28>>2]=o+624;c[(c[l>>2]|0)+4>>2]=k;k=c[f>>2]|0;c[f>>2]=k+16;c[k+8>>2]=0;k=c[f>>2]|0;c[c[l>>2]>>2]=k;c[d+12>>2]=k;c[(c[l>>2]|0)+8>>2]=(c[f>>2]|0)+320;f=b+72|0;l=d+72|0;k=c[f+4>>2]|0;c[l>>2]=c[f>>2];c[l+4>>2]=k;c[n>>2]=c[b+80>>2];a[h]=a[b+56|0]|0;h=c[b+60>>2]|0;c[i>>2]=h;c[g>>2]=c[b+68>>2];c[j>>2]=h;return d|0}function fU(a,b){a=a|0;b=b|0;var d=0;d=b+32|0;eU(b,c[d>>2]|0);fu(a,c[b+40>>2]|0,(c[b+48>>2]|0)*24|0,0)|0;fu(a,c[d>>2]|0,c[b+44>>2]<<4,0)|0;fu(a,b,120,0)|0;return}function fV(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;e=cg[b&511](d,0,0,376)|0;if((e|0)==0){f=0;return f|0}g=e;h=e+120|0;c[e>>2]=0;a[e+4|0]=8;a[e+140|0]=33;a[e+5|0]=97;i=e+16|0;c[i>>2]=h;j=e+32|0;c[j>>2]=0;k=e+44|0;c[k>>2]=0;c[e+112>>2]=0;c[e+68>>2]=0;a[e+56|0]=0;c[e+60>>2]=0;a[e+57|0]=1;c[e+64>>2]=0;c[e+104>>2]=0;l=e+48|0;a[e+6|0]=0;c[e+20>>2]=0;m=e+40|0;c[m>>2]=0;c[e+24>>2]=0;c[e+116>>2]=0;c[e+80>>2]=0;n=l;c[n>>2]=0;c[n+4>>2]=0;c[e+132>>2]=b;c[e+136>>2]=d;c[e+232>>2]=g;d=e+240|0;c[e+256>>2]=d;c[e+260>>2]=d;c[e+184>>2]=0;c[e+128>>2]=0;c[e+124>>2]=0;c[h>>2]=0;c[e+224>>2]=0;c[e+172>>2]=0;c[e+180>>2]=0;c[e+208>>2]=0;a[e+141|0]=0;h=e+148|0;c[h>>2]=e;c[e+144>>2]=0;c[e+152>>2]=h;j2(e+156|0,0,16);c[e+188>>2]=376;c[e+200>>2]=200;c[e+204>>2]=200;c[e+196>>2]=0;j2(e+272|0,0,36);if((ex(g,254,0)|0)==0){f=g;return f|0}h=c[i>>2]|0;eU(g,c[j>>2]|0);e$(g);d=c[i>>2]|0;fu(g,c[d>>2]|0,c[d+8>>2]<<2,0)|0;d=h+52|0;i=h+60|0;c[d>>2]=fu(g,c[d>>2]|0,c[i>>2]|0,0)|0;c[i>>2]=0;fu(g,c[m>>2]|0,(c[l>>2]|0)*24|0,0)|0;fu(g,c[j>>2]|0,c[k>>2]<<4,0)|0;cg[c[h+12>>2]&511](c[h+16>>2]|0,e,376,0)|0;f=0;return f|0}function fW(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;d=b+16|0;e=c[d>>2]|0;f=fu(b,0,0,192)|0;g=f;c[b+40>>2]=g;h=b+20|0;c[h>>2]=g;c[b+48>>2]=8;c[b+36>>2]=f+168;f=fu(b,0,0,720)|0;g=f;c[b+32>>2]=g;c[b+44>>2]=45;i=b+8|0;c[i>>2]=g;c[b+28>>2]=f+624;c[(c[h>>2]|0)+4>>2]=g;g=c[i>>2]|0;c[i>>2]=g+16;c[g+8>>2]=0;g=c[i>>2]|0;c[c[h>>2]>>2]=g;c[b+12>>2]=g;c[(c[h>>2]|0)+8>>2]=(c[i>>2]|0)+320;c[b+72>>2]=f5(b,0,2)|0;c[b+80>>2]=5;i=c[d>>2]|0;c[i+96>>2]=f5(b,0,2)|0;c[i+104>>2]=5;fZ(b,32);ge(b);fc(b);i=(f_(b,8768,17)|0)+5|0;a[i]=a[i]|32;c[e+64>>2]=c[e+68>>2]<<2;return}function fX(a){a=a|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;d=c[(c[a+16>>2]|0)+112>>2]|0;a=d+32|0;eU(d,c[a>>2]|0);eY(d,1)|0;c[d+116>>2]=0;e=d+40|0;f=d+20|0;g=d+8|0;h=d+12|0;i=d+54|0;j=d+52|0;do{k=c[e>>2]|0;c[f>>2]=k;l=c[k>>2]|0;c[g>>2]=l;c[h>>2]=l;b[i>>1]=0;b[j>>1]=0;}while((ex(d,256,0)|0)!=0);j=d+16|0;i=c[j>>2]|0;eU(d,c[a>>2]|0);e$(d);h=c[j>>2]|0;fu(d,c[h>>2]|0,c[h+8>>2]<<2,0)|0;h=i+52|0;j=i+60|0;c[h>>2]=fu(d,c[h>>2]|0,c[j>>2]|0,0)|0;c[j>>2]=0;fu(d,c[e>>2]|0,(c[d+48>>2]|0)*24|0,0)|0;fu(d,c[a>>2]|0,c[d+44>>2]<<4,0)|0;cg[c[i+12>>2]&511](c[i+16>>2]|0,d,376,0)|0;return}function fY(a,b){a=a|0;b=b|0;eZ(a);return}function fZ(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;e=b+16|0;if((a[(c[e>>2]|0)+21|0]|0)==2){return}if((d+1|0)>>>0<1073741824){f=fu(b,0,0,d<<2)|0}else{f=fv(b)|0}g=f;h=c[e>>2]|0;if((d|0)>0){j2(f|0,0,d<<2|0)}f=h+8|0;e=c[f>>2]|0;i=h|0;h=c[i>>2]|0;if((e|0)>0){j=d-1|0;k=0;l=h;m=e;while(1){n=c[l+(k<<2)>>2]|0;if((n|0)==0){o=m;p=l}else{q=n;while(1){n=q|0;r=c[n>>2]|0;s=g+((c[q+8>>2]&j)<<2)|0;c[n>>2]=c[s>>2];c[s>>2]=q;if((r|0)==0){break}else{q=r}}o=c[f>>2]|0;p=c[i>>2]|0}q=k+1|0;if((q|0)<(o|0)){k=q;l=p;m=o}else{t=o;u=p;break}}}else{t=e;u=h}fu(b,u,t<<2,0)|0;c[f>>2]=d;c[i>>2]=g;return}function f_(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;g=(f>>>5)+1|0;if(g>>>0>f>>>0){h=f}else{i=f;j=f;while(1){k=(i<<5)+(i>>>2)+(d[e+(j-1)|0]|0)^i;l=j-g|0;if(l>>>0<g>>>0){h=k;break}else{i=k;j=l}}}j=b+16|0;i=c[j>>2]|0;g=c[(c[i>>2]|0)+(((c[i+8>>2]|0)-1&h)<<2)>>2]|0;L449:do{if((g|0)!=0){l=g;while(1){if((c[l+12>>2]|0)==(f|0)){m=l;if((j5(e|0,l+16|0,f|0)|0)==0){break}}k=c[l>>2]|0;if((k|0)==0){break L449}else{l=k}}k=l+5|0;n=a[k]|0;if((n&3&((d[i+20|0]|0)^3)|0)==0){o=m;return o|0}a[k]=n^3;o=m;return o|0}}while(0);if((f+1|0)>>>0>4294967277){fv(b)|0}m=fu(b,0,0,f+17|0)|0;i=m;c[m+12>>2]=f;c[m+8>>2]=h;a[m+5|0]=a[(c[j>>2]|0)+20|0]&3;a[m+4|0]=4;a[m+6|0]=0;g=m+16|0;j$(g|0,e|0,f)|0;a[m+(f+16)|0]=0;f=c[j>>2]|0;j=f+8|0;e=(c[j>>2]|0)-1&h;h=f|0;c[m>>2]=c[(c[h>>2]|0)+(e<<2)>>2];c[(c[h>>2]|0)+(e<<2)>>2]=m;m=f+4|0;f=(c[m>>2]|0)+1|0;c[m>>2]=f;m=c[j>>2]|0;if(!(f>>>0>m>>>0&(m|0)<1073741823)){o=i;return o|0}fZ(b,m<<1);o=i;return o|0}function f$(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0;if(d>>>0>4294967269){fv(b)|0}f=fu(b,0,0,d+24|0)|0;g=b+16|0;a[f+5|0]=a[(c[g>>2]|0)+20|0]&3;a[f+4|0]=7;c[f+16>>2]=d;c[f+8>>2]=0;c[f+12>>2]=e;c[f>>2]=c[c[(c[g>>2]|0)+112>>2]>>2];c[c[(c[g>>2]|0)+112>>2]>>2]=f;return f|0}function f0(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,j=0,k=0,l=0,m=0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;f=i;g=e+8|0;L473:do{switch(c[g>>2]|0){case 4:{j=(c[b+16>>2]|0)+(((1<<(d[b+7|0]|0))-1&c[(c[e>>2]|0)+8>>2])<<5)|0;k=370;break};case 1:{j=(c[b+16>>2]|0)+(((1<<(d[b+7|0]|0))-1&c[e>>2])<<5)|0;k=370;break};case 2:{j=(c[b+16>>2]|0)+((((c[e>>2]|0)>>>0)%(((1<<(d[b+7|0]|0))-1|1)>>>0)|0)<<5)|0;k=370;break};case 0:{l=-1;break};case 3:{m=e|0;n=+h[m>>3];o=c[m>>2]|0;p=c[m+4>>2]|0;m=~~n;do{if(+(m|0)==n&(m|0)>0){if((m|0)>(c[b+28>>2]|0)){break}l=m-1|0;break L473}}while(0);if(n==0.0){j=c[b+16>>2]|0;k=370;break L473}else{j=(c[b+16>>2]|0)+((((p+o|0)>>>0)%(((1<<(d[b+7|0]|0))-1|1)>>>0)|0)<<5)|0;k=370;break L473}break};default:{j=(c[b+16>>2]|0)+((((c[e>>2]|0)>>>0)%(((1<<(d[b+7|0]|0))-1|1)>>>0)|0)<<5)|0;k=370}}}while(0);do{if((k|0)==370){m=e;q=j;L488:while(1){r=q+16|0;if((fr(r,e)|0)!=0){k=375;break}do{if((c[q+24>>2]|0)==11){if((c[g>>2]|0)<=3){break}if((c[r>>2]|0)==(c[m>>2]|0)){k=375;break L488}}}while(0);r=c[q+28>>2]|0;if((r|0)==0){k=377;break}else{q=r}}if((k|0)==375){l=(q-(c[b+16>>2]|0)>>5)+(c[b+28>>2]|0)|0;break}else if((k|0)==377){es(a,6216,(m=i,i=i+1|0,i=i+7>>3<<3,c[m>>2]=0,m)|0);i=m;l=0;break}}}while(0);a=c[b+28>>2]|0;j=b+12|0;m=l;while(1){s=m+1|0;if((s|0)>=(a|0)){break}if((c[(c[j>>2]|0)+(s<<4)+8>>2]|0)==0){m=s}else{k=381;break}}if((k|0)==381){h[e>>3]=+(m+2|0);c[g>>2]=3;m=c[j>>2]|0;j=m+(s<<4)|0;l=e+16|0;o=c[j+4>>2]|0;c[l>>2]=c[j>>2];c[l+4>>2]=o;c[e+24>>2]=c[m+(s<<4)+8>>2];t=1;i=f;return t|0}m=1<<(d[b+7|0]|0);o=b+16|0;b=s-a|0;while(1){if((b|0)>=(m|0)){t=0;k=389;break}u=c[o>>2]|0;if((c[u+(b<<5)+8>>2]|0)==0){b=b+1|0}else{break}}if((k|0)==389){i=f;return t|0}k=u+(b<<5)+16|0;m=e;a=c[k+4>>2]|0;c[m>>2]=c[k>>2];c[m+4>>2]=a;c[g>>2]=c[u+(b<<5)+24>>2];u=c[o>>2]|0;o=u+(b<<5)|0;g=e+16|0;a=c[o+4>>2]|0;c[g>>2]=c[o>>2];c[g+4>>2]=a;c[e+24>>2]=c[u+(b<<5)+8>>2];t=1;i=f;return t|0}function f1(a,b,e){a=a|0;b=b|0;e=e|0;var f=0;if((c[b+16>>2]|0)==1656){f=0}else{f=1<<(d[b+7|0]|0)}f2(a,b,e,f);return}function f2(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0.0,B=0,C=0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;j=i;i=i+16|0;l=j|0;m=e+28|0;n=c[m>>2]|0;o=e+7|0;p=d[o]|0;q=e+16|0;r=c[q>>2]|0;if((n|0)<(f|0)){if((f+1|0)>>>0<268435456){s=e+12|0;t=fu(b,c[s>>2]|0,n<<4,f<<4)|0;u=s}else{t=fv(b)|0;u=e+12|0}s=t;c[u>>2]=s;t=c[m>>2]|0;do{if((t|0)<(f|0)){c[s+(t<<4)+8>>2]=0;v=t+1|0;if((v|0)<(f|0)){w=v}else{break}do{c[(c[u>>2]|0)+(w<<4)+8>>2]=0;w=w+1|0;}while((w|0)<(f|0))}}while(0);c[m>>2]=f}f6(b,e,g);if((n|0)>(f|0)){c[m>>2]=f;g=e+12|0;w=l|0;u=l+8|0;t=f;while(1){s=c[g>>2]|0;v=s+(t<<4)+8|0;x=t+1|0;if((c[v>>2]|0)!=0){L536:do{if(t>>>0<(c[m>>2]|0)>>>0){y=s+(t<<4)|0;z=413}else{A=+(x|0);if((x|0)==0){B=c[q>>2]|0}else{h[k>>3]=A;B=(c[q>>2]|0)+(((((c[k+4>>2]|0)+(c[k>>2]|0)|0)>>>0)%(((1<<(d[o]|0))-1|1)>>>0)|0)<<5)|0}while(1){if((c[B+24>>2]|0)==3){if(+h[B+16>>3]==A){break}}C=c[B+28>>2]|0;if((C|0)==0){E=A;z=415;break L536}else{B=C}}y=B|0;z=413}}while(0);do{if((z|0)==413){z=0;if((y|0)!=1032){F=y;break}E=+(x|0);z=415}}while(0);if((z|0)==415){z=0;h[w>>3]=E;c[u>>2]=3;F=gb(b,e,l)|0}C=s+(t<<4)|0;G=F;H=c[C+4>>2]|0;c[G>>2]=c[C>>2];c[G+4>>2]=H;c[F+8>>2]=c[v>>2]}if((x|0)<(n|0)){t=x}else{break}}if((f+1|0)>>>0<268435456){t=e+12|0;I=fu(b,c[t>>2]|0,n<<4,f<<4)|0;J=t}else{I=fv(b)|0;J=e+12|0}c[J>>2]=I}I=1<<p;if((I|0)>0){p=e+6|0;J=I;do{J=J-1|0;t=r+(J<<5)+8|0;if((c[t>>2]|0)!=0){f=r+(J<<5)|0;n=r+(J<<5)+16|0;F=n;l=f8(e,F)|0;a[p]=0;if((l|0)==1032){u=c[r+(J<<5)+24>>2]|0;do{if((u|0)==3){E=+h[n>>3];if(E==E&!(D=0.0,D!=D)){break}es(b,10016,(K=i,i=i+1|0,i=i+7>>3<<3,c[K>>2]=0,K)|0);i=K}else if((u|0)==0){es(b,8512,(K=i,i=i+1|0,i=i+7>>3<<3,c[K>>2]=0,K)|0);i=K}}while(0);L=gb(b,e,F)|0}else{L=l}u=f;n=L;x=c[u+4>>2]|0;c[n>>2]=c[u>>2];c[n+4>>2]=x;c[L+8>>2]=c[t>>2]}}while((J|0)>0)}if((r|0)==1656){i=j;return}fu(b,r,I<<5,0)|0;i=j;return}function f3(a,b){a=a|0;b=b|0;var e=0,f=0,g=0.0,i=0,j=0;e=b-1|0;if(e>>>0<(c[a+28>>2]|0)>>>0){f=(c[a+12>>2]|0)+(e<<4)|0;return f|0}g=+(b|0);if((b|0)==0){i=c[a+16>>2]|0}else{h[k>>3]=g;i=(c[a+16>>2]|0)+(((((c[k+4>>2]|0)+(c[k>>2]|0)|0)>>>0)%(((1<<(d[a+7|0]|0))-1|1)>>>0)|0)<<5)|0}while(1){if((c[i+24>>2]|0)==3){if(+h[i+16>>3]==g){break}}a=c[i+28>>2]|0;if((a|0)==0){f=1032;j=449;break}else{i=a}}if((j|0)==449){return f|0}f=i|0;return f|0}function f4(a,b){a=a|0;b=b|0;var e=0,f=0,g=0;e=(c[a+16>>2]|0)+(((1<<(d[a+7|0]|0))-1&c[b+8>>2])<<5)|0;while(1){if((c[e+24>>2]|0)==4){if((c[e+16>>2]|0)==(b|0)){break}}a=c[e+28>>2]|0;if((a|0)==0){f=1032;g=458;break}else{e=a}}if((g|0)==458){return f|0}f=e|0;return f|0}function f5(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0;f=fu(b,0,0,32)|0;g=f;e3(b,f,5);c[f+8>>2]=0;a[f+6|0]=-1;h=f+12|0;c[h>>2]=0;i=f+28|0;c[i>>2]=0;a[f+7|0]=0;c[f+16>>2]=1656;if((d+1|0)>>>0<268435456){j=fu(b,0,0,d<<4)|0}else{j=fv(b)|0}f=j;c[h>>2]=f;j=c[i>>2]|0;if((j|0)>=(d|0)){c[i>>2]=d;f6(b,g,e);return g|0}c[f+(j<<4)+8>>2]=0;f=j+1|0;if((f|0)<(d|0)){k=f}else{c[i>>2]=d;f6(b,g,e);return g|0}do{c[(c[h>>2]|0)+(k<<4)+8>>2]=0;k=k+1|0;}while((k|0)<(d|0));c[i>>2]=d;f6(b,g,e);return g|0}function f6(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;f=i;do{if((e|0)==0){c[d+16>>2]=1656;g=0;h=0;j=1656}else{k=(fq(e-1|0)|0)+1|0;if((k|0)>26){es(b,8040,(l=i,i=i+1|0,i=i+7>>3<<3,c[l>>2]=0,l)|0);i=l}l=1<<k;if((l+1|0)>>>0<134217728){m=fu(b,0,0,l<<5)|0}else{m=fv(b)|0}n=m;o=d+16|0;c[o>>2]=n;p=k&255;if((l|0)>0){q=0;r=n}else{g=l;h=p;j=n;break}while(1){c[r+(q<<5)+28>>2]=0;c[r+(q<<5)+24>>2]=0;c[r+(q<<5)+8>>2]=0;n=q+1|0;k=c[o>>2]|0;if((n|0)<(l|0)){q=n;r=k}else{g=l;h=p;j=k;break}}}}while(0);a[d+7|0]=h;c[d+20>>2]=j+(g<<5);i=f;return}function f7(a,b){a=a|0;b=b|0;var e=0,f=0;e=c[b+16>>2]|0;if((e|0)!=1656){f=e;e=32<<(d[b+7|0]|0);fu(a,f,e,0)|0}fu(a,c[b+12>>2]|0,c[b+28>>2]<<4,0)|0;fu(a,b,32,0)|0;return}function f8(a,b){a=a|0;b=b|0;var e=0,f=0,g=0.0,i=0,j=0.0,l=0,m=0,n=0,o=0;L640:do{switch(c[b+8>>2]|0){case 0:{e=1032;return e|0};case 1:{f=(c[a+16>>2]|0)+(((1<<(d[a+7|0]|0))-1&c[b>>2])<<5)|0;break};case 2:{f=(c[a+16>>2]|0)+((((c[b>>2]|0)>>>0)%(((1<<(d[a+7|0]|0))-1|1)>>>0)|0)<<5)|0;break};case 3:{g=+h[b>>3];i=~~g;j=+(i|0);if(j!=g){l=b|0;if(+h[l>>3]==0.0){f=c[a+16>>2]|0;break L640}else{f=(c[a+16>>2]|0)+(((((c[l+4>>2]|0)+(c[l>>2]|0)|0)>>>0)%(((1<<(d[a+7|0]|0))-1|1)>>>0)|0)<<5)|0;break L640}}l=i-1|0;if(l>>>0<(c[a+28>>2]|0)>>>0){e=(c[a+12>>2]|0)+(l<<4)|0;return e|0}if((i|0)==0){m=c[a+16>>2]|0}else{h[k>>3]=j;m=(c[a+16>>2]|0)+(((((c[k+4>>2]|0)+(c[k>>2]|0)|0)>>>0)%(((1<<(d[a+7|0]|0))-1|1)>>>0)|0)<<5)|0}while(1){if((c[m+24>>2]|0)==3){if(+h[m+16>>3]==j){break}}i=c[m+28>>2]|0;if((i|0)==0){e=1032;n=514;break}else{m=i}}if((n|0)==514){return e|0}e=m|0;return e|0};case 4:{i=c[b>>2]|0;l=(c[a+16>>2]|0)+(((1<<(d[a+7|0]|0))-1&c[i+8>>2])<<5)|0;while(1){if((c[l+24>>2]|0)==4){if((c[l+16>>2]|0)==(i|0)){break}}o=c[l+28>>2]|0;if((o|0)==0){e=1032;n=511;break}else{l=o}}if((n|0)==511){return e|0}e=l|0;return e|0};default:{f=(c[a+16>>2]|0)+((((c[b>>2]|0)>>>0)%(((1<<(d[a+7|0]|0))-1|1)>>>0)|0)<<5)|0}}}while(0);while(1){if((fr(f+16|0,b)|0)!=0){break}a=c[f+28>>2]|0;if((a|0)==0){e=1032;n=510;break}else{f=a}}if((n|0)==510){return e|0}e=f|0;return e|0}function f9(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,j=0,k=0,l=0.0;f=i;g=f8(d,e)|0;a[d+6|0]=0;if((g|0)!=1032){j=g;i=f;return j|0}g=c[e+8>>2]|0;do{if((g|0)==0){es(b,8512,(k=i,i=i+1|0,i=i+7>>3<<3,c[k>>2]=0,k)|0);i=k}else if((g|0)==3){l=+h[e>>3];if(l==l&!(D=0.0,D!=D)){break}es(b,10016,(k=i,i=i+1|0,i=i+7>>3<<3,c[k>>2]=0,k)|0);i=k}}while(0);j=gb(b,d,e)|0;i=f;return j|0}function ga(a){a=a|0;var b=0,e=0,f=0,g=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0.0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;b=c[a+28>>2]|0;do{if((b|0)!=0){e=c[a+12>>2]|0;if((c[e+(b-1<<4)+8>>2]|0)!=0){break}if(b>>>0>1){f=b;g=0}else{i=0;return i|0}while(1){j=(g+f|0)>>>1;l=(c[e+(j-1<<4)+8>>2]|0)==0;m=l?j:f;n=l?g:j;if((m-n|0)>>>0>1){f=m;g=n}else{i=n;break}}return i|0}}while(0);g=c[a+16>>2]|0;if((g|0)==1656){i=b;return i|0}f=a+12|0;e=a+7|0;a=b;n=b+1|0;while(1){m=n-1|0;L710:do{if(m>>>0<b>>>0){o=(c[f>>2]|0)+(m<<4)|0}else{p=+(n|0);if((n|0)==0){q=g}else{h[k>>3]=p;q=g+(((((c[k+4>>2]|0)+(c[k>>2]|0)|0)>>>0)%(((1<<(d[e]|0))-1|1)>>>0)|0)<<5)|0}while(1){if((c[q+24>>2]|0)==3){if(+h[q+16>>3]==p){break}}j=c[q+28>>2]|0;if((j|0)==0){o=1032;break L710}else{q=j}}o=q|0}}while(0);if((c[o+8>>2]|0)==0){break}m=n<<1;if(m>>>0>2147483645){r=1;s=542;break}else{a=n;n=m}}if((s|0)==542){while(1){s=0;o=r-1|0;L726:do{if(o>>>0<b>>>0){t=(c[f>>2]|0)+(o<<4)|0}else{p=+(r|0);if((r|0)==0){u=g}else{h[k>>3]=p;u=g+(((((c[k+4>>2]|0)+(c[k>>2]|0)|0)>>>0)%(((1<<(d[e]|0))-1|1)>>>0)|0)<<5)|0}while(1){if((c[u+24>>2]|0)==3){if(+h[u+16>>3]==p){break}}q=c[u+28>>2]|0;if((q|0)==0){t=1032;break L726}else{u=q}}t=u|0}}while(0);if((c[t+8>>2]|0)==0){i=o;break}else{r=r+1|0;s=542}}return i|0}if((n-a|0)>>>0>1){v=n;w=a}else{i=a;return i|0}while(1){a=(v+w|0)>>>1;n=a-1|0;L744:do{if(n>>>0<b>>>0){x=(c[f>>2]|0)+(n<<4)|0}else{p=+(a|0);if((a|0)==0){y=g}else{h[k>>3]=p;y=g+(((((c[k+4>>2]|0)+(c[k>>2]|0)|0)>>>0)%(((1<<(d[e]|0))-1|1)>>>0)|0)<<5)|0}while(1){if((c[y+24>>2]|0)==3){if(+h[y+16>>3]==p){break}}s=c[y+28>>2]|0;if((s|0)==0){x=1032;break L744}else{y=s}}x=y|0}}while(0);n=(c[x+8>>2]|0)==0;o=n?a:v;s=n?w:a;if((o-s|0)>>>0>1){v=o;w=s}else{i=s;break}}return i|0}function gb(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0.0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0;g=i;i=i+112|0;j=g|0;k=j;l=f+8|0;m=c[l>>2]|0;do{if((m|0)==2){n=c[e+16>>2]|0;o=n+((((c[f>>2]|0)>>>0)%(((1<<(d[e+7|0]|0))-1|1)>>>0)|0)<<5)|0;p=n}else if((m|0)==1){n=c[e+16>>2]|0;o=n+(((1<<(d[e+7|0]|0))-1&c[f>>2])<<5)|0;p=n}else if((m|0)==3){n=f|0;if(+h[n>>3]==0.0){q=c[e+16>>2]|0;o=q;p=q;break}else{q=c[e+16>>2]|0;o=q+(((((c[n+4>>2]|0)+(c[n>>2]|0)|0)>>>0)%(((1<<(d[e+7|0]|0))-1|1)>>>0)|0)<<5)|0;p=q;break}}else if((m|0)==4){q=c[e+16>>2]|0;o=q+(((1<<(d[e+7|0]|0))-1&c[(c[f>>2]|0)+8>>2])<<5)|0;p=q}else{q=c[e+16>>2]|0;o=q+((((c[f>>2]|0)>>>0)%(((1<<(d[e+7|0]|0))-1|1)>>>0)|0)<<5)|0;p=q}}while(0);m=o+8|0;L768:do{if((c[m>>2]|0)!=0|(o|0)==1656){q=e+20|0;n=e+16|0;r=c[q>>2]|0;while(1){s=r-32|0;c[q>>2]=s;if(r>>>0<=p>>>0){break}if((c[r-32+24>>2]|0)==0){t=579;break}else{r=s}}do{if((t|0)==579){if((s|0)==0){break}q=o+16|0;u=c[o+24>>2]|0;do{if((u|0)==4){v=p+(((1<<(d[e+7|0]|0))-1&c[(c[q>>2]|0)+8>>2])<<5)|0}else if((u|0)==1){v=p+(((1<<(d[e+7|0]|0))-1&c[q>>2])<<5)|0}else if((u|0)==2){v=p+((((c[q>>2]|0)>>>0)%(((1<<(d[e+7|0]|0))-1|1)>>>0)|0)<<5)|0}else if((u|0)==3){w=q|0;if(+h[w>>3]==0.0){v=p;break}v=p+(((((c[w+4>>2]|0)+(c[w>>2]|0)|0)>>>0)%(((1<<(d[e+7|0]|0))-1|1)>>>0)|0)<<5)|0}else{v=p+((((c[q>>2]|0)>>>0)%(((1<<(d[e+7|0]|0))-1|1)>>>0)|0)<<5)|0}}while(0);if((v|0)==(o|0)){q=o+28|0;c[r-32+28>>2]=c[q>>2];c[q>>2]=s;x=s;break L768}else{y=v}do{z=y+28|0;y=c[z>>2]|0;}while((y|0)!=(o|0));c[z>>2]=s;q=s;u=o;c[q>>2]=c[u>>2];c[q+4>>2]=c[u+4>>2];c[q+8>>2]=c[u+8>>2];c[q+12>>2]=c[u+12>>2];c[q+16>>2]=c[u+16>>2];c[q+20>>2]=c[u+20>>2];c[q+24>>2]=c[u+24>>2];c[q+28>>2]=c[u+28>>2];c[o+28>>2]=0;c[m>>2]=0;x=o;break L768}}while(0);j2(k|0,0,108);r=e+12|0;u=c[e+28>>2]|0;q=0;w=1;A=0;B=1;while(1){if((w|0)>(u|0)){if((B|0)>(u|0)){C=A;break}else{E=u}}else{E=w}if((B|0)>(E|0)){F=B;G=0}else{H=c[r>>2]|0;I=B;J=0;while(1){K=((c[H+(I-1<<4)+8>>2]|0)!=0)+J|0;L=I+1|0;if((L|0)>(E|0)){F=L;G=K;break}else{I=L;J=K}}}J=j+(q<<2)|0;c[J>>2]=(c[J>>2]|0)+G;J=G+A|0;I=q+1|0;if((I|0)<27){q=I;w=w<<1;A=J;B=F}else{C=J;break}}B=0;A=1<<(d[e+7|0]|0);w=0;L801:while(1){q=A;while(1){M=q-1|0;if((q|0)==0){break L801}N=c[n>>2]|0;if((c[N+(M<<5)+8>>2]|0)==0){q=M}else{break}}do{if((c[N+(M<<5)+24>>2]|0)==3){O=+h[N+(M<<5)+16>>3];q=~~O;r=q-1|0;if(!(+(q|0)==O&r>>>0<67108864)){P=0;break}q=j+((fq(r)|0)+1<<2)|0;c[q>>2]=(c[q>>2]|0)+1;P=1}else{P=0}}while(0);B=B+1|0;A=M;w=P+w|0}A=w+C|0;do{if((c[l>>2]|0)==3){O=+h[f>>3];n=~~O;q=n-1|0;if(!(+(n|0)==O&q>>>0<67108864)){Q=0;break}n=j+((fq(q)|0)+1<<2)|0;c[n>>2]=(c[n>>2]|0)+1;Q=1}else{Q=0}}while(0);w=A+Q|0;L816:do{if((w|0)>0){n=0;q=1;r=0;u=0;J=0;I=0;while(1){H=c[j+(n<<2)>>2]|0;if((H|0)>0){K=H+r|0;H=(K|0)>(I|0);R=H?q:J;S=H?K:u;T=K}else{R=J;S=u;T=r}if((T|0)==(w|0)){U=R;V=S;break L816}K=q<<1;H=(K|0)/2|0;if((H|0)<(w|0)){n=n+1|0;q=K;r=T;u=S;J=R;I=H}else{U=R;V=S;break}}}else{U=0;V=0}}while(0);f2(b,e,U,C+1+B-V|0);w=f8(e,f)|0;a[e+6|0]=0;if((w|0)!=1032){W=w;i=g;return W|0}w=c[l>>2]|0;do{if((w|0)==0){es(b,8512,(X=i,i=i+1|0,i=i+7>>3<<3,c[X>>2]=0,X)|0);i=X}else if((w|0)==3){O=+h[f>>3];if(O==O&!(D=0.0,D!=D)){break}es(b,10016,(X=i,i=i+1|0,i=i+7>>3<<3,c[X>>2]=0,X)|0);i=X}}while(0);W=gb(b,e,f)|0;i=g;return W|0}else{x=o}}while(0);o=f;X=x+16|0;V=c[o+4>>2]|0;c[X>>2]=c[o>>2];c[X+4>>2]=V;c[x+24>>2]=c[l>>2];do{if((c[l>>2]|0)>3){if((a[(c[f>>2]|0)+5|0]&3)==0){break}if((a[e+5|0]&4)==0){break}e2(b,e)}}while(0);W=x|0;i=g;return W|0}function gc(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,j=0,l=0,m=0,n=0.0,o=0,p=0,q=0.0,r=0;f=i;i=i+16|0;g=f|0;j=e-1|0;L841:do{if(j>>>0<(c[b+28>>2]|0)>>>0){l=(c[b+12>>2]|0)+(j<<4)|0;m=638}else{n=+(e|0);if((e|0)==0){o=c[b+16>>2]|0}else{h[k>>3]=n;o=(c[b+16>>2]|0)+(((((c[k+4>>2]|0)+(c[k>>2]|0)|0)>>>0)%(((1<<(d[b+7|0]|0))-1|1)>>>0)|0)<<5)|0}while(1){if((c[o+24>>2]|0)==3){if(+h[o+16>>3]==n){break}}p=c[o+28>>2]|0;if((p|0)==0){q=n;break L841}else{o=p}}l=o|0;m=638}}while(0);do{if((m|0)==638){if((l|0)==1032){q=+(e|0);break}else{r=l;i=f;return r|0}}}while(0);h[g>>3]=q;c[g+8>>2]=3;r=gb(a,b,g)|0;i=f;return r|0}function gd(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;i=i+16|0;g=f|0;h=(c[b+16>>2]|0)+(((1<<(d[b+7|0]|0))-1&c[e+8>>2])<<5)|0;while(1){if((c[h+24>>2]|0)==4){if((c[h+16>>2]|0)==(e|0)){j=648;break}}k=c[h+28>>2]|0;if((k|0)==0){break}else{h=k}}do{if((j|0)==648){k=h|0;if((k|0)==1032){break}else{l=k}i=f;return l|0}}while(0);c[g>>2]=e;c[g+8>>2]=4;l=gb(a,b,g)|0;i=f;return l|0}function ge(b){b=b|0;var d=0,e=0,f=0,g=0;d=b+16|0;e=0;do{f=c[920+(e<<2)>>2]|0;g=f_(b,f,j_(f|0)|0)|0;c[(c[d>>2]|0)+188+(e<<2)>>2]=g;g=(c[(c[d>>2]|0)+188+(e<<2)>>2]|0)+5|0;a[g]=a[g]|32;e=e+1|0;}while((e|0)<17);return}function gf(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0;g=f4(b,f)|0;if((c[g+8>>2]|0)!=0){h=g;return h|0}g=b+6|0;a[g]=(d[g]|0|1<<e)&255;h=0;return h|0}function gg(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=c[b+8>>2]|0;if((e|0)==5){f=c[(c[b>>2]|0)+8>>2]|0}else if((e|0)==7){f=c[(c[b>>2]|0)+8>>2]|0}else{f=c[(c[a+16>>2]|0)+152+(e<<2)>>2]|0}if((f|0)==0){g=1032;return g|0}g=f4(f,c[(c[a+16>>2]|0)+188+(d<<2)>>2]|0)|0;return g|0}function gh(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;g=i;i=i+48|0;h=g|0;j=g+16|0;k=g+32|0;l=a[f]|0;if((l<<24>>24|0)==64|(l<<24>>24|0)==61){m=f+1|0;c[k+12>>2]=m;n=m}else if((l<<24>>24|0)==27){c[k+12>>2]=9800;n=9800}else{c[k+12>>2]=f;n=f}f=k|0;c[f>>2]=b;c[k+4>>2]=d;c[k+8>>2]=e;e=h;l=j|0;c[h>>2]=1635077147;a[h+4|0]=81;a[e+5|0]=0;a[e+6|0]=1;a[e+7|0]=4;a[h+8|0]=4;a[e+9|0]=4;a[e+10|0]=8;a[e+11|0]=0;if((gw(d,l,12)|0)!=0){fy(b,2512,(o=i,i=i+16|0,c[o>>2]=n,c[o+8>>2]=3968,o)|0)|0;i=o;eC(c[f>>2]|0,3)}if((j5(e|0,l|0,12)|0)==0){p=f_(b,7888,2)|0;q=gi(k,p)|0;i=g;return q|0}fy(c[f>>2]|0,2512,(o=i,i=i+16|0,c[o>>2]=c[k+12>>2],c[o+8>>2]=2232,o)|0)|0;i=o;eC(c[f>>2]|0,3);p=f_(b,7888,2)|0;q=gi(k,p)|0;i=g;return q|0}function gi(d,e){d=d|0;e=e|0;var f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0;f=i;i=i+168|0;g=f|0;j=f+8|0;k=f+16|0;l=f+24|0;m=f+32|0;n=f+40|0;o=f+48|0;p=f+56|0;q=f+64|0;r=f+72|0;s=f+80|0;t=f+88|0;u=f+96|0;v=f+104|0;w=f+112|0;x=f+120|0;y=f+128|0;z=f+136|0;A=f+144|0;B=f+152|0;C=f+160|0;D=d|0;E=(c[D>>2]|0)+52|0;F=(b[E>>1]|0)+1&65535;b[E>>1]=F;if((F&65535)>200){F=c[D>>2]|0;E=c[d+12>>2]|0;fy(F,2512,(G=i,i=i+16|0,c[G>>2]=E,c[G+8>>2]=6088,G)|0)|0;i=G;eC(c[D>>2]|0,3)}E=eV(c[D>>2]|0)|0;F=c[(c[D>>2]|0)+8>>2]|0;c[F>>2]=E;c[F+8>>2]=9;F=c[D>>2]|0;H=c[F+8>>2]|0;if(((c[F+28>>2]|0)-H|0)<17){eA(F,1);I=c[D>>2]|0;J=I;K=c[I+8>>2]|0}else{J=F;K=H}c[J+8>>2]=K+16;K=d+4|0;if((gw(c[K>>2]|0,C,4)|0)!=0){J=c[D>>2]|0;H=c[d+12>>2]|0;fy(J,2512,(G=i,i=i+16|0,c[G>>2]=H,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}H=c[C>>2]|0;if((H|0)==0){L=0}else{J=gx(c[D>>2]|0,c[d+8>>2]|0,H)|0;if((gw(c[K>>2]|0,J,c[C>>2]|0)|0)!=0){H=c[D>>2]|0;F=c[d+12>>2]|0;fy(H,2512,(G=i,i=i+16|0,c[G>>2]=F,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}L=f_(c[D>>2]|0,J,(c[C>>2]|0)-1|0)|0}C=E+32|0;c[C>>2]=(L|0)==0?e:L;if((gw(c[K>>2]|0,B,4)|0)!=0){L=c[D>>2]|0;e=c[d+12>>2]|0;fy(L,2512,(G=i,i=i+16|0,c[G>>2]=e,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}e=c[B>>2]|0;if((e|0)<0){L=c[D>>2]|0;J=c[d+12>>2]|0;fy(L,2512,(G=i,i=i+16|0,c[G>>2]=J,c[G+8>>2]=2872,G)|0)|0;i=G;eC(c[D>>2]|0,3);M=c[B>>2]|0}else{M=e}c[E+60>>2]=M;if((gw(c[K>>2]|0,A,4)|0)!=0){M=c[D>>2]|0;e=c[d+12>>2]|0;fy(M,2512,(G=i,i=i+16|0,c[G>>2]=e,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}e=c[A>>2]|0;if((e|0)<0){M=c[D>>2]|0;B=c[d+12>>2]|0;fy(M,2512,(G=i,i=i+16|0,c[G>>2]=B,c[G+8>>2]=2872,G)|0)|0;i=G;eC(c[D>>2]|0,3);N=c[A>>2]|0}else{N=e}c[E+64>>2]=N;if((gw(c[K>>2]|0,z,1)|0)!=0){N=c[D>>2]|0;e=c[d+12>>2]|0;fy(N,2512,(G=i,i=i+16|0,c[G>>2]=e,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}a[E+72|0]=a[z]|0;if((gw(c[K>>2]|0,y,1)|0)!=0){z=c[D>>2]|0;e=c[d+12>>2]|0;fy(z,2512,(G=i,i=i+16|0,c[G>>2]=e,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}a[E+73|0]=a[y]|0;if((gw(c[K>>2]|0,x,1)|0)!=0){y=c[D>>2]|0;e=c[d+12>>2]|0;fy(y,2512,(G=i,i=i+16|0,c[G>>2]=e,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}a[E+74|0]=a[x]|0;if((gw(c[K>>2]|0,w,1)|0)!=0){x=c[D>>2]|0;e=c[d+12>>2]|0;fy(x,2512,(G=i,i=i+16|0,c[G>>2]=e,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}a[E+75|0]=a[w]|0;if((gw(c[K>>2]|0,v,4)|0)!=0){w=c[D>>2]|0;e=c[d+12>>2]|0;fy(w,2512,(G=i,i=i+16|0,c[G>>2]=e,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}e=c[v>>2]|0;if((e|0)<0){w=c[D>>2]|0;x=c[d+12>>2]|0;fy(w,2512,(G=i,i=i+16|0,c[G>>2]=x,c[G+8>>2]=2872,G)|0)|0;i=G;eC(c[D>>2]|0,3);O=c[v>>2]|0}else{O=e}e=c[D>>2]|0;if((O+1|0)>>>0<1073741824){v=O<<2;P=fu(e,0,0,v)|0;Q=v}else{P=fv(e)|0;Q=O<<2}c[E+12>>2]=P;c[E+44>>2]=O;if((gw(c[K>>2]|0,P,Q)|0)!=0){Q=c[D>>2]|0;P=c[d+12>>2]|0;fy(Q,2512,(G=i,i=i+16|0,c[G>>2]=P,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}if((gw(c[K>>2]|0,n,4)|0)!=0){P=c[D>>2]|0;Q=c[d+12>>2]|0;fy(P,2512,(G=i,i=i+16|0,c[G>>2]=Q,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}Q=c[n>>2]|0;if((Q|0)<0){P=c[D>>2]|0;O=c[d+12>>2]|0;fy(P,2512,(G=i,i=i+16|0,c[G>>2]=O,c[G+8>>2]=2872,G)|0)|0;i=G;eC(c[D>>2]|0,3);R=c[n>>2]|0}else{R=Q}Q=c[D>>2]|0;if((R+1|0)>>>0<268435456){S=fu(Q,0,0,R<<4)|0}else{S=fv(Q)|0}Q=S;S=E+8|0;c[S>>2]=Q;c[E+40>>2]=R;n=(R|0)>0;do{if(n){O=0;P=Q;while(1){c[P+(O<<4)+8>>2]=0;e=O+1|0;if((e|0)>=(R|0)){break}O=e;P=c[S>>2]|0}if(!n){break}P=d+12|0;O=k;e=j;v=d+8|0;x=0;do{w=c[S>>2]|0;y=w+(x<<4)|0;if((gw(c[K>>2]|0,m,1)|0)!=0){z=c[D>>2]|0;N=c[P>>2]|0;fy(z,2512,(G=i,i=i+16|0,c[G>>2]=N,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}N=a[m]|0;if((N|0)==0){c[w+(x<<4)+8>>2]=0}else if((N|0)==1){if((gw(c[K>>2]|0,l,1)|0)!=0){z=c[D>>2]|0;A=c[P>>2]|0;fy(z,2512,(G=i,i=i+16|0,c[G>>2]=A,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}c[y>>2]=(a[l]|0)!=0;c[w+(x<<4)+8>>2]=1}else if((N|0)==3){if((gw(c[K>>2]|0,O,8)|0)!=0){A=c[D>>2]|0;z=c[P>>2]|0;fy(A,2512,(G=i,i=i+16|0,c[G>>2]=z,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}h[y>>3]=+h[k>>3];c[w+(x<<4)+8>>2]=3}else if((N|0)==4){if((gw(c[K>>2]|0,e,4)|0)!=0){N=c[D>>2]|0;z=c[P>>2]|0;fy(N,2512,(G=i,i=i+16|0,c[G>>2]=z,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}z=c[j>>2]|0;if((z|0)==0){T=0}else{N=gx(c[D>>2]|0,c[v>>2]|0,z)|0;if((gw(c[K>>2]|0,N,c[j>>2]|0)|0)!=0){z=c[D>>2]|0;A=c[P>>2]|0;fy(z,2512,(G=i,i=i+16|0,c[G>>2]=A,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}T=f_(c[D>>2]|0,N,(c[j>>2]|0)-1|0)|0}c[y>>2]=T;c[w+(x<<4)+8>>2]=4}else{fy(c[D>>2]|0,2512,(G=i,i=i+16|0,c[G>>2]=c[P>>2],c[G+8>>2]=3416,G)|0)|0;i=G;eC(c[D>>2]|0,3)}x=x+1|0;}while((x|0)<(R|0))}}while(0);if((gw(c[K>>2]|0,g,4)|0)!=0){R=c[D>>2]|0;T=c[d+12>>2]|0;fy(R,2512,(G=i,i=i+16|0,c[G>>2]=T,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}T=c[g>>2]|0;if((T|0)<0){R=c[D>>2]|0;j=c[d+12>>2]|0;fy(R,2512,(G=i,i=i+16|0,c[G>>2]=j,c[G+8>>2]=2872,G)|0)|0;i=G;eC(c[D>>2]|0,3);U=c[g>>2]|0}else{U=T}T=c[D>>2]|0;if((U+1|0)>>>0<1073741824){V=fu(T,0,0,U<<2)|0}else{V=fv(T)|0}T=V;V=E+16|0;c[V>>2]=T;c[E+52>>2]=U;g=(U|0)>0;do{if(g){j=0;R=T;while(1){c[R+(j<<2)>>2]=0;k=j+1|0;if((k|0)>=(U|0)){break}j=k;R=c[V>>2]|0}if(g){W=0}else{break}do{R=gi(d,c[C>>2]|0)|0;c[(c[V>>2]|0)+(W<<2)>>2]=R;W=W+1|0;}while((W|0)<(U|0))}}while(0);if((gw(c[K>>2]|0,u,4)|0)!=0){U=c[D>>2]|0;W=c[d+12>>2]|0;fy(U,2512,(G=i,i=i+16|0,c[G>>2]=W,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}W=c[u>>2]|0;if((W|0)<0){U=c[D>>2]|0;V=c[d+12>>2]|0;fy(U,2512,(G=i,i=i+16|0,c[G>>2]=V,c[G+8>>2]=2872,G)|0)|0;i=G;eC(c[D>>2]|0,3);X=c[u>>2]|0}else{X=W}W=c[D>>2]|0;if((X+1|0)>>>0<1073741824){u=X<<2;Y=fu(W,0,0,u)|0;Z=u}else{Y=fv(W)|0;Z=X<<2}c[E+20>>2]=Y;c[E+48>>2]=X;if((gw(c[K>>2]|0,Y,Z)|0)!=0){Z=c[D>>2]|0;Y=c[d+12>>2]|0;fy(Z,2512,(G=i,i=i+16|0,c[G>>2]=Y,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}if((gw(c[K>>2]|0,t,4)|0)!=0){Y=c[D>>2]|0;Z=c[d+12>>2]|0;fy(Y,2512,(G=i,i=i+16|0,c[G>>2]=Z,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}Z=c[t>>2]|0;if((Z|0)<0){Y=c[D>>2]|0;X=c[d+12>>2]|0;fy(Y,2512,(G=i,i=i+16|0,c[G>>2]=X,c[G+8>>2]=2872,G)|0)|0;i=G;eC(c[D>>2]|0,3);_=c[t>>2]|0}else{_=Z}Z=c[D>>2]|0;if((_+1|0)>>>0<357913942){$=fu(Z,0,0,_*12|0)|0}else{$=fv(Z)|0}Z=E+24|0;c[Z>>2]=$;c[E+56>>2]=_;if((_|0)>0){c[$>>2]=0;if((_|0)>1){$=1;do{c[(c[Z>>2]|0)+($*12|0)>>2]=0;$=$+1|0;}while(($|0)<(_|0))}$=s;t=r;X=d+12|0;Y=q;W=d+8|0;u=0;do{if((gw(c[K>>2]|0,$,4)|0)!=0){V=c[D>>2]|0;U=c[X>>2]|0;fy(V,2512,(G=i,i=i+16|0,c[G>>2]=U,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}U=c[s>>2]|0;if((U|0)==0){aa=0}else{V=gx(c[D>>2]|0,c[W>>2]|0,U)|0;if((gw(c[K>>2]|0,V,c[s>>2]|0)|0)!=0){U=c[D>>2]|0;C=c[X>>2]|0;fy(U,2512,(G=i,i=i+16|0,c[G>>2]=C,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}aa=f_(c[D>>2]|0,V,(c[s>>2]|0)-1|0)|0}c[(c[Z>>2]|0)+(u*12|0)>>2]=aa;if((gw(c[K>>2]|0,t,4)|0)!=0){V=c[D>>2]|0;C=c[X>>2]|0;fy(V,2512,(G=i,i=i+16|0,c[G>>2]=C,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}C=c[r>>2]|0;if((C|0)<0){V=c[D>>2]|0;U=c[X>>2]|0;fy(V,2512,(G=i,i=i+16|0,c[G>>2]=U,c[G+8>>2]=2872,G)|0)|0;i=G;eC(c[D>>2]|0,3);ab=c[r>>2]|0}else{ab=C}c[(c[Z>>2]|0)+(u*12|0)+4>>2]=ab;if((gw(c[K>>2]|0,Y,4)|0)!=0){C=c[D>>2]|0;U=c[X>>2]|0;fy(C,2512,(G=i,i=i+16|0,c[G>>2]=U,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}U=c[q>>2]|0;if((U|0)<0){C=c[D>>2]|0;V=c[X>>2]|0;fy(C,2512,(G=i,i=i+16|0,c[G>>2]=V,c[G+8>>2]=2872,G)|0)|0;i=G;eC(c[D>>2]|0,3);ac=c[q>>2]|0}else{ac=U}c[(c[Z>>2]|0)+(u*12|0)+8>>2]=ac;u=u+1|0;}while((u|0)<(_|0))}if((gw(c[K>>2]|0,p,4)|0)!=0){_=c[D>>2]|0;u=c[d+12>>2]|0;fy(_,2512,(G=i,i=i+16|0,c[G>>2]=u,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}u=c[p>>2]|0;if((u|0)<0){_=c[D>>2]|0;ac=c[d+12>>2]|0;fy(_,2512,(G=i,i=i+16|0,c[G>>2]=ac,c[G+8>>2]=2872,G)|0)|0;i=G;eC(c[D>>2]|0,3);ad=c[p>>2]|0}else{ad=u}u=c[D>>2]|0;if((ad+1|0)>>>0<1073741824){ae=fu(u,0,0,ad<<2)|0}else{ae=fv(u)|0}u=ae;ae=E+28|0;c[ae>>2]=u;c[E+36>>2]=ad;if((ad|0)>0){c[u>>2]=0;if((ad|0)>1){u=1;do{c[(c[ae>>2]|0)+(u<<2)>>2]=0;u=u+1|0;}while((u|0)<(ad|0))}u=o;p=d+8|0;ac=d+12|0;_=0;do{if((gw(c[K>>2]|0,u,4)|0)!=0){Z=c[D>>2]|0;q=c[ac>>2]|0;fy(Z,2512,(G=i,i=i+16|0,c[G>>2]=q,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}q=c[o>>2]|0;if((q|0)==0){af=0}else{Z=gx(c[D>>2]|0,c[p>>2]|0,q)|0;if((gw(c[K>>2]|0,Z,c[o>>2]|0)|0)!=0){q=c[D>>2]|0;X=c[ac>>2]|0;fy(q,2512,(G=i,i=i+16|0,c[G>>2]=X,c[G+8>>2]=3968,G)|0)|0;i=G;eC(c[D>>2]|0,3)}af=f_(c[D>>2]|0,Z,(c[o>>2]|0)-1|0)|0}c[(c[ae>>2]|0)+(_<<2)>>2]=af;_=_+1|0;}while((_|0)<(ad|0))}if((eo(E)|0)!=0){ag=c[D>>2]|0;ah=ag+8|0;ai=c[ah>>2]|0;aj=ai-16|0;c[ah>>2]=aj;ak=c[D>>2]|0;al=ak+52|0;am=b[al>>1]|0;an=am-1&65535;b[al>>1]=an;i=f;return E|0}fy(c[D>>2]|0,2512,(G=i,i=i+16|0,c[G>>2]=c[d+12>>2],c[G+8>>2]=4736,G)|0)|0;i=G;eC(c[D>>2]|0,3);ag=c[D>>2]|0;ah=ag+8|0;ai=c[ah>>2]|0;aj=ai-16|0;c[ah>>2]=aj;ak=c[D>>2]|0;al=ak+52|0;am=b[al>>1]|0;an=am-1&65535;b[al>>1]=an;i=f;return E|0}function gj(b){b=b|0;var c=0;c=b;w=1635077147;a[c]=w&255;w=w>>8;a[c+1|0]=w&255;w=w>>8;a[c+2|0]=w&255;w=w>>8;a[c+3|0]=w&255;a[b+4|0]=81;a[b+5|0]=0;a[b+6|0]=1;a[b+7|0]=4;a[b+8|0]=4;a[b+9|0]=4;a[b+10|0]=8;a[b+11|0]=0;return}function gk(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,j=0;d=i;i=i+8|0;e=d|0;f=c[a+8>>2]|0;do{if((f|0)==3){g=a}else if((f|0)==4){if((fw((c[a>>2]|0)+16|0,e)|0)==0){j=821;break}h[b>>3]=+h[e>>3];c[b+8>>2]=3;g=b}else{j=821}}while(0);if((j|0)==821){g=0}i=d;return g|0}function gl(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,j=0;d=i;i=i+32|0;e=b+8|0;if((c[e>>2]|0)!=3){f=0;i=d;return f|0}g=d|0;a$(g|0,6992,(j=i,i=i+8|0,h[j>>3]=+h[b>>3],j)|0)|0;i=j;c[b>>2]=f_(a,g,j_(g|0)|0)|0;c[e>>2]=4;f=1;i=d;return f|0}function gm(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=i;h=b+16|0;j=d;d=0;L1117:while(1){if((d|0)>=100){k=842;break}l=j+8|0;do{if((c[l>>2]|0)==5){m=c[j>>2]|0;n=f8(m,e)|0;o=n+8|0;if((c[o>>2]|0)!=0){k=835;break L1117}p=c[m+8>>2]|0;m=p;if((p|0)==0){k=835;break L1117}if((a[m+6|0]&1)!=0){k=835;break L1117}p=gf(m,0,c[(c[h>>2]|0)+188>>2]|0)|0;if((p|0)==0){k=835;break L1117}else{q=p}}else{p=gg(b,j,0)|0;if((c[p+8>>2]|0)!=0){q=p;break}eq(b,j,9752);q=p}}while(0);r=q+8|0;if((c[r>>2]|0)==6){k=839;break}else{j=q;d=d+1|0}}if((k|0)==839){d=b+32|0;h=f-(c[d>>2]|0)|0;p=b+8|0;m=c[p>>2]|0;s=q;q=m;t=c[s+4>>2]|0;c[q>>2]=c[s>>2];c[q+4>>2]=t;c[m+8>>2]=c[r>>2];r=c[p>>2]|0;m=j;j=r+16|0;t=c[m+4>>2]|0;c[j>>2]=c[m>>2];c[j+4>>2]=t;c[r+24>>2]=c[l>>2];l=c[p>>2]|0;r=e;t=l+32|0;j=c[r+4>>2]|0;c[t>>2]=c[r>>2];c[t+4>>2]=j;c[l+40>>2]=c[e+8>>2];e=c[p>>2]|0;if(((c[b+28>>2]|0)-e|0)<49){eA(b,3);u=c[p>>2]|0}else{u=e}c[p>>2]=u+48;eG(b,u,1);u=c[d>>2]|0;d=c[p>>2]|0;e=d-16|0;c[p>>2]=e;p=e;e=u+h|0;l=c[p+4>>2]|0;c[e>>2]=c[p>>2];c[e+4>>2]=l;c[u+(h+8)>>2]=c[d-16+8>>2];i=g;return}else if((k|0)==842){es(b,7816,(b=i,i=i+1|0,i=i+7>>3<<3,c[b>>2]=0,b)|0);i=b;i=g;return}else if((k|0)==835){k=n;n=f;b=c[k+4>>2]|0;c[n>>2]=c[k>>2];c[n+4>>2]=b;c[f+8>>2]=c[o>>2];i=g;return}}function gn(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;g=i;i=i+16|0;h=g|0;j=b+16|0;k=h;l=h+8|0;m=0;n=d;o=c[d+8>>2]|0;L1139:while(1){p=n+8|0;do{if((o|0)==5){q=c[n>>2]|0;r=q;s=f9(b,r,e)|0;t=s+8|0;if((c[t>>2]|0)!=0){u=853;break L1139}d=c[q+8>>2]|0;v=d;if((d|0)==0){u=853;break L1139}if((a[v+6|0]&2)!=0){u=853;break L1139}d=gf(v,1,c[(c[j>>2]|0)+192>>2]|0)|0;if((d|0)==0){u=853;break L1139}else{w=d}}else{d=gg(b,n,1)|0;if((c[d+8>>2]|0)!=0){w=d;break}eq(b,n,9752);w=d}}while(0);x=w+8|0;if((c[x>>2]|0)==6){u=860;break}d=w;v=c[d+4>>2]|0;c[k>>2]=c[d>>2];c[k+4>>2]=v;v=c[x>>2]|0;c[l>>2]=v;d=m+1|0;if((d|0)<100){m=d;n=h;o=v}else{u=864;break}}if((u|0)==853){o=f;h=s;s=c[o+4>>2]|0;c[h>>2]=c[o>>2];c[h+4>>2]=s;s=f+8|0;c[t>>2]=c[s>>2];a[q+6|0]=0;if((c[s>>2]|0)<=3){i=g;return}if((a[(c[f>>2]|0)+5|0]&3)==0){i=g;return}if((a[q+5|0]&4)==0){i=g;return}e2(b,r);i=g;return}else if((u|0)==860){r=b+8|0;q=c[r>>2]|0;s=w;w=q;t=c[s+4>>2]|0;c[w>>2]=c[s>>2];c[w+4>>2]=t;c[q+8>>2]=c[x>>2];x=c[r>>2]|0;q=n;n=x+16|0;t=c[q+4>>2]|0;c[n>>2]=c[q>>2];c[n+4>>2]=t;c[x+24>>2]=c[p>>2];p=c[r>>2]|0;x=e;t=p+32|0;n=c[x+4>>2]|0;c[t>>2]=c[x>>2];c[t+4>>2]=n;c[p+40>>2]=c[e+8>>2];e=c[r>>2]|0;p=f;n=e+48|0;t=c[p+4>>2]|0;c[n>>2]=c[p>>2];c[n+4>>2]=t;c[e+56>>2]=c[f+8>>2];f=c[r>>2]|0;if(((c[b+28>>2]|0)-f|0)<65){eA(b,4);y=c[r>>2]|0}else{y=f}c[r>>2]=y+64;eG(b,y,0);i=g;return}else if((u|0)==864){es(b,5976,(b=i,i=i+1|0,i=i+7>>3<<3,c[b>>2]=0,b)|0);i=b;i=g;return}}function go(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;e=b+8|0;f=c[e>>2]|0;g=d+8|0;if((f|0)!=(c[g>>2]|0)){i=ev(a,b,d)|0;return i|0}if((f|0)==4){j=c[b>>2]|0;k=c[d>>2]|0;l=j+16|0;m=k+16|0;n=aL(l|0,m|0)|0;L1192:do{if((n|0)==0){o=l;p=c[j+12>>2]|0;q=m;r=c[k+12>>2]|0;while(1){s=j_(o|0)|0;t=(s|0)==(p|0);if((s|0)==(r|0)){break}if(t){u=-1;break L1192}v=s+1|0;s=o+v|0;w=q+v|0;x=aL(s|0,w|0)|0;if((x|0)==0){o=s;p=p-v|0;q=w;r=r-v|0}else{u=x;break L1192}}u=t&1^1}else{u=n}}while(0);i=u>>>31;return i|0}else if((f|0)==3){i=+h[b>>3]<+h[d>>3]|0;return i|0}else{f=gg(a,b,13)|0;u=f+8|0;do{if((c[u>>2]|0)!=0){if((fr(f,gg(a,d,13)|0)|0)==0){break}n=a+8|0;t=c[n>>2]|0;k=a+32|0;m=t-(c[k>>2]|0)|0;j=f;l=t;r=c[j+4>>2]|0;c[l>>2]=c[j>>2];c[l+4>>2]=r;c[t+8>>2]=c[u>>2];t=c[n>>2]|0;r=b;l=t+16|0;j=c[r+4>>2]|0;c[l>>2]=c[r>>2];c[l+4>>2]=j;c[t+24>>2]=c[e>>2];t=c[n>>2]|0;j=d;l=t+32|0;r=c[j+4>>2]|0;c[l>>2]=c[j>>2];c[l+4>>2]=r;c[t+40>>2]=c[g>>2];t=c[n>>2]|0;if(((c[a+28>>2]|0)-t|0)<49){eA(a,3);y=c[n>>2]|0}else{y=t}c[n>>2]=y+48;eG(a,y,1);t=c[k>>2]|0;k=c[n>>2]|0;r=k-16|0;c[n>>2]=r;l=r;r=t+m|0;j=c[l+4>>2]|0;c[r>>2]=c[l>>2];c[r+4>>2]=j;c[t+(m+8)>>2]=c[k-16+8>>2];k=c[n>>2]|0;n=c[k+8>>2]|0;if((n|0)==0){i=0;return i|0}if((n|0)!=1){i=1;return i|0}i=(c[k>>2]|0)!=0|0;return i|0}}while(0);i=ev(a,b,d)|0;return i|0}return 0}function gp(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;f=d+8|0;L1204:do{switch(c[f>>2]|0){case 0:{g=1;return g|0};case 3:{g=+h[d>>3]==+h[e>>3]|0;return g|0};case 1:{g=(c[d>>2]|0)==(c[e>>2]|0)|0;return g|0};case 7:{i=c[d>>2]|0;j=c[e>>2]|0;if((i|0)==(j|0)){g=1;return g|0}k=c[i+8>>2]|0;i=k;l=c[j+8>>2]|0;j=l;if((k|0)==0){g=0;return g|0}if((a[i+6|0]&16)!=0){g=0;return g|0}m=b+16|0;n=gf(i,4,c[(c[m>>2]|0)+204>>2]|0)|0;if((n|0)==0){g=0;return g|0}if((k|0)==(l|0)){o=n;break L1204}if((l|0)==0){g=0;return g|0}if((a[j+6|0]&16)!=0){g=0;return g|0}l=gf(j,4,c[(c[m>>2]|0)+204>>2]|0)|0;if((l|0)==0){g=0;return g|0}else{p=(fr(n,l)|0)==0?0:n;q=922;break L1204}break};case 2:{g=(c[d>>2]|0)==(c[e>>2]|0)|0;return g|0};case 5:{n=c[d>>2]|0;l=c[e>>2]|0;if((n|0)==(l|0)){g=1;return g|0}m=c[n+8>>2]|0;n=m;j=c[l+8>>2]|0;l=j;if((m|0)==0){g=0;return g|0}if((a[n+6|0]&16)!=0){g=0;return g|0}k=b+16|0;i=gf(n,4,c[(c[k>>2]|0)+204>>2]|0)|0;if((i|0)==0){g=0;return g|0}if((m|0)==(j|0)){o=i;break L1204}if((j|0)==0){g=0;return g|0}if((a[l+6|0]&16)!=0){g=0;return g|0}j=gf(l,4,c[(c[k>>2]|0)+204>>2]|0)|0;if((j|0)==0){g=0;return g|0}else{p=(fr(i,j)|0)==0?0:i;q=922;break L1204}break};default:{g=(c[d>>2]|0)==(c[e>>2]|0)|0;return g|0}}}while(0);do{if((q|0)==922){if((p|0)==0){g=0}else{o=p;break}return g|0}}while(0);p=b+8|0;q=c[p>>2]|0;i=b+32|0;j=q-(c[i>>2]|0)|0;k=o;l=q;m=c[k+4>>2]|0;c[l>>2]=c[k>>2];c[l+4>>2]=m;c[q+8>>2]=c[o+8>>2];o=c[p>>2]|0;q=d;d=o+16|0;m=c[q+4>>2]|0;c[d>>2]=c[q>>2];c[d+4>>2]=m;c[o+24>>2]=c[f>>2];f=c[p>>2]|0;o=e;m=f+32|0;d=c[o+4>>2]|0;c[m>>2]=c[o>>2];c[m+4>>2]=d;c[f+40>>2]=c[e+8>>2];e=c[p>>2]|0;if(((c[b+28>>2]|0)-e|0)<49){eA(b,3);r=c[p>>2]|0}else{r=e}c[p>>2]=r+48;eG(b,r,1);r=c[i>>2]|0;i=c[p>>2]|0;b=i-16|0;c[p>>2]=b;e=b;b=r+j|0;f=c[e+4>>2]|0;c[b>>2]=c[e>>2];c[b+4>>2]=f;c[r+(j+8)>>2]=c[i-16+8>>2];i=c[p>>2]|0;p=c[i+8>>2]|0;if((p|0)==0){g=0;return g|0}if((p|0)!=1){g=1;return g|0}g=(c[i>>2]|0)!=0|0;return g|0}function gq(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;e=i;i=i+32|0;f=a+12|0;g=e|0;j=a+16|0;k=a+32|0;l=a+8|0;m=a+28|0;n=b;b=d;while(1){d=c[f>>2]|0;o=b+1|0;p=b-1|0;q=d+(p<<4)|0;r=d+(p<<4)+8|0;p=d+(b<<4)|0;do{if(((c[r>>2]|0)-3|0)>>>0<2){s=d+(b<<4)+8|0;t=c[s>>2]|0;if((t|0)==4){u=p}else{if((t|0)!=3){v=958;break}w=+h[p>>3];a$(g|0,6992,(x=i,i=i+8|0,h[x>>3]=w,x)|0)|0;i=x;t=p;c[t>>2]=f_(a,g,j_(g|0)|0)|0;c[s>>2]=4;u=t}t=c[(c[u>>2]|0)+12>>2]|0;if((t|0)==0){s=c[r>>2]|0;if((s|0)==4){y=2;break}if((s|0)!=3){y=2;break}w=+h[q>>3];a$(g|0,6992,(x=i,i=i+8|0,h[x>>3]=w,x)|0)|0;i=x;c[q>>2]=f_(a,g,j_(g|0)|0)|0;c[r>>2]=4;y=2;break}L1289:do{if((n|0)>1){s=t;z=1;while(1){A=o-z-1|0;B=d+(A<<4)|0;C=d+(A<<4)+8|0;A=c[C>>2]|0;if((A|0)==4){D=B}else{if((A|0)!=3){E=s;F=z;break L1289}w=+h[B>>3];a$(g|0,6992,(x=i,i=i+8|0,h[x>>3]=w,x)|0)|0;i=x;A=B;c[A>>2]=f_(a,g,j_(g|0)|0)|0;c[C>>2]=4;D=A}A=c[(c[D>>2]|0)+12>>2]|0;if(A>>>0>=(-3-s|0)>>>0){es(a,4688,(x=i,i=i+1|0,i=i+7>>3<<3,c[x>>2]=0,x)|0);i=x}C=A+s|0;A=z+1|0;if((A|0)<(n|0)){s=C;z=A}else{E=C;F=A;break}}}else{E=t;F=1}}while(0);t=gx(a,(c[j>>2]|0)+52|0,E)|0;if((F|0)>0){z=0;s=F;while(1){A=c[d+(o-s<<4)>>2]|0;C=c[A+12>>2]|0;B=t+z|0;G=A+16|0;j$(B|0,G|0,C)|0;G=C+z|0;C=s-1|0;if((C|0)>0){z=G;s=C}else{H=G;break}}}else{H=0}s=o-F|0;c[d+(s<<4)>>2]=f_(a,t,H)|0;c[d+(s<<4)+8>>2]=4;y=F}else{v=958}}while(0);L1305:do{if((v|0)==958){v=0;o=gg(a,q,15)|0;do{if((c[o+8>>2]|0)==0){s=gg(a,p,15)|0;if((c[s+8>>2]|0)!=0){I=s;break}et(a,q,p);y=2;break L1305}else{I=o}}while(0);o=q-(c[k>>2]|0)|0;t=c[l>>2]|0;s=I;z=t;G=c[s+4>>2]|0;c[z>>2]=c[s>>2];c[z+4>>2]=G;c[t+8>>2]=c[I+8>>2];t=c[l>>2]|0;G=q;z=t+16|0;s=c[G+4>>2]|0;c[z>>2]=c[G>>2];c[z+4>>2]=s;c[t+24>>2]=c[r>>2];t=c[l>>2]|0;s=p;z=t+32|0;G=c[s+4>>2]|0;c[z>>2]=c[s>>2];c[z+4>>2]=G;c[t+40>>2]=c[d+(b<<4)+8>>2];t=c[l>>2]|0;if(((c[m>>2]|0)-t|0)<49){eA(a,3);J=c[l>>2]|0}else{J=t}c[l>>2]=J+48;eG(a,J,1);t=c[k>>2]|0;G=c[l>>2]|0;z=G-16|0;c[l>>2]=z;s=z;z=t+o|0;C=c[s+4>>2]|0;c[z>>2]=c[s>>2];c[z+4>>2]=C;c[t+(o+8)>>2]=c[G-16+8>>2];y=2}}while(0);d=y-1|0;p=n-d|0;if((p|0)<=1){break}n=p;b=b-d|0}i=e;return}function gr(b,e){b=b|0;e=e|0;var f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,P=0,Q=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aM=0,aN=0,aO=0,aP=0,aQ=0,aR=0,aS=0,aT=0,aU=0,aV=0.0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0.0,a0=0,a1=0,a2=0,a3=0,a4=0,a5=0.0,a6=0,a7=0,a8=0,a9=0,ba=0,bb=0.0,bc=0,bd=0,be=0,bf=0,bg=0.0,bh=0.0,bi=0,bj=0.0,bk=0,bl=0,bm=0,bn=0,bo=0,bp=0.0,bq=0,br=0,bs=0,bt=0,bu=0,bv=0,bw=0,bx=0,by=0,bz=0,bA=0,bB=0,bC=0,bD=0,bE=0,bF=0,bG=0,bH=0,bI=0,bJ=0,bK=0,bL=0,bM=0,bN=0,bO=0,bP=0,bQ=0,bR=0,bS=0,bT=0,bU=0,bV=0,bW=0,bX=0,bY=0.0,bZ=0,b_=0,b$=0,b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0,b7=0;f=i;i=i+280|0;g=f|0;j=f+8|0;k=f+16|0;l=f+24|0;m=f+32|0;n=f+40|0;o=f+48|0;p=f+56|0;q=f+64|0;r=f+72|0;s=f+80|0;t=f+88|0;u=f+96|0;v=f+104|0;w=f+112|0;x=f+120|0;y=f+128|0;z=f+136|0;A=f+152|0;B=f+168|0;C=f+184|0;D=f+200|0;E=f+216|0;F=f+232|0;G=f+248|0;H=f+264|0;I=b+24|0;J=b+20|0;K=b+12|0;L=b+56|0;M=G;N=G+8|0;P=H;Q=H+8|0;S=b+16|0;T=b+32|0;U=b+8|0;V=b+28|0;W=F|0;X=F+8|0;Y=E|0;Z=E+8|0;_=D|0;$=D+8|0;aa=C|0;ab=C+8|0;ac=B|0;ad=B+8|0;ae=A|0;af=A+8|0;ag=z|0;ah=z+8|0;ai=c[260]|0;aj=b+64|0;ak=b+6|0;al=b+60|0;am=b+104|0;an=e;L1318:while(1){e=c[J>>2]|0;L1320:while(1){ao=c[c[e+4>>2]>>2]|0;ap=ao+16|0;aq=c[(c[ap>>2]|0)+8>>2]|0;ar=ao+20|0;as=ao+12|0;ao=c[K>>2]|0;at=c[I>>2]|0;L1322:while(1){au=at+4|0;av=c[at>>2]|0;aw=a[L]|0;do{if((aw&12)==0){ax=ao}else{ay=(c[aj>>2]|0)-1|0;c[aj>>2]=ay;az=(ay|0)==0;if(!az){if((aw&4)==0){ax=ao;break}}ay=c[I>>2]|0;c[I>>2]=au;aA=aw&255;if(!((aA&8|0)==0|az^1)){c[aj>>2]=c[al>>2];eB(b,3,-1)}do{if((aA&4|0)!=0){az=c[(c[c[(c[J>>2]|0)+4>>2]>>2]|0)+16>>2]|0;aB=c[az+12>>2]|0;aC=(au-aB>>2)-1|0;aD=c[az+20>>2]|0;az=(aD|0)==0;if(az){aE=0}else{aE=c[aD+(aC<<2)>>2]|0}if((aC|0)!=0&ay>>>0<au>>>0){if(az){aF=0}else{aF=c[aD+((ay-aB>>2)-1<<2)>>2]|0}if((aE|0)==(aF|0)){break}}eB(b,2,aE)}}while(0);if((a[ak]|0)==1){aG=999;break L1318}ax=c[K>>2]|0}}while(0);aH=av>>>6&255;aI=ax+(aH<<4)|0;switch(av&63|0){case 18:{aw=av>>>23;ay=ax+(aw<<4)|0;aA=ax+(aw<<4)+8|0;if((c[aA>>2]|0)==3){h[aI>>3]=-0.0- +h[ay>>3];c[ax+(aH<<4)+8>>2]=3;ao=ax;at=au;continue L1322}c[I>>2]=au;aw=c[aA>>2]|0;do{if((aw|0)==3){if((ay|0)==0){aG=1198}else{aJ=ay;aG=1194}}else if((aw|0)==4){if((fw((c[ay>>2]|0)+16|0,j)|0)==0){aG=1198;break}h[ag>>3]=+h[j>>3];c[ah>>2]=3;aJ=z;aG=1194}else{aG=1198}}while(0);do{if((aG|0)==1194){aG=0;aw=c[aA>>2]|0;if((aw|0)==4){if((fw((c[ay>>2]|0)+16|0,g)|0)==0){aG=1198;break}}else if((aw|0)==3){if((ay|0)==0){aG=1198;break}}else{aG=1198;break}h[aI>>3]=-0.0- +h[aJ>>3];c[ax+(aH<<4)+8>>2]=3}}while(0);L1361:do{if((aG|0)==1198){aG=0;aw=gg(b,ay,11)|0;do{if((c[aw+8>>2]|0)==0){aB=gg(b,ay,11)|0;if((c[aB+8>>2]|0)!=0){aK=aB;break}eu(b,ay,ay);break L1361}else{aK=aw}}while(0);aw=aI-(c[T>>2]|0)|0;aB=c[U>>2]|0;aD=aK;az=aB;aC=c[aD+4>>2]|0;c[az>>2]=c[aD>>2];c[az+4>>2]=aC;c[aB+8>>2]=c[aK+8>>2];aB=c[U>>2]|0;aC=ay;az=aB+16|0;aD=c[aC+4>>2]|0;c[az>>2]=c[aC>>2];c[az+4>>2]=aD;c[aB+24>>2]=c[aA>>2];aB=c[U>>2]|0;aD=aB+32|0;az=c[aC+4>>2]|0;c[aD>>2]=c[aC>>2];c[aD+4>>2]=az;c[aB+40>>2]=c[aA>>2];aB=c[U>>2]|0;if(((c[V>>2]|0)-aB|0)<49){eA(b,3);aM=c[U>>2]|0}else{aM=aB}c[U>>2]=aM+48;eG(b,aM,1);aB=c[T>>2]|0;az=c[U>>2]|0;aD=az-16|0;c[U>>2]=aD;aC=aD;aD=aB+aw|0;aN=c[aC+4>>2]|0;c[aD>>2]=c[aC>>2];c[aD+4>>2]=aN;c[aB+(aw+8)>>2]=c[az-16+8>>2]}}while(0);ao=c[K>>2]|0;at=au;continue L1322;break};case 0:{aA=av>>>23;ay=ax+(aA<<4)|0;az=aI;aw=c[ay+4>>2]|0;c[az>>2]=c[ay>>2];c[az+4>>2]=aw;c[ax+(aH<<4)+8>>2]=c[ax+(aA<<4)+8>>2];ao=ax;at=au;continue L1322;break};case 1:{aA=av>>>14;aw=aq+(aA<<4)|0;az=aI;ay=c[aw+4>>2]|0;c[az>>2]=c[aw>>2];c[az+4>>2]=ay;c[ax+(aH<<4)+8>>2]=c[aq+(aA<<4)+8>>2];ao=ax;at=au;continue L1322;break};case 2:{c[aI>>2]=av>>>23;c[ax+(aH<<4)+8>>2]=1;ao=ax;at=(av&8372224|0)==0?au:at+8|0;continue L1322;break};case 3:{aA=ax+(av>>>23<<4)|0;while(1){ay=aA-16|0;c[aA+8>>2]=0;if(ay>>>0<aI>>>0){ao=ax;at=au;continue L1322}else{aA=ay}}break};case 4:{aA=c[(c[ar+(av>>>23<<2)>>2]|0)+8>>2]|0;ay=aA;az=aI;aw=c[ay+4>>2]|0;c[az>>2]=c[ay>>2];c[az+4>>2]=aw;c[ax+(aH<<4)+8>>2]=c[aA+8>>2];ao=ax;at=au;continue L1322;break};case 5:{c[M>>2]=c[as>>2];c[N>>2]=5;c[I>>2]=au;gm(b,G,aq+(av>>>14<<4)|0,aI);ao=c[K>>2]|0;at=au;continue L1322;break};case 6:{c[I>>2]=au;aA=av>>>14;if((aA&256|0)==0){aO=ax+((aA&511)<<4)|0}else{aO=aq+((aA&255)<<4)|0}gm(b,ax+(av>>>23<<4)|0,aO,aI);ao=c[K>>2]|0;at=au;continue L1322;break};case 7:{c[P>>2]=c[as>>2];c[Q>>2]=5;c[I>>2]=au;gn(b,H,aq+(av>>>14<<4)|0,aI);ao=c[K>>2]|0;at=au;continue L1322;break};case 8:{aA=c[ar+(av>>>23<<2)>>2]|0;aw=c[aA+8>>2]|0;az=aI;ay=aw;aB=c[az+4>>2]|0;c[ay>>2]=c[az>>2];c[ay+4>>2]=aB;aB=ax+(aH<<4)+8|0;c[aw+8>>2]=c[aB>>2];if((c[aB>>2]|0)<=3){ao=ax;at=au;continue L1322}aB=c[aI>>2]|0;if((a[aB+5|0]&3)==0){ao=ax;at=au;continue L1322}if((a[aA+5|0]&4)==0){ao=ax;at=au;continue L1322}e7(b,aA,aB);ao=ax;at=au;continue L1322;break};case 9:{c[I>>2]=au;aB=av>>>23;if((aB&256|0)==0){aP=ax+(aB<<4)|0}else{aP=aq+((aB&255)<<4)|0}aB=av>>>14;if((aB&256|0)==0){aQ=ax+((aB&511)<<4)|0}else{aQ=aq+((aB&255)<<4)|0}gn(b,aI,aP,aQ);ao=c[K>>2]|0;at=au;continue L1322;break};case 10:{aB=fp(av>>>23)|0;c[aI>>2]=f5(b,aB,fp(av>>>14&511)|0)|0;c[ax+(aH<<4)+8>>2]=5;c[I>>2]=au;aB=c[S>>2]|0;if((c[aB+68>>2]|0)>>>0>=(c[aB+64>>2]|0)>>>0){e1(b)}ao=c[K>>2]|0;at=au;continue L1322;break};case 11:{aB=av>>>23;aA=ax+(aB<<4)|0;aw=aH+1|0;ay=aA;az=ax+(aw<<4)|0;aN=c[ay+4>>2]|0;c[az>>2]=c[ay>>2];c[az+4>>2]=aN;c[ax+(aw<<4)+8>>2]=c[ax+(aB<<4)+8>>2];c[I>>2]=au;aB=av>>>14;if((aB&256|0)==0){aR=ax+((aB&511)<<4)|0}else{aR=aq+((aB&255)<<4)|0}gm(b,aA,aR,aI);ao=c[K>>2]|0;at=au;continue L1322;break};case 12:{aA=av>>>23;if((aA&256|0)==0){aS=ax+(aA<<4)|0}else{aS=aq+((aA&255)<<4)|0}aA=av>>>14;if((aA&256|0)==0){aT=ax+((aA&511)<<4)|0}else{aT=aq+((aA&255)<<4)|0}aA=aS+8|0;do{if((c[aA>>2]|0)==3){if((c[aT+8>>2]|0)!=3){break}h[aI>>3]=+h[aS>>3]+ +h[aT>>3];c[ax+(aH<<4)+8>>2]=3;ao=ax;at=au;continue L1322}}while(0);c[I>>2]=au;aB=c[aA>>2]|0;do{if((aB|0)==4){if((fw((c[aS>>2]|0)+16|0,v)|0)==0){aG=1051;break}h[W>>3]=+h[v>>3];c[X>>2]=3;aU=F;aG=1045}else if((aB|0)==3){if((aS|0)==0){aG=1051}else{aU=aS;aG=1045}}else{aG=1051}}while(0);do{if((aG|0)==1045){aG=0;aB=c[aT+8>>2]|0;if((aB|0)==4){if((fw((c[aT>>2]|0)+16|0,u)|0)==0){aG=1051;break}aV=+h[u>>3]}else if((aB|0)==3){if((aT|0)==0){aG=1051;break}aV=+h[aT>>3]}else{aG=1051;break}h[aI>>3]=+h[aU>>3]+aV;c[ax+(aH<<4)+8>>2]=3}}while(0);L1432:do{if((aG|0)==1051){aG=0;aB=gg(b,aS,5)|0;do{if((c[aB+8>>2]|0)==0){aw=gg(b,aT,5)|0;if((c[aw+8>>2]|0)!=0){aW=aw;break}eu(b,aS,aT);break L1432}else{aW=aB}}while(0);aB=aI-(c[T>>2]|0)|0;aw=c[U>>2]|0;aN=aW;az=aw;ay=c[aN+4>>2]|0;c[az>>2]=c[aN>>2];c[az+4>>2]=ay;c[aw+8>>2]=c[aW+8>>2];aw=c[U>>2]|0;ay=aS;az=aw+16|0;aN=c[ay+4>>2]|0;c[az>>2]=c[ay>>2];c[az+4>>2]=aN;c[aw+24>>2]=c[aA>>2];aw=c[U>>2]|0;aN=aT;az=aw+32|0;ay=c[aN+4>>2]|0;c[az>>2]=c[aN>>2];c[az+4>>2]=ay;c[aw+40>>2]=c[aT+8>>2];aw=c[U>>2]|0;if(((c[V>>2]|0)-aw|0)<49){eA(b,3);aX=c[U>>2]|0}else{aX=aw}c[U>>2]=aX+48;eG(b,aX,1);aw=c[T>>2]|0;ay=c[U>>2]|0;az=ay-16|0;c[U>>2]=az;aN=az;az=aw+aB|0;aD=c[aN+4>>2]|0;c[az>>2]=c[aN>>2];c[az+4>>2]=aD;c[aw+(aB+8)>>2]=c[ay-16+8>>2]}}while(0);ao=c[K>>2]|0;at=au;continue L1322;break};case 13:{aA=av>>>23;if((aA&256|0)==0){aY=ax+(aA<<4)|0}else{aY=aq+((aA&255)<<4)|0}aA=av>>>14;if((aA&256|0)==0){aZ=ax+((aA&511)<<4)|0}else{aZ=aq+((aA&255)<<4)|0}aA=aY+8|0;do{if((c[aA>>2]|0)==3){if((c[aZ+8>>2]|0)!=3){break}h[aI>>3]=+h[aY>>3]- +h[aZ>>3];c[ax+(aH<<4)+8>>2]=3;ao=ax;at=au;continue L1322}}while(0);c[I>>2]=au;ay=c[aA>>2]|0;do{if((ay|0)==4){if((fw((c[aY>>2]|0)+16|0,t)|0)==0){aG=1077;break}h[Y>>3]=+h[t>>3];c[Z>>2]=3;a_=E;aG=1071}else if((ay|0)==3){if((aY|0)==0){aG=1077}else{a_=aY;aG=1071}}else{aG=1077}}while(0);do{if((aG|0)==1071){aG=0;ay=c[aZ+8>>2]|0;if((ay|0)==4){if((fw((c[aZ>>2]|0)+16|0,s)|0)==0){aG=1077;break}a$=+h[s>>3]}else if((ay|0)==3){if((aZ|0)==0){aG=1077;break}a$=+h[aZ>>3]}else{aG=1077;break}h[aI>>3]=+h[a_>>3]-a$;c[ax+(aH<<4)+8>>2]=3}}while(0);L1467:do{if((aG|0)==1077){aG=0;ay=gg(b,aY,6)|0;do{if((c[ay+8>>2]|0)==0){aB=gg(b,aZ,6)|0;if((c[aB+8>>2]|0)!=0){a0=aB;break}eu(b,aY,aZ);break L1467}else{a0=ay}}while(0);ay=aI-(c[T>>2]|0)|0;aB=c[U>>2]|0;aw=a0;aD=aB;az=c[aw+4>>2]|0;c[aD>>2]=c[aw>>2];c[aD+4>>2]=az;c[aB+8>>2]=c[a0+8>>2];aB=c[U>>2]|0;az=aY;aD=aB+16|0;aw=c[az+4>>2]|0;c[aD>>2]=c[az>>2];c[aD+4>>2]=aw;c[aB+24>>2]=c[aA>>2];aB=c[U>>2]|0;aw=aZ;aD=aB+32|0;az=c[aw+4>>2]|0;c[aD>>2]=c[aw>>2];c[aD+4>>2]=az;c[aB+40>>2]=c[aZ+8>>2];aB=c[U>>2]|0;if(((c[V>>2]|0)-aB|0)<49){eA(b,3);a1=c[U>>2]|0}else{a1=aB}c[U>>2]=a1+48;eG(b,a1,1);aB=c[T>>2]|0;az=c[U>>2]|0;aD=az-16|0;c[U>>2]=aD;aw=aD;aD=aB+ay|0;aN=c[aw+4>>2]|0;c[aD>>2]=c[aw>>2];c[aD+4>>2]=aN;c[aB+(ay+8)>>2]=c[az-16+8>>2]}}while(0);ao=c[K>>2]|0;at=au;continue L1322;break};case 14:{aA=av>>>23;if((aA&256|0)==0){a2=ax+(aA<<4)|0}else{a2=aq+((aA&255)<<4)|0}aA=av>>>14;if((aA&256|0)==0){a3=ax+((aA&511)<<4)|0}else{a3=aq+((aA&255)<<4)|0}aA=a2+8|0;do{if((c[aA>>2]|0)==3){if((c[a3+8>>2]|0)!=3){break}h[aI>>3]=+h[a2>>3]*+h[a3>>3];c[ax+(aH<<4)+8>>2]=3;ao=ax;at=au;continue L1322}}while(0);c[I>>2]=au;az=c[aA>>2]|0;do{if((az|0)==4){if((fw((c[a2>>2]|0)+16|0,r)|0)==0){aG=1103;break}h[_>>3]=+h[r>>3];c[$>>2]=3;a4=D;aG=1097}else if((az|0)==3){if((a2|0)==0){aG=1103}else{a4=a2;aG=1097}}else{aG=1103}}while(0);do{if((aG|0)==1097){aG=0;az=c[a3+8>>2]|0;if((az|0)==4){if((fw((c[a3>>2]|0)+16|0,q)|0)==0){aG=1103;break}a5=+h[q>>3]}else if((az|0)==3){if((a3|0)==0){aG=1103;break}a5=+h[a3>>3]}else{aG=1103;break}h[aI>>3]=+h[a4>>3]*a5;c[ax+(aH<<4)+8>>2]=3}}while(0);L1502:do{if((aG|0)==1103){aG=0;az=gg(b,a2,7)|0;do{if((c[az+8>>2]|0)==0){ay=gg(b,a3,7)|0;if((c[ay+8>>2]|0)!=0){a6=ay;break}eu(b,a2,a3);break L1502}else{a6=az}}while(0);az=aI-(c[T>>2]|0)|0;ay=c[U>>2]|0;aB=a6;aN=ay;aD=c[aB+4>>2]|0;c[aN>>2]=c[aB>>2];c[aN+4>>2]=aD;c[ay+8>>2]=c[a6+8>>2];ay=c[U>>2]|0;aD=a2;aN=ay+16|0;aB=c[aD+4>>2]|0;c[aN>>2]=c[aD>>2];c[aN+4>>2]=aB;c[ay+24>>2]=c[aA>>2];ay=c[U>>2]|0;aB=a3;aN=ay+32|0;aD=c[aB+4>>2]|0;c[aN>>2]=c[aB>>2];c[aN+4>>2]=aD;c[ay+40>>2]=c[a3+8>>2];ay=c[U>>2]|0;if(((c[V>>2]|0)-ay|0)<49){eA(b,3);a7=c[U>>2]|0}else{a7=ay}c[U>>2]=a7+48;eG(b,a7,1);ay=c[T>>2]|0;aD=c[U>>2]|0;aN=aD-16|0;c[U>>2]=aN;aB=aN;aN=ay+az|0;aw=c[aB+4>>2]|0;c[aN>>2]=c[aB>>2];c[aN+4>>2]=aw;c[ay+(az+8)>>2]=c[aD-16+8>>2]}}while(0);ao=c[K>>2]|0;at=au;continue L1322;break};case 15:{aA=av>>>23;if((aA&256|0)==0){a8=ax+(aA<<4)|0}else{a8=aq+((aA&255)<<4)|0}aA=av>>>14;if((aA&256|0)==0){a9=ax+((aA&511)<<4)|0}else{a9=aq+((aA&255)<<4)|0}aA=a8+8|0;do{if((c[aA>>2]|0)==3){if((c[a9+8>>2]|0)!=3){break}h[aI>>3]=+h[a8>>3]/+h[a9>>3];c[ax+(aH<<4)+8>>2]=3;ao=ax;at=au;continue L1322}}while(0);c[I>>2]=au;aD=c[aA>>2]|0;do{if((aD|0)==4){if((fw((c[a8>>2]|0)+16|0,p)|0)==0){aG=1129;break}h[aa>>3]=+h[p>>3];c[ab>>2]=3;ba=C;aG=1123}else if((aD|0)==3){if((a8|0)==0){aG=1129}else{ba=a8;aG=1123}}else{aG=1129}}while(0);do{if((aG|0)==1123){aG=0;aD=c[a9+8>>2]|0;if((aD|0)==4){if((fw((c[a9>>2]|0)+16|0,o)|0)==0){aG=1129;break}bb=+h[o>>3]}else if((aD|0)==3){if((a9|0)==0){aG=1129;break}bb=+h[a9>>3]}else{aG=1129;break}h[aI>>3]=+h[ba>>3]/bb;c[ax+(aH<<4)+8>>2]=3}}while(0);L1537:do{if((aG|0)==1129){aG=0;aD=gg(b,a8,8)|0;do{if((c[aD+8>>2]|0)==0){az=gg(b,a9,8)|0;if((c[az+8>>2]|0)!=0){bc=az;break}eu(b,a8,a9);break L1537}else{bc=aD}}while(0);aD=aI-(c[T>>2]|0)|0;az=c[U>>2]|0;ay=bc;aw=az;aN=c[ay+4>>2]|0;c[aw>>2]=c[ay>>2];c[aw+4>>2]=aN;c[az+8>>2]=c[bc+8>>2];az=c[U>>2]|0;aN=a8;aw=az+16|0;ay=c[aN+4>>2]|0;c[aw>>2]=c[aN>>2];c[aw+4>>2]=ay;c[az+24>>2]=c[aA>>2];az=c[U>>2]|0;ay=a9;aw=az+32|0;aN=c[ay+4>>2]|0;c[aw>>2]=c[ay>>2];c[aw+4>>2]=aN;c[az+40>>2]=c[a9+8>>2];az=c[U>>2]|0;if(((c[V>>2]|0)-az|0)<49){eA(b,3);bd=c[U>>2]|0}else{bd=az}c[U>>2]=bd+48;eG(b,bd,1);az=c[T>>2]|0;aN=c[U>>2]|0;aw=aN-16|0;c[U>>2]=aw;ay=aw;aw=az+aD|0;aB=c[ay+4>>2]|0;c[aw>>2]=c[ay>>2];c[aw+4>>2]=aB;c[az+(aD+8)>>2]=c[aN-16+8>>2]}}while(0);ao=c[K>>2]|0;at=au;continue L1322;break};case 16:{aA=av>>>23;if((aA&256|0)==0){be=ax+(aA<<4)|0}else{be=aq+((aA&255)<<4)|0}aA=av>>>14;if((aA&256|0)==0){bf=ax+((aA&511)<<4)|0}else{bf=aq+((aA&255)<<4)|0}aA=be+8|0;do{if((c[aA>>2]|0)==3){if((c[bf+8>>2]|0)!=3){break}bg=+h[be>>3];bh=+h[bf>>3];h[aI>>3]=bg-bh*+O(+(bg/bh));c[ax+(aH<<4)+8>>2]=3;ao=ax;at=au;continue L1322}}while(0);c[I>>2]=au;aN=c[aA>>2]|0;do{if((aN|0)==4){if((fw((c[be>>2]|0)+16|0,n)|0)==0){aG=1155;break}h[ac>>3]=+h[n>>3];c[ad>>2]=3;bi=B;aG=1149}else if((aN|0)==3){if((be|0)==0){aG=1155}else{bi=be;aG=1149}}else{aG=1155}}while(0);do{if((aG|0)==1149){aG=0;aN=c[bf+8>>2]|0;if((aN|0)==4){if((fw((c[bf>>2]|0)+16|0,m)|0)==0){aG=1155;break}bj=+h[m>>3]}else if((aN|0)==3){if((bf|0)==0){aG=1155;break}bj=+h[bf>>3]}else{aG=1155;break}bh=+h[bi>>3];h[aI>>3]=bh-bj*+O(+(bh/bj));c[ax+(aH<<4)+8>>2]=3}}while(0);L1572:do{if((aG|0)==1155){aG=0;aN=gg(b,be,9)|0;do{if((c[aN+8>>2]|0)==0){aD=gg(b,bf,9)|0;if((c[aD+8>>2]|0)!=0){bk=aD;break}eu(b,be,bf);break L1572}else{bk=aN}}while(0);aN=aI-(c[T>>2]|0)|0;aD=c[U>>2]|0;az=bk;aB=aD;aw=c[az+4>>2]|0;c[aB>>2]=c[az>>2];c[aB+4>>2]=aw;c[aD+8>>2]=c[bk+8>>2];aD=c[U>>2]|0;aw=be;aB=aD+16|0;az=c[aw+4>>2]|0;c[aB>>2]=c[aw>>2];c[aB+4>>2]=az;c[aD+24>>2]=c[aA>>2];aD=c[U>>2]|0;az=bf;aB=aD+32|0;aw=c[az+4>>2]|0;c[aB>>2]=c[az>>2];c[aB+4>>2]=aw;c[aD+40>>2]=c[bf+8>>2];aD=c[U>>2]|0;if(((c[V>>2]|0)-aD|0)<49){eA(b,3);bl=c[U>>2]|0}else{bl=aD}c[U>>2]=bl+48;eG(b,bl,1);aD=c[T>>2]|0;aw=c[U>>2]|0;aB=aw-16|0;c[U>>2]=aB;az=aB;aB=aD+aN|0;ay=c[az+4>>2]|0;c[aB>>2]=c[az>>2];c[aB+4>>2]=ay;c[aD+(aN+8)>>2]=c[aw-16+8>>2]}}while(0);ao=c[K>>2]|0;at=au;continue L1322;break};case 17:{aA=av>>>23;if((aA&256|0)==0){bm=ax+(aA<<4)|0}else{bm=aq+((aA&255)<<4)|0}aA=av>>>14;if((aA&256|0)==0){bn=ax+((aA&511)<<4)|0}else{bn=aq+((aA&255)<<4)|0}aA=bm+8|0;do{if((c[aA>>2]|0)==3){if((c[bn+8>>2]|0)!=3){break}h[aI>>3]=+R(+(+h[bm>>3]),+(+h[bn>>3]));c[ax+(aH<<4)+8>>2]=3;ao=ax;at=au;continue L1322}}while(0);c[I>>2]=au;aw=c[aA>>2]|0;do{if((aw|0)==4){if((fw((c[bm>>2]|0)+16|0,l)|0)==0){aG=1181;break}h[ae>>3]=+h[l>>3];c[af>>2]=3;bo=A;aG=1175}else if((aw|0)==3){if((bm|0)==0){aG=1181}else{bo=bm;aG=1175}}else{aG=1181}}while(0);do{if((aG|0)==1175){aG=0;aw=c[bn+8>>2]|0;if((aw|0)==4){if((fw((c[bn>>2]|0)+16|0,k)|0)==0){aG=1181;break}bp=+h[k>>3]}else if((aw|0)==3){if((bn|0)==0){aG=1181;break}bp=+h[bn>>3]}else{aG=1181;break}h[aI>>3]=+R(+(+h[bo>>3]),+bp);c[ax+(aH<<4)+8>>2]=3}}while(0);L1607:do{if((aG|0)==1181){aG=0;aw=gg(b,bm,10)|0;do{if((c[aw+8>>2]|0)==0){aN=gg(b,bn,10)|0;if((c[aN+8>>2]|0)!=0){bq=aN;break}eu(b,bm,bn);break L1607}else{bq=aw}}while(0);aw=aI-(c[T>>2]|0)|0;aN=c[U>>2]|0;aD=bq;ay=aN;aB=c[aD+4>>2]|0;c[ay>>2]=c[aD>>2];c[ay+4>>2]=aB;c[aN+8>>2]=c[bq+8>>2];aN=c[U>>2]|0;aB=bm;ay=aN+16|0;aD=c[aB+4>>2]|0;c[ay>>2]=c[aB>>2];c[ay+4>>2]=aD;c[aN+24>>2]=c[aA>>2];aN=c[U>>2]|0;aD=bn;ay=aN+32|0;aB=c[aD+4>>2]|0;c[ay>>2]=c[aD>>2];c[ay+4>>2]=aB;c[aN+40>>2]=c[bn+8>>2];aN=c[U>>2]|0;if(((c[V>>2]|0)-aN|0)<49){eA(b,3);br=c[U>>2]|0}else{br=aN}c[U>>2]=br+48;eG(b,br,1);aN=c[T>>2]|0;aB=c[U>>2]|0;ay=aB-16|0;c[U>>2]=ay;aD=ay;ay=aN+aw|0;az=c[aD+4>>2]|0;c[ay>>2]=c[aD>>2];c[ay+4>>2]=az;c[aN+(aw+8)>>2]=c[aB-16+8>>2]}}while(0);ao=c[K>>2]|0;at=au;continue L1322;break};case 19:{aA=av>>>23;aB=c[ax+(aA<<4)+8>>2]|0;do{if((aB|0)==0){bs=1}else{if((aB|0)!=1){bs=0;break}bs=(c[ax+(aA<<4)>>2]|0)==0|0}}while(0);c[aI>>2]=bs;c[ax+(aH<<4)+8>>2]=1;ao=ax;at=au;continue L1322;break};case 20:{aA=av>>>23;aB=ax+(aA<<4)|0;aw=ax+(aA<<4)+8|0;aA=c[aw>>2]|0;if((aA|0)==5){h[aI>>3]=+(ga(c[aB>>2]|0)|0);c[ax+(aH<<4)+8>>2]=3;ao=ax;at=au;continue L1322}else if((aA|0)==4){h[aI>>3]=+((c[(c[aB>>2]|0)+12>>2]|0)>>>0>>>0);c[ax+(aH<<4)+8>>2]=3;ao=ax;at=au;continue L1322}else{c[I>>2]=au;aA=gg(b,aB,12)|0;do{if((c[aA+8>>2]|0)==0){aN=gg(b,1032,12)|0;if((c[aN+8>>2]|0)!=0){bt=aN;aG=1214;break}eq(b,aB,3952)}else{bt=aA;aG=1214}}while(0);if((aG|0)==1214){aG=0;aA=aI-(c[T>>2]|0)|0;aN=c[U>>2]|0;az=bt;ay=aN;aD=c[az+4>>2]|0;c[ay>>2]=c[az>>2];c[ay+4>>2]=aD;c[aN+8>>2]=c[bt+8>>2];aN=c[U>>2]|0;aD=aB;ay=aN+16|0;az=c[aD+4>>2]|0;c[ay>>2]=c[aD>>2];c[ay+4>>2]=az;c[aN+24>>2]=c[aw>>2];aN=c[U>>2]|0;az=aN+32|0;ay=1032;aD=c[ay+4>>2]|0;c[az>>2]=c[ay>>2];c[az+4>>2]=aD;c[aN+40>>2]=ai;aN=c[U>>2]|0;if(((c[V>>2]|0)-aN|0)<49){eA(b,3);bu=c[U>>2]|0}else{bu=aN}c[U>>2]=bu+48;eG(b,bu,1);aN=c[T>>2]|0;aD=c[U>>2]|0;az=aD-16|0;c[U>>2]=az;ay=az;az=aN+aA|0;aC=c[ay+4>>2]|0;c[az>>2]=c[ay>>2];c[az+4>>2]=aC;c[aN+(aA+8)>>2]=c[aD-16+8>>2]}ao=c[K>>2]|0;at=au;continue L1322}break};case 21:{aD=av>>>23;aA=av>>>14&511;c[I>>2]=au;gq(b,1-aD+aA|0,aA);aA=c[S>>2]|0;if((c[aA+68>>2]|0)>>>0>=(c[aA+64>>2]|0)>>>0){e1(b)}aA=c[K>>2]|0;aN=aA+(aD<<4)|0;aC=aA+(aH<<4)|0;az=c[aN+4>>2]|0;c[aC>>2]=c[aN>>2];c[aC+4>>2]=az;c[aA+(aH<<4)+8>>2]=c[aA+(aD<<4)+8>>2];ao=aA;at=au;continue L1322;break};case 22:{ao=ax;at=at+((av>>>14)-131070<<2)|0;continue L1322;break};case 23:{aA=av>>>23;if((aA&256|0)==0){bv=ax+(aA<<4)|0}else{bv=aq+((aA&255)<<4)|0}aA=av>>>14;if((aA&256|0)==0){bw=ax+((aA&511)<<4)|0}else{bw=aq+((aA&255)<<4)|0}c[I>>2]=au;if((c[bv+8>>2]|0)==(c[bw+8>>2]|0)){bx=(gp(b,bv,bw)|0)!=0|0}else{bx=0}if((bx|0)==(aH|0)){by=at+(((c[au>>2]|0)>>>14)-131070<<2)|0}else{by=au}ao=c[K>>2]|0;at=by+4|0;continue L1322;break};case 24:{c[I>>2]=au;aA=av>>>23;if((aA&256|0)==0){bz=ax+(aA<<4)|0}else{bz=aq+((aA&255)<<4)|0}aA=av>>>14;if((aA&256|0)==0){bA=ax+((aA&511)<<4)|0}else{bA=aq+((aA&255)<<4)|0}if((go(b,bz,bA)|0)==(aH|0)){bB=at+(((c[au>>2]|0)>>>14)-131070<<2)|0}else{bB=au}ao=c[K>>2]|0;at=bB+4|0;continue L1322;break};case 25:{c[I>>2]=au;aA=av>>>23;if((aA&256|0)==0){bC=ax+(aA<<4)|0}else{bC=aq+((aA&255)<<4)|0}aA=av>>>14;if((aA&256|0)==0){bD=ax+((aA&511)<<4)|0}else{bD=aq+((aA&255)<<4)|0}aA=bC+8|0;aD=c[aA>>2]|0;az=bD+8|0;L1677:do{if((aD|0)==(c[az>>2]|0)){if((aD|0)==3){bE=+h[bC>>3]<=+h[bD>>3]|0;break}else if((aD|0)==4){aC=c[bC>>2]|0;aN=c[bD>>2]|0;ay=aC+16|0;bF=aN+16|0;bG=aL(ay|0,bF|0)|0;L1683:do{if((bG|0)==0){bH=ay;bI=c[aC+12>>2]|0;bJ=bF;bK=c[aN+12>>2]|0;while(1){bL=j_(bH|0)|0;bM=(bL|0)==(bI|0);if((bL|0)==(bK|0)){break}if(bM){bN=-1;break L1683}bO=bL+1|0;bL=bH+bO|0;bP=bJ+bO|0;bQ=aL(bL|0,bP|0)|0;if((bQ|0)==0){bH=bL;bI=bI-bO|0;bJ=bP;bK=bK-bO|0}else{bN=bQ;break L1683}}bN=bM&1^1}else{bN=bG}}while(0);bE=(bN|0)<1|0;break}else{bG=gg(b,bC,14)|0;aN=bG+8|0;do{if((c[aN>>2]|0)!=0){if((fr(bG,gg(b,bD,14)|0)|0)==0){break}bF=c[U>>2]|0;aC=bF-(c[T>>2]|0)|0;ay=bG;bK=bF;bJ=c[ay+4>>2]|0;c[bK>>2]=c[ay>>2];c[bK+4>>2]=bJ;c[bF+8>>2]=c[aN>>2];bF=c[U>>2]|0;bJ=bC;bK=bF+16|0;ay=c[bJ+4>>2]|0;c[bK>>2]=c[bJ>>2];c[bK+4>>2]=ay;c[bF+24>>2]=c[aA>>2];bF=c[U>>2]|0;ay=bD;bK=bF+32|0;bJ=c[ay+4>>2]|0;c[bK>>2]=c[ay>>2];c[bK+4>>2]=bJ;c[bF+40>>2]=c[az>>2];bF=c[U>>2]|0;if(((c[V>>2]|0)-bF|0)<49){eA(b,3);bR=c[U>>2]|0}else{bR=bF}c[U>>2]=bR+48;eG(b,bR,1);bF=c[T>>2]|0;bJ=c[U>>2]|0;bK=bJ-16|0;c[U>>2]=bK;ay=bK;bK=bF+aC|0;bI=c[ay+4>>2]|0;c[bK>>2]=c[ay>>2];c[bK+4>>2]=bI;c[bF+(aC+8)>>2]=c[bJ-16+8>>2];bJ=c[U>>2]|0;aC=c[bJ+8>>2]|0;if((aC|0)==0){bE=0;break L1677}if((aC|0)!=1){bE=1;break L1677}bE=(c[bJ>>2]|0)!=0|0;break L1677}}while(0);aN=gg(b,bD,13)|0;bG=aN+8|0;do{if((c[bG>>2]|0)!=0){if((fr(aN,gg(b,bC,13)|0)|0)==0){break}bJ=c[U>>2]|0;aC=bJ-(c[T>>2]|0)|0;bF=aN;bI=bJ;bK=c[bF+4>>2]|0;c[bI>>2]=c[bF>>2];c[bI+4>>2]=bK;c[bJ+8>>2]=c[bG>>2];bJ=c[U>>2]|0;bK=bD;bI=bJ+16|0;bF=c[bK+4>>2]|0;c[bI>>2]=c[bK>>2];c[bI+4>>2]=bF;c[bJ+24>>2]=c[az>>2];bJ=c[U>>2]|0;bF=bC;bI=bJ+32|0;bK=c[bF+4>>2]|0;c[bI>>2]=c[bF>>2];c[bI+4>>2]=bK;c[bJ+40>>2]=c[aA>>2];bJ=c[U>>2]|0;if(((c[V>>2]|0)-bJ|0)<49){eA(b,3);bS=c[U>>2]|0}else{bS=bJ}c[U>>2]=bS+48;eG(b,bS,1);bJ=c[T>>2]|0;bK=c[U>>2]|0;bI=bK-16|0;c[U>>2]=bI;bF=bI;bI=bJ+aC|0;ay=c[bF+4>>2]|0;c[bI>>2]=c[bF>>2];c[bI+4>>2]=ay;c[bJ+(aC+8)>>2]=c[bK-16+8>>2];bK=c[U>>2]|0;aC=c[bK+8>>2]|0;if((aC|0)==0){bE=1;break L1677}if((aC|0)!=1){bE=0;break L1677}bE=(c[bK>>2]|0)==0|0;break L1677}}while(0);bE=ev(b,bC,bD)|0;break}}else{bE=ev(b,bC,bD)|0}}while(0);if((bE|0)==(aH|0)){bT=at+(((c[au>>2]|0)>>>14)-131070<<2)|0}else{bT=au}ao=c[K>>2]|0;at=bT+4|0;continue L1322;break};case 26:{aA=c[ax+(aH<<4)+8>>2]|0;do{if((aA|0)==0){bU=1}else{if((aA|0)!=1){bU=0;break}bU=(c[aI>>2]|0)==0|0}}while(0);if((bU|0)==(av>>>14&511|0)){bV=au}else{bV=at+(((c[au>>2]|0)>>>14)-131070<<2)|0}ao=ax;at=bV+4|0;continue L1322;break};case 27:{aA=av>>>23;az=ax+(aA<<4)|0;aD=c[ax+(aA<<4)+8>>2]|0;do{if((aD|0)==0){bW=1}else{if((aD|0)!=1){bW=0;break}bW=(c[az>>2]|0)==0|0}}while(0);if((bW|0)==(av>>>14&511|0)){bX=au}else{aA=az;aw=aI;aB=c[aA+4>>2]|0;c[aw>>2]=c[aA>>2];c[aw+4>>2]=aB;c[ax+(aH<<4)+8>>2]=aD;bX=at+(((c[au>>2]|0)>>>14)-131070<<2)|0}ao=ax;at=bX+4|0;continue L1322;break};case 28:{aB=av>>>23;aw=av>>>14&511;if((aB|0)!=0){c[U>>2]=ax+(aH+aB<<4)}c[I>>2]=au;aB=eF(b,aI,aw-1|0)|0;if((aB|0)==0){aG=1293;break L1320}else if((aB|0)!=1){aG=1376;break L1318}if((aw|0)!=0){c[U>>2]=c[(c[J>>2]|0)+8>>2]}ao=c[K>>2]|0;at=au;continue L1322;break};case 29:{aw=av>>>23;if((aw|0)!=0){c[U>>2]=ax+(aH+aw<<4)}c[I>>2]=au;aw=eF(b,aI,-1)|0;if((aw|0)==0){break L1322}else if((aw|0)!=1){aG=1377;break L1318}ao=c[K>>2]|0;at=au;continue L1322;break};case 30:{break L1320;break};case 31:{bh=+h[ax+(aH+2<<4)>>3];aw=aI|0;bg=bh+ +h[aw>>3];bY=+h[ax+(aH+1<<4)>>3];if(bh>0.0){if(bg>bY){ao=ax;at=au;continue L1322}}else{if(bY>bg){ao=ax;at=au;continue L1322}}h[aw>>3]=bg;c[ax+(aH<<4)+8>>2]=3;aw=aH+3|0;h[ax+(aw<<4)>>3]=bg;c[ax+(aw<<4)+8>>2]=3;ao=ax;at=at+((av>>>14)-131070<<2)|0;continue L1322;break};case 32:{aw=aH+1|0;aB=ax+(aw<<4)|0;aA=aH+2|0;bG=ax+(aA<<4)|0;c[I>>2]=au;aN=ax+(aH<<4)+8|0;bK=c[aN>>2]|0;L1749:do{if((bK|0)==3){aG=1322}else{do{if((bK|0)==4){if((fw((c[aI>>2]|0)+16|0,y)|0)==0){break}h[aI>>3]=+h[y>>3];c[aN>>2]=3;if((aI|0)!=0){aG=1322;break L1749}}}while(0);es(b,3360,(bZ=i,i=i+1|0,i=i+7>>3<<3,c[bZ>>2]=0,bZ)|0);i=bZ}}while(0);L1755:do{if((aG|0)==1322){aG=0;bK=ax+(aw<<4)+8|0;aD=c[bK>>2]|0;L1757:do{if((aD|0)!=3){do{if((aD|0)==4){if((fw((c[aB>>2]|0)+16|0,x)|0)==0){break}h[aB>>3]=+h[x>>3];c[bK>>2]=3;if((aB|0)!=0){break L1757}}}while(0);es(b,2832,(bZ=i,i=i+1|0,i=i+7>>3<<3,c[bZ>>2]=0,bZ)|0);i=bZ;break L1755}}while(0);bK=ax+(aA<<4)+8|0;aD=c[bK>>2]|0;if((aD|0)==3){break}if((aD|0)!=4){aG=1372;break L1318}if((fw((c[bG>>2]|0)+16|0,w)|0)==0){aG=1373;break L1318}h[bG>>3]=+h[w>>3];c[bK>>2]=3;if((bG|0)==0){aG=1374;break L1318}}}while(0);aA=aI|0;h[aA>>3]=+h[aA>>3]- +h[bG>>3];c[aN>>2]=3;ao=ax;at=at+((av>>>14)-131070<<2)|0;continue L1322;break};case 33:{aA=aH+3|0;aB=ax+(aA<<4)|0;aw=aH+2|0;bK=aH+5|0;aD=ax+(aw<<4)|0;az=ax+(bK<<4)|0;aC=c[aD+4>>2]|0;c[az>>2]=c[aD>>2];c[az+4>>2]=aC;c[ax+(bK<<4)+8>>2]=c[ax+(aw<<4)+8>>2];bK=aH+1|0;aC=aH+4|0;az=ax+(bK<<4)|0;aD=ax+(aC<<4)|0;bJ=c[az+4>>2]|0;c[aD>>2]=c[az>>2];c[aD+4>>2]=bJ;c[ax+(aC<<4)+8>>2]=c[ax+(bK<<4)+8>>2];bK=aI;aC=aB;bJ=c[bK+4>>2]|0;c[aC>>2]=c[bK>>2];c[aC+4>>2]=bJ;c[ax+(aA<<4)+8>>2]=c[ax+(aH<<4)+8>>2];c[U>>2]=ax+(aH+6<<4);c[I>>2]=au;eG(b,aB,av>>>14&511);aB=c[K>>2]|0;c[U>>2]=c[(c[J>>2]|0)+8>>2];bJ=c[aB+(aA<<4)+8>>2]|0;if((bJ|0)==0){b_=au}else{aC=aB+(aA<<4)|0;aA=aB+(aw<<4)|0;bK=c[aC+4>>2]|0;c[aA>>2]=c[aC>>2];c[aA+4>>2]=bK;c[aB+(aw<<4)+8>>2]=bJ;b_=at+(((c[au>>2]|0)>>>14)-131070<<2)|0}ao=aB;at=b_+4|0;continue L1322;break};case 34:{aB=av>>>23;bJ=av>>>14&511;if((aB|0)==0){aw=((c[U>>2]|0)-aI>>4)-1|0;c[U>>2]=c[(c[J>>2]|0)+8>>2];b$=aw}else{b$=aB}if((bJ|0)==0){b0=at+8|0;b1=c[au>>2]|0}else{b0=au;b1=bJ}if((c[ax+(aH<<4)+8>>2]|0)!=5){ao=ax;at=b0;continue L1322}bJ=c[aI>>2]|0;aB=bJ;aw=b$-50+(b1*50|0)|0;if((aw|0)>(c[bJ+28>>2]|0)){f1(b,aB,aw)}if((b$|0)<=0){ao=ax;at=b0;continue L1322}bK=bJ+5|0;bJ=aw;aw=b$;while(1){aA=aw+aH|0;aC=ax+(aA<<4)|0;aD=bJ-1|0;az=gc(b,aB,bJ)|0;ay=aC;bI=az;bF=c[ay+4>>2]|0;c[bI>>2]=c[ay>>2];c[bI+4>>2]=bF;bF=ax+(aA<<4)+8|0;c[az+8>>2]=c[bF>>2];do{if((c[bF>>2]|0)>3){if((a[(c[aC>>2]|0)+5|0]&3)==0){break}if((a[bK]&4)==0){break}e2(b,aB)}}while(0);aC=aw-1|0;if((aC|0)>0){bJ=aD;aw=aC}else{ao=ax;at=b0;continue L1322}}break};case 35:{eU(b,aI);ao=ax;at=au;continue L1322;break};case 36:{aw=c[(c[(c[ap>>2]|0)+16>>2]|0)+(av>>>14<<2)>>2]|0;bJ=a[aw+72|0]|0;aB=bJ&255;bK=eP(b,aB,c[as>>2]|0)|0;aN=bK;c[bK+16>>2]=aw;if(bJ<<24>>24==0){b2=au}else{aw=(bJ&255)>1;bJ=0;bG=au;while(1){aC=c[bG>>2]|0;bF=aC>>>23;if((aC&63|0)==4){c[aN+20+(bJ<<2)>>2]=c[ar+(bF<<2)>>2]}else{c[aN+20+(bJ<<2)>>2]=eR(b,ax+(bF<<4)|0)|0}bF=bJ+1|0;if((bF|0)<(aB|0)){bJ=bF;bG=bG+4|0}else{break}}b2=at+((aw?aB+1|0:2)<<2)|0}c[aI>>2]=bK;c[ax+(aH<<4)+8>>2]=6;c[I>>2]=b2;bG=c[S>>2]|0;if((c[bG+68>>2]|0)>>>0>=(c[bG+64>>2]|0)>>>0){e1(b)}ao=c[K>>2]|0;at=b2;continue L1322;break};case 37:{bG=av>>>23;bJ=bG-1|0;aN=c[J>>2]|0;bF=aN|0;aC=((c[bF>>2]|0)-(c[aN+4>>2]|0)>>4)-(d[(c[ap>>2]|0)+73|0]|0)|0;aN=aC-1|0;if((bG|0)==0){c[I>>2]=au;if(((c[V>>2]|0)-(c[U>>2]|0)|0)<=(aN<<4|0)){eA(b,aN)}bG=c[K>>2]|0;c[U>>2]=bG+(aN+aH<<4);b3=bG;b4=bG+(aH<<4)|0;b5=aN}else{b3=ax;b4=aI;b5=bJ}if((b5|0)<=0){ao=b3;at=au;continue L1322}bJ=1-aC|0;aC=0;while(1){if((aC|0)<(aN|0)){bG=c[bF>>2]|0;az=aC+bJ|0;aA=bG+(az<<4)|0;bI=b4+(aC<<4)|0;ay=c[aA+4>>2]|0;c[bI>>2]=c[aA>>2];c[bI+4>>2]=ay;c[b4+(aC<<4)+8>>2]=c[bG+(az<<4)+8>>2]}else{c[b4+(aC<<4)+8>>2]=0}az=aC+1|0;if((az|0)<(b5|0)){aC=az}else{ao=b3;at=au;continue L1322}}break};default:{ao=ax;at=au;continue L1322}}}ao=c[J>>2]|0;ap=ao-24+4|0;ar=c[ap>>2]|0;as=c[ao+4>>2]|0;aq=ao-24|0;if((c[am>>2]|0)==0){b6=ar}else{eU(b,c[aq>>2]|0);b6=c[ap>>2]|0}ap=b6+((c[ao>>2]|0)-as>>4<<4)|0;c[aq>>2]=ap;c[K>>2]=ap;if(as>>>0<(c[U>>2]|0)>>>0){ap=0;aq=as;aC=ar;while(1){bJ=aq;bF=aC;aN=c[bJ+4>>2]|0;c[bF>>2]=c[bJ>>2];c[bF+4>>2]=aN;c[ar+(ap<<4)+8>>2]=c[as+(ap<<4)+8>>2];aN=ap+1|0;bF=as+(aN<<4)|0;bJ=ar+(aN<<4)|0;if(bF>>>0<(c[U>>2]|0)>>>0){ap=aN;aq=bF;aC=bJ}else{b7=bJ;break}}}else{b7=ar}c[U>>2]=b7;c[ao-24+8>>2]=b7;c[ao-24+12>>2]=c[I>>2];aC=ao-24+20|0;c[aC>>2]=(c[aC>>2]|0)+1;aC=(c[J>>2]|0)-24|0;c[J>>2]=aC;e=aC}if((aG|0)==1293){aG=0;an=an+1|0;continue}e=av>>>23;if((e|0)!=0){c[U>>2]=ax+(e-1+aH<<4)}if((c[am>>2]|0)!=0){eU(b,ax)}c[I>>2]=au;e=eD(b,aI)|0;aC=an-1|0;if((aC|0)==0){aG=1378;break}if((e|0)==0){an=aC;continue}c[U>>2]=c[(c[J>>2]|0)+8>>2];an=aC}if((aG|0)==999){c[I>>2]=at;i=f;return}else if((aG|0)==1372){es(b,2480,(bZ=i,i=i+1|0,i=i+7>>3<<3,c[bZ>>2]=0,bZ)|0);i=bZ}else if((aG|0)==1373){es(b,2480,(bZ=i,i=i+1|0,i=i+7>>3<<3,c[bZ>>2]=0,bZ)|0);i=bZ}else if((aG|0)==1374){es(b,2480,(bZ=i,i=i+1|0,i=i+7>>3<<3,c[bZ>>2]=0,bZ)|0);i=bZ}else if((aG|0)==1376){i=f;return}else if((aG|0)==1377){i=f;return}else if((aG|0)==1378){i=f;return}}function gs(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;c[b+16>>2]=a;c[b+8>>2]=d;c[b+12>>2]=e;c[b>>2]=0;c[b+4>>2]=0;return}function gt(a,b){a=a|0;b=b|0;c[b+8>>2]=a;c[b>>2]=b+12;c[b+4>>2]=0;return}function gu(a){a=a|0;var b=0,e=0,f=0,g=0,h=0;b=i;i=i+8|0;e=b|0;f=ch[c[a+8>>2]&511](c[a+16>>2]|0,c[a+12>>2]|0,e)|0;if((f|0)==0){g=-1;i=b;return g|0}h=c[e>>2]|0;if((h|0)==0){g=-1;i=b;return g|0}c[a>>2]=h-1;c[a+4>>2]=f+1;g=d[f]|0;i=b;return g|0}
function gv(a){a=a|0;var b=0,e=0,f=0,g=0,h=0,j=0,k=0;b=i;i=i+8|0;e=b|0;f=a|0;do{if((c[f>>2]|0)==0){g=ch[c[a+8>>2]&511](c[a+16>>2]|0,c[a+12>>2]|0,e)|0;if((g|0)==0){h=-1;i=b;return h|0}j=c[e>>2]|0;if((j|0)==0){h=-1;i=b;return h|0}else{c[f>>2]=j;c[a+4>>2]=g;k=g;break}}else{k=c[a+4>>2]|0}}while(0);h=d[k]|0;i=b;return h|0}function gw(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;e=i;i=i+8|0;f=e|0;if((d|0)==0){g=0;i=e;return g|0}h=a|0;j=a+16|0;k=a+8|0;l=a+12|0;m=a+4|0;a=b;b=d;d=c[h>>2]|0;while(1){if((d|0)==0){n=ch[c[k>>2]&511](c[j>>2]|0,c[l>>2]|0,f)|0;if((n|0)==0){g=b;o=1410;break}p=c[f>>2]|0;if((p|0)==0){g=b;o=1409;break}c[h>>2]=p;c[m>>2]=n;q=p;r=n}else{q=d;r=c[m>>2]|0}n=b>>>0>q>>>0?q:b;j$(a|0,r|0,n)|0;p=(c[h>>2]|0)-n|0;c[h>>2]=p;c[m>>2]=(c[m>>2]|0)+n;if((b|0)==(n|0)){g=0;o=1408;break}else{a=a+n|0;b=b-n|0;d=p}}if((o|0)==1409){i=e;return g|0}else if((o|0)==1408){i=e;return g|0}else if((o|0)==1410){i=e;return g|0}return 0}function gx(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=b+8|0;f=c[e>>2]|0;if(f>>>0>=d>>>0){g=c[b>>2]|0;return g|0}h=d>>>0<32?32:d;if((h+1|0)>>>0<4294967294){d=b|0;i=fu(a,c[d>>2]|0,f,h)|0;j=d}else{i=fv(a)|0;j=b|0}c[j>>2]=i;c[e>>2]=h;g=i;return g|0}function gy(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;e=i;i=i+104|0;f=e|0;if((ej(a,0,f)|0)==0){g=gz(a,6560,(h=i,i=i+16|0,c[h>>2]=b,c[h+8>>2]=d,h)|0)|0;i=h;j=g;i=e;return j|0}en(a,9736,f)|0;do{if((aL(c[f+8>>2]|0,7800)|0)==0){g=b-1|0;if((g|0)!=0){k=g;break}g=gz(a,5928,(h=i,i=i+16|0,c[h>>2]=c[f+4>>2],c[h+8>>2]=d,h)|0)|0;i=h;j=g;i=e;return j|0}else{k=b}}while(0);b=f+4|0;f=c[b>>2]|0;if((f|0)==0){c[b>>2]=4656;l=4656}else{l=f}f=gz(a,3912,(h=i,i=i+24|0,c[h>>2]=k,c[h+8>>2]=l,c[h+16>>2]=d,h)|0)|0;i=h;j=f;i=e;return j|0}function gz(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;e=i;i=i+120|0;f=e|0;g=e+104|0;h=g|0;j=g;c[j>>2]=d;c[j+4>>2]=0;do{if((ej(a,1,f)|0)!=0){en(a,2816,f)|0;j=c[f+20>>2]|0;if((j|0)<=0){break}d=f+36|0;dc(a,2464,(g=i,i=i+16|0,c[g>>2]=d,c[g+8>>2]=j,g)|0)|0;i=g;k=db(a,b,h)|0;dG(a,2);l=dE(a)|0;i=e;return l|0}}while(0);c9(a,10520,0);k=db(a,b,h)|0;dG(a,2);l=dE(a)|0;i=e;return l|0}function gA(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;f=cL(a,cK(a,b)|0)|0;g=dc(a,3328,(h=i,i=i+16|0,c[h>>2]=d,c[h+8>>2]=f,h)|0)|0;i=h;h=gy(a,b,g)|0;i=e;return h|0}function gB(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+104|0;e=d|0;do{if((ej(a,b,e)|0)!=0){en(a,2816,e)|0;f=c[e+20>>2]|0;if((f|0)<=0){break}g=e+36|0;dc(a,2464,(h=i,i=i+16|0,c[h>>2]=g,c[h+8>>2]=f,h)|0)|0;i=h;i=d;return}}while(0);c9(a,10520,0);i=d;return}function gC(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;do{if((d|0)==0){g=c0(a,b,0)|0;if((g|0)!=0){h=g;break}g=cL(a,4)|0;j=cL(a,cK(a,b)|0)|0;k=dc(a,3328,(l=i,i=i+16|0,c[l>>2]=g,c[l+8>>2]=j,l)|0)|0;i=l;gy(a,b,k)|0;h=0}else{h=gD(a,b,d,0)|0}}while(0);d=0;while(1){k=c[e+(d<<2)>>2]|0;if((k|0)==0){break}if((aL(k|0,h|0)|0)==0){m=d;n=1457;break}else{d=d+1|0}}if((n|0)==1457){i=f;return m|0}n=dc(a,10352,(l=i,i=i+8|0,c[l>>2]=h,l)|0)|0;i=l;m=gy(a,b,n)|0;i=f;return m|0}function gD(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;if((cK(a,b)|0)>=1){g=c0(a,b,e)|0;if((g|0)!=0){h=g;i=f;return h|0}g=cL(a,4)|0;j=cL(a,cK(a,b)|0)|0;k=dc(a,3328,(l=i,i=i+16|0,c[l>>2]=g,c[l+8>>2]=j,l)|0)|0;i=l;gy(a,b,k)|0;h=0;i=f;return h|0}if((e|0)==0){h=d;i=f;return h|0}if((d|0)==0){m=0}else{m=j_(d|0)|0}c[e>>2]=m;h=d;i=f;return h|0}function gE(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;f=c0(a,b,d)|0;if((f|0)!=0){i=e;return f|0}d=cL(a,4)|0;g=cL(a,cK(a,b)|0)|0;h=dc(a,3328,(j=i,i=i+16|0,c[j>>2]=d,c[j+8>>2]=g,j)|0)|0;i=j;gy(a,b,h)|0;i=e;return f|0}function gF(a,b){a=a|0;b=b|0;var c=0;df(a,-1e4,b);if((cK(a,-1)|0)!=0){c=0;return c|0}cG(a,-2);di(a,0,0);cJ(a,-1);dm(a,-1e4,b);c=1;return c|0}function gG(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;f=cZ(a,b)|0;do{if((f|0)!=0){if((dj(a,b)|0)==0){break}df(a,-1e4,d);if((cT(a,-1,-2)|0)==0){break}cG(a,-3);g=f;i=e;return g|0}}while(0);f=cL(a,cK(a,b)|0)|0;h=dc(a,3328,(j=i,i=i+16|0,c[j>>2]=d,c[j+8>>2]=f,j)|0)|0;i=j;gy(a,b,h)|0;g=0;i=e;return g|0}function gH(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=i;if((cN(a,b)|0)!=0){i=e;return}gz(a,10176,(a=i,i=i+8|0,c[a>>2]=d,a)|0)|0;i=a;i=e;return}function gI(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;if((cK(a,b)|0)==(d|0)){i=e;return}f=cL(a,d)|0;d=cL(a,cK(a,b)|0)|0;g=dc(a,3328,(h=i,i=i+16|0,c[h>>2]=f,c[h+8>>2]=d,h)|0)|0;i=h;gy(a,b,g)|0;i=e;return}function gJ(a,b){a=a|0;b=b|0;if((cK(a,b)|0)!=-1){return}gy(a,b,9896)|0;return}function gK(a,b){a=a|0;b=b|0;var d=0,e=0.0,f=0,g=0,h=0,j=0;d=i;e=+cW(a,b);if(e!=0.0){i=d;return+e}if((cS(a,b)|0)!=0){i=d;return+e}f=cL(a,3)|0;g=cL(a,cK(a,b)|0)|0;h=dc(a,3328,(j=i,i=i+16|0,c[j>>2]=f,c[j+8>>2]=g,j)|0)|0;i=j;gy(a,b,h)|0;i=d;return+e}function gL(a,b,c){a=a|0;b=b|0;c=+c;var d=0.0;if((cK(a,b)|0)<1){d=c;return+d}d=+gK(a,b);return+d}function gM(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;e=c$(a,b)|0;if((e|0)!=0){i=d;return e|0}if((cS(a,b)|0)!=0){i=d;return e|0}f=cL(a,3)|0;g=cL(a,cK(a,b)|0)|0;h=dc(a,3328,(j=i,i=i+16|0,c[j>>2]=f,c[j+8>>2]=g,j)|0)|0;i=j;gy(a,b,h)|0;i=d;return e|0}function gN(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;if((cK(a,b)|0)<1){d=c;return d|0}d=gM(a,b)|0;return d|0}function gO(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;if((dj(a,b)|0)==0){d=0;return d|0}da(a,c);dg(a,-2);if((cK(a,-1)|0)==0){cG(a,-3);d=0;return d|0}else{cH(a,-2);d=1;return d|0}return 0}function gP(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;if((b+9999|0)>>>0>9999){d=b}else{d=b+1+(cF(a)|0)|0}if((dj(a,d)|0)==0){e=0;return e|0}da(a,c);dg(a,-2);if((cK(a,-1)|0)==0){cG(a,-3);e=0;return e|0}else{cH(a,-2);cJ(a,d);dw(a,1,1);e=1;return e|0}return 0}function gQ(a,b,c){a=a|0;b=b|0;c=c|0;gR(a,b,c,0);return}function gR(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;g=d|0;if((b|0)!=0){if((c[g>>2]|0)==0){h=0}else{j=d;d=0;while(1){k=d+1|0;l=j+8|0;if((c[l>>2]|0)==0){h=k;break}else{j=l;d=k}}}gS(a,-1e4,9680,1)|0;df(a,-1,b);if((cK(a,-1)|0)!=5){cG(a,-2);if((gS(a,-10002,b,h)|0)!=0){gz(a,9464,(h=i,i=i+8|0,c[h>>2]=b,h)|0)|0;i=h}cJ(a,-1);dm(a,-3,b)}cH(a,-2);cI(a,~e)}if((c[g>>2]|0)==0){m=~e;cG(a,m);i=f;return}b=-2-e|0;h=-e|0;if((e|0)>0){n=g}else{d=g;do{dd(a,c[d+4>>2]|0,e);dm(a,b,c[d>>2]|0);d=d+8|0;}while((c[d>>2]|0)!=0);m=~e;cG(a,m);i=f;return}do{d=0;do{cJ(a,h);d=d+1|0;}while((d|0)<(e|0));dd(a,c[n+4>>2]|0,e);dm(a,b,c[n>>2]|0);n=n+8|0;}while((c[n>>2]|0)!=0);m=~e;cG(a,m);i=f;return}function gS(b,c,d,e){b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0;cJ(b,c);c=d;while(1){d=aU(c|0,46)|0;if((d|0)==0){f=c+(j_(c|0)|0)|0}else{f=d}d=f-c|0;c9(b,c,d);dg(b,-2);if((cK(b,-1)|0)==0){cG(b,-2);di(b,0,(a[f]|0)==46?1:e);c9(b,c,d);cJ(b,-2);dl(b,-4)}else{if((cK(b,-1)|0)!=5){break}}cH(b,-2);if((a[f]|0)==46){c=f+1|0}else{g=0;h=1573;break}}if((h|0)==1573){return g|0}cG(b,-3);g=c;return g|0}function gT(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;g=i;i=i+1040|0;h=g|0;j=j_(e|0)|0;k=h+8|0;c[k>>2]=b;l=h+12|0;m=h|0;c[m>>2]=l;n=h+4|0;c[n>>2]=0;o=aF(d|0,e|0)|0;if((o|0)==0){p=d}else{q=h+1036|0;r=d;d=o;while(1){L2080:do{if((d|0)!=(r|0)){o=r;s=d-r|0;while(1){t=s-1|0;u=c[m>>2]|0;if(u>>>0<q>>>0){v=u}else{gY(h)|0;v=c[m>>2]|0}u=a[o]|0;c[m>>2]=v+1;a[v]=u;if((t|0)==0){break L2080}o=o+1|0;s=t}}}while(0);s=j_(f|0)|0;L2089:do{if((s|0)!=0){o=f;t=s;while(1){u=t-1|0;w=c[m>>2]|0;if(w>>>0<q>>>0){x=w}else{gY(h)|0;x=c[m>>2]|0}w=a[o]|0;c[m>>2]=x+1;a[x]=w;if((u|0)==0){break L2089}o=o+1|0;t=u}}}while(0);s=d+j|0;t=aF(s|0,e|0)|0;if((t|0)==0){p=s;break}else{r=s;d=t}}}d=j_(p|0)|0;L2098:do{if((d|0)!=0){r=h+1036|0;e=p;j=d;while(1){x=j-1|0;q=c[m>>2]|0;if(q>>>0<r>>>0){y=q}else{gY(h)|0;y=c[m>>2]|0}q=a[e]|0;c[m>>2]=y+1;a[y]=q;if((x|0)==0){break L2098}e=e+1|0;j=x}}}while(0);y=c[m>>2]|0;if((y|0)==(l|0)){z=c[n>>2]|0;A=c[k>>2]|0;dG(A,z);c[n>>2]=1;B=c0(b,-1,0)|0;i=g;return B|0}else{c9(c[k>>2]|0,l,y-l|0);c[m>>2]=l;l=(c[n>>2]|0)+1|0;c[n>>2]=l;z=l;A=c[k>>2]|0;dG(A,z);c[n>>2]=1;B=c0(b,-1,0)|0;i=g;return B|0}return 0}function gU(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;a=b+4|0;e=c[a>>2]|0;if((e|0)==0){f=0;return f|0}c[d>>2]=e;c[a>>2]=0;f=c[b>>2]|0;return f|0}function gV(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;if((e|0)==0){return}f=b|0;g=b+1036|0;h=d;d=e;while(1){e=d-1|0;i=c[f>>2]|0;if(i>>>0<g>>>0){j=i}else{gY(b)|0;j=c[f>>2]|0}i=a[h]|0;c[f>>2]=j+1;a[j]=i;if((e|0)==0){break}else{h=h+1|0;d=e}}return}function gW(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=j_(d|0)|0;if((e|0)==0){return}f=b|0;g=b+1036|0;h=d;d=e;while(1){e=d-1|0;i=c[f>>2]|0;if(i>>>0<g>>>0){j=i}else{gY(b)|0;j=c[f>>2]|0}i=a[h]|0;c[f>>2]=j+1;a[j]=i;if((e|0)==0){break}else{h=h+1|0;d=e}}return}function gX(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=a|0;d=c[b>>2]|0;e=a+12|0;if((d|0)==(e|0)){f=c[a+4>>2]|0;g=a+8|0}else{h=a+8|0;c9(c[h>>2]|0,e,d-e|0);c[b>>2]=e;e=a+4|0;b=(c[e>>2]|0)+1|0;c[e>>2]=b;f=b;g=h}dG(c[g>>2]|0,f);c[a+4>>2]=1;return}function gY(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;b=a|0;d=c[b>>2]|0;e=a+12|0;if((d|0)==(e|0)){return e|0}f=a+8|0;c9(c[f>>2]|0,e,d-e|0);c[b>>2]=e;b=a+4|0;a=c[b>>2]|0;c[b>>2]=a+1;if((a|0)<=0){return e|0}a=c[f>>2]|0;f=1;d=c1(a,-1)|0;while(1){g=f+1|0;h=c1(a,~f)|0;i=c[b>>2]|0;if(!((1-f+i|0)>9|d>>>0>h>>>0)){j=f;break}if((g|0)<(i|0)){f=g;d=h+d|0}else{j=g;break}}dG(a,j);c[b>>2]=1-j+(c[b>>2]|0);return e|0}function gZ(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;b=i;i=i+8|0;d=b|0;e=a+8|0;f=c[e>>2]|0;g=c0(f,-1,d)|0;h=c[d>>2]|0;j=a|0;k=c[j>>2]|0;l=a+12|0;m=k;n=l;if(h>>>0<=(n+1024-m|0)>>>0){j$(k|0,g|0,h)|0;c[j>>2]=(c[j>>2]|0)+(c[d>>2]|0);cG(f,-2);i=b;return}if((k|0)==(l|0)){o=a+4|0}else{c9(c[e>>2]|0,l,m-n|0);c[j>>2]=l;l=a+4|0;c[l>>2]=(c[l>>2]|0)+1;cI(f,-2);o=l}l=c[o>>2]|0;c[o>>2]=l+1;if((l|0)<=0){i=b;return}l=c[e>>2]|0;e=1;f=c1(l,-1)|0;while(1){a=e+1|0;j=c1(l,~e)|0;n=c[o>>2]|0;if(!((1-e+n|0)>9|f>>>0>j>>>0)){p=e;break}if((a|0)<(n|0)){e=a;f=j+f|0}else{p=a;break}}dG(l,p);c[o>>2]=1-p+(c[o>>2]|0);i=b;return}function g_(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;if((b+9999|0)>>>0>9999){c=b}else{c=b+1+(cF(a)|0)|0}if((cK(a,-1)|0)==0){cG(a,-2);d=-1;return d|0}dh(a,c,0);b=c$(a,-1)|0;cG(a,-2);if((b|0)==0){e=(c1(a,c)|0)+1|0}else{dh(a,c,b);dp(a,c,0);e=b}dp(a,c,e);d=e;return d|0}function g$(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;if((c|0)<=-1){return}if((b+9999|0)>>>0>9999){d=b}else{d=b+1+(cF(a)|0)|0}dh(a,d,0);dp(a,d,c);c5(a,c);dp(a,d,0);return}function g0(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;d=i;i=i+1032|0;e=d|0;f=(cF(a)|0)+1|0;g=e|0;c[g>>2]=0;h=(b|0)==0;do{if(h){c9(a,9256,6);j=c[m>>2]|0;c[e+4>>2]=j;k=j}else{dc(a,9128,(l=i,i=i+8|0,c[l>>2]=b,l)|0)|0;i=l;j=bl(b|0,8984)|0;c[e+4>>2]=j;if((j|0)!=0){k=j;break}j=bF(c[(bE()|0)>>2]|0)|0;n=(c0(a,f,0)|0)+1|0;dc(a,7280,(l=i,i=i+24|0,c[l>>2]=8824,c[l+8>>2]=n,c[l+16>>2]=j,l)|0)|0;i=l;cH(a,f);o=6;i=d;return o|0}}while(0);j=e+4|0;n=aQ(k|0)|0;L2199:do{if((n|0)==35){c[g>>2]=1;while(1){k=aQ(c[j>>2]|0)|0;if((k|0)==10){break}else if((k|0)==(-1|0)){p=-1;break L2199}}q=aQ(c[j>>2]|0)|0;r=1676}else{q=n;r=1676}}while(0);do{if((r|0)==1676){if((q|0)!=27|h){p=q;break}n=a1(b|0,8440,c[j>>2]|0)|0;c[j>>2]=n;if((n|0)==0){k=bF(c[(bE()|0)>>2]|0)|0;s=(c0(a,f,0)|0)+1|0;dc(a,7280,(l=i,i=i+24|0,c[l>>2]=8224,c[l+8>>2]=s,c[l+16>>2]=k,l)|0)|0;i=l;cH(a,f);o=6;i=d;return o|0}else{t=n}while(1){u=aQ(t|0)|0;if((u|0)==(-1|0)|(u|0)==27){break}t=c[j>>2]|0}c[g>>2]=0;p=u}}while(0);bI(p|0,c[j>>2]|0)|0;p=dB(a,254,e,c0(a,-1,0)|0)|0;e=c[j>>2]|0;j=a4(e|0)|0;if(!h){ar(e|0)|0}if((j|0)==0){cH(a,f);o=p;i=d;return o|0}else{cG(a,f);p=bF(c[(bE()|0)>>2]|0)|0;j=(c0(a,f,0)|0)+1|0;dc(a,7280,(l=i,i=i+24|0,c[l>>2]=7960,c[l+8>>2]=j,c[l+16>>2]=p,l)|0)|0;i=l;cH(a,f);o=6;i=d;return o|0}return 0}function g1(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;a=b;if((c[a>>2]|0)!=0){c[a>>2]=0;c[d>>2]=1;e=7520;return e|0}a=b+4|0;if((bQ(c[a>>2]|0)|0)!=0){e=0;return e|0}f=b+8|0;b=bw(f|0,1,1024,c[a>>2]|0)|0;c[d>>2]=b;e=(b|0)==0?0:f;return e|0}function g2(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;i=i+8|0;g=f|0;c[g>>2]=b;c[g+4>>2]=d;d=dB(a,256,g,e)|0;i=f;return d|0}function g3(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;i=i+8|0;e=d|0;f=j_(b|0)|0;c[e>>2]=b;c[e+4>>2]=f;f=dB(a,256,e,b)|0;i=d;return f|0}function g4(){var a=0;a=fV(254,0)|0;if((a|0)==0){return a|0}cE(a,332)|0;return a|0}function g5(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;if((d|0)==0){jV(b);e=0}else{e=jW(b,d)|0}return e|0}function g6(a){a=a|0;var b=0,d=0,e=0;b=i;d=c[n>>2]|0;e=c0(a,-1,0)|0;bN(d|0,7712|0,(d=i,i=i+8|0,c[d>>2]=e,d)|0)|0;i=d;i=b;return 0}function g7(a){a=a|0;cJ(a,-10002);dm(a,-10002,9248);gQ(a,9248,1864);c9(a,9120,7);dm(a,-10002,8968);dd(a,404,0);dd(a,502,1);dm(a,-2,8816);dd(a,264,0);dd(a,254,1);dm(a,-2,8616);di(a,0,1);cJ(a,-1);dq(a,-2)|0;c9(a,8432,2);dm(a,-2,8216);dd(a,352,1);dm(a,-10002,7944);gQ(a,6064,1808);return 2}function g8(a){a=a|0;var b=0,c=0;b=cO(a)|0;if((cK(a,1)|0)==6){if((cM(a,1)|0)!=0){c=1715}}else{c=1715}if((c|0)==1715){gy(a,1,9440)|0}cJ(a,1);cC(a,b,1);return 1}function g9(a){a=a|0;var b=0,c=0,d=0;b=c_(a,1)|0;if((b|0)==0){gy(a,1,9656)|0}c=hf(a,b,(cF(a)|0)-1|0)|0;if((c|0)<0){c6(a,0);cI(a,-2);d=2;return d|0}else{c6(a,1);cI(a,~c);d=c+1|0;return d|0}return 0}function ha(a){a=a|0;if((c8(a)|0)!=0){c3(a)}return 1}function hb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;i=i+104|0;d=b|0;e=c_(a,1)|0;if((e|0)==0){gy(a,1,9656)|0}do{if((e|0)==(a|0)){f=0}else{g=dr(e)|0;if((g|0)==1){f=1;break}else if((g|0)!=0){f=3;break}if((ej(e,0,d)|0)>0){f=2;break}f=(cF(e)|0)==0?3:1}}while(0);da(a,c[312+(f<<2)>>2]|0);i=b;return 1}function hc(a){a=a|0;var b=0,c=0;b=cO(a)|0;if((cK(a,1)|0)==6){if((cM(a,1)|0)!=0){c=1738}}else{c=1738}if((c|0)==1738){gy(a,1,9440)|0}cJ(a,1);cC(a,b,1);dd(a,316,1);return 1}function hd(a){a=a|0;return eI(a,cF(a)|0)|0}function he(a){a=a|0;var b=0,c=0;b=c_(a,-10003)|0;c=hf(a,b,cF(a)|0)|0;if((c|0)>=0){return c|0}if((cQ(a,-1)|0)!=0){gB(a,1);cI(a,-2);dG(a,2)}dE(a)|0;return c|0}function hf(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+104|0;f=e|0;do{if((a|0)==(b|0)){g=0}else{h=dr(b)|0;if((h|0)==1){g=1;break}else if((h|0)!=0){g=3;break}if((ej(b,0,f)|0)>0){g=2;break}g=(cF(b)|0)==0?3:1}}while(0);if((cN(b,d)|0)==0){gz(a,2784,(j=i,i=i+1|0,i=i+7>>3<<3,c[j>>2]=0,j)|0)|0;i=j}if((g|0)!=1){f=c[312+(g<<2)>>2]|0;dc(a,2432,(j=i,i=i+8|0,c[j>>2]=f,j)|0)|0;i=j;k=-1;i=e;return k|0}cC(a,b,d);cD(a,b);if((eE(b,d)|0)>>>0>=2){cC(b,a,1);k=-1;i=e;return k|0}d=cF(b)|0;if((cN(a,d+1|0)|0)==0){gz(a,2200,(j=i,i=i+1|0,i=i+7>>3<<3,c[j>>2]=0,j)|0)|0;i=j}cC(b,a,d);k=d;i=e;return k|0}function hg(a){a=a|0;gI(a,1,5);cJ(a,-10003);cJ(a,1);c5(a,0);return 3}function hh(a){a=a|0;var b=0,c=0;b=gM(a,2)|0;gI(a,1,5);c=b+1|0;c5(a,c);dh(a,1,c);return((cK(a,-1)|0)==0?0:2)|0}function hi(a){a=a|0;gI(a,1,5);cJ(a,-10003);cJ(a,1);c3(a);return 3}function hj(a){a=a|0;var b=0;gI(a,1,5);cG(a,2);if((dF(a,1)|0)!=0){b=2;return b|0}c3(a);b=1;return b|0}function hk(a){a=a|0;var b=0,c=0;cG(a,1);dH(a,0)|0;if((cX(a,1)|0)==0){return 1}if((cK(a,1)|0)==1){di(a,0,0);cJ(a,-1);c6(a,1);dn(a,-10003)}else{if((dj(a,1)|0)==0){b=1779}else{dg(a,-10003);c=cX(a,-1)|0;cG(a,-2);if((c|0)==0){b=1779}}if((b|0)==1779){gy(a,1,7680)|0}dj(a,1)|0}dq(a,2)|0;return 1}function hl(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;gJ(a,1);if((cX(a,1)|0)==0){d=gD(a,2,2632,0)|0;e=gz(a,2664,(f=i,i=i+8|0,c[f>>2]=d,f)|0)|0;i=f;g=e;i=b;return g|0}else{g=cF(a)|0;i=b;return g|0}return 0}function hm(a){a=a|0;var b=0,d=0,e=0;b=gC(a,1,2896,1336)|0;d=gN(a,2,0)|0;e=c[1304+(b<<2)>>2]|0;b=dD(a,e,d)|0;if((e|0)==3){c4(a,+(b|0)+ +(dD(a,4,0)|0)*.0009765625);return 1}else if((e|0)==5){c6(a,b);return 1}else{c4(a,+(b|0));return 1}return 0}function hn(a){a=a|0;var b=0,c=0;b=gD(a,1,0,0)|0;c=cF(a)|0;if((g0(a,b)|0)!=0){dE(a)|0}dw(a,0,-1);return(cF(a)|0)-c|0}function ho(a){a=a|0;var b=0,c=0;b=gN(a,2,1)|0;cG(a,1);if(!((cQ(a,1)|0)!=0&(b|0)>0)){c=dE(a)|0;return c|0}gB(a,b);cJ(a,1);dG(a,2);c=dE(a)|0;return c|0}function hp(a){a=a|0;c5(a,dD(a,3,0)|0);return 1}function hq(a){a=a|0;hI(a,1);if((cM(a,-1)|0)==0){dk(a,-1);return 1}else{cJ(a,-10002);return 1}return 0}function hr(a){a=a|0;gJ(a,1);if((dj(a,1)|0)==0){c3(a);return 1}else{gO(a,1,3752)|0;return 1}return 0}function hs(a){a=a|0;var b=0;if((g0(a,gD(a,1,0,0)|0)|0)==0){b=1;return b|0}c3(a);cI(a,-2);b=2;return b|0}function ht(a){a=a|0;var b=0,c=0;b=gD(a,2,3024,0)|0;gI(a,1,6);cG(a,3);if((dB(a,252,0,b)|0)==0){c=1;return c|0}c3(a);cI(a,-2);c=2;return c|0}function hu(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;i=i+8|0;d=b|0;e=gE(a,1,d)|0;f=gD(a,2,e,0)|0;if((g2(a,e,c[d>>2]|0,f)|0)==0){g=1;i=b;return g|0}c3(a);cI(a,-2);g=2;i=b;return g|0}function hv(a){a=a|0;gJ(a,1);c6(a,(dx(a,(cF(a)|0)-1|0,-1,0)|0)==0|0);cI(a,1);return cF(a)|0}function hw(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;d=cF(a)|0;df(a,-10002,4536);L2389:do{if((d|0)>=1){e=1;while(1){cJ(a,-1);cJ(a,e);dw(a,1,1);f=c0(a,-1,0)|0;if((f|0)==0){break}if((e|0)>1){g=c[o>>2]|0;av(9,g|0)|0}az(f|0,c[o>>2]|0)|0;cG(a,-2);e=e+1|0;if((e|0)>(d|0)){break L2389}}e=gz(a,3232,(f=i,i=i+1|0,i=i+7>>3<<3,c[f>>2]=0,f)|0)|0;i=f;h=e;i=b;return h|0}}while(0);av(10,c[o>>2]|0)|0;h=0;i=b;return h|0}function hx(a){a=a|0;gJ(a,1);gJ(a,2);c6(a,cT(a,1,2)|0);return 1}function hy(a){a=a|0;gI(a,1,5);gJ(a,2);cG(a,2);dg(a,1);return 1}function hz(a){a=a|0;gI(a,1,5);gJ(a,2);gJ(a,3);cG(a,3);dn(a,1);return 1}function hA(b){b=b|0;var c=0,d=0,e=0,f=0;c=cF(b)|0;do{if((cK(b,1)|0)==4){if((a[c0(b,1,0)|0]|0)!=35){break}c5(b,c-1|0);d=1;return d|0}}while(0);e=gM(b,1)|0;if((e|0)<0){f=e+c|0}else{f=(e|0)>(c|0)?c:e}if((f|0)<=0){gy(b,1,3296)|0}d=c-f|0;return d|0}function hB(a){a=a|0;var b=0,d=0;b=i;gI(a,2,5);hI(a,0);cJ(a,2);do{if((cS(a,1)|0)!=0){if(+cW(a,1)!=0.0){break}c8(a)|0;cI(a,-2);dv(a,-2)|0;d=0;i=b;return d|0}}while(0);do{if((cM(a,-2)|0)==0){if((dv(a,-2)|0)==0){break}else{d=1}i=b;return d|0}}while(0);gz(a,3640,(a=i,i=i+1|0,i=i+7>>3<<3,c[a>>2]=0,a)|0)|0;i=a;d=1;i=b;return d|0}function hC(a){a=a|0;var b=0,d=0,e=0;b=i;d=cK(a,2)|0;gI(a,1,5);if(!((d|0)==5|(d|0)==0)){gy(a,2,3816)|0}if((gO(a,1,3752)|0)==0){cG(a,2);e=dq(a,1)|0;i=b;return 1}gz(a,3696,(d=i,i=i+1|0,i=i+7>>3<<3,c[d>>2]=0,d)|0)|0;i=d;cG(a,2);e=dq(a,1)|0;i=b;return 1}function hD(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;e=i;i=i+8|0;f=e|0;g=gN(b,2,10)|0;do{if((g|0)==10){gJ(b,1);if((cS(b,1)|0)==0){break}c4(b,+cW(b,1));i=e;return 1}else{h=gE(b,1,0)|0;if((g-2|0)>>>0>=35){gy(b,2,3856)|0}j=as(h|0,f|0,g|0)|0;k=c[f>>2]|0;if((h|0)==(k|0)){break}if((aB(d[k]|0)|0)==0){l=k}else{h=k;do{h=h+1|0;}while((aB(d[h]|0)|0)!=0);c[f>>2]=h;l=h}if((a[l]|0)!=0){break}c4(b,+(j>>>0>>>0));i=e;return 1}}while(0);c3(b);i=e;return 1}function hE(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;gJ(a,1);do{if((gP(a,1,4160)|0)==0){d=cK(a,1)|0;if((d|0)==1){da(a,(cX(a,1)|0)!=0?4096:4056);break}else if((d|0)==4){cJ(a,1);break}else if((d|0)==3){da(a,c0(a,1,0)|0);break}else if((d|0)==0){c9(a,4016,3);break}else{d=cL(a,cK(a,1)|0)|0;e=c2(a,1)|0;dc(a,3944,(f=i,i=i+16|0,c[f>>2]=d,c[f+8>>2]=e,f)|0)|0;i=f;break}}}while(0);i=b;return 1}function hF(a){a=a|0;gJ(a,1);da(a,cL(a,cK(a,1)|0)|0);return 1}function hG(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0;b=i;gI(a,1,5);d=gN(a,2,1)|0;if((cK(a,3)|0)<1){e=c1(a,1)|0}else{e=gM(a,3)|0}if((d|0)>(e|0)){f=0;i=b;return f|0}g=e-d|0;h=g+1|0;do{if((g|0)>=0){if((cN(a,h)|0)==0){break}dh(a,1,d);if((d|0)<(e|0)){j=d}else{f=h;i=b;return f|0}while(1){k=j+1|0;dh(a,1,k);if((k|0)<(e|0)){j=k}else{f=h;break}}i=b;return f|0}}while(0);h=gz(a,4192,(a=i,i=i+1|0,i=i+7>>3<<3,c[a>>2]=0,a)|0)|0;i=a;f=h;i=b;return f|0}function hH(a){a=a|0;gJ(a,2);cG(a,2);cI(a,1);c6(a,(dx(a,0,-1,1)|0)==0|0);cP(a,1);return cF(a)|0}function hI(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;i=i+104|0;e=d|0;if((cK(a,1)|0)==6){cJ(a,1);i=d;return}if((b|0)==0){f=gM(a,1)|0}else{f=gN(a,1,1)|0}if((f|0)<=-1){gy(a,1,3608)|0}if((ej(a,f,e)|0)==0){gy(a,1,3560)|0}en(a,3552,e)|0;if((cK(a,-1)|0)!=0){i=d;return}gz(a,3448,(a=i,i=i+8|0,c[a>>2]=f,a)|0)|0;i=a;i=d;return}function hJ(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;b=i;gH(a,2,2992);cJ(a,1);dw(a,0,1);if((cK(a,-1)|0)==0){c[d>>2]=0;e=0;i=b;return e|0}if((cQ(a,-1)|0)==0){gz(a,2952,(f=i,i=i+1|0,i=i+7>>3<<3,c[f>>2]=0,f)|0)|0;i=f;e=0;i=b;return e|0}else{cP(a,3);e=c0(a,3,d)|0;i=b;return e|0}return 0}function hK(a){a=a|0;gQ(a,5440,1688);return 1}function hL(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;i=i+256|0;aw(4080,11,1,c[n>>2]|0)|0;d=b|0;if((aS(d|0,250,c[m>>2]|0)|0)==0){i=b;return 0}while(1){if((aL(d|0,4040)|0)==0){e=1950;break}if((g2(a,d,j_(d|0)|0,3984)|0)==0){if((dx(a,0,0,0)|0)!=0){e=1948}}else{e=1948}if((e|0)==1948){e=0;f=c0(a,-1,0)|0;g=c[n>>2]|0;az(f|0,g|0)|0;g=c[n>>2]|0;av(10,g|0)|0}cG(a,0);aw(4080,11,1,c[n>>2]|0)|0;if((aS(d|0,250,c[m>>2]|0)|0)==0){e=1951;break}}if((e|0)==1951){i=b;return 0}else if((e|0)==1950){i=b;return 0}return 0}function hM(a){a=a|0;gJ(a,1);dk(a,1);return 1}function hN(b){b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;c=i;i=i+8|0;d=c|0;if((cK(b,1)|0)==8){e=c_(b,1)|0}else{e=b}f=eh(e)|0;g=eg(e)|0;if((g|0)!=0&(g|0)!=262){c9(b,4144,13)}else{h$(b);c7(b,e);dg(b,-2);cH(b,-2)}g=d|0;if((f&1|0)==0){h=0}else{a[g]=99;h=1}if((f&2|0)==0){j=h}else{a[d+h|0]=114;j=h+1|0}if((f&4|0)==0){k=j;l=d+k|0;a[l]=0;da(b,g);m=ei(e)|0;c5(b,m);i=c;return 3}a[d+j|0]=108;k=j+1|0;l=d+k|0;a[l]=0;da(b,g);m=ei(e)|0;c5(b,m);i=c;return 3}function hO(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;b=i;i=i+104|0;d=b|0;if((cK(a,1)|0)==8){e=c_(a,1)|0;f=1}else{e=a;f=0}g=f|2;h=gD(a,g,5744,0)|0;j=f+1|0;do{if((cS(a,j)|0)==0){if((cK(a,j)|0)==6){dc(a,5648,(f=i,i=i+8|0,c[f>>2]=h,f)|0)|0;i=f;f=c0(a,-1,0)|0;cJ(a,j);cC(a,e,1);k=f;break}l=gy(a,j,5560)|0;i=b;return l|0}else{if((ej(e,c$(a,j)|0,d)|0)!=0){k=h;break}c3(a);l=1;i=b;return l|0}}while(0);if((en(e,k,d)|0)==0){l=gy(a,g,5424)|0;i=b;return l|0}di(a,0,2);if((aU(k|0,83)|0)!=0){da(a,c[d+16>>2]|0);dm(a,-2,5320);da(a,d+36|0);dm(a,-2,5208);c5(a,c[d+28>>2]|0);dm(a,-2,5072);c5(a,c[d+32>>2]|0);dm(a,-2,4920);da(a,c[d+12>>2]|0);dm(a,-2,4816)}if((aU(k|0,108)|0)!=0){c5(a,c[d+20>>2]|0);dm(a,-2,4616)}if((aU(k|0,117)|0)!=0){c5(a,c[d+24>>2]|0);dm(a,-2,4528)}if((aU(k|0,110)|0)!=0){da(a,c[d+4>>2]|0);dm(a,-2,4448);da(a,c[d+8>>2]|0);dm(a,-2,4320)}if((aU(k|0,76)|0)!=0){if((e|0)==(a|0)){cJ(a,-2);cH(a,-3)}else{cC(e,a,1)}dm(a,-2,4232)}if((aU(k|0,102)|0)==0){l=1;i=b;return l|0}if((e|0)==(a|0)){cJ(a,-2);cH(a,-3)}else{cC(e,a,1)}dm(a,-2,4184);l=1;i=b;return l|0}function hP(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;b=i;i=i+104|0;c=b|0;if((cK(a,1)|0)==8){d=c_(a,1)|0;e=1}else{d=a;e=0}f=e+1|0;if((ej(d,gM(a,f)|0,c)|0)==0){g=gy(a,f,6880)|0;i=b;return g|0}f=el(d,c,gM(a,e|2)|0)|0;if((f|0)==0){c3(a);g=1;i=b;return g|0}else{cC(d,a,1);da(a,f);cJ(a,-2);g=2;i=b;return g|0}return 0}function hQ(a){a=a|0;cJ(a,-1e4);return 1}function hR(a){a=a|0;gJ(a,1);if((dj(a,1)|0)!=0){return 1}c3(a);return 1}function hS(a){a=a|0;return hZ(a,1)|0}function hT(a){a=a|0;var b=0;b=i;gI(a,2,5);cG(a,2);if((dv(a,1)|0)!=0){i=b;return 1}gz(a,5848,(a=i,i=i+1|0,i=i+7>>3<<3,c[a>>2]=0,a)|0)|0;i=a;i=b;return 1}function hU(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;if((cK(a,1)|0)==8){b=c_(a,1)|0;c=1}else{b=a;c=0}d=c+1|0;if((cK(a,d)|0)<1){cG(a,d);e=0;f=0;g=0}else{h=gE(a,c|2,0)|0;gI(a,d,6);i=gN(a,c+3|0,0)|0;c=(aU(h|0,99)|0)!=0|0;j=(aU(h|0,114)|0)==0?c:c|2;c=(aU(h|0,108)|0)==0?j:j|4;e=(i|0)>0?c|8:c;f=i;g=262}h$(a);c7(a,b);cJ(a,d);dn(a,-3);cG(a,-2);ef(b,g,e,f)|0;return 0}function hV(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;b=i;i=i+104|0;c=b|0;if((cK(a,1)|0)==8){d=c_(a,1)|0;e=1}else{d=a;e=0}f=e+1|0;if((ej(d,gM(a,f)|0,c)|0)==0){g=gy(a,f,6880)|0;i=b;return g|0}else{f=e+3|0;gJ(a,f);cG(a,f);cC(a,d,1);da(a,em(d,c,gM(a,e|2)|0)|0);g=1;i=b;return g|0}return 0}function hW(a){a=a|0;var b=0;b=cK(a,2)|0;if(!((b|0)==5|(b|0)==0)){gy(a,2,7072)|0}cG(a,2);c6(a,dq(a,1)|0);return 1}function hX(a){a=a|0;gJ(a,3);return hZ(a,0)|0}function hY(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;d=i;i=i+104|0;e=d|0;if((cK(b,1)|0)==8){f=c_(b,1)|0;g=1}else{f=b;g=0}h=g|2;if((cS(b,h)|0)==0){j=(f|0)==(b|0)|0}else{k=c$(b,h)|0;cG(b,-2);j=k}do{if((cF(b)|0)==(g|0)){c9(b,10568,0)}else{if((cQ(b,g+1|0)|0)==0){i=d;return 1}else{c9(b,9240,1);break}}}while(0);c9(b,9096,16);k=e+36|0;h=e+20|0;l=e+8|0;m=e+12|0;n=e+28|0;o=e+4|0;p=1;q=j;L2655:while(1){j=q+1|0;r=q+11|0;L2657:do{if((j|0)<13){if((ej(f,q,e)|0)==0){break L2655}else{s=p}}else{t=p;while(1){if((ej(f,q,e)|0)==0){break L2655}if((t|0)==0){s=0;break L2657}if((ej(f,r,e)|0)==0){t=0}else{break}}c9(b,8960,5);t=j;while(1){if((ej(f,t+10|0,e)|0)==0){p=0;q=t;continue L2655}else{t=t+1|0}}}}while(0);c9(b,8808,2);en(f,8608,e)|0;dc(b,8424,(r=i,i=i+8|0,c[r>>2]=k,r)|0)|0;i=r;t=c[h>>2]|0;if((t|0)>0){dc(b,8208,(r=i,i=i+8|0,c[r>>2]=t,r)|0)|0;i=r}do{if((a[c[l>>2]|0]|0)==0){t=a[c[m>>2]|0]|0;if((t<<24>>24|0)==109){dc(b,7664,(r=i,i=i+1|0,i=i+7>>3<<3,c[r>>2]=0,r)|0)|0;i=r;break}else if((t<<24>>24|0)==67|(t<<24>>24|0)==116){c9(b,7504,2);break}else{t=c[n>>2]|0;dc(b,7240,(r=i,i=i+16|0,c[r>>2]=k,c[r+8>>2]=t,r)|0)|0;i=r;break}}else{t=c[o>>2]|0;dc(b,7920,(r=i,i=i+8|0,c[r>>2]=t,r)|0)|0;i=r}}while(0);dG(b,(cF(b)|0)-g|0);p=s;q=j}dG(b,(cF(b)|0)-g|0);i=d;return 1}function hZ(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;c=gM(a,2)|0;gI(a,1,6);if((cM(a,1)|0)!=0){d=0;return d|0}if((b|0)==0){e=dJ(a,1,c)|0}else{e=du(a,1,c)|0}if((e|0)==0){d=0;return d|0}da(a,e);cI(a,~b);d=b+1|0;return d|0}function h_(a,b){a=a|0;b=b|0;var d=0;c7(a,10472);dg(a,-1e4);c7(a,a);dg(a,-2);if((cK(a,-1)|0)!=6){return}da(a,c[1488+(c[b>>2]<<2)>>2]|0);d=c[b+20>>2]|0;if((d|0)>-1){c5(a,d)}else{c3(a)}dw(a,2,0);return}function h$(a){a=a|0;c7(a,10472);dg(a,-1e4);if((cK(a,-1)|0)==5){return}cG(a,-2);di(a,0,1);c7(a,10472);cJ(a,-2);dn(a,-1e4);return}function h0(a){a=a|0;var b=0,d=0;gF(a,3848)|0;cJ(a,-1);dm(a,-2,5840);gQ(a,0,1512);di(a,0,1);dd(a,550,0);dm(a,-2,6128);cP(a,-10001);gQ(a,4712,1392);di(a,0,1);dd(a,402,0);dm(a,-2,6128);b=c[m>>2]|0;d=dH(a,4)|0;c[d>>2]=0;df(a,-1e4,3848);dq(a,-2)|0;c[d>>2]=b;cJ(a,-1);dp(a,-10001,1);cJ(a,-2);dv(a,-2)|0;dm(a,-3,9496);b=c[o>>2]|0;d=dH(a,4)|0;c[d>>2]=0;df(a,-1e4,3848);dq(a,-2)|0;c[d>>2]=b;cJ(a,-1);dp(a,-10001,2);cJ(a,-2);dv(a,-2)|0;dm(a,-3,7528);b=c[n>>2]|0;d=dH(a,4)|0;c[d>>2]=0;df(a,-1e4,3848);dq(a,-2)|0;c[d>>2]=b;cJ(a,-2);dv(a,-2)|0;dm(a,-3,5760);cG(a,-2);df(a,-1,4552);di(a,0,1);dd(a,538,0);dm(a,-2,6128);dv(a,-2)|0;cG(a,-2);return 1}function h1(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;d=gG(a,1,3848)|0;e=(ar(c[d>>2]|0)|0)==0;c[d>>2]=0;d=c[(bE()|0)>>2]|0;if(e){c6(a,1);f=1;i=b;return f|0}else{c3(a);e=bF(d|0)|0;dc(a,2752,(g=i,i=i+8|0,c[g>>2]=e,g)|0)|0;i=g;c5(a,d);f=3;i=b;return f|0}return 0}function h2(a){a=a|0;c3(a);c9(a,2392,26);return 2}function h3(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;c[(gG(a,1,3848)|0)>>2]=0;d=c[(bE()|0)>>2]|0;c3(a);e=bF(d|0)|0;dc(a,2752,(f=i,i=i+8|0,c[f>>2]=e,f)|0)|0;i=f;c5(a,d);i=b;return 3}function h4(a){a=a|0;var b=0,d=0;b=i;if((cK(a,1)|0)==-1){dh(a,-10001,2)}if((c[(gG(a,1,3848)|0)>>2]|0)==0){gz(a,6504,(d=i,i=i+1|0,i=i+7>>3<<3,c[d>>2]=0,d)|0)|0;i=d}dk(a,1);df(a,-1,6128);d=cd[(cY(a,-1)|0)&1023](a)|0;i=b;return d|0}function h5(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;dh(a,-10001,2);d=c[(cZ(a,-1)|0)>>2]|0;if((d|0)==0){gz(a,8576,(e=i,i=i+8|0,c[e>>2]=9432,e)|0)|0;i=e}f=(au(d|0)|0)==0;d=c[(bE()|0)>>2]|0;if(f){c6(a,1);g=1;i=b;return g|0}else{c3(a);f=bF(d|0)|0;dc(a,2752,(e=i,i=i+8|0,c[e>>2]=f,e)|0)|0;i=e;c5(a,d);g=3;i=b;return g|0}return 0}function h6(a){a=a|0;ik(a,1,6872);return 1}function h7(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;if((cK(a,1)|0)<1){dh(a,-10001,1);if((c[(gG(a,1,3848)|0)>>2]|0)==0){gz(a,6504,(d=i,i=i+1|0,i=i+7>>3<<3,c[d>>2]=0,d)|0)|0;i=d}cJ(a,1);c6(a,0);dd(a,396,2);i=b;return 1}else{e=gE(a,1,0)|0;f=dH(a,4)|0;c[f>>2]=0;df(a,-1e4,3848);dq(a,-2)|0;g=bl(e|0,6872)|0;c[f>>2]=g;if((g|0)==0){g=bF(c[(bE()|0)>>2]|0)|0;dc(a,3224,(d=i,i=i+16|0,c[d>>2]=e,c[d+8>>2]=g,d)|0)|0;i=d;d=c0(a,-1,0)|0;gy(a,1,d)|0}cJ(a,cF(a)|0);c6(a,1);dd(a,396,2);i=b;return 1}return 0}function h8(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;d=gE(a,1,0)|0;e=gD(a,2,6872,0)|0;f=dH(a,4)|0;c[f>>2]=0;df(a,-1e4,3848);dq(a,-2)|0;g=bl(d|0,e|0)|0;c[f>>2]=g;if((g|0)!=0){h=1;i=b;return h|0}g=c[(bE()|0)>>2]|0;c3(a);f=bF(g|0)|0;if((d|0)==0){dc(a,2752,(j=i,i=i+8|0,c[j>>2]=f,j)|0)|0;i=j}else{dc(a,3224,(j=i,i=i+16|0,c[j>>2]=d,c[j+8>>2]=f,j)|0)|0;i=j}c5(a,g);h=3;i=b;return h|0}function h9(a){a=a|0;ik(a,2,6664);return 1}function ia(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;d=gE(a,1,0)|0;gD(a,2,6872,0)|0;e=dH(a,4)|0;c[e>>2]=0;df(a,-1e4,3848);dq(a,-2)|0;gz(a,6768,(f=i,i=i+1|0,i=i+7>>3<<3,c[f>>2]=0,f)|0)|0;i=f;c[e>>2]=0;e=c[(bE()|0)>>2]|0;c3(a);g=bF(e|0)|0;if((d|0)==0){dc(a,2752,(f=i,i=i+8|0,c[f>>2]=g,f)|0)|0;i=f;c5(a,e);i=b;return 3}else{dc(a,3224,(f=i,i=i+16|0,c[f>>2]=d,c[f+8>>2]=g,f)|0)|0;i=f;c5(a,e);i=b;return 3}return 0}function ib(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;dh(a,-10001,1);d=c[(cZ(a,-1)|0)>>2]|0;if((d|0)!=0){e=ih(a,d,1)|0;i=b;return e|0}gz(a,8576,(f=i,i=i+8|0,c[f>>2]=10144,f)|0)|0;i=f;e=ih(a,d,1)|0;i=b;return e|0}function ic(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;d=dH(a,4)|0;c[d>>2]=0;df(a,-1e4,3848);dq(a,-2)|0;e=aO()|0;c[d>>2]=e;if((e|0)!=0){f=1;i=b;return f|0}e=c[(bE()|0)>>2]|0;c3(a);d=bF(e|0)|0;dc(a,2752,(g=i,i=i+8|0,c[g>>2]=d,g)|0)|0;i=g;c5(a,e);f=3;i=b;return f|0}function id(a){a=a|0;var b=0;gJ(a,1);b=cZ(a,1)|0;df(a,-1e4,3848);do{if((b|0)!=0){if((dj(a,1)|0)==0){break}if((cT(a,-2,-1)|0)==0){break}if((c[b>>2]|0)==0){c9(a,8192,11);return 1}else{c9(a,7912,4);return 1}}}while(0);c3(a);return 1}function ie(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;dh(a,-10001,2);d=c[(cZ(a,-1)|0)>>2]|0;if((d|0)!=0){e=ig(a,d,1)|0;i=b;return e|0}gz(a,8576,(f=i,i=i+8|0,c[f>>2]=9432,f)|0)|0;i=f;e=ig(a,d,1)|0;i=b;return e|0}function ig(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0.0,o=0,p=0,q=0,r=0;e=i;i=i+8|0;f=e|0;g=(cF(a)|0)-1|0;do{if((g|0)==0){bE()|0}else{j=1;k=d;l=g;while(1){do{if((cK(a,k)|0)==3){if((j|0)==0){m=0;break}n=+cW(a,k);o=bN(b|0,8416,(p=i,i=i+8|0,h[p>>3]=n,p)|0)|0;i=p;m=(o|0)>0|0}else{o=gE(a,k,f)|0;if((j|0)==0){m=0;break}q=aw(o|0,1,c[f>>2]|0,b|0)|0;m=(q|0)==(c[f>>2]|0)|0}}while(0);q=l-1|0;if((q|0)==0){break}else{j=m;k=k+1|0;l=q}}l=c[(bE()|0)>>2]|0;if((m|0)!=0){break}c3(a);k=bF(l|0)|0;dc(a,2752,(p=i,i=i+8|0,c[p>>2]=k,p)|0)|0;i=p;c5(a,l);r=3;i=e;return r|0}}while(0);c6(a,1);r=1;i=e;return r|0}function ih(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;f=i;i=i+8|0;g=f|0;j=cF(b)|0;bV(d|0);L2804:do{if((j|0)==1){k=e+1|0;l=ii(b,d)|0}else{gH(b,j+19|0,7640);m=e;n=j-2|0;L2806:while(1){do{if((cK(b,m)|0)==3){o=c$(b,m)|0;if((o|0)==0){p=aQ(d|0)|0;bI(p|0,d|0)|0;c9(b,0,0);q=(p|0)!=-1|0;break}else{q=ij(b,d,o)|0;break}}else{o=c0(b,m,0)|0;if((o|0)==0){r=2193}else{if((a[o]|0)!=42){r=2193}}if((r|0)==2193){r=0;gy(b,m,7488)|0}p=a[o+1|0]|0;if((p|0)==108){q=ii(b,d)|0;break}else if((p|0)==97){ij(b,d,-1)|0;q=1;break}else if((p|0)==110){p=aH(d|0,7056,(s=i,i=i+8|0,c[s>>2]=g,s)|0)|0;i=s;if((p|0)!=1){r=2197;break L2806}c4(b,+h[g>>3]);q=1;break}else{break L2806}}}while(0);p=m+1|0;if((n|0)==0|(q|0)==0){k=p;l=q;break L2804}else{m=p;n=n-1|0}}if((r|0)==2197){c3(b);k=m+1|0;l=0;break}t=gy(b,m,7216)|0;i=f;return t|0}}while(0);if((a4(d|0)|0)!=0){d=c[(bE()|0)>>2]|0;c3(b);r=bF(d|0)|0;dc(b,2752,(s=i,i=i+8|0,c[s>>2]=r,s)|0)|0;i=s;c5(b,d);t=3;i=f;return t|0}if((l|0)==0){cG(b,-2);c3(b)}t=k-e|0;i=f;return t|0}function ii(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;i=i+1040|0;f=e|0;gt(b,f);g=gY(f)|0;L2840:do{if((aS(g|0,1024,d|0)|0)!=0){h=f|0;j=g;while(1){k=j_(j|0)|0;if((k|0)!=0){l=k-1|0;if((a[j+l|0]|0)==10){break}}c[h>>2]=(c[h>>2]|0)+k;j=gY(f)|0;if((aS(j|0,1024,d|0)|0)==0){break L2840}}c[h>>2]=(c[h>>2]|0)+l;gX(f);m=1;i=e;return m|0}}while(0);gX(f);m=(c1(b,-1)|0)!=0|0;i=e;return m|0}function ij(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;i=i+1040|0;f=e|0;gt(a,f);g=f|0;h=d;d=1024;while(1){j=d>>>0>h>>>0?h:d;k=bw(gY(f)|0,1,j|0,b|0)|0;c[g>>2]=(c[g>>2]|0)+k;if((h|0)==(k|0)){l=2223;break}if((k|0)==(j|0)){h=h-k|0;d=j}else{l=2225;break}}if((l|0)==2225){gX(f);m=(c1(a,-1)|0)!=0|0;i=e;return m|0}else if((l|0)==2223){gX(f);m=1;i=e;return m|0}return 0}function ik(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;if((cK(a,1)|0)<1){dh(a,-10001,b);i=e;return}f=c0(a,1,0)|0;do{if((f|0)==0){if((c[(gG(a,1,3848)|0)>>2]|0)==0){gz(a,6504,(g=i,i=i+1|0,i=i+7>>3<<3,c[g>>2]=0,g)|0)|0;i=g}cJ(a,1)}else{h=dH(a,4)|0;c[h>>2]=0;df(a,-1e4,3848);dq(a,-2)|0;j=bl(f|0,d|0)|0;c[h>>2]=j;if((j|0)!=0){break}j=bF(c[(bE()|0)>>2]|0)|0;dc(a,3224,(g=i,i=i+16|0,c[g>>2]=f,c[g+8>>2]=j,g)|0)|0;i=g;j=c0(a,-1,0)|0;gy(a,1,j)|0}}while(0);dp(a,-10001,b);dh(a,-10001,b);i=e;return}function il(a){a=a|0;var b=0,d=0;b=i;if((c[(gG(a,1,3848)|0)>>2]|0)==0){gz(a,6504,(d=i,i=i+1|0,i=i+7>>3<<3,c[d>>2]=0,d)|0)|0;i=d}cJ(a,1);c6(a,0);dd(a,396,2);i=b;return 1}function im(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;d=c[(cZ(a,-10003)|0)>>2]|0;if((d|0)==0){gz(a,6344,(e=i,i=i+1|0,i=i+7>>3<<3,c[e>>2]=0,e)|0)|0;i=e}f=ii(a,d)|0;if((a4(d|0)|0)!=0){d=bF(c[(bE()|0)>>2]|0)|0;g=gz(a,2752,(e=i,i=i+8|0,c[e>>2]=d,e)|0)|0;i=e;h=g;i=b;return h|0}if((f|0)!=0){h=1;i=b;return h|0}if((cX(a,-10004)|0)==0){h=0;i=b;return h|0}cG(a,0);cJ(a,-10003);dk(a,1);df(a,-1,6128);cd[(cY(a,-1)|0)&1023](a)|0;h=0;i=b;return h|0}function io(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;d=gG(a,1,3848)|0;e=c[d>>2]|0;if((e|0)==0){gz(a,6504,(f=i,i=i+1|0,i=i+7>>3<<3,c[f>>2]=0,f)|0)|0;i=f;g=c[d>>2]|0}else{g=e}e=(au(g|0)|0)==0;g=c[(bE()|0)>>2]|0;if(e){c6(a,1);h=1;i=b;return h|0}else{c3(a);e=bF(g|0)|0;dc(a,2752,(f=i,i=i+8|0,c[f>>2]=e,f)|0)|0;i=f;c5(a,g);h=3;i=b;return h|0}return 0}function ip(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;d=gG(a,1,3848)|0;e=c[d>>2]|0;if((e|0)!=0){f=e;g=ih(a,f,2)|0;i=b;return g|0}gz(a,6504,(e=i,i=i+1|0,i=i+7>>3<<3,c[e>>2]=0,e)|0)|0;i=e;f=c[d>>2]|0;g=ih(a,f,2)|0;i=b;return g|0}function iq(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;d=gG(a,1,3848)|0;e=c[d>>2]|0;if((e|0)==0){gz(a,6504,(f=i,i=i+1|0,i=i+7>>3<<3,c[f>>2]=0,f)|0)|0;i=f;g=c[d>>2]|0}else{g=e}e=gC(a,2,4520,1624)|0;d=gN(a,3,0)|0;if((bY(g|0,d|0,c[1640+(e<<2)>>2]|0)|0)==0){c5(a,aZ(g|0)|0);h=1;i=b;return h|0}else{g=c[(bE()|0)>>2]|0;c3(a);e=bF(g|0)|0;dc(a,2752,(f=i,i=i+8|0,c[f>>2]=e,f)|0)|0;i=f;c5(a,g);h=3;i=b;return h|0}return 0}function ir(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;d=gG(a,1,3848)|0;e=c[d>>2]|0;if((e|0)==0){gz(a,6504,(f=i,i=i+1|0,i=i+7>>3<<3,c[f>>2]=0,f)|0)|0;i=f;g=c[d>>2]|0}else{g=e}e=gC(a,2,0,1592)|0;d=gN(a,3,1024)|0;h=(cc(g|0,0,c[1608+(e<<2)>>2]|0,d|0)|0)==0;d=c[(bE()|0)>>2]|0;if(h){c6(a,1);j=1;i=b;return j|0}else{c3(a);h=bF(d|0)|0;dc(a,2752,(f=i,i=i+8|0,c[f>>2]=h,f)|0)|0;i=f;c5(a,d);j=3;i=b;return j|0}return 0}function is(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;d=gG(a,1,3848)|0;e=c[d>>2]|0;if((e|0)!=0){f=e;g=ig(a,f,2)|0;i=b;return g|0}gz(a,6504,(e=i,i=i+1|0,i=i+7>>3<<3,c[e>>2]=0,e)|0)|0;i=e;f=c[d>>2]|0;g=ig(a,f,2)|0;i=b;return g|0}function it(a){a=a|0;if((c[(gG(a,1,3848)|0)>>2]|0)==0){return 0}dk(a,1);df(a,-1,6128);cd[(cY(a,-1)|0)&1023](a)|0;return 0}function iu(a){a=a|0;var b=0,d=0;b=i;d=c[(gG(a,1,3848)|0)>>2]|0;if((d|0)==0){c9(a,5304,13);i=b;return 1}else{dc(a,5192,(a=i,i=i+8|0,c[a>>2]=d,a)|0)|0;i=a;i=b;return 1}return 0}function iv(a){a=a|0;gQ(a,4248,512);c4(a,3.141592653589793);dm(a,-2,9336);c4(a,+q);dm(a,-2,7384);df(a,-1,5712);dm(a,-2,4512);return 1}function iw(a){a=a|0;c4(a,+P(+(+gK(a,1))));return 1}function ix(a){a=a|0;c4(a,+V(+(+gK(a,1))));return 1}function iy(a){a=a|0;c4(a,+W(+(+gK(a,1))));return 1}function iz(a){a=a|0;var b=0.0;b=+gK(a,1);c4(a,+Y(+b,+(+gK(a,2))));return 1}function iA(a){a=a|0;c4(a,+X(+(+gK(a,1))));return 1}function iB(a){a=a|0;c4(a,+$(+(+gK(a,1))));return 1}function iC(a){a=a|0;c4(a,+aR(+(+gK(a,1))));return 1}function iD(a){a=a|0;c4(a,+S(+(+gK(a,1))));return 1}function iE(a){a=a|0;c4(a,+gK(a,1)/.017453292519943295);return 1}function iF(a){a=a|0;c4(a,+Z(+(+gK(a,1))));return 1}function iG(a){a=a|0;c4(a,+O(+(+gK(a,1))));return 1}function iH(a){a=a|0;var b=0.0;b=+gK(a,1);c4(a,+aI(+b,+(+gK(a,2))));return 1}function iI(a){a=a|0;var b=0,d=0;b=i;i=i+8|0;d=b|0;c4(a,+bn(+(+gK(a,1)),d|0));c5(a,c[d>>2]|0);i=b;return 2}function iJ(a){a=a|0;var b=0.0;b=+gK(a,1);c4(a,+bi(+b,gM(a,2)|0));return 1}function iK(a){a=a|0;c4(a,+bv(+(+gK(a,1))));return 1}function iL(a){a=a|0;c4(a,+_(+(+gK(a,1))));return 1}function iM(a){a=a|0;var b=0,c=0.0,d=0.0,e=0,f=0.0,g=0.0,h=0;b=cF(a)|0;c=+gK(a,1);if((b|0)<2){d=c}else{e=2;f=c;while(1){c=+gK(a,e);g=c>f?c:f;h=e+1|0;if((h|0)>(b|0)){d=g;break}else{e=h;f=g}}}c4(a,d);return 1}function iN(a){a=a|0;var b=0,c=0.0,d=0.0,e=0,f=0.0,g=0.0,h=0;b=cF(a)|0;c=+gK(a,1);if((b|0)<2){d=c}else{e=2;f=c;while(1){c=+gK(a,e);g=c<f?c:f;h=e+1|0;if((h|0)>(b|0)){d=g;break}else{e=h;f=g}}}c4(a,d);return 1}function iO(a){a=a|0;var b=0,c=0,d=0.0;b=i;i=i+8|0;c=b|0;d=+aK(+(+gK(a,1)),c|0);c4(a,+h[c>>3]);c4(a,d);i=b;return 2}function iP(a){a=a|0;var b=0.0;b=+gK(a,1);c4(a,+R(+b,+(+gK(a,2))));return 1}function iQ(a){a=a|0;c4(a,+gK(a,1)*.017453292519943295);return 1}function iR(a){a=a|0;var b=0,d=0.0,e=0,f=0,g=0,h=0;b=i;d=+((bf()|0)%2147483647|0|0)/2147483647.0;e=cF(a)|0;if((e|0)==1){f=gM(a,1)|0;if((f|0)<=0){gy(a,1,6104)|0}c4(a,+O(+(d*+(f|0)))+1.0);g=1;i=b;return g|0}else if((e|0)==2){f=gM(a,1)|0;h=gM(a,2)|0;if((f|0)>(h|0)){gy(a,2,6104)|0}c4(a,+(f|0)+ +O(+(d*+(1-f+h|0))));g=1;i=b;return g|0}else if((e|0)==0){c4(a,d);g=1;i=b;return g|0}else{e=gz(a,5808,(a=i,i=i+1|0,i=i+7>>3<<3,c[a>>2]=0,a)|0)|0;i=a;g=e;i=b;return g|0}return 0}function iS(a){a=a|0;bL(gM(a,1)|0);return 0}function iT(a){a=a|0;c4(a,+a7(+(+gK(a,1))));return 1}function iU(a){a=a|0;c4(a,+T(+(+gK(a,1))));return 1}function iV(a){a=a|0;c4(a,+Q(+(+gK(a,1))));return 1}function iW(a){a=a|0;c4(a,+bC(+(+gK(a,1))));return 1}function iX(a){a=a|0;c4(a,+U(+(+gK(a,1))));return 1}function iY(a){a=a|0;gQ(a,4064,88);return 1}function iZ(a){a=a|0;c4(a,+((aW()|0)>>>0>>>0)/1.0e3);return 1}function i_(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;d=i;i=i+1256|0;e=d|0;f=d+8|0;g=d+16|0;h=d+1056|0;j=gD(b,1,6856,0)|0;if((cK(b,2)|0)<1){k=cb(0)|0}else{k=~~+gK(b,2)}c[e>>2]=k;if((a[j]|0)==33){l=j+1|0;m=a5(e|0)|0}else{l=j;m=aC(e|0)|0}if((m|0)==0){c3(b);i=d;return 1}if((aL(l|0,6752)|0)==0){di(b,0,9);c5(b,c[m>>2]|0);dm(b,-2,9616);c5(b,c[m+4>>2]|0);dm(b,-2,9416);c5(b,c[m+8>>2]|0);dm(b,-2,9192);c5(b,c[m+12>>2]|0);dm(b,-2,9056);c5(b,(c[m+16>>2]|0)+1|0);dm(b,-2,8936);c5(b,(c[m+20>>2]|0)+1900|0);dm(b,-2,8760);c5(b,(c[m+24>>2]|0)+1|0);dm(b,-2,6648);c5(b,(c[m+28>>2]|0)+1|0);dm(b,-2,6488);e=c[m+32>>2]|0;if((e|0)<0){i=d;return 1}c6(b,e);dm(b,-2,8560);i=d;return 1}e=f|0;a[e]=37;a[f+2|0]=0;gt(b,g);b=g|0;j=g+1036|0;k=f+1|0;f=h|0;h=l;L3014:while(1){l=a[h]|0;do{if((l<<24>>24|0)==0){break L3014}else if((l<<24>>24|0)==37){n=h+1|0;o=a[n]|0;if(o<<24>>24==0){p=2362;break}a[k]=o;gV(g,f,be(f|0,200,e|0,m|0)|0);q=n}else{p=2362}}while(0);if((p|0)==2362){p=0;n=c[b>>2]|0;if(n>>>0<j>>>0){r=l;s=n}else{gY(g)|0;r=a[h]|0;s=c[b>>2]|0}c[b>>2]=s+1;a[s]=r;q=h}h=q+1|0}gX(g);i=d;return 1}function i$(a){a=a|0;var b=0;b=~~+gK(a,1);c4(a,+b7(b|0,~~+gL(a,2,0.0)|0));return 1}function i0(a){a=a|0;c5(a,bs(gD(a,1,0,0)|0)|0);return 1}function i1(a){a=a|0;da(a,bz(gE(a,1,0)|0)|0);return 1}function i2(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;d=gE(a,1,0)|0;e=(aJ(d|0)|0)==0;f=c[(bE()|0)>>2]|0;if(e){c6(a,1);g=1;i=b;return g|0}else{c3(a);e=bF(f|0)|0;dc(a,7024,(h=i,i=i+16|0,c[h>>2]=d,c[h+8>>2]=e,h)|0)|0;i=h;c5(a,f);g=3;i=b;return g|0}return 0}function i3(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;d=gE(a,1,0)|0;e=(bJ(d|0,gE(a,2,0)|0)|0)==0;f=c[(bE()|0)>>2]|0;if(e){c6(a,1);g=1;i=b;return g|0}else{c3(a);e=bF(f|0)|0;dc(a,7024,(h=i,i=i+16|0,c[h>>2]=d,c[h+8>>2]=e,h)|0)|0;i=h;c5(a,f);g=3;i=b;return g|0}return 0}function i4(a){a=a|0;var b=0;b=gD(a,1,0,0)|0;da(a,bh(c[488+((gC(a,2,8176,456)|0)<<2)>>2]|0,b|0)|0);return 1}function i5(a){a=a|0;a_(gN(a,1,0)|0);return 0}function i6(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;b=i;i=i+48|0;d=b|0;if((cK(a,1)|0)<1){e=cb(0)|0}else{gI(a,1,5);cG(a,1);df(a,-1,9616);if((cS(a,-1)|0)==0){f=0}else{f=c$(a,-1)|0}cG(a,-2);c[d>>2]=f;df(a,-1,9416);if((cS(a,-1)|0)==0){g=0}else{g=c$(a,-1)|0}cG(a,-2);c[d+4>>2]=g;df(a,-1,9192);if((cS(a,-1)|0)==0){h=12}else{h=c$(a,-1)|0}cG(a,-2);c[d+8>>2]=h;df(a,-1,9056);if((cS(a,-1)|0)==0){h=gz(a,8368,(j=i,i=i+8|0,c[j>>2]=9056,j)|0)|0;i=j;k=h}else{h=c$(a,-1)|0;cG(a,-2);k=h}c[d+12>>2]=k;df(a,-1,8936);if((cS(a,-1)|0)==0){k=gz(a,8368,(j=i,i=i+8|0,c[j>>2]=8936,j)|0)|0;i=j;l=k}else{k=c$(a,-1)|0;cG(a,-2);l=k}c[d+16>>2]=l-1;df(a,-1,8760);if((cS(a,-1)|0)==0){l=gz(a,8368,(j=i,i=i+8|0,c[j>>2]=8760,j)|0)|0;i=j;m=l}else{l=c$(a,-1)|0;cG(a,-2);m=l}c[d+20>>2]=m-1900;df(a,-1,8560);if((cK(a,-1)|0)==0){n=-1}else{n=cX(a,-1)|0}cG(a,-2);c[d+32>>2]=n;e=br(d|0)|0}if((e|0)==-1){c3(a);i=b;return 1}else{c4(a,+(e|0));i=b;return 1}return 0}function i7(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;i=i+1024|0;d=b|0;if((aA(d|0)|0)==0){e=gz(a,9816,(f=i,i=i+1|0,i=i+7>>3<<3,c[f>>2]=0,f)|0)|0;i=f;g=e;i=b;return g|0}else{da(a,d);g=1;i=b;return g|0}return 0}function i8(a){a=a|0;gQ(a,3880,8);return 1}function i9(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;b=i;i=i+1048|0;d=b|0;e=b+1040|0;f=gD(a,2,10584,e)|0;gI(a,1,5);g=gN(a,3,1)|0;if((cK(a,4)|0)<1){h=c1(a,1)|0}else{h=gM(a,4)|0}gt(a,d);do{if((g|0)<(h|0)){j=g;do{dh(a,1,j);if((cQ(a,-1)|0)==0){k=cL(a,cK(a,-1)|0)|0;gz(a,9360,(l=i,i=i+16|0,c[l>>2]=k,c[l+8>>2]=j,l)|0)|0;i=l}gZ(d);gV(d,f,c[e>>2]|0);j=j+1|0;}while((j|0)<(h|0))}else{if((g|0)==(h|0)){break}gX(d);i=b;return 1}}while(0);dh(a,1,h);if((cQ(a,-1)|0)==0){g=cL(a,cK(a,-1)|0)|0;gz(a,9360,(l=i,i=i+16|0,c[l>>2]=g,c[l+8>>2]=h,l)|0)|0;i=l}gZ(d);gX(d);i=b;return 1}function ja(a){a=a|0;var b=0,c=0;gI(a,1,5);gI(a,2,6);c3(a);if((dF(a,1)|0)==0){b=0;return b|0}while(1){cJ(a,2);cJ(a,-3);cJ(a,-3);dw(a,2,1);if((cK(a,-1)|0)!=0){b=1;c=2443;break}cG(a,-3);if((dF(a,1)|0)==0){b=0;c=2442;break}}if((c|0)==2442){return b|0}else if((c|0)==2443){return b|0}return 0}function jb(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;gI(a,1,5);b=c1(a,1)|0;gI(a,2,6);if((b|0)<1){c=0;return c|0}else{d=1}while(1){cJ(a,2);c5(a,d);dh(a,1,d);dw(a,2,1);if((cK(a,-1)|0)!=0){c=1;e=2450;break}cG(a,-2);f=d+1|0;if((f|0)>(b|0)){c=0;e=2448;break}else{d=f}}if((e|0)==2450){return c|0}else if((e|0)==2448){return c|0}return 0}function jc(a){a=a|0;gI(a,1,5);c5(a,c1(a,1)|0);return 1}function jd(a){a=a|0;var b=0.0,c=0.0,d=0.0;gI(a,1,5);c3(a);L3123:do{if((dF(a,1)|0)==0){b=0.0}else{c=0.0;while(1){while(1){cG(a,-2);if((cK(a,-1)|0)==3){d=+cW(a,-1);if(d>c){break}}if((dF(a,1)|0)==0){b=c;break L3123}}if((dF(a,1)|0)==0){b=d;break}else{c=d}}}}while(0);c4(a,b);return 1}function je(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0;b=i;gI(a,1,5);d=(c1(a,1)|0)+1|0;e=cF(a)|0;do{if((e|0)==3){f=gM(a,2)|0;g=(f|0)>(d|0)?f:d;if((g|0)>(f|0)){h=g}else{j=f;break}while(1){g=h-1|0;dh(a,1,g);dp(a,1,h);if((g|0)>(f|0)){h=g}else{j=f;break}}}else if((e|0)==2){j=d}else{f=gz(a,9576,(g=i,i=i+1|0,i=i+7>>3<<3,c[g>>2]=0,g)|0)|0;i=g;k=f;i=b;return k|0}}while(0);dp(a,1,j);k=0;i=b;return k|0}function jf(a){a=a|0;var b=0,c=0,d=0,e=0;gI(a,1,5);b=c1(a,1)|0;c=gN(a,2,b)|0;if((c|0)<1|(c|0)>(b|0)){d=0;return d|0}dh(a,1,c);if((c|0)<(b|0)){e=c;while(1){c=e+1|0;dh(a,1,c);dp(a,1,e);if((c|0)<(b|0)){e=c}else{break}}}c3(a);dp(a,1,b);d=1;return d|0}function jg(a){a=a|0;var b=0,d=0;b=i;gI(a,1,5);gz(a,9776,(d=i,i=i+1|0,i=i+7>>3<<3,c[d>>2]=0,d)|0)|0;i=d;cJ(a,1);i=b;return 1}function jh(a){a=a|0;var b=0;gI(a,1,5);b=c1(a,1)|0;gH(a,40,10584);if((cK(a,2)|0)>=1){gI(a,2,6)}cG(a,2);ji(a,1,b);return 0}function ji(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;e=i;if((b|0)<(d|0)){f=b;g=d}else{i=e;return}while(1){dh(a,1,f);dh(a,1,g);if((jj(a,-1,-2)|0)==0){cG(a,-3)}else{dp(a,1,f);dp(a,1,g)}d=g-f|0;if((d|0)==1){h=2505;break}b=(g+f|0)/2|0;dh(a,1,b);dh(a,1,f);do{if((jj(a,-2,-1)|0)==0){cG(a,-2);dh(a,1,g);if((jj(a,-1,-2)|0)==0){cG(a,-3);break}else{dp(a,1,b);dp(a,1,g);break}}else{dp(a,1,b);dp(a,1,f)}}while(0);if((d|0)==2){h=2502;break}dh(a,1,b);cJ(a,-1);j=g-1|0;dh(a,1,j);dp(a,1,b);dp(a,1,j);k=j;l=f;while(1){m=l+1|0;dh(a,1,m);if((jj(a,-1,-2)|0)==0){n=l;o=m}else{p=m;while(1){if((p|0)>(g|0)){gz(a,10088,(q=i,i=i+1|0,i=i+7>>3<<3,c[q>>2]=0,q)|0)|0;i=q}cG(a,-2);m=p+1|0;dh(a,1,m);if((jj(a,-1,-2)|0)==0){n=p;o=m;break}else{p=m}}}p=k-1|0;dh(a,1,p);if((jj(a,-3,-1)|0)==0){r=p}else{m=p;while(1){if((m|0)<(f|0)){gz(a,10088,(q=i,i=i+1|0,i=i+7>>3<<3,c[q>>2]=0,q)|0)|0;i=q}cG(a,-2);p=m-1|0;dh(a,1,p);if((jj(a,-3,-1)|0)==0){r=p;break}else{m=p}}}if((r|0)<(o|0)){break}dp(a,1,o);dp(a,1,r);k=r;l=o}cG(a,-4);dh(a,1,j);dh(a,1,o);dp(a,1,j);dp(a,1,o);l=(o-f|0)<(g-o|0);k=n+2|0;b=l?k:f;d=l?g:n;ji(a,l?f:k,l?n:g);if((b|0)<(d|0)){f=b;g=d}else{h=2504;break}}if((h|0)==2502){i=e;return}else if((h|0)==2504){i=e;return}else if((h|0)==2505){i=e;return}}function jj(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;if((cK(a,2)|0)==0){d=cV(a,b,c)|0;return d|0}else{cJ(a,2);cJ(a,b-1|0);cJ(a,c-2|0);dw(a,2,1);c=cX(a,-1)|0;cG(a,-2);d=c;return d|0}return 0}function jk(a){a=a|0;gQ(a,3800,184);df(a,-1,9184);dm(a,-2,7192);di(a,0,1);c9(a,10536,0);cJ(a,-2);dq(a,-2)|0;cG(a,-2);cJ(a,-2);dm(a,-2,4424);cG(a,-2);return 1}function jl(a){a=a|0;var b=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;b=i;i=i+8|0;e=b|0;f=gE(a,1,e)|0;g=gN(a,2,1)|0;if((g|0)<0){h=g+1+(c[e>>2]|0)|0}else{h=g}g=(h|0)<0?0:h;h=gN(a,3,g)|0;j=c[e>>2]|0;if((h|0)<0){k=h+1+j|0}else{k=h}h=(k|0)<0?0:k;k=(g|0)<1?1:g;g=h>>>0>j>>>0?j:h;if((k|0)>(g|0)){l=0;i=b;return l|0}h=g-k+1|0;if((g|0)==2147483647){gz(a,5040,(g=i,i=i+1|0,i=i+7>>3<<3,c[g>>2]=0,g)|0)|0;i=g}gH(a,h,5040);if((h|0)<=0){l=h;i=b;return l|0}g=k-1|0;k=0;while(1){c5(a,d[f+(g+k)|0]|0);j=k+1|0;if((j|0)<(h|0)){k=j}else{l=h;break}}i=b;return l|0}function jm(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;d=i;i=i+1040|0;e=d|0;f=cF(b)|0;gt(b,e);if((f|0)<1){gX(e);i=d;return 1}g=e|0;h=e+1036|0;j=1;do{k=gM(b,j)|0;if((k&255|0)!=(k|0)){gy(b,j,5176)|0}l=c[g>>2]|0;if(l>>>0<h>>>0){m=l}else{gY(e)|0;m=c[g>>2]|0}c[g>>2]=m+1;a[m]=k&255;j=j+1|0;}while((j|0)<=(f|0));gX(e);i=d;return 1}function jn(a){a=a|0;var b=0,d=0;b=i;i=i+1040|0;d=b|0;gI(a,1,6);cG(a,1);gt(a,d);if((dC(a,252,d)|0)==0){gX(d);i=b;return 1}gz(a,5272,(a=i,i=i+1|0,i=i+7>>3<<3,c[a>>2]=0,a)|0)|0;i=a;gX(d);i=b;return 1}function jo(a){a=a|0;return jA(a,1)|0}function jp(b){b=b|0;var e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0.0,Y=0;e=i;i=i+1600|0;f=e|0;g=e+8|0;j=e+16|0;k=e+1056|0;l=e+1592|0;m=cF(b)|0;n=gE(b,1,g)|0;o=c[g>>2]|0;g=n+o|0;gt(b,j);L3242:do{if((o|0)>0){p=j|0;q=j+1036|0;r=k|0;s=k+1|0;t=e+1080|0;u=n;v=1;L3244:while(1){x=u;while(1){y=a[x]|0;if(y<<24>>24==37){z=x+1|0;if((a[z]|0)!=37){break}A=c[p>>2]|0;if(A>>>0<q>>>0){B=37;C=A}else{gY(j)|0;B=a[z]|0;C=c[p>>2]|0}c[p>>2]=C+1;a[C]=B;D=x+2|0}else{A=c[p>>2]|0;if(A>>>0<q>>>0){E=y;F=A}else{gY(j)|0;E=a[x]|0;F=c[p>>2]|0}c[p>>2]=F+1;a[F]=E;D=x+1|0}if(D>>>0<g>>>0){x=D}else{break L3242}}v=v+1|0;if((v|0)>(m|0)){gy(b,v,6472)|0;G=z}else{G=z}while(1){x=a[G]|0;if(x<<24>>24==0){H=0;break}if((aM(5616,x<<24>>24|0,6)|0)==0){H=x;break}G=G+1|0}x=z;if((G-x|0)>>>0>5){gz(b,5512,(I=i,i=i+1|0,i=i+7>>3<<3,c[I>>2]=0,I)|0)|0;i=I;J=a[G]|0}else{J=H}A=((J&255)-48|0)>>>0<10?G+1|0:G;y=((d[A]|0)-48|0)>>>0<10?A+1|0:A;A=a[y]|0;do{if(A<<24>>24==46){K=y+1|0;L=((d[K]|0)-48|0)>>>0<10?y+2|0:K;K=a[L]|0;if(((K&255)-48|0)>>>0>=10){M=L;N=K;break}K=L+1|0;M=K;N=a[K]|0}else{M=y;N=A}}while(0);if(((N&255)-48|0)>>>0<10){gz(b,5360,(I=i,i=i+1|0,i=i+7>>3<<3,c[I>>2]=0,I)|0)|0;i=I}a[r]=37;A=M-x|0;j3(s|0,z|0,A+1|0)|0;a[k+(A+2)|0]=0;u=M+1|0;O=a[M]|0;L3277:do{switch(O|0){case 113:{A=gE(b,v,f)|0;y=c[p>>2]|0;if(y>>>0<q>>>0){P=y}else{gY(j)|0;P=c[p>>2]|0}c[p>>2]=P+1;a[P]=34;y=c[f>>2]|0;c[f>>2]=y-1;L3282:do{if((y|0)!=0){K=A;while(1){L=a[K]|0;switch(L<<24>>24|0){case 34:case 92:case 10:{Q=c[p>>2]|0;if(Q>>>0<q>>>0){R=Q}else{gY(j)|0;R=c[p>>2]|0}c[p>>2]=R+1;a[R]=92;Q=c[p>>2]|0;if(Q>>>0<q>>>0){S=Q}else{gY(j)|0;S=c[p>>2]|0}Q=a[K]|0;c[p>>2]=S+1;a[S]=Q;break};case 13:{gV(j,6080,2);break};case 0:{gV(j,5800,4);break};default:{Q=c[p>>2]|0;if(Q>>>0<q>>>0){T=L;U=Q}else{gY(j)|0;T=a[K]|0;U=c[p>>2]|0}c[p>>2]=U+1;a[U]=T}}Q=c[f>>2]|0;c[f>>2]=Q-1;if((Q|0)==0){break L3282}else{K=K+1|0}}}}while(0);A=c[p>>2]|0;if(A>>>0<q>>>0){V=A}else{gY(j)|0;V=c[p>>2]|0}c[p>>2]=V+1;a[V]=34;break};case 115:{A=gE(b,v,l)|0;do{if((aU(r|0,46)|0)==0){if((c[l>>2]|0)>>>0<=99){break}cJ(b,v);gZ(j);break L3277}}while(0);a$(t|0,r|0,(I=i,i=i+8|0,c[I>>2]=A,I)|0)|0;i=I;W=2595;break};case 99:{y=~~+gK(b,v);a$(t|0,r|0,(I=i,i=i+8|0,c[I>>2]=y,I)|0)|0;i=I;W=2595;break};case 100:case 105:{y=j_(r|0)|0;K=k+(y-1)|0;Q=a[K]|0;L=K;w=108;a[L]=w&255;w=w>>8;a[L+1|0]=w&255;a[k+y|0]=Q;a[k+(y+1)|0]=0;y=~~+gK(b,v);a$(t|0,r|0,(I=i,i=i+8|0,c[I>>2]=y,I)|0)|0;i=I;W=2595;break};case 111:case 117:case 120:case 88:{y=j_(r|0)|0;Q=k+(y-1)|0;L=a[Q]|0;K=Q;w=108;a[K]=w&255;w=w>>8;a[K+1|0]=w&255;a[k+y|0]=L;a[k+(y+1)|0]=0;y=~~+gK(b,v);a$(t|0,r|0,(I=i,i=i+8|0,c[I>>2]=y,I)|0)|0;i=I;W=2595;break};case 101:case 69:case 102:case 103:case 71:{X=+gK(b,v);a$(t|0,r|0,(I=i,i=i+8|0,h[I>>3]=X,I)|0)|0;i=I;W=2595;break};default:{break L3244}}}while(0);if((W|0)==2595){W=0;gV(j,t,j_(t|0)|0)}if(u>>>0>=g>>>0){break L3242}}u=gz(b,6288,(I=i,i=i+8|0,c[I>>2]=O,I)|0)|0;i=I;Y=u;i=e;return Y|0}}while(0);gX(j);Y=1;i=e;return Y|0}function jq(a){a=a|0;var b=0,d=0;b=i;d=gz(a,6600,(a=i,i=i+1|0,i=i+7>>3<<3,c[a>>2]=0,a)|0)|0;i=a;i=b;return d|0}function jr(a){a=a|0;gE(a,1,0)|0;gE(a,2,0)|0;cG(a,2);c5(a,0);dd(a,286,3);return 1}function js(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0;d=i;i=i+1328|0;e=d|0;f=d+8|0;g=d+16|0;h=d+288|0;j=gE(b,1,f)|0;k=gE(b,2,0)|0;l=cK(b,3)|0;m=gN(b,4,(c[f>>2]|0)+1|0)|0;n=(a[k]|0)==94;o=n?k+1|0:k;if(!((l-3|0)>>>0<2|(l|0)==6|(l|0)==5)){gy(b,3,6824)|0}gt(b,h);l=g+8|0;c[l>>2]=b;k=g|0;c[k>>2]=j;p=g+4|0;c[p>>2]=j+(c[f>>2]|0);f=g+12|0;q=h|0;r=h+1036|0;s=g+20|0;t=g+16|0;u=j;j=0;while(1){if((j|0)>=(m|0)){v=u;w=j;x=2646;break}c[f>>2]=0;y=jB(g,u,o)|0;if((y|0)==0){z=j;x=2640}else{A=j+1|0;B=c[l>>2]|0;C=cK(B,3)|0;do{if((C|0)==3|(C|0)==4){D=c0(c[l>>2]|0,3,e)|0;if((c[e>>2]|0)==0){break}E=y-u|0;F=0;do{G=D+F|0;H=a[G]|0;do{if(H<<24>>24==37){I=F+1|0;J=D+I|0;K=a[J]|0;if(((K&255)-48|0)>>>0<10){if(K<<24>>24==48){gV(h,u,E);L=I;break}else{jC(g,(K<<24>>24)-49|0,u,y);gZ(h);L=I;break}}else{M=c[q>>2]|0;if(M>>>0<r>>>0){N=K;O=M}else{gY(h)|0;N=a[J]|0;O=c[q>>2]|0}c[q>>2]=O+1;a[O]=N;L=I;break}}else{I=c[q>>2]|0;if(I>>>0<r>>>0){P=H;Q=I}else{gY(h)|0;P=a[G]|0;Q=c[q>>2]|0}c[q>>2]=Q+1;a[Q]=P;L=F}}while(0);F=L+1|0;}while(F>>>0<(c[e>>2]|0)>>>0)}else if((C|0)==6){cJ(B,3);F=c[f>>2]|0;E=(F|0)!=0|(u|0)==0?F:1;gH(c[l>>2]|0,E,8536);if((E|0)>0){F=0;do{jC(g,F,u,y);F=F+1|0;}while((F|0)<(E|0))}dw(B,E,1);x=2634}else if((C|0)==5){L3358:do{if((c[f>>2]|0)>0){F=c[s>>2]|0;do{if((F|0)==-1){D=c[l>>2]|0;gz(D,8104,(R=i,i=i+1|0,i=i+7>>3<<3,c[R>>2]=0,R)|0)|0;i=R;S=c[l>>2]|0;T=c[t>>2]|0}else{D=c[l>>2]|0;G=c[t>>2]|0;if((F|0)!=-2){S=D;T=G;break}c5(D,G+1-(c[k>>2]|0)|0);break L3358}}while(0);c9(S,T,F)}else{c9(c[l>>2]|0,u,y-u|0)}}while(0);de(B,3);x=2634}else{x=2634}}while(0);if((x|0)==2634){x=0;do{if((cX(B,-1)|0)==0){cG(B,-2);c9(B,u,y-u|0)}else{if((cQ(B,-1)|0)!=0){break}C=cL(B,cK(B,-1)|0)|0;gz(B,6712,(R=i,i=i+8|0,c[R>>2]=C,R)|0)|0;i=R}}while(0);gZ(h)}if(y>>>0>u>>>0){U=y;V=A}else{z=A;x=2640}}if((x|0)==2640){x=0;if(u>>>0>=(c[p>>2]|0)>>>0){v=u;w=z;x=2647;break}B=c[q>>2]|0;if(B>>>0<r>>>0){W=B}else{gY(h)|0;W=c[q>>2]|0}B=a[u]|0;c[q>>2]=W+1;a[W]=B;U=u+1|0;V=z}if(n){v=U;w=V;x=2648;break}else{u=U;j=V}}if((x|0)==2646){X=c[p>>2]|0;Y=X;Z=v;_=Y-Z|0;gV(h,v,_);gX(h);c5(b,w);i=d;return 2}else if((x|0)==2647){X=c[p>>2]|0;Y=X;Z=v;_=Y-Z|0;gV(h,v,_);gX(h);c5(b,w);i=d;return 2}else if((x|0)==2648){X=c[p>>2]|0;Y=X;Z=v;_=Y-Z|0;gV(h,v,_);gX(h);c5(b,w);i=d;return 2}return 0}function jt(a){a=a|0;var b=0,d=0;b=i;i=i+8|0;d=b|0;gE(a,1,d)|0;c5(a,c[d>>2]|0);i=b;return 1}function ju(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;i=i+1048|0;f=e|0;g=e+8|0;h=gE(b,1,f)|0;gt(b,g);if((c[f>>2]|0)==0){gX(g);i=e;return 1}b=g|0;j=g+1036|0;k=0;do{if((c[b>>2]|0)>>>0>=j>>>0){gY(g)|0}l=(j6(d[h+k|0]|0|0)|0)&255;m=c[b>>2]|0;c[b>>2]=m+1;a[m]=l;k=k+1|0;}while(k>>>0<(c[f>>2]|0)>>>0);gX(g);i=e;return 1}function jv(a){a=a|0;return jA(a,0)|0}function jw(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;i=i+1048|0;d=b|0;e=b+8|0;f=gE(a,1,d)|0;g=gM(a,2)|0;gt(a,e);if((g|0)>0){h=g}else{gX(e);i=b;return 1}do{h=h-1|0;gV(e,f,c[d>>2]|0);}while((h|0)>0);gX(e);i=b;return 1}function jx(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;d=i;i=i+1048|0;e=d|0;f=d+8|0;g=gE(b,1,e)|0;gt(b,f);b=c[e>>2]|0;h=b-1|0;c[e>>2]=h;if((b|0)==0){gX(f);i=d;return 1}b=f|0;j=f+1036|0;k=h;do{h=c[b>>2]|0;if(h>>>0<j>>>0){l=k;m=h}else{gY(f)|0;l=c[e>>2]|0;m=c[b>>2]|0}h=a[g+l|0]|0;c[b>>2]=m+1;a[m]=h;h=c[e>>2]|0;k=h-1|0;c[e>>2]=k;}while((h|0)!=0);gX(f);i=d;return 1}function jy(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;i=i+8|0;d=b|0;e=gE(a,1,d)|0;f=gM(a,2)|0;if((f|0)<0){g=f+1+(c[d>>2]|0)|0}else{g=f}f=(g|0)<0?0:g;g=gN(a,3,-1)|0;h=c[d>>2]|0;if((g|0)<0){j=g+1+h|0}else{j=g}g=(j|0)<0?0:j;j=(f|0)<1?1:f;f=(g|0)>(h|0)?h:g;if((j|0)>(f|0)){c9(a,10536,0);i=b;return 1}else{c9(a,e+(j-1)|0,1-j+f|0);i=b;return 1}return 0}function jz(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;i=i+1048|0;f=e|0;g=e+8|0;h=gE(b,1,f)|0;gt(b,g);if((c[f>>2]|0)==0){gX(g);i=e;return 1}b=g|0;j=g+1036|0;k=0;do{if((c[b>>2]|0)>>>0>=j>>>0){gY(g)|0}l=(bj(d[h+k|0]|0|0)|0)&255;m=c[b>>2]|0;c[b>>2]=m+1;a[m]=l;k=k+1|0;}while(k>>>0<(c[f>>2]|0)>>>0);gX(g);i=e;return 1}function jA(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;e=i;i=i+288|0;f=e|0;g=e+8|0;h=e+16|0;j=gE(b,1,f)|0;k=gE(b,2,g)|0;l=gN(b,3,1)|0;if((l|0)<0){m=l+1+(c[f>>2]|0)|0}else{m=l}l=(m|0)<0?-1:m-1|0;if((l|0)<0){n=0}else{m=c[f>>2]|0;n=l>>>0>m>>>0?m:l}l=(d|0)!=0;L3443:do{if(l){if((cX(b,4)|0)==0){if((b2(k|0,8744)|0)!=0){o=2706;break}}d=j+n|0;m=(c[f>>2]|0)-n|0;p=c[g>>2]|0;L3448:do{if((p|0)==0){if((d|0)==0){break L3443}else{q=d}}else{if(p>>>0>m>>>0){break L3443}r=p-1|0;if((r|0)==(m|0)){break L3443}s=a[k]|0;t=k+1|0;u=d;v=m-r|0;while(1){w=aM(u|0,s|0,v|0)|0;if((w|0)==0){break L3443}x=w+1|0;if((j5(x|0,t|0,r|0)|0)==0){q=w;break L3448}w=x;y=u+v|0;if((y|0)==(w|0)){break L3443}else{u=x;v=y-w|0}}}}while(0);m=q-j|0;c5(b,m+1|0);c5(b,m+(c[g>>2]|0)|0);z=2;i=e;return z|0}else{o=2706}}while(0);L3459:do{if((o|0)==2706){g=(a[k]|0)==94;q=g?k+1|0:k;m=j+n|0;d=h+8|0;c[d>>2]=b;c[h>>2]=j;p=h+4|0;c[p>>2]=j+(c[f>>2]|0);v=h+12|0;L3461:do{if(g){c[v>>2]=0;u=jB(h,m,q)|0;if((u|0)==0){break L3459}else{A=m;B=u}}else{u=m;while(1){c[v>>2]=0;r=jB(h,u,q)|0;if((r|0)!=0){A=u;B=r;break L3461}if(u>>>0>=(c[p>>2]|0)>>>0){break L3459}u=u+1|0}}}while(0);if(l){p=j;c5(b,1-p+A|0);c5(b,B-p|0);p=c[v>>2]|0;gH(c[d>>2]|0,p,8536);if((p|0)>0){q=0;do{jC(h,q,0,0);q=q+1|0;}while((q|0)<(p|0))}z=p+2|0;i=e;return z|0}else{q=c[v>>2]|0;m=(q|0)!=0|(A|0)==0?q:1;gH(c[d>>2]|0,m,8536);if((m|0)>0){C=0}else{z=m;i=e;return z|0}while(1){jC(h,C,A,B);q=C+1|0;if((q|0)<(m|0)){C=q}else{z=m;break}}i=e;return z|0}}}while(0);c3(b);z=1;i=e;return z|0}function jB(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0;g=i;h=b+4|0;j=b+8|0;k=b|0;l=b+12|0;m=e;e=f;L3484:while(1){n=m+1|0;f=m-1|0;o=e;L3486:while(1){p=a[o]|0;L3488:do{switch(p|0){case 36:{q=o+1|0;if((a[q]|0)==0){r=2800;break L3484}else{s=q;t=q}break};case 0:{u=m;r=2859;break L3484;break};case 41:{r=2737;break L3484;break};case 37:{q=o+1|0;v=a[q]|0;w=v<<24>>24;if((w|0)==98){r=2744;break L3486}else if((w|0)!=102){x=v&255;if((x-48|0)>>>0<10){r=2791;break L3486}else{y=q;r=2801;break L3488}}q=o+2|0;do{if((a[q]|0)==91){z=o+3|0;r=2761}else{v=c[j>>2]|0;gz(v,7848,(A=i,i=i+1|0,i=i+7>>3<<3,c[A>>2]=0,A)|0)|0;i=A;v=a[q]|0;w=o+3|0;if((v|0)==91){z=w;r=2761;break}else if((v|0)!=37){B=w;C=w;break}if((a[w]|0)==0){v=c[j>>2]|0;gz(v,7584,(A=i,i=i+1|0,i=i+7>>3<<3,c[A>>2]=0,A)|0)|0;i=A}B=o+4|0;C=w}}while(0);if((r|0)==2761){r=0;w=(a[z]|0)==94?o+4|0:z;v=w;D=a[w]|0;while(1){if(D<<24>>24==0){w=c[j>>2]|0;gz(w,7432,(A=i,i=i+1|0,i=i+7>>3<<3,c[A>>2]=0,A)|0)|0;i=A;E=a[v]|0}else{E=D}w=v+1|0;if(E<<24>>24==37){F=(a[w]|0)==0?w:v+2|0}else{F=w}w=a[F]|0;if(w<<24>>24==93){break}else{v=F;D=w}}B=F+1|0;C=z}if((m|0)==(c[k>>2]|0)){G=0}else{G=d[f]|0}D=B-1|0;v=(a[C]|0)==94;w=v?C:q;H=v&1;v=H^1;I=w+1|0;L3517:do{if(I>>>0<D>>>0){J=w;K=I;while(1){L=a[K]|0;M=J+2|0;N=a[M]|0;L3520:do{if(L<<24>>24==37){if((jE(G,N&255)|0)==0){O=M}else{P=v;break L3517}}else{do{if(N<<24>>24==45){Q=J+3|0;if(Q>>>0>=D>>>0){break}if((L&255)>>>0>G>>>0){O=Q;break L3520}if((d[Q]|0)>>>0<G>>>0){O=Q;break L3520}else{P=v;break L3517}}}while(0);if((L&255|0)==(G|0)){P=v;break L3517}else{O=K}}}while(0);L=O+1|0;if(L>>>0<D>>>0){J=O;K=L}else{P=H;break}}}else{P=H}}while(0);if((P|0)!=0){u=0;r=2870;break L3484}H=a[m]|0;v=H&255;I=(a[C]|0)==94;w=I?C:q;K=I&1;I=K^1;J=w+1|0;L3531:do{if(J>>>0<D>>>0){L=w;N=J;while(1){M=a[N]|0;Q=L+2|0;R=a[Q]|0;L3534:do{if(M<<24>>24==37){if((jE(v,R&255)|0)==0){S=Q}else{T=I;break L3531}}else{do{if(R<<24>>24==45){U=L+3|0;if(U>>>0>=D>>>0){break}if((M&255)>(H&255)){S=U;break L3534}if((d[U]|0)<(H&255)){S=U;break L3534}else{T=I;break L3531}}}while(0);if(M<<24>>24==H<<24>>24){T=I;break L3531}else{S=N}}}while(0);M=S+1|0;if(M>>>0<D>>>0){L=S;N=M}else{T=K;break}}}else{T=K}}while(0);if((T|0)==0){u=0;r=2853;break L3484}else{o=B;continue L3486}break};case 40:{r=2728;break L3484;break};default:{y=o+1|0;r=2801}}}while(0);do{if((r|0)==2801){r=0;if((p|0)==37){if((a[y]|0)==0){K=c[j>>2]|0;gz(K,7584,(A=i,i=i+1|0,i=i+7>>3<<3,c[A>>2]=0,A)|0)|0;i=A}s=o+2|0;t=y;break}else if((p|0)!=91){s=y;t=y;break}K=(a[y]|0)==94?o+2|0:y;D=K;I=a[K]|0;while(1){if(I<<24>>24==0){K=c[j>>2]|0;gz(K,7432,(A=i,i=i+1|0,i=i+7>>3<<3,c[A>>2]=0,A)|0)|0;i=A;V=a[D]|0}else{V=I}K=D+1|0;if(V<<24>>24==37){W=(a[K]|0)==0?K:D+2|0}else{W=K}K=a[W]|0;if(K<<24>>24==93){break}else{D=W;I=K}}s=W+1|0;t=y}}while(0);if(m>>>0<(c[h>>2]|0)>>>0){p=a[m]|0;I=p&255;D=a[o]|0;K=D<<24>>24;L3564:do{if((K|0)==37){X=jE(I,d[t]|0)|0}else if((K|0)==91){H=s-1|0;v=(a[t]|0)==94;J=v?t:o;w=v&1;v=w^1;q=J+1|0;if(q>>>0<H>>>0){Y=J;Z=q}else{X=w;break}while(1){q=a[Z]|0;J=Y+2|0;N=a[J]|0;L3569:do{if(q<<24>>24==37){if((jE(I,N&255)|0)==0){_=J}else{X=v;break L3564}}else{do{if(N<<24>>24==45){L=Y+3|0;if(L>>>0>=H>>>0){break}if((q&255)>(p&255)){_=L;break L3569}if((d[L]|0)<(p&255)){_=L;break L3569}else{X=v;break L3564}}}while(0);if(q<<24>>24==p<<24>>24){X=v;break L3564}else{_=Z}}}while(0);q=_+1|0;if(q>>>0<H>>>0){Y=_;Z=q}else{X=w;break}}}else if((K|0)==46){X=1}else{X=D<<24>>24==p<<24>>24|0}}while(0);$=(X|0)!=0}else{$=0}p=a[s]|0;if((p|0)==45){r=2827;break L3484}else if((p|0)==42){r=2831;break L3484}else if((p|0)==43){r=2832;break L3484}else if((p|0)!=63){r=2849;break}p=s+1|0;if(!$){o=p;continue}D=jB(b,n,p)|0;if((D|0)==0){o=p}else{u=D;r=2862;break L3484}}if((r|0)==2791){r=0;f=x-49|0;do{if((f|0)<0){r=2794}else{if((f|0)>=(c[l>>2]|0)){r=2794;break}D=c[b+16+(f<<3)+4>>2]|0;if((D|0)==-1){r=2794}else{aa=f;ab=D}}}while(0);if((r|0)==2794){r=0;f=gz(c[j>>2]|0,8344,(A=i,i=i+1|0,i=i+7>>3<<3,c[A>>2]=0,A)|0)|0;i=A;aa=f;ab=c[b+16+(f<<3)+4>>2]|0}if(((c[h>>2]|0)-m|0)>>>0<ab>>>0){u=0;r=2851;break}if((j5(c[b+16+(aa<<3)>>2]|0,m|0,ab|0)|0)!=0){u=0;r=2854;break}f=m+ab|0;if((f|0)==0){u=0;r=2855;break}m=f;e=o+2|0;continue}else if((r|0)==2744){r=0;f=o+2|0;D=a[f]|0;if(D<<24>>24==0){r=2746}else{if((a[o+3|0]|0)==0){r=2746}else{ac=D}}if((r|0)==2746){r=0;D=c[j>>2]|0;gz(D,7168,(A=i,i=i+1|0,i=i+7>>3<<3,c[A>>2]=0,A)|0)|0;i=A;ac=a[f]|0}if((a[m]|0)!=ac<<24>>24){u=0;r=2857;break}f=a[o+3|0]|0;D=c[h>>2]|0;if(n>>>0<D>>>0){ad=m;ae=1;af=n}else{u=0;r=2858;break}while(1){p=a[af]|0;if(p<<24>>24==f<<24>>24){K=ae-1|0;if((K|0)==0){break}else{ag=K}}else{ag=(p<<24>>24==ac<<24>>24)+ae|0}p=af+1|0;if(p>>>0<D>>>0){ad=af;ae=ag;af=p}else{u=0;r=2852;break L3484}}D=ad+2|0;if((D|0)==0){u=0;r=2860;break}m=D;e=o+4|0;continue}else if((r|0)==2849){r=0;if($){m=n;e=s;continue}else{u=0;r=2869;break}}}if((r|0)==2800){u=(m|0)==(c[h>>2]|0)?m:0;i=g;return u|0}else if((r|0)==2827){e=s+1|0;ad=jB(b,m,e)|0;if((ad|0)!=0){u=ad;i=g;return u|0}ad=s-1|0;af=m;while(1){if(af>>>0>=(c[h>>2]|0)>>>0){u=0;r=2866;break}ag=a[af]|0;ae=ag&255;ac=a[o]|0;ab=ac<<24>>24;L3620:do{if((ab|0)==37){ah=jE(ae,d[t]|0)|0;r=2847}else if((ab|0)==91){aa=(a[t]|0)==94;x=aa?t:o;X=aa&1;aa=X^1;Z=x+1|0;if(Z>>>0<ad>>>0){ai=x;aj=Z}else{ah=X;r=2847;break}while(1){Z=a[aj]|0;x=ai+2|0;_=a[x]|0;L3625:do{if(Z<<24>>24==37){if((jE(ae,_&255)|0)==0){ak=x}else{ah=aa;r=2847;break L3620}}else{do{if(_<<24>>24==45){Y=ai+3|0;if(Y>>>0>=ad>>>0){break}if((Z&255)>(ag&255)){ak=Y;break L3625}if((d[Y]|0)<(ag&255)){ak=Y;break L3625}else{ah=aa;r=2847;break L3620}}}while(0);if(Z<<24>>24==ag<<24>>24){ah=aa;r=2847;break L3620}else{ak=aj}}}while(0);Z=ak+1|0;if(Z>>>0<ad>>>0){ai=ak;aj=Z}else{ah=X;r=2847;break}}}else if((ab|0)!=46){ah=ac<<24>>24==ag<<24>>24|0;r=2847}}while(0);if((r|0)==2847){r=0;if((ah|0)==0){u=0;r=2867;break}}ag=af+1|0;ac=jB(b,ag,e)|0;if((ac|0)==0){af=ag}else{u=ac;r=2868;break}}if((r|0)==2866){i=g;return u|0}else if((r|0)==2867){i=g;return u|0}else if((r|0)==2868){i=g;return u|0}}else if((r|0)==2831){u=jD(b,m,o,s)|0;i=g;return u|0}else if((r|0)==2832){if(!$){u=0;i=g;return u|0}u=jD(b,n,o,s)|0;i=g;return u|0}else if((r|0)==2851){i=g;return u|0}else if((r|0)==2852){i=g;return u|0}else if((r|0)==2853){i=g;return u|0}else if((r|0)==2854){i=g;return u|0}else if((r|0)==2855){i=g;return u|0}else if((r|0)==2857){i=g;return u|0}else if((r|0)==2858){i=g;return u|0}else if((r|0)==2859){i=g;return u|0}else if((r|0)==2860){i=g;return u|0}else if((r|0)==2862){i=g;return u|0}else if((r|0)==2869){i=g;return u|0}else if((r|0)==2870){i=g;return u|0}else if((r|0)==2737){s=o+1|0;n=c[l>>2]|0;while(1){$=n-1|0;if((n|0)<=0){r=2740;break}if((c[b+16+($<<3)+4>>2]|0)==-1){al=$;break}else{n=$}}if((r|0)==2740){n=gz(c[j>>2]|0,7e3,(A=i,i=i+1|0,i=i+7>>3<<3,c[A>>2]=0,A)|0)|0;i=A;al=n}n=b+16+(al<<3)+4|0;c[n>>2]=m-(c[b+16+(al<<3)>>2]|0);al=jB(b,m,s)|0;if((al|0)!=0){u=al;i=g;return u|0}c[n>>2]=-1;u=0;i=g;return u|0}else if((r|0)==2728){r=o+1|0;if((a[r]|0)==41){n=c[l>>2]|0;if((n|0)>31){al=c[j>>2]|0;gz(al,8536,(A=i,i=i+1|0,i=i+7>>3<<3,c[A>>2]=0,A)|0)|0;i=A}c[b+16+(n<<3)>>2]=m;c[b+16+(n<<3)+4>>2]=-2;c[l>>2]=n+1;n=jB(b,m,o+2|0)|0;if((n|0)!=0){u=n;i=g;return u|0}c[l>>2]=(c[l>>2]|0)-1;u=0;i=g;return u|0}else{n=c[l>>2]|0;if((n|0)>31){o=c[j>>2]|0;gz(o,8536,(A=i,i=i+1|0,i=i+7>>3<<3,c[A>>2]=0,A)|0)|0;i=A}c[b+16+(n<<3)>>2]=m;c[b+16+(n<<3)+4>>2]=-1;c[l>>2]=n+1;n=jB(b,m,r)|0;if((n|0)!=0){u=n;i=g;return u|0}c[l>>2]=(c[l>>2]|0)-1;u=0;i=g;return u|0}}return 0}function jC(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;if((c[a+12>>2]|0)<=(b|0)){g=c[a+8>>2]|0;if((b|0)==0){c9(g,d,e-d|0);i=f;return}else{gz(g,8344,(h=i,i=i+1|0,i=i+7>>3<<3,c[h>>2]=0,h)|0)|0;i=h;i=f;return}}g=c[a+16+(b<<3)+4>>2]|0;do{if((g|0)==-1){d=a+8|0;e=c[d>>2]|0;gz(e,8104,(h=i,i=i+1|0,i=i+7>>3<<3,c[h>>2]=0,h)|0)|0;i=h;j=c[d>>2]|0;k=c[a+16+(b<<3)>>2]|0}else{d=c[a+8>>2]|0;e=c[a+16+(b<<3)>>2]|0;if((g|0)!=-2){j=d;k=e;break}c5(d,e+1-(c[a>>2]|0)|0);i=f;return}}while(0);c9(j,k,g);i=f;return}function jD(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;h=b+4|0;i=c[h>>2]|0;L3707:do{if(i>>>0>e>>>0){j=f+1|0;k=g-1|0;l=0;m=e;n=i;while(1){o=a[m]|0;p=o&255;q=a[f]|0;r=q<<24>>24;L3711:do{if((r|0)==37){s=jE(p,d[j]|0)|0;t=2905}else if((r|0)==46){u=n}else if((r|0)==91){v=(a[j]|0)==94;w=v?j:f;x=v&1;v=x^1;y=w+1|0;if(y>>>0<k>>>0){z=w;A=y}else{s=x;t=2905;break}while(1){y=a[A]|0;w=z+2|0;B=a[w]|0;L3717:do{if(y<<24>>24==37){if((jE(p,B&255)|0)==0){C=w}else{s=v;t=2905;break L3711}}else{do{if(B<<24>>24==45){D=z+3|0;if(D>>>0>=k>>>0){break}if((y&255)>(o&255)){C=D;break L3717}if((d[D]|0)<(o&255)){C=D;break L3717}else{s=v;t=2905;break L3711}}}while(0);if(y<<24>>24==o<<24>>24){s=v;t=2905;break L3711}else{C=A}}}while(0);y=C+1|0;if(y>>>0<k>>>0){z=C;A=y}else{s=x;t=2905;break}}}else{s=q<<24>>24==o<<24>>24|0;t=2905}}while(0);if((t|0)==2905){t=0;if((s|0)==0){E=l;break L3707}u=c[h>>2]|0}o=l+1|0;q=e+o|0;if(q>>>0<u>>>0){l=o;m=q;n=u}else{E=o;break}}}else{E=0}}while(0);u=g+1|0;g=E;while(1){if((g|0)<=-1){F=0;t=2912;break}E=jB(b,e+g|0,u)|0;if((E|0)==0){g=g-1|0}else{F=E;t=2913;break}}if((t|0)==2913){return F|0}else if((t|0)==2912){return F|0}return 0}function jE(a,b){a=a|0;b=b|0;var c=0,d=0;switch(j6(b|0)|0){case 120:{c=aY(a|0)|0;break};case 122:{c=(a|0)==0|0;break};case 119:{c=bq(a|0)|0;break};case 115:{c=aB(a|0)|0;break};case 112:{c=bU(a|0)|0;break};case 97:{c=bt(a|0)|0;break};case 117:{c=bd(a|0)|0;break};case 108:{c=bb(a|0)|0;break};case 100:{c=(a-48|0)>>>0<10|0;break};case 99:{c=b8(a|0)|0;break};default:{d=(b|0)==(a|0)|0;return d|0}}if((bb(b|0)|0)!=0){d=c;return d|0}d=(c|0)==0|0;return d|0}function jF(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;b=i;i=i+280|0;d=b|0;e=b+272|0;f=c0(a,-10003,e)|0;g=c0(a,-10004,0)|0;h=d+8|0;c[h>>2]=a;c[d>>2]=f;j=f+(c[e>>2]|0)|0;e=d+4|0;c[e>>2]=j;k=d+12|0;l=f+(c$(a,-10005)|0)|0;m=j;while(1){if(l>>>0>m>>>0){n=0;o=2939;break}c[k>>2]=0;p=jB(d,l,g)|0;if((p|0)!=0){break}l=l+1|0;m=c[e>>2]|0}if((o|0)==2939){i=b;return n|0}c5(a,p-f+((p|0)==(l|0))|0);cP(a,-10005);a=c[k>>2]|0;k=(a|0)!=0|(l|0)==0?a:1;gH(c[h>>2]|0,k,8536);if((k|0)>0){q=0}else{n=k;i=b;return n|0}while(1){jC(d,q,l,p);h=q+1|0;if((h|0)<(k|0)){q=h}else{n=k;break}}i=b;return n|0}function jG(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;gV(d,b,c);return 0}function jH(a){a=a|0;var b=0,c=0;gF(a,3592)|0;dd(a,380,0);dm(a,-2,9152);gQ(a,7152,432);cJ(a,-1);cP(a,-10001);di(a,4,0);dd(a,388,0);dp(a,-2,1);dd(a,320,0);dp(a,-2,2);dd(a,524,0);dp(a,-2,3);dd(a,276,0);dp(a,-2,4);dm(a,-2,5608);b=bz(3768|0)|0;if((b|0)==0){da(a,3048)}else{c=gT(a,b,6816,6704)|0;gT(a,c,6592,3048)|0;cH(a,-2)}dm(a,-2,4376);c=bz(2344|0)|0;if((c|0)==0){da(a,2072)}else{b=gT(a,c,6816,6704)|0;gT(a,b,6592,2072)|0;cH(a,-2)}dm(a,-2,2680);c9(a,10272,9);dm(a,-2,10048);gS(a,-1e4,9760,2)|0;dm(a,-2,9560);di(a,0,0);dm(a,-2,9344);cJ(a,-10002);gQ(a,0,1368);cG(a,-2);return 1}function jI(a){a=a|0;c[(gG(a,1,3592)|0)>>2]=0;return 0}function jJ(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;b=i;i=i+104|0;d=b|0;e=gE(a,1,0)|0;f=cF(a)|0;g=f+1|0;df(a,-1e4,9760);df(a,g,e);do{if((cK(a,-1)|0)!=5){cG(a,-2);if((gS(a,-10002,e,1)|0)==0){cJ(a,-1);dm(a,g,e);break}h=gz(a,8072,(j=i,i=i+8|0,c[j>>2]=e,j)|0)|0;i=j;k=h;i=b;return k|0}}while(0);df(a,-1,7840);g=(cK(a,-1)|0)==0;cG(a,-2);if(g){cJ(a,-1);dm(a,-2,7160);da(a,e);dm(a,-2,7840);g=a0(e|0,46)|0;c9(a,e,((g|0)==0?e:g+1|0)-e|0);dm(a,-2,6976)}cJ(a,-1);do{if((ej(a,1,d)|0)==0){l=2960}else{if((en(a,7576,d)|0)==0){l=2960;break}if((cM(a,-1)|0)!=0){l=2960}}}while(0);if((l|0)==2960){gz(a,7392,(j=i,i=i+1|0,i=i+7>>3<<3,c[j>>2]=0,j)|0)|0;i=j}cJ(a,-2);dv(a,-2)|0;cG(a,-2);if((f|0)<2){k=0;i=b;return k|0}else{m=2}while(1){cJ(a,m);cJ(a,-2);dw(a,1,0);j=m+1|0;if((j|0)>(f|0)){k=0;break}else{m=j}}i=b;return k|0}function jK(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;d=gE(a,1,0)|0;cG(a,1);df(a,-1e4,9760);df(a,2,d);if((cX(a,-1)|0)!=0){if((cZ(a,-1)|0)!=10480){i=b;return 1}gz(a,8880,(e=i,i=i+8|0,c[e>>2]=d,e)|0)|0;i=e;i=b;return 1}df(a,-10001,5608);if((cK(a,-1)|0)!=5){gz(a,8704,(e=i,i=i+1|0,i=i+7>>3<<3,c[e>>2]=0,e)|0)|0;i=e}c9(a,10552,0);f=1;while(1){dh(a,-2,f);if((cK(a,-1)|0)==0){g=c0(a,-2,0)|0;gz(a,8312,(e=i,i=i+16|0,c[e>>2]=d,c[e+8>>2]=g,e)|0)|0;i=e}da(a,d);dw(a,1,1);if((cK(a,-1)|0)==6){break}if((cQ(a,-1)|0)==0){cG(a,-2)}else{dG(a,2)}f=f+1|0}c7(a,10480);dm(a,2,d);da(a,d);dw(a,1,1);if((cK(a,-1)|0)!=0){dm(a,2,d)}df(a,2,d);if((cZ(a,-1)|0)!=10480){i=b;return 1}c6(a,1);cJ(a,-1);dm(a,2,d);i=b;return 1}function jL(a){a=a|0;var b=0,d=0,e=0;b=i;d=gE(a,1,0)|0;df(a,-10001,9344);if((cK(a,-1)|0)!=5){gz(a,4384,(e=i,i=i+1|0,i=i+7>>3<<3,c[e>>2]=0,e)|0)|0;i=e}df(a,-1,d);if((cK(a,-1)|0)!=0){i=b;return 1}dc(a,4272,(e=i,i=i+8|0,c[e>>2]=d,e)|0)|0;i=e;i=b;return 1}function jM(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;d=jP(a,gE(a,1,0)|0,4376)|0;if((d|0)==0){i=b;return 1}if((g0(a,d)|0)==0){i=b;return 1}e=c0(a,1,0)|0;f=c0(a,-1,0)|0;gz(a,6240,(a=i,i=i+24|0,c[a>>2]=e,c[a+8>>2]=d,c[a+16>>2]=f,a)|0)|0;i=a;i=b;return 1}function jN(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;d=gE(a,1,0)|0;e=jP(a,d,2680)|0;if((e|0)==0){i=b;return 1}f=aU(d|0,45)|0;g=gT(a,(f|0)==0?d:f+1|0,5496,5352)|0;dc(a,5256,(f=i,i=i+8|0,c[f>>2]=g,f)|0)|0;i=f;cH(a,-2);if((jQ(a,e)|0)==0){i=b;return 1}g=c0(a,1,0)|0;d=c0(a,-1,0)|0;gz(a,6240,(f=i,i=i+24|0,c[f>>2]=g,c[f+8>>2]=e,c[f+16>>2]=d,f)|0)|0;i=f;i=b;return 1}function jO(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;d=gE(a,1,0)|0;e=aU(d|0,46)|0;if((e|0)==0){f=0;i=b;return f|0}c9(a,d,e-d|0);e=jP(a,c0(a,-1,0)|0,2680)|0;if((e|0)==0){f=1;i=b;return f|0}g=aU(d|0,45)|0;h=gT(a,(g|0)==0?d:g+1|0,5496,5352)|0;dc(a,5256,(g=i,i=i+8|0,c[g>>2]=h,g)|0)|0;i=g;cH(a,-2);h=jQ(a,e)|0;if((h|0)==0){f=1;i=b;return f|0}else if((h|0)!=2){h=c0(a,1,0)|0;j=c0(a,-1,0)|0;gz(a,6240,(g=i,i=i+24|0,c[g>>2]=h,c[g+8>>2]=e,c[g+16>>2]=j,g)|0)|0;i=g}dc(a,6440,(g=i,i=i+16|0,c[g>>2]=d,c[g+8>>2]=e,g)|0)|0;i=g;f=1;i=b;return f|0}function jP(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;g=gT(b,d,5496,5168)|0;df(b,-10001,e);d=c0(b,-1,0)|0;if((d|0)==0){gz(b,5008,(h=i,i=i+8|0,c[h>>2]=e,h)|0)|0;i=h}c9(b,10552,0);e=d;while(1){d=a[e]|0;if((d<<24>>24|0)==0){j=0;k=3034;break}else if((d<<24>>24|0)==59){e=e+1|0;continue}d=aU(e|0,59)|0;if((d|0)==0){l=e+(j_(e|0)|0)|0}else{l=d}c9(b,e,l-e|0);if((l|0)==0){j=0;k=3033;break}m=gT(b,c0(b,-1,0)|0,4880,g)|0;cH(b,-2);n=bl(m|0,4600|0)|0;if((n|0)!=0){k=3029;break}dc(b,4720,(h=i,i=i+8|0,c[h>>2]=m,h)|0)|0;i=h;cH(b,-2);dG(b,2);e=l}if((k|0)==3029){ar(n|0)|0;j=m;i=f;return j|0}else if((k|0)==3033){i=f;return j|0}else if((k|0)==3034){i=f;return j|0}return 0}function jQ(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;dc(a,5792,(e=i,i=i+16|0,c[e>>2]=5720,c[e+8>>2]=b,e)|0)|0;i=e;de(a,-1e4);if((cK(a,-1)|0)==0){cG(a,-2);f=dH(a,4)|0;c[f>>2]=0;df(a,-1e4,3592);dq(a,-2)|0;dc(a,5792,(e=i,i=i+16|0,c[e>>2]=5720,c[e+8>>2]=b,e)|0)|0;i=e;cJ(a,-2);dl(a,-1e4);g=f}else{g=cZ(a,-1)|0}f=(c[g>>2]|0)==0;c9(a,6e3,58);if(!f){h=2;i=d;return h|0}c[g>>2]=0;h=1;i=d;return h|0}function jR(a){a=a|0;var b=0,c=0,d=0;b=gE(a,1,0)|0;gE(a,2,0)|0;c=jQ(a,b)|0;if((c|0)==0){d=1;return d|0}c3(a);cI(a,-2);da(a,(c|0)==1?4072:4024);d=3;return d|0}function jS(a){a=a|0;gI(a,1,5);if((dj(a,1)|0)==0){di(a,0,1);cJ(a,-1);dq(a,1)|0}cJ(a,-10002);dm(a,-2,4136);return 0}function jT(a){a=a|0;dd(a,504,0);da(a,10528);dw(a,1,0);dd(a,398,0);da(a,9080);dw(a,1,0);dd(a,350,0);da(a,7064);dw(a,1,0);dd(a,282,0);da(a,5552);dw(a,1,0);dd(a,356,0);da(a,4312);dw(a,1,0);dd(a,324,0);da(a,3744);dw(a,1,0);dd(a,296,0);da(a,3040);dw(a,1,0);dd(a,412,0);da(a,2672);dw(a,1,0);return}function jU(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0;do{if(a>>>0<245){if(a>>>0<11){b=16}else{b=a+11&-8}d=b>>>3;e=c[2648]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=10632+(h<<2)|0;j=10632+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[2648]=e&~(1<<g)}else{if(l>>>0<(c[2652]|0)>>>0){bM();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{bM();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(b>>>0<=(c[2650]|0)>>>0){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=10632+(p<<2)|0;m=10632+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[2648]=e&~(1<<r)}else{if(l>>>0<(c[2652]|0)>>>0){bM();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{bM();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[2650]|0;if((l|0)!=0){q=c[2653]|0;d=l>>>3;l=d<<1;f=10632+(l<<2)|0;k=c[2648]|0;h=1<<d;do{if((k&h|0)==0){c[2648]=k|h;s=f;t=10632+(l+2<<2)|0}else{d=10632+(l+2<<2)|0;g=c[d>>2]|0;if(g>>>0>=(c[2652]|0)>>>0){s=g;t=d;break}bM();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[2650]=m;c[2653]=e;n=i;return n|0}l=c[2649]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[10896+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[2652]|0;if(r>>>0<i>>>0){bM();return 0}e=r+b|0;m=e;if(r>>>0>=e>>>0){bM();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break}else{w=l;x=k}}else{w=g;x=q}while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){bM();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){bM();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){bM();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{bM();return 0}}}while(0);L4106:do{if((e|0)!=0){f=d+28|0;i=10896+(c[f>>2]<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[2649]=c[2649]&~(1<<c[f>>2]);break L4106}else{if(e>>>0<(c[2652]|0)>>>0){bM();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break L4106}}}while(0);if(v>>>0<(c[2652]|0)>>>0){bM();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b)>>2]=p;f=c[2650]|0;if((f|0)!=0){e=c[2653]|0;i=f>>>3;f=i<<1;q=10632+(f<<2)|0;k=c[2648]|0;g=1<<i;do{if((k&g|0)==0){c[2648]=k|g;y=q;z=10632+(f+2<<2)|0}else{i=10632+(f+2<<2)|0;l=c[i>>2]|0;if(l>>>0>=(c[2652]|0)>>>0){y=l;z=i;break}bM();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[2650]=p;c[2653]=m}f=d+8|0;if((f|0)==0){o=b;break}else{n=f}return n|0}else{if(a>>>0>4294967231){o=-1;break}f=a+11|0;g=f&-8;k=c[2649]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=14-(h|f|l)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[10896+(A<<2)>>2]|0;L3914:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break L3914}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[10896+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break}else{p=r;m=i;q=e}}}if((K|0)==0){o=g;break}if(J>>>0>=((c[2650]|0)-g|0)>>>0){o=g;break}q=K;m=c[2652]|0;if(q>>>0<m>>>0){bM();return 0}p=q+g|0;k=p;if(q>>>0>=p>>>0){bM();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break}else{M=B;N=j}}else{M=d;N=r}while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<m>>>0){bM();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<m>>>0){bM();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){bM();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{bM();return 0}}}while(0);L3964:do{if((e|0)!=0){i=K+28|0;m=10896+(c[i>>2]<<2)|0;do{if((K|0)==(c[m>>2]|0)){c[m>>2]=L;if((L|0)!=0){break}c[2649]=c[2649]&~(1<<c[i>>2]);break L3964}else{if(e>>>0<(c[2652]|0)>>>0){bM();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break L3964}}}while(0);if(L>>>0<(c[2652]|0)>>>0){bM();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);do{if(J>>>0<16){e=J+g|0;c[K+4>>2]=e|3;i=q+(e+4)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[q+(g|4)>>2]=J|1;c[q+(J+g)>>2]=J;i=J>>>3;if(J>>>0<256){e=i<<1;m=10632+(e<<2)|0;r=c[2648]|0;j=1<<i;do{if((r&j|0)==0){c[2648]=r|j;O=m;P=10632+(e+2<<2)|0}else{i=10632+(e+2<<2)|0;d=c[i>>2]|0;if(d>>>0>=(c[2652]|0)>>>0){O=d;P=i;break}bM();return 0}}while(0);c[P>>2]=k;c[O+12>>2]=k;c[q+(g+8)>>2]=O;c[q+(g+12)>>2]=m;break}e=p;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=14-(d|r|i)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=10896+(Q<<2)|0;c[q+(g+28)>>2]=Q;c[q+(g+20)>>2]=0;c[q+(g+16)>>2]=0;m=c[2649]|0;l=1<<Q;if((m&l|0)==0){c[2649]=m|l;c[j>>2]=e;c[q+(g+24)>>2]=j;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}l=J<<R;m=c[j>>2]|0;while(1){if((c[m+4>>2]&-8|0)==(J|0)){break}S=m+16+(l>>>31<<2)|0;j=c[S>>2]|0;if((j|0)==0){T=3202;break}else{l=l<<1;m=j}}if((T|0)==3202){if(S>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[S>>2]=e;c[q+(g+24)>>2]=m;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}}l=m+8|0;j=c[l>>2]|0;i=c[2652]|0;if(m>>>0<i>>>0){bM();return 0}if(j>>>0<i>>>0){bM();return 0}else{c[j+12>>2]=e;c[l>>2]=e;c[q+(g+8)>>2]=j;c[q+(g+12)>>2]=m;c[q+(g+24)>>2]=0;break}}}while(0);q=K+8|0;if((q|0)==0){o=g;break}else{n=q}return n|0}}while(0);K=c[2650]|0;if(o>>>0<=K>>>0){S=K-o|0;J=c[2653]|0;if(S>>>0>15){R=J;c[2653]=R+o;c[2650]=S;c[R+(o+4)>>2]=S|1;c[R+K>>2]=S;c[J+4>>2]=o|3}else{c[2650]=0;c[2653]=0;c[J+4>>2]=K|3;S=J+(K+4)|0;c[S>>2]=c[S>>2]|1}n=J+8|0;return n|0}J=c[2651]|0;if(o>>>0<J>>>0){S=J-o|0;c[2651]=S;J=c[2654]|0;K=J;c[2654]=K+o;c[K+(o+4)>>2]=S|1;c[J+4>>2]=o|3;n=J+8|0;return n|0}do{if((c[2622]|0)==0){J=bK(8)|0;if((J-1&J|0)==0){c[2624]=J;c[2623]=J;c[2625]=-1;c[2626]=-1;c[2627]=0;c[2759]=0;c[2622]=(cb(0)|0)&-16^1431655768;break}else{bM();return 0}}}while(0);J=o+48|0;S=c[2624]|0;K=o+47|0;R=S+K|0;Q=-S|0;S=R&Q;if(S>>>0<=o>>>0){n=0;return n|0}O=c[2758]|0;do{if((O|0)!=0){P=c[2756]|0;L=P+S|0;if(L>>>0<=P>>>0|L>>>0>O>>>0){n=0}else{break}return n|0}}while(0);L4173:do{if((c[2759]&4|0)==0){O=c[2654]|0;L4175:do{if((O|0)==0){T=3232}else{L=O;P=11040;while(1){U=P|0;M=c[U>>2]|0;if(M>>>0<=L>>>0){V=P+4|0;if((M+(c[V>>2]|0)|0)>>>0>L>>>0){break}}M=c[P+8>>2]|0;if((M|0)==0){T=3232;break L4175}else{P=M}}if((P|0)==0){T=3232;break}L=R-(c[2651]|0)&Q;if(L>>>0>=2147483647){W=0;break}m=bB(L|0)|0;e=(m|0)==((c[U>>2]|0)+(c[V>>2]|0)|0);X=e?m:-1;Y=e?L:0;Z=m;_=L;T=3241}}while(0);do{if((T|0)==3232){O=bB(0)|0;if((O|0)==-1){W=0;break}g=O;L=c[2623]|0;m=L-1|0;if((m&g|0)==0){$=S}else{$=S-g+(m+g&-L)|0}L=c[2756]|0;g=L+$|0;if(!($>>>0>o>>>0&$>>>0<2147483647)){W=0;break}m=c[2758]|0;if((m|0)!=0){if(g>>>0<=L>>>0|g>>>0>m>>>0){W=0;break}}m=bB($|0)|0;g=(m|0)==(O|0);X=g?O:-1;Y=g?$:0;Z=m;_=$;T=3241}}while(0);L4195:do{if((T|0)==3241){m=-_|0;if((X|0)!=-1){aa=Y;ab=X;T=3252;break L4173}do{if((Z|0)!=-1&_>>>0<2147483647&_>>>0<J>>>0){g=c[2624]|0;O=K-_+g&-g;if(O>>>0>=2147483647){ac=_;break}if((bB(O|0)|0)==-1){bB(m|0)|0;W=Y;break L4195}else{ac=O+_|0;break}}else{ac=_}}while(0);if((Z|0)==-1){W=Y}else{aa=ac;ab=Z;T=3252;break L4173}}}while(0);c[2759]=c[2759]|4;ad=W;T=3249}else{ad=0;T=3249}}while(0);do{if((T|0)==3249){if(S>>>0>=2147483647){break}W=bB(S|0)|0;Z=bB(0)|0;if(!((Z|0)!=-1&(W|0)!=-1&W>>>0<Z>>>0)){break}ac=Z-W|0;Z=ac>>>0>(o+40|0)>>>0;Y=Z?W:-1;if((Y|0)!=-1){aa=Z?ac:ad;ab=Y;T=3252}}}while(0);do{if((T|0)==3252){ad=(c[2756]|0)+aa|0;c[2756]=ad;if(ad>>>0>(c[2757]|0)>>>0){c[2757]=ad}ad=c[2654]|0;L4215:do{if((ad|0)==0){S=c[2652]|0;if((S|0)==0|ab>>>0<S>>>0){c[2652]=ab}c[2760]=ab;c[2761]=aa;c[2763]=0;c[2657]=c[2622];c[2656]=-1;S=0;do{Y=S<<1;ac=10632+(Y<<2)|0;c[10632+(Y+3<<2)>>2]=ac;c[10632+(Y+2<<2)>>2]=ac;S=S+1|0;}while(S>>>0<32);S=ab+8|0;if((S&7|0)==0){ae=0}else{ae=-S&7}S=aa-40-ae|0;c[2654]=ab+ae;c[2651]=S;c[ab+(ae+4)>>2]=S|1;c[ab+(aa-36)>>2]=40;c[2655]=c[2626]}else{S=11040;while(1){af=c[S>>2]|0;ag=S+4|0;ah=c[ag>>2]|0;if((ab|0)==(af+ah|0)){T=3264;break}ac=c[S+8>>2]|0;if((ac|0)==0){break}else{S=ac}}do{if((T|0)==3264){if((c[S+12>>2]&8|0)!=0){break}ac=ad;if(!(ac>>>0>=af>>>0&ac>>>0<ab>>>0)){break}c[ag>>2]=ah+aa;ac=c[2654]|0;Y=(c[2651]|0)+aa|0;Z=ac;W=ac+8|0;if((W&7|0)==0){ai=0}else{ai=-W&7}W=Y-ai|0;c[2654]=Z+ai;c[2651]=W;c[Z+(ai+4)>>2]=W|1;c[Z+(Y+4)>>2]=40;c[2655]=c[2626];break L4215}}while(0);if(ab>>>0<(c[2652]|0)>>>0){c[2652]=ab}S=ab+aa|0;Y=11040;while(1){aj=Y|0;if((c[aj>>2]|0)==(S|0)){T=3274;break}Z=c[Y+8>>2]|0;if((Z|0)==0){break}else{Y=Z}}do{if((T|0)==3274){if((c[Y+12>>2]&8|0)!=0){break}c[aj>>2]=ab;S=Y+4|0;c[S>>2]=(c[S>>2]|0)+aa;S=ab+8|0;if((S&7|0)==0){ak=0}else{ak=-S&7}S=ab+(aa+8)|0;if((S&7|0)==0){al=0}else{al=-S&7}S=ab+(al+aa)|0;Z=S;W=ak+o|0;ac=ab+W|0;_=ac;K=S-(ab+ak)-o|0;c[ab+(ak+4)>>2]=o|3;do{if((Z|0)==(c[2654]|0)){J=(c[2651]|0)+K|0;c[2651]=J;c[2654]=_;c[ab+(W+4)>>2]=J|1}else{if((Z|0)==(c[2653]|0)){J=(c[2650]|0)+K|0;c[2650]=J;c[2653]=_;c[ab+(W+4)>>2]=J|1;c[ab+(J+W)>>2]=J;break}J=aa+4|0;X=c[ab+(J+al)>>2]|0;if((X&3|0)==1){$=X&-8;V=X>>>3;L4260:do{if(X>>>0<256){U=c[ab+((al|8)+aa)>>2]|0;Q=c[ab+(aa+12+al)>>2]|0;R=10632+(V<<1<<2)|0;do{if((U|0)!=(R|0)){if(U>>>0<(c[2652]|0)>>>0){bM();return 0}if((c[U+12>>2]|0)==(Z|0)){break}bM();return 0}}while(0);if((Q|0)==(U|0)){c[2648]=c[2648]&~(1<<V);break}do{if((Q|0)==(R|0)){am=Q+8|0}else{if(Q>>>0<(c[2652]|0)>>>0){bM();return 0}m=Q+8|0;if((c[m>>2]|0)==(Z|0)){am=m;break}bM();return 0}}while(0);c[U+12>>2]=Q;c[am>>2]=U}else{R=S;m=c[ab+((al|24)+aa)>>2]|0;P=c[ab+(aa+12+al)>>2]|0;do{if((P|0)==(R|0)){O=al|16;g=ab+(J+O)|0;L=c[g>>2]|0;if((L|0)==0){e=ab+(O+aa)|0;O=c[e>>2]|0;if((O|0)==0){an=0;break}else{ao=O;ap=e}}else{ao=L;ap=g}while(1){g=ao+20|0;L=c[g>>2]|0;if((L|0)!=0){ao=L;ap=g;continue}g=ao+16|0;L=c[g>>2]|0;if((L|0)==0){break}else{ao=L;ap=g}}if(ap>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[ap>>2]=0;an=ao;break}}else{g=c[ab+((al|8)+aa)>>2]|0;if(g>>>0<(c[2652]|0)>>>0){bM();return 0}L=g+12|0;if((c[L>>2]|0)!=(R|0)){bM();return 0}e=P+8|0;if((c[e>>2]|0)==(R|0)){c[L>>2]=P;c[e>>2]=g;an=P;break}else{bM();return 0}}}while(0);if((m|0)==0){break}P=ab+(aa+28+al)|0;U=10896+(c[P>>2]<<2)|0;do{if((R|0)==(c[U>>2]|0)){c[U>>2]=an;if((an|0)!=0){break}c[2649]=c[2649]&~(1<<c[P>>2]);break L4260}else{if(m>>>0<(c[2652]|0)>>>0){bM();return 0}Q=m+16|0;if((c[Q>>2]|0)==(R|0)){c[Q>>2]=an}else{c[m+20>>2]=an}if((an|0)==0){break L4260}}}while(0);if(an>>>0<(c[2652]|0)>>>0){bM();return 0}c[an+24>>2]=m;R=al|16;P=c[ab+(R+aa)>>2]|0;do{if((P|0)!=0){if(P>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[an+16>>2]=P;c[P+24>>2]=an;break}}}while(0);P=c[ab+(J+R)>>2]|0;if((P|0)==0){break}if(P>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[an+20>>2]=P;c[P+24>>2]=an;break}}}while(0);aq=ab+(($|al)+aa)|0;ar=$+K|0}else{aq=Z;ar=K}J=aq+4|0;c[J>>2]=c[J>>2]&-2;c[ab+(W+4)>>2]=ar|1;c[ab+(ar+W)>>2]=ar;J=ar>>>3;if(ar>>>0<256){V=J<<1;X=10632+(V<<2)|0;P=c[2648]|0;m=1<<J;do{if((P&m|0)==0){c[2648]=P|m;as=X;at=10632+(V+2<<2)|0}else{J=10632+(V+2<<2)|0;U=c[J>>2]|0;if(U>>>0>=(c[2652]|0)>>>0){as=U;at=J;break}bM();return 0}}while(0);c[at>>2]=_;c[as+12>>2]=_;c[ab+(W+8)>>2]=as;c[ab+(W+12)>>2]=X;break}V=ac;m=ar>>>8;do{if((m|0)==0){au=0}else{if(ar>>>0>16777215){au=31;break}P=(m+1048320|0)>>>16&8;$=m<<P;J=($+520192|0)>>>16&4;U=$<<J;$=(U+245760|0)>>>16&2;Q=14-(J|P|$)+(U<<$>>>15)|0;au=ar>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=10896+(au<<2)|0;c[ab+(W+28)>>2]=au;c[ab+(W+20)>>2]=0;c[ab+(W+16)>>2]=0;X=c[2649]|0;Q=1<<au;if((X&Q|0)==0){c[2649]=X|Q;c[m>>2]=V;c[ab+(W+24)>>2]=m;c[ab+(W+12)>>2]=V;c[ab+(W+8)>>2]=V;break}if((au|0)==31){av=0}else{av=25-(au>>>1)|0}Q=ar<<av;X=c[m>>2]|0;while(1){if((c[X+4>>2]&-8|0)==(ar|0)){break}aw=X+16+(Q>>>31<<2)|0;m=c[aw>>2]|0;if((m|0)==0){T=3347;break}else{Q=Q<<1;X=m}}if((T|0)==3347){if(aw>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[aw>>2]=V;c[ab+(W+24)>>2]=X;c[ab+(W+12)>>2]=V;c[ab+(W+8)>>2]=V;break}}Q=X+8|0;m=c[Q>>2]|0;$=c[2652]|0;if(X>>>0<$>>>0){bM();return 0}if(m>>>0<$>>>0){bM();return 0}else{c[m+12>>2]=V;c[Q>>2]=V;c[ab+(W+8)>>2]=m;c[ab+(W+12)>>2]=X;c[ab+(W+24)>>2]=0;break}}}while(0);n=ab+(ak|8)|0;return n|0}}while(0);Y=ad;W=11040;while(1){ax=c[W>>2]|0;if(ax>>>0<=Y>>>0){ay=c[W+4>>2]|0;az=ax+ay|0;if(az>>>0>Y>>>0){break}}W=c[W+8>>2]|0}W=ax+(ay-39)|0;if((W&7|0)==0){aA=0}else{aA=-W&7}W=ax+(ay-47+aA)|0;ac=W>>>0<(ad+16|0)>>>0?Y:W;W=ac+8|0;_=ab+8|0;if((_&7|0)==0){aB=0}else{aB=-_&7}_=aa-40-aB|0;c[2654]=ab+aB;c[2651]=_;c[ab+(aB+4)>>2]=_|1;c[ab+(aa-36)>>2]=40;c[2655]=c[2626];c[ac+4>>2]=27;c[W>>2]=c[2760];c[W+4>>2]=c[11044>>2];c[W+8>>2]=c[11048>>2];c[W+12>>2]=c[11052>>2];c[2760]=ab;c[2761]=aa;c[2763]=0;c[2762]=W;W=ac+28|0;c[W>>2]=7;if((ac+32|0)>>>0<az>>>0){_=W;while(1){W=_+4|0;c[W>>2]=7;if((_+8|0)>>>0<az>>>0){_=W}else{break}}}if((ac|0)==(Y|0)){break}_=ac-ad|0;W=Y+(_+4)|0;c[W>>2]=c[W>>2]&-2;c[ad+4>>2]=_|1;c[Y+_>>2]=_;W=_>>>3;if(_>>>0<256){K=W<<1;Z=10632+(K<<2)|0;S=c[2648]|0;m=1<<W;do{if((S&m|0)==0){c[2648]=S|m;aC=Z;aD=10632+(K+2<<2)|0}else{W=10632+(K+2<<2)|0;Q=c[W>>2]|0;if(Q>>>0>=(c[2652]|0)>>>0){aC=Q;aD=W;break}bM();return 0}}while(0);c[aD>>2]=ad;c[aC+12>>2]=ad;c[ad+8>>2]=aC;c[ad+12>>2]=Z;break}K=ad;m=_>>>8;do{if((m|0)==0){aE=0}else{if(_>>>0>16777215){aE=31;break}S=(m+1048320|0)>>>16&8;Y=m<<S;ac=(Y+520192|0)>>>16&4;W=Y<<ac;Y=(W+245760|0)>>>16&2;Q=14-(ac|S|Y)+(W<<Y>>>15)|0;aE=_>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=10896+(aE<<2)|0;c[ad+28>>2]=aE;c[ad+20>>2]=0;c[ad+16>>2]=0;Z=c[2649]|0;Q=1<<aE;if((Z&Q|0)==0){c[2649]=Z|Q;c[m>>2]=K;c[ad+24>>2]=m;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}if((aE|0)==31){aF=0}else{aF=25-(aE>>>1)|0}Q=_<<aF;Z=c[m>>2]|0;while(1){if((c[Z+4>>2]&-8|0)==(_|0)){break}aG=Z+16+(Q>>>31<<2)|0;m=c[aG>>2]|0;if((m|0)==0){T=3382;break}else{Q=Q<<1;Z=m}}if((T|0)==3382){if(aG>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[aG>>2]=K;c[ad+24>>2]=Z;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}}Q=Z+8|0;_=c[Q>>2]|0;m=c[2652]|0;if(Z>>>0<m>>>0){bM();return 0}if(_>>>0<m>>>0){bM();return 0}else{c[_+12>>2]=K;c[Q>>2]=K;c[ad+8>>2]=_;c[ad+12>>2]=Z;c[ad+24>>2]=0;break}}}while(0);ad=c[2651]|0;if(ad>>>0<=o>>>0){break}_=ad-o|0;c[2651]=_;ad=c[2654]|0;Q=ad;c[2654]=Q+o;c[Q+(o+4)>>2]=_|1;c[ad+4>>2]=o|3;n=ad+8|0;return n|0}}while(0);c[(bE()|0)>>2]=12;n=0;return n|0}function jV(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[2652]|0;if(b>>>0<e>>>0){bM()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){bM()}h=f&-8;i=a+(h-8)|0;j=i;L10:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){bM()}if((n|0)==(c[2653]|0)){p=a+(h-4)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[2650]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256){k=c[a+(l+8)>>2]|0;s=c[a+(l+12)>>2]|0;t=10632+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){bM()}if((c[k+12>>2]|0)==(n|0)){break}bM()}}while(0);if((s|0)==(k|0)){c[2648]=c[2648]&~(1<<p);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){bM()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}bM()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24)>>2]|0;v=c[a+(l+12)>>2]|0;do{if((v|0)==(t|0)){w=a+(l+20)|0;x=c[w>>2]|0;if((x|0)==0){y=a+(l+16)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break}else{B=z;C=y}}else{B=x;C=w}while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){bM()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8)>>2]|0;if(w>>>0<e>>>0){bM()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){bM()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{bM()}}}while(0);if((p|0)==0){q=n;r=o;break}v=a+(l+28)|0;m=10896+(c[v>>2]<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[2649]=c[2649]&~(1<<c[v>>2]);q=n;r=o;break L10}else{if(p>>>0<(c[2652]|0)>>>0){bM()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break L10}}}while(0);if(A>>>0<(c[2652]|0)>>>0){bM()}c[A+24>>2]=p;t=c[a+(l+16)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[2652]|0)>>>0){bM()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[2652]|0)>>>0){bM()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(d>>>0>=i>>>0){bM()}A=a+(h-4)|0;e=c[A>>2]|0;if((e&1|0)==0){bM()}do{if((e&2|0)==0){if((j|0)==(c[2654]|0)){B=(c[2651]|0)+r|0;c[2651]=B;c[2654]=q;c[q+4>>2]=B|1;if((q|0)!=(c[2653]|0)){return}c[2653]=0;c[2650]=0;return}if((j|0)==(c[2653]|0)){B=(c[2650]|0)+r|0;c[2650]=B;c[2653]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;L112:do{if(e>>>0<256){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=10632+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[2652]|0)>>>0){bM()}if((c[u+12>>2]|0)==(j|0)){break}bM()}}while(0);if((g|0)==(u|0)){c[2648]=c[2648]&~(1<<C);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[2652]|0)>>>0){bM()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}bM()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16)>>2]|0;t=c[a+(h|4)>>2]|0;do{if((t|0)==(b|0)){p=a+(h+12)|0;v=c[p>>2]|0;if((v|0)==0){m=a+(h+8)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break}else{F=k;G=m}}else{F=v;G=p}while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[2652]|0)>>>0){bM()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[2652]|0)>>>0){bM()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){bM()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{bM()}}}while(0);if((f|0)==0){break}t=a+(h+20)|0;u=10896+(c[t>>2]<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[2649]=c[2649]&~(1<<c[t>>2]);break L112}else{if(f>>>0<(c[2652]|0)>>>0){bM()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break L112}}}while(0);if(E>>>0<(c[2652]|0)>>>0){bM()}c[E+24>>2]=f;b=c[a+(h+8)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[2652]|0)>>>0){bM()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[2652]|0)>>>0){bM()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[2653]|0)){H=B;break}c[2650]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256){d=r<<1;e=10632+(d<<2)|0;A=c[2648]|0;E=1<<r;do{if((A&E|0)==0){c[2648]=A|E;I=e;J=10632+(d+2<<2)|0}else{r=10632+(d+2<<2)|0;h=c[r>>2]|0;if(h>>>0>=(c[2652]|0)>>>0){I=h;J=r;break}bM()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=14-(E|J|d)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=10896+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[2649]|0;d=1<<K;do{if((r&d|0)==0){c[2649]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{if((K|0)==31){L=0}else{L=25-(K>>>1)|0}A=H<<L;J=c[I>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(H|0)){break}M=J+16+(A>>>31<<2)|0;E=c[M>>2]|0;if((E|0)==0){N=129;break}else{A=A<<1;J=E}}if((N|0)==129){if(M>>>0<(c[2652]|0)>>>0){bM()}else{c[M>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break}}A=J+8|0;B=c[A>>2]|0;E=c[2652]|0;if(J>>>0<E>>>0){bM()}if(B>>>0<E>>>0){bM()}else{c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=J;c[q+24>>2]=0;break}}}while(0);q=(c[2656]|0)-1|0;c[2656]=q;if((q|0)==0){O=11048}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[2656]=-1;return}function jW(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;if((a|0)==0){d=jU(b)|0;return d|0}if(b>>>0>4294967231){c[(bE()|0)>>2]=12;d=0;return d|0}if(b>>>0<11){e=16}else{e=b+11&-8}f=jX(a-8|0,e)|0;if((f|0)!=0){d=f+8|0;return d|0}f=jU(b)|0;if((f|0)==0){d=0;return d|0}e=c[a-4>>2]|0;g=(e&-8)-((e&3|0)==0?8:4)|0;e=g>>>0<b>>>0?g:b;j$(f|0,a|0,e)|0;jV(a);d=f;return d|0}function jX(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;d=a+4|0;e=c[d>>2]|0;f=e&-8;g=a;h=g+f|0;i=h;j=c[2652]|0;if(g>>>0<j>>>0){bM();return 0}k=e&3;if(!((k|0)!=1&g>>>0<h>>>0)){bM();return 0}l=g+(f|4)|0;m=c[l>>2]|0;if((m&1|0)==0){bM();return 0}if((k|0)==0){if(b>>>0<256){n=0;return n|0}do{if(f>>>0>=(b+4|0)>>>0){if((f-b|0)>>>0>c[2624]<<1>>>0){break}else{n=a}return n|0}}while(0);n=0;return n|0}if(f>>>0>=b>>>0){k=f-b|0;if(k>>>0<=15){n=a;return n|0}c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=k|3;c[l>>2]=c[l>>2]|1;jY(g+b|0,k);n=a;return n|0}if((i|0)==(c[2654]|0)){k=(c[2651]|0)+f|0;if(k>>>0<=b>>>0){n=0;return n|0}l=k-b|0;c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=l|1;c[2654]=g+b;c[2651]=l;n=a;return n|0}if((i|0)==(c[2653]|0)){l=(c[2650]|0)+f|0;if(l>>>0<b>>>0){n=0;return n|0}k=l-b|0;if(k>>>0>15){c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=k|1;c[g+l>>2]=k;o=g+(l+4)|0;c[o>>2]=c[o>>2]&-2;p=g+b|0;q=k}else{c[d>>2]=e&1|l|2;e=g+(l+4)|0;c[e>>2]=c[e>>2]|1;p=0;q=0}c[2650]=q;c[2653]=p;n=a;return n|0}if((m&2|0)!=0){n=0;return n|0}p=(m&-8)+f|0;if(p>>>0<b>>>0){n=0;return n|0}q=p-b|0;e=m>>>3;L299:do{if(m>>>0<256){l=c[g+(f+8)>>2]|0;k=c[g+(f+12)>>2]|0;o=10632+(e<<1<<2)|0;do{if((l|0)!=(o|0)){if(l>>>0<j>>>0){bM();return 0}if((c[l+12>>2]|0)==(i|0)){break}bM();return 0}}while(0);if((k|0)==(l|0)){c[2648]=c[2648]&~(1<<e);break}do{if((k|0)==(o|0)){r=k+8|0}else{if(k>>>0<j>>>0){bM();return 0}s=k+8|0;if((c[s>>2]|0)==(i|0)){r=s;break}bM();return 0}}while(0);c[l+12>>2]=k;c[r>>2]=l}else{o=h;s=c[g+(f+24)>>2]|0;t=c[g+(f+12)>>2]|0;do{if((t|0)==(o|0)){u=g+(f+20)|0;v=c[u>>2]|0;if((v|0)==0){w=g+(f+16)|0;x=c[w>>2]|0;if((x|0)==0){y=0;break}else{z=x;A=w}}else{z=v;A=u}while(1){u=z+20|0;v=c[u>>2]|0;if((v|0)!=0){z=v;A=u;continue}u=z+16|0;v=c[u>>2]|0;if((v|0)==0){break}else{z=v;A=u}}if(A>>>0<j>>>0){bM();return 0}else{c[A>>2]=0;y=z;break}}else{u=c[g+(f+8)>>2]|0;if(u>>>0<j>>>0){bM();return 0}v=u+12|0;if((c[v>>2]|0)!=(o|0)){bM();return 0}w=t+8|0;if((c[w>>2]|0)==(o|0)){c[v>>2]=t;c[w>>2]=u;y=t;break}else{bM();return 0}}}while(0);if((s|0)==0){break}t=g+(f+28)|0;l=10896+(c[t>>2]<<2)|0;do{if((o|0)==(c[l>>2]|0)){c[l>>2]=y;if((y|0)!=0){break}c[2649]=c[2649]&~(1<<c[t>>2]);break L299}else{if(s>>>0<(c[2652]|0)>>>0){bM();return 0}k=s+16|0;if((c[k>>2]|0)==(o|0)){c[k>>2]=y}else{c[s+20>>2]=y}if((y|0)==0){break L299}}}while(0);if(y>>>0<(c[2652]|0)>>>0){bM();return 0}c[y+24>>2]=s;o=c[g+(f+16)>>2]|0;do{if((o|0)!=0){if(o>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[y+16>>2]=o;c[o+24>>2]=y;break}}}while(0);o=c[g+(f+20)>>2]|0;if((o|0)==0){break}if(o>>>0<(c[2652]|0)>>>0){bM();return 0}else{c[y+20>>2]=o;c[o+24>>2]=y;break}}}while(0);if(q>>>0<16){c[d>>2]=p|c[d>>2]&1|2;y=g+(p|4)|0;c[y>>2]=c[y>>2]|1;n=a;return n|0}else{c[d>>2]=c[d>>2]&1|b|2;c[g+(b+4)>>2]=q|3;d=g+(p|4)|0;c[d>>2]=c[d>>2]|1;jY(g+b|0,q);n=a;return n|0}return 0}function jY(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;d=a;e=d+b|0;f=e;g=c[a+4>>2]|0;L375:do{if((g&1|0)==0){h=c[a>>2]|0;if((g&3|0)==0){return}i=d+(-h|0)|0;j=i;k=h+b|0;l=c[2652]|0;if(i>>>0<l>>>0){bM()}if((j|0)==(c[2653]|0)){m=d+(b+4)|0;if((c[m>>2]&3|0)!=3){n=j;o=k;break}c[2650]=k;c[m>>2]=c[m>>2]&-2;c[d+(4-h)>>2]=k|1;c[e>>2]=k;return}m=h>>>3;if(h>>>0<256){p=c[d+(8-h)>>2]|0;q=c[d+(12-h)>>2]|0;r=10632+(m<<1<<2)|0;do{if((p|0)!=(r|0)){if(p>>>0<l>>>0){bM()}if((c[p+12>>2]|0)==(j|0)){break}bM()}}while(0);if((q|0)==(p|0)){c[2648]=c[2648]&~(1<<m);n=j;o=k;break}do{if((q|0)==(r|0)){s=q+8|0}else{if(q>>>0<l>>>0){bM()}t=q+8|0;if((c[t>>2]|0)==(j|0)){s=t;break}bM()}}while(0);c[p+12>>2]=q;c[s>>2]=p;n=j;o=k;break}r=i;m=c[d+(24-h)>>2]|0;t=c[d+(12-h)>>2]|0;do{if((t|0)==(r|0)){u=16-h|0;v=d+(u+4)|0;w=c[v>>2]|0;if((w|0)==0){x=d+u|0;u=c[x>>2]|0;if((u|0)==0){y=0;break}else{z=u;A=x}}else{z=w;A=v}while(1){v=z+20|0;w=c[v>>2]|0;if((w|0)!=0){z=w;A=v;continue}v=z+16|0;w=c[v>>2]|0;if((w|0)==0){break}else{z=w;A=v}}if(A>>>0<l>>>0){bM()}else{c[A>>2]=0;y=z;break}}else{v=c[d+(8-h)>>2]|0;if(v>>>0<l>>>0){bM()}w=v+12|0;if((c[w>>2]|0)!=(r|0)){bM()}x=t+8|0;if((c[x>>2]|0)==(r|0)){c[w>>2]=t;c[x>>2]=v;y=t;break}else{bM()}}}while(0);if((m|0)==0){n=j;o=k;break}t=d+(28-h)|0;l=10896+(c[t>>2]<<2)|0;do{if((r|0)==(c[l>>2]|0)){c[l>>2]=y;if((y|0)!=0){break}c[2649]=c[2649]&~(1<<c[t>>2]);n=j;o=k;break L375}else{if(m>>>0<(c[2652]|0)>>>0){bM()}i=m+16|0;if((c[i>>2]|0)==(r|0)){c[i>>2]=y}else{c[m+20>>2]=y}if((y|0)==0){n=j;o=k;break L375}}}while(0);if(y>>>0<(c[2652]|0)>>>0){bM()}c[y+24>>2]=m;r=16-h|0;t=c[d+r>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[2652]|0)>>>0){bM()}else{c[y+16>>2]=t;c[t+24>>2]=y;break}}}while(0);t=c[d+(r+4)>>2]|0;if((t|0)==0){n=j;o=k;break}if(t>>>0<(c[2652]|0)>>>0){bM()}else{c[y+20>>2]=t;c[t+24>>2]=y;n=j;o=k;break}}else{n=a;o=b}}while(0);a=c[2652]|0;if(e>>>0<a>>>0){bM()}y=d+(b+4)|0;z=c[y>>2]|0;do{if((z&2|0)==0){if((f|0)==(c[2654]|0)){A=(c[2651]|0)+o|0;c[2651]=A;c[2654]=n;c[n+4>>2]=A|1;if((n|0)!=(c[2653]|0)){return}c[2653]=0;c[2650]=0;return}if((f|0)==(c[2653]|0)){A=(c[2650]|0)+o|0;c[2650]=A;c[2653]=n;c[n+4>>2]=A|1;c[n+A>>2]=A;return}A=(z&-8)+o|0;s=z>>>3;L474:do{if(z>>>0<256){g=c[d+(b+8)>>2]|0;t=c[d+(b+12)>>2]|0;h=10632+(s<<1<<2)|0;do{if((g|0)!=(h|0)){if(g>>>0<a>>>0){bM()}if((c[g+12>>2]|0)==(f|0)){break}bM()}}while(0);if((t|0)==(g|0)){c[2648]=c[2648]&~(1<<s);break}do{if((t|0)==(h|0)){B=t+8|0}else{if(t>>>0<a>>>0){bM()}m=t+8|0;if((c[m>>2]|0)==(f|0)){B=m;break}bM()}}while(0);c[g+12>>2]=t;c[B>>2]=g}else{h=e;m=c[d+(b+24)>>2]|0;l=c[d+(b+12)>>2]|0;do{if((l|0)==(h|0)){i=d+(b+20)|0;p=c[i>>2]|0;if((p|0)==0){q=d+(b+16)|0;v=c[q>>2]|0;if((v|0)==0){C=0;break}else{D=v;E=q}}else{D=p;E=i}while(1){i=D+20|0;p=c[i>>2]|0;if((p|0)!=0){D=p;E=i;continue}i=D+16|0;p=c[i>>2]|0;if((p|0)==0){break}else{D=p;E=i}}if(E>>>0<a>>>0){bM()}else{c[E>>2]=0;C=D;break}}else{i=c[d+(b+8)>>2]|0;if(i>>>0<a>>>0){bM()}p=i+12|0;if((c[p>>2]|0)!=(h|0)){bM()}q=l+8|0;if((c[q>>2]|0)==(h|0)){c[p>>2]=l;c[q>>2]=i;C=l;break}else{bM()}}}while(0);if((m|0)==0){break}l=d+(b+28)|0;g=10896+(c[l>>2]<<2)|0;do{if((h|0)==(c[g>>2]|0)){c[g>>2]=C;if((C|0)!=0){break}c[2649]=c[2649]&~(1<<c[l>>2]);break L474}else{if(m>>>0<(c[2652]|0)>>>0){bM()}t=m+16|0;if((c[t>>2]|0)==(h|0)){c[t>>2]=C}else{c[m+20>>2]=C}if((C|0)==0){break L474}}}while(0);if(C>>>0<(c[2652]|0)>>>0){bM()}c[C+24>>2]=m;h=c[d+(b+16)>>2]|0;do{if((h|0)!=0){if(h>>>0<(c[2652]|0)>>>0){bM()}else{c[C+16>>2]=h;c[h+24>>2]=C;break}}}while(0);h=c[d+(b+20)>>2]|0;if((h|0)==0){break}if(h>>>0<(c[2652]|0)>>>0){bM()}else{c[C+20>>2]=h;c[h+24>>2]=C;break}}}while(0);c[n+4>>2]=A|1;c[n+A>>2]=A;if((n|0)!=(c[2653]|0)){F=A;break}c[2650]=A;return}else{c[y>>2]=z&-2;c[n+4>>2]=o|1;c[n+o>>2]=o;F=o}}while(0);o=F>>>3;if(F>>>0<256){z=o<<1;y=10632+(z<<2)|0;C=c[2648]|0;b=1<<o;do{if((C&b|0)==0){c[2648]=C|b;G=y;H=10632+(z+2<<2)|0}else{o=10632+(z+2<<2)|0;d=c[o>>2]|0;if(d>>>0>=(c[2652]|0)>>>0){G=d;H=o;break}bM()}}while(0);c[H>>2]=n;c[G+12>>2]=n;c[n+8>>2]=G;c[n+12>>2]=y;return}y=n;G=F>>>8;do{if((G|0)==0){I=0}else{if(F>>>0>16777215){I=31;break}H=(G+1048320|0)>>>16&8;z=G<<H;b=(z+520192|0)>>>16&4;C=z<<b;z=(C+245760|0)>>>16&2;o=14-(b|H|z)+(C<<z>>>15)|0;I=F>>>((o+7|0)>>>0)&1|o<<1}}while(0);G=10896+(I<<2)|0;c[n+28>>2]=I;c[n+20>>2]=0;c[n+16>>2]=0;o=c[2649]|0;z=1<<I;if((o&z|0)==0){c[2649]=o|z;c[G>>2]=y;c[n+24>>2]=G;c[n+12>>2]=n;c[n+8>>2]=n;return}if((I|0)==31){J=0}else{J=25-(I>>>1)|0}I=F<<J;J=c[G>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(F|0)){break}K=J+16+(I>>>31<<2)|0;G=c[K>>2]|0;if((G|0)==0){L=409;break}else{I=I<<1;J=G}}if((L|0)==409){if(K>>>0<(c[2652]|0)>>>0){bM()}c[K>>2]=y;c[n+24>>2]=J;c[n+12>>2]=n;c[n+8>>2]=n;return}K=J+8|0;L=c[K>>2]|0;I=c[2652]|0;if(J>>>0<I>>>0){bM()}if(L>>>0<I>>>0){bM()}c[L+12>>2]=y;c[K>>2]=y;c[n+8>>2]=L;c[n+12>>2]=J;c[n+24>>2]=0;return}function jZ(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0.0,r=0,s=0,t=0,u=0,v=0.0,w=0,x=0,y=0,z=0.0,A=0.0,B=0,C=0,D=0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0.0,O=0,P=0,Q=0.0,R=0.0,S=0.0;e=b;while(1){f=e+1|0;if((aB(a[e]|0)|0)==0){break}else{e=f}}g=a[e]|0;if((g<<24>>24|0)==43){i=f;j=0}else if((g<<24>>24|0)==45){i=f;j=1}else{i=e;j=0}e=-1;f=0;g=i;while(1){k=a[g]|0;if(((k<<24>>24)-48|0)>>>0<10){l=e}else{if(k<<24>>24!=46|(e|0)>-1){break}else{l=f}}e=l;f=f+1|0;g=g+1|0}l=g+(-f|0)|0;i=(e|0)<0;m=((i^1)<<31>>31)+f|0;n=(m|0)>18;o=(n?-18:-m|0)+(i?f:e)|0;e=n?18:m;do{if((e|0)==0){p=b;q=0.0}else{if((e|0)>9){m=l;n=e;f=0;while(1){i=a[m]|0;r=m+1|0;if(i<<24>>24==46){s=a[r]|0;t=m+2|0}else{s=i;t=r}u=(f*10|0)-48+(s<<24>>24)|0;r=n-1|0;if((r|0)>9){m=t;n=r;f=u}else{break}}v=+(u|0)*1.0e9;w=9;x=t;y=457}else{if((e|0)>0){v=0.0;w=e;x=l;y=457}else{z=0.0;A=0.0}}if((y|0)==457){f=x;n=w;m=0;while(1){r=a[f]|0;i=f+1|0;if(r<<24>>24==46){B=a[i]|0;C=f+2|0}else{B=r;C=i}D=(m*10|0)-48+(B<<24>>24)|0;i=n-1|0;if((i|0)>0){f=C;n=i;m=D}else{break}}z=+(D|0);A=v}E=A+z;do{if((k<<24>>24|0)==69|(k<<24>>24|0)==101){m=g+1|0;n=a[m]|0;if((n<<24>>24|0)==45){F=g+2|0;G=1}else if((n<<24>>24|0)==43){F=g+2|0;G=0}else{F=m;G=0}m=a[F]|0;if(((m<<24>>24)-48|0)>>>0<10){H=F;I=0;J=m}else{K=0;L=F;M=G;break}while(1){m=(I*10|0)-48+(J<<24>>24)|0;n=H+1|0;f=a[n]|0;if(((f<<24>>24)-48|0)>>>0<10){H=n;I=m;J=f}else{K=m;L=n;M=G;break}}}else{K=0;L=g;M=0}}while(0);n=o+((M|0)==0?K:-K|0)|0;m=(n|0)<0?-n|0:n;if((m|0)>511){c[(bE()|0)>>2]=34;N=1.0;O=360;P=511;y=474}else{if((m|0)==0){Q=1.0}else{N=1.0;O=360;P=m;y=474}}if((y|0)==474){while(1){y=0;if((P&1|0)==0){R=N}else{R=N*+h[O>>3]}m=P>>1;if((m|0)==0){Q=R;break}else{N=R;O=O+8|0;P=m;y=474}}}if((n|0)>-1){p=L;q=E*Q;break}else{p=L;q=E/Q;break}}}while(0);if((d|0)!=0){c[d>>2]=p}if((j|0)==0){S=q;return+S}S=-0.0-q;return+S}function j_(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function j$(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function j0(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;t=t+1|0;c[a>>2]=t;while((e|0)<40){if((c[d+(e<<2)>>2]|0)==0){c[d+(e<<2)>>2]=t;c[d+((e<<2)+4)>>2]=b;c[d+((e<<2)+8)>>2]=0;return 0}e=e+2|0}ba(116);ba(111);ba(111);ba(32);ba(109);ba(97);ba(110);ba(121);ba(32);ba(115);ba(101);ba(116);ba(106);ba(109);ba(112);ba(115);ba(32);ba(105);ba(110);ba(32);ba(97);ba(32);ba(102);ba(117);ba(110);ba(99);ba(116);ba(105);ba(111);ba(110);ba(32);ba(99);ba(97);ba(108);ba(108);ba(44);ba(32);ba(98);ba(117);ba(105);ba(108);ba(100);ba(32);ba(119);ba(105);ba(116);ba(104);ba(32);ba(97);ba(32);ba(104);ba(105);ba(103);ba(104);ba(101);ba(114);ba(32);ba(118);ba(97);ba(108);ba(117);ba(101);ba(32);ba(102);ba(111);ba(114);ba(32);ba(77);ba(65);ba(88);ba(95);ba(83);ba(69);ba(84);ba(74);ba(77);ba(80);ba(83);ba(10);ab(0);return 0}function j1(a,b){a=a|0;b=b|0;var d=0,e=0;while((d|0)<20){e=c[b+(d<<2)>>2]|0;if((e|0)==0)break;if((e|0)==(a|0)){return c[b+((d<<2)+4)>>2]|0}d=d+2|0}return 0}function j2(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=b+e|0;if((e|0)>=20){d=d&255;e=b&3;g=d|d<<8|d<<16|d<<24;h=f&~3;if(e){e=b+4-e|0;while((b|0)<(e|0)){a[b]=d;b=b+1|0}}while((b|0)<(h|0)){c[b>>2]=g;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}}function j3(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0;while((e|0)<(d|0)){a[b+e|0]=f?0:a[c+e|0]|0;f=f?1:(a[c+e|0]|0)==0;e=e+1|0}return b|0}function j4(b,c){b=b|0;c=c|0;var d=0,e=0;d=b+(j_(b)|0)|0;do{a[d+e|0]=a[c+e|0];e=e+1|0}while(a[c+(e-1)|0]|0);return b|0}function j5(a,b,c){a=a|0;b=b|0;c=c|0;var e=0,f=0,g=0;while((e|0)<(c|0)){f=d[a+e|0]|0;g=d[b+e|0]|0;if((f|0)!=(g|0))return((f|0)>(g|0)?1:-1)|0;e=e+1|0}return 0}function j6(a){a=a|0;if((a|0)<65)return a|0;if((a|0)>90)return a|0;return a-65+97|0}function j7(a,b){a=a|0;b=b|0;return cd[a&1023](b|0)|0}function j8(a){a=a|0;return ag(0,a|0)|0}function j9(a){a=a|0;return ag(1,a|0)|0}function ka(a){a=a|0;return ag(2,a|0)|0}function kb(a){a=a|0;return ag(3,a|0)|0}function kc(a){a=a|0;return ag(4,a|0)|0}function kd(a){a=a|0;return ag(5,a|0)|0}function ke(a){a=a|0;return ag(6,a|0)|0}function kf(a){a=a|0;return ag(7,a|0)|0}function kg(a){a=a|0;return ag(8,a|0)|0}function kh(a){a=a|0;return ag(9,a|0)|0}function ki(a){a=a|0;return ag(10,a|0)|0}function kj(a){a=a|0;return ag(11,a|0)|0}function kk(a){a=a|0;return ag(12,a|0)|0}function kl(a){a=a|0;return ag(13,a|0)|0}function km(a){a=a|0;return ag(14,a|0)|0}function kn(a){a=a|0;return ag(15,a|0)|0}function ko(a){a=a|0;return ag(16,a|0)|0}function kp(a){a=a|0;return ag(17,a|0)|0}function kq(a){a=a|0;return ag(18,a|0)|0}function kr(a){a=a|0;return ag(19,a|0)|0}function ks(a){a=a|0;return ag(20,a|0)|0}function kt(a){a=a|0;return ag(21,a|0)|0}function ku(a){a=a|0;return ag(22,a|0)|0}function kv(a){a=a|0;return ag(23,a|0)|0}function kw(a){a=a|0;return ag(24,a|0)|0}function kx(a){a=a|0;return ag(25,a|0)|0}function ky(a){a=a|0;return ag(26,a|0)|0}function kz(a){a=a|0;return ag(27,a|0)|0}function kA(a){a=a|0;return ag(28,a|0)|0}function kB(a){a=a|0;return ag(29,a|0)|0}function kC(a){a=a|0;return ag(30,a|0)|0}function kD(a){a=a|0;return ag(31,a|0)|0}function kE(a){a=a|0;return ag(32,a|0)|0}function kF(a){a=a|0;return ag(33,a|0)|0}function kG(a){a=a|0;return ag(34,a|0)|0}function kH(a){a=a|0;return ag(35,a|0)|0}function kI(a){a=a|0;return ag(36,a|0)|0}function kJ(a){a=a|0;return ag(37,a|0)|0}function kK(a){a=a|0;return ag(38,a|0)|0}function kL(a){a=a|0;return ag(39,a|0)|0}function kM(a){a=a|0;return ag(40,a|0)|0}function kN(a){a=a|0;return ag(41,a|0)|0}function kO(a){a=a|0;return ag(42,a|0)|0}function kP(a){a=a|0;return ag(43,a|0)|0}function kQ(a){a=a|0;return ag(44,a|0)|0}function kR(a){a=a|0;return ag(45,a|0)|0}function kS(a){a=a|0;return ag(46,a|0)|0}function kT(a){a=a|0;return ag(47,a|0)|0}function kU(a){a=a|0;return ag(48,a|0)|0}function kV(a){a=a|0;return ag(49,a|0)|0}function kW(a){a=a|0;return ag(50,a|0)|0}function kX(a){a=a|0;return ag(51,a|0)|0}function kY(a){a=a|0;return ag(52,a|0)|0}function kZ(a){a=a|0;return ag(53,a|0)|0}function k_(a){a=a|0;return ag(54,a|0)|0}function k$(a){a=a|0;return ag(55,a|0)|0}function k0(a){a=a|0;return ag(56,a|0)|0}function k1(a){a=a|0;return ag(57,a|0)|0}function k2(a){a=a|0;return ag(58,a|0)|0}function k3(a){a=a|0;return ag(59,a|0)|0}function k4(a){a=a|0;return ag(60,a|0)|0}function k5(a){a=a|0;return ag(61,a|0)|0}function k6(a){a=a|0;return ag(62,a|0)|0}function k7(a){a=a|0;return ag(63,a|0)|0}function k8(a){a=a|0;return ag(64,a|0)|0}function k9(a){a=a|0;return ag(65,a|0)|0}function la(a){a=a|0;return ag(66,a|0)|0}function lb(a){a=a|0;return ag(67,a|0)|0}function lc(a){a=a|0;return ag(68,a|0)|0}function ld(a){a=a|0;return ag(69,a|0)|0}function le(a){a=a|0;return ag(70,a|0)|0}function lf(a){a=a|0;return ag(71,a|0)|0}function lg(a){a=a|0;return ag(72,a|0)|0}function lh(a){a=a|0;return ag(73,a|0)|0}function li(a){a=a|0;return ag(74,a|0)|0}function lj(a){a=a|0;return ag(75,a|0)|0}function lk(a){a=a|0;return ag(76,a|0)|0}function ll(a){a=a|0;return ag(77,a|0)|0}function lm(a){a=a|0;return ag(78,a|0)|0}function ln(a){a=a|0;return ag(79,a|0)|0}function lo(a){a=a|0;return ag(80,a|0)|0}function lp(a){a=a|0;return ag(81,a|0)|0}function lq(a){a=a|0;return ag(82,a|0)|0}function lr(a){a=a|0;return ag(83,a|0)|0}function ls(a){a=a|0;return ag(84,a|0)|0}function lt(a){a=a|0;return ag(85,a|0)|0}function lu(a){a=a|0;return ag(86,a|0)|0}function lv(a){a=a|0;return ag(87,a|0)|0}function lw(a){a=a|0;return ag(88,a|0)|0}function lx(a){a=a|0;return ag(89,a|0)|0}function ly(a){a=a|0;return ag(90,a|0)|0}function lz(a){a=a|0;return ag(91,a|0)|0}function lA(a){a=a|0;return ag(92,a|0)|0}function lB(a){a=a|0;return ag(93,a|0)|0}function lC(a){a=a|0;return ag(94,a|0)|0}function lD(a){a=a|0;return ag(95,a|0)|0}function lE(a){a=a|0;return ag(96,a|0)|0}function lF(a){a=a|0;return ag(97,a|0)|0}function lG(a){a=a|0;return ag(98,a|0)|0}function lH(a){a=a|0;return ag(99,a|0)|0}function lI(a){a=a|0;return ag(100,a|0)|0}function lJ(a){a=a|0;return ag(101,a|0)|0}function lK(a){a=a|0;return ag(102,a|0)|0}function lL(a){a=a|0;return ag(103,a|0)|0}function lM(a){a=a|0;return ag(104,a|0)|0}function lN(a){a=a|0;return ag(105,a|0)|0}function lO(a){a=a|0;return ag(106,a|0)|0}function lP(a){a=a|0;return ag(107,a|0)|0}function lQ(a){a=a|0;return ag(108,a|0)|0}function lR(a){a=a|0;return ag(109,a|0)|0}function lS(a){a=a|0;return ag(110,a|0)|0}function lT(a){a=a|0;return ag(111,a|0)|0}function lU(a){a=a|0;return ag(112,a|0)|0}function lV(a){a=a|0;return ag(113,a|0)|0}function lW(a){a=a|0;return ag(114,a|0)|0}function lX(a){a=a|0;return ag(115,a|0)|0}function lY(a){a=a|0;return ag(116,a|0)|0}function lZ(a){a=a|0;return ag(117,a|0)|0}function l_(a){a=a|0;return ag(118,a|0)|0}function l$(a){a=a|0;return ag(119,a|0)|0}function l0(a){a=a|0;return ag(120,a|0)|0}function l1(a){a=a|0;return ag(121,a|0)|0}function l2(a){a=a|0;return ag(122,a|0)|0}function l3(a){a=a|0;return ag(123,a|0)|0}function l4(a){a=a|0;return ag(124,a|0)|0}function l5(a,b){a=a|0;b=b|0;ce[a&255](b|0)}function l6(a){a=a|0;ag(0,a|0)}function l7(a){a=a|0;ag(1,a|0)}function l8(a){a=a|0;ag(2,a|0)}function l9(a){a=a|0;ag(3,a|0)}function ma(a){a=a|0;ag(4,a|0)}function mb(a){a=a|0;ag(5,a|0)}function mc(a){a=a|0;ag(6,a|0)}function md(a){a=a|0;ag(7,a|0)}function me(a){a=a|0;ag(8,a|0)}function mf(a){a=a|0;ag(9,a|0)}function mg(a){a=a|0;ag(10,a|0)}function mh(a){a=a|0;ag(11,a|0)}function mi(a){a=a|0;ag(12,a|0)}function mj(a){a=a|0;ag(13,a|0)}function mk(a){a=a|0;ag(14,a|0)}function ml(a){a=a|0;ag(15,a|0)}function mm(a){a=a|0;ag(16,a|0)}function mn(a){a=a|0;ag(17,a|0)}function mo(a){a=a|0;ag(18,a|0)}function mp(a){a=a|0;ag(19,a|0)}function mq(a){a=a|0;ag(20,a|0)}function mr(a){a=a|0;ag(21,a|0)}function ms(a){a=a|0;ag(22,a|0)}function mt(a){a=a|0;ag(23,a|0)}function mu(a){a=a|0;ag(24,a|0)}function mv(a){a=a|0;ag(25,a|0)}function mw(a){a=a|0;ag(26,a|0)}function mx(a){a=a|0;ag(27,a|0)}function my(a){a=a|0;ag(28,a|0)}function mz(a){a=a|0;ag(29,a|0)}function mA(a){a=a|0;ag(30,a|0)}function mB(a){a=a|0;ag(31,a|0)}function mC(a){a=a|0;ag(32,a|0)}function mD(a){a=a|0;ag(33,a|0)}function mE(a){a=a|0;ag(34,a|0)}function mF(a){a=a|0;ag(35,a|0)}function mG(a){a=a|0;ag(36,a|0)}function mH(a){a=a|0;ag(37,a|0)}function mI(a){a=a|0;ag(38,a|0)}function mJ(a){a=a|0;ag(39,a|0)}function mK(a){a=a|0;ag(40,a|0)}function mL(a){a=a|0;ag(41,a|0)}function mM(a){a=a|0;ag(42,a|0)}function mN(a){a=a|0;ag(43,a|0)}function mO(a){a=a|0;ag(44,a|0)}function mP(a){a=a|0;ag(45,a|0)}function mQ(a){a=a|0;ag(46,a|0)}function mR(a){a=a|0;ag(47,a|0)}function mS(a){a=a|0;ag(48,a|0)}function mT(a){a=a|0;ag(49,a|0)}function mU(a){a=a|0;ag(50,a|0)}function mV(a){a=a|0;ag(51,a|0)}function mW(a){a=a|0;ag(52,a|0)}function mX(a){a=a|0;ag(53,a|0)}function mY(a){a=a|0;ag(54,a|0)}function mZ(a){a=a|0;ag(55,a|0)}function m_(a){a=a|0;ag(56,a|0)}function m$(a){a=a|0;ag(57,a|0)}function m0(a){a=a|0;ag(58,a|0)}function m1(a){a=a|0;ag(59,a|0)}function m2(a){a=a|0;ag(60,a|0)}function m3(a){a=a|0;ag(61,a|0)}function m4(a){a=a|0;ag(62,a|0)}function m5(a){a=a|0;ag(63,a|0)}function m6(a){a=a|0;ag(64,a|0)}function m7(a){a=a|0;ag(65,a|0)}function m8(a){a=a|0;ag(66,a|0)}function m9(a){a=a|0;ag(67,a|0)}function na(a){a=a|0;ag(68,a|0)}function nb(a){a=a|0;ag(69,a|0)}function nc(a){a=a|0;ag(70,a|0)}function nd(a){a=a|0;ag(71,a|0)}function ne(a){a=a|0;ag(72,a|0)}function nf(a){a=a|0;ag(73,a|0)}function ng(a){a=a|0;ag(74,a|0)}function nh(a){a=a|0;ag(75,a|0)}function ni(a){a=a|0;ag(76,a|0)}function nj(a){a=a|0;ag(77,a|0)}function nk(a){a=a|0;ag(78,a|0)}function nl(a){a=a|0;ag(79,a|0)}function nm(a){a=a|0;ag(80,a|0)}function nn(a){a=a|0;ag(81,a|0)}function no(a){a=a|0;ag(82,a|0)}function np(a){a=a|0;ag(83,a|0)}function nq(a){a=a|0;ag(84,a|0)}function nr(a){a=a|0;ag(85,a|0)}function ns(a){a=a|0;ag(86,a|0)}function nt(a){a=a|0;ag(87,a|0)}function nu(a){a=a|0;ag(88,a|0)}function nv(a){a=a|0;ag(89,a|0)}function nw(a){a=a|0;ag(90,a|0)}function nx(a){a=a|0;ag(91,a|0)}function ny(a){a=a|0;ag(92,a|0)}function nz(a){a=a|0;ag(93,a|0)}function nA(a){a=a|0;ag(94,a|0)}function nB(a){a=a|0;ag(95,a|0)}function nC(a){a=a|0;ag(96,a|0)}function nD(a){a=a|0;ag(97,a|0)}function nE(a){a=a|0;ag(98,a|0)}function nF(a){a=a|0;ag(99,a|0)}function nG(a){a=a|0;ag(100,a|0)}function nH(a){a=a|0;ag(101,a|0)}function nI(a){a=a|0;ag(102,a|0)}function nJ(a){a=a|0;ag(103,a|0)}function nK(a){a=a|0;ag(104,a|0)}function nL(a){a=a|0;ag(105,a|0)}function nM(a){a=a|0;ag(106,a|0)}function nN(a){a=a|0;ag(107,a|0)}function nO(a){a=a|0;ag(108,a|0)}function nP(a){a=a|0;ag(109,a|0)}function nQ(a){a=a|0;ag(110,a|0)}function nR(a){a=a|0;ag(111,a|0)}function nS(a){a=a|0;ag(112,a|0)}function nT(a){a=a|0;ag(113,a|0)}function nU(a){a=a|0;ag(114,a|0)}function nV(a){a=a|0;ag(115,a|0)}function nW(a){a=a|0;ag(116,a|0)}function nX(a){a=a|0;ag(117,a|0)}function nY(a){a=a|0;ag(118,a|0)}function nZ(a){a=a|0;ag(119,a|0)}function n_(a){a=a|0;ag(120,a|0)}function n$(a){a=a|0;ag(121,a|0)}function n0(a){a=a|0;ag(122,a|0)}function n1(a){a=a|0;ag(123,a|0)}function n2(a){a=a|0;ag(124,a|0)}function n3(a,b,c){a=a|0;b=b|0;c=c|0;cf[a&511](b|0,c|0)}function n4(a,b){a=a|0;b=b|0;ag(0,a|0,b|0)}function n5(a,b){a=a|0;b=b|0;ag(1,a|0,b|0)}function n6(a,b){a=a|0;b=b|0;ag(2,a|0,b|0)}function n7(a,b){a=a|0;b=b|0;ag(3,a|0,b|0)}function n8(a,b){a=a|0;b=b|0;ag(4,a|0,b|0)}function n9(a,b){a=a|0;b=b|0;ag(5,a|0,b|0)}function oa(a,b){a=a|0;b=b|0;ag(6,a|0,b|0)}function ob(a,b){a=a|0;b=b|0;ag(7,a|0,b|0)}function oc(a,b){a=a|0;b=b|0;ag(8,a|0,b|0)}function od(a,b){a=a|0;b=b|0;ag(9,a|0,b|0)}function oe(a,b){a=a|0;b=b|0;ag(10,a|0,b|0)}function of(a,b){a=a|0;b=b|0;ag(11,a|0,b|0)}function og(a,b){a=a|0;b=b|0;ag(12,a|0,b|0)}function oh(a,b){a=a|0;b=b|0;ag(13,a|0,b|0)}function oi(a,b){a=a|0;b=b|0;ag(14,a|0,b|0)}function oj(a,b){a=a|0;b=b|0;ag(15,a|0,b|0)}function ok(a,b){a=a|0;b=b|0;ag(16,a|0,b|0)}function ol(a,b){a=a|0;b=b|0;ag(17,a|0,b|0)}function om(a,b){a=a|0;b=b|0;ag(18,a|0,b|0)}function on(a,b){a=a|0;b=b|0;ag(19,a|0,b|0)}function oo(a,b){a=a|0;b=b|0;ag(20,a|0,b|0)}function op(a,b){a=a|0;b=b|0;ag(21,a|0,b|0)}function oq(a,b){a=a|0;b=b|0;ag(22,a|0,b|0)}function or(a,b){a=a|0;b=b|0;ag(23,a|0,b|0)}function os(a,b){a=a|0;b=b|0;ag(24,a|0,b|0)}function ot(a,b){a=a|0;b=b|0;ag(25,a|0,b|0)}function ou(a,b){a=a|0;b=b|0;ag(26,a|0,b|0)}function ov(a,b){a=a|0;b=b|0;ag(27,a|0,b|0)}function ow(a,b){a=a|0;b=b|0;ag(28,a|0,b|0)}function ox(a,b){a=a|0;b=b|0;ag(29,a|0,b|0)}function oy(a,b){a=a|0;b=b|0;ag(30,a|0,b|0)}function oz(a,b){a=a|0;b=b|0;ag(31,a|0,b|0)}function oA(a,b){a=a|0;b=b|0;ag(32,a|0,b|0)}function oB(a,b){a=a|0;b=b|0;ag(33,a|0,b|0)}function oC(a,b){a=a|0;b=b|0;ag(34,a|0,b|0)}function oD(a,b){a=a|0;b=b|0;ag(35,a|0,b|0)}function oE(a,b){a=a|0;b=b|0;ag(36,a|0,b|0)}function oF(a,b){a=a|0;b=b|0;ag(37,a|0,b|0)}function oG(a,b){a=a|0;b=b|0;ag(38,a|0,b|0)}function oH(a,b){a=a|0;b=b|0;ag(39,a|0,b|0)}function oI(a,b){a=a|0;b=b|0;ag(40,a|0,b|0)}function oJ(a,b){a=a|0;b=b|0;ag(41,a|0,b|0)}function oK(a,b){a=a|0;b=b|0;ag(42,a|0,b|0)}function oL(a,b){a=a|0;b=b|0;ag(43,a|0,b|0)}function oM(a,b){a=a|0;b=b|0;ag(44,a|0,b|0)}function oN(a,b){a=a|0;b=b|0;ag(45,a|0,b|0)}function oO(a,b){a=a|0;b=b|0;ag(46,a|0,b|0)}function oP(a,b){a=a|0;b=b|0;ag(47,a|0,b|0)}function oQ(a,b){a=a|0;b=b|0;ag(48,a|0,b|0)}function oR(a,b){a=a|0;b=b|0;ag(49,a|0,b|0)}function oS(a,b){a=a|0;b=b|0;ag(50,a|0,b|0)}function oT(a,b){a=a|0;b=b|0;ag(51,a|0,b|0)}function oU(a,b){a=a|0;b=b|0;ag(52,a|0,b|0)}function oV(a,b){a=a|0;b=b|0;ag(53,a|0,b|0)}function oW(a,b){a=a|0;b=b|0;ag(54,a|0,b|0)}function oX(a,b){a=a|0;b=b|0;ag(55,a|0,b|0)}function oY(a,b){a=a|0;b=b|0;ag(56,a|0,b|0)}function oZ(a,b){a=a|0;b=b|0;ag(57,a|0,b|0)}function o_(a,b){a=a|0;b=b|0;ag(58,a|0,b|0)}function o$(a,b){a=a|0;b=b|0;ag(59,a|0,b|0)}function o0(a,b){a=a|0;b=b|0;ag(60,a|0,b|0)}function o1(a,b){a=a|0;b=b|0;ag(61,a|0,b|0)}function o2(a,b){a=a|0;b=b|0;ag(62,a|0,b|0)}function o3(a,b){a=a|0;b=b|0;ag(63,a|0,b|0)}function o4(a,b){a=a|0;b=b|0;ag(64,a|0,b|0)}function o5(a,b){a=a|0;b=b|0;ag(65,a|0,b|0)}function o6(a,b){a=a|0;b=b|0;ag(66,a|0,b|0)}function o7(a,b){a=a|0;b=b|0;ag(67,a|0,b|0)}function o8(a,b){a=a|0;b=b|0;ag(68,a|0,b|0)}function o9(a,b){a=a|0;b=b|0;ag(69,a|0,b|0)}function pa(a,b){a=a|0;b=b|0;ag(70,a|0,b|0)}function pb(a,b){a=a|0;b=b|0;ag(71,a|0,b|0)}function pc(a,b){a=a|0;b=b|0;ag(72,a|0,b|0)}function pd(a,b){a=a|0;b=b|0;ag(73,a|0,b|0)}function pe(a,b){a=a|0;b=b|0;ag(74,a|0,b|0)}function pf(a,b){a=a|0;b=b|0;ag(75,a|0,b|0)}function pg(a,b){a=a|0;b=b|0;ag(76,a|0,b|0)}function ph(a,b){a=a|0;b=b|0;ag(77,a|0,b|0)}function pi(a,b){a=a|0;b=b|0;ag(78,a|0,b|0)}function pj(a,b){a=a|0;b=b|0;ag(79,a|0,b|0)}function pk(a,b){a=a|0;b=b|0;ag(80,a|0,b|0)}function pl(a,b){a=a|0;b=b|0;ag(81,a|0,b|0)}function pm(a,b){a=a|0;b=b|0;ag(82,a|0,b|0)}function pn(a,b){a=a|0;b=b|0;ag(83,a|0,b|0)}function po(a,b){a=a|0;b=b|0;ag(84,a|0,b|0)}function pp(a,b){a=a|0;b=b|0;ag(85,a|0,b|0)}function pq(a,b){a=a|0;b=b|0;ag(86,a|0,b|0)}function pr(a,b){a=a|0;b=b|0;ag(87,a|0,b|0)}function ps(a,b){a=a|0;b=b|0;ag(88,a|0,b|0)}function pt(a,b){a=a|0;b=b|0;ag(89,a|0,b|0)}function pu(a,b){a=a|0;b=b|0;ag(90,a|0,b|0)}function pv(a,b){a=a|0;b=b|0;ag(91,a|0,b|0)}function pw(a,b){a=a|0;b=b|0;ag(92,a|0,b|0)}function px(a,b){a=a|0;b=b|0;ag(93,a|0,b|0)}function py(a,b){a=a|0;b=b|0;ag(94,a|0,b|0)}function pz(a,b){a=a|0;b=b|0;ag(95,a|0,b|0)}function pA(a,b){a=a|0;b=b|0;ag(96,a|0,b|0)}function pB(a,b){a=a|0;b=b|0;ag(97,a|0,b|0)}function pC(a,b){a=a|0;b=b|0;ag(98,a|0,b|0)}function pD(a,b){a=a|0;b=b|0;ag(99,a|0,b|0)}function pE(a,b){a=a|0;b=b|0;ag(100,a|0,b|0)}function pF(a,b){a=a|0;b=b|0;ag(101,a|0,b|0)}function pG(a,b){a=a|0;b=b|0;ag(102,a|0,b|0)}function pH(a,b){a=a|0;b=b|0;ag(103,a|0,b|0)}function pI(a,b){a=a|0;b=b|0;ag(104,a|0,b|0)}function pJ(a,b){a=a|0;b=b|0;ag(105,a|0,b|0)}function pK(a,b){a=a|0;b=b|0;ag(106,a|0,b|0)}function pL(a,b){a=a|0;b=b|0;ag(107,a|0,b|0)}function pM(a,b){a=a|0;b=b|0;ag(108,a|0,b|0)}function pN(a,b){a=a|0;b=b|0;ag(109,a|0,b|0)}function pO(a,b){a=a|0;b=b|0;ag(110,a|0,b|0)}function pP(a,b){a=a|0;b=b|0;ag(111,a|0,b|0)}function pQ(a,b){a=a|0;b=b|0;ag(112,a|0,b|0)}function pR(a,b){a=a|0;b=b|0;ag(113,a|0,b|0)}function pS(a,b){a=a|0;b=b|0;ag(114,a|0,b|0)}function pT(a,b){a=a|0;b=b|0;ag(115,a|0,b|0)}function pU(a,b){a=a|0;b=b|0;ag(116,a|0,b|0)}function pV(a,b){a=a|0;b=b|0;ag(117,a|0,b|0)}function pW(a,b){a=a|0;b=b|0;ag(118,a|0,b|0)}function pX(a,b){a=a|0;b=b|0;ag(119,a|0,b|0)}function pY(a,b){a=a|0;b=b|0;ag(120,a|0,b|0)}function pZ(a,b){a=a|0;b=b|0;ag(121,a|0,b|0)}function p_(a,b){a=a|0;b=b|0;ag(122,a|0,b|0)}function p$(a,b){a=a|0;b=b|0;ag(123,a|0,b|0)}function p0(a,b){a=a|0;b=b|0;ag(124,a|0,b|0)}function p1(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return cg[a&511](b|0,c|0,d|0,e|0)|0}function p2(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(0,a|0,b|0,c|0,d|0)|0}function p3(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(1,a|0,b|0,c|0,d|0)|0}function p4(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(2,a|0,b|0,c|0,d|0)|0}function p5(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(3,a|0,b|0,c|0,d|0)|0}function p6(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(4,a|0,b|0,c|0,d|0)|0}function p7(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(5,a|0,b|0,c|0,d|0)|0}function p8(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(6,a|0,b|0,c|0,d|0)|0}function p9(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(7,a|0,b|0,c|0,d|0)|0}function qa(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(8,a|0,b|0,c|0,d|0)|0}function qb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(9,a|0,b|0,c|0,d|0)|0}function qc(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(10,a|0,b|0,c|0,d|0)|0}function qd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(11,a|0,b|0,c|0,d|0)|0}function qe(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(12,a|0,b|0,c|0,d|0)|0}function qf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(13,a|0,b|0,c|0,d|0)|0}function qg(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(14,a|0,b|0,c|0,d|0)|0}function qh(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(15,a|0,b|0,c|0,d|0)|0}function qi(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(16,a|0,b|0,c|0,d|0)|0}function qj(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(17,a|0,b|0,c|0,d|0)|0}function qk(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(18,a|0,b|0,c|0,d|0)|0}function ql(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(19,a|0,b|0,c|0,d|0)|0}function qm(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(20,a|0,b|0,c|0,d|0)|0}function qn(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(21,a|0,b|0,c|0,d|0)|0}function qo(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(22,a|0,b|0,c|0,d|0)|0}function qp(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(23,a|0,b|0,c|0,d|0)|0}function qq(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(24,a|0,b|0,c|0,d|0)|0}function qr(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(25,a|0,b|0,c|0,d|0)|0}function qs(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(26,a|0,b|0,c|0,d|0)|0}function qt(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(27,a|0,b|0,c|0,d|0)|0}function qu(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(28,a|0,b|0,c|0,d|0)|0}function qv(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(29,a|0,b|0,c|0,d|0)|0}function qw(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(30,a|0,b|0,c|0,d|0)|0}function qx(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(31,a|0,b|0,c|0,d|0)|0}function qy(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(32,a|0,b|0,c|0,d|0)|0}function qz(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(33,a|0,b|0,c|0,d|0)|0}function qA(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(34,a|0,b|0,c|0,d|0)|0}function qB(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(35,a|0,b|0,c|0,d|0)|0}function qC(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(36,a|0,b|0,c|0,d|0)|0}function qD(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(37,a|0,b|0,c|0,d|0)|0}function qE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(38,a|0,b|0,c|0,d|0)|0}function qF(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(39,a|0,b|0,c|0,d|0)|0}function qG(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(40,a|0,b|0,c|0,d|0)|0}function qH(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(41,a|0,b|0,c|0,d|0)|0}function qI(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(42,a|0,b|0,c|0,d|0)|0}function qJ(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(43,a|0,b|0,c|0,d|0)|0}function qK(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(44,a|0,b|0,c|0,d|0)|0}function qL(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(45,a|0,b|0,c|0,d|0)|0}function qM(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(46,a|0,b|0,c|0,d|0)|0}function qN(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(47,a|0,b|0,c|0,d|0)|0}function qO(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(48,a|0,b|0,c|0,d|0)|0}function qP(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(49,a|0,b|0,c|0,d|0)|0}function qQ(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(50,a|0,b|0,c|0,d|0)|0}function qR(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(51,a|0,b|0,c|0,d|0)|0}function qS(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(52,a|0,b|0,c|0,d|0)|0}function qT(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(53,a|0,b|0,c|0,d|0)|0}function qU(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(54,a|0,b|0,c|0,d|0)|0}function qV(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(55,a|0,b|0,c|0,d|0)|0}function qW(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(56,a|0,b|0,c|0,d|0)|0}function qX(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(57,a|0,b|0,c|0,d|0)|0}function qY(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(58,a|0,b|0,c|0,d|0)|0}function qZ(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(59,a|0,b|0,c|0,d|0)|0}function q_(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(60,a|0,b|0,c|0,d|0)|0}function q$(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(61,a|0,b|0,c|0,d|0)|0}function q0(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(62,a|0,b|0,c|0,d|0)|0}function q1(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(63,a|0,b|0,c|0,d|0)|0}function q2(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(64,a|0,b|0,c|0,d|0)|0}function q3(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(65,a|0,b|0,c|0,d|0)|0}function q4(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(66,a|0,b|0,c|0,d|0)|0}function q5(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(67,a|0,b|0,c|0,d|0)|0}function q6(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(68,a|0,b|0,c|0,d|0)|0}function q7(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(69,a|0,b|0,c|0,d|0)|0}function q8(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(70,a|0,b|0,c|0,d|0)|0}function q9(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(71,a|0,b|0,c|0,d|0)|0}function ra(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(72,a|0,b|0,c|0,d|0)|0}function rb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(73,a|0,b|0,c|0,d|0)|0}function rc(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(74,a|0,b|0,c|0,d|0)|0}function rd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(75,a|0,b|0,c|0,d|0)|0}function re(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(76,a|0,b|0,c|0,d|0)|0}function rf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(77,a|0,b|0,c|0,d|0)|0}function rg(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(78,a|0,b|0,c|0,d|0)|0}function rh(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(79,a|0,b|0,c|0,d|0)|0}function ri(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(80,a|0,b|0,c|0,d|0)|0}function rj(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(81,a|0,b|0,c|0,d|0)|0}function rk(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(82,a|0,b|0,c|0,d|0)|0}function rl(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(83,a|0,b|0,c|0,d|0)|0}function rm(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(84,a|0,b|0,c|0,d|0)|0}function rn(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(85,a|0,b|0,c|0,d|0)|0}function ro(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(86,a|0,b|0,c|0,d|0)|0}function rp(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(87,a|0,b|0,c|0,d|0)|0}function rq(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(88,a|0,b|0,c|0,d|0)|0}function rr(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(89,a|0,b|0,c|0,d|0)|0}function rs(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(90,a|0,b|0,c|0,d|0)|0}function rt(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(91,a|0,b|0,c|0,d|0)|0}function ru(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(92,a|0,b|0,c|0,d|0)|0}function rv(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(93,a|0,b|0,c|0,d|0)|0}function rw(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(94,a|0,b|0,c|0,d|0)|0}function rx(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(95,a|0,b|0,c|0,d|0)|0}function ry(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(96,a|0,b|0,c|0,d|0)|0}function rz(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(97,a|0,b|0,c|0,d|0)|0}function rA(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(98,a|0,b|0,c|0,d|0)|0}function rB(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(99,a|0,b|0,c|0,d|0)|0}function rC(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(100,a|0,b|0,c|0,d|0)|0}function rD(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(101,a|0,b|0,c|0,d|0)|0}function rE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(102,a|0,b|0,c|0,d|0)|0}function rF(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(103,a|0,b|0,c|0,d|0)|0}function rG(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(104,a|0,b|0,c|0,d|0)|0}function rH(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(105,a|0,b|0,c|0,d|0)|0}function rI(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(106,a|0,b|0,c|0,d|0)|0}function rJ(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(107,a|0,b|0,c|0,d|0)|0}function rK(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(108,a|0,b|0,c|0,d|0)|0}function rL(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(109,a|0,b|0,c|0,d|0)|0}function rM(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(110,a|0,b|0,c|0,d|0)|0}function rN(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(111,a|0,b|0,c|0,d|0)|0}function rO(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(112,a|0,b|0,c|0,d|0)|0}function rP(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(113,a|0,b|0,c|0,d|0)|0}function rQ(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(114,a|0,b|0,c|0,d|0)|0}function rR(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(115,a|0,b|0,c|0,d|0)|0}function rS(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(116,a|0,b|0,c|0,d|0)|0}function rT(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(117,a|0,b|0,c|0,d|0)|0}function rU(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(118,a|0,b|0,c|0,d|0)|0}function rV(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(119,a|0,b|0,c|0,d|0)|0}function rW(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(120,a|0,b|0,c|0,d|0)|0}function rX(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(121,a|0,b|0,c|0,d|0)|0}function rY(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(122,a|0,b|0,c|0,d|0)|0}function rZ(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(123,a|0,b|0,c|0,d|0)|0}function r_(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ag(124,a|0,b|0,c|0,d|0)|0}function r$(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ch[a&511](b|0,c|0,d|0)|0}function r0(a,b,c){a=a|0;b=b|0;c=c|0;return ag(0,a|0,b|0,c|0)|0}function r1(a,b,c){a=a|0;b=b|0;c=c|0;return ag(1,a|0,b|0,c|0)|0}function r2(a,b,c){a=a|0;b=b|0;c=c|0;return ag(2,a|0,b|0,c|0)|0}function r3(a,b,c){a=a|0;b=b|0;c=c|0;return ag(3,a|0,b|0,c|0)|0}function r4(a,b,c){a=a|0;b=b|0;c=c|0;return ag(4,a|0,b|0,c|0)|0}function r5(a,b,c){a=a|0;b=b|0;c=c|0;return ag(5,a|0,b|0,c|0)|0}function r6(a,b,c){a=a|0;b=b|0;c=c|0;return ag(6,a|0,b|0,c|0)|0}function r7(a,b,c){a=a|0;b=b|0;c=c|0;return ag(7,a|0,b|0,c|0)|0}function r8(a,b,c){a=a|0;b=b|0;c=c|0;return ag(8,a|0,b|0,c|0)|0}function r9(a,b,c){a=a|0;b=b|0;c=c|0;return ag(9,a|0,b|0,c|0)|0}function sa(a,b,c){a=a|0;b=b|0;c=c|0;return ag(10,a|0,b|0,c|0)|0}function sb(a,b,c){a=a|0;b=b|0;c=c|0;return ag(11,a|0,b|0,c|0)|0}function sc(a,b,c){a=a|0;b=b|0;c=c|0;return ag(12,a|0,b|0,c|0)|0}function sd(a,b,c){a=a|0;b=b|0;c=c|0;return ag(13,a|0,b|0,c|0)|0}function se(a,b,c){a=a|0;b=b|0;c=c|0;return ag(14,a|0,b|0,c|0)|0}function sf(a,b,c){a=a|0;b=b|0;c=c|0;return ag(15,a|0,b|0,c|0)|0}function sg(a,b,c){a=a|0;b=b|0;c=c|0;return ag(16,a|0,b|0,c|0)|0}function sh(a,b,c){a=a|0;b=b|0;c=c|0;return ag(17,a|0,b|0,c|0)|0}function si(a,b,c){a=a|0;b=b|0;c=c|0;return ag(18,a|0,b|0,c|0)|0}function sj(a,b,c){a=a|0;b=b|0;c=c|0;return ag(19,a|0,b|0,c|0)|0}function sk(a,b,c){a=a|0;b=b|0;c=c|0;return ag(20,a|0,b|0,c|0)|0}function sl(a,b,c){a=a|0;b=b|0;c=c|0;return ag(21,a|0,b|0,c|0)|0}function sm(a,b,c){a=a|0;b=b|0;c=c|0;return ag(22,a|0,b|0,c|0)|0}function sn(a,b,c){a=a|0;b=b|0;c=c|0;return ag(23,a|0,b|0,c|0)|0}function so(a,b,c){a=a|0;b=b|0;c=c|0;return ag(24,a|0,b|0,c|0)|0}function sp(a,b,c){a=a|0;b=b|0;c=c|0;return ag(25,a|0,b|0,c|0)|0}function sq(a,b,c){a=a|0;b=b|0;c=c|0;return ag(26,a|0,b|0,c|0)|0}function sr(a,b,c){a=a|0;b=b|0;c=c|0;return ag(27,a|0,b|0,c|0)|0}function ss(a,b,c){a=a|0;b=b|0;c=c|0;return ag(28,a|0,b|0,c|0)|0}function st(a,b,c){a=a|0;b=b|0;c=c|0;return ag(29,a|0,b|0,c|0)|0}function su(a,b,c){a=a|0;b=b|0;c=c|0;return ag(30,a|0,b|0,c|0)|0}function sv(a,b,c){a=a|0;b=b|0;c=c|0;return ag(31,a|0,b|0,c|0)|0}function sw(a,b,c){a=a|0;b=b|0;c=c|0;return ag(32,a|0,b|0,c|0)|0}function sx(a,b,c){a=a|0;b=b|0;c=c|0;return ag(33,a|0,b|0,c|0)|0}function sy(a,b,c){a=a|0;b=b|0;c=c|0;return ag(34,a|0,b|0,c|0)|0}function sz(a,b,c){a=a|0;b=b|0;c=c|0;return ag(35,a|0,b|0,c|0)|0}function sA(a,b,c){a=a|0;b=b|0;c=c|0;return ag(36,a|0,b|0,c|0)|0}function sB(a,b,c){a=a|0;b=b|0;c=c|0;return ag(37,a|0,b|0,c|0)|0}function sC(a,b,c){a=a|0;b=b|0;c=c|0;return ag(38,a|0,b|0,c|0)|0}function sD(a,b,c){a=a|0;b=b|0;c=c|0;return ag(39,a|0,b|0,c|0)|0}function sE(a,b,c){a=a|0;b=b|0;c=c|0;return ag(40,a|0,b|0,c|0)|0}function sF(a,b,c){a=a|0;b=b|0;c=c|0;return ag(41,a|0,b|0,c|0)|0}function sG(a,b,c){a=a|0;b=b|0;c=c|0;return ag(42,a|0,b|0,c|0)|0}function sH(a,b,c){a=a|0;b=b|0;c=c|0;return ag(43,a|0,b|0,c|0)|0}function sI(a,b,c){a=a|0;b=b|0;c=c|0;return ag(44,a|0,b|0,c|0)|0}function sJ(a,b,c){a=a|0;b=b|0;c=c|0;return ag(45,a|0,b|0,c|0)|0}function sK(a,b,c){a=a|0;b=b|0;c=c|0;return ag(46,a|0,b|0,c|0)|0}function sL(a,b,c){a=a|0;b=b|0;c=c|0;return ag(47,a|0,b|0,c|0)|0}function sM(a,b,c){a=a|0;b=b|0;c=c|0;return ag(48,a|0,b|0,c|0)|0}function sN(a,b,c){a=a|0;b=b|0;c=c|0;return ag(49,a|0,b|0,c|0)|0}function sO(a,b,c){a=a|0;b=b|0;c=c|0;return ag(50,a|0,b|0,c|0)|0}function sP(a,b,c){a=a|0;b=b|0;c=c|0;return ag(51,a|0,b|0,c|0)|0}function sQ(a,b,c){a=a|0;b=b|0;c=c|0;return ag(52,a|0,b|0,c|0)|0}function sR(a,b,c){a=a|0;b=b|0;c=c|0;return ag(53,a|0,b|0,c|0)|0}function sS(a,b,c){a=a|0;b=b|0;c=c|0;return ag(54,a|0,b|0,c|0)|0}function sT(a,b,c){a=a|0;b=b|0;c=c|0;return ag(55,a|0,b|0,c|0)|0}function sU(a,b,c){a=a|0;b=b|0;c=c|0;return ag(56,a|0,b|0,c|0)|0}function sV(a,b,c){a=a|0;b=b|0;c=c|0;return ag(57,a|0,b|0,c|0)|0}function sW(a,b,c){a=a|0;b=b|0;c=c|0;return ag(58,a|0,b|0,c|0)|0}function sX(a,b,c){a=a|0;b=b|0;c=c|0;return ag(59,a|0,b|0,c|0)|0}function sY(a,b,c){a=a|0;b=b|0;c=c|0;return ag(60,a|0,b|0,c|0)|0}function sZ(a,b,c){a=a|0;b=b|0;c=c|0;return ag(61,a|0,b|0,c|0)|0}function s_(a,b,c){a=a|0;b=b|0;c=c|0;return ag(62,a|0,b|0,c|0)|0}function s$(a,b,c){a=a|0;b=b|0;c=c|0;return ag(63,a|0,b|0,c|0)|0}function s0(a,b,c){a=a|0;b=b|0;c=c|0;return ag(64,a|0,b|0,c|0)|0}function s1(a,b,c){a=a|0;b=b|0;c=c|0;return ag(65,a|0,b|0,c|0)|0}function s2(a,b,c){a=a|0;b=b|0;c=c|0;return ag(66,a|0,b|0,c|0)|0}function s3(a,b,c){a=a|0;b=b|0;c=c|0;return ag(67,a|0,b|0,c|0)|0}function s4(a,b,c){a=a|0;b=b|0;c=c|0;return ag(68,a|0,b|0,c|0)|0}function s5(a,b,c){a=a|0;b=b|0;c=c|0;return ag(69,a|0,b|0,c|0)|0}function s6(a,b,c){a=a|0;b=b|0;c=c|0;return ag(70,a|0,b|0,c|0)|0}function s7(a,b,c){a=a|0;b=b|0;c=c|0;return ag(71,a|0,b|0,c|0)|0}function s8(a,b,c){a=a|0;b=b|0;c=c|0;return ag(72,a|0,b|0,c|0)|0}function s9(a,b,c){a=a|0;b=b|0;c=c|0;return ag(73,a|0,b|0,c|0)|0}function ta(a,b,c){a=a|0;b=b|0;c=c|0;return ag(74,a|0,b|0,c|0)|0}function tb(a,b,c){a=a|0;b=b|0;c=c|0;return ag(75,a|0,b|0,c|0)|0}function tc(a,b,c){a=a|0;b=b|0;c=c|0;return ag(76,a|0,b|0,c|0)|0}function td(a,b,c){a=a|0;b=b|0;c=c|0;return ag(77,a|0,b|0,c|0)|0}function te(a,b,c){a=a|0;b=b|0;c=c|0;return ag(78,a|0,b|0,c|0)|0}function tf(a,b,c){a=a|0;b=b|0;c=c|0;return ag(79,a|0,b|0,c|0)|0}function tg(a,b,c){a=a|0;b=b|0;c=c|0;return ag(80,a|0,b|0,c|0)|0}function th(a,b,c){a=a|0;b=b|0;c=c|0;return ag(81,a|0,b|0,c|0)|0}function ti(a,b,c){a=a|0;b=b|0;c=c|0;return ag(82,a|0,b|0,c|0)|0}function tj(a,b,c){a=a|0;b=b|0;c=c|0;return ag(83,a|0,b|0,c|0)|0}function tk(a,b,c){a=a|0;b=b|0;c=c|0;return ag(84,a|0,b|0,c|0)|0}function tl(a,b,c){a=a|0;b=b|0;c=c|0;return ag(85,a|0,b|0,c|0)|0}function tm(a,b,c){a=a|0;b=b|0;c=c|0;return ag(86,a|0,b|0,c|0)|0}function tn(a,b,c){a=a|0;b=b|0;c=c|0;return ag(87,a|0,b|0,c|0)|0}function to(a,b,c){a=a|0;b=b|0;c=c|0;return ag(88,a|0,b|0,c|0)|0}function tp(a,b,c){a=a|0;b=b|0;c=c|0;return ag(89,a|0,b|0,c|0)|0}function tq(a,b,c){a=a|0;b=b|0;c=c|0;return ag(90,a|0,b|0,c|0)|0}function tr(a,b,c){a=a|0;b=b|0;c=c|0;return ag(91,a|0,b|0,c|0)|0}function ts(a,b,c){a=a|0;b=b|0;c=c|0;return ag(92,a|0,b|0,c|0)|0}function tt(a,b,c){a=a|0;b=b|0;c=c|0;return ag(93,a|0,b|0,c|0)|0}function tu(a,b,c){a=a|0;b=b|0;c=c|0;return ag(94,a|0,b|0,c|0)|0}function tv(a,b,c){a=a|0;b=b|0;c=c|0;return ag(95,a|0,b|0,c|0)|0}function tw(a,b,c){a=a|0;b=b|0;c=c|0;return ag(96,a|0,b|0,c|0)|0}function tx(a,b,c){a=a|0;b=b|0;c=c|0;return ag(97,a|0,b|0,c|0)|0}function ty(a,b,c){a=a|0;b=b|0;c=c|0;return ag(98,a|0,b|0,c|0)|0}function tz(a,b,c){a=a|0;b=b|0;c=c|0;return ag(99,a|0,b|0,c|0)|0}function tA(a,b,c){a=a|0;b=b|0;c=c|0;return ag(100,a|0,b|0,c|0)|0}function tB(a,b,c){a=a|0;b=b|0;c=c|0;return ag(101,a|0,b|0,c|0)|0}function tC(a,b,c){a=a|0;b=b|0;c=c|0;return ag(102,a|0,b|0,c|0)|0}function tD(a,b,c){a=a|0;b=b|0;c=c|0;return ag(103,a|0,b|0,c|0)|0}function tE(a,b,c){a=a|0;b=b|0;c=c|0;return ag(104,a|0,b|0,c|0)|0}function tF(a,b,c){a=a|0;b=b|0;c=c|0;return ag(105,a|0,b|0,c|0)|0}function tG(a,b,c){a=a|0;b=b|0;c=c|0;return ag(106,a|0,b|0,c|0)|0}function tH(a,b,c){a=a|0;b=b|0;c=c|0;return ag(107,a|0,b|0,c|0)|0}function tI(a,b,c){a=a|0;b=b|0;c=c|0;return ag(108,a|0,b|0,c|0)|0}function tJ(a,b,c){a=a|0;b=b|0;c=c|0;return ag(109,a|0,b|0,c|0)|0}function tK(a,b,c){a=a|0;b=b|0;c=c|0;return ag(110,a|0,b|0,c|0)|0}function tL(a,b,c){a=a|0;b=b|0;c=c|0;return ag(111,a|0,b|0,c|0)|0}function tM(a,b,c){a=a|0;b=b|0;c=c|0;return ag(112,a|0,b|0,c|0)|0}function tN(a,b,c){a=a|0;b=b|0;c=c|0;return ag(113,a|0,b|0,c|0)|0}function tO(a,b,c){a=a|0;b=b|0;c=c|0;return ag(114,a|0,b|0,c|0)|0}function tP(a,b,c){a=a|0;b=b|0;c=c|0;return ag(115,a|0,b|0,c|0)|0}function tQ(a,b,c){a=a|0;b=b|0;c=c|0;return ag(116,a|0,b|0,c|0)|0}function tR(a,b,c){a=a|0;b=b|0;c=c|0;return ag(117,a|0,b|0,c|0)|0}function tS(a,b,c){a=a|0;b=b|0;c=c|0;return ag(118,a|0,b|0,c|0)|0}function tT(a,b,c){a=a|0;b=b|0;c=c|0;return ag(119,a|0,b|0,c|0)|0}function tU(a,b,c){a=a|0;b=b|0;c=c|0;return ag(120,a|0,b|0,c|0)|0}function tV(a,b,c){a=a|0;b=b|0;c=c|0;return ag(121,a|0,b|0,c|0)|0}function tW(a,b,c){a=a|0;b=b|0;c=c|0;return ag(122,a|0,b|0,c|0)|0}function tX(a,b,c){a=a|0;b=b|0;c=c|0;return ag(123,a|0,b|0,c|0)|0}function tY(a,b,c){a=a|0;b=b|0;c=c|0;return ag(124,a|0,b|0,c|0)|0}function tZ(a){a=a|0;ci[a&255]()}function t_(){ag(0)}function t$(){ag(1)}function t0(){ag(2)}function t1(){ag(3)}function t2(){ag(4)}function t3(){ag(5)}function t4(){ag(6)}function t5(){ag(7)}function t6(){ag(8)}function t7(){ag(9)}function t8(){ag(10)}function t9(){ag(11)}function ua(){ag(12)}function ub(){ag(13)}function uc(){ag(14)}function ud(){ag(15)}function ue(){ag(16)}function uf(){ag(17)}function ug(){ag(18)}function uh(){ag(19)}function ui(){ag(20)}function uj(){ag(21)}function uk(){ag(22)}function ul(){ag(23)}function um(){ag(24)}function un(){ag(25)}function uo(){ag(26)}function up(){ag(27)}function uq(){ag(28)}function ur(){ag(29)}function us(){ag(30)}function ut(){ag(31)}function uu(){ag(32)}function uv(){ag(33)}function uw(){ag(34)}function ux(){ag(35)}function uy(){ag(36)}function uz(){ag(37)}function uA(){ag(38)}function uB(){ag(39)}function uC(){ag(40)}function uD(){ag(41)}function uE(){ag(42)}function uF(){ag(43)}function uG(){ag(44)}function uH(){ag(45)}function uI(){ag(46)}function uJ(){ag(47)}function uK(){ag(48)}function uL(){ag(49)}function uM(){ag(50)}function uN(){ag(51)}function uO(){ag(52)}function uP(){ag(53)}function uQ(){ag(54)}function uR(){ag(55)}function uS(){ag(56)}function uT(){ag(57)}function uU(){ag(58)}function uV(){ag(59)}function uW(){ag(60)}function uX(){ag(61)}function uY(){ag(62)}function uZ(){ag(63)}function u_(){ag(64)}function u$(){ag(65)}function u0(){ag(66)}function u1(){ag(67)}function u2(){ag(68)}function u3(){ag(69)}function u4(){ag(70)}function u5(){ag(71)}function u6(){ag(72)}function u7(){ag(73)}function u8(){ag(74)}function u9(){ag(75)}function va(){ag(76)}function vb(){ag(77)}function vc(){ag(78)}function vd(){ag(79)}function ve(){ag(80)}function vf(){ag(81)}function vg(){ag(82)}function vh(){ag(83)}function vi(){ag(84)}function vj(){ag(85)}function vk(){ag(86)}function vl(){ag(87)}function vm(){ag(88)}function vn(){ag(89)}function vo(){ag(90)}function vp(){ag(91)}function vq(){ag(92)}function vr(){ag(93)}function vs(){ag(94)}function vt(){ag(95)}function vu(){ag(96)}function vv(){ag(97)}function vw(){ag(98)}function vx(){ag(99)}function vy(){ag(100)}function vz(){ag(101)}function vA(){ag(102)}function vB(){ag(103)}function vC(){ag(104)}function vD(){ag(105)}function vE(){ag(106)}function vF(){ag(107)}function vG(){ag(108)}function vH(){ag(109)}function vI(){ag(110)}function vJ(){ag(111)}function vK(){ag(112)}function vL(){ag(113)}function vM(){ag(114)}function vN(){ag(115)}function vO(){ag(116)}function vP(){ag(117)}function vQ(){ag(118)}function vR(){ag(119)}function vS(){ag(120)}function vT(){ag(121)}function vU(){ag(122)}function vV(){ag(123)}function vW(){ag(124)}function vX(a,b,c){a=a|0;b=b|0;c=c|0;return cj[a&255](b|0,c|0)|0}function vY(a,b){a=a|0;b=b|0;return ag(0,a|0,b|0)|0}function vZ(a,b){a=a|0;b=b|0;return ag(1,a|0,b|0)|0}function v_(a,b){a=a|0;b=b|0;return ag(2,a|0,b|0)|0}function v$(a,b){a=a|0;b=b|0;return ag(3,a|0,b|0)|0}function v0(a,b){a=a|0;b=b|0;return ag(4,a|0,b|0)|0}function v1(a,b){a=a|0;b=b|0;return ag(5,a|0,b|0)|0}function v2(a,b){a=a|0;b=b|0;return ag(6,a|0,b|0)|0}function v3(a,b){a=a|0;b=b|0;return ag(7,a|0,b|0)|0}function v4(a,b){a=a|0;b=b|0;return ag(8,a|0,b|0)|0}function v5(a,b){a=a|0;b=b|0;return ag(9,a|0,b|0)|0}function v6(a,b){a=a|0;b=b|0;return ag(10,a|0,b|0)|0}function v7(a,b){a=a|0;b=b|0;return ag(11,a|0,b|0)|0}function v8(a,b){a=a|0;b=b|0;return ag(12,a|0,b|0)|0}function v9(a,b){a=a|0;b=b|0;return ag(13,a|0,b|0)|0}function wa(a,b){a=a|0;b=b|0;return ag(14,a|0,b|0)|0}function wb(a,b){a=a|0;b=b|0;return ag(15,a|0,b|0)|0}function wc(a,b){a=a|0;b=b|0;return ag(16,a|0,b|0)|0}function wd(a,b){a=a|0;b=b|0;return ag(17,a|0,b|0)|0}function we(a,b){a=a|0;b=b|0;return ag(18,a|0,b|0)|0}function wf(a,b){a=a|0;b=b|0;return ag(19,a|0,b|0)|0}function wg(a,b){a=a|0;b=b|0;return ag(20,a|0,b|0)|0}function wh(a,b){a=a|0;b=b|0;return ag(21,a|0,b|0)|0}function wi(a,b){a=a|0;b=b|0;return ag(22,a|0,b|0)|0}function wj(a,b){a=a|0;b=b|0;return ag(23,a|0,b|0)|0}function wk(a,b){a=a|0;b=b|0;return ag(24,a|0,b|0)|0}function wl(a,b){a=a|0;b=b|0;return ag(25,a|0,b|0)|0}function wm(a,b){a=a|0;b=b|0;return ag(26,a|0,b|0)|0}function wn(a,b){a=a|0;b=b|0;return ag(27,a|0,b|0)|0}function wo(a,b){a=a|0;b=b|0;return ag(28,a|0,b|0)|0}function wp(a,b){a=a|0;b=b|0;return ag(29,a|0,b|0)|0}function wq(a,b){a=a|0;b=b|0;return ag(30,a|0,b|0)|0}function wr(a,b){a=a|0;b=b|0;return ag(31,a|0,b|0)|0}function ws(a,b){a=a|0;b=b|0;return ag(32,a|0,b|0)|0}function wt(a,b){a=a|0;b=b|0;return ag(33,a|0,b|0)|0}function wu(a,b){a=a|0;b=b|0;return ag(34,a|0,b|0)|0}function wv(a,b){a=a|0;b=b|0;return ag(35,a|0,b|0)|0}function ww(a,b){a=a|0;b=b|0;return ag(36,a|0,b|0)|0}function wx(a,b){a=a|0;b=b|0;return ag(37,a|0,b|0)|0}function wy(a,b){a=a|0;b=b|0;return ag(38,a|0,b|0)|0}function wz(a,b){a=a|0;b=b|0;return ag(39,a|0,b|0)|0}function wA(a,b){a=a|0;b=b|0;return ag(40,a|0,b|0)|0}function wB(a,b){a=a|0;b=b|0;return ag(41,a|0,b|0)|0}function wC(a,b){a=a|0;b=b|0;return ag(42,a|0,b|0)|0}function wD(a,b){a=a|0;b=b|0;return ag(43,a|0,b|0)|0}function wE(a,b){a=a|0;b=b|0;return ag(44,a|0,b|0)|0}function wF(a,b){a=a|0;b=b|0;return ag(45,a|0,b|0)|0}function wG(a,b){a=a|0;b=b|0;return ag(46,a|0,b|0)|0}function wH(a,b){a=a|0;b=b|0;return ag(47,a|0,b|0)|0}function wI(a,b){a=a|0;b=b|0;return ag(48,a|0,b|0)|0}function wJ(a,b){a=a|0;b=b|0;return ag(49,a|0,b|0)|0}function wK(a,b){a=a|0;b=b|0;return ag(50,a|0,b|0)|0}function wL(a,b){a=a|0;b=b|0;return ag(51,a|0,b|0)|0}function wM(a,b){a=a|0;b=b|0;return ag(52,a|0,b|0)|0}function wN(a,b){a=a|0;b=b|0;return ag(53,a|0,b|0)|0}function wO(a,b){a=a|0;b=b|0;return ag(54,a|0,b|0)|0}function wP(a,b){a=a|0;b=b|0;return ag(55,a|0,b|0)|0}function wQ(a,b){a=a|0;b=b|0;return ag(56,a|0,b|0)|0}function wR(a,b){a=a|0;b=b|0;return ag(57,a|0,b|0)|0}function wS(a,b){a=a|0;b=b|0;return ag(58,a|0,b|0)|0}function wT(a,b){a=a|0;b=b|0;return ag(59,a|0,b|0)|0}function wU(a,b){a=a|0;b=b|0;return ag(60,a|0,b|0)|0}function wV(a,b){a=a|0;b=b|0;return ag(61,a|0,b|0)|0}function wW(a,b){a=a|0;b=b|0;return ag(62,a|0,b|0)|0}function wX(a,b){a=a|0;b=b|0;return ag(63,a|0,b|0)|0}function wY(a,b){a=a|0;b=b|0;return ag(64,a|0,b|0)|0}function wZ(a,b){a=a|0;b=b|0;return ag(65,a|0,b|0)|0}function w_(a,b){a=a|0;b=b|0;return ag(66,a|0,b|0)|0}function w$(a,b){a=a|0;b=b|0;return ag(67,a|0,b|0)|0}function w0(a,b){a=a|0;b=b|0;return ag(68,a|0,b|0)|0}function w1(a,b){a=a|0;b=b|0;return ag(69,a|0,b|0)|0}function w2(a,b){a=a|0;b=b|0;return ag(70,a|0,b|0)|0}function w3(a,b){a=a|0;b=b|0;return ag(71,a|0,b|0)|0}function w4(a,b){a=a|0;b=b|0;return ag(72,a|0,b|0)|0}function w5(a,b){a=a|0;b=b|0;return ag(73,a|0,b|0)|0}function w6(a,b){a=a|0;b=b|0;return ag(74,a|0,b|0)|0}function w7(a,b){a=a|0;b=b|0;return ag(75,a|0,b|0)|0}function w8(a,b){a=a|0;b=b|0;return ag(76,a|0,b|0)|0}function w9(a,b){a=a|0;b=b|0;return ag(77,a|0,b|0)|0}function xa(a,b){a=a|0;b=b|0;return ag(78,a|0,b|0)|0}function xb(a,b){a=a|0;b=b|0;return ag(79,a|0,b|0)|0}function xc(a,b){a=a|0;b=b|0;return ag(80,a|0,b|0)|0}function xd(a,b){a=a|0;b=b|0;return ag(81,a|0,b|0)|0}function xe(a,b){a=a|0;b=b|0;return ag(82,a|0,b|0)|0}function xf(a,b){a=a|0;b=b|0;return ag(83,a|0,b|0)|0}function xg(a,b){a=a|0;b=b|0;return ag(84,a|0,b|0)|0}function xh(a,b){a=a|0;b=b|0;return ag(85,a|0,b|0)|0}function xi(a,b){a=a|0;b=b|0;return ag(86,a|0,b|0)|0}function xj(a,b){a=a|0;b=b|0;return ag(87,a|0,b|0)|0}function xk(a,b){a=a|0;b=b|0;return ag(88,a|0,b|0)|0}function xl(a,b){a=a|0;b=b|0;return ag(89,a|0,b|0)|0}function xm(a,b){a=a|0;b=b|0;return ag(90,a|0,b|0)|0}function xn(a,b){a=a|0;b=b|0;return ag(91,a|0,b|0)|0}function xo(a,b){a=a|0;b=b|0;return ag(92,a|0,b|0)|0}function xp(a,b){a=a|0;b=b|0;return ag(93,a|0,b|0)|0}function xq(a,b){a=a|0;b=b|0;return ag(94,a|0,b|0)|0}function xr(a,b){a=a|0;b=b|0;return ag(95,a|0,b|0)|0}function xs(a,b){a=a|0;b=b|0;return ag(96,a|0,b|0)|0}function xt(a,b){a=a|0;b=b|0;return ag(97,a|0,b|0)|0}function xu(a,b){a=a|0;b=b|0;return ag(98,a|0,b|0)|0}function xv(a,b){a=a|0;b=b|0;return ag(99,a|0,b|0)|0}function xw(a,b){a=a|0;b=b|0;return ag(100,a|0,b|0)|0}function xx(a,b){a=a|0;b=b|0;return ag(101,a|0,b|0)|0}function xy(a,b){a=a|0;b=b|0;return ag(102,a|0,b|0)|0}function xz(a,b){a=a|0;b=b|0;return ag(103,a|0,b|0)|0}function xA(a,b){a=a|0;b=b|0;return ag(104,a|0,b|0)|0}function xB(a,b){a=a|0;b=b|0;return ag(105,a|0,b|0)|0}function xC(a,b){a=a|0;b=b|0;return ag(106,a|0,b|0)|0}function xD(a,b){a=a|0;b=b|0;return ag(107,a|0,b|0)|0}function xE(a,b){a=a|0;b=b|0;return ag(108,a|0,b|0)|0}function xF(a,b){a=a|0;b=b|0;return ag(109,a|0,b|0)|0}function xG(a,b){a=a|0;b=b|0;return ag(110,a|0,b|0)|0}function xH(a,b){a=a|0;b=b|0;return ag(111,a|0,b|0)|0}function xI(a,b){a=a|0;b=b|0;return ag(112,a|0,b|0)|0}function xJ(a,b){a=a|0;b=b|0;return ag(113,a|0,b|0)|0}function xK(a,b){a=a|0;b=b|0;return ag(114,a|0,b|0)|0}function xL(a,b){a=a|0;b=b|0;return ag(115,a|0,b|0)|0}function xM(a,b){a=a|0;b=b|0;return ag(116,a|0,b|0)|0}function xN(a,b){a=a|0;b=b|0;return ag(117,a|0,b|0)|0}function xO(a,b){a=a|0;b=b|0;return ag(118,a|0,b|0)|0}function xP(a,b){a=a|0;b=b|0;return ag(119,a|0,b|0)|0}function xQ(a,b){a=a|0;b=b|0;return ag(120,a|0,b|0)|0}function xR(a,b){a=a|0;b=b|0;return ag(121,a|0,b|0)|0}function xS(a,b){a=a|0;b=b|0;return ag(122,a|0,b|0)|0}function xT(a,b){a=a|0;b=b|0;return ag(123,a|0,b|0)|0}function xU(a,b){a=a|0;b=b|0;return ag(124,a|0,b|0)|0}function xV(a){a=a|0;ab(0);return 0}function xW(a){a=a|0;ab(1)}function xX(a,b){a=a|0;b=b|0;ab(2)}function xY(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;ab(3);return 0}function xZ(a,b,c){a=a|0;b=b|0;c=c|0;ab(4);return 0}function x_(){ab(5)}function x$(a,b){a=a|0;b=b|0;ab(6);return 0}
// EMSCRIPTEN_END_FUNCS
var cd=[xV,xV,j8,xV,j9,xV,ka,xV,kb,xV,kc,xV,kd,xV,ke,xV,kf,xV,kg,xV,kh,xV,ki,xV,kj,xV,kk,xV,kl,xV,km,xV,kn,xV,ko,xV,kp,xV,kq,xV,kr,xV,ks,xV,kt,xV,ku,xV,kv,xV,kw,xV,kx,xV,ky,xV,kz,xV,kA,xV,kB,xV,kC,xV,kD,xV,kE,xV,kF,xV,kG,xV,kH,xV,kI,xV,kJ,xV,kK,xV,kL,xV,kM,xV,kN,xV,kO,xV,kP,xV,kQ,xV,kR,xV,kS,xV,kT,xV,kU,xV,kV,xV,kW,xV,kX,xV,kY,xV,kZ,xV,k_,xV,k$,xV,k0,xV,k1,xV,k2,xV,k3,xV,k4,xV,k5,xV,k6,xV,k7,xV,k8,xV,k9,xV,la,xV,lb,xV,lc,xV,ld,xV,le,xV,lf,xV,lg,xV,lh,xV,li,xV,lj,xV,lk,xV,ll,xV,lm,xV,ln,xV,lo,xV,lp,xV,lq,xV,lr,xV,ls,xV,lt,xV,lu,xV,lv,xV,lw,xV,lx,xV,ly,xV,lz,xV,lA,xV,lB,xV,lC,xV,lD,xV,lE,xV,lF,xV,lG,xV,lH,xV,lI,xV,lJ,xV,lK,xV,lL,xV,lM,xV,lN,xV,lO,xV,lP,xV,lQ,xV,lR,xV,lS,xV,lT,xV,lU,xV,lV,xV,lW,xV,lX,xV,lY,xV,lZ,xV,l_,xV,l$,xV,l0,xV,l1,xV,l2,xV,l3,xV,l4,xV,iq,xV,hi,xV,hF,xV,ie,xV,hR,xV,iA,xV,hj,xV,iK,xV,hx,xV,iT,xV,iw,xV,hN,xV,jO,xV,ix,xV,hB,xV,h0,xV,il,xV,jF,xV,it,xV,iZ,xV,hP,xV,is,xV,iv,xV,jx,xV,jm,xV,i6,xV,hX,xV,ic,xV,i2,xV,hM,xV,jo,xV,iE,xV,he,xV,jv,xV,jM,xV,iQ,xV,jk,xV,hl,xV,hE,xV,iG,xV,g6,xV,iF,xV,je,xV,jz,xV,h7,xV,jn,xV,hO,xV,hW,xV,iO,xV,i8,xV,hk,xV,jr,xV,iY,xV,jg,xV,iy,xV,jw,xV,i7,xV,hS,xV,hD,xV,g8,xV,jp,xV,jK,xV,h4,xV,js,xV,jI,xV,iR,xV,hH,xV,ip,xV,jL,xV,hc,xV,ha,xV,iz,xV,im,xV,jH,xV,iP,xV,h2,xV,hh,xV,iX,xV,hp,xV,ia,xV,hK,xV,iI,xV,iB,xV,hv,xV,iD,xV,iW,xV,jq,xV,h9,xV,jf,xV,hd,xV,hT,xV,hU,xV,i$,xV,ho,xV,ju,xV,iN,xV,hn,xV,iM,xV,jl,xV,i4,xV,iS,xV,hQ,xV,io,xV,hr,xV,iH,xV,ib,xV,iJ,xV,jd,xV,hs,xV,i1,xV,hw,xV,hu,xV,h8,xV,iL,xV,hb,xV,jy,xV,hG,xV,hV,xV,g9,xV,jt,xV,hY,xV,hL,xV,hC,xV,i3,xV,i9,xV,hg,xV,g7,xV,iu,xV,id,xV,iU,xV,jb,xV,ja,xV,i_,xV,i5,xV,hA,xV,h6,xV,jN,xV,hz,xV,jR,xV,hm,xV,jS,xV,hq,xV,ht,xV,h3,xV,jc,xV,iV,xV,iC,xV,hy,xV,i0,xV,h1,xV,jh,xV,h5,xV,ir,xV,jJ,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV,xV];var ce=[xW,xW,l6,xW,l7,xW,l8,xW,l9,xW,ma,xW,mb,xW,mc,xW,md,xW,me,xW,mf,xW,mg,xW,mh,xW,mi,xW,mj,xW,mk,xW,ml,xW,mm,xW,mn,xW,mo,xW,mp,xW,mq,xW,mr,xW,ms,xW,mt,xW,mu,xW,mv,xW,mw,xW,mx,xW,my,xW,mz,xW,mA,xW,mB,xW,mC,xW,mD,xW,mE,xW,mF,xW,mG,xW,mH,xW,mI,xW,mJ,xW,mK,xW,mL,xW,mM,xW,mN,xW,mO,xW,mP,xW,mQ,xW,mR,xW,mS,xW,mT,xW,mU,xW,mV,xW,mW,xW,mX,xW,mY,xW,mZ,xW,m_,xW,m$,xW,m0,xW,m1,xW,m2,xW,m3,xW,m4,xW,m5,xW,m6,xW,m7,xW,m8,xW,m9,xW,na,xW,nb,xW,nc,xW,nd,xW,ne,xW,nf,xW,ng,xW,nh,xW,ni,xW,nj,xW,nk,xW,nl,xW,nm,xW,nn,xW,no,xW,np,xW,nq,xW,nr,xW,ns,xW,nt,xW,nu,xW,nv,xW,nw,xW,nx,xW,ny,xW,nz,xW,nA,xW,nB,xW,nC,xW,nD,xW,nE,xW,nF,xW,nG,xW,nH,xW,nI,xW,nJ,xW,nK,xW,nL,xW,nM,xW,nN,xW,nO,xW,nP,xW,nQ,xW,nR,xW,nS,xW,nT,xW,nU,xW,nV,xW,nW,xW,nX,xW,nY,xW,nZ,xW,n_,xW,n$,xW,n0,xW,n1,xW,n2,xW,xW,xW,xW,xW];var cf=[xX,xX,n4,xX,n5,xX,n6,xX,n7,xX,n8,xX,n9,xX,oa,xX,ob,xX,oc,xX,od,xX,oe,xX,of,xX,og,xX,oh,xX,oi,xX,oj,xX,ok,xX,ol,xX,om,xX,on,xX,oo,xX,op,xX,oq,xX,or,xX,os,xX,ot,xX,ou,xX,ov,xX,ow,xX,ox,xX,oy,xX,oz,xX,oA,xX,oB,xX,oC,xX,oD,xX,oE,xX,oF,xX,oG,xX,oH,xX,oI,xX,oJ,xX,oK,xX,oL,xX,oM,xX,oN,xX,oO,xX,oP,xX,oQ,xX,oR,xX,oS,xX,oT,xX,oU,xX,oV,xX,oW,xX,oX,xX,oY,xX,oZ,xX,o_,xX,o$,xX,o0,xX,o1,xX,o2,xX,o3,xX,o4,xX,o5,xX,o6,xX,o7,xX,o8,xX,o9,xX,pa,xX,pb,xX,pc,xX,pd,xX,pe,xX,pf,xX,pg,xX,ph,xX,pi,xX,pj,xX,pk,xX,pl,xX,pm,xX,pn,xX,po,xX,pp,xX,pq,xX,pr,xX,ps,xX,pt,xX,pu,xX,pv,xX,pw,xX,px,xX,py,xX,pz,xX,pA,xX,pB,xX,pC,xX,pD,xX,pE,xX,pF,xX,pG,xX,pH,xX,pI,xX,pJ,xX,pK,xX,pL,xX,pM,xX,pN,xX,pO,xX,pP,xX,pQ,xX,pR,xX,pS,xX,pT,xX,pU,xX,pV,xX,pW,xX,pX,xX,pY,xX,pZ,xX,p_,xX,p$,xX,p0,xX,dy,xX,fW,xX,fY,xX,eL,xX,eH,xX,h_,xX,dA,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX,xX];var cg=[xY,xY,p2,xY,p3,xY,p4,xY,p5,xY,p6,xY,p7,xY,p8,xY,p9,xY,qa,xY,qb,xY,qc,xY,qd,xY,qe,xY,qf,xY,qg,xY,qh,xY,qi,xY,qj,xY,qk,xY,ql,xY,qm,xY,qn,xY,qo,xY,qp,xY,qq,xY,qr,xY,qs,xY,qt,xY,qu,xY,qv,xY,qw,xY,qx,xY,qy,xY,qz,xY,qA,xY,qB,xY,qC,xY,qD,xY,qE,xY,qF,xY,qG,xY,qH,xY,qI,xY,qJ,xY,qK,xY,qL,xY,qM,xY,qN,xY,qO,xY,qP,xY,qQ,xY,qR,xY,qS,xY,qT,xY,qU,xY,qV,xY,qW,xY,qX,xY,qY,xY,qZ,xY,q_,xY,q$,xY,q0,xY,q1,xY,q2,xY,q3,xY,q4,xY,q5,xY,q6,xY,q7,xY,q8,xY,q9,xY,ra,xY,rb,xY,rc,xY,rd,xY,re,xY,rf,xY,rg,xY,rh,xY,ri,xY,rj,xY,rk,xY,rl,xY,rm,xY,rn,xY,ro,xY,rp,xY,rq,xY,rr,xY,rs,xY,rt,xY,ru,xY,rv,xY,rw,xY,rx,xY,ry,xY,rz,xY,rA,xY,rB,xY,rC,xY,rD,xY,rE,xY,rF,xY,rG,xY,rH,xY,rI,xY,rJ,xY,rK,xY,rL,xY,rM,xY,rN,xY,rO,xY,rP,xY,rQ,xY,rR,xY,rS,xY,rT,xY,rU,xY,rV,xY,rW,xY,rX,xY,rY,xY,rZ,xY,r_,xY,jG,xY,g5,xY,gh,xY,fA,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY,xY];var ch=[xZ,xZ,r0,xZ,r1,xZ,r2,xZ,r3,xZ,r4,xZ,r5,xZ,r6,xZ,r7,xZ,r8,xZ,r9,xZ,sa,xZ,sb,xZ,sc,xZ,sd,xZ,se,xZ,sf,xZ,sg,xZ,sh,xZ,si,xZ,sj,xZ,sk,xZ,sl,xZ,sm,xZ,sn,xZ,so,xZ,sp,xZ,sq,xZ,sr,xZ,ss,xZ,st,xZ,su,xZ,sv,xZ,sw,xZ,sx,xZ,sy,xZ,sz,xZ,sA,xZ,sB,xZ,sC,xZ,sD,xZ,sE,xZ,sF,xZ,sG,xZ,sH,xZ,sI,xZ,sJ,xZ,sK,xZ,sL,xZ,sM,xZ,sN,xZ,sO,xZ,sP,xZ,sQ,xZ,sR,xZ,sS,xZ,sT,xZ,sU,xZ,sV,xZ,sW,xZ,sX,xZ,sY,xZ,sZ,xZ,s_,xZ,s$,xZ,s0,xZ,s1,xZ,s2,xZ,s3,xZ,s4,xZ,s5,xZ,s6,xZ,s7,xZ,s8,xZ,s9,xZ,ta,xZ,tb,xZ,tc,xZ,td,xZ,te,xZ,tf,xZ,tg,xZ,th,xZ,ti,xZ,tj,xZ,tk,xZ,tl,xZ,tm,xZ,tn,xZ,to,xZ,tp,xZ,tq,xZ,tr,xZ,ts,xZ,tt,xZ,tu,xZ,tv,xZ,tw,xZ,tx,xZ,ty,xZ,tz,xZ,tA,xZ,tB,xZ,tC,xZ,tD,xZ,tE,xZ,tF,xZ,tG,xZ,tH,xZ,tI,xZ,tJ,xZ,tK,xZ,tL,xZ,tM,xZ,tN,xZ,tO,xZ,tP,xZ,tQ,xZ,tR,xZ,tS,xZ,tT,xZ,tU,xZ,tV,xZ,tW,xZ,tX,xZ,tY,xZ,hJ,xZ,g1,xZ,gU,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ,xZ];var ci=[x_,x_,t_,x_,t$,x_,t0,x_,t1,x_,t2,x_,t3,x_,t4,x_,t5,x_,t6,x_,t7,x_,t8,x_,t9,x_,ua,x_,ub,x_,uc,x_,ud,x_,ue,x_,uf,x_,ug,x_,uh,x_,ui,x_,uj,x_,uk,x_,ul,x_,um,x_,un,x_,uo,x_,up,x_,uq,x_,ur,x_,us,x_,ut,x_,uu,x_,uv,x_,uw,x_,ux,x_,uy,x_,uz,x_,uA,x_,uB,x_,uC,x_,uD,x_,uE,x_,uF,x_,uG,x_,uH,x_,uI,x_,uJ,x_,uK,x_,uL,x_,uM,x_,uN,x_,uO,x_,uP,x_,uQ,x_,uR,x_,uS,x_,uT,x_,uU,x_,uV,x_,uW,x_,uX,x_,uY,x_,uZ,x_,u_,x_,u$,x_,u0,x_,u1,x_,u2,x_,u3,x_,u4,x_,u5,x_,u6,x_,u7,x_,u8,x_,u9,x_,va,x_,vb,x_,vc,x_,vd,x_,ve,x_,vf,x_,vg,x_,vh,x_,vi,x_,vj,x_,vk,x_,vl,x_,vm,x_,vn,x_,vo,x_,vp,x_,vq,x_,vr,x_,vs,x_,vt,x_,vu,x_,vv,x_,vw,x_,vx,x_,vy,x_,vz,x_,vA,x_,vB,x_,vC,x_,vD,x_,vE,x_,vF,x_,vG,x_,vH,x_,vI,x_,vJ,x_,vK,x_,vL,x_,vM,x_,vN,x_,vO,x_,vP,x_,vQ,x_,vR,x_,vS,x_,vT,x_,vU,x_,vV,x_,vW,x_,x_,x_,x_,x_];var cj=[x$,x$,vY,x$,vZ,x$,v_,x$,v$,x$,v0,x$,v1,x$,v2,x$,v3,x$,v4,x$,v5,x$,v6,x$,v7,x$,v8,x$,v9,x$,wa,x$,wb,x$,wc,x$,wd,x$,we,x$,wf,x$,wg,x$,wh,x$,wi,x$,wj,x$,wk,x$,wl,x$,wm,x$,wn,x$,wo,x$,wp,x$,wq,x$,wr,x$,ws,x$,wt,x$,wu,x$,wv,x$,ww,x$,wx,x$,wy,x$,wz,x$,wA,x$,wB,x$,wC,x$,wD,x$,wE,x$,wF,x$,wG,x$,wH,x$,wI,x$,wJ,x$,wK,x$,wL,x$,wM,x$,wN,x$,wO,x$,wP,x$,wQ,x$,wR,x$,wS,x$,wT,x$,wU,x$,wV,x$,wW,x$,wX,x$,wY,x$,wZ,x$,w_,x$,w$,x$,w0,x$,w1,x$,w2,x$,w3,x$,w4,x$,w5,x$,w6,x$,w7,x$,w8,x$,w9,x$,xa,x$,xb,x$,xc,x$,xd,x$,xe,x$,xf,x$,xg,x$,xh,x$,xi,x$,xj,x$,xk,x$,xl,x$,xm,x$,xn,x$,xo,x$,xp,x$,xq,x$,xr,x$,xs,x$,xt,x$,xu,x$,xv,x$,xw,x$,xx,x$,xy,x$,xz,x$,xA,x$,xB,x$,xC,x$,xD,x$,xE,x$,xF,x$,xG,x$,xH,x$,xI,x$,xJ,x$,xK,x$,xL,x$,xM,x$,xN,x$,xO,x$,xP,x$,xQ,x$,xR,x$,xS,x$,xT,x$,xU,x$,x$,x$,x$,x$];return{_luaL_checkstack:gH,_strlen:j_,_strcat:j4,_lua_pushlightuserdata:c7,_lua_createtable:di,_luaL_optinteger:gN,_lua_rawset:dn,_strncpy:j3,_lua_setmetatable:dq,_lua_concat:dG,_luaL_optlstring:gD,_luaopen_io:h0,_memcpy:j$,_lua_pcall:dx,_lua_pushthread:c8,_lua_close:fX,_luaopen_math:iv,_lua_setupvalue:dJ,_lua_replace:cP,_memcmp:j5,_lua_gethookmask:eh,_lua_xmove:cC,_lua_load:dB,_lua_touserdata:cZ,_lua_rawget:dg,_free:jV,_lua_pushcclosure:dd,_lua_pushstring:da,_tolower:j6,_lua_getfenv:dk,_luaopen_string:jk,_lua_isuserdata:cR,_luaL_buffinit:gt,_lua_resume:eE,_lua_iscfunction:cM,_lua_remove:cH,_luaL_checkoption:gC,_lua_tointeger:c$,_lua_pushvfstring:db,_luaL_prepbuffer:gY,_lua_isnumber:cS,_luaL_checklstring:gE,_lua_isstring:cQ,_lua_pushlstring:c9,_lua_setfenv:dv,_lua_lessthan:cV,_luaopen_os:iY,_lua_yield:eI,_luaL_checkany:gJ,_luaL_addstring:gW,_lua_pushfstring:dc,_lua_insert:cI,_lua_tolstring:c0,_lua_pushnil:c3,_luaL_register:gQ,_lua_getupvalue:du,_lua_checkstack:cN,_luaopen_package:jH,_luaL_pushresult:gX,_lua_topointer:c2,_lua_error:dE,_lua_gettable:de,_luaopen_debug:hK,_lua_tonumber:cW,_luaL_checkinteger:gM,_lua_getstack:ej,_lua_gettop:cF,_lua_getlocal:el,_luaL_checktype:gI,_lua_newuserdata:dH,_lua_settable:dl,_luaL_addlstring:gV,_luaL_loadbuffer:g2,_lua_toboolean:cX,_lua_setallocf:dt,_memset:j2,_lua_gethook:eg,_lua_gethookcount:ei,_luaL_openlibs:jT,_lua_setlocal:em,_lua_tothread:c_,_lua_newstate:fV,_lua_pushvalue:cJ,_lua_tocfunction:cY,_lua_newthread:cO,_lua_typename:cL,_luaL_argerror:gy,_lua_rawgeti:dh,_testSetjmp:j1,_lua_sethook:ef,_lua_equal:cU,_luaL_callmeta:gP,_lua_call:dw,_luaL_typerror:gA,_malloc:jU,_lua_rawequal:cT,_lua_type:cK,_lua_getfield:df,_lua_objlen:c1,_luaL_checknumber:gK,_luaL_newmetatable:gF,_lua_getmetatable:dj,_luaL_newstate:g4,_luaopen_base:g7,_luaL_gsub:gT,_luaL_addvalue:gZ,_lua_atpanic:cE,_luaL_getmetafield:gO,_lua_getinfo:en,_lua_gc:dD,_lua_settop:cG,_lua_pushboolean:c6,_lua_setfield:dm,_luaL_ref:g_,_lua_next:dF,_luaL_findtable:gS,_luaL_checkudata:gG,_realloc:jW,_luaopen_table:i8,_lua_setlevel:cD,_luaL_loadfile:g0,_lua_pushnumber:c4,_lua_rawseti:dp,_saveSetjmp:j0,_luaL_optnumber:gL,_lua_pushinteger:c5,_lua_getallocf:ds,_lua_dump:dC,_lua_status:dr,_luaL_where:gB,_lua_cpcall:dz,_luaL_error:gz,_luaL_loadstring:g3,_luaL_unref:g$,runPostSets:cA,stackAlloc:ck,stackSave:cl,stackRestore:cm,setThrew:cn,setTempRet0:cq,setTempRet1:cr,setTempRet2:cs,setTempRet3:ct,setTempRet4:cu,setTempRet5:cv,setTempRet6:cw,setTempRet7:cx,setTempRet8:cy,setTempRet9:cz,dynCall_ii:j7,dynCall_vi:l5,dynCall_vii:n3,dynCall_iiiii:p1,dynCall_iiii:r$,dynCall_v:tZ,dynCall_iii:vX}})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "jsCall": jsCall, "invoke_ii": invoke_ii, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_iiiii": invoke_iiiii, "invoke_iiii": invoke_iiii, "invoke_v": invoke_v, "invoke_iii": invoke_iii, "_llvm_lifetime_end": _llvm_lifetime_end, "_lseek": _lseek, "__scanString": __scanString, "_fclose": _fclose, "_strtoul": _strtoul, "__isFloat": __isFloat, "_fflush": _fflush, "_fputc": _fputc, "_fwrite": _fwrite, "_strncmp": _strncmp, "_send": _send, "_fputs": _fputs, "_tmpnam": _tmpnam, "_isspace": _isspace, "_localtime": _localtime, "_read": _read, "_ceil": _ceil, "_strstr": _strstr, "_fsync": _fsync, "_fscanf": _fscanf, "_fmod": _fmod, "_remove": _remove, "_modf": _modf, "_strcmp": _strcmp, "_memchr": _memchr, "_llvm_va_end": _llvm_va_end, "_tmpfile": _tmpfile, "_snprintf": _snprintf, "_fgetc": _fgetc, "_cosh": _cosh, "_fgets": _fgets, "_close": _close, "_strchr": _strchr, "_asin": _asin, "_clock": _clock, "___setErrNo": ___setErrNo, "_isxdigit": _isxdigit, "_ftell": _ftell, "_exit": _exit, "_sprintf": _sprintf, "_strrchr": _strrchr, "_freopen": _freopen, "_strcspn": _strcspn, "__isLeapYear": __isLeapYear, "_ferror": _ferror, "_gmtime": _gmtime, "_localtime_r": _localtime_r, "_sinh": _sinh, "_recv": _recv, "_cos": _cos, "_putchar": _putchar, "_islower": _islower, "__exit": __exit, "_isupper": _isupper, "_strftime": _strftime, "_rand": _rand, "_tzset": _tzset, "_setlocale": _setlocale, "_ldexp": _ldexp, "_toupper": _toupper, "_pread": _pread, "_fopen": _fopen, "_open": _open, "_frexp": _frexp, "__arraySum": __arraySum, "_log": _log, "_isalnum": _isalnum, "_mktime": _mktime, "_system": _system, "_isalpha": _isalpha, "_rmdir": _rmdir, "_log10": _log10, "_fread": _fread, "__reallyNegative": __reallyNegative, "__formatString": __formatString, "_getenv": _getenv, "_llvm_pow_f64": _llvm_pow_f64, "_sbrk": _sbrk, "_tanh": _tanh, "_localeconv": _localeconv, "___errno_location": ___errno_location, "_strerror": _strerror, "_llvm_lifetime_start": _llvm_lifetime_start, "__parseInt": __parseInt, "_ungetc": _ungetc, "_rename": _rename, "_sysconf": _sysconf, "_srand": _srand, "_abort": _abort, "_fprintf": _fprintf, "_tan": _tan, "___buildEnvironment": ___buildEnvironment, "_feof": _feof, "__addDays": __addDays, "_strncat": _strncat, "_gmtime_r": _gmtime_r, "_ispunct": _ispunct, "_clearerr": _clearerr, "_fabs": _fabs, "_floor": _floor, "_fseek": _fseek, "_sqrt": _sqrt, "_write": _write, "_sin": _sin, "_longjmp": _longjmp, "_atan": _atan, "_strpbrk": _strpbrk, "_unlink": _unlink, "_acos": _acos, "_pwrite": _pwrite, "_strerror_r": _strerror_r, "_difftime": _difftime, "_iscntrl": _iscntrl, "_atan2": _atan2, "_exp": _exp, "_time": _time, "_setvbuf": _setvbuf, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "NaN": NaN, "Infinity": Infinity, "_stdin": _stdin, "_stderr": _stderr, "_stdout": _stdout }, buffer);
var _luaL_checkstack = Module["_luaL_checkstack"] = asm["_luaL_checkstack"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var _strcat = Module["_strcat"] = asm["_strcat"];
var _lua_pushlightuserdata = Module["_lua_pushlightuserdata"] = asm["_lua_pushlightuserdata"];
var _lua_createtable = Module["_lua_createtable"] = asm["_lua_createtable"];
var _luaL_optinteger = Module["_luaL_optinteger"] = asm["_luaL_optinteger"];
var _lua_rawset = Module["_lua_rawset"] = asm["_lua_rawset"];
var _strncpy = Module["_strncpy"] = asm["_strncpy"];
var _lua_setmetatable = Module["_lua_setmetatable"] = asm["_lua_setmetatable"];
var _lua_concat = Module["_lua_concat"] = asm["_lua_concat"];
var _luaL_optlstring = Module["_luaL_optlstring"] = asm["_luaL_optlstring"];
var _luaopen_io = Module["_luaopen_io"] = asm["_luaopen_io"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _lua_pcall = Module["_lua_pcall"] = asm["_lua_pcall"];
var _lua_pushthread = Module["_lua_pushthread"] = asm["_lua_pushthread"];
var _lua_close = Module["_lua_close"] = asm["_lua_close"];
var _luaopen_math = Module["_luaopen_math"] = asm["_luaopen_math"];
var _lua_setupvalue = Module["_lua_setupvalue"] = asm["_lua_setupvalue"];
var _lua_replace = Module["_lua_replace"] = asm["_lua_replace"];
var _memcmp = Module["_memcmp"] = asm["_memcmp"];
var _lua_gethookmask = Module["_lua_gethookmask"] = asm["_lua_gethookmask"];
var _lua_xmove = Module["_lua_xmove"] = asm["_lua_xmove"];
var _lua_load = Module["_lua_load"] = asm["_lua_load"];
var _lua_touserdata = Module["_lua_touserdata"] = asm["_lua_touserdata"];
var _lua_rawget = Module["_lua_rawget"] = asm["_lua_rawget"];
var _free = Module["_free"] = asm["_free"];
var _lua_pushcclosure = Module["_lua_pushcclosure"] = asm["_lua_pushcclosure"];
var _lua_pushstring = Module["_lua_pushstring"] = asm["_lua_pushstring"];
var _tolower = Module["_tolower"] = asm["_tolower"];
var _lua_getfenv = Module["_lua_getfenv"] = asm["_lua_getfenv"];
var _luaopen_string = Module["_luaopen_string"] = asm["_luaopen_string"];
var _lua_isuserdata = Module["_lua_isuserdata"] = asm["_lua_isuserdata"];
var _luaL_buffinit = Module["_luaL_buffinit"] = asm["_luaL_buffinit"];
var _lua_resume = Module["_lua_resume"] = asm["_lua_resume"];
var _lua_iscfunction = Module["_lua_iscfunction"] = asm["_lua_iscfunction"];
var _lua_remove = Module["_lua_remove"] = asm["_lua_remove"];
var _luaL_checkoption = Module["_luaL_checkoption"] = asm["_luaL_checkoption"];
var _lua_tointeger = Module["_lua_tointeger"] = asm["_lua_tointeger"];
var _lua_pushvfstring = Module["_lua_pushvfstring"] = asm["_lua_pushvfstring"];
var _luaL_prepbuffer = Module["_luaL_prepbuffer"] = asm["_luaL_prepbuffer"];
var _lua_isnumber = Module["_lua_isnumber"] = asm["_lua_isnumber"];
var _luaL_checklstring = Module["_luaL_checklstring"] = asm["_luaL_checklstring"];
var _lua_isstring = Module["_lua_isstring"] = asm["_lua_isstring"];
var _lua_pushlstring = Module["_lua_pushlstring"] = asm["_lua_pushlstring"];
var _lua_setfenv = Module["_lua_setfenv"] = asm["_lua_setfenv"];
var _lua_lessthan = Module["_lua_lessthan"] = asm["_lua_lessthan"];
var _luaopen_os = Module["_luaopen_os"] = asm["_luaopen_os"];
var _lua_yield = Module["_lua_yield"] = asm["_lua_yield"];
var _luaL_checkany = Module["_luaL_checkany"] = asm["_luaL_checkany"];
var _luaL_addstring = Module["_luaL_addstring"] = asm["_luaL_addstring"];
var _lua_pushfstring = Module["_lua_pushfstring"] = asm["_lua_pushfstring"];
var _lua_insert = Module["_lua_insert"] = asm["_lua_insert"];
var _lua_tolstring = Module["_lua_tolstring"] = asm["_lua_tolstring"];
var _lua_pushnil = Module["_lua_pushnil"] = asm["_lua_pushnil"];
var _luaL_register = Module["_luaL_register"] = asm["_luaL_register"];
var _lua_getupvalue = Module["_lua_getupvalue"] = asm["_lua_getupvalue"];
var _lua_checkstack = Module["_lua_checkstack"] = asm["_lua_checkstack"];
var _luaopen_package = Module["_luaopen_package"] = asm["_luaopen_package"];
var _luaL_pushresult = Module["_luaL_pushresult"] = asm["_luaL_pushresult"];
var _lua_topointer = Module["_lua_topointer"] = asm["_lua_topointer"];
var _lua_error = Module["_lua_error"] = asm["_lua_error"];
var _lua_gettable = Module["_lua_gettable"] = asm["_lua_gettable"];
var _luaopen_debug = Module["_luaopen_debug"] = asm["_luaopen_debug"];
var _lua_tonumber = Module["_lua_tonumber"] = asm["_lua_tonumber"];
var _luaL_checkinteger = Module["_luaL_checkinteger"] = asm["_luaL_checkinteger"];
var _lua_getstack = Module["_lua_getstack"] = asm["_lua_getstack"];
var _lua_gettop = Module["_lua_gettop"] = asm["_lua_gettop"];
var _lua_getlocal = Module["_lua_getlocal"] = asm["_lua_getlocal"];
var _luaL_checktype = Module["_luaL_checktype"] = asm["_luaL_checktype"];
var _lua_newuserdata = Module["_lua_newuserdata"] = asm["_lua_newuserdata"];
var _lua_settable = Module["_lua_settable"] = asm["_lua_settable"];
var _luaL_addlstring = Module["_luaL_addlstring"] = asm["_luaL_addlstring"];
var _luaL_loadbuffer = Module["_luaL_loadbuffer"] = asm["_luaL_loadbuffer"];
var _lua_toboolean = Module["_lua_toboolean"] = asm["_lua_toboolean"];
var _lua_setallocf = Module["_lua_setallocf"] = asm["_lua_setallocf"];
var _memset = Module["_memset"] = asm["_memset"];
var _lua_gethook = Module["_lua_gethook"] = asm["_lua_gethook"];
var _lua_gethookcount = Module["_lua_gethookcount"] = asm["_lua_gethookcount"];
var _luaL_openlibs = Module["_luaL_openlibs"] = asm["_luaL_openlibs"];
var _lua_setlocal = Module["_lua_setlocal"] = asm["_lua_setlocal"];
var _lua_tothread = Module["_lua_tothread"] = asm["_lua_tothread"];
var _lua_newstate = Module["_lua_newstate"] = asm["_lua_newstate"];
var _lua_pushvalue = Module["_lua_pushvalue"] = asm["_lua_pushvalue"];
var _lua_tocfunction = Module["_lua_tocfunction"] = asm["_lua_tocfunction"];
var _lua_newthread = Module["_lua_newthread"] = asm["_lua_newthread"];
var _lua_typename = Module["_lua_typename"] = asm["_lua_typename"];
var _luaL_argerror = Module["_luaL_argerror"] = asm["_luaL_argerror"];
var _lua_rawgeti = Module["_lua_rawgeti"] = asm["_lua_rawgeti"];
var _testSetjmp = Module["_testSetjmp"] = asm["_testSetjmp"];
var _lua_sethook = Module["_lua_sethook"] = asm["_lua_sethook"];
var _lua_equal = Module["_lua_equal"] = asm["_lua_equal"];
var _luaL_callmeta = Module["_luaL_callmeta"] = asm["_luaL_callmeta"];
var _lua_call = Module["_lua_call"] = asm["_lua_call"];
var _luaL_typerror = Module["_luaL_typerror"] = asm["_luaL_typerror"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _lua_rawequal = Module["_lua_rawequal"] = asm["_lua_rawequal"];
var _lua_type = Module["_lua_type"] = asm["_lua_type"];
var _lua_getfield = Module["_lua_getfield"] = asm["_lua_getfield"];
var _lua_objlen = Module["_lua_objlen"] = asm["_lua_objlen"];
var _luaL_checknumber = Module["_luaL_checknumber"] = asm["_luaL_checknumber"];
var _luaL_newmetatable = Module["_luaL_newmetatable"] = asm["_luaL_newmetatable"];
var _lua_getmetatable = Module["_lua_getmetatable"] = asm["_lua_getmetatable"];
var _luaL_newstate = Module["_luaL_newstate"] = asm["_luaL_newstate"];
var _luaopen_base = Module["_luaopen_base"] = asm["_luaopen_base"];
var _luaL_gsub = Module["_luaL_gsub"] = asm["_luaL_gsub"];
var _luaL_addvalue = Module["_luaL_addvalue"] = asm["_luaL_addvalue"];
var _lua_atpanic = Module["_lua_atpanic"] = asm["_lua_atpanic"];
var _luaL_getmetafield = Module["_luaL_getmetafield"] = asm["_luaL_getmetafield"];
var _lua_getinfo = Module["_lua_getinfo"] = asm["_lua_getinfo"];
var _lua_gc = Module["_lua_gc"] = asm["_lua_gc"];
var _lua_settop = Module["_lua_settop"] = asm["_lua_settop"];
var _lua_pushboolean = Module["_lua_pushboolean"] = asm["_lua_pushboolean"];
var _lua_setfield = Module["_lua_setfield"] = asm["_lua_setfield"];
var _luaL_ref = Module["_luaL_ref"] = asm["_luaL_ref"];
var _lua_next = Module["_lua_next"] = asm["_lua_next"];
var _luaL_findtable = Module["_luaL_findtable"] = asm["_luaL_findtable"];
var _luaL_checkudata = Module["_luaL_checkudata"] = asm["_luaL_checkudata"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _luaopen_table = Module["_luaopen_table"] = asm["_luaopen_table"];
var _lua_setlevel = Module["_lua_setlevel"] = asm["_lua_setlevel"];
var _luaL_loadfile = Module["_luaL_loadfile"] = asm["_luaL_loadfile"];
var _lua_pushnumber = Module["_lua_pushnumber"] = asm["_lua_pushnumber"];
var _lua_rawseti = Module["_lua_rawseti"] = asm["_lua_rawseti"];
var _saveSetjmp = Module["_saveSetjmp"] = asm["_saveSetjmp"];
var _luaL_optnumber = Module["_luaL_optnumber"] = asm["_luaL_optnumber"];
var _lua_pushinteger = Module["_lua_pushinteger"] = asm["_lua_pushinteger"];
var _lua_getallocf = Module["_lua_getallocf"] = asm["_lua_getallocf"];
var _lua_dump = Module["_lua_dump"] = asm["_lua_dump"];
var _lua_status = Module["_lua_status"] = asm["_lua_status"];
var _luaL_where = Module["_luaL_where"] = asm["_luaL_where"];
var _lua_cpcall = Module["_lua_cpcall"] = asm["_lua_cpcall"];
var _luaL_error = Module["_luaL_error"] = asm["_luaL_error"];
var _luaL_loadstring = Module["_luaL_loadstring"] = asm["_luaL_loadstring"];
var _luaL_unref = Module["_luaL_unref"] = asm["_luaL_unref"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_iiiii = Module["dynCall_iiiii"] = asm["dynCall_iiiii"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };
// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;
// === Auto-generated postamble setup entry stuff ===
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var preloadStartTime = null;
var calledMain = false;
Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  initialStackTop = STACKTOP;
  try {
    var ret = Module['_main'](argc, argv, 0);
    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      throw e;
    }
  } finally {
    calledMain = true;
  }
}
function run(args) {
  args = args || Module['arguments'];
  if (preloadStartTime === null) preloadStartTime = Date.now();
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }
  preRun();
  if (runDependencies > 0) {
    // a preRun added a dependency, run will be called later
    return;
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    calledRun = true;
    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }
    postRun();
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;
function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;
  // exit the runtime
  exitRuntime();
  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371
  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;
function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }
  ABORT = true;
  EXITSTATUS = 1;
  throw 'abort() at ' + (new Error().stack);
}
Module['abort'] = Module.abort = abort;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
// {{MODULE_ADDITIONS}}


////////////////////////////////////////////////////////////////////////////////

var C = { };

var F = Module.cwrap;

////////////////////////////////////////////////////////////////////////////////
// c_type.js: basic C "types" for Lua 5.1 C API cwraps (fragment file)
// This file is a part of lua5.1.js project:
// Copyright (c) LogicEditor <info@logiceditor.com>
// Copyright (c) lua5.1.js authors
// See file `COPYRIGHT` for the license
////////////////////////////////////////////////////////////////////////////////

var void_t = null;
var void_ptr_t = "number";
var void_ptr_t_ptr_t = "number";
var const_void_ptr_t = "number";
var int_t = "number";
var size_t_ptr_t = "number";
var size_t = "number";
var const_char_ptr_t = "string";

var NULL = 0;

////////////////////////////////////////////////////////////////////////////////
// lua.h.js: Lua 5.1 C API, lua.h definitions (fragment file)
// This file is a part of lua5.1.js project:
// Copyright (c) LogicEditor <info@logiceditor.com>
// Copyright (c) lua5.1.js authors
// See file `COPYRIGHT` for the license
// Based on original Lua 5.1.5 header files:
// Copyright (c) 1994-2012 Lua.org, PUC-Rio
////////////////////////////////////////////////////////////////////////////////
// Note: Keeping this file as close to Lua sources as possible.
//       This includes avoiding breaking lines at 80 char limit
//       to keep original formatting despite JS code being somewhat longer.
////////////////////////////////////////////////////////////////////////////////

var lua_Number = "number";
var lua_Integer = "number";

C.LUA_VERSION     = "Lua 5.1";
C.LUA_RELEASE     = "Lua 5.1.5";
C.LUA_VERSION_NUM = 501;
C.LUA_COPYRIGHT   = "Copyright (C) 1994-2012 Lua.org, PUC-Rio";
C.LUA_AUTHORS     = "R. Ierusalimschy, L. H. de Figueiredo & W. Celes";

/* mark for precompiled code (`<esc>Lua') */
C.LUA_SIGNATURE = "\033Lua";

/* option for multiple returns in `lua_pcall' and `lua_call' */
C.LUA_MULTRET = (-1);

/*
** pseudo-indices
*/
C.LUA_REGISTRYINDEX = (-10000);
C.LUA_ENVIRONINDEX  = (-10001);
C.LUA_GLOBALSINDEX  = (-10002);
C.lua_upvalueindex  = function(i) { return (C.LUA_GLOBALSINDEX-(i)); };

/* thread status; 0 is OK */
C.LUA_YIELD     = 1;
C.LUA_ERRRUN    = 2;
C.LUA_ERRSYNTAX = 3;
C.LUA_ERRMEM    = 4;
C.LUA_ERRERR    = 5;

var lua_State = "number";

// typedef int (*lua_CFunction) (lua_State *L);
var lua_CFunction = "number";

/*
** functions that read/write blocks when loading/dumping Lua chunks
*/
// typedef const char * (*lua_Reader) (lua_State *L, void *ud, size_t *sz);
var lua_Reader = "number";

// typedef int (*lua_Writer) (lua_State *L, const void* p, size_t sz, void* ud);
var lua_Writer = "number";

/*
** prototype for memory-allocation functions
*/
// typedef void * (*lua_Alloc) (void *ud, void *ptr, size_t osize, size_t nsize);
var lua_Alloc = "number";

/*
** basic types
*/
C.LUA_TNONE = (-1);

C.LUA_TNIL           = 0;
C.LUA_TBOOLEAN       = 1;
C.LUA_TLIGHTUSERDATA = 2;
C.LUA_TNUMBER        = 3;
C.LUA_TSTRING        = 4;
C.LUA_TTABLE         = 5;
C.LUA_TFUNCTION      = 6;
C.LUA_TUSERDATA      = 7;
C.LUA_TTHREAD        = 8;

/* minimum Lua stack available to a C function */
C.LUA_MINSTACK = 20;

/* type of numbers in Lua */
var LUA_NUMBER = lua_Number;

/* type for integer functions */
var LUA_INTEGER = lua_Integer;

/*
** state manipulation
*/
C.lua_newstate = F("lua_newstate", lua_State, [lua_Alloc, void_ptr_t]);
C.lua_close = F("lua_close", void_t, [lua_State]);
C.lua_newthread = F("lua_newthread", lua_State, [lua_State]);

C.lua_atpanic = F("lua_atpanic", lua_CFunction, [lua_State, lua_CFunction]);

/*
** basic stack manipulation
*/
C.lua_gettop = F("lua_gettop", int_t, [lua_State]);
C.lua_settop = F("lua_settop", void_t, [lua_State, int_t]);
C.lua_pushvalue = F("lua_pushvalue", void_t, [lua_State, int_t]);
C.lua_remove = F("lua_remove", void_t, [lua_State, int_t]);
C.lua_insert = F("lua_insert", void_t, [lua_State, int_t]);
C.lua_replace = F("lua_replace", void_t, [lua_State, int_t]);
C.lua_checkstack = F("lua_checkstack", int_t, [lua_State, int_t]);

C.lua_xmove = F("lua_xmove", void_t, [lua_State, lua_State, int_t]);

/*
** access functions (stack -> C)
*/

C.lua_isnumber = F("lua_isnumber", int_t, [lua_State, int_t]);
C.lua_isstring = F("lua_isstring", int_t, [lua_State, int_t]);
C.lua_iscfunction = F("lua_iscfunction", int_t, [lua_State, int_t]);
C.lua_isuserdata = F("lua_isuserdata", int_t, [lua_State, int_t]);
C.lua_type = F("lua_type", int_t, [lua_State, int_t]);
C.lua_typename = F("lua_typename", const_char_ptr_t, [lua_State, int_t]);

C.lua_equal = F("lua_equal", int_t, [lua_State, int_t, int_t]);
C.lua_rawequal = F("lua_rawequal", int_t, [lua_State, int_t, int_t]);
C.lua_lessthan = F("lua_lessthan", int_t, [lua_State, int_t, int_t]);

C.lua_tonumber = F("lua_tonumber", lua_Number, [lua_State, int_t]);
C.lua_tointeger = F("lua_tointeger", lua_Integer, [lua_State, int_t]);
C.lua_toboolean = F("lua_toboolean", int_t, [lua_State, int_t]);
C.lua_tolstring = F("lua_tolstring", const_char_ptr_t, [lua_State, int_t, size_t_ptr_t]);
C.lua_objlen = F("lua_objlen", size_t, [lua_State, int_t]);
C.lua_tocfunction = F("lua_tocfunction", lua_CFunction, [lua_State, int_t]);
C.lua_touserdata = F("lua_touserdata", void_ptr_t, [lua_State, int_t]);
C.lua_tothread = F("lua_tothread", lua_State, [lua_State, int_t]);
C.lua_topointer = F("lua_topointer", const_void_ptr_t, [lua_State, int_t]);

/*
** push functions (C -> stack)
*/
C.lua_pushnil = F("lua_pushnil", void_t, [lua_State]);
C.lua_pushnumber = F("lua_pushnumber", void_t, [lua_State, lua_Number]);
C.lua_pushinteger = F("lua_pushinteger", void_t, [lua_State, lua_Integer]);
C.lua_pushlstring = F("lua_pushlstring", void_t, [lua_State, const_char_ptr_t, size_t]);
C.lua_pushstring = F("lua_pushstring", void_t, [lua_State, const_char_ptr_t]);
/*
// TODO: Support these.
LUA_API const char *(lua_pushvfstring) (lua_State *L, const char *fmt,
                                                      va_list argp);
LUA_API const char *(lua_pushfstring) (lua_State *L, const char *fmt, ...);
*/
C.lua_pushcclosure = F("lua_pushcclosure", void_t, [lua_State, lua_CFunction, int_t]);
C.lua_pushboolean = F("lua_pushboolean", void_t, [lua_State, int_t]);
C.lua_pushlightuserdata = F("lua_pushlightuserdata", void_t, [lua_State, void_ptr_t]);
C.lua_pushthread = F("lua_pushthread", int_t, [lua_State]);

/*
** get functions (Lua -> stack)
*/
C.lua_gettable = F("lua_gettable", void_t, [lua_State, int_t]);
C.lua_getfield = F("lua_getfield", void_t, [lua_State, int_t, const_char_ptr_t]);
C.lua_rawget = F("lua_rawget", void_t, [lua_State, int_t]);
C.lua_rawgeti = F("lua_rawgeti", void_t, [lua_State, int_t, int_t]);
C.lua_createtable = F("lua_createtable", void_t, [lua_State, int_t, int_t]);
C.lua_newuserdata = F("lua_newuserdata", void_ptr_t, [lua_State, size_t]);
C.lua_getmetatable = F("lua_getmetatable", int_t, [lua_State, int_t]);
C.lua_getfenv = F("lua_getfenv", void_t, [lua_State, int_t]);

/*
** set functions (stack -> Lua)
*/
C.lua_settable = F("lua_settable", void_t, [lua_State, int_t]);
C.lua_setfield = F("lua_setfield", void_t, [lua_State, int_t, const_char_ptr_t]);
C.lua_rawset = F("lua_rawset", void_t, [lua_State, int_t]);
C.lua_rawseti = F("lua_rawseti", void_t, [lua_State, int_t, int_t]);
C.lua_setmetatable = F("lua_setmetatable", int_t, [lua_State, int_t]);
C.lua_setfenv = F("lua_setfenv", int_t, [lua_State, int_t]);

/*
** `load' and `call' functions (load and run Lua code)
*/
C.lua_call = F("lua_call", void_t, [lua_State, int_t, int_t]);
C.lua_pcall = F("lua_pcall", int_t, [lua_State, int_t, int_t, int_t]);
C.lua_cpcall = F("lua_cpcall", int_t, [lua_State, lua_CFunction, void_ptr_t]);
C.lua_load = F("lua_load", int_t, [lua_State, lua_Reader, void_ptr_t,
                                        const_char_ptr_t]);

C.lua_dump = F("lua_dump", int_t, [lua_State, lua_Writer, void_ptr_t]);

/*
** coroutine functions
*/
C.lua_yield = F("lua_yield", int_t, [lua_State, int_t]);
C.lua_resume = F("lua_resume", int_t, [lua_State, int_t]);
C.lua_status = F("lua_status", int_t, [lua_State]);

/*
** garbage-collection function and options
*/

C.LUA_GCSTOP       = 0;
C.LUA_GCRESTART    = 1;
C.LUA_GCCOLLECT    = 2;
C.LUA_GCCOUNT      = 3;
C.LUA_GCCOUNTB     = 4;
C.LUA_GCSTEP       = 5;
C.LUA_GCSETPAUSE   = 6;
C.LUA_GCSETSTEPMUL = 7;

C.lua_gc = F("lua_gc", int_t, [lua_State, int_t, int_t]);

/*
** miscellaneous functions
*/

C.lua_error = F("lua_error", int_t, [lua_State]);

C.lua_next = F("lua_next", int_t, [lua_State, int_t]);

C.lua_concat = F("lua_concat", void_t, [lua_State, int_t]);

C.lua_getallocf = F("lua_getallocf", lua_Alloc, [lua_State, void_ptr_t_ptr_t]);
C.lua_setallocf = F("lua_setallocf", void_t, [lua_State, lua_Alloc, void_ptr_t]);

/*
** ===============================================================
** some useful macros
** ===============================================================
*/

C.lua_pop = function(L,n) { return C.lua_settop(L, -(n)-1); };

C.lua_newtable = function(L) { return C.lua_createtable(L, 0, 0); };

C.lua_register = function(L,n,f) { return (C.lua_pushcfunction(L, (f)), C.lua_setglobal(L, (n))); };

C.lua_pushcfunction = function(L,f) { return C.lua_pushcclosure(L, (f), 0); };

C.lua_strlen = function(L,i) { return C.lua_objlen(L, (i)); };

C.lua_isfunction = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TFUNCTION); };
C.lua_istable = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TTABLE); };
C.lua_islightuserdata = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TLIGHTUSERDATA); };
C.lua_isnil = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TNIL); };
C.lua_isboolean = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TBOOLEAN); };
C.lua_isthread = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TTHREAD); };
C.lua_isnone = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TNONE); };
C.lua_isnoneornil = function(L, n) { return (C.lua_type(L, (n)) <= 0); };

C.lua_pushliteral = C.lua_pushstring;

C.lua_setglobal = function(L,s) { return C.lua_setfield(L, C.LUA_GLOBALSINDEX, (s)); };
C.lua_getglobal = function(L,s) { return C.lua_getfield(L, C.LUA_GLOBALSINDEX, (s)); };

C.lua_tostring = function(L,i) { return C.lua_tolstring(L, (i), NULL); };

/*
** compatibility macros and functions
*/

C.lua_open = function() { return C.luaL_newstate(); };

C.lua_getregistry = function(L) { return C.lua_pushvalue(L, C.LUA_REGISTRYINDEX); };

C.lua_getgccount = function(L) { return C.lua_gc(L, C.LUA_GCCOUNT, 0); }

var lua_Chunkreader = lua_Reader;
var lua_Chunkwriter = lua_Writer;

/* hack */
C.lua_setlevel = F("lua_setlevel", void_t, [lua_State, lua_State]);

/*
** {======================================================================
** Debug API
** =======================================================================
*/

/*
** Event codes
*/
C.LUA_HOOKCALL    = 0;
C.LUA_HOOKRET     = 1;
C.LUA_HOOKLINE    = 2;
C.LUA_HOOKCOUNT   = 3;
C.LUA_HOOKTAILRET = 4;

/*
** Event masks
*/
C.LUA_MASKCALL  = (1 << C.LUA_HOOKCALL);
C.LUA_MASKRET   = (1 << C.LUA_HOOKRET);
C.LUA_MASKLINE  = (1 << C.LUA_HOOKLINE);
C.LUA_MASKCOUNT = (1 << C.LUA_HOOKCOUNT);

// TODO: Support these. (Note LUA_IDSIZE.)
/*
typedef struct lua_Debug lua_Debug;  /* activation record * /

/* Functions to be called by the debuger in specific events * /
typedef void (*lua_Hook) (lua_State *L, lua_Debug *ar);

LUA_API int lua_getstack (lua_State *L, int level, lua_Debug *ar);
LUA_API int lua_getinfo (lua_State *L, const char *what, lua_Debug *ar);
LUA_API const char *lua_getlocal (lua_State *L, const lua_Debug *ar, int n);
LUA_API const char *lua_setlocal (lua_State *L, const lua_Debug *ar, int n);
LUA_API const char *lua_getupvalue (lua_State *L, int funcindex, int n);
LUA_API const char *lua_setupvalue (lua_State *L, int funcindex, int n);

LUA_API int lua_sethook (lua_State *L, lua_Hook func, int mask, int count);
LUA_API lua_Hook lua_gethook (lua_State *L);
LUA_API int lua_gethookmask (lua_State *L);
LUA_API int lua_gethookcount (lua_State *L);

struct lua_Debug {
  int event;
  const char *name;	/* (n) * /
  const char *namewhat;	/* (n) `global', `local', `field', `method' * /
  const char *what;	/* (S) `Lua', `C', `main', `tail' * /
  const char *source;	/* (S) * /
  int currentline;	/* (l) * /
  int nups;		/* (u) number of upvalues * /
  int linedefined;	/* (S) * /
  int lastlinedefined;	/* (S) * /
  char short_src[LUA_IDSIZE]; /* (S) * /
  /* private part * /
  int i_ci;  /* active function * /
};
*/

////////////////////////////////////////////////////////////////////////////////
// lualib.h.js: Lua 5.1 C API, lualib.h definitions (fragment file)
// This file is a part of lua5.1.js project:
// Copyright (c) LogicEditor <info@logiceditor.com>
// Copyright (c) lua5.1.js authors
// See file `COPYRIGHT` for the license
// Based on original Lua 5.1.5 header files:
// Copyright (c) 1994-2012 Lua.org, PUC-Rio
////////////////////////////////////////////////////////////////////////////////
// Note: Keeping this file as close to Lua sources as possible.
//       This includes avoiding breaking lines at 80 char limit
//       to keep original formatting despite JS code being somewhat longer.
////////////////////////////////////////////////////////////////////////////////

/* Key to file-handle type */
C.LUA_FILEHANDLE = "FILE*";

C.LUA_COLIBNAME = "coroutine";
C.luaopen_base = F("luaopen_base", int_t, [lua_State]);

C.LUA_TABLIBNAME = "table";
C.luaopen_table = F("luaopen_table", int_t, [lua_State]);

C.LUA_IOLIBNAME = "io";
C.luaopen_io = F("luaopen_io", int_t, [lua_State]);

C.LUA_OSLIBNAME = "os";
C.luaopen_os = F("luaopen_os", int_t, [lua_State]);

C.LUA_STRLIBNAME = "string";
C.luaopen_string = F("luaopen_string", int_t, [lua_State]);

C.LUA_MATHLIBNAME = "math";
C.luaopen_math = F("luaopen_math", int_t, [lua_State]);

C.LUA_DBLIBNAME = "debug";
C.luaopen_debug = F("luaopen_debug", int_t, [lua_State]);

C.LUA_LOADLIBNAME = "package";
C.luaopen_package = F("luaopen_package", int_t, [lua_State]);

/* open all previous libraries */
C.luaL_openlibs = F("luaL_openlibs", void_t, [lua_State]);

C.lua_assert = function() { }; // Do nothing.

////////////////////////////////////////////////////////////////////////////////
// lauxlib.h.js: Lua 5.1 C API, lauxlib.h definitions (fragment file)
// This file is a part of lua5.1.js project:
// Copyright (c) LogicEditor <info@logiceditor.com>
// Copyright (c) lua5.1.js authors
// See file `COPYRIGHT` for the license
// Based on original Lua 5.1.5 header files:
// Copyright (c) 1994-2012 Lua.org, PUC-Rio
////////////////////////////////////////////////////////////////////////////////
// Note: Keeping this file as close to Lua sources as possible.
//       This includes avoiding breaking lines at 80 char limit
//       to keep original formatting despite JS code being somewhat longer.
////////////////////////////////////////////////////////////////////////////////

C.luaL_getn = function(L,i) { return C.lua_objlen(L, i); };
C.luaL_setn = function(L,i,j) { };  /* no op! */

// C.luaI_openlib defined below

/* extra error code for `luaL_load' */
C.LUA_ERRFILE = (C.LUA_ERRERR+1);

/*
// TODO: Support these.
typedef struct luaL_Reg {
  const char *name;
  lua_CFunction func;
} luaL_Reg;

LUALIB_API void (luaI_openlib) (lua_State *L, const char *libname,
                                const luaL_Reg *l, int nup);
LUALIB_API void (luaL_register) (lua_State *L, const char *libname,
                                const luaL_Reg *l);
*/

C.luaL_getmetafield = F("luaL_getmetafield", int_t, [lua_State, int_t, const_char_ptr_t]);
C.luaL_callmeta = F("luaL_callmeta", int_t, [lua_State, int_t, const_char_ptr_t]);
C.luaL_typerror = F("luaL_typerror", int_t, [lua_State, int_t, const_char_ptr_t]);
C.luaL_argerror = F("luaL_argerror", int_t, [lua_State, int_t, const_char_ptr_t]);
C.luaL_checklstring = F("luaL_checklstring", const_char_ptr_t, [lua_State, int_t,
                                                          size_t_ptr_t]);
C.luaL_optlstring = F("luaL_optlstring", const_char_ptr_t, [lua_State, int_t,
                                          const_char_ptr_t, size_t_ptr_t]);
C.luaL_checknumber = F("luaL_checknumber", lua_Number, [lua_State, int_t]);
C.luaL_optnumber = F("luaL_optnumber", lua_Number, [lua_State, int_t, lua_Number]);

C.luaL_checkinteger = F("luaL_checkinteger", lua_Integer, [lua_State, int_t]);
C.luaL_optinteger = F("luaL_optinteger", lua_Integer, [lua_State, int_t,
                                          lua_Integer]);

C.luaL_checkstack = F("luaL_checkstack", void_t, [lua_State, int_t, const_char_ptr_t]);
C.luaL_checktype = F("luaL_checktype", void_t, [lua_State, int_t, int_t]);
C.luaL_checkany = F("luaL_checkany", void_t, [lua_State, int_t]);

C.luaL_newmetatable = F("luaL_newmetatable", int_t, [lua_State, const_char_ptr_t]);
C.luaL_checkudata = F("luaL_checkudata", void_ptr_t, [lua_State, int_t, const_char_ptr_t]);

C.luaL_where = F("luaL_where", void_t, [lua_State, int_t]);
/*
// TODO: Support these
LUALIB_API int (luaL_error) (lua_State *L, const char *fmt, ...);

LUALIB_API int (luaL_checkoption) (lua_State *L, int narg, const char *def,
                                   const char *const lst[]);
*/

C.luaL_ref = F("luaL_ref", int_t, [lua_State, int_t]);
C.luaL_unref = F("luaL_unref", void_t, [lua_State, int_t, int_t]);

C.luaL_loadfile = F("luaL_loadfile", int_t, [lua_State, const_char_ptr_t]);
C.luaL_loadbuffer = F("luaL_loadbuffer", int_t, [lua_State, const_char_ptr_t, size_t,
                                  const_char_ptr_t]);
C.luaL_loadstring = F("luaL_loadstring", int_t, [lua_State, const_char_ptr_t]);

C.luaL_newstate = F("luaL_newstate", lua_State, []);


C.luaL_gsub = F("luaL_gsub", const_char_ptr_t, [lua_State, const_char_ptr_t, const_char_ptr_t,
                                                  const_char_ptr_t]);

C.luaL_findtable = F("luaL_findtable", const_char_ptr_t, [lua_State, int_t,
                                         const_char_ptr_t, int_t]);

/*
** ===============================================================
** some useful macros
** ===============================================================
*/

C.luaL_argcheck = function(L, cond,numarg,extramsg) {
 if (!cond) { C.luaL_argerror(L, (numarg), (extramsg)); } };
C.luaL_checkstring = function(L,n) { return C.luaL_checklstring(L, (n), NULL); };
C.luaL_optstring = function(L,n,d) { return C.luaL_optlstring(L, (n), (d), NULL); };
C.luaL_checkint = C.luaL_checkinteger;
C.luaL_optint = C.luaL_optinteger;
C.luaL_checklong = C.luaL_checkinteger;
C.luaL_optlong = C.luaL_optinteger;

C.luaL_typename = function(L,i) { return C.lua_typename(L, C.lua_type(L,(i))); };

C.luaL_dofile = function(L, fn) {
 return (C.luaL_loadfile(L, fn) || C.lua_pcall(L, 0, C.LUA_MULTRET, 0)); };

C.luaL_dostring = function(L, s) {
 return (C.luaL_loadstring(L, s) || C.lua_pcall(L, 0, C.LUA_MULTRET, 0)); };

C.luaL_getmetatable = function(L,n) { return (C.lua_getfield(L, C.LUA_REGISTRYINDEX, (n))); };

C.luaL_opt = function(L,f,n,d) { return (C.lua_isnoneornil(L,(n)) ? (d) : f(L,(n))); };

/*
** {======================================================
** Generic Buffer manipulation
** =======================================================
*/

/*
// TODO: Support these
typedef struct luaL_Buffer {
  char *p;			/* current position in buffer * /
  int lvl;  /* number of strings in the stack (level) * /
  lua_State *L;
  char buffer[LUAL_BUFFERSIZE];
} luaL_Buffer;

#define luaL_addchar(B,c) \
  ((void)((B)->p < ((B)->buffer+LUAL_BUFFERSIZE) || luaL_prepbuffer(B)), \
   (*(B)->p++ = (char)(c)))

/* compatibility only * /
#define luaL_putchar(B,c)	luaL_addchar(B,c)

#define luaL_addsize(B,n)	((B)->p += (n))

LUALIB_API void (luaL_buffinit) (lua_State *L, luaL_Buffer *B);
LUALIB_API char *(luaL_prepbuffer) (luaL_Buffer *B);
LUALIB_API void (luaL_addlstring) (luaL_Buffer *B, const char *s, size_t l);
LUALIB_API void (luaL_addstring) (luaL_Buffer *B, const char *s);
LUALIB_API void (luaL_addvalue) (luaL_Buffer *B);
LUALIB_API void (luaL_pushresult) (luaL_Buffer *B);
*/

/* }====================================================== */

/* compatibility with ref system */

/* pre-defined references */
C.LUA_NOREF       = (-2);
C.LUA_REFNIL      = (-1);

C.lua_ref = function(L,lock)
{
  if (lock)
  {
    return C.luaL_ref(L, C.LUA_REGISTRYINDEX);
  }

  C.lua_pushstring(L, "unlocked references are obsolete");
  C.lua_error(L);
  return 0;
}

C.lua_unref = function(L,ref) { return C.luaL_unref(L, C.LUA_REGISTRYINDEX, (ref)); };

C.lua_getref = function(L,ref) { return C.lua_rawgeti(L, C.LUA_REGISTRYINDEX, (ref)); };

C.luaL_reg = C.luaL_Reg;

////////////////////////////////////////////////////////////////////////////////

Lua5_1.C = C;
Lua5_1.Runtime = Runtime;

Lua5_1.provide_file = function(parent, name, data, can_read, can_write)
{
  if (typeof(parent) === "string" && parent !== "/")
  {
    if (parent.charAt(0) !== "/")
    {
      throw new Error("can't create relative path: `" + parent + "'");
    }
    parent = parent.substr(1);
    parent = FS.createPath("/", parent, true, true);
  }
  return FS.createDataFile(parent, name, data, can_read, can_write);
}

})(Lua5_1);
