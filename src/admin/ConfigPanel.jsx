import { useState } from 'react'
import { saveSettings } from '../services/siteService'
import desktopImage from '../assets/images/desktop-image.jpg'
import mobileImage from '../assets/images/mobile-image.jpg'

const TEXT_KEYS = ['whatsapp', 'instagram', 'waMsg', 'sinal', 'prazo', 'alteracao', 'psd', 'tecido', 'modelagem', 'tamanhos']
const NUMERIC = ['sinal', 'prazo', 'alteracao', 'psd']

export default function ConfigPanel({ settings, setSettings, flash }) {
  const [cfg, setCfg] = useState(() => ({
    ...Object.fromEntries(TEXT_KEYS.map(k => [k, settings[k] ?? ''])),
    fita: settings.fita.join('\n'),
  }))
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = key => e => {
    let v = e.target.value
    if (NUMERIC.includes(key)) v = v.replace(/\D/g, '')
    setCfg(c => ({ ...c, [key]: v }))
    setErrors(er => ({ ...er, [key]: undefined }))
  }

  async function save() {
    const errs = {}
    const digits = cfg.whatsapp.replace(/\D/g, '')
    if (digits.length < 10) errs.whatsapp = 'Informe o número com DDD.'
    if (!cfg.instagram.trim()) errs.instagram = 'Informe o Instagram.'
    if (cfg.sinal === '' || Number(cfg.sinal) > 100) errs.sinal = 'Entre 0 e 100.'
    if (!cfg.prazo) errs.prazo = 'Informe o prazo.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      flash('Confira os campos destacados.', true)
      return
    }

    const instagram = cfg.instagram.trim().startsWith('@') ? cfg.instagram.trim() : `@${cfg.instagram.trim()}`
    const data = {
      ...Object.fromEntries(TEXT_KEYS.map(k => [k, String(cfg[k]).trim()])),
      instagram,
      fita: cfg.fita.split('\n').map(s => s.trim()).filter(Boolean),
    }
    setBusy(true)
    try {
      await saveSettings(data)
      setSettings(s => ({ ...s, ...data }))
      setCfg(c => ({ ...c, instagram }))
      flash('Configurações salvas.')
    } catch (error) {
      console.error(error)
      flash('Não foi possível salvar as configurações.', true)
    } finally {
      setBusy(false)
    }
  }

  const input = (key, label, props = {}) => (
    <div className="field">
      <label className="lbl" htmlFor={`g-${key}`}>{label}</label>
      <input
        className={`fld ${errors[key] ? 'invalid' : ''}`}
        id={`g-${key}`}
        value={cfg[key]}
        onChange={set(key)}
        inputMode={NUMERIC.includes(key) ? 'numeric' : undefined}
        {...props}
      />
      {errors[key] && <span className="err">{errors[key]}</span>}
    </div>
  )

  return (
    <section aria-labelledby="h-config" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="adm-head">
        <div>
          <h1 id="h-config">Configurações do site</h1>
          <p>Contato, condições de pagamento e textos que se repetem em várias seções.</p>
        </div>
      </div>

      <div className="cfg-grid">
        <fieldset>
          <legend>Contato</legend>
          {input('whatsapp', 'WhatsApp (com DDD)', { inputMode: 'tel' })}
          <span className="hint">Usado em todos os botões de pedido e no botão verde fixo.</span>
          {input('instagram', 'Instagram')}
          <div className="field">
            <label className="lbl" htmlFor="g-waMsg">Mensagem padrão do WhatsApp</label>
            <textarea className="fld short" id="g-waMsg" value={cfg.waMsg} onChange={set('waMsg')} />
          </div>
        </fieldset>

        <fieldset>
          <legend>Pagamento e prazo</legend>
          <div className="grid-2">
            {input('sinal', 'Sinal (%)')}
            {input('prazo', 'Prazo (dias úteis)')}
            {input('alteracao', 'Alteração após entrega (R$)')}
            {input('psd', 'PSD a partir de (R$)')}
          </div>
          <span className="hint">Atualiza “Como funciona”, as perguntas frequentes e o resumo da página de cada combo.</span>
        </fieldset>

        <fieldset>
          <legend>Confecção de camisas</legend>
          {input('tecido', 'Tecido')}
          {input('modelagem', 'Modelagem')}
          {input('tamanhos', 'Tamanhos')}
        </fieldset>

        <fieldset>
          <legend>Fita animada e destaque</legend>
          <div className="field">
            <label className="lbl" htmlFor="g-fita">Textos da fita</label>
            <textarea className="fld" id="g-fita" value={cfg.fita} onChange={set('fita')} />
            <span className="hint">Um texto por linha. Eles se repetem, separados por ✦.</span>
          </div>
          <div className="field">
            <span className="lbl">Imagem de destaque</span>
            <div className="hero-preview">
              <figure>
                <img className="d" src={desktopImage} alt="Imagem de destaque atual, computador" />
                <figcaption className="hint">Computador · 16:9</figcaption>
              </figure>
              <figure>
                <img className="m" src={mobileImage} alt="Imagem de destaque atual, celular" />
                <figcaption className="hint">Celular · vertical</figcaption>
              </figure>
            </div>
            <span className="hint">
              Para trocar, substitua <code>src/assets/images/desktop-image.jpg</code> e{' '}
              <code>src/assets/images/mobile-image.jpg</code> e publique o site.
            </span>
          </div>
        </fieldset>
      </div>

      <button type="button" className="gold-btn lg" style={{ alignSelf: 'flex-start' }} onClick={save} disabled={busy}>
        {busy ? 'Salvando...' : 'Salvar configurações'}
      </button>
    </section>
  )
}
