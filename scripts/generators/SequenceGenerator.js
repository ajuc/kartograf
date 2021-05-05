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
			console.log(this.toString() + ".generate(" + seed + ", " + anythingToString(this.initialParams) + ", " + anythingToString(params) + ")");
			
			this.mergedParams = Object.assign({}, params, this.initialParams);
			console.log("this.mergedParams=" + anythingToString(this.mergedParams));
			var generator1 = this.mergedParams.generator1;
			var generator2 = this.mergedParams.generator2;
			if (generator1 && generator2) {
				console.log("DRAWING SEQUENCE " + "this.mergedParams=" + anythingToString(this.mergedParams));
				generator1.generate(ctx, seed, {});
				generator2.generate(ctx, seed + 1, {});
			}
		}
		getSize() {
			console.log("this.initialParams=" + anythingToString(this.initialParams));
			if (!this.initialParams || !this.initialParams.generator1 || !this.initialParams.generator2) {
				return [50,50];
			}
			var s1 = this.initialParams.generator1.getSize();
			var s2 = this.initialParams.generator2.getSize();
			console.log("s1=" + s1 + " s2=" + s2);
			return [Math.max(s1[0], s2[0]), Math.max(s1[1], s2[1])];
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
    }

    SequenceGenerator.title = "Sequence of Generators";
    SequenceGenerator.desc = "Executes generators in order";
    SequenceGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    SequenceGenerator.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		var generator1 = this.getInputOrProperty("generator1");
		var generator2 = this.getInputOrProperty("generator2");
		
		if (!generator1 || !generator2) {
			this.setOutputData(0, null);
			return;
		}

		var params = {
			"generator1": generator1,
			"generator2": generator2
		};
		params = Object.assign(params, this.getInputOrProperty("initialParams"));
		
		//if (params === this.oldInputs || deepEqual(params, this.oldInputs)) {
		//	this.setOutputData(0, this.oldOutput);
		//	return;
		//} else {
		//	console.log("refreshing sequence");
		//}
		
		this.oldInputs = Object.assign({}, params);
		this.oldOutput = new Sequence(params);
		this.setOutputData(0, this.oldOutput);
    };

    LiteGraph.registerNodeType("generators/SequenceGenerator", SequenceGenerator);

})(this);