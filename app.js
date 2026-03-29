document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const printBtn = document.getElementById('print-btn');
    const formInputs = ['width', 'thickness', 'break-strength', 'elongation', 'material-name', 'batch-no', 'joint-type'];

    // Joint Efficiency Constants
    const jointEfficiencies = {
        'none': 100,
        'friction': 80,
        'seal': 65
    };

    function calculate() {
        const width = parseFloat(document.getElementById('width').value) || 0;
        const thickness = parseFloat(document.getElementById('thickness').value) || 0;
        const breakStrength = parseFloat(document.getElementById('break-strength').value) || 0;
        const elongation = parseFloat(document.getElementById('elongation').value) || 0;
        const jointType = document.getElementById('joint-type').value;

        if (width <= 0 || thickness <= 0) return;

        // 1. Calculate Area
        const area = width * thickness;
        
        // 2. Calculate Tensile Strength (MPa)
        const tensileStrength = breakStrength / area;

        // 3. Apply Joint Efficiency (if applicable)
        const efficiency = jointEfficiencies[jointType];
        const actualStrength = breakStrength * (efficiency / 100);
        const jointTS = actualStrength / area;

        // Update UI
        document.getElementById('area-val').textContent = `${area.toFixed(2)} mm²`;
        document.getElementById('tensile-strength-val').textContent = tensileStrength.toFixed(2);
        
        const jointEffContainer = document.getElementById('joint-efficiency-container');
        if (jointType !== 'none') {
            jointEffContainer.style.display = 'flex';
            document.getElementById('joint-eff-val').textContent = `${efficiency}%`;
        } else {
            jointEffContainer.style.display = 'none';
        }

        generateReport(tensileStrength, area, efficiency);
    }

    function generateReport(ts, area, jointEff) {
        const materialName = document.getElementById('material-name').value || "PET Strapping";
        const batchNo = document.getElementById('batch-no').value || "N/A";
        const width = document.getElementById('width').value;
        const thickness = document.getElementById('thickness').value;
        const load = document.getElementById('break-strength').value;
        const elongation = document.getElementById('elongation').value;
        const jointType = document.getElementById('joint-type').options[document.getElementById('joint-type').selectedIndex].text;

        const now = new Date();
        document.getElementById('report-date').textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

        const reportHTML = `
            <div class="report-item">
                <span class="label">Material/Grade</span>
                <span class="value">${materialName}</span>
            </div>
            <div class="report-item">
                <span class="label">Batch Number</span>
                <span class="value">${batchNo}</span>
            </div>
            <div class="report-item">
                <span class="label">Dimensions (W x T)</span>
                <span class="value">${width} x ${thickness} mm</span>
            </div>
            <div class="report-item">
                <span class="label">Cross-sectional Area</span>
                <span class="value">${area.toFixed(2)} mm²</span>
            </div>
            <div class="report-item">
                <span class="label">Max Break Load</span>
                <span class="value" style="color: #cbd5e1;">${load} N</span>
            </div>
            <div class="report-item">
                <span class="label">Elongation</span>
                <span class="value">${elongation || 0} %</span>
            </div>
            <div class="report-item">
                <span class="label">Joint Type</span>
                <span class="value">${jointType}</span>
            </div>
            <div class="report-item" style="border-top: 2px solid var(--primary); margin-top: 15px; padding-top: 15px;">
                <span class="label" style="font-weight: bold; color: var(--primary);">Tensile Strength</span>
                <span class="value" style="font-size: 1.2rem; color: var(--primary);">${ts.toFixed(2)} MPa</span>
            </div>
        `;

        document.getElementById('report-content').innerHTML = reportHTML;
        printBtn.style.display = 'inline-flex';
    }

    calculateBtn.addEventListener('click', calculate);

    printBtn.addEventListener('click', () => {
        window.print();
    });

    // Auto-calculate on input
    formInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculate);
    });
});
