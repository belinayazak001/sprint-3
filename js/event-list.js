import { events } from "./data.js";

const listContainer = document.querySelector("#etkinlik-listesi");
const searchInput = document.querySelector("#arama");
const categorySelect = document.querySelector("#kategori-filtre");
const resultCount = document.querySelector("#sonuc");

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("-");
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function createCard(event) {
  return `
    <article>
      <h3>${event.title}</h3>
      <p><strong>${event.category}</strong></p>
      <p>Tarih: ${formatDate(event.date)}, ${event.time}</p>
      <p>Yer: ${event.location}</p>
      <p>Kontenjan: ${event.capacity} kişi</p>
      <p>${event.description}</p>
      <a href="etkinlik-detay.html?id=${event.id}">Detayları gör →</a>
    </article>
  `;
}

function render(dizi) {
  if (!listContainer) return;

  if (dizi.length === 0) {
    listContainer.innerHTML = `<p class="bos-mesaj">Aradığınız kriterlere uygun etkinlik bulunamadı.</p>`;
  } else {
    listContainer.innerHTML = dizi.map(createCard).join("");
  }

  if (resultCount) {
    resultCount.textContent = `${dizi.length} etkinlik listeleniyor.`;
  }
}

function setupCategoryOptions() {
  if (!categorySelect) return;

  const categories = ["Tümü", ...new Set(events.map(e => e.category))];
  categorySelect.innerHTML = categories
    .map(cat => `<option value="${cat === "Tümü" ? "" : cat}">${cat}</option>`)
    .join("");
}

function filterEvents() {
  const query = searchInput ? searchInput.value.trim().toLocaleLowerCase("tr-TR") : "";
  const selectedCat = categorySelect ? categorySelect.value : "";

  const filtered = events.filter(e => {
    const matchesSearch = e.title.toLocaleLowerCase("tr-TR").includes(query);
    const matchesCategory = selectedCat === "" || e.category === selectedCat;
    return matchesSearch && matchesCategory;
  });

  render(filtered);
}

function init() {
  if (!listContainer) return;

  // Ana sayfa için data-limit kontrolü (sadece yaklaşan 2 etkinliği sıralayıp gösterir)
  if (listContainer.dataset.limit) {
    const limit = Number(listContainer.dataset.limit);
    const sortedUpcoming = [...events]
      .sort((a, b) => {
        const dateA = a.date.split("-").reverse().join("-");
        const dateB = b.date.split("-").reverse().join("-");
        return dateA.localeCompare(dateB);
      })
      .slice(0, limit);

    render(sortedUpcoming);
  } else {
    // Liste sayfası ise
    setupCategoryOptions();
    render(events);

    if (searchInput) searchInput.addEventListener("input", filterEvents);
    if (categorySelect) categorySelect.addEventListener("change", filterEvents);
  }
}

init();