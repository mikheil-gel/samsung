// Create header filter

function addHeaderFilter(type, searchData, defVal = 'feat', defText = 'featured') {
  app.append(mainList);
  listHeader.innerHTML = '';

  listHeader.innerHTML = `
      <div class="header-filter-group flex">
        <div id="header-filter" class="flex">
          <h3 class="header-filter-heading">sort by:</h3>
          <span class="header-filter-wrap">
            <span class="header-filter-text" data-value="${defVal}">${defText}</span>
            <ul class="header-filter-items display-none">
              <li data-value="feat">featured</li>
              <li data-value="asc">price $ &nearr;</li>
              <li data-value="des">price $ &#8600;</li>
            </ul>
          </span>
        </div>
      </div>  
      `;
  mainList.append(listHeader);

  listHeader.querySelectorAll('.header-filter-items li').forEach((el) => {
    if (el.dataset.value === defVal) {
      el.classList.add('active-item');
    }
  });
  headerFilterUpdate(type, searchData);
}

function headerFilterUpdate(type, searchData) {
  let headerLi = document.querySelectorAll('.header-filter-items li');
  let headerUl = document.querySelector('.header-filter-items');
  let headerF = document.querySelector('#header-filter');
  let spanText = document.querySelector('.header-filter-text');

  headerF.addEventListener('click', (e) => {
    headerUl.classList.toggle('display-none');
    document.body.addEventListener('click', hideHeaderFilter);

    e.stopPropagation();
  });

  function hideHeaderFilter() {
    if (!headerUl.classList.contains('display-none')) {
      headerUl.classList.add('display-none');
    }
    document.body.removeEventListener('click', hideHeaderFilter);
  }

  headerLi.forEach((li) => {
    li.addEventListener('click', (e) => {
      let item = e.target;
      if (spanText.dataset.value !== item.dataset.value) {
        spanText.textContent = item.textContent;
        spanText.dataset.value = item.dataset.value;

        headerLi.forEach((el) => {
          if (el.classList.contains('active-item')) {
            el.classList.remove('active-item');
          }
        });

        if (productList.children.length > 1) {
          filterPageData(type, searchData);
        }

        item.classList.add('active-item');
      }
    });
  });
}

// Create side filter

function addSideFilter(type, series, searchData) {
  mainList.append(sideFilter);
  sideFilter.innerHTML = '';
  let data = domData.productFilterData;

  data[type].forEach((el) => {
    addFilterGroup(type, el.groupName, el.typeList, el.textHeading, el.preText, el.afText);
  });

  if (series === 'all') {
    let seriesInputs = document.querySelectorAll('.series-filter-container .wrap-box input');

    seriesInputs.forEach((el) => {
      el.checked = true;
    });
  } else {
    document.querySelector(`#series-filter-${series}`).checked = true;
  }

  let allInputs = document.querySelectorAll('#side-filter .wrap-box input');

  allInputs.forEach((el) => {
    el.addEventListener('change', () => {
      filterPageData(type, searchData);
    });
  });
}

function createCheckedInputs(type, checkedInputs) {
  if (type === 'search') {
    checkedInputs.type = [];
  } else {
    checkedInputs.range = [];
    checkedInputs.series = [];
    checkedInputs.storage = [];
    if (type !== 'mobile') {
      checkedInputs.screen = [];
    }
    if (type === 'laptop') {
      checkedInputs.memory = [];
    }
  }
}

function filterPageData(type, searchData) {
  let checkedInputs = {};
  let allInputs = document.querySelectorAll('#side-filter .wrap-box input');

  createCheckedInputs(type, checkedInputs);
  allInputs.forEach((input) => {
    if (input.checked) {
      checkedInputs[input.dataset.type].push(input.value);
    }
  });

  filterPage(type, checkedInputs, searchData);
}

