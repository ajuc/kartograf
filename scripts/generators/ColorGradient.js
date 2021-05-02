(function(global) {
    var LiteGraph = global.LiteGraph;

	class ColorGradient {
		constructor(first, last) {
			this.first = first.replace("#","");
			this.last = last.replace("#","");
		}
		isEqual(other) {
            return (other instanceof ColorGradient) && (other.first === this.first) && (other.last === this.last);
        }
        apply(x) {
            var ratio = Math.max(0, Math.min(1, x));
            var hex = function(y) {
                y = y.toString(16);
                return (y.length == 1) ? '0' + y : y;
            };

            var r = Math.ceil(parseInt(this.first.substring(0,2), 16) * ratio + parseInt(this.last.substring(0,2), 16) * (1-ratio));
            var g = Math.ceil(parseInt(this.first.substring(2,4), 16) * ratio + parseInt(this.last.substring(2,4), 16) * (1-ratio));
            var b = Math.ceil(parseInt(this.first.substring(4,6), 16) * ratio + parseInt(this.last.substring(4,6), 16) * (1-ratio));

            var result = hex(r) + hex(g) + hex(b);
            return "#" + result;
        }
		toString() {
			return "ColorGradient(" + this.first + "->" + this.last+")";
		}
	}
	
	global.ColorGradient = ColorGradient;
	
    function ColorGradientGenerator() {
		this.addInput("first", "color");
		this.addInput("last", "color");
		
		this.addOutput("gradient", "ColorGradient");
		
        this.properties = {
			first: "#00FF00",
			last: "#FF0000"
		};
		this.color1 = "#000000";
		this.color2 = "#ffffff";
		this.oldColor1 = "#ff0000";
		this.oldColor2 = "#0000ff";
		this.oldOutput = null;
    }

    ColorGradientGenerator.title = "Create a gradient";
    ColorGradientGenerator.desc = "Creates a gradient";
    ColorGradientGenerator.colors = ["#433", "#191", "#2C2", "#1F0"];

    ColorGradientGenerator.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		var first = this.getInputOrProperty("first");
		var last = this.getInputOrProperty("last");
		
		this.color1 = first ? first.toUpperCase() : "#000000";
		this.color2 = last ? last.toUpperCase() : "#FFFF00";
		
		if (this.oldColor1 !== this.color1 || this.oldColor2 !== this.color2) {
			this.setOutputData(0, this.oldOutput);
		}
		
		this.oldOutput = new ColorGradient(this.color1, this.color2);
		this.setOutputData(0, this.oldOutput);
    };
	
	ColorGradientGenerator.prototype.onDrawBackground = function(ctx, graphcanvas, canvas, pos)
	{
		if(this.flags.collapsed)
			return;

		var y = this.size[1] - LiteGraph.NODE_TITLE_HEIGHT/2 + 0.5;

		var grd = ctx.createLinearGradient(50, y, this.size[0]-3, y);
		grd.addColorStop(0, this.color1);
		grd.addColorStop(1, this.color2);

		// Fill with gradient
		var oldStyle = ctx.fillStyle;
		ctx.fillStyle = grd;
		ctx.beginPath();
		ctx.roundRect( 50, y, this.size[0]-52, LiteGraph.NODE_TITLE_HEIGHT/2-3, 8, 8);
		ctx.fill();
		ctx.fillStyle = oldStyle;
	}
	
    LiteGraph.registerNodeType("generators/ColorGradient", ColorGradientGenerator);

})(this);