(function(global) {
    var LiteGraph = global.LiteGraph;

    function Show() {
		this.addInput("generator", "Generator");
		this.addInput("seed", "Number");
		this.addInput("params", "Config");
		
		this.addOutput("generator", "Generator");
		
        this.properties = {
		};
		this.generator = null;
		this.seed = null;
		this.params = null;
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

		ctx.fillStyle = "#220000";
		ctx.beginPath();
		ctx.roundRect( 1, 70, this.size[0], this.size[1]-71, 8, 8);
		ctx.fill();
		if (this.generator) {
			this.generator.generate(ctx, this.seed, this.params);
		}
	}
	
	Show.prototype.computeSize = function(out) {
        var size = LGraphNode.prototype.computeSize.apply(this, out);
		if (this.generator) {
			var genSize = this.generator.getSize();
			size[0] = Math.max(size[0], genSize[0]);
			size[1] = Math.max(size[1], genSize[1]);
		}
        return size;
    };
	
    LiteGraph.registerNodeType("generators/Show", Show);

})(this);