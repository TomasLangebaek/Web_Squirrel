//const fetch = require("node-fetch");

if (typeof document !== "undefined") {
  updateDisplay();
}
var logs = [];
var results = new Map();
function updateDisplay() {
  let url =
    "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

  fetch(url).then(function (response) {
    response.json().then(function (json) {
      //const body = document.querySelector("tbody");
      const body = document.getElementById("table1");
      for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        let list = obj.events;
        let string = list.toString();
        const row = document.createElement("tr");
        if (obj.squirrel === true) {
          row.className = "table-danger";
        }
        const number = document.createElement("th");
        number.textContent = i + 1;
        const events = document.createElement("td");
        events.textContent = string;
        const squirrel = document.createElement("td");
        squirrel.textContent = obj.squirrel;
        row.appendChild(number);
        row.appendChild(events);
        row.appendChild(squirrel);
        body.appendChild(row);
      }
      for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        logs.push({
          events: obj.events,
          squirrel: obj.squirrel,
        });
      }
      for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        for (var j = 0; j < obj.events.length; j++) {
          let event = obj.events[j];
          if (results.get(event) === undefined) {
            let n = coefficient(findValues(event, logs));
            results.set(event, n);
          }
        }
      }
      const mapSort1 = new Map(
        [...results.entries()].sort((a, b) => b[1] - a[1])
      );
      const body2 = document.getElementById("table2");
      let u = 1;
      for (let [key, value] of mapSort1) {
        const row = document.createElement("tr");
        const number = document.createElement("th");
        number.textContent = u;
        const event = document.createElement("td");
        event.textContent = key;
        const correlation = document.createElement("td");
        correlation.textContent = value;
        row.appendChild(number);
        row.appendChild(event);
        row.appendChild(correlation);
        body2.appendChild(row);
        u += 1;
      }
    });
  });
}

function findValues(event, logs) {
  let values = [0, 0, 0, 0]; //FN FP TN TP

  for (var i = 0; i < logs.length; i++) {
    let item = logs[i];
    let n = 0;
    if (item.events.indexOf(event) != -1) {
      n += 1;
    }
    if (item.squirrel) n += 2;
    values[n] += 1;
  }
  return values;
}

function coefficient(values) {
  let mcc = values[3] * values[0] - values[1] * values[2];
  //console.log(mcc);
  let den1 = values[3] + values[1];
  let den2 = values[3] + values[2];
  let den3 = values[0] + values[1];
  let den4 = values[0] + values[2];
  den1 *= den2;
  den1 *= den3;
  den1 *= den4;
  den1 = Math.sqrt(den1);
  mcc /= den1;
  return mcc;
}
