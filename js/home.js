// Function creating app element's home page content

function createHomePage() {
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  document.title = 'Samsung';
  createSlider();
  createQuickMenu();
  createSections();
  createCartPage();
  createSearch();
}

// Create header

function createHeader() {
  let data = domData.headerData,
    tempLi = '',
    tempUl = '',
    tempUlB = '',
    tempAll = '',
    tempAllB = '';

  data.forEach((el) => {
    el.series.forEach((ser) => {
      if (ser === 'book') {
        el.seriesName = 'galaxy';
      }
      tempLi += `
                <li>
                <a href="/" data-type="${el.name}" data-series="${ser}">${el.seriesName} ${ser}</a>
                </li>
        `;
    });

    tempUl = `
       <li class ="main-li">
            <a href="/" class="main-link">${el.name}s</a>
            <div class="menu">
            <ul>
                <li>
                <a href="/" data-type="${el.name}" data-series="all">all ${el.name}s</a>
                </li>
                ${tempLi}
            </ul>
            <div class="img-all">
            <img src="${el.img}" alt="${el.name}" />
            </div>
        </div>
    </li>
    `;
    tempUlB = `
          <div>
            <label for="burger-${el.name}">
              <h3 class="text">${el.name}s</h3>
              <input type="checkbox" class="burger-checkbox" id="burger-${el.name}" />
              <div class="burger-menu-list">
                <ul>
                  <li>
                    <a href="/" data-type="${el.name}" data-series="all">all ${el.name}s</a>
                  </li>
                  ${tempLi}
                </ul>
              </div>
            </label>
        </div>
    `;
    tempLi = '';
    tempAll += tempUl;
    tempAllB += tempUlB;
    tempUL = '';
    tempUlB = '';
  });

  header.innerHTML = `
         <nav class="nav-bar flex just-bet">
        <div class="logo">
          <a href="/"><img src="./img/global-samsung-logo.svg" alt="logo" /></a>
        </div>
        <div class="main-nav flex">
            <ul class="flex main-ul">
                ${tempAll}
            </ul>
          <div class="blank"></div>
        </div>
        <div class="right-nav flex just-bet">
          <a id="nav-search" href="/">
            <img src="./img/search.svg" alt="search" />
          </a>
          <a id="nav-cart" href="/">
            <img src="./img/cart.svg" alt="cart" />
            <span class="cart-num display-none"></span>
          </a>
          <!-- <a id="nav-user" href="/">
         
            <img src="./img/user.svg" alt="user" />
          </a> -->
           <a id="nav-burger" href="/">
            &equiv;
          </a>
        </div>
      </nav>
    `;

  burgerMenu.innerHTML = `
      <div class="burger-close">
        <a href="/"> &#215; </a>
      </div>
      <div class="burger-menu-wrap">
        ${tempAllB}
      </div>
  `;

  header.append(burgerMenu);

  let mainLinks = document.querySelectorAll('.main-link'),
    logoLink = document.querySelector('.logo'),
    searchLink = document.getElementById('nav-search'),
    cartLink = document.getElementById('nav-cart'),
    burgerLink = document.getElementById('nav-burger'),
    menu = document.querySelectorAll('.menu'),
    burgerMenuLinks = burgerMenu.querySelectorAll('.burger-menu-list ul li a'),
    burgerClose = burgerMenu.querySelector('.burger-close'),
    burgerChecks = burgerMenu.querySelectorAll('.burger-checkbox');

  logoLink.addEventListener('click', (e) => {
    let pageData = {
      type: 'home',
      series: 'home',
    };
    history.pushState(pageData, '', '');
    createHomePage();
    e.preventDefault();
  });

  mainLinks.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });

  menu.forEach((el) => {
    el.addEventListener('click', openLinks);
  });

  cartLink.addEventListener('click', (e) => {
    cartPageToggle();
    e.preventDefault();
  });

  searchLink.addEventListener('click', (e) => {
    if (form.classList.contains('form-on')) {
      form.querySelector('#search-input').focus();
    } else {
      form.classList.toggle('display-none');
      form.classList.toggle('flex');
      form.querySelector('#search-input').value = '';
    }
    e.preventDefault();
  });

  burgerLink.addEventListener('click', (e) => {
    burgerClose.removeAttribute('style');

    document.body.classList.add('overflow-h');
    burgerMenu.classList.remove('c-hide');

    burgerMenu.classList.add('c-show');
    e.preventDefault();
  });

  burgerClose.addEventListener('click', (e) => {
    burgerClose.style.opacity = '0';
    document.body.classList.remove('overflow-h');

    burgerMenu.classList.remove('c-show');
    burgerMenu.classList.add('c-hide');

    burgerChecks.forEach((check) => {
      check.checked = false;
    });

    e.preventDefault();
  });

  form.addEventListener('submit', (e) => {
    let value = document.getElementById('search-input').value;
    let sErorr = document.querySelector('.s-error');
    if (cartPage.classList.contains('c-show')) {
      cartPageToggle();
    }
    if (value) {
      let newValue = value.toLowerCase().trim();
      if (newValue.length > 2) {
        let pageData = {
          type: 'search',
          series: newValue,
        };
        history.pushState(pageData, '', '');
        if (app.querySelector('#product-list')) {
          let gif = document.createElement('img');
          let timeout;
          clearTimeout(timeout);

          productList.classList.add('list-loading');
          gif.setAttribute('src', './img/giphy.webp');
          gif.setAttribute('alt', 'loading gif');
          gif.className = 'gif';

          productList.classList.add('no-data-list');

          productList.append(gif);

          timeout = setTimeout(() => {
            productList.classList.remove('list-loading');

            gif.remove();
            search(newValue);
          }, 500);
        } else {
          search(newValue);
        }
      } else {
        sErorr.textContent = 'key word must be at least 3 characters long';
        setTimeout(() => {
          sErorr.textContent = '';
        }, 3000);
      }
    }
    e.preventDefault();
  });

  burgerMenuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      burgerChecks.forEach((check) => {
        check.checked = false;
      });
      openLinks(e);

      burgerMenu.classList.remove('c-show');
      burgerMenu.classList.add('c-hide');
      document.body.classList.remove('overflow-h');
    });
  });
}

