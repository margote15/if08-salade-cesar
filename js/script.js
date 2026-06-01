const FIELDS =
  "product_name,nutriscore_grade,nutriscore_score,image_front_small_url";

let productList = [
  3250390000518, 3250392554620, 20702267, 3560071010058, 20697075,
  0011210000872, 3471540080130, 3183280001800, 20057251, 3760056264685,
  8029689007263, 3528780130016, 3663362034808,
];

function loadProduct(barcode, sauce = false) {
  let url = `https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=${FIELDS}`;
  fetch(url, { crossorigin: "anonymous" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      renderData(data.product, sauce);
    })
    .catch((err) => {
      document.getElementById("product-name").innerHTML =
        `<div class="alert alert-danger">Erreur : ${err.message}</div>`;
    });
}

function renderData(product, sauce = false) {
  const {
    product_name,
    image_front_small_url,
    nutriscore_grade,
    nutriscore_score,
  } = product;
  const grade = nutriscore_grade.toUpperCase();

  const card = document.createElement("div");
  card.className = "card mb-3";
  card.innerHTML = `
    <div class="card-body d-flex align-items-center gap-3">
      <img src="${image_front_small_url}" alt="${product_name}" class="img-thumbnail" style="max-width: 100px;">
      <div>
        <h5 class="card-title mb-1">${product_name}</h5>
        <p class="mb-0 text-muted">Nutri-Score <strong>${grade}</strong></p>
      </div>
    </div>
  `;

  if (sauce) {
    document.getElementById("product-sauce").appendChild(card);
  } else {
    document.getElementById("product-garniture").appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("product-garniture").innerHTML = "";
  document.getElementById("product-sauce").innerHTML = "";

  for (let i = 0; i < productList.length; i++) {
    if (i < 4) loadProduct(productList[i], false);
    else loadProduct(productList[i], true);
  }
});
