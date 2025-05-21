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

// Key function for stable UI rendering
const renderApp = () => {
  // Get the root element
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<App />);
  }
  
  // When everything is ready, reveal content
  const showPage = () => {
    document.documentElement.style.visibility = 'visible';
    
    // Remove the loading screen with animation
    const loadingScreen = document.getElementById('root-loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 0.4s ease-out';
      setTimeout(() => {
        if (loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }
      }, 400);
    }
  };

  // Apply Tailwind styles properly
  setTimeout(showPage, 150);
};

// Controlled render sequence
if (document.readyState === 'complete') {
  // If already loaded, render immediately
  renderApp();
} else {
  // Wait for full document load
  window.addEventListener('load', renderApp);
  
  // Backup timer to ensure rendering happens
  setTimeout(renderApp, 1500);
}
