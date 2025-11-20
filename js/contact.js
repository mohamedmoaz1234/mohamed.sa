// ============================================
// Contact Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    const contactForm = document.getElementById('contactForm');
    
    // ============================================
    // Contact Form Submission
    // ============================================
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateContactForm()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show loading
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
            
            // Simulate sending (في الواقع، ستقوم بإرسال البيانات إلى الخادم)
            setTimeout(() => {
                console.log('Form data:', data);
                
                // Show success message
                window.showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                
                /* في الواقع، ستستخدم fetch أو axios:
                
                fetch('YOUR_API_ENDPOINT/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    window.showNotification('تم إرسال رسالتك بنجاح!', 'success');
                    contactForm.reset();
                })
                .catch(error => {
                    window.showNotification('حدث خطأ، يرجى المحاولة مرة أخرى', 'error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                });
                */
                
            }, 2000);
        });
    }
    
    function validateContactForm() {
        const requiredInputs = contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                showError(input, 'هذا الحقل مطلوب');
                isValid = false;
            } else {
                removeError(input);
                
                // Validate email
                if (input.type === 'email' && !isValidEmail(input.value)) {
                    showError(input, 'البريد الإلكتروني غير صحيح');
                    isValid = false;
                }
                
                // Validate phone
                if (input.type === 'tel' && !isValidPhone(input.value)) {
                    showError(input, 'رقم الجوال غير صحيح');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    function showError(input, message) {
        removeError(input);
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }
    
    function removeError(input) {
        input.classList.remove('error');
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        const re = /^(05|5)[0-9]{8}$/;
        return re.test(phone.replace(/\s/g, ''));
    }
    
    // ============================================
    // FAQ Accordion (reuse from packages page)
    // ============================================
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
