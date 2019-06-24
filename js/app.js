'use strict';

var numImages = 3;
var imageElements = [];
var image1 = document.getElementById('image1');
var image2 = document.getElementById('image2');
var image3 = document.getElementById('image3');

// TODO: Can move to local scope if refactored
var productHistory = [];

var displayedProducts = [];

var votesPerSession = 25;
var currentVoteCount = 0;
// TODO: Display "Vote X of Y" on page

/*
Following each vote, we are recording the page state in local storage. This includes:

- The full product list as one entry per product
  - Key: "Product-N" where N is the product ID
  - Value: JSON of Product object
- The displayedProducts array
  - Key: displayedProducts
  - Value: Array of product IDs
- The currentVoteCount value
  - Key: currentVoteCount
  - Value: Number of clicks

Product ID is defined as the products index into the Product.list array.

Local storage is updated following each vote.
*/

/**
 * Constructor for the Product object.
 *
 * @param {*} aFilePath Path and file name of the product image file.
 * @param {*} aCaption Short product description for display as product image caption and chart label.
 */
function Product(aFilePath, aCaption) {
  this.productIndex = Product.list.push(this) - 1;
  this.filePath = aFilePath;
  this.caption = aCaption;
  var lsProduct = localStorage.getItem(`Product-${this.productIndex}`);
  if (lsProduct) {
    var productRecord = JSON.parse(lsProduct);
    this.displayTimes = productRecord.displayTimes;
    this.clickCount = productRecord.clickCount;
  } else {
    this.displayTimes = 0;
    this.clickCount = 0;
    this.storeProductState();
  }
}
Product.list = [];

/**
 * Save the state of the Product object to the local store.
 *
 */
Product.prototype.storeProductState = function () {
  var key = `Product-${this.productIndex}`;
  localStorage.setItem(key, JSON.stringify(this));
};

Product.prototype.calculateClickPercent = function () {
  try {
    return Math.round((this.clickCount / this.displayTimes) * 100);
  } catch (exception) {
    return (NaN);
  }
};

/**
 * Displays the current set of products in the displayedProducts[] array.
 *
 */
function renderProductImages() {
  renderImageAndCaption(image1, displayedProducts[0]);
  renderImageAndCaption(image2, displayedProducts[1]);
  renderImageAndCaption(image3, displayedProducts[2]);
}

/**
 * Used by the renderProductImages() function to do the actual DOM work to render an individual product image with caption.
 *
 * @param {*} element The <img> element to display the product image.
 * @param {*} productIndex The ID of the product to display.
 */
function renderImageAndCaption(element, productIndex) {
  var product = Product.list[productIndex];
  element.src = product.filePath;
  element.nextSibling.nextSibling.textContent = product.caption;
}

/**
 * Populates the displayedProducts[] array with a new random selection
 * (excluding duplication of items in the current and previous sets.)
 *
 * This set is then preserved in local storage so that it may repopulate
 * the displayedProducts[] array if the page is reloaded for any reason.
 */
function generateNextRandomSet() {
  displayedProducts[0] = (nextRandomProductIndex());
  displayedProducts[1] = (nextRandomProductIndex());
  displayedProducts[2] = (nextRandomProductIndex());
  while (productHistory.length > numImages) {
    productHistory.shift();
  }
  updateStoredState();
}

/**
 * Used by the generateNextRandomSet() function to make the individual product image selections.
 *
 * @returns The ID of the selected product.
 */
function nextRandomProductIndex() {
  var duplicated = true;
  while (duplicated) {
    var r = Math.floor(Math.random() * Product.list.length);
    duplicated = productHistory.includes(r);
  }
  productHistory.push(r);
  Product.list[r].displayTimes++;
  return r;
}

function handleProductImageClick(event) {
  var productIndex = displayedProducts[this.id[5] - 1];
  var selectedProduct = Product.list[productIndex];
  selectedProduct.clickCount++;
  currentVoteCount++;
  Product.list[productIndex].storeProductState();

  console.log(this.id, this.id[5], productIndex, Product.list[productIndex], currentVoteCount);


  if (currentVoteCount === votesPerSession) {
    currentVoteCount = 0;
    removeEventHandlers();
    renderReport();
  } else {
    generateNextRandomSet();
    renderProductImages();
  }
  updateStoredState();
}

// --- Global Report Rendering Functions ---

function ElementBuilder(parent) {
  this.element = parent;
}

