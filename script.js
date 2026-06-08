const navLinks = [...document.querySelectorAll(".nav-link")];
const pages = [...document.querySelectorAll("[data-page]")];
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const defaultPage = "veille";
const adminCode = "rao2026";
const projectStorageKey = "portfolio-project-content-v2";
const defaultProject = {
  title: "MyCheckOut - Solution de Caisse Mobile Économique",
  description:
    "Développement d'une interface web mobile permettant aux collaborateurs de scanner des articles et d'encaisser les clients directement en rayon, réduisant l'attente en caisse centrale. Conçu pour être utilisé en mode SaaS par des petites structures.",
  steps: [
    "Étude de faisabilité",
    "Modélisation Base de Données (UML)",
    "Développement PHP/Laravel",
    "Tests et déploiement MVP",
  ],
  techs: ["PHP/Laravel", "JS", "SQL", "Git", "HTML/CSS"],
};

function showPage(pageId) {
  const targetId = pageId || defaultPage;

  pages.forEach((page) => {
    page.classList.toggle("active", page.id === targetId);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${targetId}`);
  });

  if (mainNav && navToggle) {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
}

function syncFromHash() {
  const pageId = window.location.hash.replace("#", "");
  const pageExists = pages.some((page) => page.id === pageId);
  showPage(pageExists ? pageId : defaultPage);
}

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

window.addEventListener("hashchange", syncFromHash);
syncFromHash();

const projectTitle = document.querySelector("[data-project-title]");
const projectDescription = document.querySelector("[data-project-description]");
const projectSteps = document.querySelector("[data-project-steps]");
const projectTechs = document.querySelector("[data-project-techs]");
const loginButton = document.querySelector(".admin-login");
const adminPanel = document.querySelector(".admin-panel");
const logoutButton = document.querySelector(".admin-logout");
const resetButton = document.querySelector(".admin-reset");
const editFields = {
  title: document.querySelector("[data-edit-field='title']"),
  description: document.querySelector("[data-edit-field='description']"),
  steps: document.querySelector("[data-edit-field='steps']"),
  techs: document.querySelector("[data-edit-field='techs']"),
};

function cleanLines(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanCommaList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSavedProject() {
  const savedProject = localStorage.getItem(projectStorageKey);

  if (!savedProject) {
    return defaultProject;
  }

  try {
    return { ...defaultProject, ...JSON.parse(savedProject) };
  } catch {
    return defaultProject;
  }
}

function renderProject(project) {
  projectTitle.textContent = project.title;
  projectDescription.textContent = project.description;
  projectSteps.replaceChildren(
    ...project.steps.map((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      return item;
    }),
  );
  projectTechs.replaceChildren(
    ...project.techs.map((tech) => {
      const item = document.createElement("span");
      item.textContent = tech;
      return item;
    }),
  );
}

function fillAdminForm(project) {
  editFields.title.value = project.title;
  editFields.description.value = project.description;
  editFields.steps.value = project.steps.join("\n");
  editFields.techs.value = project.techs.join(", ");
}

function readAdminForm() {
  return {
    title: editFields.title.value.trim() || defaultProject.title,
    description: editFields.description.value.trim() || defaultProject.description,
    steps: cleanLines(editFields.steps.value),
    techs: cleanCommaList(editFields.techs.value),
  };
}

function saveProject(project) {
  localStorage.setItem(projectStorageKey, JSON.stringify(project));
}

function openAdminPanel() {
  const code = window.prompt("Code administrateur");

  if (code !== adminCode) {
    window.alert("Code incorrect.");
    return;
  }

  adminPanel.hidden = false;
  loginButton.hidden = true;
  fillAdminForm(getSavedProject());
}

function closeAdminPanel() {
  adminPanel.hidden = true;
  loginButton.hidden = false;
}

if (new URLSearchParams(window.location.search).get("admin") === "1") {
  loginButton.hidden = false;
}

loginButton.addEventListener("click", openAdminPanel);
logoutButton.addEventListener("click", closeAdminPanel);

adminPanel.addEventListener("input", () => {
  renderProject(readAdminForm());
});

adminPanel.addEventListener("submit", (event) => {
  event.preventDefault();
  const project = readAdminForm();
  saveProject(project);
  renderProject(project);
  window.alert("Projet enregistré sur ce navigateur.");
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem(projectStorageKey);
  fillAdminForm(defaultProject);
  renderProject(defaultProject);
});

renderProject(getSavedProject());
