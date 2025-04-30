// Banka bilgileri
const bankInfo = {
    accountOwner: "ALİ YİĞİT ÖMÜR",
    iban: "TR68 0082 9000 0949 1013 9746 54"
};

// Banka bilgilerini güncelle
function updateBankInfo() {
    document.getElementById('account-owner').textContent = bankInfo.accountOwner;
    document.getElementById('iban').textContent = bankInfo.iban;
}

// Mobile Menu Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

if (burger) {
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Abonelik işlemleri
document.addEventListener('DOMContentLoaded', function() {
    const subscribeButtons = document.querySelectorAll('.subscribe-button');
    const paymentForm = document.getElementById('payment-form');
    const planInfo = document.querySelector('.plan-info');
    const paymentButton = document.getElementById('payment-button');
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
    const creditCardForm = document.getElementById('credit-card-form');
    const bankTransferForm = document.getElementById('bank-transfer-form');

    // Banka bilgilerini güncelle
    updateBankInfo();

    // Abone ol butonlarına tıklama olayı
    subscribeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            const planName = this.closest('.plan-card').querySelector('h2').textContent;
            const planPrice = this.closest('.plan-card').querySelector('.amount').textContent;
            
            // Plan bilgilerini göster
            planInfo.innerHTML = `
                <h3>Seçilen Plan: ${planName}</h3>
                <p>Fiyat: ${planPrice}/ay</p>
            `;
            
            // Ödeme formunu göster
            paymentForm.style.display = 'block';
            
            // Sayfayı ödeme formuna kaydır
            paymentForm.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Ödeme yöntemi değiştiğinde
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'credit-card') {
                creditCardForm.style.display = 'block';
                bankTransferForm.style.display = 'none';
            } else {
                creditCardForm.style.display = 'none';
                bankTransferForm.style.display = 'block';
            }
        });
    });

    // Kart numarası formatlaması
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            e.target.value = formattedValue;
        });
    }

    // Son kullanma tarihi formatlaması
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }

    // IBAN formatlaması
    const ibanInput = document.getElementById('sender-iban');
    if (ibanInput) {
        ibanInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '').toUpperCase();
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            e.target.value = formattedValue;
        });
    }

    // Ödeme butonuna tıklama
    paymentButton.addEventListener('click', function() {
        // Form doğrulama
        const form = document.getElementById('subscription-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Ödeme işlemi simülasyonu
        alert('Ödeme işlemi başarıyla tamamlandı! Premium içeriklere erişiminiz aktif edildi.');
        
        // Formu sıfırla ve gizle
        form.reset();
        paymentForm.style.display = 'none';
    });
});

// Video filtreleme işlevselliği
const categoryFilter = document.getElementById('category-filter');
const qualityFilter = document.getElementById('quality-filter');

if (categoryFilter && qualityFilter) {
    categoryFilter.addEventListener('change', filterVideos);
    qualityFilter.addEventListener('change', filterVideos);
}

function filterVideos() {
    const category = categoryFilter.value;
    const quality = qualityFilter.value;
    
    // Burada video filtreleme mantığı uygulanacak
    console.log('Filtreleme:', { category, quality });
}

// Sayfa yüklendiğinde animasyonlar
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    const pricingCards = document.querySelectorAll('.pricing-card');

    // Özellik kartları için animasyon
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Fiyatlandırma kartları için animasyon
    pricingCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Video oynatma işlemleri
document.addEventListener('DOMContentLoaded', function() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video-url');
            openVideoModal(videoUrl);
        });
    });
});

function openVideoModal(videoUrl) {
    const modal = document.getElementById('videoModal');
    const modalContent = modal.querySelector('.modal-content');
    
    // YouTube videosu için iframe oluştur
    if (videoUrl.includes('youtube.com')) {
        const videoId = videoUrl.split('/').pop().split('?')[0];
        modalContent.innerHTML = `
            <iframe width="100%" height="500" src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <button class="close-button" onclick="closeVideoModal()">
                <i class="fas fa-times"></i>
            </button>
        `;
    } else {
        // Normal video için video elementi kullan
        modalContent.innerHTML = `
            <video id="modalVideo" controls autoplay>
                <source src="${videoUrl}" type="video/mp4">
                Tarayıcınız video oynatmayı desteklemiyor.
            </video>
            <div class="video-controls">
                <div class="volume-control">
                    <i class="fas fa-volume-up"></i>
                    <input type="range" min="0" max="1" step="0.1" value="1" id="volumeControl">
                </div>
            </div>
            <button class="close-button" onclick="closeVideoModal()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Ses kontrolü
        const video = document.getElementById('modalVideo');
        const volumeControl = document.getElementById('volumeControl');
        video.play();
        
        volumeControl.addEventListener('input', function() {
            video.volume = this.value;
        });
    }
    
    modal.style.display = 'flex';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Video veya iframe'i temizle
    modalContent.innerHTML = '';
    modal.style.display = 'none';
}

// PAPARA API Entegrasyonu
const PAPARA_API_KEY = 'YOUR_PAPARA_API_KEY';
const PAPARA_API_URL = 'https://api.papara.com';

async function processPaparaPayment() {
    const paparaAccount = document.getElementById('paparaAccount').value;
    const paparaPhone = document.getElementById('paparaPhone').value;
    const selectedPlan = document.querySelector('.plan-card.selected');
    const planPrice = selectedPlan.querySelector('.price').textContent;

    try {
        // PAPARA API'ye ödeme isteği gönder
        const response = await fetch(`${PAPARA_API_URL}/mass-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': PAPARA_API_KEY
            },
            body: JSON.stringify({
                accountNumber: paparaAccount,
                phoneNumber: paparaPhone,
                amount: parseFloat(planPrice),
                description: 'Pewasftbl Abonelik Ödemesi'
            })
        });

        const result = await response.json();

        if (result.succeeded) {
            // Ödeme başarılı
            showNotification('Ödeme başarıyla tamamlandı!', 'success');
            closePaymentModal();
            // Abonelik durumunu güncelle
            updateSubscriptionStatus(true);
        } else {
            // Ödeme başarısız
            showNotification('Ödeme işlemi başarısız: ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('Ödeme işlemi sırasında bir hata oluştu', 'error');
        console.error('PAPARA API Error:', error);
    }
}

function updateSubscriptionStatus(isActive) {
    const subscriptionStatus = document.querySelector('.subscription-status');
    if (isActive) {
        subscriptionStatus.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Aktif Abonelik</span>
        `;
        subscriptionStatus.classList.add('active');
    } else {
        subscriptionStatus.innerHTML = `
            <i class="fas fa-times-circle"></i>
            <span>Aktif Abonelik Yok</span>
        `;
        subscriptionStatus.classList.remove('active');
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = !!localStorage.getItem('username');
    const profileLink = document.getElementById('profileLink');
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    if (profileLink) profileLink.style.display = isLoggedIn ? '' : 'none';
    if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : '';
    if (registerBtn) registerBtn.style.display = isLoggedIn ? 'none' : '';
});

// Kayıt olma örneği (varsa):
// fetch('https://pewasftbl.onrender.com/api/register', {...})
// Giriş yapma örneği (varsa):
// fetch('https://pewasftbl.onrender.com/api/login', {...})
// Profil çekme örneği (varsa):
// fetch(`https://pewasftbl.onrender.com/api/kullanici/${username}`)
