function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function removeDots(x) {
    return x.split('.').join('');
}

var themeColors = ["#C2DDF8", "#C3D1DE", "#78A2CC", "#6887A6", "#245A90", "#1E88E5", "#1976D2"];
var radiusPie = 80;

//updated 2022
function joinPie() {
    d3.selectAll(".pie1 .cbx").on("change", updateData);

    updateData();


    function updateData() {
        var svg = d3.select("#pie1"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = Math.min(width, height) / 2;
        var valueIznos19 = 0;
        var valueIznos20 = 0;
        var valueIznos21 = 0;
        var valueIznos22 = 0;

        svg.selectAll("g").remove();

        var g = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var color = d3.scaleOrdinal()
            .range(themeColors);
        var pie = d3.pie().value(function(d) {
            var y1checked = d3.select("#year2019").property("checked");
            var y2checked = d3.select("#year2020").property("checked");
            var y3checked = d3.select("#year2021").property("checked");
            var y4checked = d3.select("#year2022").property("checked");
            if(y1checked) {
                valueIznos19 = d.Iznos2019.split('.').join("");
            }
            if(y2checked) {
                valueIznos20 = d.Iznos2020.split('.').join("");
            }
            if(y3checked) {
                valueIznos21 = d.Iznos2021.split('.').join("");
            }
            if(y4checked) {
                valueIznos22 = d.Iznos2022.split('.').join("");
            }
            if(!y1checked && !y2checked && !y3checked && !y4checked) {
                d3.select("#year2019").property('checked', true);
                valueIznos19 = d.Iznos2019.split('.').join("");
            }
            var sum = (+valueIznos19) + (+valueIznos20) + (+valueIznos21) + (+valueIznos22);
            return sum;
        });

        var path = d3.arc()
                    .outerRadius(radius - 20)
                    .innerRadius(radiusPie);

        var label = d3.arc()
                    .outerRadius(radius)
                    .innerRadius(radius - 80);

        d3.csv("konkursi.csv", function(error, data) {
            if (error) {
                throw error;
            }

        var arc = g.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        var arc2 = g.selectAll(".arc2")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc2");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d) { return color(d.data.Sektor); });

        arc2.append("text")
            .attr("transform", function(d) {
                return "translate(" + label.centroid(d) + ")";
            })
            .each(function (d) {
                var arr = d.data.Sektor.split(" ");
                for (i = 0; i < arr.length; i++) {
                    d3.select(this).append("tspan")
                        .text(arr[i])
                        .attr("dy", i ? "1.2em" : 0)
                        .attr("x", 0)
                        .attr("text-anchor", "middle")
                        .attr("class", "p-title" + i);
                }
            })
            .each(function (d) {
                var y1checked = d3.select("#year2019").property("checked");
                var y2checked = d3.select("#year2020").property("checked");
                var y3checked = d3.select("#year2021").property("checked");
                var y4checked = d3.select("#year2022").property("checked");
                if(y1checked){
                    valueIznos19 = d.data.Iznos2019.split('.').join("");
                }
                if(y2checked){
                    valueIznos20 = d.data.Iznos2020.split('.').join("");
                }
                if(y3checked){
                    valueIznos21 = d.data.Iznos2021.split('.').join("");
                }
                if(y4checked){
                    valueIznos22 = d.data.Iznos2022.split('.').join("");
                }
                if(!y1checked && !y2checked && !y3checked && !y4checked) {
                    d3.select("#year2019").property('checked', true);
                    valueIznos19 = d.data.Iznos2019.split('.').join("");
                }
                var priceNumb = (+valueIznos19) + (+valueIznos20) + (+valueIznos21) + (+valueIznos22);
                var priceStr = priceNumb.toString();
                var price = priceStr.split(" ");
                var arr = d.data.Iznos2019.split(" ");

                for (i = 0; i < price.length; i++) {
                    d3.select(this).append("tspan")
                        .text(numberWithCommas(price[i]) + ' rsd')
                        .attr("dy", i ? "1.2em" : "18px")
                        .attr("x", 0)
                        .attr("text-anchor", "middle")
                        .attr("class", "p-text" + i);
                }
            })
        });
    }
}

function horizontalBar() {
    d3.selectAll(".hbar .radio").on("change", updateData);
    updateData();

    function updateData() {
            // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 40};

        var svg = d3.select("#graphic"),
            width = svg.attr("width") - 20,
            height = svg.attr("height") - 70;

            svg.selectAll("g").remove();
            svg.selectAll("rect").remove();
        var color = d3.scaleOrdinal()
            .range(themeColors);
        // set the ranges
        var y = d3.scaleBand()
                .range([height, 0])
                .padding(0.4);

        var x = d3.scaleLinear()
                .range([0, width]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin

        var g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        var dataDB;
        var r1 = d3.select('.hbar').select("#radio1").property("checked");
        var r2 = d3.select('.hbar').select("#radio2").property("checked");
        var r3 = d3.select('.hbar').select("#radio3").property("checked");
        var r4 = d3.select('.hbar').select("#radio4").property("checked");
        var title = document.querySelector('.js-hbar');
        if (r1) {
            dataDB = "bar2.csv";
            title.textContent = '';
            title.append("MEDIJI");
        } else if(r2) {
            dataDB = "bar3.csv";
            title.textContent = '';
            title.append("OCD");
        } else if(r3) {
            dataDB = "bar4.csv";
            title.textContent = '';
            title.append("KULTURA");
        } else if(r4) {
            dataDB = "bar5.csv";
            title.textContent = '';
            title.append("OMLADINA");
        }
        // format the data
        d3.csv(dataDB, function(error, data) {
            if (error) {
                throw error;
            }
        // Scale the range of the data in the domains
        x.domain([0, d3.max(data, function(d){ return +removeDots(d.budzet); })])
        y.domain(data.map(function(d) { return (d.nazivSektora + ' - ' + d.budzet + ' rsd'); }));

        // append the rectangles for the bar chart
        svg.selectAll(".barh")
            .data(data)
            .enter().append("rect")
            .attr("class", "barh")
            .attr("fill", function(d) { return color(d.budzet); })
            // .attr("x", function(d) { return x(d.budzet); })
            .attr("width", function(d) {return x(+removeDots(d.budzet)); } )
            .attr("y", function(d) { return y((d.nazivSektora + ' - ' + d.budzet + ' rsd')); })
            .attr("height", y.bandwidth());

        // add the x Axis
        svg.append("g")
            .attr("class", "xtick")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .attr("class", "ghbar")
            .call(d3.axisLeft(y));
        });
    }
}

function animatedBar() {
    var svg = d3.select("#bar1"),
        width = svg.attr("width"),
        height = svg.attr("height") - 120;

    var x = d3.scaleBand().range([0, width]).padding(0.4),
        y = d3.scaleLinear().range([height, 0]);
    var color = d3.scaleOrdinal().range(themeColors);

    var g = svg.append("g")
            .attr("transform", "translate(" + 0 + "," + 80 + ")");
    // symbolTriangle
    var sym = d3.symbol().type(d3.symbolTriangle).size(200);

    d3.csv("bar.csv", function(error, data) {
        if (error) {
            throw error;
        }

        x.domain(data.map(function(d) { return d.nazivSektora; }));
        y.domain([0, d3.max(data, function(d) { return +removeDots(d.budzet); })]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x).tickFormat(function(d){
            return d;
        }))

        g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .on("mouseover", onMouseOver) //Add listener for the mouseover event
         .on("mouseout", onMouseOut)   //Add listener for the mouseout event
         .attr("x", function(d) { return x(d.nazivSektora); })
         .attr("y", function(d) { return y(+removeDots(d.budzet)); })
         .attr("width", x.bandwidth())
         .transition()
         .ease(d3.easeLinear)
         .duration(400)
         .delay(function (d, i) {
             return i * 50;
         })
         .style("fill", function(d, i) {
            return color(i);
         })
         .attr("height", function(d) { return height - y(+removeDots(d.budzet)); });
    });

    //mouseover event handler function
    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'highlight');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', x.bandwidth() + 5)
          .attr("y", function(d) { return y(+removeDots(d.budzet)) - 10; })
          .attr("height", function(d) { return height - y(+removeDots(d.budzet)) + 10; });

          g.append("rect")
          .attr('class', 'val')
          .attr('x', function() {
              var xWidth = (x(d.nazivSektora) - 55);
              return xWidth;
          })
          .attr('y', function() {
              return y(+removeDots(d.budzet)) - 65;
          })
          .attr('rx', 5)
          .attr('width', 140)
          .attr("height", 40)
          .attr('fill', '#E9E9E9')

          g.select('g')
          .append("path")
          .attr("d", sym)
          .attr("fill", "#E9E9E9")
          .attr('class', 'val')
          .attr('transform', function() {
              var xWidth = x(d.nazivSektora) + 16;
              var xHeight = (height - y(+removeDots(d.budzet)) + 20)*(-1);
              return "translate(" + xWidth + "," + xHeight + ") rotate(180)";
          })

          g.append("text")
         .attr('class', 'val')
         .attr('x', function() {
             return x(d.nazivSektora) - 30;
         })
         .attr('y', function() {
             return y(+removeDots(d.budzet)) - 40;
         })
         .text(function() {
             return [ d.budzet + " rsd"];
         });
    }

    //mouseout event handler function
    function onMouseOut(d, i) {
        // use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'bar');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', x.bandwidth())
          .attr("y", function(d) { return y(+removeDots(d.budzet)); })
          .attr("height", function(d) { return height - y(+removeDots(d.budzet)); });

        d3.selectAll('.val')
          .remove()
    }
}

