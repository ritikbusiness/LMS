import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add meta description for SEO
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Desired Career Academy - A comprehensive enterprise-grade learning management system for university students to accelerate their careers through specialized learning tracks, assessments, certification, and AI-powered tools.';
document.head.appendChild(metaDescription);

// Add title
const titleTag = document.createElement('title');
titleTag.textContent = 'Desired Career Academy | Enterprise Learning Management System';
document.head.appendChild(titleTag);

// Add Open Graph tags for better social media sharing
const ogTitle = document.createElement('meta');
ogTitle.setAttribute('property', 'og:title');
ogTitle.content = 'Desired Career Academy | Enterprise Learning Management System';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.setAttribute('property', 'og:description');
ogDescription.content = 'Accelerate your career with AI-powered learning, personalized career roadmaps, presentation evaluations, and industry-recognized certifications from Desired Career Academy.';
document.head.appendChild(ogDescription);

const ogType = document.createElement('meta');
ogType.setAttribute('property', 'og:type');
ogType.content = 'website';
document.head.appendChild(ogType);

// Add Remix Icons for the UI
const remixIconsLink = document.createElement('link');
remixIconsLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
remixIconsLink.rel = 'stylesheet';
document.head.appendChild(remixIconsLink);

// Create a single root instance for the React app
const rootElement = document.getElementById("root");
if (rootElement) {
  // Render the app once, avoid multiple createRoot calls
  const root = createRoot(rootElement);
  root.render(<App />);
}

// Main entry function for the application 
// This addresses the flickering issue by controlling when CSS is applied
function initializeApp() {
  // Ensure styles are properly applied
  const loadExternalStylesheets = () => {
    const remixIconsLink = document.createElement('link');
    remixIconsLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
    remixIconsLink.rel = 'stylesheet';
    document.head.appendChild(remixIconsLink);
  };
  
  // Load external styles
  loadExternalStylesheets();
  
  // Enable smoother transitions when styles are ready
  if (typeof window !== 'undefined') {
    // Force a browser repaint cycle
    document.body.style.display = 'none';
    document.body.offsetHeight; // This triggers a reflow
    document.body.style.display = '';
  }
}

// Initialize once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
