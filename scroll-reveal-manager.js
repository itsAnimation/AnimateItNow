(function(){
  class ScrollRevealManager {
    constructor(){
      if (ScrollRevealManager._instance){
        return ScrollRevealManager._instance;
      }
      this.elements = new Set();
      this.prefersReducedMotion = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;
      this.observer = this.prefersReducedMotion ? null : new IntersectionObserver(this.onIntersect.bind(this), { threshold: 0.1 });
      ScrollRevealManager._instance = this;
    }
    observe(el){
      if (!el) return;
      if (this.prefersReducedMotion){
        el.classList.add('visible');
        return;
      }
      this.elements.add(el);
      this.observer.observe(el);
    }
    disconnect(){
      if (this.observer) {
        this.observer.disconnect();
      }
      this.elements.clear();
    }
    onIntersect(entries){
      entries.forEach((entry)=>{
        if (entry.isIntersecting){
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
          this.elements.delete(entry.target);
        }
      });
    }
  }
  if (!window.scrollRevealManager){
    window.scrollRevealManager = new ScrollRevealManager();
  }
})();
