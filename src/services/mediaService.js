import { storage } from './firebase'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { compressImage } from '../utils/mediaUtils'
import { v4 as uuid } from 'uuid'

export async function uploadMedia(packageId, file, type) {
  const id = uuid()
  let uploadFile = file
  let path = ''

  if (type === 'image') {
    uploadFile = await compressImage(file)
    path = `packages/${packageId}/images/${id}.webp`
  } else {
    path = `packages/${packageId}/videos/${id}.mp4`
  }

  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, uploadFile)

  const url = await getDownloadURL(storageRef)

  return {
    id,
    type,
    url
  }
}

export async function deleteMediaByUrl(url) {
  const refFromUrl = ref(storage, url)
  await deleteObject(refFromUrl)
}
