import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const header = document.querySelector('h1');
header.textContent = `${projects.length} Projects`;