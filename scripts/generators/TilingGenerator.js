(function(global) {
    var LiteGraph = global.LiteGraph;

	class Tiling {
		constructor(initialParams) {
			this.initialParams = initialParams;
		}
		isEqual(other) {
            return (other instanceof Tiling) && (other.initialParams.hash === this.initialParams.hash) &&
				(other.initialParams.size === this.initialParams.size) && (other.initialParams.seed === this.initialParams.seed);
        }
        generate(ctx, seed, params) {
			var mergedParams = Object.assign({}, params, this.initialParams);
			if (!mergedParams.canvas) {
				return;
			}
			for (let x=0; x<mergedParams.maxX; x+=mergedParams.tileSize[0]) {
				for (let y=0; y<mergedParams.maxY; y+=mergedParams.tileSize[1]) {
					ctx.drawImage(mergedParams.canvas, x, y);
				}
			}
		}
		getSize() {
			return this.initialParams.tileSize;
		}
		toString() {
			return "Tiling(" + this.initialParams.hash + ")";
		}
	}
	
    function TilingGenerator() {
		this.addInput("initialParams", "Config");
		this.addInput("generator", "generator");
		this.addInput("seed", "Number");
		this.addInput("minX", "Number");
		this.addInput("minY", "Number");
		this.addInput("maxX", "Number");
		this.addInput("maxY", "Number");
		
		this.addOutput("generator", "Generator");
		
        this.properties = {
			"seed": 0,
			"minX": 0,
			"minY": 0,
			"maxX": 1024,
			"maxy": 768
		};
		
		this.oldInputs = {};
		this.oldOutput = null;
		this.canvas = null;
    }

    TilingGenerator.title = "Tiling";
    TilingGenerator.desc = "Tiles the output with the input generator";
    TilingGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    TilingGenerator.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		
		var generator = this.getInputOrProperty("generator");
		
		if (!generator) {
			return;
		}
		
		var seed = this.getInputOrProperty("seed");
		var rng = createRNG(seed);
		
		var size = generator.getSize();
		this.canvas = createOffscreenBuffer(size[0], size[1]);
		var ctx = this.canvas.getContext("2d");
		
		var newInputs = {
			"seed": seed,
			"canvas": this.canvas,
			"generator": generator,
			"hash": "" + generator,
			"tileSize": generator.getSize(),
			"minX": this.getInputOrProperty("minX"),
			"minY": this.getInputOrProperty("minY"),
			"maxX": this.getInputOrProperty("maxX"),
			"maxY": this.getInputOrProperty("maxY")
		};
		
		newInputs = Object.assign(newInputs, this.getInputOrProperty("initialParams"));
		
		if (newInputs === this.oldInputs || deepEqual(newInputs, this.oldInputs)) {
			this.setOutputData(0, this.oldOutput);
			return;
		}

		var params = {};
		
		generator.generate(ctx, seed, params);
		
		this.oldInputs = newInputs;
		this.oldOutput = new Tiling(this.oldInputs);
		this.setOutputData(0, this.oldOutput);
    };

    LiteGraph.registerNodeType("generators/TilingGenerator", TilingGenerator);

})(this);