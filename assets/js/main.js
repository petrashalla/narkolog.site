Fancybox.bind("[data-fancybox]", {
	// Your custom options
});

// animation
const animationItems = document.querySelectorAll(".animation-item");
if (animationItems.length > 0) {
	function onEntry(e) {
		e.forEach((e) => {
			e.isIntersecting && e.target.classList.add("animation-active");
		});
	}
	let options = {
			threshold: [0.5],
		},
		observer = new IntersectionObserver(onEntry, options);
	for (let e of animationItems) observer.observe(e);
}
// end animation

let scrollWidthFunc = () => {
	let scrollWidth = window.innerWidth - document.body.clientWidth;
	document.querySelector("html").style.paddingRight = scrollWidth + "px";
	//document.querySelector("header").style.paddingRight = scrollWidth + "px";
};

// scroll top
/* scroll top */
const scrollTop = document.querySelector(".scroll-top");

if (scrollTop) {
	const showAfter = 260;
	function updateScrollTop() {
		scrollTop.hidden = window.scrollY < showAfter;
	}
	updateScrollTop();
	window.addEventListener("scroll", updateScrollTop, { passive: true });
	window.addEventListener("pageshow", updateScrollTop);
	scrollTop.addEventListener("click", function (event) {
		event.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });
	});
}
/* end scroll top */