// Create footer

function createFooter() {
  footerSection.innerHTML = `
      <div class="footer-left">
        <ul>
          <li><a href="/" data-type="mobile" data-series="all">Mobiles</a></li>
          <li><a href="/" data-type="tablet" data-series="all">Tablets</a></li>
          <li><a href="/" data-type="laptop" data-series="all">Laptops</a></li>
        </ul>
      </div>
      <div class="footer-right">
        <a href="/">Cart</a>
      </div>
      <div class="bottom">&copy; 2021 SAMSUNG All Rights Reserved.</div>
  `;
  footer.append(footerSection);

  let footerLinks = footerSection.querySelectorAll('.footer-left a');
  footerLinks.forEach((fLink) => {
    fLink.addEventListener('click', (e) => {
      openLinks(e);
      document.body.classList.add('height-a');
      scroll(0, productList.offsetTop);
      document.body.classList.remove('height-a');
    });
  });

  let footerCart = footerSection.querySelector('.footer-right a');
  footerCart.addEventListener('click', (e) => {
    if (cartPage.classList.contains('c-hide')) {
      cartPageToggle();
      document.body.classList.add('height-a');
      scroll(0, header.offsetTop);
      document.body.classList.remove('height-a');
    }
    e.preventDefault();
  });
}

// Create quick menus

function createQuickMenu() {
  let data = domData.menu;
  let innerTemp = '';

  data.forEach((el) => {
    innerTemp += `
      
        <div class="q-menu-box" data-type="${el.type}" data-series="${el.series}">
          <div class="q-img-box" data-type="${el.type}" data-series="${el.series}">
            <img src="${el.img}" alt="photo" />
          </div>
          <h4>${el.text}</h4>
          <button class="btn">Buy now</button>
        </div>`;
  });
  qMenu.innerHTML = `
      <div class="q-menu-heading">
        <h2>Shop our newest offers and innovations</h2>
        <h3>Smartphones & Computing</h3>
      </div>
      <div class="q-menu-items">
        ${innerTemp}
      </div>
   `;
  homeSection.append(qMenu);
  app.append(homeSection);

  let menuBoxes = qMenu.querySelectorAll('.q-menu-box');
  menuBoxes.forEach((menuB) => {
    menuB.addEventListener('click', (e) => {
      openLinks(e);
      document.body.classList.add('height-a');
      scroll(0, productList.offsetTop);
      document.body.classList.remove('height-a');
    });
  });
}

// Create product sections

