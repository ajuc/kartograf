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
	localStorage.setItem("quicksavedGraph", JSON.stringify( graph.serialize()));
	console.log("saved");
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
		console.log("loaded");
	} else {
		console.log("load failed");
	}
}

function ensureEndsWith(filename, ending) {
	if (filename.endsWith(ending)) {
		return filename
	} else {
		return filename+ending;
	}
}

function saveToFile() {
	var filename = prompt("Enter filename to save", "generatorGraph.lg");
	filename = ensureEndsWith(filename, ".lg");
	if (!graph || !localStorage) {
		return;
	}
	var json = JSON.stringify( graph.serialize());
	var blob = new Blob([json], {
    type: "text/plain;charset=utf-8;",
	});
	saveAs(blob, filename);
	
	console.log("saved");
}

function loadFromFile() {
	var browser = document.getElementById("loadFileBrowser");
	browser.click();
}

function fileForLoadingChoosen(event) {
	console.debug("event=" + event);
	var file = event.target.files[0];
	file.text().then((t) => {
		console.debug("t=" + t);
		var data = JSON.parse(t);
		graph.configure(data);
		graph.start();
	});
}

function loadFromInitial() {
	var data = JSON.parse(window.initialGraph);
	graph.configure(data);
	graph.start();
}


function pause() {
	graph.stop();
}

function play() {
	graph.start();
}

function initListeners() {
	document.getElementById("loadFileBrowser").addEventListener('change', (event) => {
		var e = event;
		fileForLoadingChoosen(e);
	});
}

function init() {
	initListeners();
	graph = new LGraph();
	loadFromInitial();
	var barHeight = 100;
	var borderSize = 1;
	var barWidth = 20;
	
	var resultCanvas = document.getElementById("resultCanvas");
	var graphCanvas = document.getElementById("graphCanvas");
	graphCanvas.width = 11*window.innerWidth/12 - borderSize*4 - barWidth;
	graphCanvas.height = window.innerHeight - barHeight;
	resultCanvas.width = window.innerWidth/12 - borderSize*4 - barWidth;
	resultCanvas.height = window.innerHeight - barHeight;
	
	graphCanvas = new LGraphCanvas("#graphCanvas", graph);
	
	graph.start()
}