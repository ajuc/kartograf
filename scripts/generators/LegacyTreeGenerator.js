(function(global) {
    var LiteGraph = global.LiteGraph;
	
	class LegacyTree {
		constructor(initialParams) {
			this.initialParams = initialParams;
		}
		isEqual(other) {
            return (other instanceof LegacyTree) &&
				(deepEqual(this.initialParams, other.initialParams));
        }
		drawTreeRounded(context, centerX, centerY, size, centerRandomness,
						steps, angleSteps,
						serrationAmplitudeMin, serrationAmplitudeMax,
						serrationFrequencyMin, serrationFrequencyMax,
						serrationRngFactorX, serrationRngFactorY,
						colorGradient,
						rng,
						fillInnerStepsWithColor) {
			var seed = rng();
			var stepNo = 0.0;
			var angle = 0.0;
			var angleStep = 360.0 / angleSteps;
			
			var x, y, lastX, lastY, color, localSize, midSize, radianAngle, serrationAmplitude, serrationFrequency;
			var sizeForStep = 0;
			var stepInited, lastDrawn;
			
			var phase, phaseShift, phaseMultiplier;
			for (stepNo = 0; stepNo < steps; stepNo ++) {
				centerX = centerX + centerRandomness * (stepNo/steps) * (saw((seed + stepNo * 131.0) * 131.0));
				centerY = centerY + centerRandomness * (stepNo/steps) * (saw((seed + stepNo * 131.0) * 151.0));
				
				context.strokeStyle = rgba(0, 0, 0, 1);
				context.lineWidth = 1;
				serrationAmplitude = (serrationAmplitudeMin + (serrationAmplitudeMax - serrationAmplitudeMin) * (stepNo/steps)) * size/100;
				serrationFrequency = (serrationFrequencyMin + (serrationFrequencyMax - serrationFrequencyMin) * (stepNo/steps));
				sizeForStep = size * (steps-stepNo + 0.3 * (rng()-1.0))/steps;

				var color1 = colorGradient.apply(rng()*0.1);
				var color2 = colorGradient.apply(1-rng()*0.1);
				
				var grd = context.createRadialGradient(centerX - sizeForStep/3, centerY - sizeForStep/3, Math.max(0.01, sizeForStep/8), Math.max(0.01, centerX - sizeForStep/3), Math.max(0.01, centerY - sizeForStep/3), Math.max(0.01, sizeForStep*1.4));
				grd.addColorStop(0, color1);
				grd.addColorStop(1, color2);
				
				// Fill with gradient
				context.fillStyle = grd;
				context.strokeStyle = rgba(0, 0, 0, 1);

				context.beginPath();
				var phaseShift = rng();
				var phaseMultiplier = 4.0 + 3*rng();
				var innerPhaseDivider = 90+90*rng();
				var innerPhaseModuler = 1.0+innerPhaseDivider/3*rng();
				var innerPhaseShift = 359*rng();
				stepInited = false;
				lastDrawn = false;
				var lastAngle = -100;
				var localFrequencyModifier = rng()*0.5-1.0;
				for (angle = 0; angle < 360.0; angle += angleStep) {
					radianAngle = ((seed + angle) % 360) * Math.PI / 180.0;
					phase = 0.2 * (
						Math.sin(phaseMultiplier * (radianAngle + phaseShift*2*Math.PI))
						+ 0.5 * Math.sin(phaseMultiplier * (radianAngle*2.1 + phaseShift*3.2*Math.PI))
					);
					localSize = sizeForStep + serrationAmplitude * roundedSaw((serrationFrequency + localFrequencyModifier) * (radianAngle + phase*serrationRngFactorX) + rng() * serrationRngFactorY) + midSize;
					
					if (angle - lastAngle > 10) {
						midSize = -serrationAmplitude * rng();
						lastAngle = angle;
					}
					lastX = x;
					lastY = y;
					x = centerX + localSize * Math.cos(radianAngle);
					y = centerY + localSize * Math.sin(radianAngle);
					if(angle > 0) {
						if (stepNo == 0 || fillInnerStepsWithColor || (Math.abs(Math.round((angle + innerPhaseShift) % Math.round(innerPhaseDivider))) < 30 + innerPhaseModuler)) {
							if (!stepInited) {
								context.moveTo(x, y);
								lastDrawn = false;
							} else {
								if (lastDrawn) {
									context.lineTo(x, y);
								}
								lastDrawn = true;
							}
							stepInited = true;
						} else {
							lastDrawn = false;
							context.moveTo(x, y);
						}
					} 
					// else {
						// context.moveTo(x, y);
					// }
				}
				//context.closePath();
				if (stepNo == 0 || fillInnerStepsWithColor) {
					context.closePath()
					context.fill();
				}
				context.stroke();
			}
		}
        generate(ctx, seed, params) {
			var mergedParams = Object.assign({}, params, this.initialParams);
			if (!mergedParams.leavesColorGradient) {
				return;
			}
			var rng = createRNG(seed);
			var stepNo=0;
			var x0 = mergedParams.radius;
			var y0 = mergedParams.radius;
			var r0 = mergedParams.radius;

			var x1,y1;
			this.drawTreeRounded(
				ctx, x0, y0, r0, mergedParams.centerRandomness, mergedParams.stepsNo,
				mergedParams.angleSteps, mergedParams.serrationAmplitude,
				mergedParams.serrationAmplitude, mergedParams.serrationFrequency,
				mergedParams.serrationFrequency, mergedParams.serrationRandomness,
				mergedParams.serrationRandomness, mergedParams.leavesColorGradient,
				rng,
				false
			);
		}
		getSize() {
			return [2.0 * this.initialParams.radius, 2.0 * this.initialParams.radius];
		}
		toString() {
			return "LegacyTree(iP=" + anythingToString(this.initialParams) + ")";
		}
	}
	
    function LegacyTreeGenerator() {
		this.addInput("initialParams", "Config");
		
		this.addInput("radius", "Number");
		this.addInput("centerRandomness", "Number");
		this.addInput("stepsNo", "Number");
		this.addInput("angleSteps", "Number");
		this.addInput("serrationAmplitude", "Number");
		this.addInput("serrationFrequency", "Number");
		this.addInput("serrationRandomness", "Number");
		this.addInput("leavesColorGradient", "ColorGradient");
		
		this.addOutput("generator", "Generator");

        this.properties = {
			radius: 50.0,
			centerRandomness: 0.1,
			stepsNo: 4.0,
			angleSteps: 8.0,
			serrationAmplitude: 5.0,
			serrationFrequency: 1.0,
			serrationRandomness: 0.3,			
			leavesColorGradient: new global.ColorGradient("#004411", "#00bb00")
		};
		this.oldInputs = {};
		this.oldOutput = null;
    }

    LegacyTreeGenerator.title = "Legacy Tree";
    LegacyTreeGenerator.desc = "Draws a tree (cartoon style)";
    LegacyTreeGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    LegacyTreeGenerator.prototype.onExecute = function() {
        if (this.flags.collapsed) {
            return;
        }
		
		var radius = this.getInputOrProperty("radius");
		var centerRandomness = this.getInputOrProperty("centerRandomness");
		var stepsNo = this.getInputOrProperty("stepsNo");
		var angleSteps = this.getInputOrProperty("angleSteps");
		var serrationAmplitude = this.getInputOrProperty("serrationAmplitude");
		var serrationFrequency = this.getInputOrProperty("serrationFrequency");
		var serrationRandomness = this.getInputOrProperty("serrationRandomness");
		var leavesColorGradient = this.getInputOrProperty("leavesColorGradient");
		
		if (!leavesColorGradient) {
			this.setOutputData(0, null);
			return;
		}
		
		var newInputs = {
			radius: radius,
			centerRandomness: centerRandomness,
			stepsNo: stepsNo,
			angleSteps: angleSteps,
			serrationAmplitude: serrationAmplitude,
			serrationFrequency: serrationFrequency,
			serrationRandomness: serrationRandomness,			
			leavesColorGradient: leavesColorGradient
		};
		
		newInputs = Object.assign(newInputs, this.getInputOrProperty("initialParams"));
		
		if (newInputs === this.oldInputs || deepEqual(newInputs, this.oldInputs)) {
			this.setOutputData(0, this.oldOutput);
			return;
		}
				
		this.oldInputs = Object.assign({}, newInputs);
		this.oldOutput = new LegacyTree(this.oldInputs);
		this.setOutputData(0, this.oldOutput);
    };

    LiteGraph.registerNodeType("generators/legacyTree", LegacyTreeGenerator);

})(this);