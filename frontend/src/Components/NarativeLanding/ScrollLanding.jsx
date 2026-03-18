import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ScrollLanding.css";

const CLOTHES = [
  {
    id: "streetwear",
    label: "STREETWEAR",
    sub: "Own the block",
    accent: "#c36522",
    tag: "Men / Women",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=700&q=90",
    route: "/product/men",
  },
  {
    id: "formal",
    label: "FORMAL",
    sub: "Command the room",
    accent: "#c9b99a",
    tag: "Men",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&q=90",
    route: "/product/men",
  },
  {
    id: "sport",
    label: "SPORT",
    sub: "Built to move",
    accent: "#7ab87a",
    tag: "Men / Women",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=90",
    route: "/product/men",
  },
  {
    id: "resort",
    label: "RESORT",
    sub: "Escape every day",
    accent: "#e8c98a",
    tag: "Women",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=90",
    route: "/product/women",
  },
  {
    id: "outerwear",
    label: "OUTERWEAR",
    sub: "Layer up, stand out",
    accent: "#aabcab",
    tag: "Men / Women",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=700&q=90",
    route: "/product/men",
  },
];

const TOTAL_ITEMS = CLOTHES.length;

export default function ScrollLanding() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollRatio(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // 0 → first item already visible, each scroll segment = 1 item
  // We reserve 0.8 of total scroll for items, 0.2 for final CTA
  const globalProgress = scrollRatio * (TOTAL_ITEMS - 1 + 0.8);
  const activeIndex = Math.min(Math.floor(globalProgress), TOTAL_ITEMS - 1);
  const activeProgress = globalProgress - activeIndex;

  const getItemStyle = (i) => {
    const diff = i - globalProgress;
    // Items to the right (not yet arrived): rotated back, shifted right
    // Items to the left (passed): rotated away, shifted left
    const rotateY = diff * 52;
    const translateZ = -Math.abs(diff) * 380;
    const translateX = diff * 140;
    const scale = Math.max(0.45, 1 - Math.abs(diff) * 0.2);
    const opacity = Math.max(0, 1 - Math.abs(diff) * 0.5);
    const blur = Math.min(Math.abs(diff) * 3, 8);
    const zIndex = Math.round(100 - Math.abs(diff) * 10);

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      filter: blur > 0 ? `blur(${blur}px)` : "none",
      zIndex,
    };
  };

  const activeItem = CLOTHES[activeIndex];
  const showFinal = globalProgress >= TOTAL_ITEMS - 0.2;

  return (
    <div ref={containerRef} className="hs-root">
      <div className="hs-scene">

        {/* Background */}
        <div className="hs-bg" />

        {/* Accent glow */}
        <div
          className="hs-glow"
          style={{ background: activeItem?.accent, transition: "background 0.8s ease" }}
        />

        {/* ── RAIL BAR at top ── */}
        <div className="hs-rail-bar">
          <div className="hs-rail-rod" />
          {/* Moving hooks that track each item */}
          {CLOTHES.map((_, i) => {
            const diff = i - globalProgress;
            return (
              <div
                key={i}
                className="hs-hook-wrap"
                style={{
                  transform: `translateX(${diff * 140}px)`,
                  opacity: Math.max(0, 1 - Math.abs(diff) * 0.55),
                }}
              >
                <div className="hs-hook-curve" />
                <div className="hs-hook-stem" />
              </div>
            );
          })}
        </div>

        {/* ── 3D CAROUSEL ── */}
        <div className="hs-stage">
          {CLOTHES.map((item, i) => (
            <div key={item.id} className="hs-card-wrap" style={getItemStyle(i)}>
              {/* String from hook to card */}
              <div className="hs-string" />

              {/* Cloth photo card */}
              <div className="hs-card" style={{ borderColor: item.accent + "50" }}>
                <img
                  src={item.image}
                  alt={item.label}
                  className="hs-card-img"
                  loading="eager"
                />
                <div className="hs-card-gradient" />
                <div className="hs-card-info">
                  <span className="hs-card-tag" style={{ color: item.accent }}>
                    {item.tag}
                  </span>
                  <h2 className="hs-card-label">{item.label}</h2>
                  <p className="hs-card-sub">{item.sub}</p>
                </div>
                {/* Active border highlight */}
                {i === activeIndex && (
                  <div
                    className="hs-card-active-border"
                    style={{ borderColor: item.accent }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── BOTTOM INFO ── */}
        <div className="hs-bottom">
          <div className="hs-bottom-left">
            <div className="hs-counter" style={{ color: activeItem?.accent }}>
              <span className="hs-counter-current">0{activeIndex + 1}</span>
              <span className="hs-counter-sep">/</span>
              <span className="hs-counter-total">0{TOTAL_ITEMS}</span>
            </div>
            <div className="hs-progress-bar">
              {CLOTHES.map((item, i) => (
                <div
                  key={item.id}
                  className="hs-progress-seg"
                  style={{
                    background: i <= activeIndex ? item.accent : "rgba(255,255,255,0.12)",
                    opacity: i === activeIndex ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
          </div>

          <button
            className="hs-shop-btn"
            style={{ borderColor: activeItem?.accent, color: activeItem?.accent }}
            onClick={() => navigate(activeItem?.route)}
          >
            SHOP {activeItem?.label}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* ── SIDE DOTS ── */}
        <div className="hs-dots">
          {CLOTHES.map((item, i) => (
            <div
              key={item.id}
              className="hs-dot"
              style={{
                background: i === activeIndex ? item.accent : "rgba(255,255,255,0.18)",
                transform: `scale(${i === activeIndex ? 1.6 : 1})`,
              }}
            />
          ))}
        </div>

        {/* ── FINAL CTA ── */}
        {showFinal && (
          <div className="hs-final">
            <p className="hs-final-eye">THE FULL COLLECTION</p>
            <button className="hs-final-btn" onClick={() => navigate("/product/men")}>
              EXPLORE ALL
            </button>
          </div>
        )}
      </div>

      {/* Scroll height: hero + items + final breathing room */}
      <div style={{ height: `${(TOTAL_ITEMS + 1) * 100}vh` }} />
    </div>
  );
}