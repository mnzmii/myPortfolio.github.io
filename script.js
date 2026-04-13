/* ================================================================
   CYBERSECURITY PORTFOLIO — script.js
   Boot sequence, interactive terminal, matrix rain, theme toggle,
   scroll animations, nav interactions, and PGP copy.
   ================================================================ */

(function () {
  'use strict';

  // ================================================================
  // BOOT SEQUENCE
  // ================================================================
  const bootScreen = document.getElementById('boot-screen');

  function runBootSequence() {
    // Skip boot if already booted this session
    if (sessionStorage.getItem('portfolio_booted')) {
      skipBoot();
      return;
    }

    const lines = document.querySelectorAll('.boot-line');
    lines.forEach((line) => {
      const delay = parseInt(line.dataset.delay, 10) || 0;
      setTimeout(() => {
        line.classList.add('boot-line--visible');
      }, delay);
    });

    // Fade out boot screen after last line
    const totalDuration = 2700;
    setTimeout(() => {
      bootScreen.classList.add('boot-screen--done');
      document.body.classList.remove('booting');
      sessionStorage.setItem('portfolio_booted', '1');
      // Remove from DOM after transition
      setTimeout(() => {
        if (bootScreen) bootScreen.remove();
      }, 600);
    }, totalDuration);
  }

  function skipBoot() {
    if (bootScreen) bootScreen.remove();
    document.body.classList.remove('booting');
  }

  if (bootScreen) {
    runBootSequence();
  } else {
    document.body.classList.remove('booting');
  }

  // ================================================================
  // MATRIX RAIN BACKGROUND
  // ================================================================
  const canvas = document.getElementById('matrix-bg');
  let matrixColor = getComputedStyle(document.documentElement).getPropertyValue('--green').trim() || '#00ff88';

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const fontSize = 14;

    let prevWidth = 0;
    function initMatrix() {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      // Only reset drops if the screen width changes (like device rotation), 
      // preventing the animation from resetting when mobile browsers hide the URL bar on scroll.
      if (newWidth !== prevWidth) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
        columns = Math.floor(width / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * -100);
        prevWidth = newWidth;
      } else {
        // Just update height if url bar scrolled away
        height = canvas.height = newHeight;
      }
    }

    function drawMatrix() {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.06)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = matrixColor;
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    initMatrix();
    setInterval(drawMatrix, 50);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initMatrix, 200);
    });
  }

  // ================================================================
  // THEME TOGGLE (Green vs Amber CRT)
  // ================================================================
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    matrixColor = theme === 'amber' ? '#ffb000' : '#00e676';
    localStorage.setItem('portfolio_theme', theme);
    if (themeToggle) {
      themeToggle.checked = (theme === 'amber');
    }
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio_theme') || 'green';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('change', (e) => {
      const next = e.target.checked ? 'amber' : 'green';
      applyTheme(next);
    });
  }

  // ================================================================
  // INTERACTIVE TERMINAL
  // ================================================================
  const terminalHistory = document.getElementById('terminal-history');
  const terminalInput = document.getElementById('terminal-input');
  const terminalMirror = document.getElementById('terminal-mirror');
  const terminalBody = document.getElementById('terminal-body');

  if (terminalHistory && terminalInput) {
    const COMMANDS = {
      help: () => [
        '<span class="term-header">Available commands:</span>',
        '',
        '  <span class="term-cmd">whoami</span>        — Display identity',
        '  <span class="term-cmd">cat about.txt</span> — About me',
        '  <span class="term-cmd">skills</span>        — Technical capabilities',
        '  <span class="term-cmd">ls</span>            — List site pages',
        '  <span class="term-cmd">socials</span>       — Contact & social links',
        '  <span class="term-cmd">resume</span>        — Download resume',
        '  <span class="term-cmd">clear</span>         — Clear terminal',
        '  <span class="term-cmd">help</span>          — Show this message',
      ],
      whoami: () => [
        '<span class="term-name">> Muhammad Nazmi bin Mohd Saifulizam (Nazmi)</span>',
        '<span class="term-sub">> Computer Science Student | Focused on Network Security &amp; Secure Web Development</span>',
      ],
      'cat about.txt': () => [
        'I am a Computer Network & Security student at UTM Skudai, specializing in the intersection of robust infrastructure and secure web development. My focus is on building resilient applications by applying a security-first mindset to the full development lifecycle.',
        '',
        'Currently, I am deepening my expertise in Red Teaming and cryptography, actively competing in CTFs to sharpen my ability to identify and mitigate modern attack vectors.',
      ],
      skills: () => [
        '<span class="term-header">// SKILL_MATRIX</span>',
        '',
        '  <span class="term-category">[WEB]</span>    HTML5, CSS3, JavaScript, Git',
        '  <span class="term-category">[SEC]</span>    Wireshark, Nmap, Burp Suite, Vuln Scanning, CTFs',
        '  <span class="term-category">[INFRA]</span>  Linux, Bash, Cisco R&S, Docker, Ansible',
      ],
      ls: () => [
        '<span class="term-header">// SITE_MAP</span>',
        '',
        '  <a href="index.html" class="term-link">~/Home</a>           — Landing page',
        '  <a href="ctf.html" class="term-link">~/CTF_Writeups</a>  — Incident reports',
        '  <a href="projects.html" class="term-link">~/Projects</a>       — Active developments & labs',
        '  <a href="contact.html" class="term-link">~/Contact</a>        — Secure channels',
      ],
      socials: () => [
        '<span class="term-header">// CONTACT_VECTORS</span>',
        '',
        '  📧 <a href="mailto:mhdnzmi@gmail.com" class="term-link">mhdnzmi@gmail.com</a>',
        '  🔗 <a href="https://www.linkedin.com/in/mhdnazmi/" target="_blank" class="term-link">linkedin.com/in/mhdnazmi/</a>',
        '  💻 <a href="https://github.com/mnzmii" target="_blank" class="term-link">github.com/mnzmii</a>',
      ],
      resume: () => {
        // Trigger download (would point to real PDF)
        setTimeout(() => {
          const btn = document.getElementById('resume-download-btn');
          if (btn) btn.click();
        }, 300);
        return ['> Initiating download: Resume_Nazmi.pdf...'];
      },
      clear: () => {
        terminalHistory.innerHTML = '';
        return null; // No output
      },
    };

    function appendOutput(command, lines) {
      // Command line
      const cmdDiv = document.createElement('div');
      cmdDiv.className = 'terminal__line terminal__line--history';
      cmdDiv.innerHTML = `<span class="terminal__prompt">guest@portfolio:~$</span> <span class="terminal__command">${escapeHtml(command)}</span>`;
      terminalHistory.appendChild(cmdDiv);

      // Output lines
      if (lines && lines.length > 0) {
        const outDiv = document.createElement('div');
        outDiv.className = 'terminal__output terminal__output--interactive';
        outDiv.innerHTML = lines.join('<br>');
        terminalHistory.appendChild(outDiv);
      }

      // Scroll to bottom
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function processCommand(raw) {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;

      if (COMMANDS[cmd]) {
        const result = COMMANDS[cmd]();
        appendOutput(raw, result);
      } else {
        appendOutput(raw, [
          `<span class="term-error">bash: ${escapeHtml(cmd)}: command not found</span>`,
          '<span class="term-hint">Type <span class="term-cmd">help</span> for available commands.</span>',
        ]);
      }
    }

    // Mirror input text for block caret
    terminalInput.addEventListener('input', () => {
      if (terminalMirror) terminalMirror.textContent = terminalInput.value;
    });

    // Handle Enter key
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = terminalInput.value;
        terminalInput.value = '';
        if (terminalMirror) terminalMirror.textContent = '';
        processCommand(value);
      }
    });

    // Focus input when clicking terminal body
    terminalBody.addEventListener('click', () => {
      terminalInput.focus();
    });

    // Auto-run intro sequence after boot
    function runIntroSequence() {
      const bootDelay = sessionStorage.getItem('portfolio_booted_prev') ? 300 : 3200;

      setTimeout(() => {
        processCommand('whoami');
        setTimeout(() => {
          processCommand('cat about.txt');
          setTimeout(() => {
            // Add hint
            const hintDiv = document.createElement('div');
            hintDiv.className = 'terminal__output terminal__output--hint';
            hintDiv.innerHTML = '<span class="term-hint">// Type <span class="term-cmd">help</span> to see available commands ↑</span>';
            terminalHistory.appendChild(hintDiv);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            terminalInput.focus();
          }, 400);
        }, 600);
      }, bootDelay);

      // Mark that we've shown boot before (for faster intro on subsequent pages)
      sessionStorage.setItem('portfolio_booted_prev', '1');
    }

    runIntroSequence();
  }

  // ================================================================
  // NAVIGATION
  // ================================================================
  const nav = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkEls = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinkEls.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ================================================================
  // SCROLL ANIMATIONS
  // ================================================================
  const animElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  animElements.forEach((el) => observer.observe(el));

  // ================================================================
  // SKILL PROGRESS BARS
  // ================================================================
  const progressBars = document.querySelectorAll('.skill-card__progress');
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = targetWidth + '%';
          }, 300);
          progressObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );
  progressBars.forEach((bar) => progressObserver.observe(bar));

  // ================================================================
  // TERMINAL FORM
  // ================================================================
  const secureForm = document.getElementById('secure-contact-form');
  if (secureForm) {
    secureForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusBtn = secureForm.querySelector('.terminal-form__btn');
      const originalText = statusBtn.textContent;
      statusBtn.textContent = '[ TRANSMITTING... ]';
      statusBtn.style.color = 'var(--bg-primary)';
      statusBtn.style.background = 'var(--yellow)';

      // =========================================================
      // CHANGE THIS TO YOUR ACTUAL FORMSPREE URL
      // Example: const formspreeUrl = 'https://formspree.io/f/mvoeqwzx';
      // =========================================================
      const formspreeUrl = 'https://formspree.io/f/xgopgpng';

      const formData = new FormData(secureForm);

      // Actual Formspree Submission
      try {
        const response = await fetch(formspreeUrl, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          secureForm.reset();
          successAnimation();
        } else {
          errorAnimation();
        }
      } catch (error) {
        errorAnimation();
      }

      function successAnimation() {
        statusBtn.textContent = '[ PACKET DELIVERED ]';
        statusBtn.style.background = 'var(--blue)';
        setTimeout(() => {
          statusBtn.textContent = originalText;
          statusBtn.style.background = '';
        }, 3000);
      }

      function errorAnimation() {
        statusBtn.textContent = '[ TRANSMISSION FAILED ]';
        statusBtn.style.background = 'var(--red)';
        setTimeout(() => {
          statusBtn.textContent = originalText;
          statusBtn.style.background = '';
        }, 3000);
      }
    });
  }

  // ================================================================
  // FOOTER YEAR
  // ================================================================
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ================================================================
  // SMOOTH SCROLL (for same-page anchors only)
  // ================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // Skip resume btn etc.
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ================================================================
  // BLOG FILTERS
  // ================================================================
  const blogFilters = document.querySelectorAll('.blog-filter');
  const blogCards = document.querySelectorAll('.blog-card');

  if (blogFilters.length > 0) {
    blogFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class
        blogFilters.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        blogCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

})();
