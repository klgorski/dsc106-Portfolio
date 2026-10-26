import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


const projects = await fetchJSON('lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const header = document.querySelector('h1');
header.textContent = `${projects.length} Projects`;


let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);


// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);;
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  let selectedIndex = -1;

  let svg = d3.select('#projects-plot');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  newArcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
      .on('click', () => {
      selectedIndex = selectedIndex === idx ? -1 : idx;

    svg
        .selectAll('path')
        .attr('class', (_, idx) => (
            idx === selectedIndex ? 'selected' : ''
            ));
        
    legend
        .selectAll('li')
        .attr('class', (_, idx) => (
        idx === selectedIndex ? 'legend-item selected' : 'legend-item'
        ));

        if (selectedIndex === -1) {
            renderProjects(projects, projectsContainer, 'h2');
            } 
        else {
        let selectedYear = newData[selectedIndex].label
        let filteredProjects = projectsGiven.filter((p) => p.year === selectedYear);
        renderProjects(filteredProjects, projectsContainer, 'h2');
        }

    });


        
})
    newData.forEach((d, idx) => {
    legend
        .append('li')
        .attr('class', 'legend-item')
        .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    });
}

// Call this function on page load
renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  query = event.target.value;
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // re-render legends and pie chart when event triggers
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});