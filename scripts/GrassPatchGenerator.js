(function(global) {
    var LiteGraph = global.LiteGraph;

    function GrassPatchGenerator() {
		this.addInput("radius", "Number");
		this.addInput("density", "Number");
		this.addInput("length", "Number");
		this.addInput("angleRandomness", "Number");
		this.addInput("placementRandomness", "Number");
		this.addInput("colorsGradient", "ColorGradient");
		
		this.addOutput("generator", "Generator");

        this.properties = {
			radius: 0.5,
			density: 0.25,
			length: 0.5,
			angleRandomness: 0.25,
			placementRandomness: 0.25,
			colorGradient: function (x) { return "#ff0000"; }
		};
    }

    GrassPatchGenerator.title = "Grass Patch";
    GrassPatchGenerator.desc = "Creates a generator that generates a patch of grass on-demand";
    GrassPatchGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    GrassPatchGenerator.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
			this.setOutputData(0, null);
            return;
        }
		
		var radius = this.getInputOrProperty("radius") * 25.0;
		var density = this.getInputOrProperty("density");
		var length = this.getInputOrProperty("length") * radius;
		var angleRandomness = this.getInputOrProperty("angleRandomness");
		var placementRandomness = this.getInputOrProperty("placementRandomness");
		var colorGradient = this.getInputOrProperty("colorGradient");
		
		this.setOutputData(0, {
			generate: function(ctx, seed, params) {
				var rng = createRNG(seed);
				var i=0;
				var x0,y0,x1,y1, angle;
				var maxPossiblePatches = (radius * 0.25) * (radius * 0.25);
				var patches = density * maxPossiblePatches;
				for (i=0; i<patches; i++) {
					x0 = -radius + rng()*placementRandomness * 2 * radius;
					y0 = -radius + rng()*placementRandomness * 2 * radius;
					angle = rng()*angleRandomness + (i*6.28)/patches;
					x1 = x0 + length * Math.cos(angle);
					y1 = y0 + length * Math.sin(angle);
					ctx.beginPath();
					ctx.moveTo(x0, y0);
					ctx.strokeStyle = colorGradient(rng());
					ctx.lineTo(x1, y1);
					ctx.stroke();
				}
			}
		});
    };

	/*
    GrassPatchGenerator.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }

        var size = this.size;

        var scale = (0.5 * size[1]) / this.properties.scale;
        var colors = GrassPatchGenerator.colors;
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
    };*/

    LiteGraph.registerNodeType("generators/grassPatch", GrassPatchGenerator);

})(this);