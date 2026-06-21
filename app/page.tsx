'use client'
import { useState } from 'react'

const cuisines = ['All', 'Italian', 'Indian', 'Mexican', 'Japanese', 'Arab', 'Mediterranean']

export default function Home() {
  const [selected, setSelected] = useState('All')
  const [search, setSearch] = useState('')
  const [screen, setScreen] = useState('home')
  const [activeRecipe, setActiveRecipe] = useState<any>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [recipes, setRecipes] = useState<any[]>([])

  const filtered = recipes.filter(r => {
    const matchCuisine = selected === 'All' || r.cuisine === selected
    const matchSearch = (r.name || '').toLowerCase().includes(search.toLowerCase())
    return matchCuisine && matchSearch
  })

  if (screen === 'recipe' && activeRecipe) {
    return <RecipeScreen recipe={activeRecipe} onBack={() => setScreen('home')} />
  }
  if (screen === 'paywall') {
    return <PaywallScreen onBack={() => setScreen('home')} onUnlock={() => { setIsPremium(true); setScreen('home') }} />
  }
  if (screen === 'snap') {
    return <SnapScreen onBack={() => setScreen('home')} isPremium={isPremium} onUpgrade={() => setScreen('paywall')} setRecipes={setRecipes} recipes={recipes} setScreen={setScreen} setActiveRecipe={setActiveRecipe} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white min-h-screen flex flex-col shadow-lg">
        <div className="bg-[#1A2B1A] px-5 pt-10 pb-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-[#A8D5A2] text-xl font-semibold">🥦 PantrySnap AI</h1>
              <p className="text-white/50 text-xs mt-0.5">Cook what you already have</p>
            </div>
            {isPremium && <span className="text-[#A8D5A2] text-xs border border-[#A8D5A2]/40 rounded-lg px-2 py-1">Premium</span>}
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5">
            <span className="text-white/50">🔍</span>
            <input className="bg-transparent text-white placeholder-white/40 text-sm flex-1 outline-none" placeholder="Search any dish..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="mx-4 mt-4 bg-[#1A2B1A] rounded-xl p-3 flex items-center gap-3 cursor-pointer" onClick={() => setScreen('snap')}>
          <div className="w-10 h-10 bg-[#A8D5A2]/20 rounded-xl flex items-center justify-center text-xl">📷</div>
          <div className="flex-1">
            <p className="text-[#A8D5A2] text-sm font-medium">Snap your fridge</p>
            <p className="text-white/50 text-xs">AI suggests recipes from your ingredients</p>
          </div>
          <span className="text-xs bg-[#A8D5A2] text-[#1A2B1A] font-medium px-2 py-1 rounded-lg">{isPremium ? 'Open Scan' : 'Try Premium'}</span>
        </div>

        <div className="px-4 mt-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Cuisine</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cuisines.map(c => (
              <button key={c} onClick={() => setSelected(c)} className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-all ${selected === c ? 'bg-[#1A2B1A] text-[#A8D5A2] border-[#1A2B1A]' : 'border-gray-200 text-gray-500'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="px-4 mt-4 grid grid-cols-2 gap-3 pb-24">
          {recipes.length === 0 && (
            <div className="col-span-2 text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📷</div>
              <p className="text-sm">Snap your fridge to get AI recipe suggestions</p>
              <button onClick={() => setScreen('snap')} className="mt-4 px-4 py-2 bg-[#1A2B1A] text-[#A8D5A2] rounded-xl text-sm">{isPremium ? 'Open Snap' : 'Try Premium'}</button>
            </div>
          )}
          {filtered.map((r, index) => (
            <div key={index} onClick={() => { setActiveRecipe(r); setScreen('recipe') }} className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
              <div className="h-24 bg-gray-100 flex items-center justify-center text-4xl">🍽️</div>
              <div className="p-2.5">
                <p className="text-sm font-medium text-gray-800 leading-tight">{r.name}</p>
                <p className="text-xs text-gray-400 mt-1">AI Generated</p>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 flex">
          {[['🏠','Home','home'],['📷','Snap','snap'],['❤️','Saved','home'],['⚙️','Settings','home']].map(([icon,label,target]) => (
            <button key={label} onClick={() => setScreen(target)} className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs ${screen === target ? 'text-[#2D5A27]' : 'text-gray-400'}`}>
              <span className="text-lg">{icon}</span>{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SnapScreen({ onBack, isPremium, onUpgrade, setRecipes, recipes, setScreen, setActiveRecipe }: any) {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [people, setPeople] = useState(2)
  const [cuisine, setCuisine] = useState('Any')
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const cuisineOptions = ['Any','Italian','Indian','Mexican','Japanese','Chinese','Arab','Mediterranean']

  const handleImage = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev: any) => setImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  const analyse = async () => {
    if (!image) return
    setLoading(true)
    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, people, cuisine })
      })
      const data = await res.json()
      if (data.recipes) {
        setRecipes(data.recipes)
        onBack()
      } else {
        alert(data.error || 'Something went wrong')
      }
    } catch (err) {
      alert('Failed to contact the AI server.')
    } finally {
      setLoading(false)
    }
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-[#172618] flex flex-col items-center justify-center p-6 text-center relative">
        <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white">← Back</button>
        <div className="flex flex-col items-center max-w-xs mx-auto">
          <div className="text-5xl mb-6">👑</div>
          <h2 className="text-3xl font-bold text-[#A7DDA7] mb-4">Upgrade to Premium</h2>
          <p className="text-sm text-gray-300 mb-8 leading-relaxed">Snap your fridge, pick your cuisine, and let AI generate full recipes instantly.</p>
          <div className="bg-[#1e3320] border border-[#2a452c] rounded-2xl p-5 w-full mb-6 shadow-lg space-y-3">
            {[
              ['monthly', '€3.50', '/month', ''],
              ['6months', '€19.00', '/6 months', 'Save 10% vs monthly'],
              ['yearly', '€35.00', '/year', 'Save 17% vs monthly'],
            ].map(([id, price, per, saving]) => (
              <div key={id} onClick={() => setSelectedPlan(id)} className={`flex items-center justify-between rounded-xl px-4 py-3 border cursor-pointer transition-all ${selectedPlan === id ? 'border-[#A7DDA7] bg-[#A7DDA7]/10' : 'border-[#2a452c] hover:border-[#A7DDA7]/40'}`}>
                <div>
                  <p className="text-white font-bold text-sm">{price} <span className="text-gray-400 font-normal text-xs">{per}</span></p>
                  {saving && <p className="text-[#A7DDA7] text-xs mt-0.5">{saving}</p>}
                </div>
                {selectedPlan === id && <span className="text-xs bg-[#A7DDA7] text-[#172618] px-2 py-0.5 rounded-full font-bold">Selected</span>}
              </div>
            ))}
          </div>
          <button onClick={onUpgrade} className="w-full py-4 bg-[#A7DDA7] text-[#172618] font-extrabold rounded-xl shadow-lg hover:bg-[#8ec28e] transition-all">Unlock Premium</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white min-h-screen p-4 space-y-4 pb-24 shadow-lg">
        <button onClick={onBack} className="text-sm text-gray-500">← Back</button>
        <h2 className="text-lg font-bold text-gray-800">Fridge Snapshot</h2>
        <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50">
          {image ? <img src={image} className="w-full rounded-xl max-h-40 object-cover" alt="fridge" /> : (
            <><div className="text-4xl mb-2">📸</div><p className="text-xs text-gray-400">Tap to upload your fridge photo</p></>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </label>

        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cuisine Style</label>
            <select value={cuisine} onChange={e => setCuisine(e.target.value)} className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 outline-none text-gray-700">
              {cuisineOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">How many eat?</label>
            <select value={people} onChange={e => setPeople(Number(e.target.value))} className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 outline-none text-gray-700">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
            </select>
          </div>
        </div>

        <button onClick={analyse} disabled={!image || loading} className="w-full py-3.5 bg-[#1A2B1A] text-[#A8D5A2] rounded-xl font-bold disabled:opacity-50">
          {loading ? 'Analysing with AI…' : 'Find recipes from my fridge'}
        </button>

        {recipes && recipes.length > 0 && (
          <div className="space-y-4 mt-2">
            <p className="text-xs font-bold text-gray-400 uppercase">AI found {recipes.length} recipes</p>
            {recipes.map((r: any, i: number) => (
              <div key={i} onClick={() => { setActiveRecipe(r); setScreen('recipe') }} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <p className="text-sm font-bold text-gray-800">🍽️ {r.name}</p>
                <p className="text-xs text-gray-500 mt-1">{r.description}</p>
                <p className="text-xs text-green-700 mt-2">🛒 {r.ingredients}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RecipeScreen({ recipe, onBack }: { recipe: any, onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white min-h-screen p-5 shadow-lg pb-12">
        <button onClick={onBack} className="text-sm text-gray-500 mb-4 block">← Back</button>
        <div className="text-6xl text-center my-4">🍽️</div>
        <h2 className="text-xl font-bold text-gray-800">{recipe?.name}</h2>
        <p className="text-sm text-gray-400 mt-1 mb-4">{recipe?.description}</p>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100 mb-4">
          <p className="text-xs font-bold text-green-800 uppercase mb-1">Ingredients</p>
          <p className="text-sm text-gray-700">{recipe?.ingredients}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-3">Step-by-Step</p>
          {recipe?.instructions && Array.isArray(recipe.instructions) ? (
            recipe.instructions.map((step: string, i: number) => (
              <div key={i} className="flex gap-3 py-3 border-b border-gray-50">
                <span className="w-6 h-6 rounded-full bg-[#1A2B1A] text-[#A8D5A2] text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No instructions available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function PaywallScreen({ onBack, onUnlock }: { onBack: () => void, onUnlock: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  const plans = [
    { id: 'monthly', price: '€3.50', per: '/month', saving: '' },
    { id: '6months', price: '€19.00', per: '/6 months', saving: 'Save 10% vs monthly' },
    { id: 'yearly', price: '€35.00', per: '/year', saving: 'Save 17% vs monthly' },
  ]
   const handleUnlock = async () => {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: selectedPlan })
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  } catch {
    alert('Something went wrong. Try again.')
  }
}


  return (
    <div className="min-h-screen bg-[#172618] flex flex-col items-center justify-center p-6 text-center relative">
      <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white">← Back</button>
      <div className="flex flex-col items-center max-w-xs mx-auto">
        <div className="text-5xl mb-6">👑</div>
        <h2 className="text-3xl font-bold text-[#A7DDA7] mb-4">Upgrade to Premium</h2>
        <p className="text-sm text-gray-300 mb-8 leading-relaxed">Snap your fridge, pick your cuisine, and let AI generate full recipes instantly.</p>
        <div className="bg-[#1e3320] border border-[#2a452c] rounded-2xl p-5 w-full mb-6 shadow-lg space-y-3">
          {plans.map(({ id, price, per, saving }) => (
            <div
              key={id}
              onClick={() => setSelectedPlan(id)}
              className={`flex items-center justify-between rounded-xl px-4 py-3 border cursor-pointer transition-all ${selectedPlan === id ? 'border-[#A7DDA7] bg-[#A7DDA7]/10' : 'border-[#2a452c] hover:border-[#A7DDA7]/40'}`}
            >
              <div>
                <p className="text-white font-bold text-sm">{price} <span className="text-gray-400 font-normal text-xs">{per}</span></p>
                {saving && <p className="text-[#A7DDA7] text-xs mt-0.5">{saving}</p>}
              </div>
              {selectedPlan === id && (
                <span className="text-xs bg-[#A7DDA7] text-[#172618] px-2 py-0.5 rounded-full font-bold">Selected</span>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleUnlock}
          className="w-full py-4 bg-[#A7DDA7] text-[#172618] font-extrabold rounded-xl shadow-lg hover:bg-[#8ec28e] transition-all"
        >
          Unlock Premium — {plans.find(p => p.id === selectedPlan)?.price}{plans.find(p => p.id === selectedPlan)?.per}
        </button>
      </div>
    </div>
  )
}
