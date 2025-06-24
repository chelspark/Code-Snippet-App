// Create an image from URL
const createImage = (url) => 
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        // allow cross-origin requests, ensuring the image can be manipulated in the canvas.
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url;
    });

// to crop the image
async function getCroppedImg(imageSrc, crop, mimeType) {

    try {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d');

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width
        canvas.height = crop.height

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if(!blob) {
                    reject(new Error('Canvas is empty'))
                    return;
                }
                resolve(new File([blob], 'croppedImage.' + mimeType.split('/')[1], { type: mimeType}))
            }, mimeType)
        })
    } catch (error) {
        console.error('Error in getCroppedImg:', error)
        throw error;
    }
}

export default getCroppedImg;