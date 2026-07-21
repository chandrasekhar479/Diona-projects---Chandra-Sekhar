// Hardcoded default data from the PDF
const DEFAULT_DATA = {
  claimNo: "20042047",
  workerName: "Madeleine Willson",
  workerAppId: "712041",
  submittedDate: "March 28, 2024 20:43",
  prescriptionDrugs: [
    { drugName: "Naproxen", datePurchased: "February 28, 2024", providerName: "Dr. Best", paidAmount: "$20.00", prescriptionDate: "February 29, 2024" }
  ],
  otcDrugs: [
    { drugName: "Advil", datePurchased: "March 28, 2024", paidAmount: "$8.00", sellerName: "Shoppers Drug Mart", reason: "Pain" }
  ],
  supplies: [
    { itemName: "Tensor", datePurchased: "February 28, 2024", providerName: "Dr. Best", prescribed: "yes", paidAmount: "$10.00", sellerName: "Shoppers Drug Mart" }
  ],
  parking: [
    { address: "333 St Mary Ave, Winnipeg MB R3C 4A5, Canada", date: "March 28, 2024", paidAmount: "$10.00", meterUsed: "yes", meterNumber: "12245" }
  ],
  mileage: [
    { appointmentDate: "March 28, 2024", facilityAddress: "HSC, 820 Sherbrook St, Winnipeg MB R3A 1R9, Canada", workplaceAddress: "WCB, 333 Broadway, Winnipeg MB R3C 4W3, Canada", km: "20 km" }
  ],
  fares: [
    { appointmentDate: "March 28, 2024", startAddress: "", facilityAddress: "HSC Winnipeg Women's Hospital, 665 William Ave, Winnipeg MB R3E 0Z2, Canada", fareType: "bus", farePaid: "$3.00" },
    { appointmentDate: "March 27, 2024", startAddress: "440 Edmonton St, Winnipeg MB R3B 2M4, Canada", facilityAddress: "25 Furby St, Winnipeg MB R3C 2A2, Canada", fareType: "taxi", farePaid: "$15.00" }
  ]
};

let suppliesCounter = 2;
let parkingCounter = 2;
let fareCounter = 3;

function addRow(tableId) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');
  const firstRow = tbody.rows[0];
  const newRow = document.createElement('tr');
  const cells = firstRow.querySelectorAll('td');
  cells.forEach((cell, idx) => {
    const td = document.createElement('td');
    const input = cell.querySelector('input');
    if (input) {
      const newInput = document.createElement('input');
      newInput.type = 'text';
      newInput.className = 'input-field';
      newInput.placeholder = input.placeholder || '';
      newInput.dataset.field = input.dataset.field || '';
      td.appendChild(newInput);
    } else {
      td.innerHTML = cell.innerHTML;
      const radios = td.querySelectorAll('input[type="radio"]');
      radios.forEach(r => { r.checked = false; r.name = r.name.replace(/\d+$/, '') + tbody.rows.length; });
    }
    newRow.appendChild(td);
  });
  tbody.appendChild(newRow);
}

