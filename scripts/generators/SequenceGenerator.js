(function(global) {
    var LiteGraph = global.LiteGraph;

	class Sequence {
		mergedParams;
		constructor(initialParams) {
			this.initialParams = initialParams;
		}
		isEqual(other) {
            return (other instanceof Sequence) &&
				(deepEqual(this.initialParams, other.initialParams));
        }
        generate(ctx, seed, params) {
			//console.log(this.toString() + ".generate(" + seed + ", " + anythingToString(this.initialParams) + ", " + anythingToString(params) + ")");
			
			this.mergedParams = Object.assign({}, params, this.initialParams);
			console.log("this.mergedParams=" + anythingToString(this.mergedParams));
			var generators = this.mergedParams.generators;
			//console.log("DRAWING SEQUENCE " + "this.mergedParams=" + anythingToString(this.mergedParams));
			for (let gNo in generators) {
				let generator = generators[gNo];
				if (generator) {
					generator.generate(ctx, seed, {});
					seed = (seed/2) + 997;
				}
			}
		}
		getSize() {
			//console.log("this.initialParams=" + anythingToString(this.initialParams));
			if (!this.initialParams || !this.initialParams.generators) {
				return [50,50];
			}
			var generators = this.initialParams.generators;
			var maxSize = [50, 50];
			var currentSize;
			for (let gNo in generators) {
				let generator = generators[gNo];
				if (generator) {
					currentSize = generator.getSize();
					maxSize[0] = Math.max(maxSize[0], currentSize[0]);
					maxSize[1] = Math.max(maxSize[1], currentSize[1]);
				}
			}
			return maxSize;
		}
		toString() {
			return "Sequence(iP=" + anythingToString(this.initialParams) + ")";
		}
	}
	
    function SequenceGenerator() {
		this.addInput("initialParams", "Config");
		this.addInput("generator1", "Generator");
		this.addInput("generator2", "Generator");
		
		this.addOutput("generator", "Generator");
		
        this.properties = {
		};
		
		this.oldInputs = {};
		this.oldOutput = null;
		var that = this;
		this.regex = /generator([0-9]*)/;
		this.addWidget("button","+","", function(v){
			var lastGeneratorInput = lastInputWithMatchingName(that, that.regex);
			if (lastGeneratorInput) {
				var lastNumber = parseInt(that.regex.exec(lastGeneratorInput.name)[1]);
				that.addInput("generator" + (lastNumber+1), "Generator");
			} else {
				that.addInput("generator1", "Generator");
			}
			that.setSize( that.computeSize() );
			that.setDirtyCanvas(true, true);
		});
		this.addWidget("button","-","", function(v){
			if (that.inputs.length < 4) {
				return;
			}
			that.removeInput(that.inputs.length-1);
			that.setSize( that.computeSize() );
			that.setDirtyCanvas(true, true);
		});
		this.initialized = false;
    }

    SequenceGenerator.title = "Sequence of Generators";
    SequenceGenerator.desc = "Executes generators in order";
    SequenceGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    SequenceGenerator.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
		}
		
		if (!this.initialized) {
			this.setSize( this.computeSize() );
			this.initialized = true;
		}
		
		var generator1 = this.getInputOrProperty("generator1");
		var generator2 = this.getInputOrProperty("generator2");
		var generators = [];
		
		for (let inputNo in this.inputs) {
			if (this.regex.test(this.inputs[inputNo].name)) {
				generators.push(this.getInputOrProperty(this.inputs[inputNo].name));
			}
		}
				
		if (!generators || generators.length <= 0) {
			this.setOutputData(0, null);
			return;
		}

		var params = {
			"generators": generators
		};
		params = Object.assign(params, this.getInputOrProperty("initialParams"));
		
		if (params === this.oldInputs || deepEqual(params, this.oldInputs)) {
			this.setOutputData(0, this.oldOutput);
			return;
		} else {
			console.log("refreshing sequence");
		}
		
		this.oldInputs = Object.assign({}, params);
		this.oldOutput = new Sequence(params);
		this.setOutputData(0, this.oldOutput);
    };

    LiteGraph.registerNodeType("generators/SequenceGenerator", SequenceGenerator);

})(this);