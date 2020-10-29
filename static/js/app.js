// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Create a function to read in the JSON using D3

function init() {
  d3.json("data/samples.json").then(function (sampleData) {
    var data = sampleData;
    var dataNames = data.names;
    var selector = d3.select("#selDataset");
    dataNames.forEach(function (sample) {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Considering that 940 is the lowest ID, I have listed it as the default start point
    let sampleID = "940";
    updateData(sampleID);
  });
}

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Create a function to populate the dashboard charts with corresponding values for the selected sample

function updateData(sampleID) {
  d3.json("data/samples.json").then(function (sampleData) {
    var data = sampleData;

    var testSubject = data.samples.filter((val) => val.id == sampleID);
    var sampleSubject = testSubject[0];

    let otu_ids = sampleSubject.otu_ids;

    let otu_idList = [];
    for (let i = 0; i < otu_ids.length; i++) {
      otu_idList.push(`OTU# ${otu_ids[i]}`);
    }

    var sample_values = sampleSubject.sample_values;

    let otu_labels = sampleSubject.otu_labels;

    let samples = data.metadata.filter((val) => val.id == sampleID);
    samples = samples[0];

    let WashFreq = Object.values(samples)[6];

    let results = {
      idStr: otu_idList,
      ids: otu_ids,
      values: sample_values,
      labels: otu_labels,
    };

    barChart(results);
    bubbleChart(results);
    gaugeChart(WashFreq);
    buildMetadata(samples);
  });
}

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Create a function to populate the metadata for the selected sample to be displayed in the "Demographic Info" table

function buildMetadata(samples) {
  var body = document.getElementsByClassName("panel-body")[0];
  var tbl = document.createElement("table");
  tbl.setAttribute("id", "table");

  var tblBody = document.createElement("tbody");

  Object.entries(samples).forEach(function ([key, value]) {

    var row = document.createElement("tr");

    let key_text = document.createTextNode(`${key}:`);
    let value_text = document.createTextNode(`${value}`);

    let key_cell = document.createElement("td");
    let value_cell = document.createElement("td");

    key_cell.appendChild(key_text);
    key_cell.style.fontWeight = "bold";
    key_cell.style.fontSize = "11";
    key_cell.style.padding = "4px";

    value_cell.appendChild(value_text);
    value_cell.style.fontSize = "11";
    value_cell.style.padding = "4px";

    row.appendChild(key_cell);
    row.appendChild(value_cell);

    tblBody.append(row);
    
  });

  tbl.appendChild(tblBody);
  body.appendChild(tbl);
}

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Create a Horizontal Bar chart with a dropdown menu to display the top 10 OTUs found in that individual

function barChart(results) {
  var otu_ids = results.idStr.slice(0, 10);
  var otu_labels = results.labels.slice(0, 10);
  var sample_values = results.values.slice(0, 10);
  var otuNumID = results.ids.slice(0, 10);

  // Define the attributes for x axis, y axis, type, markers, text and labels
  var barData = [{
    x: sample_values,
    y: otu_ids,
    text: otu_labels,
    type: "bar",
    orientation: "h",
    marker: {
      color: sample_values,
      colorscale: "Blues",
      cmin: 0,
      cmax: 191,
      showscale: true,
      colorbar:{
        titlefont: {family: "Calibri", size: 11, color: 'black'},
        titleside: 'bottom',
        tickfont: {family: "Calibri", size: 11, color: 'black'},
        thickness:11,
        outlinewidth: 1,
        outlinecolor: 'black'
      },
      line: {color: 'black', width: 1},
    }
  }];

  // Define the layout of the plot
  var layout = {
    title: {text: "<b> Top 10 OTUs found in this sample </b>", font: {family: "Calibri", size: 24, xanchor: "center", yanchor: "top"}},
    autosize: false,
    width: 380,
    height: 470,
    margin: {bottom: 92, left: 47, right: 47, top: 92, pad: 4},
    xaxis: {
      title: {text: "<b> Number of Microbial Species </b>", font: {family: "Calibri", size: 19}},
    },
    yaxis: {
      autorange: "reversed",
      automargin: true,
      title: {text: "<b> OTU IDs </b>", font: {family: "Calibri", size: 19}},
    },

  };

  var config ={responsive:true}

  // Render the plot to the div tag with id "bar"
  Plotly.newPlot("bar", barData, layout, config);
}

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Create a Bubble chart that displays each sample

function bubbleChart(results) {
  var otu_ids = results.ids;
  var sample_values = results.values;
  var otu_labels = results.labels;

  // Define the attributes for x axis, y axis, type, markers, text and labels
  var bubbleData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    textinfo: "text",
    textposition: "inside",
    font: {family: "Calibri", size: 19},
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Blues"},
  }];

  // Define the layout of the plot
  var layout = {
    title: {text: "<br> <b> Sample Value vs. OTU ID </b>", family: "Calibri", size: 19},
    xaxis: {title: "<b> OTU ID </b>"},
    yaxis: {title: "<b> Bacteria count </b>", autorange: true, type: "linear"},
    font: {family: "Calibri", size: 17},
    hovermode: "closests",
    showlegend: false,
    height: 470,
    width: 1190,
    margin: {t: 0},
  };
  
  var config = {responsive:true} 

  // Render the plot to the div tag with id "bubble"
  Plotly.newPlot("bubble", bubbleData, layout);
}

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Create a Gauge chart to plot the weekly washing frequency of the individual

function gaugeChart(WFREQ) {

  // Define the wash frequency between 0 and 180 as we only want half the pie to be displayed
  var level = parseFloat(WFREQ) * 20;
  var degrees = 180 - level;
  var radius = 0.5; 
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Define the attributes for the gauge needle
  var mainPath = "M-.0 -0.047 L  .0 0.047 L";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var needle = mainPath.concat(pathX, space, pathY, pathEnd);

  // Define the attributes for x axis, y axis, type, markers, text and labels
  var gaugeData = [
    {
      x:[0],
      y:[0],
      type: "scatter",
      text: level,
      hoverinfo: "text+name",
      marker: {size: 11, color: "#30302E"},
      showlegend: false
    },
    {
      type: "pie",
      values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text:["9-8", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      font: {family: "Calibri", size: 19},
      labels:["9-8", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      marker: {colors: ["#071F4B", "#0B2E6F", "#0F3E95", "#124DBA", "#1455CC", "#2066E9", "#588DEE", "#90B3F4", "#B5CCF8", "#FFFFFF"]},
      hole: 0.47,
      showlegend: false
    }
  ]

  // Define the layout of the plot
  var layout = {
    title: "<b> Belly button wash frequency </b> <br> - Scrubs per week",
    font: {family: "Calibri", size: 17},
    height: 560,
    width: 560,
    shapes: [
      {
        type: "path",
        path: needle,
        fillcolor: "#F3EFE4",
        line: {color: "#30302E"}
      }
    ],
    xaxis: {
      zeroline:false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  }

  var gauge = document.getElementById("gauge");

  var config = {responsive:true} 

  // Render the plot to the div tag with id "gauge"
  Plotly.newPlot(gauge, gaugeData, layout, config);
}

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Initialize the dashboard
init();

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Define a function to update the corresponding data each time a new sample ID is selected

d3.selectAll("#selDataset").on("change", subjectChanged);
function subjectChanged() {
  let sampleID = d3.select("#selDataset").node().value;
  d3.selectAll("#table").remove();
  updateData(sampleID);
}

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=