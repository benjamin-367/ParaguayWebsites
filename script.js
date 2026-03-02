document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
    });

    nav.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement && target.getAttribute("href")?.startsWith("#")) {
        nav.classList.remove("is-open");
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLAnchorElement)) return;
      const id = target.getAttribute("href")?.slice(1);
      const section = id ? document.getElementById(id) : null;
      if (!section) return;

      event.preventDefault();
      const headerOffset = 80;
      const rect = section.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY - headerOffset;

      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    });
  });

  const homePropertiesContainer = document.getElementById("home-properties");
  const allPropertiesContainer = document.getElementById("all-properties");

  if (homePropertiesContainer || allPropertiesContainer) {
    fetch("properties.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load properties");
        return response.json();
      })
      .then((properties) => {
        const renderCards = (container, list, useLongDescription = false) => {
          if (!container) return;
          container.innerHTML = "";
          list.forEach((property) => {
            const article = document.createElement("article");
            article.className = "card";
            const description = useLongDescription && property.longDescription
              ? property.longDescription
              : property.shortDescription;
            article.innerHTML = `
              <h3>${property.title}</h3>
              <p>${description}</p>
              <p><strong>${property.price} · ${property.country}</strong></p>
            `;
            container.appendChild(article);
          });
        };

        if (homePropertiesContainer) {
          const featured = properties.filter((p) => p.featuredOnHome).slice(0, 3);
          renderCards(homePropertiesContainer, featured);
        }

        if (allPropertiesContainer) {
          renderCards(allPropertiesContainer, properties, true);
        }
      })
      .catch(() => {
        // Fail silently if properties can't be loaded
      });
  }
});

