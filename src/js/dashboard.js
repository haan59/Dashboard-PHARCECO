(() => {
    const DAYS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    function updateClock() {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const clock = document.getElementById('clock');
        const dateDisplay = document.getElementById('date-display');

        if (!clock || !dateDisplay) {
            return;
        }

        clock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        dateDisplay.textContent = `${DAYS[now.getDay()]}, ${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    }

    function initClock() {
        updateClock();
        setInterval(updateClock, 1000);
    }

    function initDropdowns() {
        const dropdowns = Array.from(document.querySelectorAll('[data-dropdown]'));

        function setDropdownState(dropdown, shouldOpen) {
            const menu = dropdown.querySelector('[data-dropdown-menu]');
            const toggle = dropdown.querySelector('[data-dropdown-toggle]');
            const chevron = dropdown.querySelector('[data-dropdown-chevron]');

            if (!menu || !toggle) {
                return;
            }

            menu.classList.toggle('hidden', !shouldOpen);
            toggle.setAttribute('aria-expanded', String(shouldOpen));
            toggle.classList.toggle('dropdown-toggle--active', shouldOpen);

            if (chevron) {
                chevron.classList.toggle('rotate-180', shouldOpen);
            }
        }

        function closeAllDropdowns() {
            dropdowns.forEach((dropdown) => setDropdownState(dropdown, false));
        }

        dropdowns.forEach((dropdown) => {
            const toggle = dropdown.querySelector('[data-dropdown-toggle]');
            const menu = dropdown.querySelector('[data-dropdown-menu]');

            setDropdownState(dropdown, false);

            if (!toggle || !menu) {
                return;
            }

            toggle.addEventListener('click', (event) => {
                event.stopPropagation();
                const isOpen = toggle.getAttribute('aria-expanded') === 'true';

                closeAllDropdowns();
                setDropdownState(dropdown, !isOpen);
            });

            menu.querySelectorAll('button,a').forEach((item) => {
                item.addEventListener('click', () => setDropdownState(dropdown, false));
            });
        });

        document.addEventListener('click', (event) => {
            dropdowns.forEach((dropdown) => {
                if (!dropdown.contains(event.target)) {
                    setDropdownState(dropdown, false);
                }
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAllDropdowns();
            }
        });
    }

    function initMiniCharts() {
        const OPEN_COLOR = '#89C86D';
        const CLOSED_COLOR = '#D9D9D9';
        const HOVER_COLOR = '#EFA425';
        const OPEN_FROM = 7;
        const OPEN_TO = 20;
        const HOURS_END = 23;

        function initTooltipsWithRetry() {
            const targets = Array.from(document.querySelectorAll('[data-tippy-content]'));

            if (!targets.length) {
                return;
            }

            const initTippy = () => {
                if (typeof window.tippy !== 'function') {
                    return false;
                }

                try {
                    window.tippy(targets, {
                        allowHTML: true,
                        theme: 'dashboard-tooltip',
                        placement: 'right',
                        animation: 'shift-away',
                        duration: [120, 80],
                        arrow: true,
                        offset({ reference }) {
                            const rawSkidding = 8 - reference.height / 2;
                            const clampedSkidding = Math.max(-18, Math.min(-4, Math.round(rawSkidding)));
                            return [clampedSkidding, 10];
                        },
                    });
                    return true;
                } catch {
                    return false;
                }
            };

            if (initTippy()) {
                return;
            }

            let retries = 0;
            const maxRetries = 20;
            const retryDelayMs = 120;

            const timer = setInterval(() => {
                retries += 1;

                if (initTippy()) {
                    clearInterval(timer);
                    return;
                }

                if (retries >= maxRetries) {
                    clearInterval(timer);
                    console.warn('Tippy.js was not loaded, tooltips are disabled.');
                }
            }, retryDelayMs);
        }

        document.querySelectorAll('.mini-chart').forEach((canvas) => {
            const wrap = canvas.parentElement;

            if (!wrap) {
                return;
            }

            canvas.remove();

            const barWrap = document.createElement('div');
            barWrap.style.cssText = 'display:flex;align-items:flex-end;gap:6px;width:100%;height:100%;';

            const openSlots = Array.from({ length: OPEN_TO - OPEN_FROM + 1 }, (_, i) => ({
                hour: OPEN_FROM + i,
                value: Math.floor(Math.random() * 65) + 8,
                isOpen: true,
            }));

            const closedRightSlots = Array.from({ length: Math.max(0, HOURS_END - OPEN_TO) }, (_, i) => ({
                hour: OPEN_TO + 1 + i,
                value: 0,
                isOpen: false,
            }));

            const slots = [...openSlots, ...closedRightSlots];
            const maxVal = Math.max(...openSlots.map((slot) => slot.value), 1);

            slots.forEach((slot) => {
                const heightPct = slot.isOpen ? Math.max(18, Math.round((slot.value / maxVal) * 100)) : 18;

                const bar = document.createElement('div');
                bar.style.cssText = `flex:1;height:${heightPct}%;background:${slot.isOpen ? OPEN_COLOR : CLOSED_COLOR};transition:background 0.15s ease;cursor:${slot.isOpen ? 'pointer' : 'default'};`;

                if (slot.isOpen) {
                    bar.setAttribute('data-tippy-content', `<div class="mini-chart-tooltip"><span class="mini-chart-tooltip__time">${slot.hour}:00-${slot.hour + 1}:00</span><span class="mini-chart-tooltip__value">${slot.value}</span></div>`);
                    bar.addEventListener('mouseenter', () => {
                        bar.style.background = HOVER_COLOR;
                    });
                    bar.addEventListener('mouseleave', () => {
                        bar.style.background = OPEN_COLOR;
                    });
                }

                barWrap.appendChild(bar);
            });

            wrap.appendChild(barWrap);
        });

        initTooltipsWithRetry();
    }

    function initDashboard() {
        initClock();
        initDropdowns();
        initMiniCharts();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }
})();