function filterPage(type, checkedInputs, searchData) {
  if (searchData) {
    if (searchData.length === 0) {
      let value = productList.querySelector('.no-search-data').textContent;
      productList.classList.add('no-data-list');
      productList.innerHTML = `
      <h1 data-value="no-data" class="no-data">No products found with key word(s): <span class="no-search-data">${value}</span></h1>
     `;
    } else {
      let finData = [];

      if (checkedInputs.type) {
        checkedInputs.type.forEach((inp) => {
          searchData.forEach((el) => {
            if (el.type === inp) {
              finData.push(el);
            }
          });
        });

        if (checkedInputs.type.length) {
          if (finData.length) {
            loadingDataGif(finData, 'all');
          } else {
            loadingDataGif(undefined, 'product');
          }
        } else {
          loadingDataGif(searchData, 'all');
        }
      }
    }
  } else {
    let data = productData[type];

    let dataRange = getModels(checkedInputs, 'range', data);
    let dataSeries = getModels(checkedInputs, 'series', data);
    let dataStorage = getModels(checkedInputs, 'storage', data);
    let dataScreen = getModels(checkedInputs, 'screen', data);
    let dataMemory = getModels(checkedInputs, 'memory', data);
    let alldata = [dataRange, dataSeries, dataStorage, dataScreen, dataMemory];
    let startData = [];

    let midData = [];
    let finData = [];

    allModels(alldata, startData);

    if (startData.length == 1) {
      midData = [...startData[0]];
    } else if (startData.length > 1) {
      let n = startData.length;
      if (n == 2) {
        startData[0].forEach((el) => {
          if (startData[1].includes(el)) {
            midData.push(el);
          }
        });
      } else if (n == 3) {
        startData[0].forEach((el) => {
          if (startData[1].includes(el) && startData[2].includes(el)) {
            midData.push(el);
          }
        });
      } else if (n == 4) {
        startData[0].forEach((el) => {
          if (startData[1].includes(el) && startData[2].includes(el) && startData[3].includes(el)) {
            midData.push(el);
          }
        });
      } else if (n == 5) {
        startData[0].forEach((el) => {
          if (
            startData[1].includes(el) &&
            startData[2].includes(el) &&
            startData[3].includes(el) &&
            startData[4].includes(el)
          ) {
            midData.push(el);
          }
        });
      }
    }

    data.forEach((item) => {
      if (midData.includes(item.model)) {
        finData.push(item);
      }
    });

    if (cartPage.classList.contains('c-show')) {
      cartPageToggle();
    }

    if (finData.length > 0) {
      loadingDataGif(finData);
    } else if (finData.length == 0 && startData.length) {
      loadingDataGif(undefined, type);
    } else {
      loadingDataGif(data);
    }
  }
}

function loadingDataGif(data, type) {
  let gif = document.createElement('img');
  let timeout;
  clearTimeout(timeout);

  productList.classList.add('list-loading');
  gif.setAttribute('src', './img/giphy.webp');
  gif.setAttribute('alt', 'loading gif');
  gif.className = 'gif';

  productList.append(gif);

  timeout = setTimeout(() => {
    productList.classList.remove('list-loading');

    gif.remove();

    if (data) {
      productSort(data, 'all');
    } else {
      productList.classList.add('no-data-list');
      productList.innerHTML = `
      <h1 data-value="no-data" class="no-data">No ${type}s found with this specifications</h1>
     `;
    }
  }, 500);
}

function getModels(input, type, data) {
  let output = [];
  if (input[type] && input[type].length > 0) {
    data.forEach((el) => {
      if (input[type].includes(el[type])) {
        output.push(el.model);
      }
    });
  }
  return output;
}

function allModels(data, outdata) {
  data.forEach((el) => {
    if (el.length > 0) {
      outdata.push(el);
    }
  });
}

function addFilterGroup(type, groupName, typeList, textHeading, preText = '', afText = '') {
  let innerTemp = '';
  if (groupName === 'range') {
    let n = typeList.length;
    for (let i = 0; i < n; i++) {
      innerTemp += `
        <div>
          <label for="${groupName}-filter-${typeList[i][0]}">
            <input
              type="checkbox"
              data-product ="${type}"
              data-type ="${groupName}"
              class="filter-checkbox"
              id="${groupName}-filter-${typeList[i][0]}"
              value="${typeList[i][0]}-${typeList[i][1]}"
            />
            <span class="span-box"></span><span class="span-text">$${typeList[i][0]} - $${typeList[i][1]}</span>
          </label>
        </div>
      `;
    }
  } else {
    let n = typeList.length;
    for (let i = 0; i < n; i++) {
      if (typeList[i] === 'book') {
        preText = 'galaxy';
      }
      innerTemp += `  
              <div>
                <label for="${groupName}-filter-${typeList[i]}">
                  <input type="checkbox" data-product ="${type}" data-type ="${groupName}" class="filter-checkbox" id="${groupName}-filter-${typeList[i]}" value="${typeList[i]}" />
                  <span class="span-box"></span><span class="span-text"> ${preText} ${typeList[i]} ${afText}</span>
                </label>
              </div>  
                `;
    }
  }
  let temp = `
    <div class="${groupName}-filter-container">
          <label for="${groupName}-show">
            <input type="checkbox" class="wrap-checkbox" id="${groupName}-show" value="${groupName}" />
            <div>
              <h3 class="wrap-heading">${textHeading}</h3>

              <div class="wrap-box">
                ${innerTemp}
              </div>
            </div>
          </label>
        </div>
  `;

  sideFilter.innerHTML += temp;
}

// Create product list

