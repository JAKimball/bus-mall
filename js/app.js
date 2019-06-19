'use strict';

var numImages = 3;
var images = [];
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
    return Math.round((this.clickCount / this.displayTimes) * 100);
  } catch (exception) {
    return (NaN);
  }
};

function renderImageAndCaption(element, productIndex) {
  var product = Product.list[productIndex];
  element.src = product.filePath;
  element.nextSibling.nextSibling.textContent = product.caption;
}

function renderProductImages() {
  displayedProducts[0] = (nextRandomProductIndex());
  displayedProducts[1] = (nextRandomProductIndex());
  displayedProducts[2] = (nextRandomProductIndex());
  renderImageAndCaption(image1, displayedProducts[0]);
  renderImageAndCaption(image2, displayedProducts[1]);
  renderImageAndCaption(image3, displayedProducts[2]);
  while (productHistory.length > numImages) {
    productHistory.shift();
  }
}

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
  totalClickCount--;

  console.log(this.id, this.id[5], productIndex, Product.list[productIndex], totalClickCount);

  if (totalClickCount === 0) {
    image1.removeEventListener('click', handleProductImageClick);
    image2.removeEventListener('click', handleProductImageClick);
    image3.removeEventListener('click', handleProductImageClick);
    renderReport();
  } else {
    renderProductImages();
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

function randomColor() {
  return `#${Math.floor((Math.random() * 16777216)).toString(16)}`;
}

function renderReport() {
  var eBReport = new ElementBuilder(document.getElementById('ReportElement'));
  eBReport.element.innerHTML = '';
  for (var i = 0; i < Product.list.length; i++) {
    var product = Product.list[i];
    console.log(`description: ${product.caption}, click count: ${product.clickCount}, display count: ${product.displayTimes}, click percent: ${product.calculateClickPercent()}`);
    eBReport.addElement('p', `${product.clickCount} votes for ${product.caption}.`);
  }

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
  console.assert(false, 'We are here!');
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
            beginAtZero: true
          }
        }]
      }
    }
  });
  console.log(typeof myChart);
}

function setupProductImages() {

}

function setupEventHandlers() {

}

function shutdownEventHandlers() {

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

  setupProductImages();
  renderProductImages();

  image1.addEventListener('click', handleProductImageClick);
  image2.addEventListener('click', handleProductImageClick);
  image3.addEventListener('click', handleProductImageClick);
}


setUp();
