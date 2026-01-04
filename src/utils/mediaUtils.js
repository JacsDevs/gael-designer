export async function compressImage(file) {
  return new Promise(resolve => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = e => {
      img.src = e.target.result
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxWidth = 1200
      const scale = Math.min(maxWidth / img.width, 1)

      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        blob => resolve(blob),
        'image/webp',
        0.8
      )
    }

    reader.readAsDataURL(file)
  })
}
