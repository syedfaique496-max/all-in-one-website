// ===== ALL IN ONE - Main Script =====

// Categories Data (extracted from Scribd navigation)
const categoriesData = {
  academic: [
    { name: "Foreign Language Studies", icon: "🌍", color: "icon-purple", subs: ["Chinese", "ESL", "French", "German", "Italian", "Japanese", "Spanish"] },
    { name: "Science & Mathematics", icon: "🔬", color: "icon-green", subs: ["Astronomy & Space Sciences", "Biology", "Chemistry", "Earth Sciences", "Mathematics", "Physics", "Environmental Science", "Ecology", "Geology", "Statistics"] },
    { name: "Study Aids & Test Prep", icon: "📝", color: "icon-blue", subs: ["Book Notes", "College Entrance Exams", "Professional Certifications", "SAT & GRE", "Study Guides", "Flashcards"] },
    { name: "Teaching Methods & Materials", icon: "🎓", color: "icon-pink", subs: ["Early Childhood Education", "Education Philosophy & Theory", "Curriculum Development", "Classroom Management"] },
    { name: "Language Arts & Discipline", icon: "✍️", color: "icon-purple", subs: ["Composition & Creative Writing", "Linguistics", "Rhetoric", "Grammar", "Phonetics", "Semantics"] },
  ],
  professional: [
    { name: "Business", icon: "💼", color: "icon-purple", subs: ["Business Analytics", "Human Resources & Personnel Management", "Management", "Marketing", "Operations", "Organizational Behavior", "Project Management", "Sales", "Small Business & Entrepreneurship", "Strategic Management"] },
    { name: "Career & Growth", icon: "📈", color: "icon-green", subs: ["Careers", "Job Hunting", "Resume Writing", "Professional Development", "Leadership", "Networking"] },
    { name: "Computers", icon: "💻", color: "icon-blue", subs: ["Applications & Software", "CAD-CAM", "Databases", "Hardware", "Information Technology", "Internet & Web", "Networking", "Operating Systems", "Programming", "Security"] },
    { name: "Finance & Money Management", icon: "🏦", color: "icon-pink", subs: ["Accounting & Bookkeeping", "Auditing", "Banking", "Corporate Finance", "Financial Modeling", "Investments", "Personal Finance", "Taxation"] },
    { name: "Law", icon: "⚖️", color: "icon-purple", subs: ["Business & Financial", "Constitutional Law", "Contracts & Agreements", "Criminal Law", "Intellectual Property", "International Law", "Jurisprudence"] },
    { name: "Politics", icon: "🏛️", color: "icon-green", subs: ["American Government", "Comparative Politics", "Elections & Voting", "International Relations", "Political Economy", "Political Science", "Public Policy"] },
    { name: "Technology & Engineering", icon: "⚙️", color: "icon-blue", subs: ["Automotive", "Aviation & Aeronautics", "Biotechnology", "Chemical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics", "Environmental Engineering", "Industrial Engineering", "Mechanical", "Software Engineering", "Telecommunications"] },
  ],
  culture: [
    { name: "Art", icon: "🎨", color: "icon-pink", subs: ["Antiques & Collectibles", "Architecture", "Art History", "Design", "Film & Photography", "Graphic Arts", "Music", "Performing Arts"] },
    { name: "Biography & Memoir", icon: "📖", color: "icon-purple", subs: ["Artists and Musicians", "Entertainers and the Rich & Famous", "Historical Figures", "Leaders & Activists", "Scientists"] },
    { name: "Comics & Graphic Novels", icon: "💬", color: "icon-green", subs: ["Fantasy", "Horror", "Humor", "Independent", "Manga", "Mystery", "Romance", "Sci-Fi", "Superhero", "Western"] },
    { name: "History", icon: "🏺", color: "icon-blue", subs: ["Ancient", "Medieval", "Modern"] },
    { name: "Philosophy", icon: "🧠", color: "icon-pink", subs: ["Eastern Philosophy", "Ethics", "Logic", "Metaphysics", "Philosophy of Mind", "Political Philosophy"] },
    { name: "Literary Criticism", icon: "📚", color: "icon-purple", subs: ["Comparative Literature", "Drama", "Novel Studies", "Poetry Analysis"] },
    { name: "Social Science", icon: "🌐", color: "icon-green", subs: ["Anthropology", "Archaeology", "Communication Studies", "Cultural Studies", "Economics", "Human Geography", "Linguistics", "Political Economy", "Psychology", "Sociology", "Urban Studies"] },
    { name: "True Crime", icon: "🔍", color: "icon-blue", subs: ["Cold Cases", "Criminal Profiles", "Forensics", "Investigations"] },
  ],
  hobbies: [
    { name: "Cooking, Food & Wine", icon: "🍳", color: "icon-pink", subs: ["Beverages", "Courses & Dishes"] },
    { name: "Games & Activities", icon: "🎮", color: "icon-purple", subs: ["Card Games", "Fantasy Sports", "Video Games"] },
    { name: "Home & Garden", icon: "🏡", color: "icon-green", subs: ["Crafts & Hobbies", "DIY Projects", "Gardening"] },
    { name: "Sports & Recreation", icon: "⚽", color: "icon-blue", subs: ["Baseball", "Basketball", "Combat Sports", "Cricket", "Cycling", "Football", "Golf", "Hockey", "Motor Sports", "Soccer", "Tennis"] },
  ],
  personal: [
    { name: "Lifestyle", icon: "✨", color: "icon-pink", subs: ["Beauty & Grooming", "Fashion", "Travel", "Relationships"] },
    { name: "Religion & Spirituality", icon: "🙏", color: "icon-purple", subs: ["Buddhism", "Christianity", "Hinduism", "Islam", "Judaism", "New Age & Spirituality"] },
    { name: "Self-Improvement", icon: "🚀", color: "icon-green", subs: ["Addiction & Recovery", "Mental Health", "Motivational"] },
    { name: "Wellness", icon: "💚", color: "icon-blue", subs: ["Body, Mind & Spirit", "Diet & Nutrition", "Exercise & Fitness", "Holistic Health", "Relationships & Sexuality", "Sleep & Stress"] },
  ],
};


// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCategories();
  initFAQ();
  initModals();
  initRevealAnimations();
  initParticles();
  animateCounters();
});

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
  // Mobile toggle
  const toggle = document.querySelector('.mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const links = document.querySelector('.nav-links');
      links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '100%';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(10,10,15,0.98)';
      links.style.padding = '20px';
      links.style.borderBottom = '1px solid var(--border)';
    });
  }
}

// ===== CATEGORIES =====
function initCategories() {
  const grid = document.getElementById('categoriesGrid');
  const tabs = document.querySelectorAll('.tab-btn');

  function renderCards(category) {
    const data = categoriesData[category] || categoriesData.academic;
    grid.innerHTML = '';
    data.forEach((cat, i) => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.style.animationDelay = `${i * 0.08}s`;
      card.style.animation = 'fadeUp 0.6s ease forwards';
      card.style.opacity = '0';
      card.innerHTML = `
        <div class="card-icon ${cat.color}">${cat.icon}</div>
        <h3>${cat.name}</h3>
        <p>${cat.subs.length} subcategories</p>
        <div class="card-tags">
          ${cat.subs.slice(0, 3).map(s => `<span>${s}</span>`).join('')}
          ${cat.subs.length > 3 ? `<span>+${cat.subs.length - 3} more</span>` : ''}
        </div>
      `;
      card.addEventListener('click', () => showCategoryModal(cat));
      grid.appendChild(card);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCards(tab.dataset.category);
    });
  });

  renderCards('academic');
}

function showCategoryModal(cat) {
  const overlay = document.getElementById('categoryModal');
  overlay.querySelector('.modal h2').textContent = cat.name;
  overlay.querySelector('.modal p').textContent = `Explore ${cat.subs.length} subcategories in ${cat.name}`;
  const list = overlay.querySelector('.cat-modal-list');
  list.innerHTML = cat.subs.map(s => `
    <a href="#" class="cat-modal-item">
      <span>${s}</span>
      <span class="arrow-right">→</span>
    </a>
  `).join('');
  overlay.classList.add('active');
}

// ===== FAQ =====
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });
}

// ===== MODALS =====
function initModals() {
  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.closest('.modal-overlay').classList.remove('active');
    });
  });
  // Open modal buttons - use event delegation on body for reliability
  document.body.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      // Close all modals first
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
      }
    }
  });
}

// ===== REVEAL ANIMATIONS =====
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== FLOATING PARTICLES =====
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 92, 252, ${p.opacity})`;
      ctx.fill();
    });
    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124, 92, 252, ${0.05 * (1 - dist / 150)})`;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current) + suffix;
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ===== SEARCH =====
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.nav-search input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.category-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
});
