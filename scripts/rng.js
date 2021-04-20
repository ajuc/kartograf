function createRNG(seed) {
	var rngSeed = seed;
    return function () {
		var x = Math.sin(rngSeed++) * 10000;
		return x - Math.floor(x);
	}
}
