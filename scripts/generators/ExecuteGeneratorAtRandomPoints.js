(function(global) {
    var LiteGraph = global.LiteGraph;

    function ExecuteGeneratorAtRandomPoints() {
		this.addInput("canvas", "canvas");
		this.addInput("generator", "generator");
		this.addInput("seed", "Number");
		this.addInput("howMany", "Number");

		this.addInput("minX", "Number");
		this.addInput("minY", "Number");
		this.addInput("maxX", "Number");
		this.addInput("maxY", "Number");
		
        this.properties = {
			howMany: 32,
			minX: 0,
			minY: 0,
			maxX: 100,
			maxY: 100
		};
    }

    ExecuteGeneratorAtRandomPoints.title = "Execute a generator at random points";
    ExecuteGeneratorAtRandomPoints.desc = "Executes a generator at random points";
    ExecuteGeneratorAtRandomPoints.colors = ["#433", "#191", "#2C2", "#1F0"];

    ExecuteGeneratorAtRandomPoints.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		var canvas = this.getInputOrProperty("canvas");
		if (!canvas) {
			return;
		}
		var ctx = canvas.getContext("2d");
		
		var generator = this.getInputOrProperty("generator");
		
		if (!generator) {
			return;
		}
		
		var seed = this.getInputOrProperty("seed");
		var howMany = this.getInputOrProperty("howMany");
		var minX = this.getInputOrProperty("minX");
		var minY = this.getInputOrProperty("minY");
		var maxX = this.getInputOrProperty("maxX");
		var maxY = this.getInputOrProperty("maxY");
		var x0 = 0;
		var y0 = 0;
		var scale = 1.0;
		var angle = 0.0;
		var i;
		var rng = createRNG(seed);
		
		var params = {
		};
		
		for (i=0; i<=howMany; i++) {
			x0 = minX + rng() * (maxX-minX);
			y0 = minY + rng() * (maxY-minY);
			
			ctx.rotate(angle);
			ctx.translate(x0, y0);
			ctx.scale(scale, scale);
			
			generator.generate(ctx, x0+(maxX-minX)+y0+seed, params);
			
			ctx.scale(1/scale, 1/scale);
			ctx.translate(-x0, -y0);
			ctx.rotate(-angle);
		}
		
    };

    LiteGraph.registerNodeType("generators/ExecuteGeneratorAtRandomPoints", ExecuteGeneratorAtRandomPoints);

})(this);