// Worker Progress Report - Form Handling Script

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize form state
    initializeForm();
    
    // Set up event listeners
    setupEventListeners();
    
    // Auto-save functionality
    setupAutoSave();
    
    // Form validation
    setupValidation();
});

/**
 * Initialize form with default values and state
 */
function initializeForm() {
    // Set current date for any empty date fields if needed
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value && input.classList.contains('auto-date')) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });
    
    // Update footer page info
    updatePageInfo();
}

/**
 * Set up all event listeners for form interactions
 */
function setupEventListeners() {
    // Radio button change handlers for conditional fields
    const medicalRadio = document.querySelectorAll('input[name="medical_treatment"]');
    medicalRadio.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleSubFields(this, '.sub-fields');
        });
    });
    
    const medicationRadio = document.querySelectorAll('input[name="medication"]');
    medicationRadio.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleSubFields(this, '.sub-fields');
        });
    });
    
    const returnRadio = document.querySelectorAll('input[name="return_status"]');
    returnRadio.forEach(radio => {
        radio.addEventListener('change', function() {
            handleReturnStatusChange(this);
        });
    });
    
    // Pain scale selection handler
    const painRadios = document.querySelectorAll('input[name="pain_scale"]');
    painRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            highlightPainScale(this.value);
        });
    });
    
    // Form submission handler
    const form = document.querySelector('.container');
    if (form) {
        // Prevent actual submission, handle via JS
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm();
        });
    }
    
    // Input change tracking
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        input.addEventListener('change', function() {
            markAsModified(this);
            saveToLocalStorage();
        });
    });
}

/**
 * Toggle visibility of sub-fields based on radio selection
 */