document.addEventListener("DOMContentLoaded", function () {
	/* burger menu */
	const burgerMenu = document.querySelector(".burger");
	if (burgerMenu) {
		const headerMobile = document.querySelector(".header__bottom");
		burgerMenu.addEventListener("click", () => {
			if (burgerMenu.classList.contains("active")) {
				document.body.classList.remove("burger-lock");
			} else {
				document.body.classList.add("burger-lock");
			}
			headerMobile.classList.toggle("active");
			burgerMenu.classList.toggle("active");

			document.querySelector("html").classList.toggle("burger-lock");
		});
	}
	/* end burger menu */

	/* header */
	const headerBlock = document.querySelector(".header");
	if (headerBlock) {
		const headerBurger = headerBlock.querySelector(".burger");
		const headerTop = headerBlock.querySelector(".header__top");
		const headerMiddle = headerBlock.querySelector(".header__middle");
		const headerToggles = headerBlock.querySelectorAll(".header__toggle");

		if (headerBurger) {
			headerBurger.addEventListener("click", function () {
				const isActive = this.classList.contains("active");
				headerBlock.classList.toggle("header--open", isActive);
			});
		}

		function updateHeader() {
			if (window.innerWidth > 1024) {
				if (headerBurger && headerBurger.classList.contains("active")) {
					headerBurger.click();
				}
				if (headerTop && headerMiddle) {
					const headerOffset = headerTop.offsetHeight + headerMiddle.offsetHeight;
					headerBlock.style.setProperty("--header-offset", -headerOffset + "px");
				}
				headerToggles.forEach((btn) => {
					const item = btn.closest(".header__item");
					if (item) item.classList.remove("active");
				});
			} else {
				headerBlock.style.setProperty("--header-offset", "0px");
			}
		}

		updateHeader();
		window.addEventListener("load", updateHeader);
		window.addEventListener("resize", updateHeader);

		headerToggles.forEach((btn) => {
			btn.addEventListener("click", function () {
				if (window.innerWidth > 1024) return;
				const item = this.closest(".header__item");
				if (item) {
					item.classList.toggle("active");
				}
			});
		});

		const headerItems = headerBlock.querySelectorAll(".header__item");
		headerItems.forEach((item) => {
			function checkDropdown() {
				if (window.innerWidth <= 1024) return;
				const dropdown = item.querySelector(":scope > .header__dropdown");
				if (dropdown) {
					dropdown.classList.remove("header__dropdown--left");
					const dropdownPosition = dropdown.getBoundingClientRect();
					dropdown.classList.toggle("header__dropdown--left", dropdownPosition.right > window.innerWidth - 10);
				}
			}
			item.addEventListener("mouseenter", checkDropdown);
			item.addEventListener("focusin", checkDropdown);
		});

		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && headerBurger && headerBurger.classList.contains("active")) {
				headerBurger.click();
				headerBurger.focus();
			}
		});
	}
	/* end header */

	// Popups
	function popupClose(popupActive) {
		popupActive.classList.remove("open");
		setTimeout(() => {
			if (!popupActive.classList.contains("open")) {
				popupActive.classList.remove("active");
			}
		}, 400);
		document.body.classList.remove("lock");
		document.querySelector("html").style.paddingRight = 0;
		document.querySelector("html").classList.remove("lock");
	}
	const popupOpenBtns = document.querySelectorAll(".popup-btn");
	const popups = document.querySelectorAll(".popup");
	const originalTitlePopup2 = document.querySelector(".original-title")?.innerHTML;
	const closePopupBtns = document.querySelectorAll(".close-popup-btn");
	closePopupBtns.forEach(function (el) {
		el.addEventListener("click", function (e) {
			popupClose(e.target.closest(".popup"));
		});
	});
	popupOpenBtns.forEach(function (el) {
		el.addEventListener("click", function (e) {
			e.preventDefault();
			const path = e.currentTarget.dataset.path;
			const currentPopup = document.querySelector(`[data-target="${path}"]`);
			if (currentPopup) {
				popups.forEach(function (popup) {
					popupClose(popup);
					popup.addEventListener("click", function (e) {
						if (!e.target.closest(".popup__content")) {
							popupClose(e.target.closest(".popup"));
						}
					});
				});
				currentPopup.classList.add("active");
				setTimeout(() => {
					currentPopup.classList.add("open");
				}, 10);
				if (currentPopup.getAttribute("data-target") == "popup-change") {
					let originaTitle = currentPopup.querySelector(".original-title");
					if (el.classList.contains("change-item__btn")) {
						if (el.classList.contains("doctor__btn-js")) {
							let currentItem = el.closest(".change-item");
							let currentTitile = currentItem.querySelector(".change-item__title");
							originaTitle.innerHTML = "Записаться на приём к врачу: " + currentTitile.innerHTML;
						} else {
							if (el.classList.contains("change-item__btn_current")) {
								originaTitle.textContent = el.textContent;
							} else {
								let currentItem = el.closest(".change-item");
								let currentTitile = currentItem.querySelector(".change-item__title");
								originaTitle.innerHTML = currentTitile.innerHTML;
							}
						}
					} else {
						originaTitle.innerHTML = originalTitlePopup2;
					}
				}

				if (currentPopup.getAttribute("data-target") == "popup-jobs") {
					let currentItems = el.closest(".jobs__items");
					let originalText = currentPopup.querySelector(".jobs__inner_original");
					if (originalText && currentItems.querySelector(".jobs__inner")) {
						originalText.innerHTML = currentItems.querySelector(".jobs__inner").innerHTML;
					}
				}
				e.stopPropagation();
				scrollWidthFunc();
				document.querySelector("html").classList.add("lock");
			}
		});
	});
	// end popups

	/* yandex map */
	const mapPlaceholder = document.getElementById("map-placeholder");
	if (mapPlaceholder) {
		mapPlaceholder.addEventListener("mouseenter", loadMap, { once: true });
		mapPlaceholder.addEventListener("click", loadMap, { once: true });
	} else {
		loadMap();
	}

	function loadMap() {
		if (!document.querySelector('[src="https://api-maps.yandex.ru/2.1/?lang=ru_RU"]')) {
			const script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
			script.onload = initMap;
			document.head.appendChild(script);
		} else {
			initMap();
		}
	}

	function initMap() {
		const mapPlaceholder = document.getElementById("map-placeholder");
		if (mapPlaceholder) {
			mapPlaceholder.remove();
		}

		ymaps.ready(function () {
			const myMap = new ymaps.Map("map", {
				center: [47.231129, 39.728721],
				zoom: 13,
				controls: [],
			});

			const myPlacemark = new ymaps.Placemark(
				[47.231129, 39.728721],
				{
					hintContent: "Ростов-на-Дону, ул. Красноармейская, д. 227",
					balloonContent: "Ростов-на-Дону, ул. Красноармейская, д. 227",
				},
				{
					iconLayout: "default#image",
					iconImageHref: "assets/img/icons/map-pin.svg", //заменить на свою иконку
					iconImageSize: [35, 35],
					iconImageOffset: [-15, -15],
				},
			);

			myMap.geoObjects.add(myPlacemark);
			myMap.behaviors.disable(["scrollZoom"]);
		});
	}
	/* end yandex map */

	/* home promos timer */
	const promoTimers = document.querySelectorAll(".js-timer");
	if (promoTimers.length) {
		function updatePromoTimers() {
			const now = new Date();
			const endOfDay = new Date(now);
			endOfDay.setHours(24, 0, 0, 0);

			const remainingSeconds = Math.ceil((endOfDay - now) / 1000);
			const hours = Math.floor(remainingSeconds / 3600);
			const minutes = Math.floor((remainingSeconds % 3600) / 60);
			const seconds = remainingSeconds % 60;
			const value = [hours, minutes, seconds].map((number) => String(number).padStart(2, "0")).join(":");

			promoTimers.forEach((timer) => {
				timer.textContent = value;
			});
		}

		updatePromoTimers();
		setInterval(updatePromoTimers, 1000);
		document.addEventListener("visibilitychange", updatePromoTimers);
	}
	/* end home promos timer */

	/* services list */
	document.querySelectorAll(".services").forEach((block) => {
		const viewport = block.querySelector(".services__list-viewport");
		const list = block.querySelector(".services__list");
		const moreButton = block.querySelector(".services__more");
		if (!viewport || !list || !moreButton) return;

		const buttonText = moreButton.querySelector("span");
		const items = Array.from(list.children);
		const initialCount = 5;
		let expanded = false;

		function updateServicesList() {
			const visibleCount = expanded ? items.length : Math.min(initialCount, items.length);
			const listTop = list.getBoundingClientRect().top;
			const lastItem = items[visibleCount - 1];
			items.forEach((item, index) => {
				item.inert = index >= visibleCount;
			});
			viewport.style.maxHeight = lastItem ? Math.ceil(lastItem.getBoundingClientRect().bottom - listTop) + "px" : "0px";
			moreButton.hidden = items.length <= initialCount;
			moreButton.classList.toggle("services__more--expanded", expanded);
			if (buttonText) {
				buttonText.textContent = expanded ? "Скрыть" : "Показать ещё";
			}
		}

		updateServicesList();
		moreButton.addEventListener("click", () => {
			expanded = !expanded;
			updateServicesList();
		});
		window.addEventListener("resize", updateServicesList);
		if (document.fonts) {
			document.fonts.ready.then(updateServicesList);
		}
	});
	/* end services list */

	/*  search */
	const inputSearch = document.querySelectorAll("input[type=search]");
	if (inputSearch.length > 0) {
		inputSearch.forEach((elem) => {
			const wrapper = elem.closest(".search-wrapper");
			if (wrapper) {
				const searchResultBlock = wrapper.querySelector(".popup__search-result");
				const popularCitiesBlock = wrapper.querySelector(".popup__search");
				const noResultsMessage = searchResultBlock.querySelector(".no-results-message");

				function search() {
					let filter = elem.value.toUpperCase();
					let ul = wrapper.querySelectorAll(".search-list");
					let totalResults = 0;

					ul.forEach((item) => {
						let li = item.getElementsByTagName("li");
						for (let i = 0; i < li.length; i++) {
							let a = li[i].querySelector(".search-name");
							if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
								li[i].classList.remove("none");
								totalResults++;
							} else {
								li[i].classList.add("none");
							}
						}
					});
					noResultsMessage.classList.toggle("none", totalResults > 0);

					if (elem.value.trim() === "") {
						searchResultBlock.classList.add("none");
						popularCitiesBlock.classList.remove("none");
					} else {
						searchResultBlock.classList.remove("none");
						popularCitiesBlock.classList.add("none");
					}
				}
				elem.addEventListener("input", search);

				document.addEventListener("click", (event) => {
					if (!wrapper.contains(event.target)) {
						searchResultBlock.classList.add("none");
					}
				});
			}
		});
	}
	/*  end search  */

	/* accordion */
	document.querySelectorAll(".accordion").forEach((accordion) => {
		const content = accordion.querySelector(".accordion__content") || accordion.parentElement.querySelector(".accordion__content");
		if (!content) return;
		let isActive = accordion.classList.contains("active") || content.classList.contains("active");

		function updateAccordion() {
			accordion.classList.toggle("active", isActive);
			content.classList.toggle("active", isActive);
			content.style.maxHeight = isActive ? content.scrollHeight + "px" : "0px";
		}
		updateAccordion();

		accordion.addEventListener("click", () => {
			isActive = !isActive;
			updateAccordion();
		});
		window.addEventListener("load", updateAccordion);
		window.addEventListener("resize", updateAccordion);
	});
	/* end accordion */

	/*  tab  */
	const showTab = (elTabBtn) => {
		const elTab = elTabBtn.closest(".tab");
		if (elTabBtn.classList.contains("active")) {
			return;
		}
		const targetId = elTabBtn.dataset.id;
		const elTabPanes = elTab.querySelectorAll(`.tab-content[data-id="${targetId}"]`);

		const elTabBtnActive = elTab.querySelector(".tab-btn.active");
		if (elTabBtnActive) {
			elTabBtnActive.classList.remove("active");
		}

		const elTabPaneShow = elTab.querySelectorAll(".tab-content.active");
		elTabPaneShow.forEach((pane) => pane.classList.remove("active"));

		elTabBtn.classList.add("active");
		elTabPanes.forEach((pane) => pane.classList.add("active"));
	};

	const tabButtons = document.querySelectorAll(".tab-btn");
	tabButtons.forEach((btn) => {
		if (btn) {
			btn.addEventListener("click", function (e) {
				showTab(this);
				quantityElem();
			});
		}
	});
	/*  end tab */

	// quantity-card
	function quantityElem() {
		const quantityCards = document.querySelectorAll(".quantity-card");
		const quantityElement = document.querySelector(".quantity span");
		if (quantityElement) {
			let visibleCards = 0;
			quantityCards.forEach((card) => {
				if (card.offsetParent !== null) {
					visibleCards++;
				}
			});
			quantityElement.textContent = visibleCards;
		}
	}
	setTimeout(quantityElem, 100);

	/*  btn more  */
	const moreBtns = document.querySelectorAll(".btn-more");
	moreBtns.forEach((moreBtn) => {
		if (moreBtn) {
			const moreContent = moreBtn.previousElementSibling;
			console.log(moreContent);
			console.log(moreContent.scrollHeight);
			console.log(moreContent.clientHeight);

			if (moreContent.scrollHeight <= moreContent.clientHeight) {
				moreBtn.style.display = "none";
			} else {
				const textBtn = moreBtn.innerHTML;
				moreBtn.addEventListener("click", function () {
					const heightMoreContent = moreContent.style.maxHeight;
					this.classList.toggle("active");

					if (moreContent.style.maxHeight) {
						moreContent.style.maxHeight = null;
						this.textContent = textBtn;
					} else {
						moreContent.style.maxHeight = moreContent.scrollHeight + "px";
						this.textContent = "Свернуть";
					}
				});
			}
		}
	});
	/*  end btn more  */

	/* navigation */
	const articleNavigation = document.querySelector(".navigation");
	if (articleNavigation) {
		const jsScrollBlockList = document.querySelectorAll(".text-block h1, .text-block h2, .text-block h3, .text-block h4");

		if (jsScrollBlockList.length > 0) {
			for (let i = 0; i < jsScrollBlockList.length; i += 1) {
				const jsScrollBlock = jsScrollBlockList[i];
				const titleBlock = jsScrollBlock.textContent;
				const articleNavigationList = document.querySelector(".navigation__list");
				const articleNavigationItem = document.createElement("li");
				const articleNavigationLink = document.createElement("a");
				if (jsScrollBlock.tagName == "H1") {
					articleNavigationItem.classList.add("nav-title-h1");
				}
				articleNavigationItem.classList.add("navigation__item");
				if (jsScrollBlock.tagName == "H2") {
					articleNavigationItem.classList.add("nav-title-h2");
				} else if (jsScrollBlock.tagName == "H3") {
					articleNavigationItem.classList.add("nav-title-h3");
				} else if (jsScrollBlock.tagName == "H4") {
					articleNavigationItem.classList.add("nav-title-h4");
				} else if (jsScrollBlock.tagName == "H5") {
					articleNavigationItem.classList.add("nav-title-h5");
				} else if (jsScrollBlock.tagName == "H6") {
					articleNavigationItem.classList.add("nav-title-h6");
				}
				articleNavigationLink.classList.add("navigation__link");
				jsScrollBlock.setAttribute("id", `${i}`);
				articleNavigationLink.setAttribute("href", `$${i}`);
				articleNavigationLink.textContent = " " + titleBlock;
				articleNavigationItem.append(articleNavigationLink);
				articleNavigationList.append(articleNavigationItem);
			}
			document.querySelectorAll('a[href^="$"').forEach((link) => {
				link.addEventListener("click", function (e) {
					e.preventDefault();
					let href = this.getAttribute("href").substring(1);
					const scrollTarget = document.getElementById(href);
					const topOffset = 120;
					const elementPosition = scrollTarget.getBoundingClientRect().top;
					const offsetPosition = elementPosition - topOffset;
					window.scrollBy({
						top: offsetPosition,
						behavior: "smooth",
					});
				});
			});
		} else {
			if (articleNavigation.querySelector(".navigation")) {
				articleNavigation.querySelector(".navigation").remove();
			}
		}
	}
	/* end navigation */

	/* calculator */
	document.querySelectorAll(".calculator").forEach((block) => {
		const form = block.querySelector(".calculator__form");
		const range = block.querySelector(".calculator__range");
		const rangeValue = block.querySelector(".calculator__range-value");
		const totalValue = block.querySelector(".calculator__total");
		const tariffs = Array.from(block.querySelectorAll(".calculator__tariff")).sort((a, b) => Number(a.dataset.minPrice) - Number(b.dataset.minPrice));

		if (!form || !range || !rangeValue || !totalValue || !tariffs.length) return;

		function updateCalculator() {
			const days = Number(range.value);
			const minDays = Number(range.min);
			const maxDays = Number(range.max);
			const dayLabel = days === 1 ? "день" : days < 5 ? "дня" : "дней";

			let total = (days - minDays) * (Number(range.dataset.price) || 0);

			form.querySelectorAll(".calculator__radio:checked").forEach((input) => {
				total += Number(input.dataset.price) || 0;
			});

			rangeValue.textContent = days + " " + dayLabel;
			totalValue.textContent = total.toLocaleString("ru-RU");

			range.style.setProperty("--range-progress", (maxDays > minDays ? ((days - minDays) / (maxDays - minDays)) * 100 : 0) + "%");

			let currentTariff = tariffs[0];

			tariffs.forEach((tariff) => {
				if (total >= Number(tariff.dataset.minPrice)) {
					currentTariff = tariff;
				}
			});

			tariffs.forEach((tariff) => {
				tariff.hidden = tariff !== currentTariff;
			});
		}

		updateCalculator();

		form.addEventListener("input", updateCalculator);
	});
	/* end calculator */

	/* about center counters */
	document.querySelectorAll(".about").forEach((block) => {
		const cards = block.querySelectorAll(".about__card");
		if (!cards.length || !("IntersectionObserver" in window)) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;

					observer.unobserve(entry.target);

					const counters = Array.from(entry.target.querySelectorAll(".js-count"))
						.map((element) => ({
							element,
							text: element.textContent,
							value: Number(element.textContent.trim()),
						}))
						.filter((counter) => Number.isFinite(counter.value));

					if (!counters.length) return;

					const duration = 1200;
					let start = null;

					counters.forEach((counter) => {
						counter.element.textContent = "0";
					});

					function updateCount(timestamp) {
						if (start === null) start = timestamp;

						const progress = Math.min((timestamp - start) / duration, 1);
						const easedProgress = 1 - Math.pow(1 - progress, 3);

						counters.forEach((counter) => {
							counter.element.textContent = progress === 1 ? counter.text : String(Math.floor(counter.value * easedProgress));
						});

						if (progress < 1) {
							requestAnimationFrame(updateCount);
						}
					}

					requestAnimationFrame(updateCount);
				});
			},
			{
				threshold: 0.35,
			},
		);

		cards.forEach((card) => observer.observe(card));
	});
	/* end about center counters */

	/* reviewform */
	document.querySelectorAll(".reviewform__form").forEach((form) => {
		const input = form.querySelector(".reviewform__file");
		const status = form.querySelector(".reviewform__files");
		if (!input || !status) return;

		const maxFiles = 5;
		let attachedFiles = Array.from(input.files);

		input.addEventListener("change", () => {
			const nextFiles = [...attachedFiles];

			for (const file of input.files) {
				const alreadyAttached = nextFiles.some(
					(attached) => attached.name === file.name && attached.size === file.size && attached.lastModified === file.lastModified && attached.type === file.type,
				);

				if (!alreadyAttached) nextFiles.push(file);
			}

			const tooManyFiles = nextFiles.length > maxFiles;
			if (!tooManyFiles) attachedFiles = nextFiles;

			const transfer = new DataTransfer();
			attachedFiles.forEach((file) => transfer.items.add(file));
			input.files = transfer.files;

			const messages = [];

			if (tooManyFiles) {
				messages.push(`Можно прикрепить не более ${maxFiles} файлов. Новые файлы не добавлены.`);
			}

			if (attachedFiles.length) {
				const names = attachedFiles.map((file) => file.name).join(", ");
				messages.push(`Прикреплено файлов: ${attachedFiles.length} — ${names}`);
			}

			status.textContent = messages.join(" ");
		});

		form.addEventListener("reset", () => {
			attachedFiles = [];
			status.textContent = "";
		});
	});
	/* end reviewform */

	/* articles pagination */
	document.querySelectorAll(".articles").forEach((block) => {
		const list = block.querySelector(".articles__list");
		const pagination = block.querySelector(".articles__pagination");
		if (!list || !pagination) return;

		const cards = Array.from(list.querySelectorAll(".articles__card"));
		const pages = pagination.querySelector(".articles__pages");
		const prev = pagination.querySelector(".articles__page--prev");
		const next = pagination.querySelector(".articles__page--next");
		const perPage = 5;
		const pageCount = Math.ceil(cards.length / perPage);

		if (!pages || !prev || !next || pageCount <= 1) return;

		const mobile = window.matchMedia("(max-width: 768px)");
		let currentPage = 1;

		const renderPages = () => {
			const visiblePages = new Set([1, currentPage, pageCount]);
			const maxNumbers = mobile.matches ? 3 : 5;

			if (pageCount <= maxNumbers) {
				for (let page = 1; page <= pageCount; page++) {
					visiblePages.add(page);
				}
			} else {
				if (!mobile.matches || currentPage === pageCount) {
					if (currentPage > 1) visiblePages.add(currentPage - 1);
				}
				if (!mobile.matches || currentPage === 1) {
					if (currentPage < pageCount) visiblePages.add(currentPage + 1);
				}
			}

			const numbers = Array.from(visiblePages).sort((a, b) => a - b);
			const fragment = document.createDocumentFragment();

			numbers.forEach((number, index) => {
				if (index > 0 && number - numbers[index - 1] > 1) {
					const ellipsis = document.createElement("span");
					ellipsis.className = "articles__ellipsis";
					ellipsis.textContent = "...";
					fragment.append(ellipsis);
				}

				const active = number === currentPage;
				const item = document.createElement(active ? "span" : "button");
				item.className = "articles__page";
				item.textContent = number;

				if (active) {
					item.classList.add("articles__page--active");
					item.title = "Текущая страница";
				} else {
					item.type = "button";
					item.addEventListener("click", () => showPage(number, true));
				}

				fragment.append(item);
			});

			pages.replaceChildren(fragment);
			prev.disabled = currentPage === 1;
			next.disabled = currentPage === pageCount;
		};

		const showPage = (page, moveToList = false) => {
			if (page < 1 || page > pageCount) return;

			currentPage = page;
			const start = (page - 1) * perPage;

			cards.forEach((card, index) => {
				card.hidden = index < start || index >= start + perPage;
			});

			renderPages();

			if (moveToList) {
				cards[start].focus({ preventScroll: true });
				list.scrollIntoView({ block: "start" });
			}
		};

		prev.addEventListener("click", () => showPage(currentPage - 1, true));
		next.addEventListener("click", () => showPage(currentPage + 1, true));
		mobile.addEventListener("change", renderPages);

		pagination.hidden = false;
		showPage(1);
	});
	/* end articles pagination */

	/* cookie */
	const cookieBanner = document.querySelector(".cookie");
	if (cookieBanner) {
		const cookieAcceptedKey = "narkolog.cookie.accepted";
		const cookieDismissedKey = "narkolog.cookie.dismissed";
		let showCookieBanner = true;
		try {
			showCookieBanner = localStorage.getItem(cookieAcceptedKey) !== "1" && sessionStorage.getItem(cookieDismissedKey) !== "1";
		} catch {
			// Если хранилище недоступно, плашку всё равно можно закрыть.
		}

		if (showCookieBanner) {
			cookieBanner.hidden = false;
			cookieBanner.addEventListener("click", function (event) {
				const button = event.target.closest(".cookie__accept, .cookie__close");
				if (!button) return;
				cookieBanner.hidden = true;
				try {
					if (button.classList.contains("cookie__accept")) {
						localStorage.setItem(cookieAcceptedKey, "1");
					} else {
						sessionStorage.setItem(cookieDismissedKey, "1");
					}
				} catch {}
			});
		}
	}
	/* end cookie */

	/* helpwidget */
	document.querySelectorAll(".helpwidget").forEach((widget) => {
		const toggle = widget.querySelector(".helpwidget__toggle");
		const panel = widget.querySelector(".helpwidget__panel");
		const close = widget.querySelector(".helpwidget__close");
		if (!toggle || !panel || !close) return;

		function setWidgetOpen(isOpen) {
			toggle.hidden = isOpen;
			panel.hidden = !isOpen;
			const focusTarget = isOpen ? close : toggle;
			focusTarget.focus({ preventScroll: true });
		}

		toggle.addEventListener("click", function () {
			setWidgetOpen(true);
		});

		close.addEventListener("click", function () {
			setWidgetOpen(false);
		});

		widget.addEventListener("keydown", function (event) {
			if (event.key === "Escape" && !panel.hidden && !document.querySelector(".popup.active")) {
				setWidgetOpen(false);
			}
		});
	});
	/* end helpwidget */
});

