(function(global) {
    var LiteGraph = global.LiteGraph;

	class ExecuteAtRandomPoints {
		constructor(initialParams) {
			this.initialParams = initialParams;
		}
		isEqual(other) {
            return (other instanceof ExecuteAtRandomPoints) &&
				(deepEqual(this.initialParams, other.initialParams));
        }
        generate(ctx, seed, params) {
			//console.log(this.toString() + ".generate(" + seed + ", " + anythingToString(this.initialParams) + ", " + anythingToString(params) + ")");
			var rng = createRNG(seed);
			
			var mergedParams = Object.assign({}, params, this.initialParams);
			var generator = mergedParams.generator;
			var howMany = mergedParams.howMany;
			var minX = mergedParams.minX;
			var minY = mergedParams.minY;
			var maxX = mergedParams.maxX;
			var maxY = mergedParams.maxY;
			
			var i, x0, y0, angle, scale;
			for (i=0; i<=howMany; i++) {
				x0 = minX + rng() * (maxX-minX);
				y0 = minY + rng() * (maxY-minY);
				angle = 0.0;
				scale = 1.0;
				
				ctx.rotate(angle);
				ctx.translate(x0, y0);
				ctx.scale(scale, scale);
				
				generator.generate(ctx, x0+(maxX-minX)+y0+seed, params);
				
				ctx.scale(1/scale, 1/scale);
				ctx.translate(-x0, -y0);
				ctx.rotate(-angle);
			}
		}
		getSize() {
			return [this.initialParams.maxX, this.initialParams.maxY];
		}
		toString() {
			return "ExecuteAtRandomPoints(iP=" + anythingToString(this.initialParams) + ")";
		}
	}
	
    function ExecuteGeneratorAtRandomPoints() {
		this.addInput("initialParams", "Config");
		this.addInput("generator", "generator");
		this.addInput("howMany", "Number");

		this.addInput("minX", "Number");
		this.addInput("minY", "Number");
		this.addInput("maxX", "Number");
		this.addInput("maxY", "Number");
		
		this.addOutput("generator", "Generator");
		
        this.properties = {
			howMany: 32,
			minX: 0,
			minY: 0,
			maxX: 100,
			maxY: 100
		};
		
		this.oldInputs = {};
		this.oldOutput = null;
    }

    ExecuteGeneratorAtRandomPoints.title = "Execute a generator at random points";
    ExecuteGeneratorAtRandomPoints.desc = "Executes a generator at random points";
    ExecuteGeneratorAtRandomPoints.colors = ["#433", "#191", "#2C2", "#1F0"];

    ExecuteGeneratorAtRandomPoints.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		var generator = this.getInputOrProperty("generator");
		
		if (!generator) {
			this.setOutputData(0, null);
			return;
		}

		var params = {
			"generator": generator,
			"howMany": this.getInputOrProperty("howMany"),
			"minX": this.getInputOrProperty("minX"),
			"minY": this.getInputOrProperty("minY"),
			"maxX": this.getInputOrProperty("maxX"),
			"maxY": this.getInputOrProperty("maxY"),
		};
		params = Object.assign(params, this.getInputOrProperty("initialParams"));
		
		if (params === this.oldInputs || deepEqual(params, this.oldInputs)) {
			this.setOutputData(0, this.oldOutput);
			return;
		} else {
			console.log("refreshing execute at random points generator");
		}
		
		this.oldInputs = Object.assign({}, params);
		this.oldOutput = new ExecuteAtRandomPoints(params);
		this.setOutputData(0, this.oldOutput);
    };

    LiteGraph.registerNodeType("generators/ExecuteGeneratorAtRandomPoints", ExecuteGeneratorAtRandomPoints);

})(this);