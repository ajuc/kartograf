(function(global) {
    var LiteGraph = global.LiteGraph;

	class GrassPatch {
		constructor(initialParams) {
			this.initialParams = initialParams;
		}
		isEqual(other) {
			return (other instanceof GrassPatch) &&
				(deepEqual(this.initialParams, other.initialParams));
        }
        generate(ctx, seed, params) {
			console.log(this.toString() + ".generate(" + seed + ", " + params + ")");
			var rng = createRNG(seed);
			
			var mergedParams = Object.assign({}, params, this.initialParams);
			var generator = mergedParams.generator;
			var radius = mergedParams.radius;
			var density = mergedParams.density;
			var placementRandomness = mergedParams.placementRandomness;
			var angleRandomness = mergedParams.angleRandomness;
			var radius = mergedParams.radius;
			var length = mergedParams.length;
			var colorGradient = mergedParams.colorGradient;
			var symmetric = mergedParams.symmetric;
			
			var i=0;
			var x0,y0,x1,y1, angle;
			var maxPossiblePatches = (radius * radius) / (256);
			var patches = density * maxPossiblePatches;
			
			for (i=0; i<patches; i++) {
				x0 = rng()*placementRandomness * 2 * radius;
				y0 = rng()*placementRandomness * 2 * radius;
				angle = rng()*angleRandomness + (i*6.28)/patches;
				x1 = x0 + length * Math.cos(angle);
				y1 = y0 + length * Math.sin(angle);
				
				ctx.beginPath();
				ctx.moveTo(x0, y0);
				ctx.strokeStyle = colorGradient.apply(rng());
				ctx.lineTo(x1, y1);
				ctx.stroke();
				
				var M = radius;
				if (symmetric > 0.5) {
					for (let dx = -M; dx <=M; dx += M) {
						for (let dy = -M; dy <=M; dy += M) {
							ctx.beginPath();
							ctx.moveTo(x0+dx, y0+dy);
							ctx.strokeStyle = colorGradient.apply(rng());
							ctx.lineTo(x1+dx, y1+dy);
							ctx.stroke();
						}
					}
				}
			}
			
		}
		getSize() {
			return [Math.round(2.0 * this.initialParams.radius), Math.round(2.0 * this.initialParams.radius)];
		}
		toString() {
			return "GrassPatch(iP=" + anythingToString(this.initialParams) + ")";
		}
	}
	
    function GrassPatchGenerator() {
		this.addInput("initialParams", "Config");
		this.addInput("radius", "Number");
		this.addInput("density", "Number");
		this.addInput("length", "Number");
		this.addInput("angleRandomness", "Number");
		this.addInput("placementRandomness", "Number");
		this.addInput("symmetric", "Number");
		this.addInput("colorGradient", "ColorGradient");
		
		this.addOutput("generator", "Generator");

        this.properties = {
			radius: 0.5,
			density: 0.25,
			length: 0.5,
			angleRandomness: 0.25,
			placementRandomness: 0.25,
			symmetric: 1.0
		};
		this.offscreenCanvas = null;
		this.oldInputs = {};
		this.oldOutput = null;
    }

    GrassPatchGenerator.title = "Grass Patch";
    GrassPatchGenerator.desc = "Creates a generator that generates a patch of grass on-demand";
    GrassPatchGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    GrassPatchGenerator.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
			this.setOutputData(0, null);
            return;
        }
		
		
		var radius = this.getInputOrProperty("radius") * 25.0;
		var density = this.getInputOrProperty("density");
		var length = this.getInputOrProperty("length");
		var angleRandomness = this.getInputOrProperty("angleRandomness");
		var placementRandomness = this.getInputOrProperty("placementRandomness");
		var symmetric = this.getInputOrProperty("symmetric");
		var colorGradient = this.getInputOrProperty("colorGradient");
		var newInputs = {
			"radius": radius,
			"density": density,
			"length": length,
			"angleRandomness": angleRandomness,
			"placementRandomness": placementRandomness,
			"symmetric": symmetric,
			"colorGradient": colorGradient
		};
		
		newInputs = Object.assign(newInputs, this.getInputOrProperty("initialParams"));
				
		if (newInputs === this.oldInputs || deepEqual(newInputs, this.oldInputs)) {
			this.setOutputData(0, this.oldOutput);
			return;
		} else {
			console.log("refreshing grass patch generator");
		}
		
		if (!colorGradient) {
			this.setOutputData(0, null);
			return;
		}
		this.setSize(this.computeSize());
		
		this.oldInputs = Object.assign({}, newInputs);
		this.oldOutput = new GrassPatch(this.oldInputs);
		this.setOutputData(0, this.oldOutput);
    };

    LiteGraph.registerNodeType("generators/grassPatch", GrassPatchGenerator);

})(this);