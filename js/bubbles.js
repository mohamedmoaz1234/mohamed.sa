// ============================================
// Bubble Animation Effect
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const bubbleContainer = document.getElementById('bubbleContainer');
    
    if (!bubbleContainer) return;
    
    // إعدادات الفقاعات
    const bubbleConfig = {
        count: 30,              // عدد الفقاعات
        minSize: 10,            // أصغر حجم
        maxSize: 80,            // أكبر حجم
        minDuration: 10,        // أقصر مدة للحركة (ثانية)
        maxDuration: 20,        // أطول مدة للحركة (ثانية)
        colors: [
            'rgba(0, 168, 232, 0.1)',
            'rgba(0, 217, 255, 0.15)',
            'rgba(127, 219, 255, 0.1)',
            'rgba(255, 255, 255, 0.1)',
        ]
    };
    
    // دالة لإنشاء رقم عشوائي بين min و max
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    // دالة لإنشاء فقاعة واحدة
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // حجم عشوائي
        const size = random(bubbleConfig.minSize, bubbleConfig.maxSize);
        
        // موضع أفقي عشوائي
        const left = random(0, 100);
        
        // مدة الحركة عشوائية
        const duration = random(bubbleConfig.minDuration, bubbleConfig.maxDuration);
        
        // تأخير عشوائي
        const delay = random(0, 5);
        
        // لون عشوائي من المجموعة
        const color = bubbleConfig.colors[Math.floor(Math.random() * bubbleConfig.colors.length)];
        
        // تطبيق الأنماط
        bubble.style.cssText = `
            position: absolute;
            bottom: -${size}px;
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            animation: bubbleFloat ${duration}s ease-in ${delay}s infinite;
            box-shadow: inset 0 0 ${size/4}px rgba(255, 255, 255, 0.3);
        `;
        
        return bubble;
    }
    
    // إنشاء جميع الفقاعات
    function initBubbles() {
        for (let i = 0; i < bubbleConfig.count; i++) {
            const bubble = createBubble();
            bubbleContainer.appendChild(bubble);
        }
    }
    
    // إضافة Animation CSS ديناميكياً
    const style = document.createElement('style');
    style.textContent = `
        .bubble-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        }
        
        @keyframes bubbleFloat {
            0% {
                transform: translateY(0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) scale(0.5);
                opacity: 0;
            }
        }
        
        .bubble {
            backdrop-filter: blur(2px);
        }
    `;
    document.head.appendChild(style);
    
    // بدء تشغيل الفقاعات
    initBubbles();
    
    // إضافة فقاعة جديدة عند النقر (تأثير تفاعلي)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.ripple-effect')) {
            createClickBubble(e.clientX, e.clientY);
        }
    });
    
    // دالة لإنشاء فقاعات عند النقر
    function createClickBubble(x, y) {
        const bubble = document.createElement('div');
        bubble.classList.add('click-bubble');
        
        const size = random(20, 60);
        
        bubble.style.cssText = `
            position: fixed;
            left: ${x - size/2}px;
            top: ${y - size/2}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(0, 168, 232, 0.3), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: clickBubbleAnim 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(bubble);
        
        setTimeout(() => {
            bubble.remove();
        }, 800);
    }
    
    // إضافة animation للفقاعات عند النقر
    const clickStyle = document.createElement('style');
    clickStyle.textContent = `
        @keyframes clickBubbleAnim {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(clickStyle);
    
    // تأثير Parallax للفقاعات عند حركة الماوس
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });
    
    function animateParallax() {
        const bubbles = bubbleContainer.querySelectorAll('.bubble');
        
        bubbles.forEach((bubble, index) => {
            const speed = (index % 3 + 1) * 0.5;
            const x = mouseX * speed * 20;
            const y = mouseY * speed * 20;
            
            bubble.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        requestAnimationFrame(animateParallax);
    }
    
    animateParallax();
});

// ============================================
// Droplet Effect on Hover
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            createDroplets(this);
        });
    });
    
    function createDroplets(element) {
        for (let i = 0; i < 5; i++) {
            const droplet = document.createElement('div');
            droplet.classList.add('hover-droplet');
            
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const delay = Math.random() * 0.3;
            
            droplet.style.cssText = `
                position: absolute;
                left: ${left}%;
                bottom: 100%;
                width: ${size}px;
                height: ${size}px;
                background: rgba(0, 168, 232, 0.6);
                border-radius: 50%;
                pointer-events: none;
                animation: dropletFall 1s ease-in ${delay}s forwards;
            `;
            
            element.appendChild(droplet);
            
            setTimeout(() => {
                droplet.remove();
            }, 1300);
        }
    }
    
    // إضافة animation للقطرات
    const dropletStyle = document.createElement('style');
    dropletStyle.textContent = `
        @keyframes dropletFall {
            0% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(100px) scale(0);
                opacity: 0;
            }
        }
        
        .service-card {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(dropletStyle);
});
