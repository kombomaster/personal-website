// =================================================================================
// =================== LOADING SPINNER ===================
// =================================================================================

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 500);
  }
});

// =================================================================================
// =================== FLOATING PARTICLES ===================
// =================================================================================

function createParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';

  // Random properties
  const size = Math.random() * 100 + 50;
  const left = Math.random() * 100;
  const duration = Math.random() * 20 + 15;
  const delay = Math.random() * 10;

  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${left}%`;
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${delay}s`;

  container.appendChild(particle);
}

document.addEventListener('DOMContentLoaded', createParticles);

// =================================================================================
// =================== GITHUB API INTEGRATION ===================
// =================================================================================

const GITHUB_USERNAME = 'kombomaster';

async function fetchGitHubStats() {
  try {
    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    const userData = await userResponse.json();

    // Fetch repos to calculate total stars
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
    const reposData = await reposResponse.json();

    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    // Animate the counters
    animateCounter('repo-count', userData.public_repos);
    animateCounter('star-count', totalStars);
    animateCounter('follower-count', userData.followers);
    animateCounter('following-count', userData.following);

    // Render repos
    renderGitHubRepos(reposData);
  } catch (error) {
    console.error('GitHub API error:', error);
  }
}

function animateCounter(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

function renderGitHubRepos(repos) {
  const container = document.getElementById('github-repos');
  if (!container) return;

  // Sort by stars and get top 6
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  container.innerHTML = topRepos.map(repo => `
        <a href="${repo.html_url}" target="_blank" class="repo-card">
            <h4 class="repo-card__name">
                <i class="fas fa-book"></i>
                ${repo.name}
            </h4>
            <p class="repo-card__description">${repo.description || 'No description available'}</p>
            <div class="repo-card__meta">
                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                ${repo.language ? `<span><i class="fas fa-circle"></i> ${repo.language}</span>` : ''}
            </div>
        </a>
    `).join('');
}

// Fetch GitHub stats when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Delay to let animations play
  setTimeout(fetchGitHubStats, 1000);
});

// =================================================================================
// =================== CONTACT FORM ===================
// =================================================================================

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const formContainer = form.parentElement;
  let formStatus = formContainer.querySelector('.form-status');
  if (!formStatus) {
    formStatus = document.createElement('p');
    formStatus.className = 'form-status';
    form.parentNode.insertBefore(formStatus, form.nextSibling);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const action = form.getAttribute('action');

    formStatus.textContent = 'Sending...';
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
        form.style.display = 'none';

        let thankYouMessage = formContainer.querySelector('.thank-you-message');
        if (!thankYouMessage) {
          thankYouMessage = document.createElement('div');
          thankYouMessage.className = 'thank-you-message';
          form.parentNode.insertBefore(thankYouMessage, formStatus);
        }
        thankYouMessage.innerHTML = '<h3>Thank You!</h3><p>Your message has been sent successfully. I will get back to you soon.</p>';
        thankYouMessage.style.display = 'block';

        formStatus.style.display = 'none';
      } else {
        return response.json().then(data => {
          throw new Error(data.error || 'Something went wrong.');
        });
      }
    }).catch(error => {
      formStatus.textContent = `Oops! An error occurred: ${error.message}`;
      formStatus.style.color = '#F87171';
    });
  });
});

// =================================================================================
// =================== NAV LINK 3D TILT EFFECT ===================
// =================================================================================

const navLinks = document.querySelectorAll('header nav a');
navLinks.forEach(link => {
  link.addEventListener('mousemove', (e) => {
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * 18;
    const ry = ((x / rect.width) - 0.5) * -18;
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

// =================================================================================
// =================== FADE-IN ANIMATION ===================
// =================================================================================

document.addEventListener("DOMContentLoaded", () => {
  const fadeInElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeInElements.forEach(el => {
    observer.observe(el);
  });
});

// =================================================================================
// =================== HERO TITLE ANIMATION ===================
// =================================================================================

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
// =================== PROJECT CARDS ===================
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
  const products = [
    {
      id: 1,
      name: 'Project 1',
      description: 'Description coming soon',
    },
    {
      id: 2,
      name: 'Project 2',
      description: 'Description coming soon',
    },
    {
      id: 3,
      name: 'Project 3',
      description: 'Description coming soon',
    }
  ];

  const productListContainer = document.getElementById('product-list');
  if (!productListContainer) return;

  const renderProducts = () => {
    productListContainer.innerHTML = products.map(product => `
            <a href="project.html?id=${product.id}" class="proje-karti product-card" style="text-decoration: none; color: inherit;">
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.name}</h3>
                    <p class="product-card__description">${product.description}</p>
                    <span class="product-card__link">View Details →</span>
                </div>
            </a>
        `).join('');
  };

  renderProducts();
});