function showData(db, selectItem) {
    var idx = selectItem[0].closest('.js-counter').getAttribute('data-index');
    var valueNum = document.querySelectorAll('.js-value-num')[idx];
    var title = document.querySelectorAll('.js-title')[idx];
    title.innerHTML = db[idx].naziv;
    var sum = 0;
    selectItem.forEach((item, index) => {
        var indexStart = index + 1;
        item.setAttribute('data-val', Object.values(db[idx])[indexStart]);
        if (!item.checked) {
            selectItem[0].checked = true;
            var setValue = selectItem[0].getAttribute('data-val');
            valueNum.innerHTML = `<span> ${numberWithCommas(setValue)} </span>`;
            sum = +setValue;
        }
    });
}

function toggleData(selectItem) {
    var idx = selectItem[0].closest('.js-counter').getAttribute('data-index');
    var valueNum = document.querySelectorAll('.js-value-num')[idx];
    var currentSum = valueNum.querySelector('span').innerHTML;
    var sum = +removeDots(currentSum);
    selectItem.forEach((item, index) => {
        item.addEventListener('click', () => {
            var dataVal = item.getAttribute('data-val');
            if (item.checked) {
                sum = sum + +dataVal;
            } else {
                sum = sum - +dataVal;
            }
            valueNum.innerHTML = `<span> ${numberWithCommas(sum)} </span>`;
        });
    });
}

