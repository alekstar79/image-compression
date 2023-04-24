/**
* @param {File} file
* @param {Number} quality
* @return {Promise<Blob>}
*/
export const compressImage = (file, quality = .5) => {
  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = ({ target: { result } }) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.height = img.height
        canvas.width = img.width

        ctx.drawImage(img, 0, 0, img.width, img.height)

        canvas.toBlob(
          (blob) => {
            resolve(
              new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
            )
          },
          'image/jpeg',
          quality
        )
      }

      img.src = result.toString()
    }

    reader.readAsDataURL(file)
  })
}
