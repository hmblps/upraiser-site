(function () {
  var mobile = window.matchMedia("(max-width: 899px)").matches;
  var stored = localStorage.getItem("upraiser-theme");
  var theme = mobile
    ? "light"
    : stored === "light" || stored === "dark"
      ? stored
      : "dark";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  if (/Windows/i.test(navigator.userAgent)) {
    document.documentElement.dataset.os = "windows";
  }
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#ffffff" : "#0a0a0a");
})();
