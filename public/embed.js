(function() {
  document.querySelectorAll('[data-hwiy-widget]').forEach(function(el) {
    var type = el.dataset.hwiyWidget;
    var war = el.dataset.war || 'ukraine-russia';
    var category = el.dataset.category || 'bread';
    var country = el.dataset.country || '';
    var iframe = document.createElement('iframe');
    var params = '?war=' + encodeURIComponent(war) + '&category=' + encodeURIComponent(category);
    if (country) {
      params += '&country=' + encodeURIComponent(country);
    }
    iframe.src = 'https://howwarimpactsyou.com/embed/' + type + params;
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = type === 'basket' ? '300px' : '200px';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('title', 'howwarimpactsyou.com ' + type + ' widget');
    el.appendChild(iframe);
  });
})();
