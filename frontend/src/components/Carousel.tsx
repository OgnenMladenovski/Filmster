import { useRef, useState, useEffect, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Carousel({ children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateArrows();
  });

  function scrollBy(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
    setTimeout(updateArrows, 350);
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        className="carousel-arrow"
        style={{ left: -8 }}
        onClick={() => scrollBy(-1)}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        ‹
      </button>
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}
      >
        {children}
      </div>
      <button
        className="carousel-arrow"
        style={{ right: -8 }}
        onClick={() => scrollBy(1)}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}
