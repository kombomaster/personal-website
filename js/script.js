// Temel JS: İletişim formu gönderimini engelle ve uyarı göster

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  // Form durum mesajlarını göstermek için bir alan oluşturalım
  const formContainer = form.parentElement;
  let formStatus = formContainer.querySelector('.form-status');
  if (!formStatus) {
    formStatus = document.createElement('p');
    formStatus.className = 'form-status';
    form.parentNode.insertBefore(formStatus, form.nextSibling);
  }
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const action = form.getAttribute('action');

    formStatus.textContent = 'Gönderiliyor...';
    formStatus.style.color = '#E5E7EB';
    formStatus.style.display = 'block';
    
    fetch(action, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        form.style.display = 'none'; // Formu gizle
        
        let thankYouMessage = formContainer.querySelector('.thank-you-message');
        if(!thankYouMessage){
          thankYouMessage = document.createElement('div');
          thankYouMessage.className = 'thank-you-message';
          form.parentNode.insertBefore(thankYouMessage, formStatus);
        }
        thankYouMessage.innerHTML = '<h3>Teşekkürler!</h3><p>Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağım.</p>';
        thankYouMessage.style.display = 'block';

        formStatus.style.display = 'none';
      } else {
        return response.json().then(data => {
          throw new Error(data.error || 'Bir şeyler ters gitti.');
        });
      }
    }).catch(error => {
      formStatus.textContent = `Oops! Bir hata oluştu: ${error.message}`;
      formStatus.style.color = '#F87171';
    });
  });
});

// Header nav linklerine 3D tilt ve büyüme efekti
const navLinks = document.querySelectorAll('header nav a');
navLinks.forEach(link => {
  link.addEventListener('mousemove', (e) => {
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * 18; // X ekseninde 3D açı
    const ry = ((x / rect.width) - 0.5) * -18; // Y ekseninde 3D açı
    link.style.setProperty('--rx', `${rx}deg`);
    link.style.setProperty('--ry', `${ry}deg`);
    link.classList.add('animated-tilt');
  });
  link.addEventListener('mouseleave', () => {
    link.style.setProperty('--rx', '0deg');
    link.style.setProperty('--ry', '0deg');
    link.classList.remove('animated-tilt');
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // viewport'u gözlemle
        rootMargin: '0px',
        threshold: 0.1 // elementin %10'u görününce tetiklen
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animasyon bir kere çalışsın
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        observer.observe(el);
    });
});

// Hero başlığı harf harf animasyon
window.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    const text = heroTitle.textContent;
    heroTitle.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i] === ' ' ? ' ' : text[i];
        const span = document.createElement('span');
        span.className = 'char';
        span.innerHTML = char;
        span.style.transitionDelay = `${i * 0.05}s`;
        heroTitle.appendChild(span);
    }
    setTimeout(() => {
        const chars = document.querySelectorAll('.hero-title .char');
        chars.forEach(char => {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0) scale(1)';
        });
    }, 200);
});

// =================================================================================
// =================== YENİ EKLENEN ÜRÜN KARTLARI BÖLÜMÜ ===================
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {
            id: 1,
            name: 'XXXXXX',
            description: 'XXXXXXXXXX',
        },
        {
            id: 2,
            name: 'XXXXXX',
            description: 'XXXXXXXXXX',
        },
        {
            id: 3,
            name: 'XXXXXX',
            description: 'XXXXXXXXXX',
        }
    ];

    const productListContainer = document.getElementById('product-list');
    if (!productListContainer) return;

    const renderProducts = () => {
        productListContainer.innerHTML = products.map(product => `
            <div class="proje-karti product-card">
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.name}</h3>
                    <p class="product-card__description">${product.description}</p>
                </div>
            </div>
        `).join('');
    };

    renderProducts();

    // Artık etkileşimli öğe olmadığından event listener'a gerek yok.
    // productListContainer.addEventListener('click', (e) => { ... });
}); 