function isObject(object) {
  return object != null && typeof object === 'object';
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
