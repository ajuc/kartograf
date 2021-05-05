window.initialGraph = '{"last_node_id":20,"last_link_id":32,"nodes":[{"id":8,"type":"generators/BufferGenerator","pos":[727,159],"size":{"0":161.1999969482422,"1":46},"flags":{},"order":17,"mode":0,"inputs":[{"name":"generator","type":"generator","link":13},{"name":"seed","type":"Number","link":10}],"outputs":[{"name":"generator","type":"Generator","links":[19]}],"properties":{}},{"id":12,"type":"generators/Color","pos":[-291.9636,118.14150000000038],"size":{"0":140,"1":86},"flags":{},"order":0,"mode":0,"inputs":[{"name":"r","type":"Number","link":null},{"name":"g","type":"Number","link":null},{"name":"b","type":"Number","link":null},{"name":"a","type":"Number","link":null}],"outputs":[{"name":"color","type":"color","links":[21]}],"properties":{"r":0.48627450980392156,"g":0.4117647058823529,"b":0.20392156862745098,"a":0.00392156862745098},"color":"#7c6934"},{"id":11,"type":"generators/Color","pos":[-292.9636,-18.858500000000234],"size":{"0":140,"1":86},"flags":{},"order":1,"mode":0,"inputs":[{"name":"r","type":"Number","link":null},{"name":"g","type":"Number","link":null},{"name":"b","type":"Number","link":null},{"name":"a","type":"Number","link":null}],"outputs":[{"name":"color","type":"color","links":[20]}],"properties":{"r":0.611764705882353,"g":0.32941176470588235,"b":0.14901960784313725,"a":0.00392156862745098},"color":"#9c5426"},{"id":6,"type":"generators/ExecuteGeneratorAtRandomPoints","pos":[556,260],"size":{"0":302.3999938964844,"1":146},"flags":{},"order":15,"mode":0,"inputs":[{"name":"initialParams","type":"Config","link":7},{"name":"generator","type":"generator","link":5},{"name":"howMany","type":"Number","link":null},{"name":"minX","type":"Number","link":null},{"name":"minY","type":"Number","link":null},{"name":"maxX","type":"Number","link":null},{"name":"maxY","type":"Number","link":null}],"outputs":[{"name":"generator","type":"Generator","links":[13]}],"properties":{"howMany":32,"minX":0,"minY":0,"maxX":100,"maxY":100}},{"id":9,"type":"generators/Show","pos":[594,452],"size":{"0":179,"1":245},"flags":{},"order":16,"mode":0,"inputs":[{"name":"generator","type":"Generator","link":16},{"name":"seed","type":"Number","link":15},{"name":"params","type":"Config","link":null}],"outputs":[{"name":"generator","type":"Generator","links":null}],"properties":{"seed":0},"color":"#233","bgcolor":"#355"},{"id":10,"type":"generators/ColorGradient","pos":[-178,294],"size":{"0":140,"1":46},"flags":{},"order":12,"mode":0,"inputs":[{"name":"first","type":"color","link":20},{"name":"last","type":"color","link":21}],"outputs":[{"name":"gradient","type":"ColorGradient","links":[17]}],"properties":{"first":"#00FF00","last":"#FF0000"}},{"id":16,"type":"generators/ColorGradient","pos":[-187.96360000000016,397.1415000000006],"size":{"0":140,"1":46},"flags":{},"order":13,"mode":0,"inputs":[{"name":"first","type":"color","link":32},{"name":"last","type":"color","link":31}],"outputs":[{"name":"gradient","type":"ColorGradient","links":[25]}],"properties":{"first":"#00FF00","last":"#FF0000"}},{"id":15,"type":"generators/Color","pos":[-349,316],"size":{"0":140,"1":86},"flags":{},"order":2,"mode":0,"inputs":[{"name":"r","type":"Number","link":null},{"name":"g","type":"Number","link":null},{"name":"b","type":"Number","link":null},{"name":"a","type":"Number","link":null}],"outputs":[{"name":"color","type":"color","links":[32]}],"properties":{"r":0.03529411764705882,"g":0.36470588235294116,"b":0.03529411764705882,"a":0.00392156862745098},"color":"#095d09"},{"id":14,"type":"generators/Color","pos":[-326,457],"size":{"0":140,"1":86},"flags":{},"order":3,"mode":0,"inputs":[{"name":"r","type":"Number","link":null},{"name":"g","type":"Number","link":null},{"name":"b","type":"Number","link":null},{"name":"a","type":"Number","link":null}],"outputs":[{"name":"color","type":"color","links":[31]}],"properties":{"r":0.09803921568627451,"g":0.9019607843137255,"b":0.09803921568627451,"a":0.00392156862745098},"color":"#19e619"},{"id":1,"type":"basic/const","pos":[282,54],"size":[180,30],"flags":{},"order":4,"mode":0,"outputs":[{"name":"value","type":"number","links":[4,10,15],"label":"80.200"}],"properties":{"value":80.19999999999925}},{"id":3,"type":"generators/tree","pos":[256,427],"size":{"0":270.3999938964844,"1":286},"flags":{},"order":14,"mode":0,"inputs":[{"name":"radius","type":"Number","link":3},{"name":"trunkRadius","type":"Number","link":29},{"name":"steps","type":"Number","link":27},{"name":"stepLength","type":"Number","link":26},{"name":"stepLengthFactor","type":"Number","link":28},{"name":"stepRadiusFactor","type":"Number","link":null},{"name":"stepCurvingFactor","type":"Number","link":null},{"name":"stepForkingProbability","type":"Number","link":null},{"name":"leavesNumber","type":"Number","link":22},{"name":"leavesSize","type":"Number","link":null},{"name":"leavesThickness","type":"Number","link":null},{"name":"leavesRandomness","type":"Number","link":null},{"name":"trunkColorGradient","type":"ColorGradient","link":17},{"name":"leavesColorGradient","type":"ColorGradient","link":25}],"outputs":[{"name":"generator","type":"Generator","links":[5,16]}],"properties":{"radius":100,"trunkRadius":6,"steps":8,"stepLength":15,"stepLengthFactor":1,"stepRadiusFactor":0.8,"stepCurvingFactor":1,"stepForkingProbability":0.5,"leavesNumber":0,"leavesSize":4,"leavesThickness":3,"leavesRandomness":0.5,"trunkColorGradient":{"first":"661111","last":"bb1111"},"leavesColorGradient":{"first":"004411","last":"00bb00"}}},{"id":19,"type":"basic/const","pos":[-82,747],"size":[180,30],"flags":{},"order":6,"mode":0,"outputs":[{"name":"value","type":"number","links":[28],"label":"1.600"}],"properties":{"value":1.5999999999999996}},{"id":5,"type":"basic/const","pos":[17,160],"size":[180,30],"flags":{},"order":7,"mode":0,"outputs":[{"name":"value","type":"number","links":[3],"label":"89.500"}],"properties":{"value":89.50000000000036}},{"id":18,"type":"basic/const","pos":[-7,455],"size":[180,30],"flags":{},"order":8,"mode":0,"outputs":[{"name":"value","type":"number","links":[27],"label":"6.100"}],"properties":{"value":6.099999999999983}},{"id":17,"type":"basic/const","pos":[-49,526],"size":[180,30],"flags":{},"order":9,"mode":0,"outputs":[{"name":"value","type":"number","links":[26],"label":"2.400"}],"properties":{"value":2.400000000000108}},{"id":4,"type":"generators/Show","pos":[938,19],"size":{"0":1000,"1":1066},"flags":{},"order":18,"mode":0,"inputs":[{"name":"generator","type":"Generator","link":19},{"name":"seed","type":"Number","link":4},{"name":"params","type":"Config","link":null}],"outputs":[{"name":"generator","type":"Generator","links":null}],"properties":{"seed":0}},{"id":7,"type":"generators/CreateConfig","pos":[252,139],"size":{"0":210,"1":202},"flags":{},"order":10,"mode":0,"outputs":[{"name":"config","type":"Config","links":[7]}],"properties":{"values":[{"text":"howMany","value":12.97733859591997,"min":0,"max":100},{"text":"minX","value":-0.9274376763237342,"min":-1000,"max":1000},{"text":"minY","value":-0.45401746961658773,"min":-1000,"max":1000},{"text":"maxX","value":1000,"min":-1000,"max":1000},{"text":"maxY","value":1000,"min":-1000,"max":1000}]}},{"id":20,"type":"basic/const","pos":[2,364],"size":[180,30],"flags":{},"order":5,"mode":0,"outputs":[{"name":"value","type":"number","links":[29],"label":"22.300"}],"properties":{"value":22.299999999999898}},{"id":13,"type":"basic/const","pos":[48,819],"size":[180,30],"flags":{},"order":11,"mode":0,"outputs":[{"name":"value","type":"number","links":[22],"label":"349.200"}],"properties":{"value":349.19999999999885}}],"links":[[3,5,0,3,0,"Number"],[4,1,0,4,1,"Number"],[5,3,0,6,1,"generator"],[7,7,0,6,0,"Config"],[10,1,0,8,1,"Number"],[13,6,0,8,0,"generator"],[15,1,0,9,1,"Number"],[16,3,0,9,0,"Generator"],[17,10,0,3,12,"ColorGradient"],[19,8,0,4,0,"Generator"],[20,11,0,10,0,"color"],[21,12,0,10,1,"color"],[22,13,0,3,8,"Number"],[25,16,0,3,13,"ColorGradient"],[26,17,0,3,3,"Number"],[27,18,0,3,2,"Number"],[28,19,0,3,4,"Number"],[29,20,0,3,1,"Number"],[31,14,0,16,1,"color"],[32,15,0,16,0,"color"]],"groups":[],"config":{},"extra":{},"version":0.4}';