'use strict';

var image1 = document.getElementById('image1');
var image2 = document.getElementById('image2');
var image3 = document.getElementById('image3');

var productHistory = [];
var displayedProducts = [];
var totalClickCount = 25;

function Product(filePath, caption) {
  this.filePath = filePath;
  this.caption = caption;
  this.displayTimes = 0;
  this.clickCount = 0;
  Product.list.push(this);
}
Product.list = [];

Product.prototype.calculateClickPercent = function () {
  try {
    return (this.clickCount / this.displayTimes);
  } catch (exception) {
    return (NaN);
  }
};

function renderImageAndCaption(element, productIndex) {
  var product = Product.list[productIndex];
  element.src = product.filePath;
  element.nextSibling.nextSibling.textContent = product.caption;
}

function renderImages() {
  displayedProducts[0] = (randomProductIndex());
  displayedProducts[1] = (randomProductIndex());
  displayedProducts[2] = (randomProductIndex());
  renderImageAndCaption(image1, displayedProducts[0]);
  renderImageAndCaption(image2, displayedProducts[1]);
  renderImageAndCaption(image3, displayedProducts[2]);
  while (productHistory.length > 3) {
    productHistory.shift();
  }
}

function randomProductIndex() {
  var duplicated = true;
  while (duplicated) {
    duplicated = false;
    var r = Math.floor(Math.random() * Product.list.length);
    for (var i = 0; i < productHistory.length; i++) {
      if (r === productHistory[i]) {
        duplicated = true;
        break;
      }
    }
  }
  productHistory.push(r);
  Product.list[r].displayTimes++;
  return r;
}

function clickEventListener() {
  var productIndex = displayedProducts[this.id[5] - 1];
  var selectedProduct = Product.list[productIndex];
  selectedProduct.clickCount++;
  totalClickCount--;
  console.log(this.id, this.id[5], productIndex, Product.list[productIndex], totalClickCount);

  if (totalClickCount === 0) {
    image1.removeEventListener('click', clickEventListener);
    image2.removeEventListener('click', clickEventListener);
    image3.removeEventListener('click', clickEventListener);
    renderReport();
  } else {
    renderImages();
  }
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

function renderReport() {
  var eBReport = new ElementBuilder( document.getElementById('ReportElement'));
  eBReport.element.innerHTML = '';
  for (var i = 0; i < Product.list.length; i++) {
    var product = Product.list[i];
    console.log(`description: ${product.caption}, click count: ${product.clickCount}, display count: ${product.displayTimes}, click percent: ${product.calculateClickPercent()}`);
    eBReport.addElement('p', `${product.clickCount} votes for ${product.caption}.`);
  }
}

function setUp() {
  new Product('../img/bag.jpg', 'R2D2 bag');
  new Product('../img/banana.jpg', 'Banana');
  new Product('../img/bathroom.jpg', 'iPoop');
  new Product('../img/boots.jpg', 'Toe-less boots');
  new Product('../img/breakfast.jpg', 'easy bake');
  new Product('../img/bubblegum.jpg', 'ikea gum');
  new Product('../img/chair.jpg', 'punish chair');
  new Product('../img/cthulhu.jpg', 'cthulhu');
  new Product('../img/dog-duck.jpg', 'dog-duck');
  new Product('../img/dragon.jpg', 'dragon meat');
  new Product('../img/pen.jpg', 'food pen');
  new Product('../img/pet-sweep.jpg', 'pet-sweep');
  new Product('../img/scissors.jpg', 'pizaa scissors');
  new Product('../img/shark.jpg', 'jaws sleeping bag');
  new Product('../img/sweep.png', 'baby roomba');
  new Product('../img/tauntaun.jpg', 'tauntaun');
  new Product('../img/unicorn.jpg', 'unicorn meat');
  new Product('../img/usb.gif', 'usb');
  new Product('../img/water-can.jpg', 'water can');
  new Product('../img/wine-glass.jpg', 'useless wine glass');

  renderImages();

  image1.addEventListener('click', clickEventListener);
  image2.addEventListener('click', clickEventListener);
  image3.addEventListener('click', clickEventListener);
}


setUp();