function createSections() {
  let data = domData.section;

  let temp = '';

  data.forEach((el) => {
    let divTemp = '';
    let ulTemp = '';
    let len = el.product.length - 1;
    let underline = '';
    let pos = '';
    let cls = '';
    let center = '';
    el.product.forEach((it, ind) => {
      if (ind === 0) {
        underline = 'class = "li-underline"';
        pos = 'first';
        cls = 'item-left item-active';
        textClass = '';
      } else if (ind === len) {
        underline = '';
        pos = 'last';
        cls = 'item-right';
        center = '';
        textClass = 'box-text-right';
      } else {
        underline = '';
        pos = 'center';
        cls = 'item-right';
        center = 'data-position="center"';
        textClass = 'box-text-right';
      }

      ulTemp += `
        <li data-series="${it.series}" data-position="${pos}" ${underline}>
          ${it.name}
        </li>
    `;
      divTemp += `
        <div data-series="${it.series}" ${center} class="sec-item ${cls}">
          <div class="p-img-box">
            <img class="p-img" src="${it.img}" alt="photo" />
          </div>
          <div class="p-text-box ${textClass}">  
            <h3>${it.headText}</h3>
            <button class="btn" data-type="${it.type}" data-series="${it.series}">buy now</button>
          </div>  
        </div>
    `;
    });

    temp += `
    <section id="${el.secText}" class="section">
      <h2 class="section-heading">${el.secText}s</h2>
      <ul class="flex p-ul">
        ${ulTemp}
      </ul>
      <div class="item-box flex">
        ${divTemp}
      </div>
    </section>
  `;
  });

  sectionBox.innerHTML = temp;
  homeSection.append(sectionBox);

  let pBox = sectionBox.querySelectorAll('.p-text-box button');
  pBox.forEach((box) => {
    box.addEventListener('click', (e) => {
      openLinks(e);
      document.body.classList.add('height-a');
      scroll(0, productList.offsetTop);
      document.body.classList.remove('height-a');
    });
  });

  let sections = document.querySelectorAll('.section');

  sections.forEach((section) => {
    let items = section.querySelectorAll('.item-box .sec-item');
    let centerItem = section.querySelector('.item-box [data-position]');
    let listItems = section.querySelectorAll('li');
    listItems.forEach((li) => {
      li.addEventListener('click', () => {
        let series = li.dataset.series;
        listItems.forEach((el) => {
          el.classList.remove('li-underline');
        });

        li.classList.add('li-underline');

        items.forEach((item) => {
          if (series === item.dataset.series) {
            item.querySelector('.p-text-box').classList.remove('box-text-right');
            item.querySelector('.p-text-box').classList.remove('box-text-left');

            item.classList.add('item-active');
          } else {
            if (centerItem && li.dataset.position === 'first') {
              centerItem.className = 'sec-item item-right';
              centerItem.querySelector('.p-text-box').className = 'p-text-box box-text-right';
            } else if (centerItem && li.dataset.position === 'last') {
              centerItem.className = 'sec-item item-left';
              centerItem.querySelector('.p-text-box').className = 'p-text-box box-text-left';
            }

            item.classList.remove('item-active');
            if (!item.previousElementSibling) {
              item.querySelector('.p-text-box').classList.add('box-text-left');
            } else {
              item.querySelector('.p-text-box').classList.add('box-text-right');
            }
          }
        });
      });
    });
  });
}

function openLinks(e) {
  let type = e.target.dataset.type || e.target.parentElement.dataset.type;
  let series = e.target.dataset.series || e.target.parentElement.dataset.series;
  if (type && series) {
    let pageData = {
      type,
      series,
    };
    history.pushState(pageData, '', '');

    createProductPage(type, series);
    if (cartPage.classList.contains('c-show')) {
      cartPageToggle();
    }
    searchHide();
    let mainUl = document.querySelector('.main-nav > ul');

    mainUl.classList.add('display-none');

    setTimeout(() => {
      mainUl.classList.remove('display-none');
    }, 140);
  }
  e.preventDefault();
}

// Create search form

function createSearch() {
  form.className = 'display-none just-center flex-col form-off';
  form.innerHTML = `
    <div class="just-center">
      <input type="search" id="search-input" />
      <input class="search-button" type="submit" value="Search" />
    </div>
    <div>
      <p class="s-error"></p>
    </div>
  
  `;
  app.append(form);
}

function search(value) {
  document.title = 'Samsung | Search';
  if (form.classList.contains('display-none')) {
    form.classList.remove('display-none');
    form.classList.add('flex');
  }
  form.classList.remove('form-off');
  form.classList.add('form-on');
  let data = [];
  for (i in productData) {
    productData[i].forEach((el) => {
      if (el.name.toLowerCase().includes(value)) {
        data.push(el);
      }
    });
  }

  slide.remove();
  homeSection.remove();

  if (!app.querySelector('#list-header')) {
    addHeaderFilter('search', data);
  } else {
    val = listHeader.querySelector('.header-filter-text').dataset.value;
    txt = listHeader.querySelector('.header-filter-text').textContent;
    addHeaderFilter('search', data, val, txt);
  }

  addSideFilter('search', 'all', data);
  productSort(data, 'all');
  if (data.length === 0) {
    productList.classList.add('no-data-list');
    productList.innerHTML = `
      <h1 data-value="no-data" class="no-data">No products found with key word(s): <span class="no-search-data">"${value}"</span></h1>
     `;
  }
}