function getData() {
    var cbxParent = document.querySelectorAll('.js-counter');
    var cbx = cbxParent[0].querySelectorAll('.js-cbx');
    var cbx1 = cbxParent[1].querySelectorAll('.js-cbx');
    var cbx2 = cbxParent[2].querySelectorAll('.js-cbx');
    var cbx3 = cbxParent[3].querySelectorAll('.js-cbx');
    var cbx4 = cbxParent[4].querySelectorAll('.js-cbx');
    var cbx5 = cbxParent[5].querySelectorAll('.js-cbx');
    var dataItem = 0;

    cbxParent.forEach((item, index) => {
        item.setAttribute('data-index', index);
    });

    Papa.parse('cards.csv', {
        download: true,
        header: true,
        complete: function(results) {
            dataItem = results.data;
            showData(dataItem, cbx);
            showData(dataItem, cbx1);
            showData(dataItem, cbx2);
            showData(dataItem, cbx3);
            showData(dataItem, cbx4);
            showData(dataItem, cbx5);
            toggleData(cbx);
            toggleData(cbx1);
            toggleData(cbx2);
            toggleData(cbx3);
            toggleData(cbx4);
            toggleData(cbx5);
        }
    });
}

function tabs() {
    var tabItem = document.querySelectorAll('.js-tab');
    var tabContents = document.querySelectorAll('.js-content');
    var mainEl = document.querySelector('.js-main');
    var activeTab = 'tabs__button--active';
    var activeTabContent = 'container__content--active';

    for (var i = 0; i < tabItem.length; i++) {
        var tab = tabItem[i];
        tab.addEventListener('click', switchClass);
    }

    function switchClass(e) {
        for (var i = 0; i < tabItem.length; i++) {
            var tab = tabItem[i];
            tab.classList.remove(activeTab);
            tabContents[i].classList.remove(activeTabContent);
        }

        var index = Array.prototype.slice.call(e.target.parentElement.children).indexOf(e.target)
            e.target.classList.add(activeTab);
            tabContents[index].classList.add(activeTabContent);

        window.scroll({
            behavior: 'smooth',
            left: 0,
            top: mainEl.offsetTop
        });
    }
}

