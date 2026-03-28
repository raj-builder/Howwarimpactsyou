'use client'

import { useState, useCallback } from 'react'
import { FALLBACK_PRICES } from '@/data/fallback-prices'
import { CATEGORIES } from '@/data/categories'
import { COUNTRIES } from '@/data/countries'
import { CURRENCIES } from '@/data/currencies'
import { WAR_LIST } from '@/data/wars'
import { exportRefinementsJSON, clearRefinements } from '@/lib/user-refinements'
import { useT } from '@/lib/use-t'
import type { UserRefinements, CommodityRefinement, CategoryImpactRefinement, FxRefinement, NewCountryRefinement } from '@/types/user-refinements'
import type { WarId } from '@/types'

type Tab = 'commodities' | 'impacts' | 'fx'

interface RefinementPanelProps {
  refinements: UserRefinements
  onRefinementsChange: (r: UserRefinements) => void
}

export function RefinementPanel({ refinements, onRefinementsChange }: RefinementPanelProps) {
  const t = useT()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('commodities')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearAll = useCallback(() => {
    clearRefinements()
    onRefinementsChange({
      version: 1,
      commodities: [],
      categoryImpacts: [],
      fxRates: [],
      newCountries: [],
      lastUpdated: new Date().toISOString(),
    })
    setShowClearConfirm(false)
  }, [onRefinementsChange])

  const handleExport = useCallback(() => {
    const json = exportRefinementsJSON(refinements)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'howwarimpactsyou-refinements.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [refinements])

  const totalRefinements =
    refinements.commodities.length +
    refinements.categoryImpacts.length +
    refinements.fxRates.length +
    refinements.newCountries.length

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 border border-dashed border-border rounded-lg px-3 py-2.5 font-sans text-[0.75rem] text-ink-muted hover:text-accent hover:border-accent transition-colors cursor-pointer text-center"
      >
        <span className="mr-1">&#9998;</span> {t('refinement.refineData')}
        {totalRefinements > 0 && (
          <span className="ml-1.5 bg-blue-light text-blue font-bold px-1.5 py-0.5 rounded text-[0.62rem]">
            {totalRefinements}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="mt-4 bg-bg-card border border-border rounded-[10px] shadow-card animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="font-sans text-[0.82rem] font-bold text-ink">{t('refinement.title')}</h3>
          <p className="font-sans text-[0.65rem] text-ink-muted mt-0.5">
            {t('refinement.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="font-sans text-[0.75rem] text-ink-muted hover:text-accent cursor-pointer shrink-0 ml-2"
        >
          {t('refinement.close')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {([
          { id: 'commodities' as Tab, label: t('refinement.tabCommodities') },
          { id: 'impacts' as Tab, label: t('refinement.tabImpacts') },
          { id: 'fx' as Tab, label: t('refinement.tabFx') },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 font-sans text-[0.72rem] font-semibold py-2.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === t.id
                ? 'border-accent text-accent'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {activeTab === 'commodities' && (
          <CommodityTab refinements={refinements} onChange={onRefinementsChange} />
        )}
        {activeTab === 'impacts' && (
          <ImpactTab refinements={refinements} onChange={onRefinementsChange} />
        )}
        {activeTab === 'fx' && (
          <FxTab refinements={refinements} onChange={onRefinementsChange} />
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-bg-alt rounded-b-[10px]">
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="font-sans text-[0.68rem] text-ink-muted hover:text-accent cursor-pointer underline decoration-dotted"
          >
            {t('refinement.exportData')}
          </button>
          {showClearConfirm ? (
            <span className="flex items-center gap-1.5">
              <span className="font-sans text-[0.68rem] text-accent">{t('refinement.clearConfirm')}</span>
              <button onClick={handleClearAll} className="font-sans text-[0.68rem] font-bold text-accent cursor-pointer">{t('refinement.yes')}</button>
              <button onClick={() => setShowClearConfirm(false)} className="font-sans text-[0.68rem] text-ink-muted cursor-pointer">{t('refinement.no')}</button>
            </span>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="font-sans text-[0.68rem] text-ink-muted hover:text-accent cursor-pointer underline decoration-dotted"
            >
              {t('refinement.clearAll')}
            </button>
          )}
        </div>
        <span className="font-sans text-[0.62rem] text-ink-muted">
          {totalRefinements} refinement{totalRefinements !== 1 ? 's' : ''} saved
        </span>
      </div>
    </div>
  )
}

/* ── Tab: Commodity Prices ──────────────────────────────────── */

function CommodityTab({
  refinements,
  onChange,
}: {
  refinements: UserRefinements
  onChange: (r: UserRefinements) => void
}) {
  const commodityIds = Object.keys(FALLBACK_PRICES)

  const updatePrice = (commodityId: string, value: string) => {
    const num = parseFloat(value)
    if (isNaN(num) || num <= 0) return
    const existing = refinements.commodities.filter((c) => c.commodityId !== commodityId)
    const entry: CommodityRefinement = {
      commodityId,
      currentPrice: num,
      updatedAt: new Date().toISOString(),
      source: 'user',
    }
    onChange({ ...refinements, commodities: [...existing, entry] })
  }

  const removePrice = (commodityId: string) => {
    onChange({
      ...refinements,
      commodities: refinements.commodities.filter((c) => c.commodityId !== commodityId),
    })
  }

  return (
    <div className="space-y-3">
      <p className="font-sans text-[0.68rem] text-ink-muted mb-2">
        Override the hardcoded price with what you know today.
      </p>
      {commodityIds.map((id) => {
        const fb = FALLBACK_PRICES[id]
        const userVal = refinements.commodities.find((c) => c.commodityId === id)
        return (
          <div key={id} className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
            <div className="flex-1 min-w-0">
              <div className="font-sans text-[0.75rem] font-semibold text-ink">{fb.label}</div>
              <div className="font-sans text-[0.62rem] text-ink-muted">
                {fb.exchange} · {fb.unit} · Hardcoded: {fb.price}
              </div>
              <div className="font-sans text-[0.58rem] text-amber mt-0.5">
                Hardcoded — live API pending
              </div>
            </div>
            <input
              type="number"
              step="0.01"
              placeholder={String(fb.price)}
              defaultValue={userVal?.currentPrice ?? ''}
              onBlur={(e) => {
                if (e.target.value) updatePrice(id, e.target.value)
              }}
              className="w-24 border border-border rounded px-2 py-1 font-sans text-[0.75rem] text-ink bg-bg-alt focus:outline-none focus:border-accent text-right"
            />
            {userVal && (
              <button
                onClick={() => removePrice(id)}
                className="text-ink-muted hover:text-accent cursor-pointer text-[0.8rem]"
                aria-label="Remove override"
              >
                &times;
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Tab: Category Impacts ──────────────────────────────────── */

function ImpactTab({
  refinements,
  onChange,
}: {
  refinements: UserRefinements
  onChange: (r: UserRefinements) => void
}) {
  const [showNewCountry, setShowNewCountry] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedWar, setSelectedWar] = useState('')
  const [impactPct, setImpactPct] = useState('')
  const [note, setNote] = useState('')

  // New country fields
  const [newName, setNewName] = useState('')
  const [newFlag, setNewFlag] = useState('')
  const [newSalary, setNewSalary] = useState('')

  const allCountries = [
    ...COUNTRIES.map((c) => c.name),
    ...refinements.newCountries.map((c) => c.country),
  ]

  const handleSaveImpact = () => {
    const pct = parseFloat(impactPct)
    if (!selectedCountry || !selectedCategory || !selectedWar || isNaN(pct)) return
    const existing = refinements.categoryImpacts.filter(
      (x) => !(x.country === selectedCountry && x.categoryId === selectedCategory && x.warId === selectedWar),
    )
    const entry: CategoryImpactRefinement = {
      country: selectedCountry,
      categoryId: selectedCategory,
      warId: selectedWar,
      impactPct: pct,
      note: note || undefined,
      updatedAt: new Date().toISOString(),
      source: 'user',
    }
    onChange({ ...refinements, categoryImpacts: [...existing, entry] })
    setImpactPct('')
    setNote('')
  }

  const handleAddCountry = () => {
    if (!newName.trim()) return
    const entry: NewCountryRefinement = {
      country: newName.trim(),
      flag: newFlag || '🏳',
      coverage: 'user-supplied',
      medianMonthlySalaryUSD: newSalary ? parseFloat(newSalary) : undefined,
      createdAt: new Date().toISOString(),
      source: 'user',
    }
    onChange({
      ...refinements,
      newCountries: [...refinements.newCountries.filter((c) => c.country !== newName.trim()), entry],
    })
    setNewName('')
    setNewFlag('')
    setNewSalary('')
    setShowNewCountry(false)
    setSelectedCountry(newName.trim())
  }

  const removeImpact = (country: string, categoryId: string, warId: string) => {
    onChange({
      ...refinements,
      categoryImpacts: refinements.categoryImpacts.filter(
        (x) => !(x.country === country && x.categoryId === categoryId && x.warId === warId),
      ),
    })
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <select
            value={selectedCountry}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                setShowNewCountry(true)
                setSelectedCountry('')
              } else {
                setSelectedCountry(e.target.value)
                setShowNewCountry(false)
              }
            }}
            className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          >
            <option value="">Country</option>
            {allCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="__new__">+ Add new country</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          >
            <option value="">Category</option>
            {CATEGORIES.filter((c) => c.id !== 'basket').map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
          <select
            value={selectedWar}
            onChange={(e) => setSelectedWar(e.target.value)}
            className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          >
            <option value="">Conflict</option>
            {WAR_LIST.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>

        {showNewCountry && (
          <div className="bg-bg-alt border border-border rounded-lg p-3 space-y-2 animate-fade-in">
            <p className="font-sans text-[0.68rem] font-semibold text-ink">Add a new country</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Country name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-card focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="Flag emoji"
                value={newFlag}
                onChange={(e) => setNewFlag(e.target.value)}
                className="w-16 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-card focus:outline-none focus:border-accent text-center"
              />
            </div>
            <input
              type="number"
              placeholder="Median monthly salary (USD, optional)"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              className="w-full border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-card focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleAddCountry}
              disabled={!newName.trim()}
              className="w-full bg-accent text-white font-sans text-[0.72rem] font-semibold py-1.5 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add country
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            placeholder="Estimated price impact (%)"
            value={impactPct}
            onChange={(e) => setImpactPct(e.target.value)}
            className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          />
          <input
            type="text"
            placeholder="Source / note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          />
        </div>
        <button
          onClick={handleSaveImpact}
          disabled={!selectedCountry || !selectedCategory || !selectedWar || !impactPct}
          className="w-full bg-accent text-white font-sans text-[0.72rem] font-semibold py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save refinement
        </button>
      </div>

      {/* Saved refinements list */}
      {refinements.categoryImpacts.length > 0 && (
        <div className="border-t border-border pt-3">
          <h4 className="font-sans text-[0.68rem] font-bold text-ink-muted uppercase tracking-wider mb-2">
            Saved Impact Refinements
          </h4>
          <div className="space-y-1.5">
            {refinements.categoryImpacts.map((r) => (
              <div
                key={`${r.country}-${r.categoryId}-${r.warId}`}
                className="flex items-center justify-between bg-bg-alt rounded px-2.5 py-1.5"
              >
                <div className="font-sans text-[0.68rem] text-ink">
                  <span className="font-semibold">{r.country}</span>
                  <span className="text-ink-muted"> · {r.categoryId} · {r.warId}</span>
                  <span className="text-accent font-bold ml-1">+{r.impactPct}%</span>
                  <span className="ml-1.5 bg-blue-light text-blue font-bold px-1 py-0.5 rounded text-[0.55rem]">User data</span>
                </div>
                <button
                  onClick={() => removeImpact(r.country, r.categoryId, r.warId)}
                  className="text-ink-muted hover:text-accent cursor-pointer text-[0.8rem] ml-2"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Tab: FX Rates ──────────────────────────────────────────── */

function FxTab({
  refinements,
  onChange,
}: {
  refinements: UserRefinements
  onChange: (r: UserRefinements) => void
}) {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedWar, setSelectedWar] = useState('')
  const [preRate, setPreRate] = useState('')
  const [postRate, setPostRate] = useState('')
  const [currCode, setCurrCode] = useState('')
  const [currName, setCurrName] = useState('')
  const [note, setNote] = useState('')

  // Auto-fill currency from CURRENCIES when country + war are selected
  const handleCountryWarChange = (country: string, warId: string) => {
    const warCurr = CURRENCIES[warId as WarId]
    if (warCurr && warCurr[country]) {
      const c = warCurr[country]
      setCurrCode(c.code)
      setCurrName(c.name)
      setPreRate(String(c.preRate))
      setPostRate(String(c.postRate))
    }
  }

  const handleSaveFx = () => {
    const pre = parseFloat(preRate)
    const post = parseFloat(postRate)
    if (!selectedCountry || !selectedWar || isNaN(pre) || isNaN(post) || !currCode) return
    const existing = refinements.fxRates.filter(
      (x) => !(x.country === selectedCountry && x.warId === selectedWar),
    )
    const entry: FxRefinement = {
      country: selectedCountry,
      warId: selectedWar,
      preRate: pre,
      postRate: post,
      currencyCode: currCode,
      currencyName: currName || currCode,
      note: note || undefined,
      updatedAt: new Date().toISOString(),
      source: 'user',
    }
    onChange({ ...refinements, fxRates: [...existing, entry] })
    setNote('')
  }

  const removeFx = (country: string, warId: string) => {
    onChange({
      ...refinements,
      fxRates: refinements.fxRates.filter((x) => !(x.country === country && x.warId === warId)),
    })
  }

  const allCountries = [
    ...COUNTRIES.map((c) => c.name),
    ...refinements.newCountries.map((c) => c.country),
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value)
              if (selectedWar) handleCountryWarChange(e.target.value, selectedWar)
            }}
            className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          >
            <option value="">Country</option>
            {allCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={selectedWar}
            onChange={(e) => {
              setSelectedWar(e.target.value)
              if (selectedCountry) handleCountryWarChange(selectedCountry, e.target.value)
            }}
            className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          >
            <option value="">Conflict</option>
            {WAR_LIST.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Currency code (e.g. PHP)"
            value={currCode}
            onChange={(e) => setCurrCode(e.target.value)}
            className="w-24 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          />
          <input
            type="text"
            placeholder="Currency name"
            value={currName}
            onChange={(e) => setCurrName(e.target.value)}
            className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            placeholder="Pre-war rate (per USD)"
            value={preRate}
            onChange={(e) => setPreRate(e.target.value)}
            className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Current rate (per USD)"
            value={postRate}
            onChange={(e) => setPostRate(e.target.value)}
            className="flex-1 border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
          />
        </div>
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-border rounded px-2 py-1.5 font-sans text-[0.72rem] text-ink bg-bg-alt focus:outline-none focus:border-accent"
        />
        <button
          onClick={handleSaveFx}
          disabled={!selectedCountry || !selectedWar || !preRate || !postRate || !currCode}
          className="w-full bg-accent text-white font-sans text-[0.72rem] font-semibold py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save FX refinement
        </button>
      </div>

      {/* Saved FX refinements */}
      {refinements.fxRates.length > 0 && (
        <div className="border-t border-border pt-3">
          <h4 className="font-sans text-[0.68rem] font-bold text-ink-muted uppercase tracking-wider mb-2">
            Saved FX Refinements
          </h4>
          <div className="space-y-1.5">
            {refinements.fxRates.map((r) => (
              <div
                key={`${r.country}-${r.warId}`}
                className="flex items-center justify-between bg-bg-alt rounded px-2.5 py-1.5"
              >
                <div className="font-sans text-[0.68rem] text-ink">
                  <span className="font-semibold">{r.country}</span>
                  <span className="text-ink-muted"> · {r.currencyCode}/{r.warId}</span>
                  <span className="text-ink ml-1">{r.preRate} → {r.postRate}</span>
                  <span className="ml-1.5 bg-blue-light text-blue font-bold px-1 py-0.5 rounded text-[0.55rem]">User data</span>
                </div>
                <button
                  onClick={() => removeFx(r.country, r.warId)}
                  className="text-ink-muted hover:text-accent cursor-pointer text-[0.8rem] ml-2"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
