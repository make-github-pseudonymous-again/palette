export default function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    console.debug('Loading image', file);
    const imageType = /image.*/;
    if (file.type.match(imageType)) {
      const reader = new FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.readAsDataURL(file);
    } else {
      reject({ message: 'Image is the wrong type.' });
    }
  });
} ;
