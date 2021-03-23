// Create cart page

function openCartPage(e) {
  let mod = e.target.dataset.model;
  let type = e.target.dataset.type;
  let cartCheck = false;

  if (cartItems.length) {
    cartItems.forEach((item) => {
      if (item.model === mod) {
        cartCheck = true;
      }
    });
  }

  if (!cartCheck) {
    productData[type].forEach((el) => {
      if (el.model === mod) {
        cartItems.push({ model: el.model, price: el.price, quantity: 1, img: el.img, name: el.name });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }
    });
    createCartPage();
  }

  if (cartPage.classList.contains('c-hide')) {
    cartPageToggle();
  }
}

function createCartPage() {
  let tempItem = '';
  cartItems.forEach((el) => {
    tempItem += `
         <div class="flex cart-box" data-model="${el.model}">
        <div class="c-img-box">
          <img class="p-img" src="${el.img}" alt="${el.name}" />
        </div>
        <div class="cart-info">
          <div class="cart-item-name">
            <h4>${el.name}</h4>
          </div>
          <div class="cart-price">
            <div class="flex">
              <h5>Price:</h5>
              <span class="cart-price-span"><span class="q-price-num">${el.price}</span>$</span>
            </div>
          </div>
          <div class="cart-quantity">
            <div class="flex">
              <h5>Quantity:</h5>
              <div class="button-group">
                <button class="btn-up"></button>
                <p class="cart-q" data-model="${el.model}">${el.quantity}</p>
                <button class="btn-down"></button>
              </div>
            </div>
          </div>
          <div class="rem-cart-item">
            <button data-model="${el.model}">Remove Item<span class="remove-x">&#215;</span></button>
          </div>
        </div>
      </div>    
      `;
  });

  let tempSum = 0;
  let tempQuantity = 0;
  cartItems.forEach((it) => {
    tempSum += parseInt(parseInt(it.price) * parseInt(it.quantity));
    tempQuantity += parseInt(it.quantity);
  });

  cartPage.innerHTML = `
    <div class="cart-group">
      <div class ="cart-head">
        <button class="btn-close">&#215;</button>
        <h3>shopping cart</h3>
      </div>
      <div class="cart-wrap">
        ${tempItem}
      </div>  
      <div class="cart-bottom">
        <div class="cart-sum">
        <h4>Total Products: <span id ="quan">${tempQuantity}</span></h4>
        <h4>Grand Total: <span id ="sum">${tempSum}</span> $</h4>
        <button class="btn-cart" disabled>Proceed to Checkout</button>
      </div>
    </div>  
  `;

  cartPage.querySelector('.btn-close').addEventListener('click', () => {
    cartPageToggle();
  });

  cartPage.querySelectorAll('.button-group').forEach((gr) => {
    gr.addEventListener('click', (e) => {
      let cont = gr.querySelector('.cart-q');
      let quan = cartPage.querySelector('#quan');
      let sum = cartPage.querySelector('#sum');
      let mod = cont.dataset.model;
      let res = parseInt(cartItems.filter((it) => it.model === mod)[0].quantity);
      let oldSum = 0;
      let newSum = 0;

      tempQuantity -= res;

      if (e.target.classList.contains('btn-up')) {
        res++;
      } else if (e.target.classList.contains('btn-down') && res > 1) {
        res--;
      }

      cartItems.forEach((it) => {
        if (mod === it.model) {
          oldSum = parseInt(parseInt(it.price) * parseInt(it.quantity));
          it.quantity = res;
          newSum = parseInt(parseInt(it.price) * res);
        }
      });
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      tempQuantity += res;

      quan.textContent = tempQuantity;
      cont.textContent = res;
      sum.textContent = parseInt(sum.textContent) + newSum - oldSum;

      cartSpanUpdate(tempQuantity);
    });
  });

  cartPage.querySelectorAll('.rem-cart-item button').forEach((rm) => {
    rm.addEventListener('click', () => {
      let mod = rm.dataset.model;

      cartItems.forEach((el, ind) => {
        if (mod === el.model) {
          cartItems.splice(ind, 1);
          let removed = cartPage.querySelector(`[data-model="${mod}"]`);
          removed.classList.add('cart-box-removed');
          btnCartDisable();

          setTimeout(() => {
            removed.remove();
          }, 250);
        }
      });
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      setTimeout(createCartPage, 251);

      cartSpanUpdate(tempQuantity);
    });
  });

  let btnCart = cartPage.querySelector('.btn-cart');
  btnCart.addEventListener('click', () => {
    alert('congrats on purchase :)');
  });

  cartSpanUpdate(tempQuantity);
  btnCartDisable();
}

function cartSpanUpdate(tempQuantity) {
  let cartSpan = document.querySelector('.cart-num');
  if (tempQuantity) {
    cartSpan.classList.remove('display-none');
    cartSpan.textContent = tempQuantity;
  } else {
    cartSpan.classList.add('display-none');
    cartSpan.textContent = '';
  }
}

function cartPageToggle() {
  if (app.querySelector('#cart-page')) {
    cartPage.classList.add('c-hide');
    cartPage.classList.remove('c-show');
    setTimeout(() => {
      cartPage.remove();
    }, 201);
  } else {
    btnCartDisable();
    app.append(cartPage);

    setTimeout(() => {
      cartPage.classList.remove('c-hide');
      cartPage.classList.add('c-show');
    }, 1);
  }
}

function btnCartDisable() {
  let btnCart = cartPage.querySelector('.btn-cart');
  if (cartItems.length) {
    btnCart.disabled = false;
  }
}
