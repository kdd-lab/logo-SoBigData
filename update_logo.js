/*
This JavaScript code is part of a larger project that visualizes data in a unique way. The code is responsible for
creating a grid-based visualization of data, where each cell in the grid represents a data point.
The size of the cells and the colors used in the visualization can be adjusted by the user through a slider and buttons.
The code also includes functionality to change the color of all text elements in the visualization, and to download
the visualization as an SVG or PNG image. The visualization is redrawn whenever the user changes the selected
data point or adjusts the size of the cells.
*/

// Parameters to be set by the user
let sideLength = 100;
let colorOutput = '';

// Internal parameters
const numCells = 5;
const debugGrid = false;
let cData = '';

// Create an element

let x_logo = sideLength / numCells

// Function to draw the data to be used by the grid
function scaleMatrix(side, center, startValue, stepValue) {
    let res = new Array(side * side).fill(0);
    for (let i = 0; i < res.length; ++i) {
        const x = i % side;
        const y = Math.floor(i / side);
        const d = Math.abs(center[0] - x) + Math.abs(center[1] - y);
        const val = startValue - d * stepValue;
        res[i] = {
            pos: [x, y],
            index: i,
            val
        };
    }
    return res;
}

// Function to draw the grid
function drawGrid() {
    let invertedColors = false;
    let sideWidth;
    sideWidth = sideLength;
    const sScale = d3
        .scaleBand()
        .range([0, sideWidth])
        .domain(d3.range(5))
        // .paddingInner(0.05)
        .round(true);

    const cScale = d3.scaleOrdinal().domain([0, 1]).range(["#273580", "#e83947"]);


    function me(selection) {

        if (invertedColors) {
            cScale.domain([1, 0]);
        } else {
            cScale.domain([0, 1]);
        }

        let maxRange = d3.max(selection.datum(), (d) => d.pos[0]);
        sScale.domain(d3.range(maxRange + 1));


        const t = selection.transition().duration(750);

        const gs = selection
            .selectAll("g")
            .data(selection.datum())
            .join(
                (enter) =>
                    enter
                        .append("g")
                        .attr(
                            "transform",
                            (d) => `translate(${sScale(d.pos[0]) + sScale.bandwidth() / 2},${
                                sScale(d.pos[1]) + sScale.bandwidth() / 2
                            })
        scale(${(d.val - 10) / 100})rotate(0)`
                        )
                        .attr("opacity", (d) => d.val / 100)
                        .attr("fill", (d) => cScale((d.pos[0] + d.pos[1]) % 2)),
                (update) =>
                    update.call((update) =>
                        update
                            .transition(t)
                            .attr(
                                "transform",
                                (d) => `translate(${
                                    sScale(d.pos[0]) + sScale.bandwidth() / 2
                                },${sScale(d.pos[1]) + sScale.bandwidth() / 2})
        scale(${(d.val - 10) / 100})rotate(0)`
                            )
                            .attr("opacity", (d) => d.val / 100)
                            .attr("fill", (d) => cScale((d.pos[0] + d.pos[1]) % 2))
                    )
            );

        gs.selectAll("rect")
            .data((d) => [d])
            .join("rect")
            .attr("width", sScale.bandwidth())
            .attr("height", sScale.bandwidth())
            .attr("x", -sScale.bandwidth() / 2)
            .attr("y", -sScale.bandwidth() / 2);

    }

    me.invertedColors = function (value) {
        if (!arguments.length) return invertedColors;
        invertedColors = value;
        return me;
    };

    me.whiteVersion = function () {
        d3.selectAll('rect').attr('fill', 'green')
        return me;
    };

    me.cellWidth = function (value) {
        return sScale.bandwidth();
    };

    return me;
}


