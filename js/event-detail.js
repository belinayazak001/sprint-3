import { events } from "./data.js";

const detailContainer = document.querySelector("#detay") || document.querySelector("main");

function initDetail() {
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const event = events.find(e => e.id === id);

  if (!event) {
    document.title = "Etkinlik Bulunamadı";
    detailContainer.innerHTML = `
      <div class="hata-kutusu">
        <h2>⚠️ Etkinlik Bulunamadı</h2>
        <p>Aradığınız etkinlik mevcut değil veya kaldırılmış olabilir.</p>
        <a href="etkinlikler.html" class="buton">← Listeye dön</a>
      </div>
    `;
    return;
  }

  document.title = `${event.title} - Kampüs Etkinlikleri`;

  detailContainer.innerHTML = `
    <article class="etkinlik-detay-kart">
      <h1>${event.title}</h1>
      
      <dl class="kunye">
        <dt>Kategori</dt>
        <dd>${event.category}</dd>

        <dt>Tarih & Saat</dt>
        <dd>${event.date} - ${event.time}</dd>

        <dt>Konum</dt>
        <dd>${event.location}</dd>

        <dt>Kontenjan</dt>
        <dd>${event.capacity} Kişi</dd>
      </dl>

      <div class="aciklama">
        <h3>Açıklama</h3>
        <p>${event.description}</p>
      </div>

      <div class="buton-grubu" style="display: flex; gap: 10px; margin-top: 20px;">
        <a href="etkinlikler.html" class="btn">← Listeye dön</a>
        <a href="etkinlik-guncelle.html?id=${event.id}" class="btn btn-guncelle">Bu etkinliği güncelle</a>
    </article>
  `;
}

initDetail();