function searchHide() {
  if (form.classList.contains('form-on')) {
    form.classList.remove('form-on');
    form.classList.add('form-off');
    form.classList.remove('flex');
    form.classList.add('display-none');
  } else if (form.classList.contains('flex')) {
    form.classList.remove('flex');
    form.classList.add('display-none');
  }
}

//Create slides

function createSlides(data, slideGroup, tiles) {
  data.forEach((el, ind, arr) => {
    let classTemp;
    let btnClass;
    let len = arr.length - 1;
    if (ind === 0) {
      classTemp = 'slide-active';
    } else if (ind < len) {
      classTemp = 'slide-next';
    } else {
      classTemp = 'slide-last';
    }
    if (el.textColor === 'white') {
      btnClass = 'btn-black';
    } else {
      btnClass = 'btn-white';
    }

    let temp = `
    <div class="slide-content ${classTemp}" data-slide-number="${ind}" style="color: ${el.textColor}; background: url(${el.url}) bottom/cover">
      <h1 class="slide-heading">${el.headingText}</h1>
      <p class="slide-text">${el.mainText}</p>
      <button class="slide-button btn ${btnClass}" data-type="${el.type}" data-series="${el.series}">${el.buttonText}</button>
    </div>
    `;
    slideGroup.innerHTML += temp;

    let tile = document.createElement('div');

    tile.title = el.headingText;
    tile.className = 'slide-tile';

    tile.setAttribute('data-slide-number', `${ind}`);

    tiles.append(tile);
  });
}

//Create slider

function createSlider() {
  while (slide.firstChild) {
    slide.removeChild(slide.firstChild);
  }
  slide.className = 'slide-height';
  app.append(slide);
  let time = 5000;

  let data = domData.slider;

  let slideGroup = document.createElement('div');
  slideGroup.className = 'slide-group';

  let tiles = document.createElement('div');
  tiles.className = 'tiles';

  createSlides(data, slideGroup, tiles);
  slide.append(slideGroup, tiles);

  let leftBtn = document.createElement('div');
  let rightBtn = document.createElement('div');
  leftBtn.className = 'left-btn slide-btn';
  rightBtn.className = 'right-btn slide-btn';
  leftBtn.innerHTML = '&#10094;';
  rightBtn.innerHTML = '&#10095;';
  slide.append(leftBtn, rightBtn);

  let allSlides = document.querySelectorAll('.slide-content');
  clearTimeout(fTimer);
  nextSlide();

  leftBtn.addEventListener('click', () => {
    clearTimeout(fTimer);
    allSlides.forEach((el) => {
      if (el.classList.contains('slide-active')) {
        el.classList.remove('slide-active');
        el.classList.add('slide-next');
      } else if (el.classList.contains('slide-last')) {
        el.classList.remove('slide-last');
        el.classList.add('slide-active');
      } else {
        el.classList.remove('slide-next');
        el.classList.add('slide-last');
      }
    });

    nextSlide();
  });
  function forward() {
    clearTimeout(fTimer);
    allSlides.forEach((el) => {
      if (el.classList.contains('slide-active')) {
        el.classList.remove('slide-active');
        el.classList.add('slide-last');
      } else if (el.classList.contains('slide-next')) {
        el.classList.remove('slide-next');
        el.classList.add('slide-active');
      } else {
        el.classList.remove('slide-last');
        el.classList.add('slide-next');
      }
    });
    nextSlide();
  }

  rightBtn.addEventListener('click', forward);

  function nextSlide() {
    fTimer = setTimeout(() => {
      allSlides = document.querySelectorAll('.slide-content');
      if (allSlides.length) {
        forward();
      }
    }, time);
  }

  let tileList = tiles.querySelectorAll('div');
  tileList.forEach((tile) => {
    tile.addEventListener('click', () => {
      clearTimeout(fTimer);
      let num = parseInt(tile.dataset.slideNumber);
      let actSlide = slideGroup.querySelector(`[data-slide-number="${num}"]`);

      if (!actSlide.classList.contains('slide-active')) {
        actSlide.className = 'slide-content slide-active';
        if (num === 0) {
          actSlide.nextElementSibling.className = 'slide-content slide-next';
          actSlide.nextElementSibling.nextElementSibling.className = 'slide-content slide-last';
        } else if (num === 1) {
          actSlide.nextElementSibling.className = 'slide-content slide-next';
          actSlide.previousElementSibling.className = 'slide-content slide-last';
        } else {
          actSlide.previousElementSibling.previousElementSibling.className = 'slide-content slide-next';
          actSlide.previousElementSibling.className = 'slide-content slide-last';
        }
      }
      nextSlide();
    });
  });

  let slideButtons = slide.querySelectorAll('.slide-button');
  slideButtons.forEach((button) => {
    button.addEventListener('click', openLinks);
  });
}