// Function to draw the logo name
function logoName(selection, data, sideLength) {
    const logoGroup = selection.append("g") // Append to the selection
        .attr("class", "logo-text");
    if (debugGrid) {
        logoGroup.append('g')
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", sideLength * 6)
            .attr("y2", 0)
            .attr("stroke", "#273580")

        logoGroup.append('g')
            .attr("class", "debug-line")
            .append("line")
            .attr("x1", 0)
            .attr("y1", sideLength)
            .attr("x2", sideLength * 6)
            .attr("y2", sideLength)
            .attr("stroke", "#273580")

        logoGroup.append('g')
            .attr("class", "debug-line")
            .append("line")
            .attr("x1", sideLength + x_logo)
            .attr("y1", 0)
            .attr("x2", sideLength + x_logo)
            .attr("y2", sideLength * 6)
            .attr("stroke", "#273580")

        logoGroup.append('g')
            .attr("class", "debug-line")
            .append("line")
            .attr("x1", sideLength)
            .attr("y1", 0)
            .attr("x2", sideLength)
            .attr("y2", sideLength * 6)
            .attr("stroke", "#273580")

        logoGroup.append('g')
            .attr("class", "debug-line")
            .append("line")
            .attr("x1", sideLength * 5.21)
            .attr("y1", 0)
            .attr("x2", sideLength * 5.21)
            .attr("y2", sideLength * 6)
            .attr("stroke", "#273580")


    }

    function me(selection) {
        const mainNameGroup = logoGroup.append('g')
            .attr("class", "logo-main-name")
            .attr("transform", `translate(${-(sideLength / numCells) / 2.5},0)`) // to fix left padding
        const SoNameGroup = mainNameGroup.append("text")
            .attr("x", sideLength + sideLength / numCells)
            .attr("y", (sideLength / numCells) * 3 + (sideLength / numCells / 4))
            .attr("font-size", `${(sideLength / numCells) * 3 * 1.5}px`)
            .append("tspan")
            .attr("fill", "#E83947")
            .attr("font-family", "Rajdhani-Medium")
            .text("SO")
        const BigNameGroup = SoNameGroup.append("tspan")
            .attr("font-family", "Rajdhani-SemiBold")
            .attr("fill", "#273580")
            .text("BIG")
        BigNameGroup.append("tspan")
            .attr("fill", "#E83947")
            .attr("font-family", "Rajdhani-Bold")
            .text("DATA")


        logoGroup.append('g')
            .data(data)
            .append("text")
            .attr("class", "logo-subtitle")
            .attr("x", sideLength + sideLength / numCells)
            .attr("y", (sideLength))
            .attr("transform", `translate(-${(sideLength / numCells) * 0.1},${-(sideLength / numCells) / 4})`) // to fix left padding
            .attr("font-size", `${(sideLength / numCells) * 1.27}px`)
            .attr("font-family", "Rajdhani-SemiBold")
            .attr("fill", "#273580")
            // .attr("alignment-baseline", "baseline")
            // .text(subText.toUpperCase())
            .text(d => d.label);

        logoGroup.append('g')
            .data(data)
            .append("text")
            .attr("class", "logo-suffix")
            .attr("x", sideLength * 5.21)
            .attr("y", sideLength / numCells * 1.2)
            .attr("transform", `translate(-${(sideLength / numCells) * 0.1},${-(sideLength / numCells) / 4})`) // to fix left padding
            .attr("font-size", `${(sideLength / numCells) * 1.27}px`)
            .attr("font-family", "Rajdhani-Bold")
            .attr("fill", "#273580")
            // .attr("alignment-baseline", "baseline")
            // .text(subText.toUpperCase())
            .text(d => d.suffix);

    }

    me.allTextColor = function (value) {
        if (!arguments.length) return whiteText;
        d3.selectAll('text').attr('fill', value)
        return me;
    };

    return me
}

function visualize(data, sideLength = 100) {
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", sideLength * 5.6) //5.21 is the width of the logo
        .attr("height", sideLength)

    // Crea la matrice scalata
    const matrix = scaleMatrix(5, [data[0].posX, data[0].posY], 100, 10);


    // Disegna la griglia utilizzando la matrice scalata
    const dg = drawGrid().invertedColors((data[0].posX + data[0].posY) % 2);
    const selection = svg.selectAll(".grid").data([matrix]);
    const symbol = selection.enter().append("g").attr("class", "grid").call(dg);
    const dt = logoName(symbol, data, sideLength).allTextColor("green");
    d3.select("main")
        .style("background-color", "#fff")
        .style("border-top", "1px solid #fff")
        .style("border-bottom", "1px solid #fff")
    return svg.call(dt)


}

