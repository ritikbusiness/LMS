import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add meta description for SEO
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Kayago LMS - A modern learning management system for university students to learn career-specific tracks, watch video courses, take assessments, get certified, and interact via forums.';
document.head.appendChild(metaDescription);

// Add title
const titleTag = document.createElement('title');
titleTag.textContent = 'Kayago LMS | Modern Learning Management System';
document.head.appendChild(titleTag);

// Add Open Graph tags for better social media sharing
const ogTitle = document.createElement('meta');
ogTitle.property = 'og:title';
ogTitle.content = 'Kayago LMS | Modern Learning Management System';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.property = 'og:description';
ogDescription.content = 'Learn career-specific skills, take courses, earn certificates, and connect with peers through Kayago LMS.';
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

// Add Google Fonts
const googleFontsLink = document.createElement('link');
googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@500;600;700&display=swap';
googleFontsLink.rel = 'stylesheet';
document.head.appendChild(googleFontsLink);

createRoot(document.getElementById("root")!).render(<App />);
