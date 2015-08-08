
(function (starlight) {
	var T = starlight.runtime.T;
	var _G = starlight.runtime.globalScope;
	var getn = _G.get('table').get('getn');

	function jsToLua (obj) {
		var t, mt;

		mt = new T({

			__index: function (t, key) {
				var property = obj[key],
					i, children, child;

				// Bind methods to object and convert args and return values
				if (typeof property == 'function' || (property && property.prototype && typeof property.prototype.constructor == 'function')) {	// KLUDGE: Safari reports native constructors as objects, not functions :-s
					var f = function () {
						var args = convertArguments(arguments, luaToJS),
							retval = property.apply(args.shift(), args);

						if (typeof retval == 'object') return jsToLua(retval);
						return [retval];
					};

					// Add static methods, etc
					if (Object.getOwnPropertyNames) {
						children = Object.getOwnPropertyNames(property);

						for (i = 0; child = children[i]; i++) {
							if (child == 'caller' || child == 'callee' || child == 'arguments') continue;	// Avoid issues in strict mode. Fixes mooshine issue #24. 
							f[child] = property[child];
						}
					}

					// Add a new method for instantiating classes
					f.new = function () { 
						var args = convertArguments(arguments, luaToJS),
							argStr,
							obj,
							i, l;

						argStr = (l = args.length)? 'args[0]' : '';
						for (i = 1; i < l; i++) argStr += ',args[' + i + ']';

						obj = eval('new property(' + argStr + ')');
						return jsToLua(obj);
					};

					return f;
				}

				// Recurse down properties
				if (typeof property == 'object') return jsToLua(property);

				// Return primatives as is
				return property;
			},


			__newindex: function (t, key, val) {
				obj[key] = luaToJS(val);
			}

		});

		mt.source = obj;
		t = new T();

		// Return proxy table
		t.metatable = mt;
		return t;
	}




	function luaToJS (val) {
		var mt;

		// Make shine.Functions invokable
		if (val instanceof Function) {
			return function () { 
				return jsToLua(val.apply(undefined, convertArguments(arguments, jsToLua)));
			};
		}

		if (val instanceof T) {
			// If object has been wrapped by jsToLua(), use original object instead
			if ((mt = val.metatable) && mt.source) {
				return mt.source;
			}

			// Else iterate over table
			var isArr = getn(val) > 0,
				result = isArr? [] : {},
				numValues = val.numValues,
				strValues = val.strValues,
				i,
				l = numValues.length;

			for (i = 1; i < l; i++) {
				result[i - 1] = (numValues[i] instanceof T)? luaToJS(numValues[i]) : numValues[i];
			}

			for (i in strValues) {
				if (strValues.hasOwnProperty(i)) {
					result[i] = (val[i] instanceof T)? luaToJS(val[i]) : val[i];
				}
			}
			
			return result;
		}


		// // Convert tables to objects
		// if (typeof val == 'object') return shine.utils.toObject(val);

		// return primatives as is
		return val;
	}




	function convertArguments (arguments, translateFunc) {
		var args = [], i, l;

		for (i = 0, l = arguments.length; i < l; i++) {
			args.push(translateFunc(arguments[i]));
		}

		return args;
	};




	// Create wrapped window API
	var win = jsToLua(window);
	_G.set('window', win);


	// Add expand method
	win.set('extract', function () {
		var keys = Object.getOwnPropertyNames && Object.getOwnPropertyNames(win);

		for (var i in keys || win) {
			if (keys) i = keys[i];

			if (i !== 'print' && i !== 'window' && win[i] !== null) {
				_G.set(i, win.get(i));
			}
		}
	});


})(window.starlight);
