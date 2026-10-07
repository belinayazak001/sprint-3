import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const messageBox = document.querySelector("#form-mesaj");

function initForm() {
  if (!form) return;

  form.setAttribute("novalidate", "true");

  const isUpdateMode = form.dataset.mode === "guncelle";
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (isUpdateMode) {
    if (!id) {
      form.outerHTML = `
        <div class="hata-kutusu">
          <h2>⚠️ Geçersiz İstek</h2>
          <p>Güncellenecek etkinlik ID'si bulunamadı.</p>
          <a href="etkinlikler.html">Etkinliklere git →</a>
        </div>
      `;
      return;
    }

    const event = events.find(e => e.id === id);
    if (!event) {
      form.outerHTML = `
        <div class="hata-kutusu">
          <h2>⚠️ Etkinlik Bulunamadı</h2>
          <p>Güncellenmek istenen etkinlik mevcut değil.</p>
          <a href="etkinlikler.html">Etkinliklere git →</a>
        </div>
      `;
      return;
    }

    if (form.elements["ad"]) form.elements["ad"].value = event.title;
    if (form.elements["kategori"]) form.elements["kategori"].value = event.category;
    if (form.elements["tarih"]) form.elements["tarih"].value = event.date;
    if (form.elements["saat"]) form.elements["saat"].value = event.time;
    if (form.elements["yer"]) form.elements["yer"].value = event.location;
    if (form.elements["kontenjan"]) form.elements["kontenjan"].value = event.capacity;
    if (form.elements["aciklama"]) form.elements["aciklama"].value = event.description;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    // Eski hataları temizle
    document.querySelectorAll(".hata-metni").forEach(el => (el.textContent = ""));
    document.querySelectorAll("[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid"));
    if (messageBox) messageBox.innerHTML = "";

    const fd = new FormData(form);
    const data = {
      title: fd.get("ad") ? fd.get("ad").trim() : "",
      category: fd.get("kategori") || "",
      date: fd.get("tarih") || "",
      time: fd.get("saat") || "",
      location: fd.get("yer") ? fd.get("yer").trim() : "",
      capacity: fd.get("kontenjan") ? Number(fd.get("kontenjan")) : 0,
      description: fd.get("aciklama") ? fd.get("aciklama").trim() : ""
    };

    const errors = {};

    // Validasyon Kuralları
    if (data.title.length < 3) {
      errors.ad = "Etkinlik adı en az 3 karakter olmalıdır.";
    }
    if (!data.category) {
      errors.kategori = "Lütfen bir kategori seçiniz.";
    }
    if (!data.date) {
      errors.tarih = "Tarih alanı boş bırakılamaz.";
    }
    if (!data.time || data.time.trim() === "") {
  errors.saat = "Saat alanı boş bırakılamaz.";
    }
    if (!data.location) {
      errors.yer = "Konum alanı boş bırakılamaz.";
    }
    if (isNaN(data.capacity) || data.capacity < 1 || data.capacity > 1000) {
      errors.kontenjan = "Kontenjan 1 ile 1000 arasında olmalıdır.";
    }

    if (Object.keys(errors).length > 0) {
      for (const fieldName in errors) {
        const input = form.elements[fieldName];
        const errorSpan = document.querySelector(`#${fieldName}-hata`);

        if (input) input.setAttribute("aria-invalid", "true");
        if (errorSpan) errorSpan.textContent = errors[fieldName];
      }
      return;
    }

    if (messageBox) {
      messageBox.innerHTML = `
        <div class="basari-kutusu">
          <h3>✅ Form Başarıyla Doğrulandı!</h3>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
      `;
    }
  });
}

initForm();