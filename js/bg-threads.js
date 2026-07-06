// Generates the faint vertical "thread" lines drifting behind the whole page
(function () {
  const bgThreads = document.getElementById('bg-threads');
  if (!bgThreads) return;

  [6, 18, 32, 50, 64, 78, 90].forEach((p, i) => {
    const t = document.createElement('div');
    t.className = 'thread-line';
    t.style.cssText = `left:${p}%;top:0;height:100%;animation-delay:${i * 0.6}s;animation-duration:${3.5 + i * 0.5}s`;
    bgThreads.appendChild(t);
  });
})();