function toggleSubFields(radio, subFieldSelector) {
    const parentGroup = radio.closest('.form-group');
    const subFields = parentGroup.querySelector(subFieldSelector);
    
    if (subFields) {
        if (radio.value === 'receiving' || radio.value === 'taking') {
            subFields.style.display = 'block';
            // Focus first input
            const firstInput = subFields.querySelector('input, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        } else {
            subFields.style.display = 'none';
        }
    }
}

/**
 * Handle return to work status changes
 */
function handleReturnStatusChange(radio) {
    const workStatusRadios = document.querySelectorAll('input[name="work_status"]');
    
    if (radio.value === 'not_returned') {
        workStatusRadios.forEach(r => {
            r.disabled = true;
            r.checked = false;
        });
    } else {
        workStatusRadios.forEach(r => {
            r.disabled = false;
        });
    }
}

/**
 * Highlight selected pain scale option
 */
function highlightPainScale(value) {
    const scaleLabels = document.querySelectorAll('.scale-labels span');
    scaleLabels.forEach((label, index) => {
        if (index + 1 === parseInt(value)) {
            label.style.color = '#c0392b';
            label.style.fontWeight = 'bold';
            label.style.fontSize = '14px';
        } else {
            label.style.color = '#333';
            label.style.fontWeight = 'normal';
            label.style.fontSize = '12px';
        }
    });
}

/**
 * Mark input as modified (add visual indicator)
 */
function markAsModified(input) {
    input.classList.add('modified');
    
    // Remove modified class after 2 seconds
    setTimeout(() => {
        input.classList.remove('modified');
    }, 2000);
}

/**
 * Save form data to localStorage
 */
function saveToLocalStorage() {
    const formData = {};
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.name || input.id) {
            const key = input.name || input.id;
            if (input.type === 'checkbox') {
                formData[key] = input.checked;
            } else if (input.type === 'radio') {
                if (input.checked) {
                    formData[key] = input.value;
                }
            } else {
                formData[key] = input.value;
            }
        }
    });
    
    try {
        localStorage.setItem('workerProgressReport', JSON.stringify(formData));
        console.log('Form saved to localStorage');
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

/**
 * Load form data from localStorage
 */
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('workerProgressReport');
        if (saved) {
            const formData = JSON.parse(saved);
            // Apply saved values to form
            Object.keys(formData).forEach(key => {
                const input = document.querySelector(`[name="${key}"], [id="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = formData[key];
                    } else if (input.type === 'radio') {
                        if (input.value === formData[key]) {
                            input.checked = true;
                        }
                    } else {
                        input.value = formData[key];
                    }
                }
            });
        }
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
    }
}

/**
 * Auto-save functionality
 */
function setupAutoSave() {
    // Auto-save every 30 seconds
    setInterval(() => {
        saveToLocalStorage();
    }, 30000);
    
    // Save before page unload
    window.addEventListener('beforeunload', function() {
        saveToLocalStorage();
    });
}

/**
 * Form validation
 */
function setupValidation() {
    const requiredFields = document.querySelectorAll('[data-required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

/**
 * Validate a single field
 */
function validateField(field) {
    const value = field.value.trim();
    const isValid = value.length > 0;
    
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, 'This field is required');
    } else {
        field.classList.remove('error');
        hideFieldError(field);
    }
    
    return isValid;
}

/**
 * Show error message for field
 */
function showFieldError(field, message) {
    let errorEl = field.parentElement.querySelector('.error-message');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.style.color = '#c0392b';
        errorEl.style.fontSize = '11px';
        field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

/**
 * Hide error message for field
 */
function hideFieldError(field) {
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) {
        errorEl.remove();
    }
}

/**
 * Submit form data
 */
function submitForm() {
    // Validate all required fields
    const requiredFields = document.querySelectorAll('[data-required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Collect all form data
        const formData = collectFormData();
        
        // Log to console (in real app, send to server)
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Form submitted successfully! (Check console for data)');
        
        // Clear localStorage after successful submission
        localStorage.removeItem('workerProgressReport');
    } else {
        alert('Please fill in all required fields.');
    }
}

/**
 * Collect all form data into an object
 */
function collectFormData() {
    const data = {
        claimNumber: '20042047',
        workerAppId: '712041',
        submittedDate: new Date().toISOString(),
        sections: {}
    };
    
    // Return to work section
    const returnStatus = document.querySelector('input[name="return_status"]:checked');
    data.sections.returnToWork = {
        status: returnStatus ? returnStatus.value : null,
        returnDate: document.querySelector('input[type="date"]')?.value,
        workStatus: document.querySelector('input[name="work_status"]:checked')?.value,
        progress: document.querySelector('.full-input')?.value,
        concerns: document.querySelector('textarea')?.value
    };
    
    // Recovery section
    const recoveryStatus = document.querySelector('input[name="recovery_status"]:checked');
    data.sections.recovery = {
        status: recoveryStatus ? recoveryStatus.value : null,
        painScale: document.querySelector('input[name="pain_scale"]:checked')?.value,
        medicalTreatment: document.querySelector('input[name="medical_treatment"]:checked')?.value,
        medication: document.querySelector('input[name="medication"]:checked')?.value
    };
    
    // Other info
    const otherTextarea = document.querySelectorAll('textarea');
    if (otherTextarea.length > 1) {
        data.sections.otherInfo = otherTextarea[otherTextarea.length - 1].value;
    }
    
    return data;
}

/**
 * Update page information in footer
 */
function updatePageInfo() {
    const footerPages = document.querySelectorAll('.footer-right span');
    footerPages.forEach(span => {
        if (span.textContent.includes('Page')) {
            span.textContent = 'Page 1 of 3';
        }
    });
}

/**
 * Print form functionality
 */
function printForm() {
    window.print();
}

/**
 * Export form data as JSON
 */
function exportFormData() {
    const data = collectFormData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'worker-progress-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Expose functions to global scope for console access
window.printForm = printForm;
window.exportFormData = exportFormData;
window.saveForm = saveToLocalStorage;
window.loadForm = loadFromLocalStorage;

