let tenureUnit = 'years';
let currentCurrency = { symbol: '$', code: 'USD', name: 'US Dollar', locale: 'en-US' };

const currencies = [
    { symbol: '$',   code: 'USD', name: 'US Dollar',          locale: 'en-US'  },
    { symbol: '$',   code: 'CAD', name: 'Canadian Dollar',     locale: 'en-CA'  },
    { symbol: '$',   code: 'AUD', name: 'Australian Dollar',   locale: 'en-AU'  },
    { symbol: '£',   code: 'GBP', name: 'British Pound',       locale: 'en-GB'  },
    { symbol: '€',   code: 'EUR', name: 'Euro',                locale: 'de-DE'  },
    { symbol: '₹',   code: 'INR', name: 'Indian Rupee',        locale: 'en-IN'  },
    { symbol: '¥',   code: 'JPY', name: 'Japanese Yen',        locale: 'ja-JP'  },
    { symbol: '¥',   code: 'CNY', name: 'Chinese Yuan',        locale: 'zh-CN'  },
    { symbol: '₩',   code: 'KRW', name: 'South Korean Won',    locale: 'ko-KR'  },
    { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham',          locale: 'ar-AE'  },
    { symbol: '﷼',   code: 'SAR', name: 'Saudi Riyal',         locale: 'ar-SA'  },
    { symbol: '₺',   code: 'TRY', name: 'Turkish Lira',        locale: 'tr-TR'  },
    { symbol: 'R',   code: 'ZAR', name: 'South African Rand',  locale: 'en-ZA'  },
    { symbol: '₦',   code: 'NGN', name: 'Nigerian Naira',      locale: 'en-NG'  },
    { symbol: 'R$',  code: 'BRL', name: 'Brazilian Real',      locale: 'pt-BR'  },
    { symbol: '$',   code: 'MXN', name: 'Mexican Peso',        locale: 'es-MX'  },
    { symbol: '৳',   code: 'BDT', name: 'Bangladeshi Taka',    locale: 'bn-BD'  },
    { symbol: '₨',   code: 'PKR', name: 'Pakistani Rupee',     locale: 'en-PK'  },
    { symbol: '₨',   code: 'LKR', name: 'Sri Lankan Rupee',    locale: 'si-LK'  },
    { symbol: 'RM',  code: 'MYR', name: 'Malaysian Ringgit',   locale: 'ms-MY'  },
    { symbol: 'S$',  code: 'SGD', name: 'Singapore Dollar',    locale: 'en-SG'  },
    { symbol: '฿',   code: 'THB', name: 'Thai Baht',           locale: 'th-TH'  },
    { symbol: '₫',   code: 'VND', name: 'Vietnamese Dong',     locale: 'vi-VN'  },
    { symbol: 'Rp',  code: 'IDR', name: 'Indonesian Rupiah',   locale: 'id-ID'  },
    { symbol: '₱',   code: 'PHP', name: 'Philippine Peso',     locale: 'fil-PH' },
    { symbol: 'CHF', code: 'CHF', name: 'Swiss Franc',         locale: 'de-CH'  },
    { symbol: 'kr',  code: 'SEK', name: 'Swedish Krona',       locale: 'sv-SE'  },
    { symbol: 'kr',  code: 'NOK', name: 'Norwegian Krone',     locale: 'nb-NO'  },
    { symbol: 'kr',  code: 'DKK', name: 'Danish Krone',        locale: 'da-DK'  },
    { symbol: 'zł',  code: 'PLN', name: 'Polish Zloty',        locale: 'pl-PL'  },
];

const presets = {
    home:     { amount: 300000, rate: 7.0,  tenure: 20 },
    car:      { amount: 25000,  rate: 9.0,  tenure: 5  },
    personal: { amount: 10000,  rate: 14.0, tenure: 3  },
    custom:   { amount: 100000, rate: 7.0,  tenure: 10 }
};

function autoDetectCurrency() {
    const locale = navigator.language || 'en-US';
    const found = currencies.find(c => c.locale === locale);
    if (found) {
        currentCurrency = found;
        document.getElementById('currency-select').value = found.code;
    }
}

function setCurrency() {
    const code = document.getElementById('currency-select').value;
    currentCurrency = currencies.find(c => c.code === code) || currencies[0];
    updateSliderLabels();
    updateAmount();
    calculate();
}

function updateSliderLabels() {
    const sym = currentCurrency.symbol;
    document.getElementById('slider-label-min').textContent = sym + '1K';
    document.getElementById('slider-label-max').textContent = sym + '2M';
    document.getElementById('amount-prefix').textContent = sym;
    document.getElementById('amount-display').textContent = formatCurrency(
        parseFloat(document.getElementById('amount-input').value) || 0
    );
}

function setPreset(type) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const p = presets[type];
    document.getElementById('amount-slider').value = p.amount;
    document.getElementById('amount-input').value  = p.amount;
    document.getElementById('rate-slider').value   = p.rate;
    document.getElementById('rate-input').value    = p.rate;
    document.getElementById('tenure-slider').value = p.tenure;
    updateAmount(); updateRate(); updateTenure();
    calculate();
}

