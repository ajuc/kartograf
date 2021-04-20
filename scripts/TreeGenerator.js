(function(global) {
    var LiteGraph = global.LiteGraph;

    function TreeGenerator() {
		this.addInput("canvas", "canvas");
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

        //this.values = [[], [], [], []];
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
		};
    }

    TreeGenerator.title = "Tree";
    TreeGenerator.desc = "Draws a tree";
    TreeGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    TreeGenerator.prototype.onExecute = function(ctx) {
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

	/*
    TreeGenerator.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }

        var size = this.size;

        var scale = (0.5 * size[1]) / this.properties.scale;
        var colors = TreeGenerator.colors;
        var offset = size[1] * 0.5;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, size[0], size[1]);
        ctx.strokeStyle = "#555";
        ctx.beginPath();
        ctx.moveTo(0, offset);
        ctx.lineTo(size[0], offset);
        ctx.stroke();

        if (this.inputs) {
            for (var i = 0; i < 4; ++i) {
                var values = this.values[i];
                if (!this.inputs[i] || !this.inputs[i].link) {
                    continue;
                }
                ctx.strokeStyle = colors[i];
                ctx.beginPath();
                var v = values[0] * scale * -1 + offset;
                ctx.moveTo(0, Math.clamp(v, 0, size[1]));
                for (var j = 1; j < values.length && j < size[0]; ++j) {
                    var v = values[j] * scale * -1 + offset;
                    ctx.lineTo(j, Math.clamp(v, 0, size[1]));
                }
                ctx.stroke();
            }
        }
    };
	*/

    LiteGraph.registerNodeType("generators/tree", TreeGenerator);

})(this);