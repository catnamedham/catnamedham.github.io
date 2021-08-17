const numImages = 49;
let myArray = [];


function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}


function getRandInt(max)
{
    return Math.floor(Math.random() * max) + 1;
}


function resetArray(myArray, size)
{
    for (let i = 1; i < size + 1; i++)
    {
        myArray[i - 1] = i;
    }
    shuffle(myArray);
}


let myImage = document.querySelector('img');
myImage.onclick = function ()
{
    if (myArray.length === 0)
    {
        resetArray(myArray, numImages)
        console.log('reset array')
    }
    console.log(myArray.length);

    let currImageNum = myArray.pop();
    let newImageSrc = 'images/image (' + currImageNum.toString(10) + ').jpg';
    myImage.setAttribute('src', newImageSrc)
}