function addSuppliesRow() {
  const table = document.getElementById('suppliesTable');
  const tbody = table.querySelector('tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="input-field" placeholder="Item name" data-field="itemName"></td>
    <td><input type="text" class="input-field" placeholder="MM/DD/YYYY" data-field="datePurchased"></td>
    <td><input type="text" class="input-field" placeholder="Provider name" data-field="providerName"></td>
    <td>
      <div class="radio-group">
        <label><input type="radio" name="prescribed${suppliesCounter}" value="yes"> Yes</label>
        <label><input type="radio" name="prescribed${suppliesCounter}" value="no"> No</label>
      </div>
    </td>
    <td><input type="text" class="input-field" placeholder="$0.00" data-field="paidAmount"></td>
    <td><input type="text" class="input-field" placeholder="Seller name" data-field="sellerName"></td>
  `;
  tbody.appendChild(newRow);
  suppliesCounter++;
}

function addParkingRow() {
  const table = document.getElementById('parkingTable');
  const tbody = table.querySelector('tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="input-field" placeholder="Facility address" data-field="address"></td>
    <td><input type="text" class="input-field" placeholder="MM/DD/YYYY" data-field="date"></td>
    <td><input type="text" class="input-field" placeholder="$0.00" data-field="paidAmount"></td>
    <td>
      <div class="radio-group">
        <label><input type="radio" name="meter${parkingCounter}" value="yes"> Yes</label>
        <label><input type="radio" name="meter${parkingCounter}" value="no"> No</label>
      </div>
    </td>
    <td><input type="text" class="input-field" placeholder="Meter #" data-field="meterNumber"></td>
  `;
  tbody.appendChild(newRow);
  parkingCounter++;
}

function addFareRow() {
  const table = document.getElementById('fareTable');
  const tbody = table.querySelector('tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="input-field" placeholder="MM/DD/YYYY" data-field="appointmentDate"></td>
    <td><input type="text" class="input-field" placeholder="Starting address" data-field="startAddress"></td>
    <td><input type="text" class="input-field" placeholder="Facility address" data-field="facilityAddress"></td>
    <td>
      <div class="radio-group">
        <label><input type="radio" name="fareType${fareCounter}" value="bus"> Bus</label>
        <label><input type="radio" name="fareType${fareCounter}" value="taxi"> Taxi</label>
      </div>
    </td>
    <td><input type="text" class="input-field" placeholder="$0.00" data-field="farePaid"></td>
  `;
  tbody.appendChild(newRow);
  fareCounter++;
}

function removeLastRow(tableId) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');
  if (tbody.rows.length > 1) {
    tbody.removeChild(tbody.lastElementChild);
  }
}

function parseAmount(str) {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

function calculateTableTotal(tableId, fieldName) {
  const table = document.getElementById(tableId);
  const inputs = table.querySelectorAll(`input[data-field="${fieldName}"]`);
  let total = 0;
  inputs.forEach(inp => {
    total += parseAmount(inp.value);
  });
  return total;
}

function validateAndSubmit() {
  let errors = [];
  let hasError = false;

  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));

  const privacy = document.getElementById('privacyAck');
  if (!privacy.checked) {
    document.getElementById('privacyError').classList.add('show');
    errors.push("Privacy notice must be acknowledged.");
    hasError = true;
  }

  const prescriptionRows = document.querySelectorAll('#prescriptionTable tbody tr');
  prescriptionRows.forEach((row, idx) => {
    const inputs = row.querySelectorAll('input');
    const hasAny = Array.from(inputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      inputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
    }
  });

  const otcRows = document.querySelectorAll('#otcTable tbody tr');
  otcRows.forEach((row, idx) => {
    const inputs = row.querySelectorAll('input');
    const hasAny = Array.from(inputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      inputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
    }
  });

  const supplyRows = document.querySelectorAll('#suppliesTable tbody tr');
  supplyRows.forEach((row, idx) => {
    const textInputs = row.querySelectorAll('input[type="text"]');
    const hasAny = Array.from(textInputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      textInputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
      const radios = row.querySelectorAll('input[type="radio"]');
      const radioName = radios[0]?.name;
      if (radioName) {
        const checked = row.querySelector(`input[name="${radioName}"]:checked`);
        if (!checked) {
          hasError = true;
          errors.push(`Supply row ${idx + 1}: Please select if prescribed.`);
        }
      }
    }
  });

  const parkingRows = document.querySelectorAll('#parkingTable tbody tr');
  parkingRows.forEach((row, idx) => {
    const textInputs = row.querySelectorAll('input[type="text"]');
    const hasAny = Array.from(textInputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      textInputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
      const radios = row.querySelectorAll('input[type="radio"]');
      const radioName = radios[0]?.name;
      if (radioName) {
        const checked = row.querySelector(`input[name="${radioName}"]:checked`);
        if (!checked) {
          hasError = true;
          errors.push(`Parking row ${idx + 1}: Please select if meter used.`);
        }
      }
    }
  });

  const mileageRows = document.querySelectorAll('#mileageTable tbody tr');
  mileageRows.forEach((row, idx) => {
    const inputs = row.querySelectorAll('input');
    const hasAny = Array.from(inputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      inputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
    }
  });

  const fareRows = document.querySelectorAll('#fareTable tbody tr');
  fareRows.forEach((row, idx) => {
    const textInputs = row.querySelectorAll('input[type="text"]');
    const hasAny = Array.from(textInputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      textInputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
      const radios = row.querySelectorAll('input[type="radio"]');
      const radioName = radios[0]?.name;
      if (radioName) {
        const checked = row.querySelector(`input[name="${radioName}"]:checked`);
        if (!checked) {
          hasError = true;
          errors.push(`Fare row ${idx + 1}: Please select Bus or Taxi.`);
        }
      }
    }
  });

  const prescriptionTotal = calculateTableTotal('prescriptionTable', 'paidAmount');
  const otcTotal = calculateTableTotal('otcTable', 'paidAmount');
  const suppliesTotal = calculateTableTotal('suppliesTable', 'paidAmount');
  const parkingTotal = calculateTableTotal('parkingTable', 'paidAmount');
  const fareTotal = calculateTableTotal('fareTable', 'farePaid');
  const grandTotal = prescriptionTotal + otcTotal + suppliesTotal + parkingTotal + fareTotal;

  document.getElementById('sumPrescription').textContent = '$' + prescriptionTotal.toFixed(2);
  document.getElementById('sumOTC').textContent = '$' + otcTotal.toFixed(2);
  document.getElementById('sumSupplies').textContent = '$' + suppliesTotal.toFixed(2);
  document.getElementById('sumParking').textContent = '$' + parkingTotal.toFixed(2);
  document.getElementById('sumFare').textContent = '$' + fareTotal.toFixed(2);
  document.getElementById('sumTotal').textContent = '$' + grandTotal.toFixed(2);
  document.getElementById('summaryBox').style.display = 'block';

  const resultDiv = document.getElementById('validationResults');
  if (hasError) {
    resultDiv.innerHTML = '<div style="color:#c00; font-weight:bold;">Validation failed. Please correct the highlighted fields.</div>' +
      (errors.length > 0 ? '<ul style="margin-top:4px; padding-left:16px;"><li>' + errors.join('</li><li>') + '</li></ul>' : '');
  } else {
    resultDiv.innerHTML = '<div style="color:#060; font-weight:bold;">All validations passed. Form is ready for submission.</div>';
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('submittedDate').textContent = now.toLocaleDateString('en-US', options);
  }
}

function resetForm() {
  document.getElementById('claimNoDisplay').textContent = DEFAULT_DATA.claimNo;
  document.getElementById('workerNameDisplay').textContent = DEFAULT_DATA.workerName;
  document.getElementById('workerAppId').textContent = DEFAULT_DATA.workerAppId;
  document.getElementById('submittedDate').textContent = DEFAULT_DATA.submittedDate;

  const presTbody = document.querySelector('#prescriptionTable tbody');
  presTbody.innerHTML = '';
  DEFAULT_DATA.prescriptionDrugs.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.drugName}" data-field="drugName"></td>
      <td><input type="text" class="input-field" value="${d.datePurchased}" data-field="datePurchased"></td>
      <td><input type="text" class="input-field" value="${d.providerName}" data-field="providerName"></td>
      <td><input type="text" class="input-field" value="${d.paidAmount}" data-field="paidAmount"></td>
      <td><input type="text" class="input-field" value="${d.prescriptionDate}" data-field="prescriptionDate"></td>
    `;
    presTbody.appendChild(row);
  });
  addRow('prescriptionTable');

  const otcTbody = document.querySelector('#otcTable tbody');
  otcTbody.innerHTML = '';
  DEFAULT_DATA.otcDrugs.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.drugName}" data-field="drugName"></td>
      <td><input type="text" class="input-field" value="${d.datePurchased}" data-field="datePurchased"></td>
      <td><input type="text" class="input-field" value="${d.paidAmount}" data-field="paidAmount"></td>
      <td><input type="text" class="input-field" value="${d.sellerName}" data-field="sellerName"></td>
      <td><input type="text" class="input-field" value="${d.reason}" data-field="reason"></td>
    `;
    otcTbody.appendChild(row);
  });
  addRow('otcTable');

  const supTbody = document.querySelector('#suppliesTable tbody');
  supTbody.innerHTML = '';
  suppliesCounter = 0;
  DEFAULT_DATA.supplies.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.itemName}" data-field="itemName"></td>
      <td><input type="text" class="input-field" value="${d.datePurchased}" data-field="datePurchased"></td>
      <td><input type="text" class="input-field" value="${d.providerName}" data-field="providerName"></td>
      <td>
        <div class="radio-group">
          <label><input type="radio" name="prescribed${suppliesCounter}" value="yes" ${d.prescribed === 'yes' ? 'checked' : ''}> Yes</label>
          <label><input type="radio" name="prescribed${suppliesCounter}" value="no" ${d.prescribed === 'no' ? 'checked' : ''}> No</label>
        </div>
      </td>
      <td><input type="text" class="input-field" value="${d.paidAmount}" data-field="paidAmount"></td>
      <td><input type="text" class="input-field" value="${d.sellerName}" data-field="sellerName"></td>
    `;
    supTbody.appendChild(row);
    suppliesCounter++;
  });
  addSuppliesRow();

  const parkTbody = document.querySelector('#parkingTable tbody');
  parkTbody.innerHTML = '';
  parkingCounter = 0;
  DEFAULT_DATA.parking.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.address}" data-field="address"></td>
      <td><input type="text" class="input-field" value="${d.date}" data-field="date"></td>
      <td><input type="text" class="input-field" value="${d.paidAmount}" data-field="paidAmount"></td>
      <td>
        <div class="radio-group">
          <label><input type="radio" name="meter${parkingCounter}" value="yes" ${d.meterUsed === 'yes' ? 'checked' : ''}> Yes</label>
          <label><input type="radio" name="meter${parkingCounter}" value="no" ${d.meterUsed === 'no' ? 'checked' : ''}> No</label>
        </div>
      </td>
      <td><input type="text" class="input-field" value="${d.meterNumber}" data-field="meterNumber"></td>
    `;
    parkTbody.appendChild(row);
    parkingCounter++;
  });
  addParkingRow();

  const mileTbody = document.querySelector('#mileageTable tbody');
  mileTbody.innerHTML = '';
  DEFAULT_DATA.mileage.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.appointmentDate}" data-field="appointmentDate"></td>
      <td><input type="text" class="input-field" value="${d.facilityAddress}" data-field="facilityAddress"></td>
      <td><input type="text" class="input-field" value="${d.workplaceAddress}" data-field="workplaceAddress"></td>
      <td><input type="text" class="input-field" value="${d.km}" data-field="km"></td>
    `;
    mileTbody.appendChild(row);
  });
  addRow('mileageTable');

  const fareTbody = document.querySelector('#fareTable tbody');
  fareTbody.innerHTML = '';
  fareCounter = 0;
  DEFAULT_DATA.fares.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.appointmentDate}" data-field="appointmentDate"></td>
      <td><input type="text" class="input-field" value="${d.startAddress}" data-field="startAddress"></td>
      <td><input type="text" class="input-field" value="${d.facilityAddress}" data-field="facilityAddress"></td>
      <td>
        <div class="radio-group">
          <label><input type="radio" name="fareType${fareCounter}" value="bus" ${d.fareType === 'bus' ? 'checked' : ''}> Bus</label>
          <label><input type="radio" name="fareType${fareCounter}" value="taxi" ${d.fareType === 'taxi' ? 'checked' : ''}> Taxi</label>
        </div>
      </td>
      <td><input type="text" class="input-field" value="${d.farePaid}" data-field="farePaid"></td>
    `;
    fareTbody.appendChild(row);
    fareCounter++;
  });
  addFareRow();

  document.getElementById('privacyAck').checked = true;
  document.getElementById('summaryBox').style.display = 'none';
  document.getElementById('validationResults').innerHTML = '';
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
}

function clearAll() {
  document.querySelectorAll('input[type="text"]').forEach(inp => inp.value = '');
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  document.getElementById('privacyAck').checked = false;
  document.getElementById('summaryBox').style.display = 'none';
  document.getElementById('validationResults').innerHTML = '';
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
}

document.addEventListener('input', function(e) {
  if (e.target.classList.contains('input-field') && e.target.dataset.field && 
      (e.target.dataset.field.includes('Amount') || e.target.dataset.field.includes('Paid') || e.target.dataset.field === 'paidAmount')) {
    const prescriptionTotal = calculateTableTotal('prescriptionTable', 'paidAmount');
    const otcTotal = calculateTableTotal('otcTable', 'paidAmount');
    const suppliesTotal = calculateTableTotal('suppliesTable', 'paidAmount');
    const parkingTotal = calculateTableTotal('parkingTable', 'paidAmount');
    const fareTotal = calculateTableTotal('fareTable', 'farePaid');
    const grandTotal = prescriptionTotal + otcTotal + suppliesTotal + parkingTotal + fareTotal;
    document.getElementById('sumPrescription').textContent = '$' + prescriptionTotal.toFixed(2);
    document.getElementById('sumOTC').textContent = '$' + otcTotal.toFixed(2);
    document.getElementById('sumSupplies').textContent = '$' + suppliesTotal.toFixed(2);
    document.getElementById('sumParking').textContent = '$' + parkingTotal.toFixed(2);
    document.getElementById('sumFare').textContent = '$' + fareTotal.toFixed(2);
    document.getElementById('sumTotal').textContent = '$' + grandTotal.toFixed(2);
  }
});

window.addEventListener('DOMContentLoaded', function() {
  resetForm();
});

const DEFAULT_DATA = {
  claimNo: "20042047",
  workerName: "Madeleine Willson",
  workerAppId: "712041",
  submittedDate: "March 28, 2024 20:43",
  prescriptionDrugs: [
    { drugName: "Naproxen", datePurchased: "February 28, 2024", providerName: "Dr. Best", paidAmount: "$20.00", prescriptionDate: "February 29, 2024" }
  ],
  otcDrugs: [
    { drugName: "Advil", datePurchased: "March 28, 2024", paidAmount: "$8.00", sellerName: "Shoppers Drug Mart", reason: "Pain" }
  ],
  supplies: [
    { itemName: "Tensor", datePurchased: "February 28, 2024", providerName: "Dr. Best", prescribed: "yes", paidAmount: "$10.00", sellerName: "Shoppers Drug Mart" }
  ],
  parking: [
    { address: "333 St Mary Ave, Winnipeg MB R3C 4A5, Canada", date: "March 28, 2024", paidAmount: "$10.00", meterUsed: "yes", meterNumber: "12245" }
  ],
  mileage: [
    { appointmentDate: "March 28, 2024", facilityAddress: "HSC, 820 Sherbrook St, Winnipeg MB R3A 1R9, Canada", workplaceAddress: "WCB, 333 Broadway, Winnipeg MB R3C 4W3, Canada", km: "20 km" }
  ],
  fares: [
    { appointmentDate: "March 28, 2024", startAddress: "", facilityAddress: "HSC Winnipeg Women's Hospital, 665 William Ave, Winnipeg MB R3E 0Z2, Canada", fareType: "bus", farePaid: "$3.00" },
    { appointmentDate: "March 27, 2024", startAddress: "440 Edmonton St, Winnipeg MB R3B 2M4, Canada", facilityAddress: "25 Furby St, Winnipeg MB R3C 2A2, Canada", fareType: "taxi", farePaid: "$15.00" }
  ]
};

let suppliesCounter = 2;
let parkingCounter = 2;
let fareCounter = 3;

function addRow(tableId) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');
  const firstRow = tbody.rows[0];
  const newRow = document.createElement('tr');
  const cells = firstRow.querySelectorAll('td');
  cells.forEach((cell, idx) => {
    const td = document.createElement('td');
    const input = cell.querySelector('input');
    if (input) {
      const newInput = document.createElement('input');
      newInput.type = 'text';
      newInput.className = 'input-field';
      newInput.placeholder = input.placeholder || '';
      newInput.dataset.field = input.dataset.field || '';
      td.appendChild(newInput);
    } else {
      td.innerHTML = cell.innerHTML;
      const radios = td.querySelectorAll('input[type="radio"]');
      radios.forEach(r => { r.checked = false; r.name = r.name.replace(/\d+$/, '') + tbody.rows.length; });
    }
    newRow.appendChild(td);
  });
  tbody.appendChild(newRow);
}

function addSuppliesRow() {
  const table = document.getElementById('suppliesTable');
  const tbody = table.querySelector('tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="input-field" placeholder="Item name" data-field="itemName"></td>
    <td><input type="text" class="input-field" placeholder="MM/DD/YYYY" data-field="datePurchased"></td>
    <td><input type="text" class="input-field" placeholder="Provider name" data-field="providerName"></td>
    <td>
      <div class="radio-group">
        <label><input type="radio" name="prescribed${suppliesCounter}" value="yes"> Yes</label>
        <label><input type="radio" name="prescribed${suppliesCounter}" value="no"> No</label>
      </div>
    </td>
    <td><input type="text" class="input-field" placeholder="$0.00" data-field="paidAmount"></td>
    <td><input type="text" class="input-field" placeholder="Seller name" data-field="sellerName"></td>
  `;
  tbody.appendChild(newRow);
  suppliesCounter++;
}

