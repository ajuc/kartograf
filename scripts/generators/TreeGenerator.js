(function(global) {
    var LiteGraph = global.LiteGraph;

		class Tree {
		constructor(radius, trunkRadius, steps, stepLength, stepLengthFactor, stepRadiusFactor, stepCurvingFactor,
					stepForkingProbability, leavesNumber, leavesSize, leavesThickness, leavesRandomness,
					trunkColorGradient, leavesColorGradient) {
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
			this.trunkColorGradient = trunkColorGradient;
			this.leavesColorGradient = leavesColorGradient;
			//console.log("trunkColorGradient=" + trunkColorGradient.toString() + " leavesColorGradient=" + leavesColorGradient.toString());
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
					(	other.trunkColorGradient === this.trunkColorGradient
					 || (this.trunkColorGradient && this.trunkColorGradient.isEqual(other.trunkColorGradient))) &&
					(	other.leavesColorGradient === this.leavesColorGradient
					 || (this.leavesColorGradient && this.leavesColorGradient.isEqual(other.leavesColorGradient)));
        }
		drawBranch(ctx, trunkRadius, x0, y0, rng, x1, y1) {
			//return;
			var strokeStyle = ctx.strokeStyle;
			ctx.beginPath();
			ctx.lineWidth = trunkRadius;
			ctx.moveTo(x0, y0);
			ctx.strokeStyle = this.trunkColorGradient.apply(rng());
			ctx.lineTo(x1, y1);
			ctx.stroke();
			ctx.strokeStyle = strokeStyle;
		}
		drawLeaves(ctx, trunkRadius, branchX0, branchY0, rng, branchX1, branchY1, stepNo, steps) {
			if (stepNo<steps/2) {
				return;
			}
			var oldStrokeStyle = ctx.strokeStyle;
			ctx.lineWidth = 5;
			var R = ((Math.abs(branchX1-branchX0)+Math.abs(branchY1-branchY0))/2) + (trunkRadius * 80/(4*stepNo+1));
			//ctx.ellipse((x0+x1)/2, (y0+y1)/2, r, r, 0.0, 0, 6.28);
			var x = (branchX0 + branchX1)/2;
			var y = (branchY0 + branchY1)/2;
			
			for (let i=0; i<this.leavesNumber/(Math.max(1,steps/2)); i++) {
				var angle = rng() * 6.28;
				var minR = Math.sqrt(Math.sqrt(Math.sqrt(rng()*rng()*rng()))) * R; //sqrt is needed cause it takes many more leaves to cover outer edge than inside
				var maxR = minR + 5;
				var x0 = x + Math.cos(angle) * minR;
				var y0 = y + Math.sin(angle) * minR;
				var x1 = x + Math.cos(angle) * maxR;
				var y1 = y + Math.sin(angle) * maxR;
				ctx.beginPath();
				ctx.moveTo(x0, y0);
				ctx.strokeStyle = this.leavesColorGradient.apply((Math.abs(angle-3.14))/((3.14))*0.75+(rng()-0.5)*0.5);
				ctx.lineTo(x1, y1);
				ctx.stroke();
			}
			ctx.strokeStyle = oldStrokeStyle;
		}
		internalGenerate(ctx, rng, params, stepNo, x0, y0, angle, curving, stepLength, trunkRadius, angleRange) {
			if (!this.trunkColorGradient || !this.leavesColorGradient
				|| !this.trunkColorGradient.apply
				|| !this.leavesColorGradient.apply
			) {
				return;
			}
			var forkNo;
			var forkRng = rng();
			
			var forks = (forkRng < this.stepForkingProbability) ? Math.round(1.5+rng()*rng()*(this.steps-stepNo)) : 1;
			
			var x1 = x0 + (0.1+rng()*0.9) * stepLength * Math.cos(angle);
			var y1 = y0 + (0.1+rng()*0.9) * stepLength * Math.sin(angle);
			var newAngle;

			var seed = rng();
			
			this.drawBranch(ctx, trunkRadius, x0, y0, createRNG(seed + 107 * stepNo), x1, y1);
			
			stepNo ++;
			if (stepNo < this.steps) {
				for (forkNo=0; forkNo<forks; forkNo++) {
					var newAngle = (forks > 1 ? angle - (angleRange/2) + (forkNo) * (angleRange / (forks-1)) : angle);
					var newStepLength = stepLength * this.stepLengthFactor;
					this.internalGenerate(ctx, rng, params, stepNo, x1, y1, newAngle, curving * this.stepCurvingFactor,
										  newStepLength, trunkRadius * this.stepRadiusFactor, angleRange/forks);
				}
			}
			if (this.leavesNumber > 0.0) {
				this.drawLeaves(ctx, trunkRadius, x0, y0, createRNG(seed - 301 * stepNo), x1, y1, stepNo-1, this.steps);
			}
		}
        generate(ctx, seed, params) {
			if (!this.trunkColorGradient || !this.leavesColorGradient) {
				return;
			}
			var rng = createRNG(seed);
			var stepNo=0;
			var x0 = this.radius;
			var y0 = this.radius;
			var x1,y1;
			var angle = rng() * 6.28 * this.stepCurvingFactor;
			
			this.internalGenerate(ctx, rng, params, 0, x0, y0, angle, 1.0, this.stepLength, this.trunkRadius, 6.28);
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
				"tCG= " + this.trunkColorGradient + ", " +
				"lCG= " + this.leavesColorGradient + ")";
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
		this.addInput("trunkColorGradient", "ColorGradient");
		this.addInput("leavesColorGradient", "ColorGradient");
		
		this.addOutput("generator", "Generator");

        this.properties = {
			radius: 100.0,
			trunkRadius: 6.0,
			steps: 8,
			stepLength: 15.0,
			stepLengthFactor: 1.0,
			stepRadiusFactor: 0.8,
			stepCurvingFactor: 1.0,
			stepForkingProbability: 0.5,
			leavesNumber: 0.0,
			leavesSize: 4.0,
			leavesThickness: 3.0,
			leavesRandomness: 0.5,
			trunkColorGradient: new global.ColorGradient("#661111", "#bb1111"),
			leavesColorGradient: new global.ColorGradient("#004411", "#00bb00")
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
		var trunkColorGradient = this.getInputOrProperty("trunkColorGradient");
		var leavesColorGradient = this.getInputOrProperty("leavesColorGradient");
		
		if (!trunkColorGradient || !leavesColorGradient) {
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
			trunkColorGradient: trunkColorGradient,
			leavesColorGradient: leavesColorGradient
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
			trunkColorGradient, leavesColorGradient
		);
		this.setOutputData(0, this.oldOutput);
    };

    LiteGraph.registerNodeType("generators/tree", TreeGenerator);

})(this);