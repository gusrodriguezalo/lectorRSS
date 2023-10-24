 // URL del canal RSS de tu blog de WordPress
 const feedUrl = 'https://gusrodriguezalo.com/feed/';
 const numPostsToShow = 3; // Número de posts a mostrar

 // Función para extraer texto del contenido HTML
 function extractTextFromHtml(html) {
   const temp = document.createElement('div');
   temp.innerHTML = html;
   return temp.textContent || temp.innerText || '';
 }

 // Función para crear las tarjetas
 function createCard(item) {
   const descriptionHtml = item.description;
   const descriptionText = extractTextFromHtml(descriptionHtml);

   // Busca la imagen en la descripción
   const imageMatch = descriptionHtml.match(/<img [^>]*src="([^"]+)"[^>]*>/i);
   let image = '';
   if (imageMatch && imageMatch.length > 1) {
     image = imageMatch[1];
   }

   const card = `
     <div class="col-md-12 mb-4">
       <div class="card">
         <div class="card-body">
           <h5 class="card-title">${item.title}</h5>
           <p class="card-text">${descriptionText}</p>
           <button type="button" id="button" class="btn" data-toggle="modal" data-target="#modal${item.guid}">
             <img id="icon" src="icono.svg" alt="icono"/>
           </button>
         </div>
         <img src="${image}" class="card-img-top" alt="Image">
       </div>
     </div>
     
     <div class="modal fade" id="modal${item.guid}" tabindex="-1" role="dialog" aria-labelledby="modalLabel${item.guid}" aria-hidden="true">
       <div class="modal-dialog modal-lg" role="document">
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="modalLabel${item.guid}">${item.title}</h5>
             <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
           <div class="modal-body">
             <p>${descriptionText}</p>
             <a href="${item.link}" target="_blank" rel="noopener noreferrer">Leer el artículo completo</a>
             <div class="mt-3">
               <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(item.link)}" target="_blank" rel="noopener noreferrer" >
                 <img alt='Share on Facebook' src='images/flat_web_icon_set/color/Facebook.png' />
               </a>
               <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(item.link)}&text=${encodeURIComponent(item.title)}" target="_blank" rel="noopener noreferrer">
                 <img alt='Share on Twitter' src='images/flat_web_icon_set/color/Twitter.png' />
               </a>
             </div>
           </div>
         </div>
       </div>
     </div>
   `;

   return card;
 }

 // Función para cargar y mostrar las tarjetas
 function loadRssCards() {
   fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`)
     .then(response => response.text())
     .then(data => {
       const parser = new DOMParser();
       const xmlDoc = parser.parseFromString(data, 'text/xml');
       const items = xmlDoc.querySelectorAll('item');

       const rssCardsContainer = $('#rssCards');
       let index = 0;
       items.forEach(item => {
         if (index < numPostsToShow) {
           const title = item.querySelector('title').textContent;
           const description = item.querySelector('description').textContent;
           const link = item.querySelector('link').textContent;

           const cardHtml = createCard({
             title,
             description,
             link,
             guid: index,
           });
           rssCardsContainer.append(cardHtml);
           index++;
         }
       });
     });
 }

 // Cargar y mostrar las tarjetas al cargar la página
 $(document).ready(function () {
   loadRssCards();
 });