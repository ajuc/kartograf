(function(global) {
    var LiteGraph = global.LiteGraph;

    function DrawInRandomPointsGenerator() {
		this.addInput("canvasAtlas", "canvasAtlas");
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

        this.properties = {
			canvasAtlas: [],
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
		};
    }

    DrawInRandomPointsGenerator.title = "Draw in random points generator";
    DrawInRandomPointsGenerator.desc = "Draws a specified generator in random points";
    DrawInRandomPointsGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    DrawInRandomPointsGenerator.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		var canvas = this.getInputOrProperty("canvas");
		if (!canvas) {
			return;
		}
		var ctx = canvas.getContext("2d");
		
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
		
		ctx.fillStyle = "#000";
		ctx.fillRect(0,0,radius, radius);
		ctx.fillStyle = "#0F0";
		var x=radius;
		var y=radius;
		var i=0;
		var currentBranchRadius;
		for (i=0; i<=steps; i++) {
		}
		
    };

    LiteGraph.registerNodeType("generators/drawInRandomPoints", DrawInRandomPointsGenerator);

})(this);