// 🔌 Connect socket
const socket = io("https://brew-haven-backend.onrender.com");

// 📦 Load all orders
function loadOrders() {
  fetch("https://brew-haven-backend.onrender.com")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("orders");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No orders yet 😴</p>";
        return;
      }

      data.forEach(order => {
        const div = document.createElement("div");
        div.classList.add("order-card");

        // 🟢 Status badge
        let statusColor = "";
        if (order.status === "new") statusColor = "🟡 New";
        if (order.status === "accepted") statusColor = "🟢 Accepted";
        if (order.status === "done") statusColor = "🔵 Done";

        div.innerHTML = `
          <h3>Table #${order.table}</h3>
          <p><b>Total:</b> ₹${order.total}</p>
          <p><b>Status:</b> ${statusColor}</p>

          ${
            order.status === "new"
              ? `<button onclick="acceptOrder('${order._id}', this)">Accept</button>`
              : ""
          }

          ${
            order.status === "accepted"
              ? `<button onclick="markDone('${order._id}', this)">Done</button>`
              : ""
          }
        `;

        container.appendChild(div);
      });
    })
    .catch(err => console.log(err));
}

// ✅ Accept Order
function acceptOrder(id, btn) {
  const time = prompt("Enter preparation time (minutes):");

  if (!time) return;

  btn.innerText = "Processing...";
  btn.disabled = true;

  fetch(`https://brew-haven-backend.onrender.com/api/orders/${id}/accept`, {
  method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ time })
  })
  .then(() => loadOrders());
}

// 🟢 Mark Order Done
function markDone(id, btn) {
  btn.innerText = "Updating...";
  btn.disabled = true;

  fetch(`https://brew-haven-backend.onrender.com/api/orders/${id}/done`, {
  method: "PUT"
  })
  .then(() => loadOrders());
}

// 🔥 Real-time updates
socket.on("newOrder", () => {
  showToast("New Order Received 🔥");
  loadOrders();
});

socket.on("orderAccepted", () => {
  showToast("Order Accepted ✅");
  loadOrders();
});

socket.on("orderDone", () => {
  showToast("Order Completed 🎉");
  loadOrders();
});

// 🔔 Toast Notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "10px 15px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "1000";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// 🚀 Initial load
window.onload = loadOrders;