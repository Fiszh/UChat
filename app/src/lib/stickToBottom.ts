export type StickToBottomOptions = {
    instant?: () => boolean;
    smoothness?: () => number;
    threshold?: number;
};

const FRAME = 1000 / 60;
const USER_SCROLL_WINDOW = 500;

export function stickToBottom(
    el: HTMLElement,
    {
        instant = () => false,
        smoothness = () => 0.15,
        threshold = 80,
    }: StickToBottomOptions = {},
): () => void {
    const distance = () => el.scrollHeight - el.clientHeight - el.scrollTop;

    let following = true;
    let userUntil = 0;
    let raf = 0;
    let lastFrame = 0;

    const prevBehavior = el.style.scrollBehavior;
    const plainScroll = () => {
        if (el.style.scrollBehavior !== "auto")
            el.style.scrollBehavior = "auto";
    };

    plainScroll();

    const jump = () => {
        plainScroll();
        el.scrollTop = el.scrollHeight;
    };

    function tick(now: number) {
        raf = 0;
        if (!following) return;

        const remaining = distance();

        if (instant() || remaining <= 1) return jump();

        const dt = lastFrame ? Math.min(100, now - lastFrame) : FRAME;
        lastFrame = now;

        const s = Math.min(1, Math.max(0.01, smoothness()));
        const ease = 1 - Math.pow(1 - s, dt / FRAME);

        plainScroll();
        const before = el.scrollTop;
        el.scrollTop = before + Math.max(1, remaining * ease);

        if (el.scrollTop == before) return;
        raf = requestAnimationFrame(tick);
    }

    function request() {
        if (!following && distance() <= threshold) following = true;
        if (!following) return;

        if (instant()) {
            jump();
        } else if (!raf) {
            lastFrame = 0;
            raf = requestAnimationFrame(tick);
        }
    }

    const markUser = () => (userUntil = performance.now() + USER_SCROLL_WINDOW);

    const onWheel = (e: WheelEvent) => {
        if (e.deltaY < 0) markUser();
    };

    function onScroll() {
        if (performance.now() > userUntil) return;

        following = distance() <= threshold;
        if (following) request();
    }

    const observed = new Set<Element>();
    const ro = new ResizeObserver(request);
    const mo = new MutationObserver(() => {
        sync();
        request();
    });

    function sync() {
        for (const child of el.children) {
            if (observed.has(child)) continue;

            observed.add(child);
            ro.observe(child);
        }

        for (const child of observed) {
            if (child.parentElement == el) continue;

            observed.delete(child);
            ro.unobserve(child);
        }
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchmove", markUser, { passive: true });
    el.addEventListener("load", request, true);
    el.addEventListener("error", request, true);

    ro.observe(el);
    mo.observe(el, { childList: true });
    sync();
    jump();

    return () => {
        cancelAnimationFrame(raf);

        ro.disconnect();
        mo.disconnect();

        el.removeEventListener("scroll", onScroll);
        el.removeEventListener("wheel", onWheel);
        el.removeEventListener("touchmove", markUser);
        el.removeEventListener("load", request, true);
        el.removeEventListener("error", request, true);

        el.style.scrollBehavior = prevBehavior;
    };
}
