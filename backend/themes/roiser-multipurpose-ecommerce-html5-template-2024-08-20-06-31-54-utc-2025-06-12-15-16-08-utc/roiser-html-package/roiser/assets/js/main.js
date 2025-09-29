(function ($) {
  "use strict";

  function safeLoadScript(src, cb, onerror) {
    if (!src) return onerror && onerror();
    var exists = Array.from(document.scripts).some(function (s) {
      return s.src && s.src.indexOf(src) !== -1;
    });
    if (exists) {
      return cb && cb();
    }
    var s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = function () {
      cb && cb();
    };
    s.onerror = function () {
      onerror && onerror(new Error("Failed to load " + src));
    };
    document.head.appendChild(s);
  }

  function safeCall(fn) {
    try {
      fn && fn();
    } catch (e) {
      console.warn("safeCall error:", e);
    }
  }

  safeCall(function () {
    $(".rr-checkout-login-form-reveal-btn").on("click", function () {
      $("#rrReturnCustomerLoginForm").slideToggle(400);
    });

    $(".rr-checkout-coupon-form-reveal-btn").on("click", function () {
      $("#rrCheckoutCouponForm").slideToggle(400);
    });
  });

  $(window).on("load", function (event) {
    safeCall(function () {
      $("#preloader").delay(1000).fadeOut(500);
    });

    setTimeout(function () {
      try {
        if (typeof SplitType === "function" && typeof gsap !== "undefined") {
          var hasAnim = $(".anim-text");
          hasAnim.each(function () {
            var $this = $(this);
            var node = $this.get(0);
            if (!node) return;
            var splitto = new SplitType(node, {
              types: "lines, chars",
              className: "char",
            });
            var chars = $this.find(".char");
            gsap.fromTo(
              chars,
              { y: "100%" },
              {
                y: "0%",
                duration: 0.9,
                stagger: 0.03,
                ease: "power2.out",
              }
            );
          });
        } else {
          if (!$(".anim-text").length) return;
          console.info(
            "SplitType or GSAP not present — skipping anim-text animation."
          );
        }
      } catch (e) {
        console.warn("anim-text init failed:", e);
      }
    }, 1000);
  });

  $(".preloader-close").on("click", function () {
    $("#preloader").delay(0).fadeOut(500);
  });

  $(document).ready(function () {
    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
      $("body").addClass("firefox");
    }

    var header = $(".header"),
      stickyHeader = $(".primary-header");

    function menuSticky(w) {
      if (w.matches) {
        $(window).on("scroll.menuSticky", function () {
          var scroll = $(window).scrollTop();
          if (scroll >= 110) {
            stickyHeader.addClass("fixed");
          } else {
            stickyHeader.removeClass("fixed");
          }
        });
        if ($(".header").length > 0) {
          var headerHeight = document.querySelector(".header"),
            setHeaderHeight = headerHeight ? headerHeight.offsetHeight : 0;
          header.each(function () {
            $(this).css({
              height: setHeaderHeight + "px",
            });
          });
        }
      } else {
        $(window).off("scroll.menuSticky");
      }
    }

    var minWidth = window.matchMedia("(min-width: 992px)");
    if (header.hasClass("sticky-active")) {
      menuSticky(minWidth);
    }

    if ($.fn.meanmenu) {
      $(".mobile-menu-items").meanmenu({
        meanMenuContainer: ".side-menu-wrap",
        meanScreenWidth: "992",
        meanMenuCloseSize: "30px",
        meanRemoveAttrs: true,
        meanExpand: ['<i class="fa-solid fa-caret-down"></i>'],
      });
    } else {
      console.info("meanmenu not present — mobile menu fallback.");
    }

    $(".mobile-side-menu-toggle").on("click", function () {
      $(".mobile-side-menu, .mobile-side-menu-overlay").toggleClass("is-open");
    });

    $(".mobile-side-menu-close, .mobile-side-menu-overlay").on(
      "click",
      function () {
        $(".mobile-side-menu, .mobile-side-menu-overlay").removeClass(
          "is-open"
        );
      }
    );

    (function () {
      $("#popup-search-box").removeClass("toggled");

      $(".dl-search-icon").on("click", function (e) {
        e.stopPropagation();
        $("#popup-search-box").toggleClass("toggled");
        $("#popup-search").focus();
      });

      $("#popup-search-box input").on("click", function (e) {
        e.stopPropagation();
      });

      $("#popup-search-box, body").on("click", function () {
        $("#popup-search-box").removeClass("toggled");
      });
    })();

    function sideBox() {
      $("body").removeClass("open-sidebar");
      $(document).on("click", ".sidebar-trigger", function (e) {
        e.preventDefault();
        $("body").toggleClass("open-sidebar");
      });
      $(document).on(
        "click",
        ".sidebar-trigger.close, #sidebar-overlay",
        function (e) {
          e.preventDefault();
          $("body.open-sidebar").removeClass("open-sidebar");
        }
      );
    }
    sideBox();

    if (typeof VenoBox === "function") {
      try {
        new VenoBox({
          selector: ".video-popup, .img-popup",
          bgcolor: "transparent",
          numeration: true,
          infinigall: true,
          spinner: "plane",
        });
      } catch (e) {
        console.warn("VenoBox init failed:", e);
      }
    } else {
      console.info("VenoBox not present — skipping gallery popup init.");
    }

    $("[data-background]").each(function () {
      var bg = $(this).attr("data-background");
      if (bg) {
        $(this).css("background-image", "url(" + bg + ")");
      }
    });

    try {
      $("body").append('<div class="mt-cursor"></div>');
      var cursor = $(".mt-cursor"),
        linksCursor = $("a, .swiper-nav, button, .cursor-effect"),
        crossCursor = $(".cross-cursor");

      $(window).on("mousemove.cursor", function (e) {
        cursor.css({
          transform:
            "translate(" + (e.clientX - 15) + "px," + (e.clientY - 15) + "px)",
          visibility: "inherit",
        });
      });
    } catch (e) {
      console.warn("cursor init failed:", e);
    }

    if ($.fn.waypoint && $(".odometer").length) {
      try {
        $(".odometer").waypoint(
          function () {
            var odo = $(".odometer");
            odo.each(function () {
              var countNumber = $(this).attr("data-count");
              $(this).html(countNumber);
            });
          },
          {
            offset: "80%",
            triggerOnce: true,
          }
        );
      } catch (e) {
        console.warn("odometer/waypoint handler failed:", e);
      }
    } else {
      if ($(".odometer").length) {
        console.info("waypoint not present — odometer will not auto-run.");
      }
    }

    if ($.fn.niceSelect) {
      try {
        $("select").niceSelect();
      } catch (e) {
        console.warn("niceSelect init failed:", e);
      }
    } else {
    }

    function initIsotopeBlock() {
      try {
        $(".project-filter li")
          .off("click.isotope")
          .on("click.isotope", function () {
            $(".project-filter li").removeClass("active");
            $(this).addClass("active");

            var selector = $(this).attr("data-filter") || "*";
            try {
              if ($.fn.isotope) {
                $(".filter-items").isotope({
                  filter: selector,
                  animationOptions: {
                    duration: 750,
                    easing: "linear",
                    queue: false,
                  },
                });
              } else {
                console.info(
                  "isotope missing at filter click — skipping filter apply."
                );
              }
            } catch (err) {
              console.warn("isotope filter call failed:", err);
            }
            return false;
          });

        try {
          if ($.fn.isotope) {
            $(".filter-items").isotope({
              itemSelector: ".single-item",
              layoutMode: "fitRows",
              fitRows: {
                gutter: 0,
              },
            });
          } else {
            console.info(
              "isotope missing at initial layout — skipping isotope init."
            );
          }
        } catch (err) {
          console.warn("isotope initial layout failed:", err);
        }
      } catch (e) {
        console.warn("initIsotopeBlock error:", e);
      }
    }

    (function ensureIsotopeFlow() {
      var filterItemsExists = $(".filter-items").length > 0;
      if (!filterItemsExists) return;

      if ($.fn.imagesLoaded) {
        try {
          $(".filter-items").imagesLoaded(function () {
            if ($.fn.isotope) {
              initIsotopeBlock();
            } else {
              console.info("Isotope not present — loading from CDN.");
              safeLoadScript(
                "https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js",
                function () {
                  setTimeout(initIsotopeBlock, 10);
                },
                function (err) {
                  console.warn("Could not load Isotope dynamically:", err);
                }
              );
            }
          });
        } catch (e) {
          console.warn(
            "imagesLoaded callback failed, attempting direct isotope init:",
            e
          );
          if ($.fn.isotope) initIsotopeBlock();
          else {
            safeLoadScript(
              "https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js",
              function () {
                setTimeout(initIsotopeBlock, 10);
              }
            );
          }
        }
      } else {
        if ($.fn.isotope) {
          initIsotopeBlock();
        } else {
          console.info(
            "imagesLoaded & isotope missing — loading isotope from CDN."
          );
          safeLoadScript(
            "https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js",
            function () {
              setTimeout(initIsotopeBlock, 10);
            }
          );
        }
      }
    })();

    function safeSwiperInit(selector, options) {
      try {
        if (!document.querySelector(selector)) {
          return;
        }
        if (typeof Swiper !== "function") {
          console.info("Swiper is not loaded; skipping init for", selector);
          return;
        }
        new Swiper(selector, options);
      } catch (e) {
        console.warn("Swiper init error for", selector, e);
      }
    }

    safeSwiperInit(".category-carousel", {
      slidesPerView: 6,
      spaceBetween: 10,
      slidesPerGroup: 1,
      loop: true,
      speed: 700,
      autoplay: false,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".category-section .swiper-prev",
        prevEl: ".category-section .swiper-next",
      },
      breakpoints: {
        320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 20 },
        450: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 20 },
        767: { slidesPerView: 3, slidesPerGroup: 1, spaceBetween: 30 },
        992: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: 30 },
        1170: { slidesPerView: 6, slidesPerGroup: 1, spaceBetween: 30 },
      },
    });

    safeSwiperInit(".shop-carousel", {
      slidesPerView: 4,
      spaceBetween: 10,
      slidesPerGroup: 1,
      loop: true,
      speed: 700,
      autoplay: false,
      grabCursor: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".fashion-section .swiper-prev",
        prevEl: ".fashion-section .swiper-next",
      },
      breakpoints: {
        320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 20 },
        767: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 30 },
        992: { slidesPerView: 3, slidesPerGroup: 1, spaceBetween: 30 },
        1170: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: 30 },
      },
    });

    safeSwiperInit(".testimonial-carousel", {
      slidesPerView: 3,
      spaceBetween: 10,
      slidesPerGroup: 1,
      loop: true,
      speed: 700,
      autoplay: false,
      grabCursor: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".testimonial-section .swiper-prev",
        prevEl: ".testimonial-section .swiper-next",
      },
      breakpoints: {
        320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 20 },
        767: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 30 },
        992: { slidesPerView: 3, slidesPerGroup: 1, spaceBetween: 30 },
      },
    });

    try {
      if (
        document.querySelector(".product-gallary-thumb") &&
        typeof Swiper === "function"
      ) {
        var thumbsSwiper = new Swiper(".product-gallary-thumb", {
          spaceBetween: 10,
          slidesPerView: 3,
          freeMode: true,
          watchSlidesProgress: true,
          direction: "vertical",
        });
        if (document.querySelector(".product-gallary")) {
          new Swiper(".product-gallary", {
            spaceBetween: 10,
            loop: true,
            navigation: {
              nextEl: ".swiper-nav-next",
              prevEl: ".swiper-nav-prev",
            },
            thumbs: { swiper: thumbsSwiper },
          });
        }
      }
    } catch (e) {
      console.warn("product gallery swiper init error:", e);
    }

    const scrollers = document.querySelectorAll(".scroller");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach(function (scroller) {
        try {
          scroller.setAttribute("data-animated", true);

          var scrollerInner = scroller.querySelector(".scroller__inner");
          if (!scrollerInner) return;

          var scrollerContent = Array.from(scrollerInner.children);
          scrollerContent.forEach(function (item) {
            var duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);
          });
        } catch (e) {
          console.warn("addAnimation error:", e);
        }
      });
    }

    try {
      var priceRange = $("#price-range"),
        priceOutput = $("#price-output span");
      if (priceRange.length && priceOutput.length) {
        priceOutput.html(priceRange.val());
        priceRange.on("change input", function () {
          priceOutput.html($(this).val());
        });
      }
    } catch (e) {
      console.warn("price range handler error:", e);
    }

    function scrollTopPercentage() {
      var scrollPercentage = function () {
        try {
          var scrollTopPos = document.documentElement.scrollTop;
          var calcHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          var scrollValue = Math.round(
            (scrollTopPos / (calcHeight || 1)) * 100
          );
          var scrollElementWrap = $("#scroll-percentage");

          if (scrollElementWrap.length) {
            scrollElementWrap.css(
              "background",
              "conic-gradient( var(--rr-color-theme-primary) " +
                scrollValue +
                "%, var(--rr-color-common-white) " +
                scrollValue +
                "%)"
            );

            if (scrollTopPos > 100) {
              scrollElementWrap.addClass("active");
            } else {
              scrollElementWrap.removeClass("active");
            }

            if (scrollValue < 96) {
              $("#scroll-percentage-value").text(scrollValue + "%");
            } else {
              $("#scroll-percentage-value").html(
                '<i class="fa-sharp fa-regular fa-arrow-up-long"></i>'
              );
            }
          }
        } catch (e) {
          console.warn("scrollPercentage error:", e);
        }
      };
      window.onscroll = scrollPercentage;
      window.onload = scrollPercentage;

      function scrollToTop() {
        try {
          document.documentElement.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } catch (e) {
          document.documentElement.scrollTop = 0;
        }
      }

      $("#scroll-percentage").on("click", scrollToTop);
    }

    scrollTopPercentage();
  });
})(jQuery);
