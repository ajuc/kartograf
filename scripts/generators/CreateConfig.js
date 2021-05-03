(function(global) {
    var LiteGraph = global.LiteGraph;
	
    function CreateConfig() {
        this.properties = {
            values: [{
				text: "v1",
				value: 0.5,
				min: 0,
				max: 1
			}]
        };
		this.oldValues = [];
		this.addOutput("config", "Config");
		this.refreshWidgets();
    }

    CreateConfig.title = "Create configuration";
    CreateConfig.desc = "Creates a dictionary with key->number entries";
    CreateConfig.colors = ["#433", "#191", "#2C2", "#1F0"];

	CreateConfig.prototype.refreshWidgets = function() {
		if (this.properties.values === this.oldValues || deepEqual(this.properties.values, this.oldValues)) {
			return;
		}
		console.log("refreshing widgets");
		
		//wait for us
		this.widgets_up = false;
		
		this.widgets = [];
		
        var that = this;
		//clear widgets
		
		//recreate widgets
		var outputNo = 0;
		for (var i in this.properties.values) {
				let j = i + "";
				that.addWidget(
					"slider",
					that.properties.values[j].text,
					that.properties.values[j].value,
					function(v) {
						that.properties.values[j].value = v;
					},
					that.properties.values[j]
				);
		}
		
		oldConnections = null;
		
		//this.addOutput("config", "Config");
		
		this.addWidget("button","+","", function(v){
			that.properties.values.push({
				text: "name_" + that.properties.values.length,
				value: 0.0,
				min: 0.0,
				max: 1.0
			})
			that.refreshWidgets();
		});
		this.addWidget("button","-","", function(v){
			if (that.properties.values.length <= 0)
				return;
			that.properties.values.pop();
			that.refreshWidgets();
		});
		
		this.setSize( this.computeSize() )

		this.oldValues = Object.assign({}, this.properties.values);
		
		//done
        this.widgets_up = true;
	}
	
	CreateConfig.prototype.onPropertyChanged = function(name, value) {
		var i;
		for (i in this.widgets) {
			if (name === this.widgets[i].name) {
				this.widgets[i].value = value;
			}
		}
		this.refreshWidgets();
	};
	
    CreateConfig.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
		
		var result = {};
		var outputNo = 0;
		for (var i in this.properties.values) {
			result[this.properties.values[i].text] = this.properties.values[i].value;
			//this.setOutputData(outputNo, this.properties.values[i].value);
			outputNo ++;
		}
		
		this.setOutputData(0, result);
    };
	
    LiteGraph.registerNodeType("generators/CreateConfig", CreateConfig);
	

    //Watch a value in the editor
    function UniversalWatch() {
        this.size = [60, 30];
        this.addInput("value", 0, { label: "" });
        this.value = 0;
    }

    UniversalWatch.title = "Universal Watch";
    UniversalWatch.desc = "Show value of input";

    UniversalWatch.prototype.onExecute = function() {
        if (this.inputs[0]) {
            this.value = this.getInputData(0);
        }
    };

    UniversalWatch.prototype.getTitle = function() {
        if (this.flags.collapsed) {
            return this.inputs[0].label;
        }
        return this.title;
    };

    UniversalWatch.toString = function(o) {
        return anythingToString(o);
    };

	UniversalWatch.prototype.computeSize = function(out) {
        var size = LGraphNode.prototype.computeSize.apply(this, out);
		var lines = UniversalWatch.toString(this.value).split("\n");
		var textHeight = lines.length * 10 + 10;
		var maxTextWidth = 0;
		for (var i=0; i<lines.length; i++) {
			if (lines[i].length > maxTextWidth) {
				maxTextWidth = lines[i].length;
			}
		}
		size[0] = Math.max(size[0], maxTextWidth * 5);
        size[1] = Math.max(size[1], textHeight);
        return size;
    };
	
    UniversalWatch.prototype.onDrawBackground = function(ctx) {
        ctx.font = "9pt Calibri";
		ctx.fillStyle = "white";
		var lines = UniversalWatch.toString(this.value).split("\n");
		for (var i=0; i<lines.length; i++) {
			ctx.fillText(lines[i], 18, 10+i*10);
		}
		this.setSize(this.computeSize());
    };

    LiteGraph.registerNodeType("generators/watch", UniversalWatch);
	
})(this);
