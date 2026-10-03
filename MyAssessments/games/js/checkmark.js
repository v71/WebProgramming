  /*!
  * checkmark.js — un modulo leggero per mostrare un checkmark animato
  * Utilizzo: Checkmark.show({ element: tuoSlot, size: 56, color: '#22a95a' });
  */
  
  const Checkmark = (function () {
      'use strict';

      const NS = 'http://www.w3.org/2000/svg';
      const PATH = 'M5.5 12.8 L10 17.3 L18.6 7.2';

      function show(opts) {

        console.log("ciao");
          opts = opts || {};
          if (typeof document === 'undefined') return Promise.resolve();

          const size = opts.size != null ? opts.size : 64;
          const rise = opts.rise != null ? opts.rise : 140;
          const duration = opts.duration != null ? opts.duration : 2200;
          const color = opts.color || '#22a95a';
          const borderColor = opts.borderColor || '#ffffff';
          const borderPx = opts.borderWidth != null ? opts.borderWidth : size * 0.07;
          const reduced = opts.respectReducedMotion !== false &&
              window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          // Calcolo delle coordinate (da un elemento specifico o da frazioni dello schermo)
          let x, y;
          if (opts.element && opts.element.getBoundingClientRect) {
              const r = opts.element.getBoundingClientRect();
              x = r.left + r.width / 2;
              y = r.top + r.height / 2;
          } else {
              const o = opts.origin || {};
              x = (o.x != null ? o.x : 0.5) * window.innerWidth;
              y = (o.y != null ? o.y : 0.5) * window.innerHeight;
          }

          // Creazione struttura DOM
          const box = document.createElement('div');
          box.setAttribute('aria-hidden', 'true');
          box.style.cssText =
              'position:fixed;pointer-events:none;opacity:0;will-change:transform,opacity;' +
              'width:' + size + 'px;height:' + size + 'px;' +
              'left:' + (x - size / 2) + 'px;top:' + (y - size / 2) + 'px;' +
              'z-index:' + (opts.zIndex != null ? opts.zIndex : 9999) + ';';

          const svg = document.createElementNS(NS, 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('width', size);
          svg.setAttribute('height', size);
          svg.style.cssText = 'display:block;overflow:visible;filter:drop-shadow(0 2px 5px rgba(0,0,0,.28));';

          const unit = 24 / size;
          const lineW = size * 0.15 * unit;
          const outerW = lineW + borderPx * 2 * unit;

          function makePath(stroke, width) {
              const p = document.createElementNS(NS, 'path');
              p.setAttribute('d', PATH);
              p.setAttribute('fill', 'none');
              p.setAttribute('stroke', stroke);
              p.setAttribute('stroke-width', width);
              p.setAttribute('stroke-linecap', 'round');
              p.setAttribute('stroke-linejoin', 'round');
              return p;
          }

          const outer = makePath(borderColor, outerW);
          const inner = makePath(color, lineW);
          svg.appendChild(outer);
          svg.appendChild(inner);
          box.appendChild(svg);
          document.body.appendChild(box);

          // Animazione
          let anim;
          if (reduced) {
              anim = box.animate(
                  [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }],
                  { duration: Math.min(duration, 1400), fill: 'forwards' }
              );
          } else {
              anim = box.animate(
                  [
                      { opacity: 0, transform: 'translate3d(0,0,0)' },
                      { opacity: 1, offset: 0.12 },
                      { opacity: 1, offset: 0.55 },
                      { opacity: 0, transform: 'translate3d(0,' + (-rise) + 'px,0)' }
                  ],
                  { duration: duration, easing: 'cubic-bezier(.25,.6,.35,1)', fill: 'forwards' }
              );
          }

          return anim.finished.then(() => box.remove()).catch(() => box.remove());
      }

      return { show: show };
  })();

