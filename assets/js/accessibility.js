const main = document.querySelector("main");

if (main) {
  main.id ||= "main-content";

  const skipLink = document.createElement("a");
  skipLink.className = "skip-link";
  skipLink.href = `#${main.id}`;
  skipLink.textContent = "Skip to main content";
  document.body.prepend(skipLink);
}