function addParkingRow() {
  const table = document.getElementById('parkingTable');
  const tbody = table.querySelector('tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="input-field" placeholder="Facility address" data-field="address"></td>
    <td><input type="text" class="input-field" placeholder="MM/DD/YYYY" data-field="date"></td>
    <td><input type="text" class="input-field" placeholder="$0.00" data-field="paidAmount"></td>
    <td>
      <div class="radio-group">
        <label><input type="radio" name="meter${parkingCounter}" value="yes"> Yes</label>
        <label><input type="radio" name="meter${parkingCounter}" value="no"> No</label>
      </div>
    </td>
    <td><input type="text" class="input-field" placeholder="Meter #" data-field="meterNumber"></td>
  `;
  tbody.appendChild(newRow);
  parkingCounter++;
}

function addFareRow() {
  const table = document.getElementById('fareTable');
  const tbody = table.querySelector('tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="input-field" placeholder="MM/DD/YYYY" data-field="appointmentDate"></td>
    <td><input type="text" class="input-field" placeholder="Starting address" data-field="startAddress"></td>
    <td><input type="text" class="input-field" placeholder="Facility address" data-field="facilityAddress"></td>
    <td>
      <div class="radio-group">
        <label><input type="radio" name="fareType${fareCounter}" value="bus"> Bus</label>
        <label><input type="radio" name="fareType${fareCounter}" value="taxi"> Taxi</label>
      </div>
    </td>
    <td><input type="text" class="input-field" placeholder="$0.00" data-field="farePaid"></td>
  `;
  tbody.appendChild(newRow);
  fareCounter++;
}

function removeLastRow(tableId) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');
  if (tbody.rows.length > 1) {
    tbody.removeChild(tbody.lastElementChild);
  }
}

