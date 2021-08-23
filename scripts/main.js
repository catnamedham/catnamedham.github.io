// shuffles the given array
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

// return random int in [1, max]
function getRandInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

// fills array with src names, and shuffles it
function resetArray(array, size) {
  for (let i = 0; i < size; i++) {
    let imageSrc = `images/image (${(i + 1).toString(10)}).jpg`;
    if (array[i] != imageSrc) {
      array.push(imageSrc);
    }
  }
  shuffle(array);
}

// change main image on click
(function() {
  const numImages = 49;
  const myArray = [];
  const myImage = document.querySelector('#main-image');

  function changeImage() {
    if (myArray.length === 0) {
      resetArray(myArray, numImages);
      console.log('array reset');
    }
    console.log(myArray.length);

    myImage.setAttribute('src', myArray.pop());
  }

  myImage.onclick = () => void changeImage();
})();