function addItem(
  type,
  model,
  img,
  name,
  price,
  color,
  screen,
  disRes,
  memory,
  storage,
  camR,
  camF,
  battery,
  processor,
  graphic
) {
  let innerTemp;
  if (type === 'laptop') {
    innerTemp = `
          <div class="m-top"><h4>Processor</h4><span>${processor}</span></span></div>
          <div class="m-top"><h4>Memory</h4><span>${memory} GB</span></span></div>
          <div class="m-top"><h4>Storage</h4><span>${storage} GB SSD</span></span></div> 
          <div class="m-top"><h4>Graphics</h4><span>${graphic}</span></span></div> 
        `;
  } else {
    innerTemp = `
          <h4 class="m-top">Camera</h4>
          <p>Rear Camera: <span>${camR} MP</span></p>
          <p>Front Camera: <span>${camF} MP</span></p>
          <h4 class="m-top">Memory</h4>
          <p>RAM: <span>${memory} GB</span></p>
          <p>Internal Memory: <span>${storage} GB</span></p>
          <div class="m-top"><h4>Battery</h4><span>${battery} mAh</span></div>
        `;
  }

  let template = `
  <div data-type="${type}" class="p-box box-height-min">
    <div class="img-box">
      <img src="${img}" alt="${name}">
    </div>
    <h3>${name}</h3>
    <h4>$${price}</h4>
    <div class="box-link flex just-bet">
      <button class="btn btn-more">learn more</button>
      <button class="btn btn-buy" data-type="${type}" data-model="${model}">buy now</button>
    </div>
     <div class="product-page flex p-hide">
   
        <div class="pr-specs">
         
          <div class="m-top"><h4>Color</h4><span>${color}</span></div>
          <h4 class="m-top">Display</h4>
          <p>Display Size: <span>${screen}"</span></p>
          <p>Display Resolution: <span>${disRes}</span></p>
            ${innerTemp}
        </div>
      </div>
      
  </div>
    `;
  productList.innerHTML += template;
}

function productSort(data, series) {
  let updateData = [...data];
  let spanSort = document.querySelector('.header-filter-text').dataset.value;

  if (spanSort === 'asc') {
    updateData = updateData.sort((a, b) => parseInt(a.price) - parseInt(b.price));
  } else if (spanSort === 'des') {
    updateData = updateData.sort((a, b) => parseInt(b.price) - parseInt(a.price));
  }
  mainList.classList.add('grid');
  mainList.append(productList);

  while (productList.firstChild) {
    productList.removeChild(productList.firstChild);
  }

  updateData.forEach((el) => {
    if (series === 'all' || series === el.series) {
      addItem(
        el.type,
        el.model,
        el.img,
        el.name,
        el.price,
        el.color,
        el.screen,
        el.displayRes,
        el.memory,
        el.storage,
        el.cameraRear,
        el.cameraFront,
        el.battery,
        el.processor,
        el.graphic
      );
    }
  });
  productList.classList.remove('no-data-list');
  productList.addEventListener('click', createItems);
}

function createProductPage(type, series) {
  let title = type[0].toUpperCase() + type.slice(1, type.length) + 's';
  document.title = 'Samsung | ' + title;
  homeSection.remove();

  if (slide.dataset.type !== type) {
    addSlide(type);
  }
  if (!app.querySelector('#list-header')) {
    addHeaderFilter(type, undefined);
  } else {
    val = listHeader.querySelector('.header-filter-text').dataset.value;
    txt = listHeader.querySelector('.header-filter-text').textContent;
    addHeaderFilter(type, undefined, val, txt);
  }
  addSideFilter(type, series);
  productSort(productData[type], series);
}

function createItems(e) {
  let btn = e.target;
  if (btn.classList.contains('btn-more')) {
    if (btn.textContent === 'learn more') {
      btn.textContent = 'show less';
    } else {
      btn.textContent = 'learn more';
      setTimeout(() => {
        btn.parentElement.parentElement.classList.add('box-height-min');
        btn.parentElement.parentElement.classList.remove('box-height-max');
      }, 151);
    }
    btn.parentElement.nextElementSibling.classList.toggle('p-hide');
    btn.parentElement.parentElement.classList.toggle('grid-span');
    btn.parentElement.parentElement.classList.remove('box-height-min');
    btn.parentElement.parentElement.classList.add('box-height-max');
  } else if (btn.dataset.model && btn.classList.contains('btn-buy')) {
    openCartPage(e);
  }
}

// Create product slide

function addSlide(type) {
  if (!document.getElementById('slide')) {
    app.append(slide);
  }
  let data = domData.slides;

  while (slide.firstChild) {
    slide.removeChild(slide.firstChild);
  }

  let slideText = document.createElement('h1');
  slideText.className = 'slide-heading-text';
  slideText.textContent = `${data[type].headingText}`;
  let productSlide = document.createElement('div');
  productSlide.className = 'p-slide';
  productSlide.style.background = `linear-gradient(to right, rgba(255,255,255,1),rgba(255,255,255,0.2), transparent), url(${data[type].url}) right/cover`;
  productSlide.append(slideText);
  slide.classList.remove('slide-height');

  slide.append(productSlide);
}