document.getElementById("node-select").addEventListener("change", function () {
    const selectedNode = this.value; // Get the selected node value

    // Remove the old SVG
    d3.select("#chart").selectAll("svg").remove();

    d3.json("data/sbd-nodes.json").then(function (data) {
        const fData = data.filter(d => d.CODE === selectedNode);
        visualize(fData, sideLength);
    });
    cData = selectedNode
    return cData
});

document.getElementById("sideLength-slider").addEventListener("change", function () {
    sideLength = parseFloat(this.value); // Update the sideLength variable with the value of the slider
    console.log("sideLength main", sideLength)
    document.querySelector("label[for='sideLength-slider']").textContent = `width:  ${Math.round(sideLength * 5.6)} px, height: ${sideLength} px`;

    // Remove the old SVG
    d3.select("#chart").selectAll("svg").remove();

    // Redraw your visualization here with the new sideLength
    d3.json("data/sbd-nodes.json").then(function (data) {
        const selectedNode = document.getElementById("node-select").value;
        const fData = data.filter(d => d.CODE === selectedNode);
        visualize(fData, sideLength);
        colorOutput = '';
    });
    return sideLength
});

document.getElementById("change-color").addEventListener("click", function () {
    d3.selectAll('text').attr('fill', 'black');
    d3.selectAll('tspan').attr('fill', 'black');
    d3.selectAll('rect').attr('fill', 'black');

    d3.select("main")
        .style("background-color", "#fff")
        .style("border-top", "1px solid #fff")
        .style("border-bottom", "1px solid #fff")

    return colorOutput = '_black';

});
document.getElementById("change-color-white").addEventListener("click", function () {
    d3.selectAll('text').attr('fill', 'white');
    d3.selectAll('tspan').attr('fill', 'white');
    d3.selectAll('rect').attr('fill', 'white');

    d3.select("main")
        .style("background-color", "#273580")
        .style("border-top", "1px solid #fff")
        .style("border-bottom", "1px solid #fff")


    return colorOutput = '_white';
});

// Load the opentype.js library
// const opentype = require('opentype.js');

// Load the font

function downloadButtons() {
    <!-- Crea due bottoni per il download e inseriscili nel DOM Sotto il tag con id download -->
    const downloadButtonSVG = document.createElement("button");
    downloadButtonSVG.innerText = "SVG*";
    downloadButtonSVG.addEventListener("click", () => downloadImage("svg"));
    document.querySelector("#downlaod").appendChild(downloadButtonSVG);

    const downloadButtonPNG = document.createElement("button");
    downloadButtonPNG.innerText = "PNG";
    downloadButtonPNG.addEventListener("click", () => downloadImage("png"));
    document.querySelector("#downlaod2").appendChild(downloadButtonPNG);
    console.log('data',)

// Scarica il file SVG o PNG a seconda del parametro passato
    function downloadImage(format) {
        const svg = document.querySelector("svg");
        const svgData = new XMLSerializer().serializeToString(svg);

        if (format === "svg") {
            const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
            const svgUrl = URL.createObjectURL(svgBlob);
            const downloadLink = document.createElement("a");
            downloadLink.href = svgUrl;
            downloadLink.download = `Logo_SoBigData_${cData}_${Math.round(sideLength * 5.6)}_X_${sideLength}${colorOutput}.svg`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else if (format === "png") {
            const canvas = document.createElement("canvas");
            canvg(canvas, svgData); // Convert SVG to canvas using canvg
            const pngUrl = canvas.toDataURL("image/png"); // Convert canvas to PNG data URL

            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `Logo_SoBigData_${cData}_${Math.round(sideLength * 5.6)}_X_${sideLength}${colorOutput}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
}

downloadButtons();

// Start the script by visualizing the "SBD" value
d3.json("data/sbd-nodes.json").then(function (data) {
    visualize([data[0]]);

    cData = data[0].CODE
    console.log('cData', cData)
    return cData.CODE
});

