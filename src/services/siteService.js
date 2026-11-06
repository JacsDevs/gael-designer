import {
  collection, deleteDoc, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'

/* =========================================================
   CONFIGURAÇÕES DO SITE  (documento site/settings)
========================================================= */
export const DEFAULT_SETTINGS = {
  whatsapp: '(91) 99915-1500',
  instagram: '@gael.designer',
  waMsg: 'Olá, Gael! Vim pelo site e quero um orçamento.',
  sinal: '50',
  prazo: '10',
  alteracao: '25',
  psd: '150',
  tecido: 'Elanca ou Dry Fit',
  modelagem: 'Masculina, feminina e infantil',
  tamanhos: '2 anos ao XGG',
  fita: [
    'Identidade visual', 'Projeto de camisas', 'Abadás', 'Flyers temáticos',
    'Vídeo de divulgação', 'Convites digitais', 'Confecção de camisas',
  ],
  prices: [
    { name: 'Folhetos e panfletos digitais', from: true, price: '40' },
    { name: 'Flyer temático', from: false, price: '70' },
    { name: 'Logotipo', from: true, price: '100' },
    { name: 'Vídeo de divulgação do tema (60s)', from: false, price: '100' },
    { name: 'Convite interativo e digital', from: true, price: '100' },
    { name: 'Abadá (regata)', from: true, price: '120' },
    { name: 'Projeto de camisa', from: true, price: '150' },
    { name: 'Convite virtual com música de fundo', from: false, price: '150' },
  ],
  consult: [
    'Banners e bandeiras (conforme medidas)',
    'Identidade visual completa',
    'Catálogos (conforme nº de páginas)',
    'Materiais de marketing',
  ],
}

const settingsRef = () => doc(db, 'site', 'settings')

export async function getSettings() {
  const snap = await getDoc(settingsRef())
  return { ...DEFAULT_SETTINGS, ...(snap.exists() ? snap.data() : {}) }
}

export async function saveSettings(patch) {
  await setDoc(settingsRef(), patch, { merge: true })
}

/* =========================================================
   TRABALHOS SELECIONADOS  (coleção works)
========================================================= */
export const WORK_CATEGORIES = [
  { id: 'identidade', label: 'Identidade visual' },
  { id: 'vestuario', label: 'Camisas e abadás' },
  { id: 'divulgacao', label: 'Flyers e vídeos' },
  { id: 'convites', label: 'Convites' },
]

export const HOME_WORKS_LIMIT = 4

// Usados enquanto a coleção "works" ainda estiver vazia.
export const DEFAULT_WORKS = [
  { cat: 'vestuario', kind: 'Projeto de camisa', client: 'Anarriê de São João', event: 'No embalo do Pinduca', home: true, image: 'anarrie-camisa.webp' },
  { cat: 'divulgacao', kind: 'Flyer temático', client: 'Anarriê de São João', event: 'No embalo do Pinduca', home: true, image: 'anarrie-flyer.webp' },
  { cat: 'identidade', kind: 'Logotipo', client: 'Anarriê de São João', event: 'No embalo do Pinduca', home: true, image: 'anarrie-logo.webp' },
].map((w, i) => ({ ...w, id: `default-${i}`, order: i }))

export async function getWorks() {
  const snap = await getDocs(collection(db, 'works'))
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function createWork(data) {
  const ref = await addDoc(collection(db, 'works'), data)
  return ref.id
}

export async function updateWork(id, data) {
  await updateDoc(doc(db, 'works', id), data)
}

export async function deleteWork(id) {
  await deleteDoc(doc(db, 'works', id))
}

/* =========================================================
   ORDEM (combos e trabalhos)
========================================================= */
export async function saveOrder(collectionName, ids) {
  const batch = writeBatch(db)
  ids.forEach((id, i) => batch.update(doc(db, collectionName, id), { order: i }))
  await batch.commit()
}
