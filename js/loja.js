document.addEventListener("DOMContentLoaded", function() {
  const cartTableBody = document.querySelector(".cart-table tbody");
  const cartTotalSpan = document.querySelector(".cart-total-container span");
  const cartBadge = document.getElementById("cont-balao");
  const addToCartButtons = document.querySelectorAll(".dish .button-hover-background");

  // Função para atualizar o carrinho
  function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartTableBody.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
      const price = parseFloat(item.price); // Garante que o preço é um número
      const itemTotal = price * item.quantity;
      total += itemTotal;
      totalItems += item.quantity;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <span>${item.name}</span>
        </td>
        <td>R$${price.toFixed(2)}</td>
        <td>
          <button class="decrease-quantity" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="increase-quantity" data-index="${index}">+</button>
          <button class="remove-item" data-index="${index}">🗑️</button>
        </td>
      `;
      cartTableBody.appendChild(row);
    });

    cartTotalSpan.textContent = `R$${total.toFixed(2)}`;
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? "inline-block" : "none";

    // Adiciona os eventos de clique para os botões de incremento, decremento e remoção
    cartTableBody.addEventListener("click", function(event) {
      const index = event.target.dataset.index;
      if (event.target.classList.contains("increase-quantity")) {
        cart[index].quantity++;
      } else if (event.target.classList.contains("decrease-quantity")) {
        cart[index].quantity--;
        if (cart[index].quantity === 0) {
          cart.splice(index, 1);
        }
      } else if (event.target.classList.contains("remove-item")) {
        cart.splice(index, 1);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    });
  }

  // Função para adicionar produto ao carrinho
  function addToCart(name, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === name);
    price = parseFloat(price); // Garante que o preço é um número

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showNotification(name, 'adicionado');
  }

  // Função para mostrar a notificação personalizada
  function showNotification(productName, action) {
    const notification = document.getElementById("notification");
    notification.textContent = action === 'adicionado' 
      ? `${productName} foi adicionado ao carrinho!` 
      : `${productName} foi removido do carrinho!`;
      
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  // Função de compra e envio para WhatsApp
  window.makePurchase = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    let message = "Olá, gostaria de fazer esse pedido abaixo:\n\n";
    let total = 0;

    cart.forEach(item => {
      const price = parseFloat(item.price);
      const itemTotal = price * item.quantity;
      message += `${item.name} - R$${price.toFixed(2)} x ${item.quantity} = R$${itemTotal.toFixed(2)}\n`;
      total += itemTotal;
    });

    message += `\nTotal: R$${total.toFixed(2)}`;
    message = encodeURIComponent(message);

    const phoneNumber = '5527988891413';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');

    localStorage.removeItem('cart');
    updateCart();
  };

  // Adicionando os produtos ao carrinho
  addToCartButtons.forEach(button => {
    button.addEventListener("click", function() {
      const dishElement = this.closest(".dish");
      const name = dishElement.querySelector(".product-title").textContent;
      const priceText = dishElement.querySelector(".product-price").textContent.replace("R$", "").replace(",", ".");
      const price = parseFloat(priceText);
      const image = dishElement.querySelector(".product-image").src;

      addToCart(name, price, image);
    });
  });

  // Atualiza o carrinho quando a página carrega
  updateCart();
});

// Função para limpar o carrinho
function clearCart() {
  localStorage.removeItem('cart');
  updateCart();
  alert('Carrinho limpo!');
}
