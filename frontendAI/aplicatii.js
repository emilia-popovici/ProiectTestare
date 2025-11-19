// Asteapta ca pagina sa se incarce complet inainte de a initializa carouselul
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("app-carousel-track");
  const indicatorContainer = document.getElementById("carousel-indicators");
  
  // Verifica daca elementele necesare exista in DOM
  if (!track || !indicatorContainer) {
    return;
  }

  const items = track.querySelectorAll(".carousel-item");
  if (items.length === 0) return;

  let currentIndex = 0;
  const intervalTime = 8000; // 8 secunde intre slide-uri
  let slideInterval;

  // Muta carouselul la indexul specificat
  function moveToSlide(index) {
    currentIndex = index;
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    updateIndicators();
  }

  // Creeaza indicatorii (punctele) pentru fiecare slide
  items.forEach((_, index) => {
    const indicator = document.createElement("span");
    indicator.classList.add("indicator");
    indicator.setAttribute("data-slide-to", index);
    
    // Permite utilizatorului sa selecteze un slide prin click
    indicator.addEventListener("click", () => {
      resetInterval();
      moveToSlide(index);
    });
    
    indicatorContainer.appendChild(indicator);
  });

  // Actualizeaza indicatorii - markeaza activ indicatorul corespunzator slide-ului curent
  function updateIndicators() {
    indicatorContainer.querySelectorAll(".indicator").forEach((ind, index) => {
      ind.classList.toggle("active", index === currentIndex);
    });
  }

  // Trece automat la urmatorul slide
  function autoAdvance() {
    currentIndex = (currentIndex + 1) % items.length;
    moveToSlide(currentIndex);
  }

  // Incepe rotarea automata a carouselului
  function startInterval() {
    slideInterval = setInterval(autoAdvance, intervalTime);
  }

  // Reseteaza timerul - util cand utilizatorul interactioneaza cu carouselul
  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }
  
  // Initializeaza carouselul pe primul slide si incepe animatia automata
  moveToSlide(0);
  startInterval();
});
