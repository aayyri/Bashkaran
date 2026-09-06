// Only collect basic page views on the public site, never local previews.
(() => {
  if (!['bashkaran.ch', 'www.bashkaran.ch'].includes(location.hostname)) return;
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  window.va('beforeSend', (event) => {
    if (event.type !== 'pageview') return null;
    const url = new URL(event.url, location.origin);
    url.search = '';
    url.hash = '';
    return { ...event, url: url.href };
  });
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();
