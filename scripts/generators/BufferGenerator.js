(function(global) {
    var LiteGraph = global.LiteGraph;

	class Buffer {
		constructor(canvas, hash, size) {
			this.canvas = canvas;
			this.hash = hash;
			this.size = size;
		}
		isEqual(other) {
            return (other instanceof Buffer) && (other.hash === this.hash) && (other.size === this.size);
        }
        generate(ctx, seed, params) {
			ctx.drawImage(this.canvas, 0, 0);
		}
		getSize() {
			return this.size;
		}
		toString() {
			return "Buffer(" + this.hash + ")";
		}
	}
	
    function BufferGenerator() {
		this.addInput("generator", "generator");
		this.addInput("seed", "Number");
		
		this.addOutput("generator", "Generator");
		
        this.properties = {
		};
		
		this.oldInputs = {};
		this.oldOutput = null;
		this.canvas = null;
    }

    BufferGenerator.title = "Buffer";
    BufferGenerator.desc = "Executes generator once and keeps the result as a bitmap";
    BufferGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    BufferGenerator.prototype.onExecute = function(ctx) {
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
			"generator": generator
		};
		
		if (newInputs === this.oldInputs || deepEqual(newInputs, this.oldInputs)) {
			this.setOutputData(0, this.oldOutput);
			return;
		}

		var params = {};
		
		generator.generate(ctx, seed, params);
		
		this.oldInputs = newInputs;
		this.oldOutput = new Buffer(this.canvas, "" + generator, size);
		this.setOutputData(0, this.oldOutput);
    };

    LiteGraph.registerNodeType("generators/BufferGenerator", BufferGenerator);

})(this);