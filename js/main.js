// Get DOM elements

const header = document.getElementById('header'),
  app = document.getElementById('app'),
  footer = document.getElementById('footer');

// Create virtual DOM elements

let slide = document.createElement('div');
slide.id = 'slide';

let form = document.createElement('form');
form.id = 'search-form';

let mainList = document.createElement('main');
mainList.id = 'main-list';

let productList = document.createElement('div');
productList.id = 'product-list';
productList.className = 'grid';

let listHeader = document.createElement('div');
listHeader.id = 'list-header';

let sideFilter = document.createElement('aside');
sideFilter.id = 'side-filter';

let homeSection = document.createElement('div');
homeSection.id = 'home-section';

let qMenu = document.createElement('section');
qMenu.id = 'q-menu';

let sectionBox = document.createElement('section');
sectionBox.id = 'section-box';

let cartPage = document.createElement('div');
cartPage.id = 'cart-page';
cartPage.className = 'c-hide';

let burgerMenu = document.createElement('div');
burgerMenu.id = 'burger-menu';
burgerMenu.className = 'c-hide';

let footerSection = document.createElement('div');
footerSection.id = 'footer-section';
footerSection.className = 'grid';

// Create cart items variable

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

//Create slider timeout variable

let fTimer;

// Create data path and value variables

const productPath = 'json/products.json',
  domPath = 'json/domcontent.json';
let productData = [],
  domData = [];

//-Function to get data form json files

async function getData(path) {
  let response = await fetch(path);
  let resData = await response.json();
  return resData;
}

//Get data and render home page

document.addEventListener('DOMContentLoaded', () => {
  getData(domPath).then((data) => {
    domData = data;
    createHeader();
    createHomePage();
    createFooter();
  });

  getData(productPath).then((data) => {
    productData = data;
  });
});

//Add history navigation

window.addEventListener('popstate', (e) => {
  if (e.state === null) {
    createHomePage();
  } else {
    if (e.state.type === 'search') {
      document.getElementById('search-input').value = e.state.series;
      search(e.state.series);
    } else if (e.state.type === 'home') {
      createHomePage();
    } else {
      searchHide();
      createProductPage(e.state.type, e.state.series);
    }
  }
});
