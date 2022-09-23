function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultSample);
    //  5. Create a variable that holds the first sample in the array.
    var resultFirstSample = resultSample[0];
    console.log(resultFirstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // otu_ids code
    var otuIDs = resultFirstSample.otu_ids
    console.log(otuIDs);

    // otu_labels code
    var otuLabels = resultFirstSample.otu_labels;
    console.log(otuLabels);

    // otu_values code
    var sampleValues = resultFirstSample.sample_values;
    console.log(sampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIDs.slice(0, 10).map(id => "OTU " + id).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var trace = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: otuIDs.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: 'h',
      marker: {
        color: 'rgb(138,282,125)',
        opacity: 0.8,}
    }];
    // 9. Create the layout for the bar chart. 
    var layout = {
      title: "Top 10 Bacteria Cultures Found",
      titlefont: {"size": 25},
      xaxis: {title: "Sample Value"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace, layout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: "Earth"
      }
    }];
    console.log(bubbleData);

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID", automargin: true},
      yaxis: {automargin: true},
      titlefont: {"size": 25},
      hovermode: "closest"
    };
    console.log(bubbleLayout);
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_SelId = data.metadata.filter(data => data.id == sample);
    console.log(metadata_SelId);  
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var result = metadata_SelId[0];
    console.log(result);
    // 3. Create a variable that holds the washing frequency.
    var washFreq = result.wfreq;
    var washFreqFloat = parseFloat(washFreq).toFixed(2);
    console.log(washFreqFloat);
        
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      title: {text: "Scrubs per Week", font: {size: 16}},
      type: "indicator",
      mode: "gauge+number",
      value: wFreq,
      tickmode: 'linear',
      gauge: {
        axis: { range: [null, 10], dtick: 2, tick0: 0 },
        bar: { color: "lime" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "black",
        steps: [
          { range: [0, 2], color: "magenta"},
          { range: [2, 4], color: "lavender"},
          { range: [4, 6], color: "orange"},
          { range: [6, 8], color: "yellow" },
          { range: [8, 10], color: "cyan" },
        ]},
        
    }];
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Belly Button Washing Frequency",
      titlefont: {"size": 25}
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
