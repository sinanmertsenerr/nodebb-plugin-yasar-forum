
 
 function moveLoginButtons() {
    if ($(window).width() < 768) {
      var $loginForm = $('.login-block');
      var $altLogin = $('.alt-login-block');

      if ($loginForm.length && $altLogin.length) {
        $altLogin.insertBefore($loginForm);
      }
    }
  }

  function moveRegisterButtons() {
    if ($(window).width() < 768) {
      var $registerForm = $('.register-block');
      var $altRegister = $('.alt-register-block');

      if ($registerForm.length && $altRegister.length) {
        $altRegister.insertBefore($registerForm);
      }
    }
  }

  function handleResponsiveMove() {
    moveLoginButtons();
    moveRegisterButtons();
  }

  // İlk sayfa yüklemesinde çalıştır
  $(document).ready(function () {
    handleResponsiveMove();
  });

  // SPA yönlendirmelerinde çalıştır (NodeBB)
  $(window).on('action:ajaxify.end', function () {
    handleResponsiveMove();
  });

  // Pencere boyutu değişince çalıştır
  $(window).on('resize', function () {
    handleResponsiveMove();
  });
  
  
  
function applyGoogleButtonStyle() {
  const googleLi = document.querySelector("ul.alt-logins > li.google");

  if (!googleLi) return;

  const googleBtn = googleLi.querySelector("a");
  if (!googleBtn || googleBtn.classList.contains("styled-google-btn")) return;

  // Buton zaten düzenlenmişse tekrar stil uygulama
  googleBtn.classList.add("styled-google-btn");

  // Buton stili
  googleBtn.style.display = "flex";
  googleBtn.style.alignItems = "center";
  googleBtn.style.backgroundColor = "#4285F4";
  googleBtn.style.color = "#fff";
  googleBtn.style.border = "none";
  googleBtn.style.borderRadius = "4px";
  googleBtn.style.overflow = "hidden";
  googleBtn.style.padding = "0";
  googleBtn.style.height = "40px";
  googleBtn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
  googleBtn.style.textDecoration = "none";
  googleBtn.style.transition = "background-color 0.3s";

  // Hover efekti
  googleBtn.addEventListener("mouseover", function () {
    googleBtn.style.backgroundColor = "#3367D6";
  });
  googleBtn.addEventListener("mouseout", function () {
    googleBtn.style.backgroundColor = "#4285F4";
  });

  // Sol: Logo kutusu
  const logoWrapper = document.createElement("div");
  logoWrapper.style.backgroundColor = "#fff";
  logoWrapper.style.display = "flex";
  logoWrapper.style.alignItems = "center";
  logoWrapper.style.justifyContent = "center";
  logoWrapper.style.width = "40px";
  logoWrapper.style.height = "40px";

  const svg = googleBtn.querySelector("svg");
  if (svg) {
    svg.setAttribute("width", "18px");
    svg.setAttribute("height", "18px");
    svg.style.flexShrink = "0";
    svg.style.margin = "0";
    svg.style.padding = "0";
    svg.style.display = "block";
    svg.style.verticalAlign = "middle";

    logoWrapper.appendChild(svg);
  }

  // Sağ: Yazı alanı
  const textWrapper = document.createElement("div");
  textWrapper.textContent = "Sign in with Google";
  textWrapper.style.flex = "1";
  textWrapper.style.textAlign = "center";
  textWrapper.style.fontSize = "14px";
  textWrapper.style.fontWeight = "500";

  // Temizle ve yeniden yapılandır
  googleBtn.innerHTML = "";
  googleBtn.appendChild(logoWrapper);
  googleBtn.appendChild(textWrapper);
}

// MutationObserver kur
const observer = new MutationObserver(() => {
  applyGoogleButtonStyle();
});

// Gözlenecek alan
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// İlk yüklemede de çalıştır
applyGoogleButtonStyle();


async function fetchGroups() {
    // Grup kutusu (#group-widget) olmayan sayfalarda çalışmaz; yoksa her sayfada hata verir
    const box = document.getElementById("group-widget");
    if (!box) return;
    box.innerHTML = "";
  
    const urls = [
      "https://forum.ieu.app/api/groups?page=1",
      "https://forum.ieu.app/api/groups?page=2"
    ];
  
    try {
      const [res1, res2] = await Promise.all(urls.map(url => fetch(url)));
      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
  
      const allGroups = [...(data1.groups || []), ...(data2.groups || [])];
  
      const path = window.location.pathname;
      const isKuluplerPage = path.includes("/kulupler");
  
      allGroups.forEach(group => {
        const displayName = group.displayName || "";
  
        // "administrators" içeren grupları direkt atla
        if (group.slug.toLowerCase().includes("administrators")) return;
        if (group.slug.toLowerCase().includes("moderators")) return;
  
        const isKulup = displayName.includes("Kulüp") || displayName.includes("Kulübü") || displayName.includes("IEEE");
  
        if ((isKuluplerPage && !isKulup) || (!isKuluplerPage && isKulup)) return;
  
        const card = document.getElementById("group-card-template").content.cloneNode(true);
  
        card.querySelector(".group-cover-link").href = `/groups/${group["slug"]}`;
        card.querySelector(".group-cover-link").style.backgroundImage =
          typeof group["cover:thumb:url"] === "string" && group["cover:thumb:url"].startsWith("/")
            ? `url('https://forum.ieu.app${group["cover:thumb:url"]}')`
            : typeof group["cover:url"] === "string" && group["cover:url"].startsWith("/")
            ? `url('https://forum.ieu.app${group["cover:url"]}')`
            : `url('/assets/default-cover.jpg')`;
  
        card.querySelector(".group-cover-link").style.backgroundPosition = group["cover:position"] || "50% 50%";
        card.querySelector(".group-cover-link").setAttribute("aria-label", `${displayName.trim()} için grup sayfa bağlantısı`);
  
        card.querySelector(".group-page-link").href = `/groups/${group["slug"]}`;
        card.querySelector(".group-name").textContent = displayName.trim();
        card.querySelector(".group-member-count").textContent = group.memberCount;
  
        const descElement = document.createElement("div");
        descElement.className = "group-description text-sm text-muted mt-1";
        descElement.textContent = group.description?.trim() || "";
        card.querySelector(".card-body").appendChild(descElement);
  
        document.getElementById("group-widget").appendChild(card);
      });
    } catch (err) {
      console.error("Grup verisi alınamadı:", err);
    }
  }


  
document.addEventListener("DOMContentLoaded", () => {
 fetchGroups();
});

$(window).on("action:ajaxify.end", () => {
    fetchGroups();
});
 /////////// konfeti 

 /*
 window.addEventListener('load', () => {
    // LocalStorage kontrolü kaldırıldı
    massiveConfettiShow();
});

function fireConfettiFrom(x, y) {
    confetti({
        particleCount: 100,
        spread: 160,
        startVelocity: 60,
        origin: { x, y }
    });
}

function massiveConfettiShow() {
    const positions = [
        [0.1, 0.1], [0.5, 0.1], [0.9, 0.1],  // üst
        [0.1, 0.5], [0.5, 0.5], [0.9, 0.5],  // orta
        [0.1, 0.9], [0.5, 0.9], [0.9, 0.9],  // alt
    ];

    let rounds = 0;
    const maxRounds = 5; // toplam 10 defa patlatacak

    const interval = setInterval(() => {
        positions.forEach(([x, y]) => fireConfettiFrom(x, y));
        rounds++;

        if (rounds >= maxRounds) {
            clearInterval(interval);
        }
    }, 300); // her 300ms’de patlatır
}

 */

