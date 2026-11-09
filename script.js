document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  const cursor = document.querySelector(".cursor");
  const dot = document.querySelector(".cursor-dot");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursor && dot && finePointer && !prefersReducedMotion) {
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let targetX = x, targetY = y;
    window.addEventListener("mousemove", event => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.left = `${targetX}px`;
      dot.style.top = `${targetY}px`;
    });
    const animateCursor = () => {
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      window.requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll("a, button, .skill-cloud span").forEach(element => {
      element.addEventListener("mouseenter", () => {
        cursor.style.width = "48px";
        cursor.style.height = "48px";
      });
      element.addEventListener("mouseleave", () => {
        cursor.style.width = "28px";
        cursor.style.height = "28px";
      });
    });
  }

  if (!prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach(element => {
      element.addEventListener("mousemove", event => {
        const rect = element.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${offsetX * 0.08}px, ${offsetY * 0.08}px)`;
      });
      element.addEventListener("mouseleave", () => {
        element.style.transform = "";
      });
    });
  }

  const menuButton = document.querySelector(".menu");
  const nav = document.querySelector("#primary-navigation");

  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      menuButton.textContent = "☰";
    };

    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      menuButton.textContent = isOpen ? "×" : "☰";
    });

    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) closeMenu();
    });
  }
});
