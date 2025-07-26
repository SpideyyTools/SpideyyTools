// Offline Portfolio Generator JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const portfolioForm = document.getElementById('portfolio-form');
  const portfolioPreview = document.getElementById('portfolio-preview');

  portfolioForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const bio = document.getElementById('bio').value.trim();
    const projectsInput = document.getElementById('projects').value.trim();

    if (!name || !bio) {
      alert('Please fill in your name and bio.');
      return;
    }

    const projects = projectsInput
      ? projectsInput.split(',').map(p => p.trim()).filter(p => p.length > 0)
      : [];

    renderPortfolio(name, bio, projects);
  });

  function renderPortfolio(name, bio, projects) {
    let html = `
      <h3>${name}</h3>
      <p>${bio}</p>
    `;

    if (projects.length > 0) {
      html += '<h4>Projects</h4><ul>';
      projects.forEach(proj => {
        const safeUrl = sanitizeUrl(proj);
        html += `<li><a href="${safeUrl}" target="_blank" rel="noopener">${safeUrl}</a></li>`;
      });
      html += '</ul>';
    }

    portfolioPreview.innerHTML = html;
    portfolioPreview.style.display = 'block';
  }

  // Basic URL sanitization to prevent XSS
  function sanitizeUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.href;
    } catch {
      return '#';
    }
  }
});
