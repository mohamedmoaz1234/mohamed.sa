// ============================================
// Booking System - JavaScript
// ============================================

let currentStep = 0;
let bookingType = '';
let selectedServices = [];
let selectedPackage = null;
let totalPrice = 0;
let selectedPayment = '';

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        dateInput.setAttribute('min', today);
    }

    initializeServiceCards();
    initializePackageCards();
    initializePaymentOptions();
    initializeDateTimeInputs();
    updateSummary();
    updateProgress();
});

// ============================================
// Booking Type Selection
// ============================================

function selectBookingType(type) {
    bookingType = type;
    document.getElementById('step0').classList.remove('active');

    if (type === 'services') {
        document.getElementById('step1services').classList.add('active');
        document.getElementById('summaryBookingType').textContent = 'خدمات منفصلة';
    } else {
        document.getElementById('step1packages').classList.add('active');
        document.getElementById('summaryBookingType').textContent = 'باقة شاملة';
    }

    currentStep = 1;
    updateProgress();
}

// الرجوع لاختيار نوع الحجز
function backToChoice() {
    document.getElementById('step1services').classList.remove('active');
    document.getElementById('step1packages').classList.remove('active');
    document.getElementById('step0').classList.add('active');

    currentStep = 0;
    bookingType = '';
    selectedServices = [];
    selectedPackage = null;
    totalPrice = 0;
    selectedPayment = '';

    document.querySelectorAll('.service-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelectorAll('.package-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelectorAll('.payment-option.selected').forEach(opt => {
        opt.classList.remove('selected');
    });

    updateSummary();
    updateProgress();
}

// ============================================
// Service Cards (with quantity for carpet per meter)
// ============================================

function initializeServiceCards() {
    document.querySelectorAll('.service-card').forEach(card => {
        const qtyInput = card.querySelector('.service-qty');

        // كمية السجاد بالمتر – تحديث السعر عند تغيير العدد
        if (qtyInput) {
            qtyInput.addEventListener('click', e => e.stopPropagation());
            qtyInput.addEventListener('change', function () {
                let q = parseInt(this.value, 10);
                if (!q || q < 1) {
                    q = 1;
                    this.value = 1;
                }

                if (card.classList.contains('selected')) {
                    const service = card.dataset.service;
                    const unitPrice = parseInt(card.dataset.price, 10) || 0;
                    const existing = selectedServices.find(s => s.service === service);
                    if (existing) {
                        totalPrice -= existing.price;
                        existing.quantity = q;
                        existing.price = unitPrice * q;
                        existing.name = card.querySelector('.service-title').textContent + ` (${q} متر)`;
                        totalPrice += existing.price;
                        updateSummary();
                    }
                }
            });
        }

        card.addEventListener('click', function (e) {
            // تجاهل الكليك على حقل الكمية نفسه
            if (e.target.classList.contains('service-qty')) return;

            const service = this.dataset.service;
            const unitPrice = parseInt(this.dataset.price, 10) || 0;
            const title = this.querySelector('.service-title').textContent;

            if (this.classList.contains('selected')) {
                // إلغاء التحديد
                this.classList.remove('selected');
                const existing = selectedServices.find(s => s.service === service);
                if (existing) {
                    totalPrice -= existing.price;
                }
                selectedServices = selectedServices.filter(s => s.service !== service);
            } else {
                // تحديد جديد
                this.classList.add('selected');

                let quantity = 1;
                let name = title;
                const qtyInputInside = this.querySelector('.service-qty');

                if (qtyInputInside) {
                    quantity = parseInt(qtyInputInside.value, 10);
                    if (!quantity || quantity < 1) {
                        quantity = 1;
                        qtyInputInside.value = 1;
                    }
                    name = `${title} (${quantity} متر)`;
                }

                const price = unitPrice * quantity;

                selectedServices.push({
                    service,
                    name,
                    price,
                    quantity,
                    unitPrice
                });

                totalPrice += price;
            }

            updateSummary();
        });
    });
}

// ============================================
// Package Cards
// ============================================

function initializePackageCards() {
    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');

            selectedPackage = {
                package: this.dataset.package,
                name: this.querySelector('.package-name').textContent,
                price: parseInt(this.dataset.price, 10) || 0
            };

            totalPrice = selectedPackage.price;
            selectedServices = [];
            updateSummary();
        });
    });
}

// ============================================
// Payment Options
// ============================================

function initializePaymentOptions() {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            selectedPayment = this.querySelector('.payment-title').textContent;
            updateSummary();
        });
    });
}

// ============================================
// Date & Time Inputs
// ============================================

function initializeDateTimeInputs() {
    const dateInput = document.getElementById('bookingDate');
    const timeInput = document.getElementById('bookingTime');

    if (dateInput) {
        dateInput.addEventListener('change', updateSummary);
    }
    if (timeInput) {
        timeInput.addEventListener('change', updateSummary);
    }
}

// ============================================
// Summary Update
// ============================================

