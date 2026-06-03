/**
 * Projet : Recette Salade César
 * Description : Récupération et affichage dynamique des ingrédients via l'API OpenFoodFacts.
 */

const FIELDS = "product_name,nutriscore_grade,nutriscore_score,image_front_small_url";

/**
 * Interroge l'API OpenFoodFacts avec 'async' pour éviter de saturer le serveur
 */
async function loadProduct(barcode, isSauce = false) {
    // Utilisation de .net comme dans les consignes du projet IF08
    const url = `https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=${FIELDS}`;
  
    try {
        // 'await' force le code à attendre la réponse avant de continuer
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
        
        const data = await res.json();

        if (data.status === 1) {
            renderData(data.product, isSauce);
        } else {
            renderError(barcode, isSauce); 
        }
    } catch (err) {
        console.warn(`Erreur lors de la récupération du produit ${barcode}:`, err);
        renderError(barcode, isSauce); 
    }
}

function renderData(product, isSauce = false) {
    const productName = product.product_name || "Produit inconnu";
    const imageUrl = product.image_front_small_url || "https://placehold.co/100x100?text=Pas+d'image";
    const grade = (product.nutriscore_grade || "unknown").toLowerCase();

    const cardWrapper = document.createElement("div");
    cardWrapper.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4"; 
  
    cardWrapper.innerHTML = `
        <div class="card h-100 text-center shadow-sm border-0 pt-3">
            <img src="${imageUrl}" alt="${productName}" class="img-thumbnail rounded-circle mx-auto mb-3 product-img">
            <div class="card-body d-flex flex-column align-items-center">
                <h6 class="card-title mb-2 fw-bold">${productName}</h6>
                <img src="https://static.openfoodfacts.org/images/attributes/dist/nutriscore-${grade}.svg" alt="Nutri-Score ${grade}" class="nutriscore-img">
            </div>
        </div>
    `;

    const targetId = isSauce ? "product-sauce" : "product-garniture";
    document.getElementById(targetId).appendChild(cardWrapper);
}

function renderError(barcode, isSauce = false) {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";
    
    cardWrapper.innerHTML = `
        <div class="card h-100 text-center shadow-sm border-0 pt-3">
            <img src="https://placehold.co/100x100/eeeeee/999999?text=Introuvable" alt="Produit introuvable" class="img-thumbnail rounded-circle mx-auto mb-3 product-img">
            <div class="card-body d-flex flex-column align-items-center">
                <h6 class="card-title mb-2 fw-bold text-danger">Données indisponibles</h6>
                <p class="small text-muted mb-0">Code : ${barcode}</p>
            </div>
        </div>
    `;

    const targetId = isSauce ? "product-sauce" : "product-garniture";
    document.getElementById(targetId).appendChild(cardWrapper);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("product-garniture").innerHTML = "";
    document.getElementById("product-sauce").innerHTML = "";

    fetch('data/products.json')
        .then(response => {
            if (!response.ok) throw new Error("Impossible de lire data/products.json");
            return response.json();
        })
        .then(async (productList) => {
            // La grande différence est ici : nous utilisons une boucle classique avec 'await'
            // Cela crée une file d'attente. Les 13 produits seront chargés les uns APRÈS les autres.
            for (let i = 0; i < productList.length; i++) {
                const isSauce = i >= 4; 
                await loadProduct(productList[i], isSauce);
            }
        })
        .catch(error => console.error("Erreur critique au lancement :", error));
});