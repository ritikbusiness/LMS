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
ogTitle.property = 'og:title';
ogTitle.content = 'Desired Career Academy | Enterprise Learning Management System';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.property = 'og:description';
ogDescription.content = 'Accelerate your career with AI-powered learning, personalized career roadmaps, presentation evaluations, and industry-recognized certifications from Desired Career Academy.';
document.head.appendChild(ogDescription);

const ogType = document.createElement('meta');
ogType.property = 'og:type';
ogType.content = 'website';
document.head.appendChild(ogType);

// Add Remix Icons for the UI
const remixIconsLink = document.createElement('link');
remixIconsLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
remixIconsLink.rel = 'stylesheet';
document.head.appendChild(remixIconsLink);

// Function to make page visible after CSS is loaded
function makePageVisible() {
  document.documentElement.style.visibility = 'visible';
}

// Add an event listener for when CSS is loaded
if (document.readyState === 'complete') {
  // If content already loaded
  makePageVisible();
  // Render the app
  createRoot(document.getElementById("root")!).render(<App />);
  
  // Hide loader
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 300);
  }
} else {
  // Wait for styles to load before showing content
  document.addEventListener('DOMContentLoaded', () => {
    // Create a list of stylesheets we need to check
    const checkStylesLoaded = () => {
      // Make page visible
      makePageVisible();
      
      // Hide the loader once everything is ready
      const loader = document.getElementById('page-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 300);
      }
      
      // Render the app
      createRoot(document.getElementById("root")!).render(<App />);
    };
    
    // Wait a tiny bit to ensure CSS is processed
    setTimeout(checkStylesLoaded, 100);
  });
}
