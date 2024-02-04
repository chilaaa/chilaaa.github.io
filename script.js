document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".movie-container");
  const kursis = document.querySelectorAll(".row .kursi:not(.terisi)");
  const count = document.getElementById("count");
  const total = document.getElementById("total");
  const dateInput = document.getElementById("date");
  const jamSelect = document.getElementById("jam");
  const tanggalSpan = document.getElementById("tanggal");

  updateDateInput(); // Untuk mengatur format tanggal pertama kali

  dateInput.addEventListener("change", function () {
    updateSelectedCount();
    updateDateInput(); // Perbarui format tanggal saat tanggal diubah
    updateKursiAvailability(); // Perbarui ketersediaan kursi berdasarkan tanggal dan jam yang dipilih
  });

  jamSelect.addEventListener("change", function () {
    updateSelectedCount(); // Perbarui total harga saat jam diubah
    updateKursiAvailability(); // Perbarui ketersediaan kursi berdasarkan tanggal dan jam yang dipilih
  });

  container.addEventListener("click", (e) => {
    console.log("Klik pada kursi");
    if (
      e.target.classList.contains("kursi") &&
      !e.target.classList.contains("terisi")
    ) {
      e.target.classList.toggle("terpilih");
      // updateSelectedKursis(); // Panggil fungsi untuk memperbarui data kursi yang dipilih
    }
    updateSelectedCount();
  });

  // let selectedKursis = [];
  // function updateSelectedKursis() {
  //   // Dapatkan semua kursi yang dipilih saat ini
  //   const terpilihKursis = document.querySelectorAll(".row .kursi.terpilih");
  //   // Reset array kursi yang dipilih
  //   selectedKursis = [];
  //   // Tambahkan kursi yang dipilih saat ini ke dalam array selectedKursis
  //   terpilihKursis.forEach((kursi) => {
  //     selectedKursis.push(kursi.textContent);
  //   });
  //   // Panggil fungsi untuk memperbarui tampilan kursi yang dipilih
  //   updateSelectedKursisView();
  // }

  // function updateSelectedKursisView() {
  //   // Ambil elemen untuk menampilkan kursi yang dipilih
  //   const selectedKursisElement = document.getElementById("selectedKursis");
  //   // Reset isi dari elemen tersebut
  //   selectedKursisElement.innerText = selectedKursis.join(", ");
  // }

  function updateSelectedCount() {
    const terpilihKursis = document.querySelectorAll(".row .kursi.terpilih");
    const terpilihKursisCount = terpilihKursis.length;
    count.innerText = terpilihKursisCount;
    total.innerText = terpilihKursisCount * getTicketPrice();
    updateTanggalSpan(); // Perbarui tanggal yang ditampilkan
  }

  function getTicketPrice(tiket) {
    const terpilihDate = new Date(dateInput.value);
    const terpilihDay = terpilihDate.getDay();
    const terpilihTime = jamSelect.value;

    if ((terpilihDay === 0 || terpilihDay === 6) && terpilihTime === "19:00") {
      return 185000;
    } else if (terpilihDay === 4 && terpilihTime === "16:00") {
      return 125000;
    } else {
      // Harga tiket reguler untuk hari kerja dan jam lainnya
      return terpilihDay === 0 || terpilihDay === 6 ? 185000 : 125000;
    }
  }

  function updateDateInput() {
    const terpilihDate = new Date(dateInput.value);
    const year = terpilihDate.getFullYear();
    let month = terpilihDate.getMonth() + 1;
    if (month < 10) {
      month = "0" + month; // Tambahkan "0" di depan bulan jika nilainya kurang dari 10
    }
    let day = terpilihDate.getDate();
    if (day < 10) {
      day = "0" + day; // Tambahkan "0" di depan hari jika nilainya kurang dari 10
    }
    const formattedDate = `${year}-${month}-${day}`;
    dateInput.value = formattedDate;
    updateTanggalSpan(); // Perbarui tanggal yang ditampilkan
  }

  function updateTanggalSpan() {
    const terpilihDate = new Date(dateInput.value);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = terpilihDate.toLocaleDateString("id-ID", options);
    tanggalSpan.innerText = formattedDate;
    return formattedDate;
  }
  function updateKursiAvailability() {
    const terpilihDate = new Date(dateInput.value);
    const terpilihTime = jamSelect.value;
    const isSundayEvening = terpilihDate.getDay() === 0;
    const isThursdayAfternoon =
      terpilihDate.getDay() === 4 && terpilihTime === "16:00";

    kursis.forEach((kursi) => {
      if (isSundayEvening) {
        kursi.classList.add("terisi");
      } else if (isThursdayAfternoon) {
        // Sisakan kursi 12F dan 12G
        if (kursi.textContent === "12F" || kursi.textContent === "12G") {
          kursi.classList.remove("terisi");
        } else {
          kursi.classList.add("terisi");
        }
      } else {
        kursi.classList.remove("terisi");
      }
    });
  }

  updateSelectedCount();

  const pesanan = [];

  // Tombol pesan
  const pesanButton = document.getElementById("pesanButton");

  // Tabel pesanan
  const pesananTable = document.getElementById("pesananBody"); // Ganti id menjadi pesananTable

  pesanButton.addEventListener("click", function () {
    // Mengambil data kursi yang dipilih
    const terpilihKursis = document.querySelectorAll(".kursi.terpilih");

    // Jika ada kursi yang dipilih
    if (terpilihKursis.length > 0) {
      // Mendapatkan nama pemesan dari input
      const namaPemesan = document.getElementById("namaPemesan").value.trim();

      // Jika nama pemesan tidak kosong
      if (namaPemesan) {
        // Mengambil tanggal dan jam film dari input
        const tanggal = document.getElementById("date").value;
        const jam = document.getElementById("jam").value;

        // Mendapatkan daftar kursi yang dipesan
        const kursiDipesan = Array.from(terpilihKursis)
          .map((kursi) => kursi.textContent)
          .join(", ");

        // Mendapatkan harga tiket per kursi
        const hargaPerKursi = getTicketPrice();

        // Mendapatkan jumlah kursi yang dipilih
        const jumlahKursi = terpilihKursis.length;

        // Mendapatkan total harga pesanan
        const totalHarga = hargaPerKursi * jumlahKursi;

        // Menambahkan pesanan ke dalam tabel
        const newRow = pesananTable.insertRow();
        newRow.innerHTML = `<td>${namaPemesan}</td><td>${updateTanggalSpan(
          tanggal
        )}</td><td>${jam}</td><td>${kursiDipesan}</td><td>${totalHarga}</td>`;

        // Menambahkan pesanan ke dalam array pesanan
        pesanan.push({
          namaPemesan,
          tanggal,
          jam,
          kursiDipesan,
          tiket: totalHarga,
        });

        // updateSelectedKursis();
        // Menampilkan pesan sukses
        alert("Pesanan tiket berhasil ditambahkan!");

        // Mengosongkan kursi yang dipilih
        // terpilihKursis.forEach((kursi) => kursi.classList.remove("terpilih"));

        // Memperbarui jumlah kursi yang dipilih dan total harga
        updateSelectedCount();
      } else {
        alert("Silakan masukkan nama Anda!");
      }
    } else {
      alert("Silakan pilih kursi terlebih dahulu!");
    }
  });

  // Import library yang dibutuhkan
  const { PDFDocument, rgb, degrees } = require("pdf-lib");
  // const fs = require("fs");

  // Fungsi untuk membuat dan mencetak tiket
  async function printTicket() {
    const terpilihKursis = document.querySelectorAll(".kursi.terpilih");
    if (terpilihKursis.length > 0) {
      const namaPemesan = document.getElementById("namaPemesan").value.trim();
      const tanggal = document.getElementById("date").value;
      const jam = document.getElementById("jam").value;

      // Fungsi untuk mencetak tiket baru untuk setiap kursi yang dipilih
      async function printTicket(namaPemesan, tanggal, jam, kursiDipesan) {
        try {
          const response = await fetch("template.pdf");
          const templateBlob = await response.blob();
          const templateData = new Uint8Array(await templateBlob.arrayBuffer());
          const pdfDoc = await PDFDocument.load(templateData);
          const page = pdfDoc.getPages()[0];

          // Gunakan font Helvetica Bold
          const font = await pdfDoc.embedFont("Helvetica-Bold");

          // Tambahkan data tiket ke dalam dokumen PDF
          page.drawText(`${namaPemesan}`, {
            x: 347,
            y: 26,
            size: 15,
            font: font, // Gunakan font Helvetica Bold
            color: rgb(1, 1, 1), // Gunakan rgb(1, 1, 1) untuk warna putih
          });
          page.drawText(`${namaPemesan}`, {
            x: 30,
            y: 130,
            size: 13,
            font: font, // Gunakan font Helvetica Bold
            color: rgb(1, 1, 1), // Gunakan rgb(1, 1, 1) untuk warna putih
            rotate: degrees(270), // Rotasi 90 derajat searah jarum jam
          });
          page.drawText(`${updateTanggalSpan(tanggal)}`, {
            x: 230,
            y: 64,
            size: 15,
            font: font, // Gunakan font Helvetica Bold
            color: rgb(1, 1, 1), // Gunakan rgb(1, 1, 1) untuk warna putih
          });
          page.drawText(`${jam}`, {
            x: 230,
            y: 26,
            size: 15,
            font: font, // Gunakan font Helvetica Bold
            color: rgb(1, 1, 1), // Gunakan rgb(1, 1, 1) untuk warna putih
          });
          page.drawText(`${kursiDipesan}`, {
            x: 485,
            y: 26,
            size: 15,
            font: font, // Gunakan font Helvetica Bold
            color: rgb(1, 1, 1), // Gunakan rgb(1, 1, 1) untuk warna putih
          });
          page.drawText(`${kursiDipesan}`, {
            x: 29,
            y: 39,
            size: 15,
            font: font, // Gunakan font Helvetica Bold
            color: rgb(1, 1, 1), // Gunakan rgb(1, 1, 1) untuk warna putih
            rotate: degrees(270), // Rotasi 90 derajat searah jarum jam
          });

          const pdfBytes = await pdfDoc.save();
          const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
          const pdfUrl = URL.createObjectURL(pdfBlob);

          // Buka dokumen PDF dalam jendela baru
          window.open(pdfUrl, "_blank");
        } catch (error) {
          console.error("Error printing ticket:", error);
          alert("Gagal mencetak tiket. Silakan coba lagi.");
        }
      }

      // Loop untuk mencetak tiket baru untuk setiap kursi yang dipilih
      terpilihKursis.forEach(async (kursi) => {
        const kursiDipesan = kursi.textContent;
        await printTicket(namaPemesan, tanggal, jam, kursiDipesan);
      });

      // reset kursi yang dipilih, dll
    }
  }

  // Event listener untuk tombol print tiket
  const printTicketButton = document.getElementById("printTicketButton");
  printTicketButton.addEventListener("click", function () {
    printTicket().catch((error) => console.error(error));
  });
});
