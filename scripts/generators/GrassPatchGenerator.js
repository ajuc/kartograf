(function(global) {
    var LiteGraph = global.LiteGraph;

	class GrassPatch {
		constructor(radius, density, length, placementRandomness, angleRandomness, colorGradient) {
			this.radius = radius;
			this.density = density;
			this.length = length;
			this.placementRandomness = placementRandomness;
			this.angleRandomness = angleRandomness;
			this.colorGradient = colorGradient;
		}
		isEqual(other) {
            return (other instanceof GrassPatch) &&
					(other.radius === this.radius) &&
					(other.density === this.density) &&
					(other.length === this.length) &&
					(other.placementRandomness === this.placementRandomness) &&
					(other.angleRandomness === this.angleRandomness) &&
					(	other.colorGradient === this.colorGradient
					 || (this.colorGradient && this.colorGradient.isEqual(other.colorGradient)));
        }
        generate(ctx, seed, params) {
			console.log(this.toString() + ".generate(" + seed + ", " + params + ")");
			var rng = createRNG(seed);
			var i=0;
			var x0,y0,x1,y1, angle;
			var maxPossiblePatches = (this.radius * this.radius) / (256);
			var patches = this.density * maxPossiblePatches;
			
			for (i=0; i<patches; i++) {
				x0 = rng()*this.placementRandomness * 2 * this.radius;
				y0 = rng()*this.placementRandomness * 2 * this.radius;
				angle = rng()*this.angleRandomness + (i*6.28)/patches;
				x1 = x0 + this.length * Math.cos(angle);
				y1 = y0 + this.length * Math.sin(angle);
				
				ctx.beginPath();
				ctx.moveTo(x0, y0);
				ctx.strokeStyle = this.colorGradient.apply(rng());
				ctx.lineTo(x1, y1);
				ctx.stroke();
			}
			
		}
		getSize() {
			return [2.0 * this.radius, 2.0 * this.radius];
		}
		toString() {
			return "GrassPatch(" +
				"r= " + this.radius + ", " +
				"d= " + this.density + ", " +
				"l= " + this.length + ", " +
				"pr= " + this.placementRandomness + ", " +
				"ar= " + this.angleRandomness + ", " +
				"cg= " + this.colorGradient + ")";
		}
	}
	
    function GrassPatchGenerator() {
		this.addInput("radius", "Number");
		this.addInput("density", "Number");
		this.addInput("length", "Number");
		this.addInput("angleRandomness", "Number");
		this.addInput("placementRandomness", "Number");
		this.addInput("colorGradient", "ColorGradient");
		
		this.addOutput("generator", "Generator");

        this.properties = {
			radius: 0.5,
			density: 0.25,
			length: 0.5,
			angleRandomness: 0.25,
			placementRandomness: 0.25
		};
		this.offscreenCanvas = null;
		this.oldInputs = {};
		this.oldOutput = null;
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
		var length = this.getInputOrProperty("length");
		var angleRandomness = this.getInputOrProperty("angleRandomness");
		var placementRandomness = this.getInputOrProperty("placementRandomness");
		var colorGradient = this.getInputOrProperty("colorGradient");
		var newInputs = {
			"radius": radius,
			"density": density,
			"length": length,
			"angleRandomness": angleRandomness,
			"placementRandomness": placementRandomness,
			"colorGradient": colorGradient
		};
		
		if (newInputs === this.oldInputs || deepEqual(newInputs, this.oldInputs)) {
			this.setOutputData(0, this.oldOutput);
			return;
		} else {
			console.log("refreshing grass patch generator");
		}
		
		if (!colorGradient) {
			this.setOutputData(0, null);
			return;
		}
		
		this.oldInputs = Object.assign({}, newInputs);
		this.oldOutput = new GrassPatch(radius, density, length, placementRandomness, angleRandomness, colorGradient);
		this.setOutputData(0, this.oldOutput);
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