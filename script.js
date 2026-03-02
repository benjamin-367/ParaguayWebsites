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
  const propertyDetailContainer = document.getElementById("property-detail");

  if (homePropertiesContainer || allPropertiesContainer || propertyDetailContainer) {
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
            const url = `property.html?id=${encodeURIComponent(property.id)}`;
            article.innerHTML = `
              <a href="${url}" class="card-link">
                ${
                  property.image
                    ? `<div class="card-image"><img src="${property.image}" alt="${property.title}"/></div>`
                    : ""
                }
                <h3>${property.title}</h3>
                <p>${description}</p>
                <p><strong>${property.price} · ${property.country}</strong></p>
              </a>
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

        if (propertyDetailContainer) {
          const params = new URLSearchParams(window.location.search);
          const id = params.get("id");
          const property = properties.find((p) => p.id === id);
          if (!property) {
            propertyDetailContainer.innerHTML =
              "<p class=\"muted\">Property not found. It may have been removed or renamed.</p>";
            return;
          }

          const imageSection = property.image
            ? `
            <div class="property-hero-image">
              <img src="${property.image}" alt="${property.title}" />
            </div>`
            : "";

          propertyDetailContainer.innerHTML = `
            <div class="property-layout">
              ${imageSection}
              <div class="property-main">
                <h1>${property.title}</h1>
                <p class="property-meta">${property.price} · ${property.country}</p>
                <p class="property-description">
                  ${property.longDescription || property.shortDescription}
                </p>
                <div class="property-actions">
                  <a href="index.html#contact" class="btn primary">Request more details</a>
                  <a href="properties.html" class="btn ghost">Back to all properties</a>
                </div>
              </div>
            </div>
          `;
        }
      })
      .catch(() => {
        // Fail silently if properties can't be loaded
      });
  }
});