// Kategoriler menüsünü kurar: başlık, kategori ağacı, SVG ikonlar, konu sayısı ve bulunduğun kategori
(function () {
  var base = '';
  var lastFetch = 0;

  // Font Awesome ikon adı -> Lucide SVG (lucide-static 1.48.0, ISC lisansı)
  var ICONS = {
    'bullhorn': '<path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"/><path d="M8 6v8"/>',
    'comments': '<path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"/>',
    'snapchat': '<path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/>',
    'icons': '<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>',
    'people-roof': '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    'person-circle-question': '<path d="M12 22V12"/><path d="M20.27 18.27 22 20"/><path d="M21 10.498V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.98-.559"/><path d="M3.29 7 12 12l8.71-5"/><path d="m7.5 4.27 8.997 5.148"/><circle cx="18.5" cy="16.5" r="2.5"/>',
    'file-invoice-dollar': '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    'stapler': '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M12 17h.01"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/>',
    'book': '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>',
    'lock': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'
  };
  var ARROW_RIGHT = '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>';
  var ARROW_OUT = '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>';

  function svg(inner, cls) {
    // pathLength="1" ikonların menü açılırken kendini çizmesi için
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner.replace(/<(path|circle)\b/g, '<$1 pathLength="1"') + '</svg>';
  }

  function iconFor(c) {
    var name = String(c.icon || '').split(/\s+/).map(function (x) { return x.replace(/^fa-/, ''); })
      .filter(function (x) { return x && ['solid', 'regular', 'brands', 'fw', 'fa'].indexOf(x) === -1; })[0];
    if (ICONS[name]) return svg(ICONS[name], 'ycat-svg');
    return '<i class="fa fa-fw ' + esc(c.icon) + '"></i>';
  }

  function decode(s) {
    var t = document.createElement('textarea');
    t.innerHTML = s || '';
    return t.value;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML.replace(/"/g, '&quot;');
  }

  function renderBranch(list, counter) {
    if (!list || !list.length) return '';
    return '<ul class="tree-branch">' + list.map(function (c) {
      var i = counter.n++;
      var isLink = !!c.link;
      var href = isLink ? c.link : base + '/category/' + c.slug;
      var count = c.totalTopicCount || 0;
      var right = isLink
        ? svg(ARROW_OUT, 'ycat-svg ycat-count')
        : (count ? '<span class="ycat-count" title="' + count + ' konu">' + count + '</span>' : '');

      return '<li class="tree-node" data-cid="' + c.cid + '" style="--i:' + i + '">' +
        '<a class="dropdown-item ycat-item" href="' + esc(href) + '"' +
        (isLink ? ' target="_blank" rel="noopener"' : '') +
        ' title="' + esc(decode(c.description)) + '">' +
        '<span class="category-menu ycat-ico" style="background-color:' + esc(c.bgColor) + ';color:' + esc(c.color) + ';--c:' + esc(c.bgColor) + ';">' +
        iconFor(c) + '</span>' +
        '<span class="category-name">' + esc(decode(c.name)) + '</span>' + right + '</a>' +
        renderBranch(c.children, counter) +
        '</li>';
    }).join('') + '</ul>';
  }

  function markCurrent() {
    var cid = window.ajaxify && window.ajaxify.data && window.ajaxify.data.cid;
    document.querySelectorAll('.ycat-list li.tree-node').forEach(function (li) {
      var on = !!cid && li.getAttribute('data-cid') === String(cid);
      var a = li.querySelector(':scope > a');
      li.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function render(categories) {
    var html = '<div class="ycat-head">' +
      '<span class="ycat-title">Kategoriler</span>' +
      '<a class="dropdown-item ycat-all" href="' + base + '/categories">Tümünü gör' + svg(ARROW_RIGHT, 'ycat-svg') + '</a>' +
      '</div>' +
      '<div class="ycat-list">' + renderBranch(categories, { n: 0 }) + '</div>';

    document.querySelectorAll('[id="thecategories"]').forEach(function (h) {
      h.querySelectorAll(':scope > .ycat-head, :scope > .ycat-list, :scope > ul.tree-branch').forEach(function (e) { e.remove(); });
      h.insertAdjacentHTML('beforeend', html);
      h.parentElement.classList.add('ycat-ready');
    });
    markCurrent();
  }

  function load() {
    lastFetch = Date.now();
    fetch(base + '/api/categories', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (data) { render(data.categories || []); })
      .catch(function () {});
  }

  function init() {
    if (!document.querySelector('[id="thecategories"]')) return;
    base = (window.config && window.config.relative_path) || '';
    load();

    // Menü her açıldığında konu sayıları 1 dakikadan eskiyse yenilenir
    document.addEventListener('show.bs.dropdown', function (e) {
      var wrap = e.target.parentElement;
      if (wrap && wrap.querySelector('#thecategories') && Date.now() - lastFetch > 60000) load();
    });

    if (window.jQuery) window.jQuery(window).on('action:ajaxify.end', markCurrent);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Sol menü: Lucide ikonlar, bulunduğun sayfayı gösteren kayan işaret, okunmamış rozetinde tek seferlik zıplama
(function () {
  // Font Awesome ikon adı -> Lucide SVG (lucide-static 1.48.0, ISC lisansı)
  var ICONS = {
    'house': '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    'list': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    'inbox': '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    'tags': '<path d="M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z"/><path d="M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193"/><circle cx="10.5" cy="6.5" r=".5" fill="currentColor"/>',
    'fire': '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>',
    'user': '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    'group': '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>',
    'users': '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>',
    'cogs': '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
    'gears': '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
    'calendar-day': '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
    'calendar': '<path d="M16 14v2.2l1.6 1"/><path d="M16 2v3"/><path d="M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338"/><path d="M3 9h5.859"/><path d="M8 2v3"/><circle cx="16" cy="16" r="6"/>',
    'angles-left': '<path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>'
  };

  function svg(inner) {
    // pathLength="1" yeni seçilen öğenin ikonunun kendini çizmesi için
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner.replace(/<(path|circle|rect|polyline|line)\b/g, '<$1 pathLength="1"') + '</svg>';
  }

  function faName(el) {
    return Array.from(el.classList).map(function (c) { return c.replace(/^fa-/, ''); })
      .filter(function (c) { return ['fa', 'fw', 'solid', 'regular', 'brands'].indexOf(c) === -1; })[0];
  }

  function iconSpan(inner, extra) {
    var s = document.createElement('span');
    s.className = 'ynav-ico' + (extra ? ' ' + extra : '');
    s.innerHTML = svg(inner);
    return s;
  }

  function swapIcons(nav, toggle) {
    nav.querySelectorAll(':scope > li > .nav-link i.fa').forEach(function (i) {
      var name = faName(i);
      if (ICONS[name]) i.replaceWith(iconSpan(ICONS[name]));
    });
    var left = toggle && toggle.querySelector('i.fa-angles-left');
    if (left) {
      left.replaceWith(iconSpan(ICONS['angles-left'], 'ynav-toggle-ico'));
      toggle.classList.add('ynav-toggle');
    }
  }

  function currentLink(nav) {
    var base = (window.config && window.config.relative_path) || '';
    var path = location.pathname.slice(base.length) || '/';
    var tpl = window.ajaxify && window.ajaxify.data && window.ajaxify.data.template && window.ajaxify.data.template.name;
    var holder = nav.querySelector('#thecategories');
    var catsLi = holder && holder.closest('#main-nav > li');
    var cats = catsLi && catsLi.querySelector(':scope > .nav-link');

    // Kategori ve konu sayfalarında "Kategoriler" seçili görünür
    if (cats && (tpl === 'category' || tpl === 'topic' || path === '/categories')) return cats;

    var best = null;
    var bestLen = -1;
    nav.querySelectorAll(':scope > li > a.nav-link').forEach(function (a) {
      var h = (a.getAttribute('href') || '').replace(base, '');
      if (!h || h === '#') return;
      var hit = h === '/' ? path === '/' : (path === h || path.indexOf(h + '/') === 0);
      if (hit && h.length > bestLen) { best = a; bestLen = h.length; }
    });
    return best;
  }

  function place(nav, ind, animate) {
    var a = currentLink(nav);
    nav.querySelectorAll('.ynav-current').forEach(function (x) {
      if (x !== a) x.classList.remove('ynav-current', 'ynav-draw');
    });
    if (!a) {
      ind.classList.remove('is-on');
      return;
    }

    var changed = !a.classList.contains('ynav-current');
    a.classList.add('ynav-current');
    if (changed && animate) {
      a.classList.remove('ynav-draw');
      void a.offsetWidth;
      a.classList.add('ynav-draw');
    }

    var jump = !animate || !ind.classList.contains('is-on');
    if (jump) ind.classList.add('no-anim');
    ind.style.width = a.offsetWidth + 'px';
    ind.style.height = a.offsetHeight + 'px';
    // offsetLeft yerine ekrandaki konum: "Kategoriler" öğesi position:relative olduğu için offsetLeft/Top 0 dönüyor, işaret Ana Sayfa'ya kayıyordu
    var nr = nav.getBoundingClientRect();
    var ar = a.getBoundingClientRect();
    var x = Math.round(ar.left - nr.left - nav.clientLeft + nav.scrollLeft);
    var y = Math.round(ar.top - nr.top - nav.clientTop + nav.scrollTop);
    ind.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    ind.classList.add('is-on');
    if (jump) {
      void ind.offsetWidth;
      ind.classList.remove('no-anim');
    }
  }

  function watchBadges(nav) {
    var seen = new WeakMap();
    nav.querySelectorAll('[component="navigation/count"]').forEach(function (b) {
      seen.set(b, parseInt(b.textContent, 10) || 0);
    });
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        var el = m.target.nodeType === 3 ? m.target.parentElement : m.target;
        var b = el && el.closest && el.closest('[component="navigation/count"]');
        if (!b) return;
        var n = parseInt(b.textContent, 10) || 0;
        if (n > (seen.get(b) || 0)) {
          b.classList.remove('ynav-pop');
          void b.offsetWidth;
          b.classList.add('ynav-pop');
        }
        seen.set(b, n);
      });
    }).observe(nav, { subtree: true, childList: true, characterData: true });
  }

  function init() {
    var nav = document.getElementById('main-nav');
    if (!nav || nav.classList.contains('ynav-ready')) return;

    swapIcons(nav, document.querySelector('.sidebar-left [component="sidebar/toggle"]'));

    var ind = document.createElement('li');
    ind.className = 'ynav-indicator';
    ind.setAttribute('aria-hidden', 'true');
    nav.prepend(ind);
    nav.classList.add('ynav-ready');
    place(nav, ind, false);

    if (window.jQuery) {
      window.jQuery(window).on('action:ajaxify.end', function () { place(nav, ind, true); });
    }
    // Menü daralıp genişlediğinde ya da pencere boyutu değiştiğinde işaret yerini korur
    if (window.ResizeObserver) {
      new ResizeObserver(function () { place(nav, ind, false); }).observe(nav);
    }
    watchBadges(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Akademik takvim: sol menüde "Akademik Takvim"in altında sıradaki önemli tarihi gösterir.
// Kaynak: Yaşar Üniversitesi 2026-2027 Akademik Takvimi (Öğrenci İşleri, 18 Haziran 2026 sürümü), önlisans/lisans sütunu.
// Yeni takvim çıkınca sadece EVENTS listesi güncellenir: [başlangıç, bitiş, başlık]
(function () {
  var EVENTS = [
    ['2026-09-07', '2026-09-18', 'Eğitim ücreti ödemesi'],
    ['2026-09-14', '2026-09-18', 'Ders kayıtları'],
    ['2026-09-21', '2026-09-21', 'Derslerin başlaması'],
    ['2026-09-21', '2026-09-30', 'Ders ekleme-çıkarma'],
    ['2026-10-09', '2026-10-09', 'Dersten çekilme için son gün'],
    ['2026-10-28', '2026-10-29', 'Cumhuriyet Bayramı (ders yok)'],
    ['2026-11-07', '2026-11-07', 'Telafi dersi (28 Ekim programı)'],
    ['2026-11-14', '2026-11-14', 'Telafi dersi (29 Ekim programı)'],
    ['2026-12-25', '2026-12-25', 'Derslerin sona ermesi'],
    ['2026-12-26', '2026-12-30', 'Dönem sonu sınavları'],
    ['2027-01-01', '2027-01-01', 'Yılbaşı tatili'],
    ['2027-01-04', '2027-01-12', 'Dönem sonu sınavları'],
    ['2027-01-14', '2027-01-19', 'Maddi hata başvurusu'],
    ['2027-01-18', '2027-01-29', 'Eğitim ücreti ödemesi'],
    ['2027-01-20', '2027-01-20', 'İki ders sınavı başvurusu için son gün'],
    ['2027-01-25', '2027-01-26', 'İki ders sınavı'],
    ['2027-01-26', '2027-01-29', 'Ders kayıtları'],
    ['2027-02-01', '2027-02-01', 'Derslerin başlaması'],
    ['2027-02-01', '2027-02-10', 'Ders ekleme-çıkarma'],
    ['2027-02-19', '2027-02-19', 'Dersten çekilme için son gün'],
    ['2027-03-08', '2027-03-11', 'Ramazan Bayramı (arife dahil)'],
    ['2027-04-23', '2027-04-23', 'Ulusal Egemenlik ve Çocuk Bayramı'],
    ['2027-05-08', '2027-05-08', 'Telafi dersi (23 Nisan programı)'],
    ['2027-05-14', '2027-05-14', 'Derslerin sona ermesi'],
    ['2027-05-15', '2027-05-19', 'Kurban Bayramı (arife dahil)'],
    ['2027-05-24', '2027-06-06', 'Dönem sonu sınavları'],
    ['2027-06-08', '2027-06-11', 'Maddi hata başvurusu'],
    ['2027-06-14', '2027-06-14', 'İki ders sınavı başvurusu için son gün'],
    ['2027-06-14', '2027-06-15', 'Yaz okulu ders kayıtları'],
    ['2027-06-17', '2027-06-18', 'İki ders sınavı'],
    ['2027-06-21', '2027-06-21', 'Yaz okulu derslerinin başlaması'],
    ['2027-06-30', '2027-07-01', 'Mezuniyet töreni'],
    ['2027-07-15', '2027-07-15', 'Demokrasi ve Milli Birlik Günü'],
    ['2027-07-17', '2027-07-17', 'Yaz okulu telafi dersi (15 Temmuz programı)'],
    ['2027-08-06', '2027-08-06', 'Yaz okulu derslerinin sona ermesi'],
    ['2027-08-09', '2027-08-12', 'Yaz okulu maddi hata başvurusu'],
    ['2027-08-13', '2027-08-13', 'Yaz okulu iki ders sınavı başvurusu için son gün'],
    ['2027-08-16', '2027-08-17', 'Yaz okulu iki ders sınavı'],
    ['2027-08-30', '2027-08-30', 'Zafer Bayramı']
  ];
  var AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  // "…'e kadar" için yönelme hâli, ay adına göre (ünlü uyumu elle doğrulandı)
  var AYLARA = ["Ocak'a", "Şubat'a", "Mart'a", "Nisan'a", "Mayıs'a", "Haziran'a", "Temmuz'a", "Ağustos'a", "Eylül'e", "Ekim'e", "Kasım'a", "Aralık'a"];

  function today() {
    try {
      return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' });
    } catch (e) {
      var d = new Date();
      return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }
  }

  function daysBetween(a, b) {
    return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5);
  }

  function parts(iso) {
    var p = iso.split('-');
    return { d: parseInt(p[2], 10), m: parseInt(p[1], 10) - 1 };
  }

  function when(e) {
    var a = parts(e[0]);
    var b = parts(e[1]);
    if (e[0] === e[1]) return a.d + ' ' + AYLAR[a.m];
    if (a.m === b.m) return a.d + '-' + b.d + ' ' + AYLAR[b.m];
    return a.d + ' ' + AYLAR[a.m] + ' - ' + b.d + ' ' + AYLAR[b.m];
  }

  // Şu an süren olay varsa en erken biteni (eşitlikte en geç başlayanı), yoksa ilk yaklaşan olay
  function next() {
    var t = today();
    var now = EVENTS.filter(function (e) { return e[0] <= t && e[1] >= t; })
      .sort(function (x, y) {
        if (x[1] !== y[1]) return x[1] < y[1] ? -1 : 1;
        return x[0] > y[0] ? -1 : x[0] < y[0] ? 1 : 0;
      })[0];
    if (now) {
      var left = daysBetween(t, now[1]);
      var end = parts(now[1]);
      var meta = now[0] === now[1] ? 'Bugün'
        : left === 0 ? 'Bugün son gün'
          : left === 1 ? 'Yarın son gün'
            : end.d + ' ' + AYLARA[end.m] + ' kadar';
      return { label: now[2], meta: meta, live: true };
    }

    var up = EVENTS.filter(function (e) { return e[0] > t; })
      .sort(function (x, y) { return x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0; })[0];
    if (!up) return null;
    var n = daysBetween(t, up[0]);
    return { label: up[2], meta: when(up) + ' · ' + (n === 1 ? 'yarın' : n + ' gün sonra'), live: false };
  }

  // Süren ve yaklaşan olaylar, başlangıç tarihine göre sıralı
  function upcoming(n) {
    var t = today();
    return EVENTS.filter(function (e) { return e[1] >= t; })
      .sort(function (x, y) { return x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0; })
      .slice(0, n || 6)
      .map(function (e) {
        return { label: e[2], when: when(e), live: e[0] <= t, days: daysBetween(t, e[0]) };
      });
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function renderSidebar() {
    var a = document.querySelector('#main-nav > li > a.nav-link[href$="/akademik-takvim"]');
    var text = a && a.querySelector('.nav-text');
    if (!text) return;
    var old = text.querySelector('.ycal-next');
    if (old) old.remove();
    var e = next();
    if (!e) return;
    text.insertAdjacentHTML('beforeend',
      '<span class="ycal-next' + (e.live ? ' is-live' : '') + '">' +
      '<span class="ycal-label">' + esc(e.label) + '</span>' +
      '<span class="ycal-meta">' + esc(e.meta) + '</span>' +
      '</span>');
    a.setAttribute('title', 'Akademik Takvim: ' + e.label + ' (' + e.meta + ')');
  }

  window.yuTakvim = { next: next, upcoming: upcoming };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSidebar);
  } else {
    renderSidebar();
  }
})();

// Telefon görünümü: iOS tarzı yüzen alt sekme çubuğu ve alttan açılan menü (992px altı)
(function () {
  var ICONS = {
    'house': '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    'layout-grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    'calendar-clock': '<path d="M16 14v2.2l1.6 1"/><path d="M16 2v3"/><path d="M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338"/><path d="M3 9h5.859"/><path d="M8 2v3"/><circle cx="16" cy="16" r="6"/>',
    'bell': '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    'search': '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
    'log-in': '<path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>',
    'log-out': '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
    'menu': '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
    'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
    'inbox': '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    'tags': '<path d="M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z"/><path d="M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193"/><circle cx="10.5" cy="6.5" r=".5" fill="currentColor"/>',
    'flame': '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>',
    'user-round': '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    'users-round': '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>',
    'settings': '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
    'calendar-days': '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
    'message-circle': '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',
    'bookmark': '<path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"/>',
    'sliders-horizontal': '<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'rotate-cw': '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    'moon': '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
    'wifi-off': '<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>'
  };

  // Navigasyon öğelerindeki Font Awesome ikon adı -> Lucide adı
  var FA = {
    'house': 'house', 'list': 'layout-grid', 'inbox': 'inbox', 'tags': 'tags', 'fire': 'flame',
    'user': 'user-round', 'group': 'users-round', 'users': 'users-round', 'cogs': 'settings', 'gears': 'settings',
    'calendar-day': 'calendar-days', 'calendar': 'calendar-clock'
  };
  var MQ = window.matchMedia('(max-width: 991.98px)');
  var THEME_KEY = 'yu-theme';

  // Kayıtlı tema sayfa yüklenir yüklenmez uygulanır (masaüstü dahil); koyu tema kuralları forumun kendi CSS'inde
  // data-bs-theme: Bootstrap'ın kendi koyu modu (yazı, kenarlık, form ve bağlantı renkleri de koyuya geçer)
  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.setAttribute('data-bs-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      root.removeAttribute('data-bs-theme');
    }
  }

  try { applyTheme(localStorage.getItem(THEME_KEY)); } catch (e) {}
  var base = '';
  var user = {};
  var dock, lens, sheet, menuBtn;
  var lastY = 0;
  var ticking = false;

  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML.replace(/"/g, '&quot;');
  }

  function faName(el) {
    if (!el) return '';
    return Array.from(el.classList).map(function (c) { return c.replace(/^fa-/, ''); })
      .filter(function (c) { return ['fa', 'fw', 'solid', 'regular', 'brands', 'lg', 'xs', 'sm', 'xl', '2xs'].indexOf(c) === -1; })[0];
  }

  function loggedIn() {
    return user && parseInt(user.uid, 10) > 0;
  }

  function avatar(cls) {
    if (user.picture) return '<img class="' + cls + '" src="' + esc(user.picture) + '" alt="">';
    return '<span class="' + cls + '" style="background-color:' + esc(user['icon:bgColor']) + '">' + esc(user['icon:text']) + '</span>';
  }

  function tab(key, href, icon, label, badge) {
    return '<a class="yapp-tab" href="' + esc(href) + '" data-key="' + key + '">' +
      '<span class="yapp-ico">' + icon + (badge ? '<span class="yapp-badge" data-badge="' + badge + '" hidden></span>' : '') + '</span>' +
      '<span class="yapp-label">' + label + '</span></a>';
  }

  function buildDock() {
    var html = '<div class="yapp-tabs"><span class="yapp-lens" aria-hidden="true"></span>' +
      tab('home', base + '/', svg('house'), 'Ana Sayfa') +
      tab('categories', base + '/categories', svg('layout-grid'), 'Kategoriler') +
      tab('timetable', base + '/timetable', svg('calendar-clock'), 'Timetable') +
      (loggedIn()
        ? tab('chats', base + '/user/' + encodeURIComponent(user.userslug) + '/chats', svg('message-circle'), 'Mesajlar', 'chats') +
          tab('notifications', base + '/notifications', svg('bell'), 'Bildirimler', 'notifications')
        : tab('login', base + '/login', svg('log-in'), 'Giriş')) +
      '</div>';

    dock = document.createElement('nav');
    dock.className = 'yapp-dock';
    dock.setAttribute('aria-label', 'Ana gezinme');
    dock.innerHTML = html;
    document.body.appendChild(dock);
    lens = dock.querySelector('.yapp-lens');
    // Sekmeye basınca baloncuk sayfanın yüklenmesini beklemeden kayar
    dock.addEventListener('click', function (e) {
      // Küçük hâldeyken dokunmak sayfayı değiştirmez, çubuğu açar
      if (dock.classList.contains('is-mini')) {
        e.preventDefault();
        e.stopPropagation();
        setMini(false);
        return;
      }
      var t = e.target.closest('a.yapp-tab');
      if (t) placeLens(true, t.getAttribute('data-key'));
    });
  }

  // Tema düğmeleri (telefonda sağ üst, masaüstünde başlıkta) aynı simgeyi gösterir
  function themeIcon() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('[data-action="theme"]').forEach(function (btn) {
      btn.innerHTML = svg(dark ? 'sun' : 'moon');
      btn.setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
      btn.setAttribute('title', dark ? 'Açık tema' : 'Koyu tema');
    });
  }

  function toggleTheme() {
    var root = document.documentElement;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.classList.add('yapp-theme-anim');
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    themeIcon();
    setTimeout(function () { root.classList.remove('yapp-theme-anim'); }, 350);
  }

  // Masaüstü: başlıktaki WhatsApp simgesinin yerinde tema düğmesi
  function buildDeskTheme() {
    if (document.querySelector('.yapp-desk-theme')) return;
    var wa = document.getElementById('whatsapp-icon');
    var host = wa ? wa.parentElement : document.querySelector('.brand-container nav');
    if (!host) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'yapp-desk-theme';
    btn.setAttribute('data-action', 'theme');
    if (wa) wa.after(btn);
    else host.appendChild(btn);
    themeIcon();
  }

  // Sağ üst köşe (telefon): tema düğmesi ve profil fotoğrafı (menüyü açar). Başlık sayfalar arasında kalıcı.

  function buildTopActions() {
    var row = document.querySelector('.brand-container > .col-12') || document.querySelector('.brand-container');
    var top = document.createElement('div');
    top.className = 'yapp-top';
    top.innerHTML = '<button type="button" class="yapp-top-btn" data-action="theme"></button>' +
      '<button type="button" class="yapp-top-btn yapp-top-me" data-action="menu" aria-haspopup="dialog" aria-expanded="false" aria-label="Menü">' +
      (loggedIn() ? avatar('yapp-avatar') : svg('menu')) + '</button>';
    if (row) {
      row.appendChild(top);
    } else {
      top.classList.add('is-floating');
      document.body.appendChild(top);
    }

    menuBtn = top.querySelector('[data-action="menu"]');
    menuBtn.addEventListener('click', function () {
      if (sheet && sheet.classList.contains('is-open')) closeSheet();
      else openSheet();
    });

    themeIcon();
  }

  function activeKey() {
    var path = location.pathname.slice(base.length) || '/';
    var tpl = window.ajaxify && window.ajaxify.data && window.ajaxify.data.template && window.ajaxify.data.template.name;
    if (path === '/') return 'home';
    if (path === '/categories' || tpl === 'category' || tpl === 'topic') return 'categories';
    if (path.indexOf('/timetable') === 0) return 'timetable';
    if (path.indexOf('/notifications') === 0) return 'notifications';
    if (tpl === 'chats') return 'chats';
    if (path.indexOf('/login') === 0 || path.indexOf('/register') === 0) return 'login';
    if (path.indexOf('/search') === 0) return '';
    // Menüdeki sayfalar (Okunmamış, Popüler, profil…) "Menü" sekmesini seçili gösterir
    return 'menu';
  }

  // Seçili sekmenin arkasındaki cam baloncuk yeni sekmeye kayar
  function placeLens(animate, forceKey) {
    if (!dock) return;
    var key = forceKey || activeKey();
    // Menüdeki sayfalarda sağ üstteki profil fotoğrafı seçili görünür
    if (menuBtn) menuBtn.classList.toggle('is-active', key === 'menu');
    var t = key && dock.querySelector('.yapp-tab[data-key="' + key + '"]');
    dock.querySelectorAll('.yapp-tab').forEach(function (x) {
      var on = x === t;
      x.classList.toggle('is-active', on);
      if (on) x.setAttribute('aria-current', 'page');
      else x.removeAttribute('aria-current');
    });
    if (!t) {
      lens.classList.remove('is-on');
      return;
    }
    var jump = !animate || !lens.classList.contains('is-on');
    if (jump) lens.classList.add('no-anim');
    lens.style.width = t.offsetWidth + 'px';
    lens.style.transform = 'translateX(' + t.offsetLeft + 'px)';
    lens.classList.add('is-on');
    if (jump) {
      void lens.offsetWidth;
      lens.classList.remove('no-anim');
    }
  }

  // NodeBB 99'u geçince "99+" yazar; bunu 100 sayarız ki rozet de "99+" göstersin
  function countOf(component) {
    var i = document.querySelector('[component="' + component + '"][data-content]');
    var v = i ? String(i.getAttribute('data-content')).trim() : '';
    if (v.indexOf('+') !== -1) return 100;
    return parseInt(v, 10) || 0;
  }

  function syncBadges() {
    if (!dock) return;
    [['notifications', 'notifications/icon'], ['chats', 'chat/icon']].forEach(function (p) {
      var n = countOf(p[1]);
      dock.querySelectorAll('[data-badge="' + p[0] + '"]').forEach(function (b) {
        b.hidden = !n;
        b.textContent = n > 99 ? '99+' : String(n);
      });
    });
  }

  // Aşağı kaydırınca çubuk küçülür, yukarı kaydırınca açılır
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (!dock) return;
      var y = window.scrollY;
      document.documentElement.classList.toggle('yapp-scrolled', y > 4);
      var atEnd = window.innerHeight + y >= document.documentElement.scrollHeight - 80;
      // Aşağı okurken çubuk küçülür (iOS 26 sekme çubuğu gibi); yukarı kaydırınca ya da sayfa sonunda açılır
      if (y > lastY + 6 && y > 120 && !atEnd) setMini(true);
      else if (y < lastY - 6 || y < 60 || atEnd) setMini(false);
      if (Math.abs(y - lastY) > 6) lastY = y;
    });
  }

  // Küçük hâl: sadece seçili sekme, solda küçük cam düğme; okurken ekranın tamamı içeriğe kalır
  function setMini(on) {
    if (!dock || dock.classList.contains('is-mini') === on) return;
    dock.classList.toggle('is-mini', on);
  }

  /* ---------- Menü sayfası ---------- */

  function row(href, icon, title, sub, count) {
    return '<a class="yapp-row" href="' + esc(href) + '">' +
      '<span class="yapp-row-ico">' + icon + '</span>' +
      '<span class="yapp-row-text"><span class="yapp-row-title">' + esc(title) + '</span>' +
      (sub ? '<span class="yapp-row-sub">' + sub + '</span>' : '') + '</span>' +
      (count ? '<span class="yapp-row-count">' + esc(count) + '</span>' : '') +
      '<span class="yapp-chev">' + svg('chevron-right') + '</span></a>';
  }

  function navRows() {
    var skip = ['/', '/categories', '/timetable'];
    var seen = {};
    return Array.from(document.querySelectorAll('.bottombar .navigation-dropdown > li > a.nav-link[href]')).map(function (a) {
      var href = a.getAttribute('href');
      var path = href.slice(base.length) || '/';
      if (href === '#' || skip.indexOf(path) !== -1 || seen[path]) return '';
      seen[path] = true;
      var title = ((a.querySelector('.nav-text') || a).textContent || '').trim();
      var icon = svg(FA[faName(a.querySelector('i.fa'))] || 'chevron-right');
      var cnt = a.querySelector('[component="navigation/count"]');
      var count = cnt && !cnt.classList.contains('hidden') && parseInt(cnt.textContent, 10) ? cnt.textContent.trim() : '';
      var sub = '';
      if (/\/akademik-takvim$/.test(path) && window.yuTakvim) {
        var e = window.yuTakvim.next();
        if (e) sub = (e.live ? '<span class="yapp-live" aria-hidden="true"></span>' : '') + esc(e.label + ' · ' + e.meta);
      }
      return row(href, icon, title, sub, count);
    }).join('');
  }

  function sheetContent() {
    var slug = loggedIn() ? base + '/user/' + encodeURIComponent(user.userslug) : '';
    var html = '<div class="yapp-grabber" aria-hidden="true"></div>' +
      '<form class="yapp-search" action="' + esc(base) + '/search" method="get" role="search">' +
      svg('search') + '<input type="search" name="term" placeholder="Forumda ara" aria-label="Forumda ara" autocomplete="off"></form>';

    if (loggedIn()) {
      html += '<a class="yapp-profile" href="' + esc(slug) + '">' + avatar('yapp-profile-avatar') +
        '<span class="yapp-row-text"><span class="yapp-row-title">' + esc(user.username) + '</span>' +
        '<span class="yapp-row-sub">Profilini gör</span></span><span class="yapp-chev">' + svg('chevron-right') + '</span></a>';
    }

    html += '<div class="yapp-group">' + navRows() + '</div>';

    if (loggedIn()) {
      html += '<div class="yapp-group">' +
        row(slug + '/bookmarks', svg('bookmark'), 'Yer İmleri') +
        row(slug + '/settings', svg('sliders-horizontal'), 'Ayarlar') +
        '</div><div class="yapp-group"><button type="button" class="yapp-row is-danger" data-action="logout">' +
        '<span class="yapp-row-ico">' + svg('log-out') + '</span>' +
        '<span class="yapp-row-text"><span class="yapp-row-title">Çıkış yap</span></span></button></div>';
    } else {
      html += '<div class="yapp-group">' +
        row(base + '/login', svg('log-in'), 'Giriş yap') +
        row(base + '/register', svg('user-plus'), 'Kayıt ol') +
        '</div>';
    }
    return '<div class="yapp-sheet-panel" tabindex="-1">' + html + '</div>';
  }

  function buildSheet() {
    sheet = document.createElement('div');
    sheet.className = 'yapp-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Menü');
    sheet.hidden = true;
    document.body.appendChild(sheet);

    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) return closeSheet();
      if (e.target.closest('[data-action="logout"]')) {
        closeSheet();
        var out = document.querySelector('[component="user/logout"] a, [component="user/logout"] button, a[component="user/logout"]');
        if (out) out.click();
        return;
      }
      if (e.target.closest('a')) closeSheet();
    });
    sheet.addEventListener('submit', function (e) {
      var input = e.target.querySelector('input[name="term"]');
      if (!input || !input.value.trim()) {
        e.preventDefault();
        return;
      }
      if (window.ajaxify) {
        e.preventDefault();
        closeSheet();
        window.ajaxify.go('search?term=' + encodeURIComponent(input.value.trim()) + '&in=titlesposts');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) closeSheet();
    });
    enableDrag();
  }

  function openSheet() {
    sheet.innerHTML = sheetContent();
    sheet.hidden = false;
    document.documentElement.classList.add('yapp-lock');
    menuBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(function () {
      sheet.classList.add('is-open');
      sheet.querySelector('.yapp-sheet-panel').focus({ preventScroll: true });
    });
  }

  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    var panel = sheet.querySelector('.yapp-sheet-panel');
    if (panel) panel.style.transform = '';
    sheet.classList.remove('is-open');
    document.documentElement.classList.remove('yapp-lock');
    menuBtn.setAttribute('aria-expanded', 'false');
    setTimeout(function () {
      if (!sheet.classList.contains('is-open')) sheet.hidden = true;
    }, 320);
  }

  // Menüyü parmakla aşağı çekince kapanır
  function enableDrag() {
    var startY = 0;
    var dy = 0;
    var dragging = false;
    sheet.addEventListener('touchstart', function (e) {
      var panel = e.target.closest('.yapp-sheet-panel');
      if (!panel || panel.scrollTop > 0 || e.target.closest('input')) return;
      dragging = true;
      startY = e.touches[0].clientY;
      dy = 0;
      panel.classList.add('is-dragging');
    }, { passive: true });
    sheet.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      sheet.querySelector('.yapp-sheet-panel').style.transform = 'translateY(' + dy + 'px)';
    }, { passive: true });
    sheet.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      var panel = sheet.querySelector('.yapp-sheet-panel');
      panel.classList.remove('is-dragging');
      if (dy > 90) closeSheet();
      else panel.style.transform = '';
    });
  }

  // Açık sohbet odasında mesaj kutusu en altta; çubuk onun üstüne binmesin (sohbet listesinde görünür)
  function hideOnChats() {
    var d = window.ajaxify && window.ajaxify.data;
    var tpl = d && d.template && d.template.name;
    document.documentElement.classList.toggle('yapp-hidden', tpl === 'chats' && /\/chats\/\d+/.test(location.pathname));
  }

  // NodeBB sohbet odasını sayfa yenilemeden açıp kapatıyor (sadece adres değişiyor); bunu yakalar
  function watchUrl() {
    function onUrl() {
      hideOnChats();
      placeLens(true);
      window.dispatchEvent(new CustomEvent('yapp:url'));
    }
    ['pushState', 'replaceState'].forEach(function (m) {
      var orig = history[m];
      history[m] = function () {
        var r = orig.apply(this, arguments);
        setTimeout(onUrl, 0);
        return r;
      };
    });
    window.addEventListener('popstate', function () { setTimeout(onUrl, 0); });
    if (window.jQuery) window.jQuery(window).on('action:chat.loaded', onUrl);
  }

  // Klavye açılınca görünen alan küçülür; sohbet ekranı bu alana sığar, yazma kutusu klavyenin hemen üstünde kalır
  function trackViewport() {
    var vv = window.visualViewport;
    if (!vv) return;
    function set() {
      var s = document.documentElement.style;
      s.setProperty('--yapp-vvh', Math.round(vv.height) + 'px');
      s.setProperty('--yapp-vvt', Math.round(vv.offsetTop) + 'px');
    }
    vv.addEventListener('resize', set);
    vv.addEventListener('scroll', set);
    set();
  }

  // Yazı yazarken (klavye açıkken) çubuk gizlenir; ekran daralmaz, klavyenin üstüne binmez
  function isField(el) {
    if (!el) return false;
    if (el.tagName === 'TEXTAREA' || el.isContentEditable) return true;
    return el.tagName === 'INPUT' && !/^(checkbox|radio|button|submit|reset|range|file|color|hidden)$/.test(el.type);
  }

  function watchTyping() {
    document.addEventListener('focusin', function (e) {
      if (isField(e.target) && !e.target.closest('.yapp-sheet')) document.documentElement.classList.add('yapp-typing');
    });
    document.addEventListener('focusout', function () {
      setTimeout(function () {
        if (!isField(document.activeElement)) document.documentElement.classList.remove('yapp-typing');
      }, 60);
    });
  }

  // Ana ekrana eklenmiş uygulamada tarayıcının yenileme düğmesi yok: en üstteyken aşağı çekince sayfa yenilenir
  function enablePullToRefresh() {
    var standalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    if (!standalone || !window.ajaxify) return;
    var ind = document.createElement('div');
    ind.className = 'yapp-ptr';
    ind.setAttribute('aria-hidden', 'true');
    ind.innerHTML = svg('rotate-cw');
    document.body.appendChild(ind);
    var LIMIT = 80;
    var startY = null;
    var dist = 0;
    var busy = false;

    function reset() {
      busy = false;
      ind.classList.remove('is-busy', 'is-ready');
      ind.style.transform = '';
      ind.style.opacity = '';
    }

    window.addEventListener('touchstart', function (e) {
      var root = document.documentElement;
      if (busy || window.scrollY > 0 || e.touches.length !== 1 || root.classList.contains('yapp-lock') || root.classList.contains('composing')) {
        startY = null;
        return;
      }
      startY = e.touches[0].clientY;
      dist = 0;
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (startY === null) return;
      if (window.scrollY > 0) {
        startY = null;
        reset();
        return;
      }
      dist = Math.max(0, e.touches[0].clientY - startY);
      var p = Math.min(dist / LIMIT, 1);
      ind.style.opacity = String(p);
      ind.style.transform = 'translate(-50%, ' + Math.round(Math.min(dist, 120) * 0.5) + 'px) rotate(' + Math.round(p * 270) + 'deg)';
      ind.classList.toggle('is-ready', p >= 1);
    }, { passive: true });

    window.addEventListener('touchend', function () {
      if (startY === null) return;
      startY = null;
      if (dist < LIMIT) return reset();
      busy = true;
      ind.classList.add('is-busy');
      window.ajaxify.refresh();
      setTimeout(reset, 8000);
    });

    if (window.jQuery) window.jQuery(window).on('action:ajaxify.end', function () { if (busy) setTimeout(reset, 250); });
  }

  // Uygulama modunda üstteki durum çubuğu temaya uyar
  function syncThemeColor() {
    var m = document.querySelector('meta[name="theme-color"]');
    if (!m) return;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    m.setAttribute('content', dark ? '#202124' : '#f2f4f6');
  }

  function start() {
    if (dock || !MQ.matches || !document.querySelector('.bottombar')) return;
    base = (window.config && window.config.relative_path) || '';
    user = (window.app && window.app.user) || {};

    // Alt çubuk iPhone'un alt çizgisinin üstünde dursun diye güvenli alan açılır
    var vp = document.querySelector('meta[name="viewport"]');
    if (vp && vp.content.indexOf('viewport-fit') === -1) vp.content += ', viewport-fit=cover';

    document.documentElement.classList.add('yapp-on');
    // Saat alanı kutusu normalde Özel Header'da sayfa çizilmeden eklenir; yoksa burada eklenir
    if (!document.getElementById('yapp-statusbar')) {
      var bar = document.createElement('div');
      bar.id = 'yapp-statusbar';
      bar.className = 'yapp-statusbar';
      bar.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(bar, document.body.firstChild);
    }
    buildDock();
    buildTopActions();
    buildSheet();
    placeLens(false);
    syncBadges();

    document.querySelectorAll('[component="notifications/icon"], [component="chat/icon"]').forEach(function (i) {
      new MutationObserver(syncBadges).observe(i, { attributes: true, attributeFilter: ['data-content'] });
    });
    hideOnChats();
    if (window.jQuery) {
      window.jQuery(window).on('action:ajaxify.end', function () {
        hideOnChats();
        placeLens(true);
        setMini(false);
        lastY = window.scrollY;
      });
      window.jQuery(window).on('action:ajaxify.start', closeSheet);
    }
    if (window.ResizeObserver) {
      new ResizeObserver(function () { placeLens(false); }).observe(dock.querySelector('.yapp-tabs'));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    watchTyping();
    watchUrl();
    trackViewport();
    enablePullToRefresh();
    syncThemeColor();
    new MutationObserver(syncThemeColor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // Ekran genişleyip daralınca (tablet döndürme) görünüm açılıp kapanır
  function onMedia() {
    if (MQ.matches) {
      start();
      document.documentElement.classList.add('yapp-on');
    } else {
      document.documentElement.classList.remove('yapp-on');
      closeSheet();
    }
  }

  if (MQ.addEventListener) MQ.addEventListener('change', onMedia);

  // İnternet giderse üstte sade bir uyarı çıkar; bağlantı yokken sayfa değiştirmek bozuk sayfa açmaz.
  // Bağlantı gelince "geri geldi" yazar ve sayfa tazelenir.
  function watchOnline() {
    var bar = document.createElement('div');
    bar.className = 'yapp-offline';
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');
    document.body.appendChild(bar);
    var wasOffline = false;
    var hideTimer = null;

    function show(icon, text, cls) {
      clearTimeout(hideTimer);
      bar.innerHTML = svg(icon) + '<span>' + text + '</span>';
      bar.className = 'yapp-offline is-on' + (cls ? ' ' + cls : '');
    }

    function update() {
      var off = navigator.onLine === false;
      if (off) {
        show('wifi-off', 'İnternet bağlantısı yok');
      } else if (wasOffline) {
        show('check', 'Bağlantı geri geldi', 'is-back');
        hideTimer = setTimeout(function () { bar.className = 'yapp-offline'; }, 2200);
        if (window.ajaxify) window.ajaxify.refresh();
      }
      wasOffline = off;
    }

    // Bağlantı yokken bağlantıya dokunmak sayfayı değiştirmez, uyarı sallanır
    document.addEventListener('click', function (e) {
      if (navigator.onLine !== false) return;
      var a = e.target.closest && e.target.closest('a[href]');
      var href = a && a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target === '_blank' || /^(mailto|tel):/.test(href)) return;
      e.preventDefault();
      e.stopPropagation();
      bar.classList.remove('is-shake');
      void bar.offsetWidth;
      bar.classList.add('is-shake');
    }, true);

    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
  }

  // Tüm tema düğmeleri tek yerden dinlenir
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-action="theme"]')) toggleTheme();
  });

  function init() {
    onMedia();
    buildDeskTheme();
    watchOnline();
    if (window.jQuery) window.jQuery(window).on('action:ajaxify.end', buildDeskTheme);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Telefon sayfaları: Ana Sayfa özeti (sıradaki akademik tarih, son konular akışı), iOS tarzı geri butonu, sayfa sınıfları
(function () {
  var MQ = window.matchMedia('(max-width: 991.98px)');
  var ICONS = {
    'calendar-days': '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'share': '<path d="M12 2v13"/><path d="m16 6-4-4-4 4"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
  };
  var AYLAR_KISA = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML.replace(/"/g, '&quot;');
  }

  // NodeBB başlıkları HTML'e kaçırılmış gönderir; önce çözüp sonra tekrar güvenle kaçırıyoruz
  function decode(s) {
    var t = document.createElement('textarea');
    t.innerHTML = s == null ? '' : String(s);
    return t.value;
  }

  function base() {
    return (window.config && window.config.relative_path) || '';
  }

  function tplName() {
    var d = window.ajaxify && window.ajaxify.data;
    return (d && d.template && d.template.name) || '';
  }

  function path() {
    return location.pathname.slice(base().length) || '/';
  }

  function ago(iso) {
    var t = Date.parse(iso);
    if (!t) return '';
    var s = Math.max(0, (Date.now() - t) / 1000);
    if (s < 60) return 'az önce';
    if (s < 3600) return Math.floor(s / 60) + ' dakika önce';
    if (s < 86400) return Math.floor(s / 3600) + ' saat önce';
    if (s < 7 * 86400) return Math.floor(s / 86400) + ' gün önce';
    var d = new Date(t);
    return d.getDate() + ' ' + AYLAR_KISA[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : '');
  }

  // Ana Sayfa ile Kategoriler aynı şablonu kullanıyor; telefonda adrese göre ayrılır
  function routeClasses() {
    var root = document.documentElement;
    var on = MQ.matches;
    root.classList.toggle('ymob-home', on && tplName() === 'categories' && path() === '/');
    root.classList.toggle('ymob-cats', on && tplName() === 'categories' && path() !== '/');
  }

  function feedRow(t) {
    var c = t.category || {};
    var thumb = t.thumbs && t.thumbs[0] && t.thumbs[0].url;
    var replies = Math.max(0, (parseInt(t.postcount, 10) || 1) - 1);
    var meta = esc(decode(c.name)) + ' · ' + ago(t.lastposttimeISO || t.timestampISO) + (replies ? ' · ' + replies + ' cevap' : '');
    return '<a class="ymob-feed-row' + (t.unread ? ' is-unread' : '') + '" href="' + base() + '/topic/' + esc(t.slug) + '">' +
      '<span class="ymob-feed-ico" style="background-color:' + esc(c.bgColor) + ';color:' + esc(c.color) + ';">' +
      '<i class="fa fa-fw ' + esc(c.icon) + '" aria-hidden="true"></i></span>' +
      '<span class="ymob-feed-text"><span class="ymob-feed-title">' + esc(decode(t.title)) + '</span>' +
      '<span class="ymob-feed-meta">' + meta + '</span></span>' +
      (thumb ? '<img class="ymob-feed-thumb" src="' + esc(thumb) + '" alt="" loading="lazy">' : '') +
      '</a>';
  }

  function renderHome() {
    if (!document.documentElement.classList.contains('ymob-home')) return;
    var area = document.querySelector('#content [data-widget-area="header"]');
    if (!area || document.querySelector('#content .ymob-summary')) return;

    var e = window.yuTakvim && window.yuTakvim.next();
    var top = document.createElement('div');
    top.className = 'ymob-summary';
    if (e) {
      top.innerHTML = '<a class="ymob-cal" href="' + base() + '/akademik-takvim">' +
        '<span class="ymob-cal-ico">' + svg('calendar-days') + '</span>' +
        '<span class="ymob-cal-text"><span class="ymob-cal-kicker">Akademik takvim</span>' +
        '<span class="ymob-cal-title">' + esc(e.label) + '</span>' +
        '<span class="ymob-cal-meta' + (e.live ? ' is-live' : '') + '">' + esc(e.meta) + '</span></span>' +
        '<span class="ymob-chev">' + svg('chevron-right') + '</span></a>';
    }
    addToHomeHint(top);
    area.parentNode.insertBefore(top, area);

    // Liste önce bir önceki açılıştan hemen çizilir, yenisi gelince yerinde güncellenir; ilk açılışta 8 satırlık
    // iskelet yer tutar. Böylece liste sonradan gelip WhatsApp kartını ve sayıları aşağı itmez.
    var key = 'yu-feed-' + ((window.app && app.user && app.user.uid) || 0);
    var cached = '';
    try { cached = localStorage.getItem(key) || ''; } catch (e) {}
    var feed = document.createElement('section');
    feed.className = 'ymob-feed-wrap';
    feed.innerHTML = '<div class="ymob-h"><h2>Son konular</h2><a href="' + base() + '/recent">Tümü</a></div>' +
      (cached ? '<div class="ymob-feed">' + cached + '</div>' :
        '<div class="ymob-feed" aria-busy="true">' + new Array(9).join('<div class="ymob-feed-skel"><span></span><span><i></i><i></i></span></div>') + '</div>');
    area.parentNode.insertBefore(feed, area.nextSibling);

    fetch(base() + '/api/recent', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var list = feed.querySelector('.ymob-feed');
        var rows = (d.topics || []).filter(function (t) { return !t.deleted; }).slice(0, 8).map(feedRow).join('');
        list.removeAttribute('aria-busy');
        list.innerHTML = rows || '<p class="ymob-empty">Henüz konu yok.</p>';
        try { localStorage.setItem(key, rows); } catch (e) {}
      })
      .catch(function () { if (!cached) feed.remove(); });
  }

  // iPhone'da tarayıcıdan açılınca bir kez: "Ana Ekrana Ekle" ile adres çubuğu kalkar, forum tam ekran açılır
  function addToHomeHint(box) {
    var ios = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var standalone = navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    var dismissed = false;
    try { dismissed = localStorage.getItem('yu-a2hs') === '1'; } catch (e) {}
    if (!ios || standalone || dismissed) return;
    var card = document.createElement('div');
    card.className = 'ymob-a2hs';
    card.innerHTML = '<span class="ymob-a2hs-ico">' + svg('share') + '</span>' +
      '<span class="ymob-a2hs-text"><span class="ymob-a2hs-title">Uygulama gibi kullan</span>' +
      '<span class="ymob-a2hs-sub">Safari menüsünde Paylaş’a, ardından “Ana Ekrana Ekle”ye dokun. Adres çubuğu kalkar, forum tam ekran açılır.</span></span>' +
      '<button type="button" class="ymob-a2hs-x" aria-label="Kapat">' + svg('x') + '</button>';
    card.querySelector('.ymob-a2hs-x').addEventListener('click', function () {
      try { localStorage.setItem('yu-a2hs', '1'); } catch (e) {}
      card.remove();
    });
    box.appendChild(card);
  }

  // Başlığı olmayan liste sayfalarına iOS tarzı büyük başlık
  var TITLES = {
    'popular': 'Popüler',
    'unread': 'Okunmamış',
    'recent': 'Son konular',
    'tags': 'Etiketler',
    'users': 'Kullanıcılar',
    'groups/list': 'Gruplar',
    'notifications': 'Bildirimler',
    'search': 'Arama',
    'account/sessions': 'Oturumlar'
  };

  function renderTitle() {
    var old = document.querySelector('#content .ymob-title');
    if (old) old.remove();
    var d = window.ajaxify && window.ajaxify.data;
    var text = TITLES[tplName()];
    if (tplName() === 'tag' && d && d.tag) text = '#' + decode(d.tag);
    if (tplName() === 'chats') text = /\/chats\/\d+/.test(location.pathname) ? '' : 'Sohbetler';
    var content = document.getElementById('content');
    if (!text || !content) return;
    var h = document.createElement('h1');
    h.className = 'ymob-title';
    h.textContent = text;
    var back = content.querySelector('.ymob-back');
    if (back) back.after(h);
    else content.insertBefore(h, content.firstChild);
  }

  // Üstteki breadcrumb yerine iOS tarzı "‹ Önceki sayfa" bağlantısı
  function renderBack() {
    var old = document.querySelector('#content .ymob-back');
    if (old) old.remove();
    var ol = document.querySelector('#content ol.breadcrumb');
    var content = document.getElementById('content');
    var crumbs = window.ajaxify && window.ajaxify.data && window.ajaxify.data.breadcrumbs;
    if (!MQ.matches || !content || !crumbs || crumbs.length < 2) return;
    // Profil ana sayfası kök ekran gibi davranır; geri butonu olmaz
    if (tplName() === 'account/profile') return;

    var parent = crumbs[crumbs.length - 2];
    if (!parent || !parent.url) return;
    var href = new URL(parent.url, location.origin).pathname;
    var isHome = href === base() + '/' || href === base() || href === '/';
    var text = /^\[\[/.test(parent.text || '') ? 'Ana Sayfa' : decode(parent.text);
    if (tplName() === 'category' && isHome) {
      href = base() + '/categories';
      text = 'Kategoriler';
    }

    var a = document.createElement('a');
    a.className = 'ymob-back';
    a.href = href;
    a.innerHTML = svg('chevron-left') + '<span>' + esc(text) + '</span>';
    // Profil alt sayfalarında breadcrumb yok; bağlantı sayfanın en üstüne gelir
    if (ol) ol.parentNode.insertBefore(a, ol);
    else content.insertBefore(a, content.firstChild);
  }

  // Çevirisi eksik kalan metinler
  var FIX = {
    'Shares': 'Paylaşımlar',
    'My Flags': 'Şikayetlerim',
    'Watched tags': 'İzlenen etiketler',
    'Push Notifications': 'Anlık bildirimler'
  };

  function fixTexts() {
    var s = document.querySelector('[component="chat/nav-wrapper"] input.form-control');
    if (s && /search/i.test(s.placeholder)) s.placeholder = 'Sohbetlerde ara';
    // Profil düzenle: "Birleştirmek için buraya tıklayın Google" yerine "Google hesabını bağla"
    document.querySelectorAll('.template-account-edit .account-content .list-group-item > a').forEach(function (a) {
      a.childNodes.forEach(function (n) {
        var m = n.nodeType === 3 && /Birleştirmek için buraya tıklayın\s+(\S[^\n]*)/.exec(n.nodeValue);
        if (m) n.nodeValue = ' ' + m[1].trim() + ' hesabını bağla';
      });
    });
    // Oturumlar: "Chrome 152 on Apple Mac" yerine "Chrome 152 · Apple Mac"
    document.querySelectorAll('[component="user/sessions"] > li').forEach(function (li) {
      li.childNodes.forEach(function (n) {
        if (n.nodeType === 3 && / on /.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(' on ', ' · ');
      });
    });
    // "Message #Genel Sohbet" yerine kısa Türkçe ipucu (oda adına ek gerekmez)
    var ci = document.querySelector('[component="chat/input"]');
    if (ci && /^Message\b/.test(ci.placeholder)) ci.placeholder = 'Mesaj yaz';
    // Grup kartlarında "Created: …" Türkçe olur
    document.querySelectorAll('[component="groups/summary"] .badge').forEach(function (b) {
      b.childNodes.forEach(function (n) {
        if (n.nodeType === 3 && /^\s*Created:/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace('Created:', 'Oluşturuldu:');
      });
    });
    document.querySelectorAll('.account .sticky-md-top a, .notifications .nav a').forEach(function (a) {
      a.querySelectorAll('*').forEach(function (el) {
        var t = (el.childNodes.length === 1 && el.firstChild.nodeType === 3) ? el.firstChild.nodeValue.trim() : '';
        if (FIX[t]) el.firstChild.nodeValue = FIX[t];
      });
    });
  }

  // Sayfada ve menülerde kalan İngilizce ya da garip ifadeler
  var PHRASES = {
    'Forum wide moderators': 'Tüm forumdan sorumlu moderatörler',
    'Üyeler bekleniyor': 'Bekleyenler',
    'Manage Editors': 'Editörleri Yönet',
    'Manage Open Social Web Handles': 'Açık sosyal ağ adreslerini yönet',
    'Read': 'Okunanlar',
    'Shares': 'Paylaşımlar',
    'My Flags': 'Şikayetlerim',
    'Watched tags': 'İzlenen etiketler',
    'Push Notifications': 'Anlık bildirimler',
    // Sistem gruplarının adı değiştirilemiyor; ekranda Türkçe gösterilir
    'administrators': 'Yöneticiler',
    'Administrators': 'Yöneticiler',
    'Global Moderators': 'Genel Moderatörler'
  };

  function fixPhrases(root) {
    if (!root) return;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = tw.nextNode())) {
      var t = n.nodeValue.trim();
      if (t && PHRASES[t]) n.nodeValue = n.nodeValue.replace(t, PHRASES[t]);
    }
  }

  // "Henüz etiket yok." gibi boş liste uyarıları sarı kutu yerine sade boş ekran olur
  function markEmpty() {
    document.querySelectorAll('#content .alert-info, #content .alert-warning').forEach(function (a) {
      var t = a.textContent.trim();
      if (t && t.length < 90 && !a.querySelector('a, button, input')) a.classList.add('ymob-empty');
    });
    // Boş aramada "31 tane “” bulundu" satırı gizlenir
    var term = document.getElementById('search-input');
    var stat = document.querySelector('#advanced-search .card-header');
    if (stat) stat.classList.toggle('ymob-hide', !!term && !term.value.trim());
  }

  // Arama: seçenek kutuları tek satırda yana kayan haplar olur
  function renderSearch() {
    var form = document.querySelector('#advanced-search form');
    if (!form || form.querySelector('.ymob-search-opts')) return;
    var sel = form.querySelectorAll(':scope > select');
    if (!sel.length) return;
    var wrap = document.createElement('div');
    wrap.className = 'ymob-search-opts';
    form.appendChild(wrap);
    sel.forEach(function (x) { wrap.appendChild(x); });
  }

  // Akademik Takvim sayfası: telefonda PDF yerine yaklaşan tarihler listesi
  function renderCalendarPage() {
    var box = document.querySelector('#content .akademik-takvim');
    if (!box || box.querySelector('.ymob-cal-list') || !window.yuTakvim || !window.yuTakvim.upcoming) return;
    var rows = window.yuTakvim.upcoming(8).map(function (e) {
      var meta = e.live ? 'sürüyor' : e.days === 1 ? 'yarın' : e.days + ' gün sonra';
      return '<div class="ymob-cal-row' + (e.live ? ' is-live' : '') + '">' +
        '<span class="ymob-cal-row-title">' + esc(e.label) + '</span>' +
        '<span class="ymob-cal-row-when">' + esc(e.when) + '<br>' + esc(meta) + '</span></div>';
    }).join('');
    if (!rows) return;
    var wrap = document.createElement('section');
    wrap.innerHTML = '<div class="ymob-h"><h2>Yaklaşan tarihler</h2></div><div class="ymob-cal-list">' + rows + '</div>';
    var head = box.firstElementChild;
    box.insertBefore(wrap, head ? head.nextSibling : null);
  }

  // Kullanıcı Ayarları: iOS Ayarlar gibi bölüm kartları ve eksik çeviriler
  var SET_TR = {
    'Disable incoming chat messages': 'Gelen sohbet mesajlarını kapat',
    'Allow chat messages from the following users': 'Şu kullanıcılardan gelen mesajlara izin ver',
    'Deny chat messages from the following users': 'Şu kullanıcılardan gelen mesajları engelle',
    'Unread cutoff (Maximum 14 days)': 'Okunmamış sayılma süresi (en fazla 14 gün)',
    'Topics will be marked read if they have not been updated within this number of days.': 'Bu kadar gün içinde güncellenmeyen konular okunmuş sayılır.',
    'Topics per page': 'Sayfa başına konu',
    'Posts per page': 'Sayfa başına ileti',
    'Hide Read Notifications': 'Okunmuş bildirimleri gizle',
    'Email': 'E-posta',
    'When a topic is posted in a watched category': 'İzlediğiniz bir kategoride yeni konu açıldığında',
    'When a reply is posted in a watched topic': 'İzlediğiniz bir konuya cevap yazıldığında',
    'When a post is edited in a watched topic': 'İzlediğiniz bir konudaki ileti düzenlendiğinde',
    'When you receive a public group chat message': 'Herkese açık bir grup sohbetinde mesaj geldiğinde',
    'When a user requests to join a group you own': 'Sahibi olduğunuz gruba katılma isteği geldiğinde',
    'When someone mentions you': 'Biri sizden bahsettiğinde',
    'When a chat message is flagged': 'Bir sohbet mesajı şikayet edildiğinde'
  };
  var HOME_OPTS = {
    'None': 'Hiçbiri',
    'Categories': 'Kategoriler',
    'World': 'Dünya',
    'Unread': 'Okunmamış',
    'Recent': 'Güncel',
    'Top': 'En iyiler',
    'Popular': 'Popüler',
    'Custom': 'Özel'
  };

  // Ayarlar sayfasında çevirisi eksik metinler (telefon ve masaüstü)
  function translateSettings() {
    if (tplName() !== 'account/settings') return;
    var root = document.querySelector('#content .account-content');
    if (!root) return;
    // Metin parçası düzeyinde: yanında ikon olan etiketler de çevrilir
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var t = node.nodeValue.trim();
      if (SET_TR[t]) node.nodeValue = node.nodeValue.replace(t, SET_TR[t]);
    }
    root.querySelectorAll('select[data-property="homePageRoute"] option').forEach(function (o) {
      var t = o.text.trim();
      if (HOME_OPTS[t]) o.text = HOME_OPTS[t];
    });
    root.querySelectorAll('input[placeholder="Add user"]').forEach(function (i) { i.placeholder = 'Kullanıcı ekle'; });
  }

  function renderSettings() {
    if (tplName() !== 'account/settings') return;
    var root = document.querySelector('#content .account-content');
    if (!root || root.classList.contains('ymob-set-ready')) return;
    root.classList.add('ymob-set-ready');

    // Bölümler <hr> ile ayrılıyor; her bölüm başlığıyla birlikte ayrı bir karta taşınır.
    // Alanlar aynı .account içinde kaldığı için NodeBB'nin kaydetme kodu onları yine bulur.
    root.querySelectorAll('.row > [class*="col-"]').forEach(function (col) {
      // İç içe satırlar ("Artı oy bildiri sıklığı" gibi) kendi kartına bölünmez
      var outer = col.parentElement.closest('[class*="col-"]');
      if (outer && root.contains(outer)) return;
      var card = null;
      Array.from(col.children).forEach(function (el) {
        if (el.tagName === 'HR') {
          card = null;
          el.remove();
          return;
        }
        var isHead = /^H[1-6]$/.test(el.tagName);
        if (isHead || !card) {
          var sec = document.createElement('section');
          sec.className = 'ymob-set';
          card = document.createElement('div');
          card.className = 'ymob-set-card';
          if (isHead) {
            el.classList.add('ymob-set-h');
            sec.appendChild(el);
          }
          sec.appendChild(card);
          col.appendChild(sec);
          if (isHead) return;
        }
        card.appendChild(el);
      });
    });
  }

  function update() {
    routeClasses();
    fixPhrases(document.getElementById('content'));
    translateSettings();
    if (!MQ.matches) return;
    renderHome();
    renderBack();
    renderTitle();
    fixTexts();
    markEmpty();
    renderSearch();
    renderCalendarPage();
    renderSettings();
  }

  if (window.jQuery) window.jQuery(window).on('action:ajaxify.end', update);
  // Sohbet odası sayfa yenilenmeden açılıp kapanınca başlık ve metinler güncellenir
  window.addEventListener('yapp:url', function () {
    if (!MQ.matches) return;
    renderTitle();
    fixTexts();
  });
  // Gönderi "⋮" menüsü açılınca sonradan yüklenir
  if (window.jQuery) {
    window.jQuery(window).on('action:post.tools.load', function () {
      document.querySelectorAll('.dropdown-menu').forEach(fixPhrases);
    });
  }
  if (MQ.addEventListener) MQ.addEventListener('change', update);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();

// Sağ kenar çubuğu: profil kartı, "Yeni konu" düğmesi, arama alanı (⌘K / Ctrl K), okunmamış sayıları ve üstünde kayan zemin
(function () {
  var ICONS = {
    'search': '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
    'bell': '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    'message-circle': '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',
    'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    'square-pen': '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>'
  };

  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  function ico(name, extra) {
    var s = document.createElement('span');
    s.className = 'yrail-ico' + (extra ? ' ' + extra : '');
    s.innerHTML = svg(name);
    return s;
  }

  // Okunmamış sayısı: NodeBB bunu ikonun data-content'ine (taslaklarda metnine) yazar
  // NodeBB 99'u geçince "99+" yazar; bunu 100 sayarız ki rozet de "99+" göstersin
  function readCount(el) {
    if (!el) return 0;
    var v = String(el.hasAttribute('data-content') ? el.getAttribute('data-content') : el.textContent).trim();
    if (v.indexOf('+') !== -1) return 100;
    return parseInt(v, 10) || 0;
  }

  function setCount(pill, n, animate) {
    var old = parseInt(pill.getAttribute('data-n') || '0', 10);
    pill.setAttribute('data-n', n);
    pill.textContent = n > 99 ? '99+' : String(n);
    pill.hidden = n <= 0;
    if (animate && n > old) {
      pill.classList.remove('is-tick');
      void pill.offsetWidth;
      pill.classList.add('is-tick');
      return true;
    }
    return false;
  }

  function addCount(li, source, icon) {
    var link = li.querySelector(':scope > a.nav-link');
    if (!link || !source) return;
    var pill = document.createElement('span');
    pill.className = 'yrail-count';
    pill.setAttribute('aria-hidden', 'true');
    link.appendChild(pill);
    setCount(pill, readCount(source), false);
    new MutationObserver(function () {
      // Yeni bildirim gelince sayı yukarı kayar, zil bir kez sallanır
      if (setCount(pill, readCount(source), true) && icon) {
        icon.classList.remove('is-ring');
        void icon.offsetWidth;
        icon.classList.add('is-ring');
      }
    }).observe(source, { attributes: true, childList: true, characterData: true, subtree: true });
  }

  function build() {
    var rail = document.querySelector('nav.sidebar-right');
    var menu = rail && rail.querySelector('#logged-in-menu');
    if (!menu || menu.classList.contains('yrail-ready')) return;
    menu.classList.add('yrail-ready');
    rail.classList.add('yrail');

    // Profil: ad, altında ne işe yaradığı, çevrimiçiyse yeşil halka
    var me = menu.querySelector('#user_dropdown');
    var name = me && me.querySelector('#user-header-name');
    if (me && name) {
      var box = document.createElement('span');
      box.className = 'yrail-me visible-open';
      name.parentNode.insertBefore(box, name);
      box.appendChild(name);
      box.insertAdjacentHTML('beforeend', '<span class="yrail-me-sub">Profil ve ayarlar</span>');
      me.appendChild(ico('chevron-left', 'yrail-chev visible-open'));
      if (window.app && app.user && app.user.status === 'online') me.classList.add('is-online');
    }

    // Yeni konu: forumun asıl işi, en görünür eylem
    if (window.app && app.user && app.user.uid && typeof app.newTopic === 'function') {
      var li = document.createElement('li');
      li.className = 'nav-item mx-2 yrail-new';
      li.innerHTML = '<button type="button" class="yrail-new-btn" title="Yeni konu aç">' + svg('square-pen') +
        '<span class="visible-open">Yeni konu</span></button>';
      // Varsayılan kategori Genel Sohbet (cid 2). Bir kategorinin içindeysen ve orada konu açabiliyorsan o kategori seçili gelir.
      // Kişi kategoriyi yazı ekranındaki seçiciden değiştirebilir.
      li.querySelector('button').addEventListener('click', function () {
        var d = window.ajaxify && ajaxify.data;
        var here = d && d.template && d.template.name === 'category' && d.privileges && d.privileges['topics:create'] && d.cid;
        app.newTopic({ cid: here || 2 });
      });
      var userLi = menu.querySelector('#user_label');
      if (userLi) userLi.after(li);
      else menu.insertBefore(li, menu.firstChild);
    }

    // Arama bir alan gibi görünür; kısayolu yazar
    var search = menu.querySelector('.search > #search-button');
    if (search) {
      var sIcon = search.querySelector('i.fa');
      if (sIcon) (sIcon.parentElement === search ? sIcon : sIcon.parentElement).replaceWith(ico('search'));
      var kbd = document.createElement('kbd');
      kbd.className = 'yrail-kbd visible-open';
      kbd.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';
      search.appendChild(kbd);
    }

    // Bildirim, sohbet, taslak: Lucide ikonları ve sağda sayı
    [['notifications', 'bell', '[component="notifications/icon"]'],
      ['chats', 'message-circle', '[component="chat/icon"]'],
      ['drafts', 'file-text', '[component="drafts/count"]']].forEach(function (x) {
      var li = menu.querySelector(':scope > li.' + x[0]);
      var link = li && li.querySelector(':scope > a.nav-link');
      if (!link) return;
      // Yeni ikon, NodeBB'nin ikon kutusunun yerine geçer (eski ikon gizli kalır, sayıyı o taşır)
      var icon = ico(x[1]);
      var holder = link.querySelector('.position-relative:has(> i.fa)');
      if (holder) holder.parentNode.insertBefore(icon, holder);
      else link.insertBefore(icon, link.firstElementChild);
      addCount(li, li.querySelector(x[2]), x[0] === 'notifications' ? icon : null);
    });

    // Fareyi takip eden yumuşak zemin (sol çubuktaki gibi)
    var ind = document.createElement('li');
    ind.className = 'yrail-indicator';
    ind.setAttribute('aria-hidden', 'true');
    menu.insertBefore(ind, menu.firstChild);
    menu.addEventListener('mouseover', function (e) {
      var item = e.target.closest && e.target.closest('#logged-in-menu > li.nav-item:not(.yrail-new)');
      if (!item) return;
      var link = item.querySelector(':scope > a.nav-link');
      if (!link) return;
      var jump = !ind.classList.contains('is-on');
      if (jump) ind.classList.add('no-anim');
      ind.style.width = link.offsetWidth + 'px';
      ind.style.height = link.offsetHeight + 'px';
      ind.style.transform = 'translate(' + (item.offsetLeft + link.offsetLeft) + 'px,' + (item.offsetTop + link.offsetTop) + 'px)';
      ind.classList.add('is-on');
      if (jump) {
        void ind.offsetWidth;
        ind.classList.remove('no-anim');
      }
    });
    menu.addEventListener('mouseleave', function () { ind.classList.remove('is-on'); });
  }

  // ⌘K / Ctrl K: aramayı açar
  document.addEventListener('keydown', function (e) {
    if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
    var btn = document.querySelector('nav.sidebar-right #search-button');
    if (!btn || !btn.offsetParent) return;
    e.preventDefault();
    btn.click();
    setTimeout(function () {
      var input = document.querySelector('nav.sidebar-right .search input[type="text"], nav.sidebar-right .search input[name="query"]');
      if (input) input.focus();
    }, 60);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
  if (window.jQuery) window.jQuery(window).on('action:ajaxify.end', build);
})();


// Masaüstü tutarlılık: Ders Programı afişindeki kırık logo forumun kendi logosuyla, WhatsApp'ın yazı-tipi ikonu SVG logoyla değişir
(function () {
  var WA = '<svg class="ywa-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';

  function fix() {
    // Afişin logosu yasaruni.com'dan geliyor ve açılmıyor; yerine forumun kendi logosu
    var logo = document.querySelector('[data-widget-area] .timetable-mui .timetable-logo img');
    var own = document.querySelector('.brand-container img, [component="brand/logo"]');
    if (logo && own && own.src && logo.src !== own.src && !logo.dataset.ymoved) {
      logo.dataset.ymoved = '1';
      logo.alt = 'Yaşar Forum';
      logo.src = own.src;
    }
    // Forumun her yerinde "konu" deniyor; düğme de öyle
    document.querySelectorAll('[component="category/post"]').forEach(function (b) {
      b.childNodes.forEach(function (n) {
        if (n.nodeType === 3 && n.textContent.trim() === 'Yeni Başlık') n.textContent = 'Yeni Konu';
      });
    });
    // Kategori başlığındaki çevrilmemiş ActivityPub satırı
    document.querySelectorAll('.category-header p').forEach(function (p) {
      var t = p.firstChild;
      var m = t && t.nodeType === 3 && t.textContent.match(/This category can be followed from the open social web via the handle (\S+)/);
      if (m) t.textContent = 'Bu kategori, açık sosyal ağda (Mastodon vb.) ' + m[1] + ' adresiyle takip edilebilir. ';
    });
    // WhatsApp: Bootstrap Icons yazı tipi yerine SVG logo (sitedeki diğer ikonlar gibi)
    document.querySelectorAll('.whatsapp-card .card-title > i.bi-whatsapp').forEach(function (i) {
      i.insertAdjacentHTML('afterend', WA);
      i.remove();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fix);
  else fix();
  if (window.jQuery) window.jQuery(window).on('action:ajaxify.end action:widgets.loaded', fix);
})();


// Konu sayfası: çevrilmemiş ya da yanlış çevrilmiş metinler (NodeBB'nin Türkçe dil dosyasında eksik)
(function () {
  var TEXT = {
    'Cevap': 'Yanıtla',
    'Hızlı Yanıt Gönder': 'Gönder',
    'Crosspost Topic': 'Kategoriye ekle',
    'Browsing Users': 'Şu an bakanlar',
    // Dar sağ sütunda kesiliyordu
    'Okunmadı olarak işaretle': 'Okunmadı yap',
    'En eskiden en yeniye': 'Eskiden yeniye',
    'En yeniden en eskiye': 'Yeniden eskiye',
    // Sayıdan sonra çoğul olmaz; "yayımlayıcı" da konuya yazanlar için doğru kelime değil
    'Yayımlayıcılar': 'Katılımcı'
  };
  var ROOTS = '[component="topic/reply/container"], [component="topic/quickreply/container"], ' +
    '.topic-sidebar-tools, [component="thread/sort"], [component="topic/stats"], [component="topic/browsing-users-label"], .pagination-block';

  function fixText(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = walker.nextNode())) {
      var t = n.textContent.trim();
      if (TEXT[t]) {
        n.textContent = n.textContent.replace(t, TEXT[t]);
        continue;
      }
      // Zaman çizelgesi: "Post 3 of 12"
      var m = t.match(/^Post (\d+) of (\d+)$/);
      if (m) n.textContent = 'İleti ' + m[1] + ' / ' + m[2];
    }
  }

  var observer = new MutationObserver(function (muts) {
    muts.forEach(function (mu) {
      var el = mu.target.nodeType === 3 ? mu.target.parentElement : mu.target;
      if (el) fixText(el);
    });
  });

  function run() {
    if (!document.body.classList.contains('page-topic')) return;
    observer.disconnect();
    document.querySelectorAll(ROOTS).forEach(function (root) {
      fixText(root);
      // Zaman çizelgesi kaydırdıkça yeniden yazılır
      if (root.classList.contains('pagination-block')) {
        observer.observe(root, { subtree: true, childList: true, characterData: true });
      }
    });
    var ta = document.querySelector('[component="topic/quickreply/container"] textarea');
    if (ta) ta.placeholder = 'Yanıtınızı yazın… Görselleri sürükleyip bırakabilirsiniz.';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  if (window.jQuery) window.jQuery(window).on('action:ajaxify.end action:posts.loaded', run);
})();


/* Giriş ve kayıt sayfaları gerçek sayfa yüklemesiyle açılsın.
   NodeBB iç linkleri ajaxify ile, sayfayı yeniden yüklemeden açar. O zaman
   tarayıcıların ve şifre yöneticilerinin (Bitwarden vb.) "sayfa yüklenince
   doldur" özelliği hiç tetiklenmez. Eklendi: 2026-09-26. */
(function () {
  var base = (window.config && window.config.relative_path) || '';
  var authPage = /^\/(login|register)\/?$/;
  function isAuth(path) { return authPage.test(path.slice(base.length) || '/'); }
  var landed = location.pathname;

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    // Küçük alt menüye dokunmak önce menüyü açar; o davranış kalsın
    if (a.closest('.yapp-dock.is-mini')) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.origin !== location.origin || !isAuth(u.pathname)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.assign(u.href);
  }, true);

  // Link dışı bir yoldan (ör. oturum düşünce yönlendirme) ajaxify ile gelinirse bir kez tam yükle
  if (window.jQuery) {
    window.jQuery(window).on('action:ajaxify.end', function () {
      if (isAuth(location.pathname) && location.pathname !== landed) location.reload();
    });
  }
})();


// Timetable sayfasında kenar çubukları kapalı başlar: uygulama geniş alana ihtiyaç duyuyor.
// Sadece görünüm değişir, kullanıcının kayıtlı "açık kenar çubukları" ayarına dokunulmaz; sayfadan çıkınca eski hâline döner.
// Kullanıcı timetable'dayken çubukları kendisi açıp kaparsa (Harmony bunu kaydeder) artık onun seçimi geçerlidir.
(function () {
  var restore = null;

  function onTimetable() {
    return !!(window.ajaxify && ajaxify.data && ajaxify.data.template && ajaxify.data.template.timetable);
  }

  function apply() {
    var bars = document.querySelectorAll('nav.sidebar-left, nav.sidebar-right');
    if (!bars.length) return;
    if (onTimetable()) {
      if (restore === null) restore = bars[0].classList.contains('open');
      bars.forEach(function (b) { b.classList.remove('open'); });
    } else if (restore !== null) {
      if (restore) bars.forEach(function (b) { b.classList.add('open'); });
      restore = null;
    }
  }

  apply();
  if (window.jQuery) {
    window.jQuery(window).on('action:ajaxify.end', apply);
    window.jQuery(document).on('click', '[component="sidebar/toggle"]', function () {
      if (onTimetable()) restore = null;
    });
  }
})();
