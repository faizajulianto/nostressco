(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    // Beri nilai default jika header tidak ditemukan atau tidak terlihat
    let offset = header ? header.offsetHeight : 0;

    let element = select(el);
    if (element) {
      let elementPos = element.offsetTop;
      window.scrollTo({
        top: elementPos - offset,
        behavior: "smooth",
      });
    } else {
      console.error("Element not found for scrollto:", el); // Tambahkan log jika elemen tidak ada
    }
  };

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
    // Tambahkan event listener klik untuk tombol backtotop jika belum ada
    on("click", ".back-to-top", function (e) {
      e.preventDefault(); // Mencegah perilaku default jika ini adalah link <a>
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        // Tutup dropdown lain yang mungkin terbuka
        let openDropdowns = select(".navbar .dropdown .dropdown-active", true);
        openDropdowns.forEach((dropdown) => {
          if (dropdown !== this.nextElementSibling) {
            dropdown.classList.remove("dropdown-active");
            // Juga reset ikon panah jika ada
            let parentLink = dropdown.previousElementSibling;
            // Anda mungkin perlu menyesuaikan cara reset ikon panah/parent link
          }
        });
        // Toggle dropdown yang diklik
        this.nextElementSibling.classList.toggle("dropdown-active");
        // Anda mungkin perlu menambahkan logika untuk toggle ikon panah juga
      }
    },
    true
  );

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows", // Atau mode lain seperti 'masonry'
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          //   portfolioIsotope.on("arrangeComplete", function () {
          //     // AOS refresh mungkin tidak diperlukan jika tidak ada masalah layout setelah filter
          //     // Jika Anda menggunakan AOS dan ada masalah, baru aktifkan ini
          //     // AOS.refresh();
          //   });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox", // Pastikan selector ini sesuai dengan link di item portofolio Anda
  });

  /**
   * Initiate portfolio details lightbox
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: ".portfolio-details-lightbox", // Pastikan selector ini sesuai
    width: "90%",
    height: "90vh",
  });

  /**
   * Portfolio details slider
   */
  // Inisialisasi Swiper hanya jika elemennya ada
  if (select(".portfolio-details-slider")) {
    new Swiper(".portfolio-details-slider", {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select(".skills-content");
  if (skilsContent) {
    // Pastikan library Waypoint sudah dimuat sebelum kode ini
    if (typeof Waypoint !== "undefined") {
      new Waypoint({
        element: skilsContent,
        offset: "80%",
        handler: function (direction) {
          // Hanya jalankan jika arahnya ke bawah atau saat pertama kali load
          if (direction === "down") {
            let progress = select(".progress .progress-bar", true);
            progress.forEach((el) => {
              el.style.width = el.getAttribute("aria-valuenow") + "%";
            });
            // Hancurkan waypoint setelah dijalankan agar tidak berulang jika scroll ke atas lalu ke bawah lagi
            // this.destroy(); // Uncomment jika hanya ingin animasi sekali jalan
          }
        },
      });
    } else {
      console.error("Waypoint library is not loaded.");
    }
  }

  /**
   * Testimonials slider
   */
  // Inisialisasi Swiper hanya jika elemennya ada
  if (select(".testimonials-slider")) {
    new Swiper(".testimonials-slider", {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: "auto", // Biarkan Swiper menentukan jumlah slide yang terlihat
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
      // Tambahkan breakpoints jika perlu responsivitas berbeda
      // breakpoints: {
      //     // Misal: Tampilkan 1 slide di mobile, 2 di tablet, 3 di desktop
      //     320: { slidesPerView: 1, spaceBetween: 20 },
      //     768: { slidesPerView: 2, spaceBetween: 30 },
      //     1024: { slidesPerView: 3, spaceBetween: 40 }
      // }
    });
  }

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    // Pastikan library AOS sudah dimuat
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true, // Animasi hanya sekali
        mirror: false, // Animasi tidak berulang saat scroll ke atas/bawah melewati elemen
      });
    } else {
      console.error("AOS library is not loaded.");
    }
  });

  /**
   * Initiate Pure Counter
   */
  // Pastikan library PureCounter sudah dimuat
  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  } else {
    console.error("PureCounter library is not loaded.");
  }

  // =========================================================================
  // TAMBAHAN KODE MODAL DIMULAI DI SINI
  // =========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    // Gunakan helper 'select' jika ingin konsisten, atau biarkan querySelectorAll
    // const detailButtons = select(".detail-btn", true);
    // const closeButtons = select(".close-btn", true);
    // const modals = select(".modal", true);
    const detailButtons = document.querySelectorAll(".detail-btn");
    const closeButtons = document.querySelectorAll(".close-btn");
    const modals = document.querySelectorAll(".modal");

    // Fungsi untuk membuka modal
    const openModal = (modal) => {
      if (modal) {
        modal.classList.add("active");
        // Opsional: Mencegah scroll body saat modal terbuka
        document.body.style.overflow = "hidden";
      }
    };

    // Fungsi untuk menutup modal
    const closeModal = (modal) => {
      if (modal) {
        modal.classList.remove("active");
        // Opsional: Kembalikan scroll body hanya jika tidak ada modal lain yang aktif
        if (!document.querySelector(".modal.active")) {
          document.body.style.overflow = "auto";
        }
      }
    };

    // Tambahkan event listener ke setiap tombol "Lihat Detail"
    detailButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Tambahkan 'e' untuk event object
        e.preventDefault(); // Mencegah perilaku default jika tombolnya adalah link <a>
        const modalId = button.getAttribute("data-modal-target");
        const modal = document.querySelector(modalId); // Atau select(modalId);
        if (modal) {
          openModal(modal);
        } else {
          console.error("Modal target not found:", modalId);
        }
      });
    });

    // Tambahkan event listener ke setiap tombol "Tutup"
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.closest(".modal"); // Cari modal terdekat
        closeModal(modal);
      });
    });

    // Tambahkan event listener untuk menutup modal saat klik di luar area konten modal (overlay)
    modals.forEach((modal) => {
      modal.addEventListener("click", (event) => {
        // Cek apakah yang diklik adalah modal background (bukan konten di dalamnya)
        // Pastikan target adalah elemen modal itu sendiri, bukan child element
        if (event.target === modal) {
          closeModal(modal);
        }
      });
    });

    // Tambahkan event listener untuk tombol Escape (Esc)
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        // Tutup modal yang paling atas (terakhir dibuka) jika ada beberapa modal
        const activeModals = document.querySelectorAll(".modal.active");
        if (activeModals.length > 0) {
          // Ambil modal terakhir (paling atas) dari NodeList
          const topModal = activeModals[activeModals.length - 1];
          closeModal(topModal);
        }
      }
    });
  });
  // =========================================================================
  // AKHIR DARI TAMBAHAN KODE MODAL
  // =========================================================================
})(); // Akhir dari IIFE

// =========================================================================
// FUNGSI GLOBAL UNTUK WHATSAPP (DI LUAR IIFE)
// =========================================================================
// Fungsi untuk mengarahkan ke WhatsApp
function hubungiWa(namaJasa) {
  // !!! PENTING: GANTI DENGAN NOMOR WA ANDA YANG AKTIF (Format 62xxxx) !!!
  const nomorWa = "6282113367549";
  // Pastikan namaJasa tidak null atau undefined
  const jasaText = namaJasa ? ` *Jasa ${namaJasa}*` : "";
  const pesanDefault = `Halo, saya tertarik dengan${jasaText} yang Anda tawarkan. Bisa minta informasi lebih lanjut? Terima kasih.`;
  const linkWa = `https://wa.me/${nomorWa}?text=${encodeURIComponent(
    pesanDefault
  )}`;

  window.open(linkWa, "_blank"); // Buka di tab baru
}
