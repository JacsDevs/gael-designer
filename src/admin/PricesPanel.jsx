import { useState } from 'react'
import { saveSettings } from '../services/siteService'
import { TrashIcon } from './AdminIcons'

let seq = 0
const withKey = p => ({ ...p, key: `p${seq++}` })

export default function PricesPanel({ settings, setSettings, flash }) {
  const [rows, setRows] = useState(() => settings.prices.map(withKey))
  const [consult, setConsult] = useState(settings.consult.join('\n'))
  const [busy, setBusy] = useState(false)

  const update = (key, patch) => setRows(list => list.map(r => (r.key === key ? { ...r, ...patch } : r)))

  async function save() {
    const prices = rows
      .filter(r => r.name.trim())
      .map(r => ({ name: r.name.trim(), from: !!r.from, price: r.price }))
    const consultList = consult.split('\n').map(s => s.trim()).filter(Boolean)
    setBusy(true)
    try {
      await saveSettings({ prices, consult: consultList })
      setSettings(s => ({ ...s, prices, consult: consultList }))
      setRows(prices.map(withKey))
      flash('Valores individuais salvos.')
    } catch (error) {
      console.error(error)
      flash('Não foi possível salvar os valores.', true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-labelledby="h-prices" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="adm-head">
        <div>
          <h1 id="h-prices">Valores individuais</h1>
          <p>Lista de preços das peças avulsas, na ordem em que aparecem no site.</p>
        </div>
      </div>

      <div className="panel-card">
        <div className="price-row head" aria-hidden="true">
          <span>Peça</span><span>“A partir de”</span><span>Preço (R$)</span><span />
        </div>
        {rows.map(r => (
          <div key={r.key} className="price-row">
            <input
              className="fld"
              value={r.name}
              onChange={e => update(r.key, { name: e.target.value })}
              aria-label="Nome da peça"
              placeholder="Nome da peça"
            />
            <label className="from-col">
              <input className="chk" type="checkbox" checked={!!r.from} onChange={() => update(r.key, { from: !r.from })} />
              A partir de
            </label>
            <input
              className="fld"
              inputMode="numeric"
              value={r.price}
              onChange={e => update(r.key, { price: e.target.value.replace(/\D/g, '') })}
              aria-label={`Preço de ${r.name || 'nova peça'}`}
            />
            <button
              type="button"
              className="ib danger"
              onClick={() => setRows(list => list.filter(x => x.key !== r.key))}
              aria-label={`Remover ${r.name || 'peça'}`}
            >
              <TrashIcon />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="ib add-row"
          onClick={() => setRows(list => [...list, withKey({ name: '', from: false, price: '' })])}
        >
          + Adicionar peça
        </button>
      </div>

      <div className="panel-card pad">
        <label className="lbl" htmlFor="p-consult">Itens sob consulta</label>
        <textarea className="fld" id="p-consult" value={consult} onChange={e => setConsult(e.target.value)} />
        <span className="hint">Um item por linha. Aparecem juntos no fim da lista, sem preço.</span>
      </div>

      <button type="button" className="gold-btn lg" style={{ alignSelf: 'flex-start' }} onClick={save} disabled={busy}>
        {busy ? 'Salvando...' : 'Salvar valores'}
      </button>
    </section>
  )
}
