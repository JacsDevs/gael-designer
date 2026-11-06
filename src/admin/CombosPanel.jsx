import { useMemo, useState } from 'react'
import { createPackage, deletePackage, updatePackage } from '../services/packagesService'
import { saveOrder } from '../services/siteService'
import {
  COMBO_KEYS, comboTitle, padNumber, toCombo, waLink, withTags, whatsappMessage,
} from '../utils/combos'
import { getComboFolder, getComboMedia } from '../utils/comboMedia'
import { DownIcon, PlusIcon, TrashIcon, UpIcon } from './AdminIcons'

function defaultMessage(n, name, price) {
  return `Olá, Gael! Vi no site e quero o COMBO ${n} – ${name}${price ? ` (R$ ${price})` : ''}. É para: [nome do grupo, empresa ou evento].`
}

export default function CombosPanel({ packages, setPackages, settings, flash }) {
  const [form, setForm] = useState(null) // { id|null, n, t, itemsText, desc, p, tag, keys, wa, visible }
  const [errors, setErrors] = useState({})
  const [delId, setDelId] = useState(null)
  const [busy, setBusy] = useState(false)

  // Mesma normalização do site (inclui selo automático para combos antigos).
  const combos = useMemo(
    () => withTags(packages.map(p => toCombo({ ...p, active: true }, settings)))
      .map((c, i) => ({ ...c, active: packages[i].active !== false, raw: packages[i] })),
    [packages, settings]
  )
  const visibleCount = combos.filter(c => c.active).length

  const set = (key) => (e) => {
    let v = e.target.value
    if (key === 'p' || key === 'n') v = v.replace(/\D/g, '')
    setForm(f => ({ ...f, [key]: v }))
    setErrors(er => ({ ...er, [key]: undefined }))
  }

  function startNew() {
    const next = combos.reduce((m, c) => Math.max(m, parseInt(c.n, 10) || 0), 0) + 1
    setErrors({})
    setForm({ id: null, n: padNumber(next), t: '', itemsText: '', desc: '', p: '', tag: '', keys: [], wa: '', visible: true })
  }

  function startEdit(c) {
    setErrors({})
    setForm({
      id: c.id,
      n: c.n,
      t: c.name,
      itemsText: c.items.join('\n'),
      desc: c.description,
      p: c.price != null ? String(c.price) : '',
      tag: c.tag || '',
      keys: [...c.keys],
      wa: whatsappMessage(c.raw),
      visible: c.active,
    })
  }

  async function move(index, dir) {
    const target = index + dir
    if (target < 0 || target >= packages.length) return
    const list = [...packages]
    ;[list[index], list[target]] = [list[target], list[index]]
    setPackages(list.map((p, i) => ({ ...p, order: i })))
    try {
      await saveOrder('packages', list.map(p => p.id))
    } catch (error) {
      console.error(error)
      flash('Não foi possível salvar a nova ordem.', true)
    }
  }

  async function toggleVisible(c) {
    const active = !c.active
    try {
      await updatePackage(c.id, { active })
      setPackages(list => list.map(p => (p.id === c.id ? { ...p, active } : p)))
      flash(`Combo ${c.n} ${active ? 'visível no site.' : 'oculto do site.'}`)
    } catch (error) {
      console.error(error)
      flash('Não foi possível alterar a visibilidade.', true)
    }
  }

  async function remove(c) {
    try {
      await deletePackage(c.id)
      setPackages(list => list.filter(p => p.id !== c.id))
      if (form?.id === c.id) setForm(null)
      setDelId(null)
      flash(`Combo ${c.n} excluído.`)
    } catch (error) {
      console.error(error)
      flash('Não foi possível excluir o combo.', true)
    }
  }

  async function save(e) {
    e.preventDefault()
    const errs = {}
    if (!form.n) errs.n = 'Informe o número.'
    if (!form.t.trim()) errs.t = 'Informe o nome.'
    if (!form.p) errs.p = 'Informe o preço.'
    const dup = combos.find(c => c.n === padNumber(form.n) && c.id !== form.id)
    if (dup) errs.n = `O número ${padNumber(form.n)} já é usado.`
    setErrors(errs)
    if (Object.keys(errs).length) {
      flash('Confira os campos destacados.', true)
      return
    }

    const n = padNumber(form.n)
    const name = form.t.trim()
    const items = form.itemsText.split('\n').map(s => s.trim()).filter(Boolean)
    const message = form.wa.trim() || defaultMessage(n, name, form.p)
    const data = {
      title: comboTitle(n, name),
      subtitle: items.join(' + '),
      items,
      description: form.desc.trim(),
      price: `R$ ${form.p}`,
      tag: form.tag.trim(),
      keys: form.keys,
      whatsappMessage: message,
      whatsappLink: waLink(message, settings.whatsapp),
      active: form.visible,
    }

    setBusy(true)
    try {
      if (form.id) {
        await updatePackage(form.id, data)
        setPackages(list => list.map(p => (p.id === form.id ? { ...p, ...data } : p)))
      } else {
        const order = packages.length
        const id = await createPackage({ ...data, order })
        setPackages(list => [...list, { id, ...data, order }])
      }
      setForm(null)
      flash(`Combo ${n} salvo.`)
    } catch (error) {
      console.error(error)
      flash('Não foi possível salvar o combo.', true)
    } finally {
      setBusy(false)
    }
  }

  const folder = form ? getComboFolder(comboTitle(form.n || '0', '')) || 'combo-XX' : 'combo-XX'
  const media = form ? getComboMedia({ title: comboTitle(form.n || '0', '') }) : []

  return (
    <section aria-labelledby="h-combos" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="adm-head">
        <div>
          <h1 id="h-combos">Combos</h1>
          <p>{visibleCount} de {combos.length} visíveis no site. A ordem aqui é a ordem dos cards no site.</p>
        </div>
        <button type="button" className="gold-btn" onClick={startNew}>
          <PlusIcon /> Novo combo
        </button>
      </div>

      <div className="split">
        <ul className="list combo-rows">
          {combos.map((c, i) => (
            <li key={c.id} className={`combo-row ${form?.id === c.id ? 'editing' : ''} ${c.active ? '' : 'hidden'}`}>
              <div className="thumb-sm">
                {c.cover && (c.cover.type === 'image'
                  ? <img src={c.cover.url} alt="" loading="lazy" />
                  : <video src={c.cover.url} muted preload="metadata" />)}
              </div>
              <div className="row-info">
                <div className="row-tags">
                  <span className="row-num">COMBO {c.n}</span>
                  {!c.active && <span className="badge muted">Oculto</span>}
                  {c.tag && <span className="badge">{c.tag}</span>}
                </div>
                <strong>{c.name}</strong>
                <span className="sub">{c.items.join(' + ')}</span>
              </div>
              {c.price != null && <span className="row-price">R$ {c.price}</span>}
              <div className="row-actions">
                <button type="button" className="ib" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Subir combo ${c.n}`}><UpIcon /></button>
                <button type="button" className="ib" onClick={() => move(i, 1)} disabled={i === combos.length - 1} aria-label={`Descer combo ${c.n}`}><DownIcon /></button>
                <button type="button" className="ib" onClick={() => toggleVisible(c)} aria-label={`${c.active ? 'Ocultar' : 'Mostrar'} combo ${c.n} no site`}>
                  {c.active ? 'Ocultar' : 'Mostrar'}
                </button>
                <button type="button" className="ib" onClick={() => startEdit(c)}>Editar</button>
                {delId === c.id ? (
                  <>
                    <button type="button" className="ib danger confirm" onClick={() => remove(c)}>Confirmar exclusão</button>
                    <button type="button" className="ib" onClick={() => setDelId(null)}>Cancelar</button>
                  </>
                ) : (
                  <button type="button" className="ib danger" onClick={() => setDelId(c.id)} aria-label={`Excluir combo ${c.n}`}><TrashIcon /></button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="side-form">
          {!form ? (
            <div className="empty-form">
              Clique em <strong>Editar</strong> num combo, ou em <strong>Novo combo</strong>, para abrir o formulário aqui.
            </div>
          ) : (
            <form className="form-card" onSubmit={save} noValidate>
              <h2>{form.id ? `Editar combo ${form.n}` : 'Novo combo'}</h2>

              <div className="grid-num">
                <div className="field">
                  <label className="lbl" htmlFor="c-n">Número</label>
                  <input className={`fld ${errors.n ? 'invalid' : ''}`} id="c-n" inputMode="numeric" value={form.n} onChange={set('n')} />
                </div>
                <div className="field">
                  <label className="lbl" htmlFor="c-t">Nome do combo</label>
                  <input className={`fld ${errors.t ? 'invalid' : ''}`} id="c-t" value={form.t} onChange={set('t')} placeholder="Ex.: Camisa + Logo" />
                </div>
              </div>
              {(errors.n || errors.t) && <span className="err">{errors.n || errors.t}</span>}

              <div className="field">
                <label className="lbl" htmlFor="c-items">O que vem no combo</label>
                <textarea className="fld" id="c-items" value={form.itemsText} onChange={set('itemsText')} />
                <span className="hint">Uma peça por linha. Aparece com ✓ no card e na página do combo.</span>
              </div>

              <div className="field">
                <label className="lbl" htmlFor="c-desc">Descrição da página do combo</label>
                <textarea className="fld" id="c-desc" value={form.desc} onChange={set('desc')} placeholder="Para quem é este combo e o que a pessoa recebe." />
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="lbl" htmlFor="c-p">Preço (R$)</label>
                  <input className={`fld ${errors.p ? 'invalid' : ''}`} id="c-p" inputMode="numeric" value={form.p} onChange={set('p')} />
                  {errors.p && <span className="err">{errors.p}</span>}
                </div>
                <div className="field">
                  <label className="lbl" htmlFor="c-tag">Selo (opcional)</label>
                  <input className="fld" id="c-tag" value={form.tag} onChange={set('tag')} placeholder="Ex.: Mais completo" />
                </div>
              </div>

              <fieldset className="plain">
                <legend className="lbl">Aparece no filtro “O que não pode faltar?”</legend>
                <div className="key-chips">
                  {COMBO_KEYS.map(k => {
                    const on = form.keys.includes(k.id)
                    return (
                      <label key={k.id} className={`key-chip ${on ? 'on' : ''}`}>
                        <input
                          className="chk"
                          type="checkbox"
                          checked={on}
                          onChange={() => setForm(f => ({
                            ...f,
                            keys: on ? f.keys.filter(x => x !== k.id) : [...f.keys, k.id],
                          }))}
                        />
                        {k.label}
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <div className="field">
                <label className="lbl" htmlFor="c-wa">Mensagem do WhatsApp</label>
                <textarea
                  className="fld short"
                  id="c-wa"
                  value={form.wa}
                  onChange={set('wa')}
                  placeholder={defaultMessage(padNumber(form.n), form.t || '[nome]', form.p)}
                />
                <span className="hint">Texto que já vem escrito quando o cliente clica em “Quero esse”. Em branco, usa o texto sugerido.</span>
              </div>

              <label className="check-line">
                <input className="chk" type="checkbox" checked={form.visible} onChange={() => setForm(f => ({ ...f, visible: !f.visible }))} />
                Mostrar este combo no site
              </label>

              <div className="media-box">
                <span className="lbl">Imagens do combo</span>
                <span className="hint">
                  Coloque os arquivos em <code>src/assets/combos/{folder}/</code> (01.webp, 02.webp, 03.mp4…) e publique o site.
                  A imagem 01 é a capa do card.
                </span>
                {media.length > 0 ? (
                  <div className="media-grid">
                    {media.map((m, i) => (
                      <figure key={m.id}>
                        {m.type === 'image'
                          ? <img src={m.url} alt={`Mídia ${i + 1} do combo`} loading="lazy" />
                          : <video src={m.url} muted preload="metadata" />}
                        <figcaption>{String(i + 1).padStart(2, '0')}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <span className="media-empty">Nenhuma imagem encontrada nessa pasta ainda. O card vai aparecer sem capa.</span>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="gold-btn" disabled={busy}>{busy ? 'Salvando...' : 'Salvar combo'}</button>
                <button type="button" className="pill-btn" onClick={() => setForm(null)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
