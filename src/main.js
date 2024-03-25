import TinyGesture from 'tinygesture';
import Alpine from 'alpinejs'
 
window.Alpine = Alpine
 
document.addEventListener("alpine:init", () => {
  Alpine.data("Cards", () => ({
    previousCard: null,
    getTransformForPosition(i) {
      i = this.$refs.toastsWrapper.children.length - 1 - i;
      return `translateY(${1 - i * 20}%) scale(${(100 - 5 * i) / 100})`;
    },
    
    rotateRight(arr) {
      arr.unshift(arr.pop());
      return arr;
    },
    
    rearangeToasts() {
      // Get all the card elements
      const cards = document.querySelectorAll(".cards-wrapper .card");
      // Calculate the new z-index for each card
      cards.forEach((card, index) => {
        if (card.style.zIndex === "2") {
          this.previousCard?.classList.remove("jump");
          card.classList.add("jump");
          this.previousCard = card;
        }
      });

      setTimeout(() => {
        cards.forEach((card, index) => {
          // Calculate the new z-index based on the current index
          // This will rotate the z-index values in a circular manner
          const newZIndex = (card.style.zIndex + 1) % cards.length;
          // Apply the new z-index to the card
          card.style.zIndex = newZIndex;             
        });
        this.pillToasts();
      }, 500);
    },
    
    pillToasts() {
      Array.from(this.$refs.toastsWrapper.children).forEach((child) => {
        child.style.transform = this.getTransformForPosition(
          child.style.zIndex
        );
      });
    },
    
    init() {
      this.pillToasts();

      const swipeArea = document.querySelector(".swipe-area");
      
      const gesture = new TinyGesture(swipeArea, { diagonalSwipes: true });
      
      gesture.on('swipeup', (event) => {
        if (gesture.scale > 1.1 || gesture.scale < 0.9) {
          return;
        }

        this.rearangeToasts();
      }); 
      
    },
  }));
});


Alpine.start()