function updateAmount() {
    const val = parseFloat(document.getElementById('amount-slider').value);
    document.getElementById('amount-input').value = val;
    document.getElementById('amount-display').textContent = formatCurrency(val);
    calculate();
}

function updateRate() {
    const val = parseFloat(document.getElementById('rate-slider').value);
    document.getElementById('rate-input').value = val;
    document.getElementById('rate-display').textContent = val.toFixed(1) + '%';
    calculate();
}

function updateTenure() {
    const val = parseInt(document.getElementById('tenure-slider').value);
    document.getElementById('tenure-display').textContent = tenureUnit === 'years' ? val + ' Years' : val + ' Months';
    calculate();
}

function syncFromInput(type) {
    if (type === 'amount') {
        const val = parseFloat(document.getElementById('amount-input').value) || 0;
        document.getElementById('amount-slider').value = Math.min(val, 2000000);
        document.getElementById('amount-display').textContent = formatCurrency(val);
    } else if (type === 'rate') {
        const val = parseFloat(document.getElementById('rate-input').value) || 0;
        document.getElementById('rate-slider').value = Math.min(val, 30);
        document.getElementById('rate-display').textContent = val.toFixed(1) + '%';
    }
    calculate();
}

function setTenureUnit(unit) {
    tenureUnit = unit;
    document.getElementById('btn-years').classList.toggle('active', unit === 'years');
    document.getElementById('btn-months').classList.toggle('active', unit === 'months');

    const slider = document.getElementById('tenure-slider');
    if (unit === 'months') {
        slider.max = 360;
        slider.step = 1;
        if (parseInt(slider.value) <= 30) slider.value = parseInt(slider.value) * 12;
    } else {
        slider.max = 30;
        slider.step = 1;
        if (parseInt(slider.value) > 30) slider.value = Math.round(parseInt(slider.value) / 12);
    }
    updateTenure();
}

