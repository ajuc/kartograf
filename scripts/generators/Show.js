(function(global) {
    var LiteGraph = global.LiteGraph;

    function Show() {
		this.addInput("generator", "Generator");
		this.addInput("seed", "Number");
		this.addInput("params", "Config");
		
		this.addOutput("generator", "Generator");
		
        this.properties = {
			"seed": 0
		};
		this.generator = null;
		this.seed = null;
		this.params = null;
		
		this.oldInputs = null;
		this.oldOutput = null;
    }

    Show.title = "Show generator";
    Show.desc = "Show what generator produces";
    Show.colors = ["#433", "#191", "#2C2", "#1F0"];

    Show.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		this.generator = this.getInputOrProperty("generator");
		this.seed = this.getInputOrProperty("seed");
		this.params = this.getInputOrProperty("params");
		
		this.setOutputData(0, this.generator);
    };
	Show.prototype.onDrawBackground = function(ctx, graphcanvas, canvas, pos)
	{
		if(this.flags.collapsed) {
			return;
		}

		var params = {
			"generator": this.generator,
			"seed": this.seed
		};
		params = Object.assign(params, this.params);
		
		if ((params === this.oldInputs || deepEqual(params, this.oldInputs))) {
			this.setOutputData(0, this.oldOutput);
			if (this.canvas && this.generator) {
				ctx.drawImage(this.canvas, 2, 65);
			}
			return;
		} else {
			console.log("refreshing Show");
		}
		
		this.oldInputs = Object.assign({}, params);
		this.oldOutput = this.generator;
		
		ctx.fillStyle = "#000000";
		ctx.beginPath();
		ctx.roundRect( 1, 70, this.size[0], this.size[1]-73, 8, 8);
		ctx.stroke();
		if (this.generator) {
			console.log("REDRAWING show: " + this.generator);
			var genSize = this.generator.getSize();
			this.canvas = null;
			this.canvas = createOffscreenBuffer(genSize[0], genSize[1]);
			var offscreenCtx = this.canvas.getContext("2d");
			this.generator.generate(offscreenCtx, this.seed, this.params);
			this.setSize(this.computeSize());
			ctx.drawImage(this.canvas, 2, 71);
			
		} else {
			ctx.fill();
		}
	}
	
	Show.prototype.computeSize = function(out) {
        var size = LGraphNode.prototype.computeSize.apply(this, out);
		if (this.generator) {
			var genSize = this.generator.getSize();
			size[0] = Math.max(size[0], genSize[0]);
			size[1] = size[1] + genSize[1];
		}
        return size;
    };
	
    LiteGraph.registerNodeType("generators/Show", Show);

})(this);