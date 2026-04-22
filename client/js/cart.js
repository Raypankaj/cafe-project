const params = new URLSearchParams(window.location.search);
const table = params.get("table") || "1";
const cartKey = `cart_table_${table}`;

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function addToCart(name, price) {
  const cart = getCart();
  const numericPrice = Number(price) || 0;

  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.qty = (existingItem.qty || 1) + 1;
  } else {
    cart.push({ name, price: numericPrice, qty: 1 });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  showToast(`${name} added`);
}
