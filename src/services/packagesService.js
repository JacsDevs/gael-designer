import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from './firebase'

export async function getPackages() {
  const packagesRef = collection(db, 'packages')

  const q = query(
    packagesRef,
    where('active', '==', true),
    orderBy('order', 'asc')
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
