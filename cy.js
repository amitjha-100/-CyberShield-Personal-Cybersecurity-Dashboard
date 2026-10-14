
const passwordForm = document.querySelector("#password-form");
const passwordInput = document.querySelector("#password-input");
const togglePassword = document.querySelector("#toggle-password");
const passwordResult = document.querySelector("#password-result");

const urlForm = document.querySelector("#url-form");
const urlInput = document.querySelector("#url-input");
const urlResult = document.querySelector("#url-result");


function showResult(container, title, messages, level) {
  container.replaceChildren();

  const heading = document.createElement("p");
  heading.className = `result-title ${level}`;
  heading.textContent = title;
  container.appendChild(heading);

  messages.forEach((message) => {
    const line = document.createElement("p");
    line.textContent = message;
    container.appendChild(line);
  });
}


passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const password = passwordInput.value;

  if (!password) {
    showResult(passwordResult, "Enter a password", [], "warning");
    return;
  }

  let score = 0;
  const feedback = [];

  if (password.length >= 12) {
    score++;
  } else {
    feedback.push("Use at least 12 characters.");
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push("Mix uppercase and lowercase letters.");
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push("Consider including numbers.");
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push("Consider including special characters.");
  }

  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push("Avoid repeating the same character several times.");
  }

  if (password.length < 8) {
    score = Math.min(score, 1);
    feedback.push("Very short passwords are easier to guess.");
  }

  const commonPasswords = [
    "password",
    "password123",
    "12345678",
    "qwerty123",
    "admin123"
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    score = 0;
    feedback.push("This matches a common password pattern.");
  }

  let title;
  let level;

  if (score <= 1) {
    title = "Weak password";
    level = "bad";
  } else if (score <= 2) {
    title = "Fair password";
    level = "warning";
  } else if (score === 3) {
    title = "Good password";
    level = "good";
  } else {
    title = "Strong pattern";
    level = "good";
  }

  if (feedback.length === 0) {
    feedback.push("Good variety and length. Avoid reusing passwords.");
  }

  showResult(passwordResult, title, feedback, level);
});

togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "Hide" : "Show";
});

// Basic suspicious URL checker
urlForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const rawValue = urlInput.value.trim();

  if (!rawValue) {
    showResult(urlResult, "Enter a URL", [], "warning");
    return;
  }

  
  if (!/^https?:\/\//i.test(rawValue)) {
    showResult(
      urlResult,
      "Could not review this URL",
      ["Enter a complete URL beginning with http:// or https://."],
      "warning"
    );
    return;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(rawValue);
  } catch {
    showResult(
      urlResult,
      "Invalid URL format",
      ["Check the address and try again."],
      "bad"
    );
    return;
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    showResult(urlResult, "Unsupported URL", ["Use a web URL."], "bad");
    return;
  }

  const warnings = [];
  const hostname = parsedUrl.hostname.toLowerCase();

  if (parsedUrl.protocol === "http:") {
    warnings.push("The connection uses HTTP, not HTTPS.");
  }

  if (parsedUrl.username || parsedUrl.password) {
    warnings.push("The URL contains text before the @ symbol.");
  }

  if (hostname.startsWith("xn--") || hostname.includes(".xn--")) {
    warnings.push("The domain uses encoded characters. Check it carefully.");
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    warnings.push("The hostname is an IP address rather than a typical domain.");
  }

  if (hostname.split(".").length >= 5) {
    warnings.push("The hostname has many subdomain levels.");
  }

  if (hostname.includes("xn--")) {
    
  }

  const shorteners = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "is.gd",
    "cutt.ly"
  ];

  if (shorteners.includes(hostname)) {
    warnings.push("This is a URL shortener, so the final destination is hidden.");
  }

  if (warnings.length === 0) {
    showResult(
      urlResult,
      "No basic warning signs found",
      [
        `Hostname: ${hostname}`,
        "This does not mean the website is trustworthy or safe."
      ],
      "good"
    );
  } else {
    showResult(
      urlResult,
      "Review this URL carefully",
      [
        `Hostname: ${hostname}`,
        ...warnings,
        "These signals do not prove that a URL is malicious."
      ],
      "warning"
    );
  }
})
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => {
      item.classList.remove("active");
    });

    link.classList.add("active");
  });
});
