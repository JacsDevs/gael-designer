import { useState } from 'react'
import {
  DEFAULT_WORKS, HOME_WORKS_LIMIT, WORK_CATEGORIES, createWork, deleteWork, saveOrder, updateWork,
} from '../services/siteService'
import { WORK_IMAGE_NAMES, getWorkImage } from '../utils/workImages'
import { LeftIcon, PlusIcon, RightIcon, TrashIcon } from './AdminIcons'

const catLabel = id => WORK_CATEGORIES.find(c => c.id === id)?.label || ''

export default function WorksPanel({ works, setWorks, flash }) {
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [delId, setDelId] = useState(null)
  const [busy, setBusy] = useState(false)

  const homeCount = works.filter(w => w.home).length
  const usingDefaults = works.length === 0

  const set = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setError('')
  }

  // Coleção vazia: o site mostra os trabalhos padrão. Copia-os para o Firestore.
  async function importDefaults() {
    setBusy(true)
    try {
      const created = []
      for (const [i, w] of DEFAULT_WORKS.entries()) {
        const data = { cat: w.cat, kind: w.kind, client: w.client, event: w.event, home: w.home, image: w.image, order: i }
        const id = await createWork(data)
        created.push({ id, ...data })
      }
      setWorks(created)
      flash('Trabalhos do site copiados para o painel.')
    } catch (err) {
      console.error(err)
      flash('Não foi possível copiar os trabalhos.', true)
    } finally {
      setBusy(false)
    }
  }

  async function move(index, dir) {
    const target = index + dir
    if (target < 0 || target >= works.length) return
    const list = [...works]
    ;[list[index], list[target]] = [list[target], list[index]]
    setWorks(list.map((w, i) => ({ ...w, order: i })))
    try {
      await saveOrder('works', list.map(w => w.id))
    } catch (err) {
      console.error(err)
      flash('Não foi possível salvar a nova ordem.', true)
    }
  }

  async function remove(w) {
    try {
      await deleteWork(w.id)
      setWorks(list => list.filter(x => x.id !== w.id))
      if (form?.id === w.id) setForm(null)
      setDelId(null)
      flash('Trabalho removido.')
    } catch (err) {
      console.error(err)
      flash('Não foi possível remover o trabalho.', true)
    }
  }

  async function save(e) {
    e.preventDefault()
    if (!form.client.trim()) {
      setError('Preencha o cliente ou projeto.')
      return
    }
    const data = {
      client: form.client.trim(),
      event: form.event.trim(),
      kind: form.kind.trim() || catLabel(form.cat),
      cat: form.cat,
      home: form.home,
      image: form.image,
    }
    setBusy(true)
    try {
      if (form.id) {
        await updateWork(form.id, data)
        setWorks(list => list.map(w => (w.id === form.id ? { ...w, ...data } : w)))
      } else {
        const order = works.length
        const id = await createWork({ ...data, order })
        setWorks(list => [...list, { id, ...data, order }])
      }
      setForm(null)
      flash('Trabalho salvo.')
    } catch (err) {
      console.error(err)
      flash('Não foi possível salvar o trabalho.', true)
    } finally {
      setBusy(false)
    }
  }

  const preview = form ? getWorkImage(form.image) : null

  return (
    <section aria-labelledby="h-works" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="adm-head">
        <div>
          <h1 id="h-works">Trabalhos selecionados</h1>
          <p className={homeCount > HOME_WORKS_LIMIT ? 'warn' : ''}>
            {homeCount > HOME_WORKS_LIMIT
              ? `${homeCount} marcados para a home, mas só os ${HOME_WORKS_LIMIT} primeiros aparecem.`
              : `${homeCount} de ${HOME_WORKS_LIMIT} vagas da home ocupadas.`}
          </p>
        </div>
        <button
          type="button"
          className="gold-btn"
          disabled={usingDefaults}
          onClick={() => {
            setError('')
            setForm({ id: null, cat: 'identidade', kind: '', client: '', event: '', home: false, image: '' })
          }}
        >
          <PlusIcon /> Novo trabalho
        </button>
      </div>

      {usingDefaults && (
        <div className="notice">
          <span>O site está mostrando os {DEFAULT_WORKS.length} trabalhos padrão (Anarriê de São João). Copie-os para o painel para poder editar, reordenar e adicionar novos.</span>
          <button type="button" className="gold-btn" onClick={importDefaults} disabled={busy}>
            {busy ? 'Copiando...' : 'Começar a gerenciar'}
          </button>
        </div>
      )}

      <div className="split">
        <div className="list work-grid">
          {works.map((w, i) => {
            const img = getWorkImage(w.image)
            return (
              <article key={w.id} className={`work-card ${form?.id === w.id ? 'editing' : ''}`}>
                <div className="work-img">
                  {img
                    ? <img src={img} alt={`${w.kind}: ${w.client}`} loading="lazy" />
                    : <span className="noimg">Sem imagem</span>}
                  {w.home && <span className="badge">Na home</span>}
                </div>
                <div className="work-meta">
                  <span className="kind">{w.kind}</span>
                  <strong>{w.client}</strong>
                  <span className="sub">{w.event}</span>
                </div>
                <div className="row-actions">
                  <button type="button" className="ib" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Mover para a esquerda"><LeftIcon /></button>
                  <button type="button" className="ib" onClick={() => move(i, 1)} disabled={i === works.length - 1} aria-label="Mover para a direita"><RightIcon /></button>
                  <button type="button" className="ib grow" onClick={() => { setError(''); setForm({ ...w }) }}>Editar</button>
                  {delId === w.id ? (
                    <button type="button" className="ib danger confirm" onClick={() => remove(w)}>Excluir?</button>
                  ) : (
                    <button type="button" className="ib danger" onClick={() => setDelId(w.id)} aria-label="Excluir trabalho"><TrashIcon /></button>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <div className="side-form">
          {!form ? (
            <div className="empty-form">
              A home mostra até <strong>{HOME_WORKS_LIMIT} trabalhos</strong> marcados, na ordem desta lista. Clique em Editar para trocar o que aparece.
            </div>
          ) : (
            <form className="form-card" onSubmit={save} noValidate>
              <h2>{form.id ? 'Editar trabalho' : 'Novo trabalho'}</h2>
              <div className="field">
                <label className="lbl" htmlFor="w-client">Cliente ou projeto</label>
                <input className={`fld ${error ? 'invalid' : ''}`} id="w-client" value={form.client} onChange={set('client')} />
                {error && <span className="err">{error}</span>}
              </div>
              <div className="field">
                <label className="lbl" htmlFor="w-event">Evento ou detalhe</label>
                <input className="fld" id="w-event" value={form.event} onChange={set('event')} />
              </div>
              <div className="field">
                <label className="lbl" htmlFor="w-kind">Peça</label>
                <input className="fld" id="w-kind" value={form.kind} onChange={set('kind')} placeholder="Ex.: Projeto de camisa" />
              </div>
              <div className="field">
                <label className="lbl" htmlFor="w-cat">Aba da galeria</label>
                <select className="fld" id="w-cat" value={form.cat} onChange={set('cat')}>
                  {WORK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="lbl" htmlFor="w-img">Imagem</label>
                <select className="fld" id="w-img" value={form.image} onChange={set('image')}>
                  <option value="">Sem imagem</option>
                  {WORK_IMAGE_NAMES.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
                {preview && <img className="img-preview" src={preview} alt="Prévia da imagem escolhida" />}
                <span className="hint">
                  Para aparecer aqui, coloque a imagem em <code>src/assets/trabalhos/</code> no formato 4:5
                  (ex.: 800 × 1000 px) e publique o site. Sem imagem, o trabalho não aparece na home.
                </span>
              </div>
              <label className="check-line">
                <input className="chk" type="checkbox" checked={form.home} onChange={() => setForm(f => ({ ...f, home: !f.home }))} />
                Mostrar na home
              </label>
              <div className="form-actions">
                <button type="submit" className="gold-btn" disabled={busy}>{busy ? 'Salvando...' : 'Salvar trabalho'}</button>
                <button type="button" className="pill-btn" onClick={() => setForm(null)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
