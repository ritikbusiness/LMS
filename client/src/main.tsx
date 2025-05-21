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

// Simple and direct approach - render app immediately
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}

// Handle the loader in a simpler way
window.addEventListener('load', function() {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s ease';
    
    setTimeout(function() {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 300);
  }
});

// Backup timeout - remove loader after 2s regardless
setTimeout(function() {
  const loader = document.getElementById('app-loader');
  if (loader && loader.parentNode) {
    loader.parentNode.removeChild(loader);
  }
}, 2000);
