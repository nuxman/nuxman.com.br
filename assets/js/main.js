const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector("#nav-links");
const languageButtons = document.querySelectorAll("[data-language]");
const i18n = window.cvI18n;

const getTranslation = (dictionary, key) =>
  key.split(".").reduce((value, part) => (value ? value[part] : undefined), dictionary);

const readStoredLanguage = () => {
  try {
    return localStorage.getItem(i18n.storageKey);
  } catch {
    return null;
  }
};

const storeLanguage = (language) => {
  try {
    localStorage.setItem(i18n.storageKey, language);
  } catch {
    // Keep language switching usable even when storage is blocked.
  }
};

const updateYear = () => {
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
};

const applyLanguage = (language) => {
  if (!i18n || !i18n.translations[language]) {
    updateYear();
    return;
  }

  const dictionary = i18n.translations[language];
  const metadata = dictionary.meta || {};

  document.documentElement.lang = language;

  if (metadata.title) {
    document.title = metadata.title;
  }

  if (metadata.description) {
    const description = document.querySelector('meta[name="description"]');

    if (description) {
      description.setAttribute("content", metadata.description);
    }
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const translation = getTranslation(dictionary, element.dataset.i18n);

    if (typeof translation === "string") {
      element.textContent = translation;
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const translation = getTranslation(dictionary, element.dataset.i18nHtml);

    if (typeof translation === "string") {
      element.innerHTML = translation;
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(",").forEach((mapping) => {
      const [attribute, key] = mapping.split(":").map((part) => part.trim());
      const translation = getTranslation(dictionary, key);

      if (attribute && typeof translation === "string") {
        element.setAttribute(attribute, translation);
      }
    });
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateYear();
};

const getSavedLanguage = () => {
  if (!i18n) {
    return "en";
  }

  const savedLanguage = readStoredLanguage();

  return i18n.translations[savedLanguage] ? savedLanguage : i18n.defaultLanguage;
};

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.language;

    if (!language || !i18n || !i18n.translations[language]) {
      return;
    }

    storeLanguage(language);
    applyLanguage(language);
  });
});

applyLanguage(getSavedLanguage());

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      links.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}