function parseAmount(str) {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

function calculateTableTotal(tableId, fieldName) {
  const table = document.getElementById(tableId);
  const inputs = table.querySelectorAll(`input[data-field="${fieldName}"]`);
  let total = 0;
  inputs.forEach(inp => {
    total += parseAmount(inp.value);
  });
  return total;
}

function validateAndSubmit() {
  let errors = [];
  let hasError = false;

  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));

  const privacy = document.getElementById('privacyAck');
  if (!privacy.checked) {
    document.getElementById('privacyError').classList.add('show');
    errors.push("Privacy notice must be acknowledged.");
    hasError = true;
  }

  const prescriptionRows = document.querySelectorAll('#prescriptionTable tbody tr');
  prescriptionRows.forEach((row, idx) => {
    const inputs = row.querySelectorAll('input');
    const hasAny = Array.from(inputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      inputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
    }
  });

  const otcRows = document.querySelectorAll('#otcTable tbody tr');
  otcRows.forEach((row, idx) => {
    const inputs = row.querySelectorAll('input');
    const hasAny = Array.from(inputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      inputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
    }
  });

  const supplyRows = document.querySelectorAll('#suppliesTable tbody tr');
  supplyRows.forEach((row, idx) => {
    const textInputs = row.querySelectorAll('input[type="text"]');
    const hasAny = Array.from(textInputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      textInputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
      const radios = row.querySelectorAll('input[type="radio"]');
      const radioName = radios[0]?.name;
      if (radioName) {
        const checked = row.querySelector(`input[name="${radioName}"]:checked`);
        if (!checked) {
          hasError = true;
          errors.push(`Supply row ${idx + 1}: Please select if prescribed.`);
        }
      }
    }
  });

  const parkingRows = document.querySelectorAll('#parkingTable tbody tr');
  parkingRows.forEach((row, idx) => {
    const textInputs = row.querySelectorAll('input[type="text"]');
    const hasAny = Array.from(textInputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      textInputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
      const radios = row.querySelectorAll('input[type="radio"]');
      const radioName = radios[0]?.name;
      if (radioName) {
        const checked = row.querySelector(`input[name="${radioName}"]:checked`);
        if (!checked) {
          hasError = true;
          errors.push(`Parking row ${idx + 1}: Please select if meter used.`);
        }
      }
    }
  });

  const mileageRows = document.querySelectorAll('#mileageTable tbody tr');
  mileageRows.forEach((row, idx) => {
    const inputs = row.querySelectorAll('input');
    const hasAny = Array.from(inputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      inputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
    }
  });

  const fareRows = document.querySelectorAll('#fareTable tbody tr');
  fareRows.forEach((row, idx) => {
    const textInputs = row.querySelectorAll('input[type="text"]');
    const hasAny = Array.from(textInputs).some(i => i.value.trim() !== '');
    if (hasAny) {
      textInputs.forEach(inp => {
        if (inp.value.trim() === '') {
          inp.classList.add('error');
          hasError = true;
        }
      });
      const radios = row.querySelectorAll('input[type="radio"]');
      const radioName = radios[0]?.name;
      if (radioName) {
        const checked = row.querySelector(`input[name="${radioName}"]:checked`);
        if (!checked) {
          hasError = true;
          errors.push(`Fare row ${idx + 1}: Please select Bus or Taxi.`);
        }
      }
    }
  });

  const prescriptionTotal = calculateTableTotal('prescriptionTable', 'paidAmount');
  const otcTotal = calculateTableTotal('otcTable', 'paidAmount');
  const suppliesTotal = calculateTableTotal('suppliesTable', 'paidAmount');
  const parkingTotal = calculateTableTotal('parkingTable', 'paidAmount');
  const fareTotal = calculateTableTotal('fareTable', 'farePaid');
  const grandTotal = prescriptionTotal + otcTotal + suppliesTotal + parkingTotal + fareTotal;

  document.getElementById('sumPrescription').textContent = '$' + prescriptionTotal.toFixed(2);
  document.getElementById('sumOTC').textContent = '$' + otcTotal.toFixed(2);
  document.getElementById('sumSupplies').textContent = '$' + suppliesTotal.toFixed(2);
  document.getElementById('sumParking').textContent = '$' + parkingTotal.toFixed(2);
  document.getElementById('sumFare').textContent = '$' + fareTotal.toFixed(2);
  document.getElementById('sumTotal').textContent = '$' + grandTotal.toFixed(2);
  document.getElementById('summaryBox').style.display = 'block';

  const resultDiv = document.getElementById('validationResults');
  if (hasError) {
    resultDiv.innerHTML = '<div style="color:#c00; font-weight:bold;">Validation failed. Please correct the highlighted fields.</div>' +
      (errors.length > 0 ? '<ul style="margin-top:4px; padding-left:16px;"><li>' + errors.join('</li><li>') + '</li></ul>' : '');
  } else {
    resultDiv.innerHTML = '<div style="color:#060; font-weight:bold;">All validations passed. Form is ready for submission.</div>';
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('submittedDate').textContent = now.toLocaleDateString('en-US', options);
  }
}

