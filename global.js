console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                    // Local server
  : "/dsc106-Portfolio/";  // GitHub Pages repo name

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'cv/', title: 'CV' },
  { url: 'contact/', title: 'Contact' }
];

let nav = document.createElement('nav');
nav.classList.add('navbar');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }

   let a = document.createElement('a');
   a.href = url;
   a.textContent = title;
   nav.append(a);
}
let navLinks = $$("nav a");

let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);

currentLink?.classList.add('current');