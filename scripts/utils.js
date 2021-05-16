function isObject(object) {
  return object != null && typeof object === 'object';
}

function mergeParams(first, second) {
	var result = {};
	
	for (var i in o) {
			str += i + "=" + anythingToString(o[i]) + (count + 1 < Object.keys(o).length ? ",\n" : "");
			count++;
	}
	
	return result;
}

function anythingToString(o) {
	if (o == null) {
		return "null";
	} else if (o.constructor === Number) {
		return o.toFixed(3);
	} else if (o.constructor === Array) {
		var str = "[";
		for (var i = 0; i < o.length; ++i) {
			str += anythingToString(o[i]) + (i + 1 != o.length ? ",\n" : "");
		}
		str += "]";
		return str;
	} else if (o.constructor === Object) {
		var str = "{";
		var count=0;
		for (var i in o) {
			str += i + "=" + anythingToString(o[i]) + (count + 1 < Object.keys(o).length ? ",\n" : "");
			count++;
		}
		str += "}";
		return str;
	} else {
		return String(o);
	}
}

function deepEqual(object1, object2) {
  if (object1 === object2) {
	return true;
  }
  
  if ((!object1) || (!object2)) {
	 return (!object1) && (!object2);
  }
  
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
	return false;
  }

  for (const key of keys1) {
	const val1 = object1[key];
	const val2 = object2[key];
	const areObjects = isObject(val1) && isObject(val2);
	if (areObjects && (val1.isEqual || val2.isEqual)) {
		if ((val1.isEqual && !val1.isEqual(val2))
			|| (val2.isEqual && !val2.isEqual(val1))
		) {
			return false;
		}
	} else {
		if (
		  areObjects && !deepEqual(val1, val2) ||
		  !areObjects && val1 !== val2
		) {
		  return false;
		}
	}
  }

  return true;
}

function removeIfExists(offScreenCanvas) {
	if (offScreenCanvas) {
		delete offScreenCanvas;
	}
	return null;
}

function createOffscreenBuffer(w, h) {
	var offScreenCanvas = document.createElement('canvas');
	offScreenCanvas.width = w;
	offScreenCanvas.height = h;
	return offScreenCanvas;
}


function rgba(r, g, b, a){
  r = Math.floor(r);
  g = Math.floor(g);
  b = Math.floor(b);
  return ["rgba(",r,",",g,",",b,",",a,")"].join("");
}

function rgb(r, g, b){
  r = Math.floor(r);
  g = Math.floor(g);
  b = Math.floor(b);
  return ["rgb(",r,",",g,",",b,")"].join("");
}

function saw(x) {
	if (x < 0) x = -x;
	x = x % (2 * Math.PI);
	if (x < Math.PI) {
		return 2.0 * (x / Math.PI) - 1.0;
	} else {
		return 1.0 - 2.0 * (x - Math.PI) / Math.PI;
	}
}

function roundedSaw(x) {
	return 2.0 * Math.abs(Math.sin(x)) - 0.5;
}

function lastInputWithMatchingName(node, regex) {
	if (!node.inputs) {
		return null;
	}
	var result = null;
	var lastNumber = null;
	for (let i in node.inputs) {
		var current = node.inputs[i];
		var matchingResult = regex.exec(current.name);
		if (matchingResult) {
			if (matchingResult.length>1) {
				var number = parseInt(matchingResult[1]);
				if (!lastNumber || number>lastNumber) {
					result = current;
					lastNumber = number;
				}
			}
		}
	}
	return result;
}