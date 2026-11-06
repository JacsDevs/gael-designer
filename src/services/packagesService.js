import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where,
} from 'firebase/firestore'
import { db } from './firebase'

const packagesRef = () => collection(db, 'packages')

// Site: só combos visíveis, na ordem do painel.
export async function getPackages() {
  const q = query(packagesRef(), where('active', '==', true), orderBy('order', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

// Painel: todos os combos, inclusive os ocultos.
export async function getAllPackages() {
  const snapshot = await getDocs(packagesRef())
  return snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function createPackage(data) {
  const ref = await addDoc(packagesRef(), data)
  return ref.id
}

export async function updatePackage(id, data) {
  await updateDoc(doc(db, 'packages', id), data)
}

export async function deletePackage(id) {
  await deleteDoc(doc(db, 'packages', id))
}
