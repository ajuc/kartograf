(function(global) {
    var LiteGraph = global.LiteGraph;

		class Tree {
		constructor(radius, trunkRadius, steps, stepLength, stepLengthFactor, stepRadiusFactor, stepCurvingFactor,
					stepForkingProbability, leavesNumber, leavesSize, leavesThickness, leavesRandomness,
					colorGradient) {
			this.radius = radius;
			this.trunkRadius = trunkRadius;
			this.steps = steps;
			this.stepLength = stepLength;
			this.stepLengthFactor = stepLengthFactor;
			this.stepRadiusFactor = stepRadiusFactor;
			this.stepCurvingFactor = stepCurvingFactor;
			this.stepForkingProbability = stepForkingProbability;
			this.leavesNumber = leavesNumber;
			this.leavesSize = leavesSize;
			this.leavesThickness = leavesThickness;
			this.leavesRandomness = leavesRandomness;
			this.colorGradient = colorGradient;
		}
		isEqual(other) {
            return (other instanceof Tree) &&
					(other.radius === this.radius) &&
					(other.trunkRadius === this.trunkRadius) &&
					(other.steps === this.steps) &&
					(other.stepLength === this.stepLength) &&
					(other.stepLengthFactor === this.stepLengthFactor) &&
					(other.stepRadiusFactor === this.stepRadiusFactor) &&
					(other.stepCurvingFactor === this.stepCurvingFactor) &&
					(other.stepForkingProbability === this.stepForkingProbability) &&
					(other.leavesNumber === this.leavesNumber) &&
					(other.leavesSize === this.leavesSize) &&
					(other.leavesThickness === this.leavesThickness) &&
					(other.leavesRandomness === this.leavesRandomness) &&
					(	other.colorGradient === this.colorGradient
					 || (this.colorGradient && this.colorGradient.isEqual(other.colorGradient)));
        }
		internalGenerate(ctx, rng, params, stepNo, x0, y0, angle, curving, stepLength, trunkRadius) {
			var forkNo;
			var forks = 2; //Math.round(this.stepForkingProbability * rng() * 4);
			var x1 = x0 + rng() * stepLength * Math.cos(angle);
			var y1 = y0 + rng() * stepLength * Math.sin(angle);
			var newAngle;
			
			//ctx.rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1-x0), Math.abs(y1-y0));
			//ctx.fillStyle = this.colorGradient.apply(rng());
			//ctx.fill();
			
			ctx.beginPath();
			ctx.lineWidth = trunkRadius;
			ctx.moveTo(x0, y0);
			ctx.strokeStyle = this.colorGradient.apply(rng());
			ctx.lineTo(x1, y1);
			ctx.stroke();

			
			stepNo ++;
			if (stepNo < this.steps) {
				for (forkNo=0; forkNo<forks; forkNo++) {
					var newAngle = angle + (rng() - 0.5) * 6.28 * curving;
					var newStepLength = stepLength * this.stepLengthFactor;
					this.internalGenerate(ctx, rng, params, stepNo, x1, y1, newAngle, curving * this.stepCurvingFactor,
										  newStepLength, trunkRadius * this.stepRadiusFactor);
				}
			}
		}
        generate(ctx, seed, params) {
			console.log(this.toString() + ".generate(" + seed + ", " + params + ")");
			var rng = createRNG(seed);
			var stepNo=0;
			var x0 = this.radius;
			var y0 = this.radius;
			var x1,y1;
			var angle = rng() * 6.28 * this.stepCurvingFactor;
			
			this.internalGenerate(ctx, rng, params, 0, x0, y0, angle, 1.0, this.stepLength, this.trunkRadius);
		}
		getSize() {
			return [2.0 * this.radius, 2.0 * this.radius];
		}
		toString() {
			return "Tree(" +
				"r= " + this.radius + ", " +
				"tR= " + this.trunkRadius + ", " +
				"s= " + this.steps + ", " +
				"sP= " + this.stepLength + ", " +
				"sLF= " + this.stepLengthFactor + ", " +
				"sRF= " + this.stepRadiusFactor + ", " +
				"sCF= " + this.stepCurvingFactor + ", " +
				"sFP= " + this.stepForkingProbability + ", " +
				"lN= " + this.leavesNumber + ", " +
				"lS= " + this.leavesSize + ", " +
				"lT= " + this.leavesThickness + ", " +
				"lR= " + this.leavesRandomness + ", " +
				"cg= " + this.colorGradient + ")";
		}
	}
	
    function TreeGenerator() {
		this.addInput("radius", "Number");
		this.addInput("trunkRadius", "Number");
        
		this.addInput("steps", "Number");
		this.addInput("stepLength", "Number");
		this.addInput("stepLengthFactor", "Number");
		this.addInput("stepRadiusFactor", "Number");
		this.addInput("stepCurvingFactor", "Number");
        this.addInput("stepForkingProbability", "Number");
		
		this.addInput("leavesNumber", "Number");
		this.addInput("leavesSize", "Number");
		this.addInput("leavesThickness", "Number");
		this.addInput("leavesRandomness", "Number");
		this.addInput("colorGradient", "ColorGradient");
		
		this.addOutput("generator", "Generator");

        this.properties = {
			radius: 100.0,
			trunkRadius: 10.0,
			steps: 8,
			stepLength: 8.0,
			stepLengthFactor: 1.0,
			stepRadiusFactor: 1.0,
			stepCurvingFactor: 1.0,
			stepForkingProbability: 0.5,
			leavesNumber: 100.0,
			leavesSize: 4.0,
			leavesThickness: 3.0,
			leavesRandomness: 0.5,
			colorGradient: null
		};
		this.oldInputs = {};
		this.oldOutput = null;
    }

    TreeGenerator.title = "Tree";
    TreeGenerator.desc = "Draws a tree";
    TreeGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    TreeGenerator.prototype.onExecute = function() {
        if (this.flags.collapsed) {
            return;
        }
		
		var radius = this.getInputOrProperty("radius");
		var trunkRadius = this.getInputOrProperty("trunkRadius");
		var steps = this.getInputOrProperty("steps");
		var stepLength = this.getInputOrProperty("stepLength");
		var stepLengthFactor = this.getInputOrProperty("stepLengthFactor");
		var stepRadiusFactor = this.getInputOrProperty("stepRadiusFactor");
		var stepCurvingFactor = this.getInputOrProperty("stepCurvingFactor");
		var stepForkingProbability = this.getInputOrProperty("stepForkingProbability");
		var leavesNumber = this.getInputOrProperty("leavesNumber");
		var leavesSize = this.getInputOrProperty("leavesSize");
		var leavesThickness = this.getInputOrProperty("leavesThickness");
		var leavesRandomness = this.getInputOrProperty("leavesRandomness");
		var colorGradient = this.getInputOrProperty("colorGradient");
		
		if (!colorGradient) {
			this.setOutputData(0, null);
			return;
		}
		
		var newInputs = {
			radius: radius,
			trunkRadius: trunkRadius,
			steps: steps,
			stepLength: stepLength,
			stepLengthFactor: stepLengthFactor,
			stepRadiusFactor: stepRadiusFactor,
			stepCurvingFactor: stepCurvingFactor,
			stepForkingProbability: stepForkingProbability,
			leavesNumber: leavesNumber,
			leavesSize: leavesSize,
			leavesThickness: leavesThickness,
			leavesRandomness: leavesRandomness,
			colorGradient: colorGradient
		};
		if (newInputs === this.oldInputs || deepEqual(newInputs, this.oldInputs)) {
			this.setOutputData(0, this.oldOutput);
			return;
		}
		console.log("refreshing tree generator" + this.oldOutput);
				
		this.oldInputs = Object.assign({}, newInputs);
		this.oldOutput = new Tree(
			radius, trunkRadius, steps, stepLength, stepLengthFactor, stepRadiusFactor, stepCurvingFactor,
			stepForkingProbability, leavesNumber, leavesSize, leavesThickness, leavesRandomness,
			colorGradient
		);
		this.setOutputData(0, this.oldOutput);
    };

    LiteGraph.registerNodeType("generators/tree", TreeGenerator);

})(this);