let products = [];
let swiper;

async function fetchProducts() {
    const params = new URLSearchParams(window.location.search);
    let category = params.get("category");
   const jsonFile = `${category}.json`;
  //const jsonFile = "cute.json";
  try {
    const res = await fetch(`${jsonFile}?v=${Date.now()}`);
    if (!res.ok) throw new Error("Không tìm thấy file JSON");
    products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu:", err);
    document.getElementById("product-list").innerHTML = `<p style="text-align:center;">Không tìm thấy danh mục: ${category}</p>`;
  }
}

function renderProducts(data) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${item.photos[0]}" />
      <div class="sale">${item.sale}</div>
      <div class="info">
        <h3>${item.name}</h3>
        <div class="price">${item.cost}</div>
        <div class="explore">EXPLORE</div>
      </div>
    `;
    card.addEventListener("click", () => showPopup(item));
    container.appendChild(card);
  });
}

function showPopup(item) {
  const wrapper = document.getElementById("swiper-wrapper");
  wrapper.innerHTML = "";

  item.photos.forEach(photo => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `<img src="${photo}" />`;
    wrapper.appendChild(slide);
  });

  document.getElementById("popup-origin").textContent = item.origin;
  document.getElementById("popup-title").textContent = item.name;
  document.getElementById("popup-price").textContent = item.cost;
  document.getElementById("popup-link").href = item.link;

  document.getElementById("popup").classList.remove("hidden");

  if (swiper) swiper.destroy(true, true);

  swiper = new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

document.getElementById("close-popup").addEventListener("click", () => {
  document.getElementById("popup").classList.add("hidden");
});

document.getElementById("search").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
  renderProducts(filtered);
});

fetchProducts();
