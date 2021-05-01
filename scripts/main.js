var graph;

function reset() {
	if (!graph) {
		return;
	}
	graph.clear();
}

function save() {
	var localStorage = window.localStorage;
	if (!graph || !localStorage) {
		return;
	}
	console.log("saved");
	localStorage.setItem("quicksavedGraph", JSON.stringify( graph.serialize()));
}

function load() {
	var localStorage = window.localStorage;
	if (!graph || !localStorage) {
		return;
	}
	var data = localStorage.getItem("quicksavedGraph");
	if(data) {
		graph.configure(JSON.parse(data));
		graph.start();
	}
}

function init() {
	graph = new LGraph();
	var barHeight = 100;
	var borderSize = 1;
	var barWidth = 20;
	
	var resultCanvas = document.getElementById("resultCanvas");
	var graphCanvas = document.getElementById("graphCanvas");
	graphCanvas.width = 7*window.innerWidth/8 - borderSize*4 - barWidth;
	graphCanvas.height = window.innerHeight - barHeight;
	resultCanvas.width = window.innerWidth/8 - borderSize*4 - barWidth;
	resultCanvas.height = window.innerHeight - barHeight;
	
	graphCanvas = new LGraphCanvas("#graphCanvas", graph);
	


	var node_const = LiteGraph.createNode("basic/const");
	node_const.pos = [200,200];
	graph.add(node_const);
	node_const.setValue(4.5);

	var node_watch = LiteGraph.createNode("basic/watch");
	node_watch.pos = [700,200];
	graph.add(node_watch);

	node_const.connect(0, node_watch, 0 );

	graph.start()
}