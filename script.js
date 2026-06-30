// Mobile Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Open To-Do App
document.getElementById('openTodoBtn')?.addEventListener('click', () => {
    window.open('projects/todo-app/index.html', '_blank');
});

// Open Weather App
document.getElementById('openWeatherBtn')?.addEventListener('click', () => {
    window.open('projects/weather-app/index.html', '_blank');
});

// Open GitHub Profile Finder App
document.getElementById('openGithubBtn')?.addEventListener('click', () => {
    window.open('projects/github-finder/index.html', '_blank');
});

// Open E-Commerce Store App
document.getElementById('openEcommerceBtn')?.addEventListener('click', () => {
    window.open('projects/ecommerce-store/index.html', '_blank');
});

// Open Movie Search App
document.getElementById('openMovieBtn')?.addEventListener('click', () => {
    window.open('projects/movie-app/index.html', '_blank');
});

// Open Calculator App
document.getElementById('openCalculatorBtn')?.addEventListener('click', () => {
    window.open('projects/calculator-app/index.html', '_blank');
});

// Download Resume Button
document.getElementById('downloadResumeBtn')?.addEventListener('click', () => {
    alert('To create a professional resume:\n\n1. Use Canva or Google Docs\n2. Add your skills and projects\n3. Export as PDF\n\nYour projects:\n- To-Do List App\n- Weather App with API\n- GitHub Profile Finder\n- E-Commerce Store\n\nThese are real portfolio pieces!');
});

// Add active class to nav links on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLi.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href') === `#${current}`) {
            li.classList.add('active');
        }
    });
});
