(function () {
  var stored = localStorage.getItem("upraiser-theme");
  var theme = stored === "light" || stored === "dark" ? stored : "dark";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#ffffff" : "#0a0a0a");
})();
