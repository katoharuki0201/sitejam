const animation = lottie.loadAnimation({
  container: document.getElementById('hero-animation'),
  renderer: 'svg',
  loop: false,
  autoplay: true,
  path: './animation/hero-animation.json',
});

animation.addEventListener('complete', function () {
  const fps = 60;
  const loopStart = 4.8 * fps;
  const loopEnd = 9.4 * fps;
  animation.playSegments([loopStart, loopEnd], true);
  animation.loop = true;
});

gsap.registerPlugin(ScrollTrigger);

const hSections = gsap.utils.toArray(
  '.content .about, .content .voom, .content .activity, .content .messages',
);

// ↓ 追加
let voomAnimated = false;
let activityAnimated = false;

const tl = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: {
    trigger: '.main',
    start: 'top top',
    end: () => {
      const totalScroll = hSections.reduce((sum, sec) => {
        return sum + (sec.scrollHeight - sec.clientHeight);
      }, 0);
      return '+=' + (totalScroll + window.innerHeight * 0.5 * (hSections.length - 1));
    },
    pin: true,
    scrub: true,
    invalidateOnRefresh: true,
    // ↓ 追加
    onUpdate: (self) => {
      if (!voomAnimated) {
        const xPercent = gsap.getProperty('.content', 'xPercent');
        if (xPercent <= -50) {
          voomAnimated = true;
          document.querySelector('.voom').classList.add('is-active');
        }
      }
      // ↓ 追加
      if (!activityAnimated) {
        const xPercent = gsap.getProperty('.content', 'xPercent');
        if (xPercent <= -150) {
          activityAnimated = true;
          document.querySelector('.activity').classList.add('is-active');
        }
      }
    },
  },
});

hSections.forEach((section, i) => {
  const scrollable = section.scrollHeight - section.clientHeight;
  const label = 'section-' + i;

  if (scrollable > 0) {
    tl.to(section, { y: -scrollable, duration: scrollable }, label);

    if (section.classList.contains('about')) {
      const rows = gsap.utils.toArray('.history-card-row');
      const offset = window.innerHeight * 0.5;
      const remaining = scrollable - offset;
      const rowDuration = remaining / rows.length;

      tl.fromTo(
        '.history-line',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', ease: 'none', duration: remaining },
        label + '+=' + offset,
      );

      rows.forEach((row, rowIndex) => {
        const isReverse = row.classList.contains('is-reverse');
        tl.fromTo(
          row,
          { opacity: 0, x: isReverse ? -50 : 50 },
          { opacity: 1, x: 0, duration: rowDuration * 1.0, ease: 'power2.out' },
          label + '+=' + (offset + rowDuration * rowIndex),
        );
      });
    }

    if (section.classList.contains('activity')) {
      const items = gsap.utils.toArray('.activity-item');
      const offset = window.innerHeight * 0.1;
      const remaining = scrollable - offset;
      const itemDuration = remaining / items.length;

      items.forEach((item, itemIndex) => {
        const isReverse = item.classList.contains('is-reverse');
        tl.fromTo(
          item,
          { opacity: 0, x: isReverse ? 50 : -50 },
          { opacity: 1, x: 0, duration: itemDuration * 0.8, ease: 'power2.out' },
          label + '+=' + (offset + itemDuration * itemIndex),
        );
      });
    }
  }

  if (hSections[i + 1]) {
    tl.to('.content', {
      xPercent: -100 * (i + 1),
      duration: window.innerHeight * 0.5,
    });
  }
});
