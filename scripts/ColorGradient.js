(function(global) {
    var LiteGraph = global.LiteGraph;

    function ColorGradient() {
		this.addInput("first", "color");
		this.addInput("last", "color");
		
		this.addOutput("gradient", "ColorGradient");
		
        this.properties = {
			first: "#00FF00",
			last: "#FF0000"
		};
    }

    ColorGradient.title = "Create a gradient";
    ColorGradient.desc = "Creates a gradient";
    ColorGradient.colors = ["#433", "#191", "#2C2", "#1F0"];

    ColorGradient.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		var first = this.getInputOrProperty("first");
		var last = this.getInputOrProperty("last");
		
		var color1 = first.replace("#", "").toUpperCase();
		var color2 = last.replace("#", "").toUpperCase();

		
		this.setOutputData(0, function(x) {
			var ratio = Math.max(0, Math.min(1, x));
			var hex = function(y) {
				y = y.toString(16);
				return (y.length == 1) ? '0' + y : y;
			};

			var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
			var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
			var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

			var result = hex(r) + hex(g) + hex(b);
			return "#" + result;
		});
    };

    LiteGraph.registerNodeType("generators/ColorGradient", ColorGradient);

})(this);