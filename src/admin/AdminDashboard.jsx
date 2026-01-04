import { useState, useEffect } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { v4 as uuid } from 'uuid'
import { db, storage } from '../services/firebase'
import '../styles/admin.css'
import { signOut } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useNavigate } from 'react-router-dom'

const WHATSAPP_BASE =
  'https://wa.me/5591999151500?text='

const emptyPackage = {
  title: '',
  subtitle: '',
  description: '',
  price: '',
  whatsappText: '',
  active: true,
  order: 0,
  media: []
}

/* ===================== */
/* 🔧 IMAGE COMPRESSION */
/* ===================== */
async function compressImage(file) {
  return new Promise(resolve => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = e => (img.src = e.target.result)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxWidth = 1200
      const scale = Math.min(maxWidth / img.width, 1)

      canvas.width = img.width * scale
      canvas.height = img.height * scale

      canvas
        .getContext('2d')
        .drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        blob => resolve(blob),
        'image/webp',
        0.8
      )
    }

    reader.readAsDataURL(file)
  })
}

export default function AdminDashboard() {
  const [packages, setPackages] = useState([])
  const [editingPackage, setEditingPackage] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Verifica se o usuário está logado e pega o e-mail
    const user = auth.currentUser
    if (user) {
      setUserEmail(user.email)
    }
    loadPackages()
  }, [])

  /* ===================== */
  /* 📦 LOAD PACKAGES */
  /* ===================== */
  async function loadPackages() {
    const snapshot = await getDocs(collection(db, 'packages'))
    const data = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))
    data.sort((a, b) => a.order - b.order)
    setPackages(data)
  }

  function startCreate() {
    setEditingPackage(emptyPackage)
    setIsCreating(true)
  }

  function startEdit(pkg) {
    setEditingPackage({
      ...pkg,
      price: pkg.price.replace('R$', '').trim(),
      whatsappText: pkg.whatsappLink.replace(WHATSAPP_BASE, '')
    })
    setIsCreating(false)
  }

  /* ===================== */
  /* 💾 SAVE PACKAGE */
  /* ===================== */
  async function savePackage() {
    const data = {
      title: editingPackage.title,
      subtitle: editingPackage.subtitle,
      description: editingPackage.description,
      price: `R$ ${editingPackage.price}`,
      whatsappLink: WHATSAPP_BASE + editingPackage.whatsappText,
      active: editingPackage.active,
      media: editingPackage.media || []
    }

    if (isCreating) {
      data.order = packages.length
      await addDoc(collection(db, 'packages'), data)
    } else {
      await updateDoc(
        doc(db, 'packages', editingPackage.id),
        data
      )
    }

    setEditingPackage(null)
    setIsCreating(false)
    loadPackages()
  }

  /* ===================== */
  /* 🖼️ MEDIA UPLOAD */
  /* ===================== */
  async function handleMediaUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setUploading(true)

    const uploaded = []

    for (const file of files) {
      const id = uuid()
      const isImage = file.type.startsWith('image')
      let uploadFile = file
      let path = ''

      if (isImage) {
        uploadFile = await compressImage(file)
        path = `packages/${editingPackage.id}/images/${id}.webp`
      } else {
        path = `packages/${editingPackage.id}/videos/${id}.mp4`
      }

      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, uploadFile)
      const url = await getDownloadURL(storageRef)

      uploaded.push({
        id,
        type: isImage ? 'image' : 'video',
        url,
        order: editingPackage.media.length + uploaded.length
      })
    }

    setEditingPackage(prev => ({
      ...prev,
      media: [...prev.media, ...uploaded]
    }))

    setUploading(false)
  }

  /* ===================== */
  /* 🔁 MEDIA ORDER */
  /* ===================== */
  function moveMedia(index, dir) {
    const list = [...editingPackage.media]
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= list.length) return

    ;[list[index], list[target]] =
      [list[target], list[index]]

    list.forEach((m, i) => (m.order = i))
    setEditingPackage({ ...editingPackage, media: list })
  }

  /* ===================== */
  /* ❌ REMOVE MEDIA */
  /* ===================== */
  async function removeMedia(media) {
    if (!window.confirm('Excluir mídia?')) return
    await deleteObject(ref(storage, media.url))

    setEditingPackage(prev => ({
      ...prev,
      media: prev.media.filter(m => m.id !== media.id)
    }))
  }

  /* ===================== */
  /* 🔼🔽 MOVE PACKAGE */
  /* ===================== */
  async function movePackage(index, dir) {
    const list = [...packages]
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= list.length) return

    ;[list[index], list[target]] =
      [list[target], list[index]]

    await Promise.all(
      list.map((pkg, i) =>
        updateDoc(doc(db, 'packages', pkg.id), { order: i })
      )
    )

    setPackages(list)
  }

  async function removePackage(id) {
    if (!window.confirm('Excluir combo?')) return
    await deleteDoc(doc(db, 'packages', id))
    loadPackages()
  }

  // Função para deslogar
  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/admin/login')  // Redireciona para a página de login após deslogar
    } catch (error) {
      console.error('Erro ao deslogar:', error)
    }
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>Painel de Combos</h2>

        {/* Exibe o e-mail do usuário logado */}
        <div className="user-info">
          <p>Bem-vindo, {userEmail}</p>
          <button className="btn-secondary" onClick={handleLogout}>Deslogar</button>
        </div>

        <button className="btn-primary" onClick={startCreate}>
          + Novo Combo
        </button>
      </header>

      {/* LISTA */}
      <div className="admin-list">
        {packages.map((pkg, index) => (
          <div key={pkg.id} className="admin-card">
            <div>
              <strong>{pkg.title}</strong>
              <p>{pkg.price}</p>
            </div>

            <div className="admin-actions">
              <button onClick={() => movePackage(index, 'up')}>↑</button>
              <button onClick={() => movePackage(index, 'down')}>↓</button>
              <button onClick={() => startEdit(pkg)}>Editar</button>
              <button className="danger" onClick={() => removePackage(pkg.id)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      {editingPackage && (
        <div className="admin-form">
          <h3>{isCreating ? 'Novo Combo' : 'Editar Combo'}</h3>

          <input placeholder="Título" value={editingPackage.title}
            onChange={e => setEditingPackage({ ...editingPackage, title: e.target.value })} />

          <input placeholder="Subtítulo" value={editingPackage.subtitle}
            onChange={e => setEditingPackage({ ...editingPackage, subtitle: e.target.value })} />

          <textarea placeholder="Descrição" value={editingPackage.description}
            onChange={e => setEditingPackage({ ...editingPackage, description: e.target.value })} />

          <input placeholder="Preço" value={editingPackage.price}
            onChange={e => setEditingPackage({ ...editingPackage, price: e.target.value.replace(/\D/g, '') })} />

          <input placeholder="Texto WhatsApp" value={editingPackage.whatsappText}
            onChange={e => setEditingPackage({ ...editingPackage, whatsappText: e.target.value })} />

          <input type="file" multiple accept="image/*,video/*" onChange={handleMediaUpload} />

          {uploading && <p>Enviando mídia...</p>}

          {/* MEDIA LIST */}
          <div className="media-grid">
            {editingPackage.media.map((m, i) => (
              <div key={m.id} className="media-card">
                {m.type === 'image'
                  ? <img src={m.url} />
                  : <video src={m.url} controls />}
                <div className="media-actions">
                  <button onClick={() => moveMedia(i, 'up')}>↑</button>
                  <button onClick={() => moveMedia(i, 'down')}>↓</button>
                  <button onClick={() => removeMedia(m)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={savePackage}>Salvar</button>
        </div>
      )}
    </div>
  )
}
