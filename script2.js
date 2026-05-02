
let menuBtn = document.querySelector('.mobile-menu-btn');
let navList = document.querySelectorAll('.nav__list-item');
let navContent = document.querySelector('.nav-wrapper');
let navListItem = document.querySelectorAll('.nav__list-item a');

function menuActive(){
  menuBtn.addEventListener('click' ,function () {
    menuBtn.classList.toggle('active');
    navContent.classList.toggle('menu_active');
    navList.forEach((navList) => navList.classList.toggle('menu_active'));
    themeCta.classList.toggle('menu_active');
  });
};

menuActive();

function menuInactive(){
  navListItem.forEach((navListItem) => navListItem.addEventListener('click' , function() {
    menuBtn.classList.remove('menu_active');
    navContent.classList.remove('menu_active');
    navList.forEach((navList) => navList.classList.remove('menu_active'));
    themeCta.classList.remove('menu_active');
  }));
};


function initCarousel(card) {
    const track = card.querySelector('.project-card-carousel');

    if (!track) return;
    
    const slidesTrack = track.querySelector('.project-mockups');
    const prevBtn = track.querySelector('.prev-btn');
    const nextBtn = track.querySelector('.next-btn');
    const counter = track.querySelector('.carousel-counter');

    if (!track || !slidesTrack) return;

    const slides = Array.from(slidesTrack.querySelectorAll('.carousel-slide'));
    if (slides.length === 0) return;

    const total = slides.length;
    let current = 0;

    // ── Build dot indicators ───────────────────────
    counter.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.addEventListener('click', () => goTo(i));
        counter.appendChild(dot);
    });

    // ── Core navigation ────────────────────────────
    function goTo(index) {
        if (index < 0) index = 0;
        if (index >= total) index = total - 1;

        counter.children[current].classList.remove('active');
        current = index;

        // Percentage-based translate — clean and responsive
        slidesTrack.style.transform = 'translateX(-' + (current * 100) + '%)';

        counter.children[current].classList.add('active');

        if (prevBtn) prevBtn.style.display = current === 0 ? 'none' : 'flex';
        if (nextBtn) nextBtn.style.display = current === total - 1 ? 'none' : 'flex';
    }

    // ── Button listeners ───────────────────────────
    if (prevBtn) prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(current - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(current + 1);
    });

    // ── Keyboard support ───────────────────────────
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });

    let isDragging = false;
    let dragStartX = 0;
    let dragStartTime = 0;

    slidesTrack.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartTime = Date.now();
        slidesTrack.style.transition = 'none';
        slidesTrack.style.cursor = 'grabbing';
        e.preventDefault();                         // prevent image ghost drag
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        const offset = -(current * slidesTrack.getBoundingClientRect().width) + dx;
        slidesTrack.style.transform = 'translateX(' + offset + 'px)';
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;

        // Restore transition & cursor
        slidesTrack.style.transition =
            'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        slidesTrack.style.cursor = 'grab';

        const dx = e.clientX - dragStartX;
        const elapsed = Date.now() - dragStartTime;
        const velocity = Math.abs(dx) / elapsed;

        if (Math.abs(dx) > 50 || velocity > 0.3) {
            goTo(dx < 0 ? current + 1 : current - 1);
        } else {
            goTo(current);                            // snap back
        }
    });

    // ── Init ───────────────────────────────────────
    goTo(0);
}

document.querySelectorAll('.project-card').forEach(initCarousel);