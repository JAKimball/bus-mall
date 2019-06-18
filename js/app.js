'use strict';

var image1 = document.getElementById('image1');
var image2 = document.getElementById('image2');
var image3 = document.getElementById('image3');

var productHistory = [];
var displayedProducts = [];
var totalClickCount = 5;

function ProductImage(filePath, caption){
  this.filePath = filePath;
  this.caption = caption;
  this.displayTimes = 0;
  this.clickCount = 0;
  ProductImage.list.push(this);
}
ProductImage.list = [];

ProductImage.prototype.calculateClickPercent = function(){
  try{
    return (this.clickCount / this.displayTimes);
  }
  catch (exception){
    return (NaN);
  }
};

function renderImages (){
  displayedProducts[0] = (getRandoNum());
  displayedProducts[1] = (getRandoNum());
  displayedProducts[2] = (getRandoNum());
  image1.src = ProductImage.list[displayedProducts[0]].filePath;
  image2.src = ProductImage.list[displayedProducts[1]].filePath;
  image3.src = ProductImage.list[displayedProducts[2]].filePath;
}

function getRandoNum (){
  var duplicated = true;
  while (duplicated){
    duplicated = false;
    var rando = Math.floor(Math.random() * ProductImage.list.length);
    for(var i = 0; i < productHistory.length; i++){
      if (rando === productHistory[i]){
        duplicated = true;
        break;
      }
    }
  }
  productHistory.push(rando);
  while (productHistory.length > 6){
    productHistory.shift();
  }
  ProductImage.list[rando].displayTimes++;
  return rando;
}

function clickEventListener(){
  var productIndex = displayedProducts[this.id[5]-1];
  var clickedProduct = ProductImage.list[productIndex];
  clickedProduct.clickCount++;
  totalClickCount--;
  console.log(this.id, this.id[5], productIndex, ProductImage.list[productIndex], totalClickCount);
  if (totalClickCount === 0){
    image1.removeEventListener('click', clickEventListener);
    image2.removeEventListener('click', clickEventListener);
    image3.removeEventListener('click', clickEventListener);
    renderReport();
  }
  else{
    renderImages();
  }
}

function renderReport(){
  for(var i = 0;i<ProductImage.list.length;i++){
    var product = ProductImage.list[i];
    console.log(`description: ${product.caption}, click count: ${product.clickCount}, display count: ${product.displayTimes}, click percent: ${product.calculateClickPercent()}`);
  }
}

function setUp (){
  new ProductImage('../img/bag.jpg', 'R2D2 bag');
  new ProductImage('../img/banana.jpg', 'Banana');
  new ProductImage('../img/bathroom.jpg', 'iPoop' );
  new ProductImage('../img/boots.jpg', 'Toe-less boots');
  new ProductImage('../img/breakfast.jpg', 'easy bake');
  new ProductImage('../img/bubblegum.jpg', 'ikea gum');
  new ProductImage('../img/chair.jpg', 'punish chair');
  new ProductImage('../img/cthulhu.jpg', 'cthulhu');
  new ProductImage('../img/dog-duck.jpg', 'dog-duck');
  new ProductImage('../img/dragon.jpg', 'dragon meat');
  new ProductImage('../img/pen.jpg', 'food pen');
  new ProductImage('../img/pet-sweep.jpg', 'pet-sweep');
  new ProductImage('../img/scissors.jpg', 'pizaa scissors');
  new ProductImage('../img/shark.jpg', 'jaws sleeping bag');
  new ProductImage('../img/sweep.png', 'baby roomba');
  new ProductImage('../img/tauntaun.jpg', 'tauntaun');
  new ProductImage('../img/unicorn.jpg', 'unicorn meat');
  new ProductImage('../img/usb.gif', 'usb');
  new ProductImage('../img/water-can.jpg', 'water can');
  new ProductImage('../img/wine-glass.jpg', 'useless wine glass');

  renderImages();

  image1.addEventListener('click', clickEventListener);
  image2.addEventListener('click', clickEventListener);
  image3.addEventListener('click', clickEventListener);
}


setUp();