function resetForm() {
  document.getElementById('claimNoDisplay').textContent = DEFAULT_DATA.claimNo;
  document.getElementById('workerNameDisplay').textContent = DEFAULT_DATA.workerName;
  document.getElementById('workerAppId').textContent = DEFAULT_DATA.workerAppId;
  document.getElementById('submittedDate').textContent = DEFAULT_DATA.submittedDate;

  const presTbody = document.querySelector('#prescriptionTable tbody');
  presTbody.innerHTML = '';
  DEFAULT_DATA.prescriptionDrugs.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.drugName}" data-field="drugName"></td>
      <td><input type="text" class="input-field" value="${d.datePurchased}" data-field="datePurchased"></td>
      <td><input type="text" class="input-field" value="${d.providerName}" data-field="providerName"></td>
      <td><input type="text" class="input-field" value="${d.paidAmount}" data-field="paidAmount"></td>
      <td><input type="text" class="input-field" value="${d.prescriptionDate}" data-field="prescriptionDate"></td>
    `;
    presTbody.appendChild(row);
  });
  addRow('prescriptionTable');

  const otcTbody = document.querySelector('#otcTable tbody');
  otcTbody.innerHTML = '';
  DEFAULT_DATA.otcDrugs.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.drugName}" data-field="drugName"></td>
      <td><input type="text" class="input-field" value="${d.datePurchased}" data-field="datePurchased"></td>
      <td><input type="text" class="input-field" value="${d.paidAmount}" data-field="paidAmount"></td>
      <td><input type="text" class="input-field" value="${d.sellerName}" data-field="sellerName"></td>
      <td><input type="text" class="input-field" value="${d.reason}" data-field="reason"></td>
    `;
    otcTbody.appendChild(row);
  });
  addRow('otcTable');

  const supTbody = document.querySelector('#suppliesTable tbody');
  supTbody.innerHTML = '';
  suppliesCounter = 0;
  DEFAULT_DATA.supplies.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.itemName}" data-field="itemName"></td>
      <td><input type="text" class="input-field" value="${d.datePurchased}" data-field="datePurchased"></td>
      <td><input type="text" class="input-field" value="${d.providerName}" data-field="providerName"></td>
      <td>
        <div class="radio-group">
          <label><input type="radio" name="prescribed${suppliesCounter}" value="yes" ${d.prescribed === 'yes' ? 'checked' : ''}> Yes</label>
          <label><input type="radio" name="prescribed${suppliesCounter}" value="no" ${d.prescribed === 'no' ? 'checked' : ''}> No</label>
        </div>
      </td>
      <td><input type="text" class="input-field" value="${d.paidAmount}" data-field="paidAmount"></td>
      <td><input type="text" class="input-field" value="${d.sellerName}" data-field="sellerName"></td>
    `;
    supTbody.appendChild(row);
    suppliesCounter++;
  });
  addSuppliesRow();

  const parkTbody = document.querySelector('#parkingTable tbody');
  parkTbody.innerHTML = '';
  parkingCounter = 0;
  DEFAULT_DATA.parking.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.address}" data-field="address"></td>
      <td><input type="text" class="input-field" value="${d.date}" data-field="date"></td>
      <td><input type="text" class="input-field" value="${d.paidAmount}" data-field="paidAmount"></td>
      <td>
        <div class="radio-group">
          <label><input type="radio" name="meter${parkingCounter}" value="yes" ${d.meterUsed === 'yes' ? 'checked' : ''}> Yes</label>
          <label><input type="radio" name="meter${parkingCounter}" value="no" ${d.meterUsed === 'no' ? 'checked' : ''}> No</label>
        </div>
      </td>
      <td><input type="text" class="input-field" value="${d.meterNumber}" data-field="meterNumber"></td>
    `;
    parkTbody.appendChild(row);
    parkingCounter++;
  });
  addParkingRow();

  const mileTbody = document.querySelector('#mileageTable tbody');
  mileTbody.innerHTML = '';
  DEFAULT_DATA.mileage.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.appointmentDate}" data-field="appointmentDate"></td>
      <td><input type="text" class="input-field" value="${d.facilityAddress}" data-field="facilityAddress"></td>
      <td><input type="text" class="input-field" value="${d.workplaceAddress}" data-field="workplaceAddress"></td>
      <td><input type="text" class="input-field" value="${d.km}" data-field="km"></td>
    `;
    mileTbody.appendChild(row);
  });
  addRow('mileageTable');

  const fareTbody = document.querySelector('#fareTable tbody');
  fareTbody.innerHTML = '';
  fareCounter = 0;
  DEFAULT_DATA.fares.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="input-field" value="${d.appointmentDate}" data-field="appointmentDate"></td>
      <td><input type="text" class="input-field" value="${d.startAddress}" data-field="startAddress"></td>
      <td><input type="text" class="input-field" value="${d.facilityAddress}" data-field="facilityAddress"></td>
      <td>
        <div class="radio-group">
          <label><input type="radio" name="fareType${fareCounter}" value="bus" ${d.fareType === 'bus' ? 'checked' : ''}> Bus</label>
          <label><input type="radio" name="fareType${fareCounter}" value="taxi" ${d.fareType === 'taxi' ? 'checked' : ''}> Taxi</label>
        </div>
      </td>
      <td><input type="text" class="input-field" value="${d.farePaid}" data-field="farePaid"></td>
    `;
    fareTbody.appendChild(row);
    fareCounter++;
  });
  addFareRow();

  document.getElementById('privacyAck').checked = true;
  document.getElementById('summaryBox').style.display = 'none';
  document.getElementById('validationResults').innerHTML = '';
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
}

