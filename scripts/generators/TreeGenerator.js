(function(global) {
    var LiteGraph = global.LiteGraph;

	class Tree {
		constructor(initialParams) {
			this.initialParams = initialParams;
		}
		isEqual(other) {
            return (other instanceof Tree) &&
				(deepEqual(this.initialParams, other.initialParams));
        }
		drawBranch(ctx, trunkRadius, x0, y0, rng, x1, y1, mergedParams) {
			var strokeStyle = ctx.strokeStyle;
			ctx.beginPath();
			var d = (x1-x0)*(x1-x0) + (y1-y0)*(y1-y0);
			if (d < 9) {
				ctx.ellipse((x0+x1)/2, (y0+y1)/2, d+rng(), d+rng(), 0.0, 0, 6.28);
				ctx.fill();
			} else {
				ctx.lineWidth = trunkRadius;
				ctx.moveTo(x0, y0);
				ctx.strokeStyle = mergedParams.trunkColorGradient.apply(rng());
				ctx.lineTo(x1, y1);
				ctx.stroke();
				ctx.strokeStyle = strokeStyle;
			}
		}
		drawLeaves(ctx, trunkRadius, branchX0, branchY0, rng, branchX1, branchY1, stepNo, steps, mergedParams) {
			if (stepNo<steps/2) {
				return;
			}
			var oldStrokeStyle = ctx.strokeStyle;
			ctx.lineWidth = mergedParams.leavesThickness;
			var R = ((Math.abs(branchX1-branchX0)+Math.abs(branchY1-branchY0))/2) + (trunkRadius * 80/(4*stepNo+1));
			//ctx.ellipse((x0+x1)/2, (y0+y1)/2, r, r, 0.0, 0, 6.28);
			var x = (branchX0 + branchX1)/2;
			var y = (branchY0 + branchY1)/2;
			
			var n = mergedParams.leavesNumber/(Math.max(1,steps/2));
			if (n<1) {
				return;
			}
			for (let i=0; i<n; i++) {
				var angle = ((i*6.28)/(n) + mergedParams.leavesRandomness * rng() * 6.28) % 6.28;
				var minR = Math.sqrt(rng()) * R; //sqrt is needed cause it takes many more leaves to cover outer edge than inside
				var maxR = minR + mergedParams.leavesSize;
				var x0 = x + Math.cos(angle) * minR;
				var y0 = y + Math.sin(angle) * minR;
				var x1 = x + Math.cos(angle) * maxR;
				var y1 = y + Math.sin(angle) * maxR;
				//ctx.beginPath();
				//ctx.moveTo(x0, y0);
				//ctx.strokeStyle = mergedParams.leavesColorGradient.apply((Math.abs(angle-3.14))/((3.14))*0.75+(rng()-0.5)*0.5);
				//ctx.lineTo(x1, y1);
				//ctx.stroke();
				ctx.beginPath();
				ctx.strokeStyle = mergedParams.leavesColorGradient.apply((Math.abs(angle-3.14))/((3.14))*0.75+(rng()-0.5)*0.5);
				ctx.fillStyle = mergedParams.leavesColorGradient.apply((Math.abs(angle-3.14))/((3.14))*0.75+(rng()-0.5)*0.5);
				ctx.ellipse(x0, y0, mergedParams.leavesSize, mergedParams.leavesSize, 0.0, 0, 6.28);
				ctx.stroke();
				ctx.fill();
			}
			ctx.strokeStyle = oldStrokeStyle;
		}
		internalGenerate(ctx, rng, params, stepNo, x0, y0, angle, curving, stepLength, trunkRadius, angleRange, mergedParams) {
			if (!mergedParams.trunkColorGradient || !mergedParams.leavesColorGradient
				|| !mergedParams.trunkColorGradient.apply
				|| !mergedParams.leavesColorGradient.apply
			) {
				return;
			}
			var forkNo;
			var forkRng = rng();
			
			var forks = (forkRng < mergedParams.stepForkingProbability) ? Math.round(mergedParams.stepForkingFactor*rng()) : 1;
			
			var x1 = x0 + (0.1+rng()*0.9) * stepLength * Math.cos(angle);
			var y1 = y0 + (0.1+rng()*0.9) * stepLength * Math.sin(angle);
			var newAngle;

			var seed = rng();
			
			this.drawBranch(ctx, trunkRadius, x0, y0, createRNG(seed + 107 * stepNo), x1, y1, mergedParams);
			
			stepNo ++;
			if (stepNo < mergedParams.steps) {
				for (forkNo=0; forkNo<forks; forkNo++) {
					var newAngle = (forks > 1 ? angle - (angleRange/2) + (forkNo) * (angleRange / (forks-1)) : angle);
					newAngle += mergedParams.stepCurvingFactor*(rng() - 0.5) * 0.1 * angleRange;
					var newStepLength = stepLength * mergedParams.stepLengthFactor;
					this.internalGenerate(ctx, rng, params, stepNo, x1, y1, newAngle, curving * mergedParams.stepCurvingFactor,newStepLength, trunkRadius * mergedParams.stepRadiusFactor, angleRange/forks, mergedParams);
				}
			}
			if (mergedParams.leavesNumber > 0.0) {
				this.drawLeaves(ctx, trunkRadius, x0, y0, createRNG(seed - 301 * stepNo), x1, y1, stepNo-1, mergedParams.steps, mergedParams);
			}
		}
        generate(ctx, seed, params) {
			var mergedParams = Object.assign({}, params, this.initialParams);
			if (!mergedParams.trunkColorGradient || !mergedParams.leavesColorGradient) {
				return;
			}
			var rng = createRNG(seed);
			var stepNo=0;
			var x0 = mergedParams.radius;
			var y0 = mergedParams.radius;
			var x1,y1;
			var angle = rng() * 6.28 * mergedParams.stepCurvingFactor;
			
			this.internalGenerate(ctx, rng, params, 0, x0, y0, angle, 1.0, mergedParams.stepLength, mergedParams.trunkRadius, 6.28, mergedParams);
		}
		getSize() {
			return [2.0 * this.initialParams.radius, 2.0 * this.initialParams.radius];
		}
		toString() {
			return "Tree(iP=" + anythingToString(this.initialParams) + ")";
		}
	}
	
    function TreeGenerator() {
		this.addInput("initialParams", "Config");
		
		this.addInput("radius", "Number");
		this.addInput("trunkRadius", "Number");
        
		this.addInput("steps", "Number");
		this.addInput("stepLength", "Number");
		this.addInput("stepLengthFactor", "Number");
		this.addInput("stepRadiusFactor", "Number");
		this.addInput("stepCurvingFactor", "Number");
		this.addInput("stepForkingFactor", "Number");
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
			stepForkingFactor: 2.0,
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
		var stepForkingFactor = this.getInputOrProperty("stepForkingFactor");
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
			stepForkingFactor: stepForkingFactor,
			stepForkingProbability: stepForkingProbability,
			leavesNumber: leavesNumber,
			leavesSize: leavesSize,
			leavesThickness: leavesThickness,
			leavesRandomness: leavesRandomness,
			trunkColorGradient: trunkColorGradient,
			leavesColorGradient: leavesColorGradient
		};
		
		newInputs = Object.assign(newInputs, this.getInputOrProperty("initialParams"));
		
		if (newInputs === this.oldInputs || deepEqual(newInputs, this.oldInputs)) {
			this.setOutputData(0, this.oldOutput);
			return;
		}
				
		this.oldInputs = Object.assign({}, newInputs);
		this.oldOutput = new Tree(this.oldInputs);
		this.setOutputData(0, this.oldOutput);
    };

    LiteGraph.registerNodeType("generators/tree", TreeGenerator);

})(this);