ElementBuilder.prototype.addElement = function (tagName, Text, className) {
  var newElement = document.createElement(tagName);
  if (typeof Text !== 'undefined') {
    newElement.textContent = Text;
  }
  if (typeof className !== 'undefined') {
    newElement.className = className;
  }
  this.element.appendChild(newElement);
  return newElement;
};

function randomColor() {
  return `#${Math.floor((Math.random() * 16777216)).toString(16)}`;
}

function renderReport() {
  var canvas = document.getElementById('ReportCanvas');
  var ctx = canvas.getContext('2d');
  var labels = [];
  var votePctData = [];
  var colors = [];

  Product.list.sort(function (a, b) {
    // calculateClickPercent can return NaN so remap NaN to -1 so these sort to the end.
    function negIfNaN(n) {
      if (isNaN(n)) {
        n = -1;
      }
      return n;
    }
    return negIfNaN(b.calculateClickPercent()) - negIfNaN(a.calculateClickPercent());
  });

  for (var i = 0; i < Product.list.length; i++) {
    var product = Product.list[i];
    labels.push(product.caption);
    votePctData.push(product.calculateClickPercent());
    colors.push(randomColor());
  }
  console.log(ctx);
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '% Appearances Voted',
        data: votePctData,
        backgroundColor: colors,
        borderWidth: 1
      }],
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      }
    }
  });
  console.log(typeof myChart);
}

function setupProductImages() {

}

/**
 * Set up event handlers for all product images.
 *
 */
function setupEventHandlers() {
  image1.addEventListener('click', handleProductImageClick);
  image2.addEventListener('click', handleProductImageClick);
  image3.addEventListener('click', handleProductImageClick);
}

/**
 * Remove the event handlers from all product images.
 *
 */
function removeEventHandlers() {
  image1.removeEventListener('click', handleProductImageClick);
  image2.removeEventListener('click', handleProductImageClick);
  image3.removeEventListener('click', handleProductImageClick);
}

/**
 * Save displayed product array and currentVoteCount to local storage.
 *
 */
function updateStoredState() {
  localStorage.setItem('displayedProducts', JSON.stringify(displayedProducts));
  localStorage.setItem('currentVoteCount', JSON.stringify(currentVoteCount));
}

/**
 * Load displayed product array and currentVoteCount from local storage.
 * Caller to restoreStoredState() will see if we had success based on the return value:
 *
 * @returns Return true if all needed state was recovered from local storage, false if not.
 */
function restoreStoredState() {
  var success = true;

  var lsStr = localStorage.getItem('displayedProducts');
  if (!lsStr) {
    displayedProducts = [];
    return false;
  }
  displayedProducts = JSON.parse(lsStr);
  for (var i = 0; i < displayedProducts.length; i++) {
    productHistory.push(displayedProducts[i]);
  }

  lsStr = localStorage.getItem('currentVoteCount');
  if (!lsStr) {
    currentVoteCount = 0;
    return false;
  }
  currentVoteCount = JSON.parse(lsStr);

  return success;
}

function setUp() {
  var restoringFromStorage = restoreStoredState();
  console.log(`Found in LS: ${restoringFromStorage}`);
  console.log(`currentVoteCount = ${currentVoteCount}`);

  new Product('./img/bag.jpg', 'R2D2 bag');
  new Product('./img/banana.jpg', 'Banana');
  new Product('./img/bathroom.jpg', 'iPoop');
  new Product('./img/boots.jpg', 'Toe-less boots');
  new Product('./img/breakfast.jpg', 'easy bake');
  new Product('./img/bubblegum.jpg', 'ikea gum');
  new Product('./img/chair.jpg', 'punish chair');
  new Product('./img/cthulhu.jpg', 'cthulhu');
  new Product('./img/dog-duck.jpg', 'dog-duck');
  new Product('./img/dragon.jpg', 'dragon meat');
  new Product('./img/pen.jpg', 'food pen');
  new Product('./img/pet-sweep.jpg', 'pet-sweep');
  new Product('./img/scissors.jpg', 'pizza scissors');
  new Product('./img/shark.jpg', 'jaws sleeping bag');
  new Product('./img/sweep.png', 'baby roomba');
  new Product('./img/tauntaun.jpg', 'tauntaun');
  new Product('./img/unicorn.jpg', 'unicorn meat');
  new Product('./img/usb.gif', 'usb');
  new Product('./img/water-can.jpg', 'water can');
  new Product('./img/wine-glass.jpg', 'useless wine glass');

  setupProductImages();

  if (currentVoteCount === 0) {
    generateNextRandomSet();
  }
  renderProductImages();

  setupEventHandlers();
}

setUp();