function updateSummary() {
    let serviceName = '';

    if (bookingType === 'services') {
        serviceName = selectedServices.map(s => s.name).join('، ') || 'لم يتم الاختيار';
    } else if (bookingType === 'packages' && selectedPackage) {
        serviceName = selectedPackage.name;
    } else {
        serviceName = 'لم يتم الاختيار';
    }

    const dateInput = document.getElementById('bookingDate');
    const timeInput = document.getElementById('bookingTime');
    const date = dateInput && dateInput.value ? dateInput.value : 'لم يتم الاختيار';
    const time = timeInput && timeInput.value ? timeInput.value : 'لم يتم الاختيار';

    const totalFormatted = totalPrice.toLocaleString('ar-SA') + ' ريال';

    document.getElementById('summaryService').textContent = serviceName;
    document.getElementById('summaryDate').textContent = date;
    document.getElementById('summaryTime').textContent = time;
    document.getElementById('summaryPayment').textContent = selectedPayment || 'لم يتم الاختيار';
    document.getElementById('summaryTotal').textContent = totalFormatted;
}

// ============================================
// Navigation
// ============================================

function nextStep() {
    // التحقق لكل خطوة
    if (currentStep === 1) {
        if (bookingType === 'services' && selectedServices.length === 0) {
            showAlert('الرجاء اختيار خدمة واحدة على الأقل', 'warning');
            return;
        }
        if (bookingType === 'packages' && !selectedPackage) {
            showAlert('الرجاء اختيار باقة', 'warning');
            return;
        }
    }

    if (currentStep === 2) {
        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;
        if (!date || !time) {
            showAlert('الرجاء اختيار التاريخ والوقت', 'warning');
            return;
        }
    }

    if (currentStep === 3) {
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const address = document.getElementById('customerAddress').value.trim();

        if (!name || !phone || !email || !address) {
            showAlert('الرجاء إكمال جميع الحقول بشكل صحيح', 'warning');
            return;
        }

        if (!/^05\d{8}$/.test(phone)) {
            showAlert('الرجاء إدخال رقم جوال صحيح يبدأ بـ 05 ويتكون من 10 أرقام', 'warning');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showAlert('الرجاء إدخال بريد إلكتروني صحيح', 'warning');
            return;
        }
    }

    // إخفاء القسم الحالي
    if (currentStep === 1) {
        if (bookingType === 'services') {
            document.getElementById('step1services').classList.remove('active');
        } else {
            document.getElementById('step1packages').classList.remove('active');
        }
    } else if (currentStep > 1) {
        document.getElementById('step' + currentStep).classList.remove('active');
    }

    // الانتقال للخطوة التالية
    currentStep++;
    if (currentStep === 1) {
        if (bookingType === 'services') {
            document.getElementById('step1services').classList.add('active');
        } else {
            document.getElementById('step1packages').classList.add('active');
        }
    } else {
        document.getElementById('step' + currentStep).classList.add('active');
    }

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep() {
    if (currentStep === 0) return;

    if (currentStep === 1) {
        if (bookingType === 'services') {
            document.getElementById('step1services').classList.remove('active');
        } else {
            document.getElementById('step1packages').classList.remove('active');
        }
    } else {
        document.getElementById('step' + currentStep).classList.remove('active');
    }

    currentStep--;

    if (currentStep === 0) {
        document.getElementById('step0').classList.add('active');
    } else if (currentStep === 1) {
        if (bookingType === 'services') {
            document.getElementById('step1services').classList.add('active');
        } else {
            document.getElementById('step1packages').classList.add('active');
        }
    } else {
        document.getElementById('step' + currentStep).classList.add('active');
    }

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// Progress Bar
// ============================================

function updateProgress() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < currentStep) {
            step.classList.add('completed');
        } else if (index === currentStep) {
            step.classList.add('active');
        }
    });

    const progress = (currentStep / 4) * 100;
    const bar = document.getElementById('progressFill');
    if (bar) {
        bar.style.width = progress + '%';
    }
}

// ============================================
// Complete Booking
// ============================================

async function completeBooking() {
  if (!selectedPayment) { showAlert('الرجاء اختيار طريقة الدفع', 'warning'); return; }

  const bookingData = {
    bookingType,
    services: bookingType === 'services' ? selectedServices : null,
    package: bookingType === 'packages' ? selectedPackage : null,
    date: document.getElementById('bookingDate').value,
    time: document.getElementById('bookingTime').value,
    customerName: document.getElementById('customerName').value,
    customerPhone: document.getElementById('customerPhone').value,
    customerEmail: document.getElementById('customerEmail').value,
    customerAddress: document.getElementById('customerAddress').value,
    paymentMethod: selectedPayment,
    totalPrice: totalPrice,
    timestamp: new Date().toISOString()
  };

  // يبقى هذا لتغذية thank-you.html
  localStorage.setItem('latestBooking', JSON.stringify(bookingData));

  // إرسال للباك إند (لو النت ضعيف ما يوقفك)
  try {
    await fetch('http://localhost:4000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
  } catch (e) {
    console.log('Booking API error (ignored until internet ready):', e);
  }

  window.location.href = 'thank-you.html';
}


// ============================================
// Alert Helper
// ============================================

function showAlert(message, type = 'info') {
    alert(message);
}
