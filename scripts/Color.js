(function(global) {
    var LiteGraph = global.LiteGraph;

    function Color() {
		this.addInput("r", "Number");
		this.addInput("g", "Number");
		this.addInput("b", "Number");
		this.addInput("a", "Number");
		
		this.addOutput("color", "color");
		
        this.properties = {
			r: 0.0,
			g: 1.0,
			b: 0.0,
			a: 1.0
		};
    }

    Color.title = "Create a color";
    Color.desc = "Creates a color";
    Color.colors = ["#433", "#191", "#2C2", "#1F0"];

    Color.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		var r = Math.floor((this.getInputOrProperty("r") * 255));
		var g = Math.floor((this.getInputOrProperty("g") * 255));
		var b = Math.floor((this.getInputOrProperty("b") * 255));
		var a = Math.floor((this.getInputOrProperty("a") * 255));
		var hex = function(y) {
			y = y.toString(16);
			return (y.length == 1) ? '0' + y : y;
		};
		var result = "#" + hex(r) + hex(g) + hex(b); // + hex(a);
		this.setOutputData(0, result);
    };

    LiteGraph.registerNodeType("generators/Color", Color);

})(this);