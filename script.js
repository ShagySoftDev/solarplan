let calculationHistory = [];

function calculateSolar() {
    let applianceRows = document.querySelectorAll(".appliance-row");
    let selectedAppliances = [];
    let totalEnergy = 0;
    let totalWatts = 0;

    applianceRows.forEach(function(row) {
        let quantity = parseFloat(row.querySelector(".quantity").value);
        let watt = parseFloat(row.querySelector(".watt").value);
        let hours = parseFloat(row.querySelector(".hours").value);

        if (quantity > 0 && watt > 0 && hours > 0) {
            let energy = quantity * watt * hours;
            totalEnergy += energy;
            totalWatts += quantity * watt;
            selectedAppliances.push({
                name: row.dataset.name,
                quantity: quantity,
                watt: watt,
                hours: hours,
                energy: energy
            });
        }
    });

    if (selectedAppliances.length === 0) {
        alert("Please fill at least one appliance with quantity, watt, and hours.");
        return;
    }

    let panelSize = totalEnergy / 5;
    let batteryCapacity = totalEnergy / (12 * 0.8);
    let inverterSize = totalWatts * 1.25;
    let estimatedCost = (panelSize * 450) + (batteryCapacity * 300) + (inverterSize * 200);

    document.getElementById("energy").innerHTML = totalEnergy.toFixed(2);
    document.getElementById("panel").innerHTML = panelSize.toFixed(2);
    document.getElementById("battery").innerHTML = batteryCapacity.toFixed(2);
    document.getElementById("inverter").innerHTML = inverterSize.toFixed(2);
    document.getElementById("appliancesCounted").innerHTML = selectedAppliances.length;
    document.getElementById("cost").innerHTML = estimatedCost.toLocaleString();
    document.getElementById("results").style.display = "block";

    updateHistory({
        appliances: selectedAppliances,
        energy: totalEnergy,
        panel: panelSize,
        battery: batteryCapacity,
        cost: estimatedCost
    });
}

function updateHistory(record) {
    calculationHistory.unshift(record);
    calculationHistory = calculationHistory.slice(0, 5);

    let historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    calculationHistory.forEach(function(item) {
        let applianceNames = item.appliances.map(function(appliance) {
            return appliance.name;
        }).join(", ");

        let row = document.createElement("div");
        row.className = "history-item";
        row.innerHTML = `
            <div>
                <strong>${item.appliances.length} home appliance(s)</strong>
                <p>${applianceNames}</p>
                <p>${item.energy.toFixed(2)} Wh/day, ${item.panel.toFixed(2)} W panel, ${item.battery.toFixed(2)} Ah battery</p>
            </div>
            <span>N${item.cost.toLocaleString()}</span>
        `;
        historyList.appendChild(row);
    });

    document.getElementById("statEnergy").innerHTML = record.energy.toFixed(0);
    document.getElementById("statPanel").innerHTML = record.panel.toFixed(0);
    document.getElementById("statBattery").innerHTML = record.battery.toFixed(0);
}
