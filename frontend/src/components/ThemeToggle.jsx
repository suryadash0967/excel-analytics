import { useEffect, useState } from "react";
import { MdOutlineNightsStay, MdSunny } from "react-icons/md";

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      className="theme-toggle-btn"
      onClick={toggleTheme}
    >
      {theme === "light" ? <MdSunny /> : <MdOutlineNightsStay />}
    </div>
  );
}

export default ThemeToggle;
