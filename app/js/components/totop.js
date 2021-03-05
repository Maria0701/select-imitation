  
export const toTop = (elem) => window.addEventListener('scroll', () => {
    if (pageYOffset >= document.documentElement.clientHeight) {
       elem.style.display = 'block';
       elem.addEventListener('click', scrollTopHandler);
   } else {
       elem.style.display = 'none';
       elem.removeEventListener('click', scrollTopHandler);
   }
   });
   
   const scrollTopHandler = () => {
       const top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
       if (top > 0) {
           window.scrollTo({
               top: 0,
               behavior: 'smooth',
           });
       }
   };