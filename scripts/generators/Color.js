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
		this.color = "#000000";
    }

    Color.title = "Create a color";
    Color.desc = "Creates a color";
    Color.colors = ["#433", "#191", "#2C2", "#1F0"];

    Color.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		var r = Math.floor(Math.max(0,Math.min(255, this.getInputOrProperty("r") * 255)));
		var g = Math.floor(Math.max(0,Math.min(255, this.getInputOrProperty("g") * 255)));
		var b = Math.floor(Math.max(0,Math.min(255, this.getInputOrProperty("b") * 255)));
		var a = Math.floor(Math.max(0,Math.min(255, this.getInputOrProperty("a") * 255)));
		var hex = function(y) {
			y = y.toString(16);
			return (y.length == 1) ? '0' + y : y;
		};
		var result = "#" + hex(r) + hex(g) + hex(b); // + hex(a);
		this.color = result;
		this.setOutputData(0, result);
    };
	
	Color.prototype.onDrawBackground = function(ctx, graphcanvas, canvas, pos)
	{
		if(this.flags.collapsed)
			return;

		var y = this.size[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5;

		//button
		var oldStyle = ctx.fillStyle;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.roundRect( 50, y, this.size[0]-52, LiteGraph.NODE_TITLE_HEIGHT-3, 8, 8);
		ctx.fill();
		ctx.font = '12px serif';
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = "#ffffff";
		ctx.fillText('set color', 58, this.size[1]-8);
		ctx.fillStyle = oldStyle;

	}
	
	Color.prototype.onMouseDown = function(e, localpos, graphcanvas) {
		if (this.picker) {
			return;
		}
		
		var x0 = 50;
		var y0 = this.size[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5;
		var x1 = this.size[0] - 3;
		var y1 = this.size[1] - 3;
		var x = localpos[0];
		var y = localpos[1];
		
		if (x<x0 || x>x1 || y<y0 || y>y1) {
			return;
		}
		
		var that = this;
		this.picker = new Picker({
			parent: document.querySelector('#globalConfig'),
			color: that.color,
			popup: false,
			editor: true,
			editorFormat: 'hex',
			onDone: function(color){
				that.properties["r"] = color.rgba[0]/255.;
				that.properties["g"] = color.rgba[1]/255.;
				that.properties["b"] = color.rgba[2]/255.;
				that.properties["a"] = color.rgba[3]/255.;
				that.color = color.hex;
				this.destroy();
				that.picker = null;
			}
		});
		this.picker.show();
	}

    LiteGraph.registerNodeType("generators/Color", Color);

})(this);