function clearAll() {
  document.querySelectorAll('input[type="text"]').forEach(inp => inp.value = '');
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  document.getElementById('privacyAck').checked = false;
  document.getElementById('summaryBox').style.display = 'none';
  document.getElementById('validationResults').innerHTML = '';
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
}

document.addEventListener('input', function(e) {
  if (e.target.classList.contains('input-field') && e.target.dataset.field && 
      (e.target.dataset.field.includes('Amount') || e.target.dataset.field.includes('Paid') || e.target.dataset.field === 'paidAmount')) {
    const prescriptionTotal = calculateTableTotal('prescriptionTable', 'paidAmount');
    const otcTotal = calculateTableTotal('otcTable', 'paidAmount');
    const suppliesTotal = calculateTableTotal('suppliesTable', 'paidAmount');
    const parkingTotal = calculateTableTotal('parkingTable', 'paidAmount');
    const fareTotal = calculateTableTotal('fareTable', 'farePaid');
    const grandTotal = prescriptionTotal + otcTotal + suppliesTotal + parkingTotal + fareTotal;
    document.getElementById('sumPrescription').textContent = '$' + prescriptionTotal.toFixed(2);
    document.getElementById('sumOTC').textContent = '$' + otcTotal.toFixed(2);
    document.getElementById('sumSupplies').textContent = '$' + suppliesTotal.toFixed(2);
    document.getElementById('sumParking').textContent = '$' + parkingTotal.toFixed(2);
    document.getElementById('sumFare').textContent = '$' + fareTotal.toFixed(2);
    document.getElementById('sumTotal').textContent = '$' + grandTotal.toFixed(2);
  }
});

window.addEventListener('DOMContentLoaded', function() {
  resetForm();
});