function getMap() {

	var width = 800,
	    height = 800;

	var quantize = d3.scaleQuantize()
        .domain([0, 400])
        .range(d3.range(6).map(function(i) { return "q" + i + "-9"; }));

	var projection = d3.geoAlbers()
        .center([0, 42])
        .rotate([-24.4, 0])
        .parallels([40, 50])
        .scale(4700)
        .translate([width / 2, height / 2]);

	var path = d3.geoPath()
        .projection(projection);

	var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

	svg.append("text")
        .text("")
        .attr("dx","14em")
        .attr("dy","2em")
        .attr("font-size", 14)
        .classed("stat", true);

    svg.append("text")
        .text("")
        .attr("dx","14em")
        .attr("dy","3.5em")
        .attr("font-size", 14)
        .attr("font-weight","bold")
        .classed("statValue", true);

	d3.json("map.geojson", function(error, sr) {

	svg.selectAll(".subunit")
        .data(sr.features)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return quantize(d.properties.arate);
        })
        .attr("d", path)
        .style("stroke", "#fff")
        .on("mouseover", function(d) {
            var title = d.properties.name;
            var price = numberWithCommas(d.properties.money) + ' rsd';
            d3.select(".stat").text(title)
            d3.select(".statValue").text(price)
        });

	svg.selectAll(".subunit-label")
        .data(sr.features)
        .enter().append("text")
        .attr("class", function(d) { return "subunit-label " + d.properties.name; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dx", "-2em")
        .attr("font-size", "8px")
        .text(function(d) { return d.properties.name });
	});
}

function selectNice() {
    var selectItem1 = document.querySelector('.js-select1');
    var selectItem2 = document.querySelector('.js-select2');
    var selectItem3 = document.querySelector('.js-select3');
    var selectItem4 = document.querySelector('.js-select4');
    var selectItem5 = document.querySelector('.js-select5');
    var selectItem6 = document.querySelector('.js-select6');
    var selectItem7 = document.querySelector('.js-select7');
    var selectItem8 = document.querySelector('.js-select8');
    NiceSelect.bind(selectItem1, {searchable: true});
    NiceSelect.bind(selectItem2, {searchable: true});
    NiceSelect.bind(selectItem3, {searchable: true});
    NiceSelect.bind(selectItem4, {searchable: true});
    NiceSelect.bind(selectItem5, {searchable: true});
    NiceSelect.bind(selectItem6, {searchable: true});
    NiceSelect.bind(selectItem7, {searchable: true});
    NiceSelect.bind(selectItem8, {searchable: true});
}

function filterAutocomplete() {
    var options = {
        url: "example.json",
        placeholder: "Type country",
        getValue: "name",
        list: {
          match: {
            enabled: true
          }
        }
    };
}

getMap();
tabs();
getData();
joinPie();
animatedBar();
horizontalBar();
//filterAutocomplete();
// selectNice();