/* multi-step calculator */
document.querySelectorAll(".calcpage").forEach((block) => {
	const form = block.querySelector(".calcpage__form");
	const steps = Array.from(block.querySelectorAll(".calcpage__step"));
	const progressValue = block.querySelector(".calcpage__progress-value");
	const progressText = block.querySelector(".calcpage__progress-text");
	const receiptList = block.querySelector(".calcpage__receipt-list");
	const totalValue = block.querySelector(".calcpage__total-value");
	const submitPrice = block.querySelector(".calcpage__submit-price");

	if (!form || !steps.length || !progressValue || !progressText) return;

	let currentStep = 0;

	function formatPrice(value) {
		return Number(value).toLocaleString("ru-RU") + " ₽";
	}

	function createReceiptRow(label, price) {
		const row = document.createElement("div");
		const name = document.createElement("span");
		const value = document.createElement("span");

		row.className = "calcpage__receipt-row";
		name.textContent = label;
		value.textContent = formatPrice(price);
		row.append(name, value);

		return row;
	}

	function updateReceipt() {
		const duration = form.querySelector('input[name="calc-duration"]:checked');
		const place = form.querySelector('input[name="calc-place"]:checked');
		const extras = Array.from(form.querySelectorAll('input[name="calc-extra"]:checked'));
		const selected = [];
		let total = 0;

		if (currentStep === 0) {
			selected.push({
				value: "Время прибытия",
				dataset: {
					label: "Время прибытия",
					price: "3500",
				},
			});
		} else if (duration) {
			selected.push(duration);
		}

		if (place) selected.push(place);
		if (currentStep >= 2) selected.push(...extras);

		if (receiptList) receiptList.innerHTML = "";

		selected.forEach((input) => {
			const price = Number(input.dataset.price) || 0;
			total += price;

			if (receiptList) {
				receiptList.append(createReceiptRow(input.dataset.label || input.value, price));
			}
		});

		if (totalValue) totalValue.textContent = formatPrice(total);
		if (submitPrice) submitPrice.textContent = formatPrice(total);
	}

	function showStep(index) {
		currentStep = Math.max(0, Math.min(index, steps.length - 1));

		steps.forEach((step, stepIndex) => {
			step.hidden = stepIndex !== currentStep;
		});

		progressValue.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
		progressText.textContent = "Шаг " + (currentStep + 1) + " из " + steps.length;
		updateReceipt();
	}

	block.querySelectorAll(".calcpage__next").forEach((button) => {
		button.addEventListener("click", function () {
			showStep(currentStep + 1);
		});
	});

	block.querySelectorAll(".calcpage__back").forEach((button) => {
		button.addEventListener("click", function () {
			showStep(currentStep - 1);
		});
	});

	const restart = block.querySelector(".calcpage__restart");

	if (restart) {
		restart.addEventListener("click", function () {
			showStep(2);
		});
	}

	form.addEventListener("input", function (event) {
		if (event.target.matches('input[name="calc-duration"], input[name="calc-place"], input[name="calc-extra"]')) {
			updateReceipt();
		}
	});

	showStep(0);
});
/* end multi-step calculator */