function calculate() {
    const principal = parseFloat(document.getElementById('amount-input').value) || 0;
    const annualRate = parseFloat(document.getElementById('rate-input').value) || 0;
    const tenureVal = parseInt(document.getElementById('tenure-slider').value) || 0;

    if (!principal || !annualRate || !tenureVal) return;

    const months = tenureUnit === 'years' ? tenureVal * 12 : tenureVal;
    const monthlyRate = annualRate / 100 / 12;

    let emi;
    if (monthlyRate === 0) {
        emi = principal / months;
    } else {
        emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    const interestPct = (totalInterest / totalPayment) * 100;
    const principalPct = 100 - interestPct;

    displayResults(emi, principal, totalInterest, totalPayment, months, principalPct, interestPct);
    buildAmortization(principal, monthlyRate, months, emi);
    document.getElementById('amortization-section').style.display = 'block';
}

function displayResults(emi, principal, totalInterest, totalPayment, months, principalPct, interestPct) {
    const card = document.getElementById('results-card');
    const circumference = 2 * Math.PI * 54;
    const interestDash = (interestPct / 100) * circumference;
    const principalDash = circumference - interestDash;

    card.innerHTML = `
        <div style="animation: fadeIn 0.5s ease">
            <div class="emi-hero">
                <div class="emi-label">Monthly EMI Payment</div>
                <div class="emi-value">${formatCurrency(emi)}</div>
                <div class="emi-sub">for ${months} months</div>
            </div>

            <div class="summary-grid">
                <div class="summary-box">
                    <div class="summary-box-label">Principal</div>
                    <div class="summary-box-value">${formatCurrency(principal)}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-box-label">Total Interest</div>
                    <div class="summary-box-value" style="color:#f5576c">${formatCurrency(totalInterest)}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-box-label">Total Payment</div>
                    <div class="summary-box-value">${formatCurrency(totalPayment)}</div>
                </div>
            </div>

            <div class="chart-section">
                <div class="donut-wrapper">
                    <svg width="140" height="140" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#f0f0f0" stroke-width="12"/>
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#667eea" stroke-width="12"
                            stroke-dasharray="${principalDash} ${interestDash}"
                            stroke-dashoffset="0"/>
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#f5576c" stroke-width="12"
                            stroke-dasharray="${interestDash} ${principalDash}"
                            stroke-dashoffset="${-principalDash}"/>
                    </svg>
                    <div class="donut-center">
                        <div class="donut-center-pct">${principalPct.toFixed(0)}%</div>
                        <div class="donut-center-label">Principal</div>
                    </div>
                </div>
                <div class="chart-legend">
                    <div class="legend-item">
                        <div class="legend-dot" style="background:#667eea"></div>
                        <div>
                            <strong>${formatCurrency(principal)}</strong>
                            <span>Principal (${principalPct.toFixed(1)}%)</span>
                        </div>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot" style="background:#f5576c"></div>
                        <div>
                            <strong>${formatCurrency(totalInterest)}</strong>
                            <span>Interest (${interestPct.toFixed(1)}%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function buildAmortization(principal, monthlyRate, months, emi) {
    const tbody = document.getElementById('amort-body');
    tbody.innerHTML = '';
    let balance = principal;

    for (let i = 1; i <= months; i++) {
        const interest = balance * monthlyRate;
        const principalPart = emi - interest;
        balance -= principalPart;
        if (balance < 0) balance = 0;

        const date = new Date();
        date.setMonth(date.getMonth() + i);
        const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i}</td>
            <td>${monthLabel}</td>
            <td>${formatCurrency(emi)}</td>
            <td>${formatCurrency(principalPart)}</td>
            <td>${formatCurrency(interest)}</td>
            <td>${formatCurrency(Math.max(balance, 0))}</td>
        `;
        tbody.appendChild(tr);
    }
}

function toggleTable() {
    const wrapper = document.getElementById('table-wrapper');
    const btn = document.getElementById('toggle-btn');
    const visible = wrapper.style.display !== 'none';
    wrapper.style.display = visible ? 'none' : 'block';
    btn.textContent = visible ? 'Show Full Schedule ▼' : 'Hide Schedule ▲';
}

function formatCurrency(n) {
    const sym = currentCurrency.symbol;
    const rounded = Math.round(n);
    try {
        return sym + rounded.toLocaleString(currentCurrency.locale);
    } catch(e) {
        return sym + rounded.toLocaleString('en-US');
    }
}

// Initialize
window.addEventListener('load', () => {
    autoDetectCurrency();
    updateSliderLabels();
    setPreset('home');
});
