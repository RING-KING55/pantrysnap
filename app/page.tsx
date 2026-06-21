'use client'
import { useState, useEffect } from 'react'

const FREE_RECIPES = [
  { id: 1, name: 'Margherita Pizza', cuisine: 'Italian', time: '20 min', calories: 800, servings: 2, emoji: '🍕', ingredients: [['Pizza dough','300g'],['Tomato sauce','100ml'],['Mozzarella','150g'],['Fresh basil','5 leaves'],['Olive oil','2 tbsp']], steps: ['Preheat oven to 250°C and place a baking tray inside to heat.','Roll out the pizza dough on a floured surface into a thin round.','Spread tomato sauce evenly leaving a 2cm border.','Tear mozzarella into pieces and scatter over the sauce.','Bake 10-12 minutes until crust is golden and cheese is bubbling.','Add fresh basil and drizzle olive oil. Serve immediately.'] },
  { id: 2, name: 'Spaghetti Carbonara', cuisine: 'Italian', time: '20 min', calories: 650, servings: 2, emoji: '🍝', ingredients: [['Spaghetti','200g'],['Eggs','2'],['Pancetta','80g'],['Parmesan','40g'],['Black pepper','1 tsp']], steps: ['Boil salted water and cook spaghetti until al dente.','Fry pancetta until crispy then remove from heat.','Whisk eggs with parmesan and lots of black pepper.','Drain pasta saving a cup of pasta water.','Add pasta to pancetta pan off heat, pour egg mix over and toss fast.','Add pasta water to loosen until creamy. Serve immediately.'] },
  { id: 3, name: 'Beef Burger', cuisine: 'American', time: '20 min', calories: 850, servings: 1, emoji: '🍔', ingredients: [['Beef mince','200g'],['Burger bun','1'],['Cheddar','2 slices'],['Lettuce','2 leaves'],['Tomato','1']], steps: ['Season beef mince with salt and pepper and form into a patty.','Heat a pan to high heat.','Cook patty 3-4 minutes each side.','Add cheese in last minute and let melt.','Toast the bun, add lettuce and tomato.','Place patty on bun, add sauce and serve hot.'] },
  { id: 4, name: 'Chicken Biryani', cuisine: 'Indian', time: '45 min', calories: 720, servings: 2, emoji: '🍛', ingredients: [['Basmati rice','300g'],['Chicken thighs','400g'],['Onion','1 large'],['Biryani spice mix','2 tbsp'],['Yoghurt','100ml']], steps: ['Marinate chicken in yoghurt and spices for 20 minutes.','Fry sliced onion until golden.','Sear chicken until browned then add onions.','Layer par-cooked rice over chicken and seal pot.','Cook on lowest heat for 20 minutes.','Fluff and serve hot.'] },
  { id: 5, name: 'Chicken Tacos', cuisine: 'Mexican', time: '25 min', calories: 520, servings: 2, emoji: '🌮', ingredients: [['Chicken breast','300g'],['Corn tortillas','6'],['Lime','1'],['Salsa','4 tbsp'],['Soured cream','3 tbsp']], steps: ['Season chicken with cumin, paprika, salt and pepper.','Cook chicken in hot pan 5-6 minutes each side.','Rest 5 minutes then slice into strips.','Warm tortillas in dry pan 30 seconds each side.','Fill tortillas with chicken and salsa.','Top with soured cream and a squeeze of lime.'] },
  { id: 6, name: 'Caesar Salad', cuisine: 'American', time: '15 min', calories: 380, servings: 2, emoji: '🥗', ingredients: [['Romaine lettuce','1 head'],['Parmesan','30g'],['Croutons','50g'],['Caesar dressing','4 tbsp'],['Lemon','half']], steps: ['Wash and tear romaine lettuce into large pieces.','Pour caesar dressing into a large bowl.','Add lettuce and toss until well coated.','Add croutons and shaved parmesan.','Squeeze lemon juice over the top.','Toss once more and serve immediately.'] },
  { id: 7, name: 'Vegetable Stir Fry', cuisine: 'Chinese', time: '15 min', calories: 320, servings: 2, emoji: '🥘', ingredients: [['Mixed vegetables','400g'],['Soy sauce','3 tbsp'],['Garlic','3 cloves'],['Ginger','1 tsp'],['Sesame oil','1 tbsp']], steps: ['Heat oil in a wok until smoking hot.','Add garlic and ginger and stir 30 seconds.','Add hard vegetables first, stir fry 3 minutes.','Add softer vegetables and soy sauce.','Toss everything together on high heat 2 minutes.','Drizzle sesame oil and serve over rice.'] },
  { id: 8, name: 'Shakshuka', cuisine: 'Arab', time: '25 min', calories: 420, servings: 2, emoji: '🍳', ingredients: [['Eggs','4'],['Tinned tomatoes','400g'],['Red pepper','1'],['Onion','1'],['Cumin','1 tsp']], steps: ['Fry diced onion and pepper in olive oil until soft.','Add cumin and paprika and stir 1 minute.','Pour in tinned tomatoes and simmer 10 minutes.','Make 4 wells in the sauce and crack an egg into each.','Cover and cook 5-7 minutes until whites are set.','Serve with crusty bread for dipping.'] },
  { id: 9, name: 'Greek Salad', cuisine: 'Mediterranean', time: '10 min', calories: 280, servings: 2, emoji: '🥙', ingredients: [['Tomatoes','3 large'],['Cucumber','1'],['Feta cheese','100g'],['Olives','50g'],['Olive oil','3 tbsp']], steps: ['Chop tomatoes into large chunks.','Slice cucumber into half moons.','Combine tomatoes and cucumber in a bowl.','Add olives and crumble feta over the top.','Drizzle generously with olive oil.','Season with salt, oregano and serve.'] },
  { id: 10, name: 'Pancakes', cuisine: 'American', time: '20 min', calories: 450, servings: 2, emoji: '🥞', ingredients: [['Flour','200g'],['Eggs','2'],['Milk','300ml'],['Butter','2 tbsp'],['Sugar','1 tbsp']], steps: ['Mix flour, sugar and a pinch of salt in a bowl.','Whisk eggs and milk together then add melted butter.','Pour wet into dry and mix until smooth batter forms.','Heat a non-stick pan with a little butter on medium heat.','Pour a ladle of batter, cook until bubbles form then flip.','Cook 1 more minute and serve with syrup or fruit.'] },
]

type Recipe = typeof FREE_RECIPES[0] & { description?: string }

export default function Home() {
  const [screen, setScreen] = useState('home')
  const [activeRecipe, setActiveRecipe] = useState<any>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [saved, setSaved] = useState<number[]>([])
  const [cooked, setCooked] = useState<Record<number, number>>({})
  const [aiRecipes, setAiRecipes] = useState<any[]>([])
  const [calendarMeals, setCalendarMeals] = useState<Record<string, any>>({})

  useEffect(() => {
    try {
      const s = localStorage.getItem('saved')
      const c = localStorage.getItem('cooked')
      const p = localStorage.getItem('premium')
      const d = localStorage.getItem('darkMode')
      const cal = localStorage.getItem('calendar')
      if (s) setSaved(JSON.parse(s))
      if (c) setCooked(JSON.parse(c))
      if (p) setIsPremium(true)
      if (d) setDarkMode(JSON.parse(d))
      if (cal) setCalendarMeals(JSON.parse(cal))
    } catch {}
  }, [])

  const toggleSave = (id: number) => {
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem('saved', JSON.stringify(next))
  }

  const markCooked = (id: number) => {
    const next = { ...cooked, [id]: (cooked[id] || 0) + 1 }
    setCooked(next)
    localStorage.setItem('cooked', JSON.stringify(next))
  }

  const unlockPremium = () => {
    setIsPremium(true)
    localStorage.setItem('premium', 'true')
  }

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('darkMode', JSON.stringify(next))
  }

  const allRecipes = [...FREE_RECIPES, ...aiRecipes]
  const cuisines = ['All', 'Italian', 'American', 'Mexican', 'Indian', 'Chinese', 'Arab', 'Mediterranean']

  const filtered = allRecipes.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
    const matchCuisine = selectedCuisine === 'All' || r.cuisine === selectedCuisine
    return matchSearch && matchCuisine
  })

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50'
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
  const text = darkMode ? 'text-white' : 'text-gray-800'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'
  const mainBg = darkMode ? 'bg-gray-900' : 'bg-white'

  const goToRecipe = (recipe: any) => {
    setActiveRecipe(recipe)
    markCooked(recipe.id)
    setScreen('recipe')
  }

  if (screen === 'recipe' && activeRecipe) return <RecipeScreen recipe={activeRecipe} onBack={() => setScreen('home')} isPremium={isPremium} onUpgrade={() => setScreen('paywall')} saved={saved} toggleSave={toggleSave} darkMode={darkMode} />
  if (screen === 'paywall') return <PaywallScreen onBack={() => setScreen('home')} onUnlock={unlockPremium} darkMode={darkMode} />
  if (screen === 'snap') return <SnapScreen onBack={() => setScreen('home')} isPremium={isPremium} onUpgrade={() => setScreen('paywall')} setAiRecipes={setAiRecipes} aiRecipes={aiRecipes} goToRecipe={goToRecipe} darkMode={darkMode} />
  if (screen === 'saved') return <SavedScreen onBack={() => setScreen('home')} saved={saved} cooked={cooked} allRecipes={allRecipes} toggleSave={toggleSave} goToRecipe={goToRecipe} darkMode={darkMode} />
  if (screen === 'calendar') return <CalendarScreen onBack={() => setScreen('home')} isPremium={isPremium} onUpgrade={() => setScreen('paywall')} allRecipes={allRecipes} calendarMeals={calendarMeals} setCalendarMeals={setCalendarMeals} darkMode={darkMode} />
  if (screen === 'settings') return <SettingsScreen onBack={() => setScreen('home')} darkMode={darkMode} toggleDark={toggleDark} isPremium={isPremium} setIsPremium={setIsPremium} />

  return (
    <div className={`min-h-screen ${bg} flex flex-col items-center`}>
      <div className={`w-full max-w-sm ${mainBg} min-h-screen flex flex-col shadow-lg`}>
        <div className="bg-[#1A2B1A] px-5 pt-10 pb-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-[#A8D5A2] text-xl font-semibold">🥦 PantrySnap AI</h1>
              <p className="text-white/50 text-xs mt-0.5">Cook what you already have</p>
            </div>
            {isPremium && <span className="text-[#A8D5A2] text-xs border border-[#A8D5A2]/40 rounded-lg px-2 py-1">⭐ Premium</span>}
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5">
            <span className="text-white/50">🔍</span>
            <input className="bg-transparent text-white placeholder-white/40 text-sm flex-1 outline-none" placeholder="Search any dish..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')} className="text-white/40 text-xl leading-none">×</button>}
          </div>
        </div>

        <div className="mx-4 mt-4 bg-[#1A2B1A] rounded-xl p-3 flex items-center gap-3 cursor-pointer" onClick={() => setScreen('snap')}>
          <div className="w-10 h-10 bg-[#A8D5A2]/20 rounded-xl flex items-center justify-center text-xl">📷</div>
          <div className="flex-1">
            <p className="text-[#A8D5A2] text-sm font-medium">Snap your fridge</p>
            <p className="text-white/50 text-xs">AI suggests recipes from your ingredients</p>
          </div>
          <span className="text-xs bg-[#A8D5A2] text-[#1A2B1A] font-medium px-2 py-1 rounded-lg">{isPremium ? 'Open' : 'Premium'}</span>
        </div>

        <div className="px-4 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cuisines.map(c => (
              <button key={c} onClick={() => setSelectedCuisine(c)} className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-all ${selectedCuisine === c ? 'bg-[#1A2B1A] text-[#A8D5A2] border-[#1A2B1A]' : `border-gray-200 ${subtext}`}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="px-4 mt-4 pb-24">
          {search && <p className={`text-xs ${subtext} mb-3`}>{filtered.length} results for "{search}"</p>}
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((r, i) => {
              const isFree = FREE_RECIPES.find(f => f.id === r.id)
              const isLocked = !isFree && !isPremium
              return (
                <div key={i} onClick={() => !isLocked && goToRecipe(r)} className={`${card} border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${isLocked ? 'opacity-60' : ''}`}>
                  <div className="h-24 bg-gray-50 flex items-center justify-center text-4xl relative">
                    {r.emoji}
                    {isLocked && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><span className="text-2xl">🔒</span></div>}
                  </div>
                  <div className="p-2.5">
                    <p className={`text-sm font-medium ${text} leading-tight`}>{r.name}</p>
                    <p className={`text-xs ${subtext} mt-1`}>⏱ {r.time} · 🔥 {r.calories} cal</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isFree ? 'bg-gray-100 text-gray-500' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>{isFree ? 'Free' : '⭐'}</span>
                      <button onClick={e => { e.stopPropagation(); toggleSave(r.id) }} className="text-lg">{saved.includes(r.id) ? '❤️' : '🤍'}</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <p className={`text-sm ${subtext}`}>No recipes found for "{search}"</p>
              {!isPremium && <p className={`text-xs ${subtext} mt-2`}>Upgrade to Premium for AI-powered search</p>}
            </div>
          )}
        </div>

        <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'} border-t flex`}>
          {[['🏠','Home','home'],['📷','Snap','snap'],['📅','Planner','calendar'],['❤️','Saved','saved'],['⚙️','Settings','settings']].map(([icon,label,target]) => (
            <button key={label} onClick={() => setScreen(target)} className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs ${screen === target ? 'text-[#2D5A27]' : subtext}`}>
              <span className="text-lg">{icon}</span>{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RecipeScreen({ recipe, onBack, isPremium, onUpgrade, saved, toggleSave, darkMode }: any) {
  const [servings, setServings] = useState(recipe.servings || 2)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const base = recipe.servings || 2
  const multiplier = servings / base
  const text = darkMode ? 'text-white' : 'text-gray-800'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'
  const bg = darkMode ? 'bg-gray-900' : 'bg-white'

  const toggleStep = (i: number) => {
    setCompletedSteps(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  const steps = recipe.steps || []
  const progress = steps.length > 0 ? Math.round((completedSteps.length / steps.length) * 100) : 0

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col items-center`}>
      <div className={`w-full max-w-sm ${bg} min-h-screen flex flex-col shadow-lg`}>
        <div className="bg-[#1A2B1A] px-5 pt-10 pb-5">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-white/60 text-sm">← Back</button>
            <button onClick={() => toggleSave(recipe.id)} className="text-2xl">{saved.includes(recipe.id) ? '❤️' : '🤍'}</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pb-10 px-5">
          <div className="text-6xl text-center my-5">{recipe.emoji}</div>
          <h2 className={`text-xl font-bold ${text}`}>{recipe.name}</h2>
          <p className={`text-sm ${subtext} mt-1`}>{recipe.cuisine} · {recipe.time}</p>
          <div className="flex gap-3 mt-3 flex-wrap">
            <span className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">🔥 {Math.round((recipe.calories || 0) * multiplier)} cal</span>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">👥 {servings} {servings === 1 ? 'person' : 'people'}</span>
          </div>

          {!isPremium && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-3">
              <span>🔒</span>
              <div>
                <p className="text-xs text-yellow-700">Adjust servings and calories with Premium.</p>
                <button onClick={onUpgrade} className="text-xs text-green-700 font-medium mt-1">→ Unlock for €3.50/month</button>
              </div>
            </div>
          )}

          {isPremium && (
            <div className={`mt-4 flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl px-4 py-3`}>
              <span className={`text-sm ${subtext}`}>Servings</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setServings(Math.max(1, servings - 1))} className={`w-8 h-8 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-700'} font-bold text-lg flex items-center justify-center`}>−</button>
                <span className={`text-base font-bold w-6 text-center ${text}`}>{servings}</span>
                <button onClick={() => setServings(Math.min(20, servings + 1))} className={`w-8 h-8 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-700'} font-bold text-lg flex items-center justify-center`}>+</button>
              </div>
            </div>
          )}

          {recipe.ingredients && (
            <div className="mt-5">
              <h3 className={`text-sm font-bold ${text} mb-3`}>Ingredients</h3>
              {recipe.ingredients.map(([name, qty]: string[], i: number) => (
                <div key={i} className={`flex justify-between py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} text-sm`}>
                  <span className={text}>{name}</span>
                  <span className={subtext}>{isPremium && multiplier !== 1 ? `${qty} ×${multiplier.toFixed(1)}` : qty}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-bold ${text}`}>Steps</h3>
              <span className={`text-xs ${subtext}`}>{completedSteps.length}/{steps.length} done</span>
            </div>
            <div className={`h-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full mb-4`}>
              <div className="h-1.5 bg-[#2D5A27] rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            {steps.map((step: string, i: number) => {
              const done = completedSteps.includes(i)
              return (
                <div key={i} className={`flex gap-3 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}>
                  <button onClick={() => toggleStep(i)} className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${done ? 'bg-[#2D5A27] border-[#2D5A27]' : darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    {done && <span className="text-white text-xs font-bold">✓</span>}
                  </button>
                  <p className={`text-sm leading-relaxed ${done ? 'line-through opacity-40' : ''} ${text}`}>{i + 1}. {step}</p>
                </div>
              )
            })}
            {progress === 100 && steps.length > 0 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-sm font-bold text-green-700">Recipe complete! Enjoy your meal!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SavedScreen({ onBack, saved, cooked, allRecipes, toggleSave, goToRecipe, darkMode }: any) {
  const text = darkMode ? 'text-white' : 'text-gray-800'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'
  const bg = darkMode ? 'bg-gray-900' : 'bg-white'

  const savedRecipes = allRecipes
    .filter((r: any) => saved.includes(r.id))
    .sort((a: any, b: any) => (cooked[b.id] || 0) - (cooked[a.id] || 0))

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col items-center`}>
      <div className={`w-full max-w-sm ${bg} min-h-screen shadow-lg`}>
        <div className="bg-[#1A2B1A] px-5 pt-10 pb-5">
          <button onClick={onBack} className="text-white/60 text-sm mb-3 block">← Back</button>
          <h1 className="text-[#A8D5A2] text-xl font-semibold">❤️ Saved Recipes</h1>
          <p className="text-white/50 text-xs mt-1">Your favourite dishes</p>
        </div>
        <div className="px-4 py-4 space-y-3 pb-24">
          {savedRecipes.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🤍</div>
              <p className={`text-sm ${subtext}`}>No saved recipes yet</p>
              <p className={`text-xs ${subtext} mt-1`}>Tap the heart on any recipe to save it</p>
            </div>
          )}
          {savedRecipes.map((r: any, i: number) => (
            <div key={r.id} onClick={() => goToRecipe(r)} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow`}>
              <span className="text-3xl">{r.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-medium ${text}`}>{r.name}</p>
                  {i === 0 && (cooked[r.id] || 0) > 1 && <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full">🔥 Most cooked</span>}
                </div>
                <p className={`text-xs ${subtext} mt-0.5`}>{r.cuisine} · {r.time} · 🔥 {r.calories} cal</p>
                {cooked[r.id] && <p className="text-xs text-green-600 mt-0.5">Cooked {cooked[r.id]}×</p>}
              </div>
              <button onClick={e => { e.stopPropagation(); toggleSave(r.id) }} className="text-xl">❤️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CalendarScreen({ onBack, isPremium, onUpgrade, allRecipes, calendarMeals, setCalendarMeals, darkMode }: any) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showPicker, setShowPicker] = useState<string | null>(null)
  const text = darkMode ? 'text-white' : 'text-gray-800'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'
  const bg = darkMode ? 'bg-gray-900' : 'bg-white'
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'

  if (!isPremium) return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col items-center`}>
      <div className={`w-full max-w-sm ${bg} min-h-screen shadow-lg flex flex-col`}>
        <div className="bg-[#1A2B1A] px-5 pt-10 pb-5">
          <button onClick={onBack} className="text-white/60 text-sm mb-3 block">← Back</button>
          <h1 className="text-[#A8D5A2] text-xl font-semibold">📅 Meal Planner</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h2 className={`text-lg font-bold ${text} mb-2`}>Premium Feature</h2>
          <p className={`text-sm ${subtext} mb-6 leading-relaxed`}>Plan your meals, track calories, and build healthy habits with the diet calendar.</p>
          <button onClick={onUpgrade} className="w-full py-3 bg-[#1A2B1A] text-[#A8D5A2] rounded-xl font-medium">Unlock with Premium</button>
        </div>
      </div>
    </div>
  )

  const meals = ['Breakfast', 'Lunch', 'Dinner']
  const getMeal = (slot: string) => calendarMeals[`${selectedDate}-${slot}`]
  const totalCal = meals.reduce((sum, slot) => sum + (getMeal(slot)?.calories || 0), 0)

  const assignMeal = (slot: string, recipe: any) => {
    const next = { ...calendarMeals, [`${selectedDate}-${slot}`]: recipe }
    setCalendarMeals(next)
    localStorage.setItem('calendar', JSON.stringify(next))
    setShowPicker(null)
  }

  const removeMeal = (slot: string) => {
    const next = { ...calendarMeals }
    delete next[`${selectedDate}-${slot}`]
    setCalendarMeals(next)
    localStorage.setItem('calendar', JSON.stringify(next))
  }

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col items-center`}>
      <div className={`w-full max-w-sm ${bg} min-h-screen shadow-lg pb-24`}>
        <div className="bg-[#1A2B1A] px-5 pt-10 pb-5">
          <button onClick={onBack} className="text-white/60 text-sm mb-3 block">← Back</button>
          <h1 className="text-[#A8D5A2] text-xl font-semibold">📅 Meal Planner</h1>
          <p className="text-white/50 text-xs mt-1">Plan your meals for the week</p>
        </div>
        <div className="px-4 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map(d => {
              const date = new Date(d + 'T00:00:00')
              const isToday = d === new Date().toISOString().split('T')[0]
              return (
                <button key={d} onClick={() => setSelectedDate(d)} className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border transition-all ${selectedDate === d ? 'bg-[#1A2B1A] border-[#1A2B1A]' : darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                  <span className={`text-xs ${selectedDate === d ? 'text-[#A8D5A2]' : subtext}`}>{date.toLocaleDateString('en', { weekday: 'short' })}</span>
                  <span className={`text-sm font-bold ${selectedDate === d ? 'text-white' : text}`}>{date.getDate()}</span>
                  {isToday && <span className="text-xs text-[#A8D5A2]">Today</span>}
                </button>
              )
            })}
          </div>
        </div>
        <div className={`mx-4 mt-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-orange-50 border-orange-100'} border rounded-xl p-3 flex justify-between items-center`}>
          <span className={`text-sm font-medium ${text}`}>Daily total</span>
          <span className="text-sm font-bold text-orange-600">🔥 {totalCal} calories</span>
        </div>
        <div className="px-4 mt-4 space-y-3">
          {meals.map(slot => {
            const meal = getMeal(slot)
            return (
              <div key={slot} className={`${card} border rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${subtext} uppercase tracking-wider`}>{slot}</span>
                  {meal && <button onClick={() => removeMeal(slot)} className={`text-xs ${subtext}`}>Remove</button>}
                </div>
                {meal ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meal.emoji}</span>
                    <div>
                      <p className={`text-sm font-medium ${text}`}>{meal.name}</p>
                      <p className="text-xs text-orange-500">🔥 {meal.calories} cal · {meal.time}</p>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowPicker(slot)} className={`w-full py-2 border border-dashed ${darkMode ? 'border-gray-600 text-gray-500' : 'border-gray-300 text-gray-400'} rounded-lg text-sm`}>+ Add {slot.toLowerCase()}</button>
                )}
              </div>
            )
          })}
        </div>
        {showPicker && (
          <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} w-full max-w-sm rounded-t-2xl p-5 max-h-96 overflow-y-auto`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-sm font-bold ${text}`}>Pick a recipe for {showPicker}</h3>
                <button onClick={() => setShowPicker(null)} className={`${subtext} text-xl`}>×</button>
              </div>
              {allRecipes.map((r: any) => (
                <div key={r.id} onClick={() => assignMeal(showPicker, r)} className={`flex items-center gap-3 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} cursor-pointer`}>
                  <span className="text-2xl">{r.emoji}</span>
                  <div>
                    <p className={`text-sm font-medium ${text}`}>{r.name}</p>
                    <p className={`text-xs ${subtext}`}>🔥 {r.calories} cal · {r.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsScreen({ onBack, darkMode, toggleDark, isPremium, setIsPremium }: any) {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelled, setCancelled] = useState(false)
  const text = darkMode ? 'text-white' : 'text-gray-800'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'
  const bg = darkMode ? 'bg-gray-900' : 'bg-white'
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'

  const cancelReasons = ['Too expensive', 'Not using it enough', 'Missing a feature I need', 'Found a better app', 'Technical issues', 'Other']

  const handleCancel = () => {
    setIsPremium(false)
    localStorage.removeItem('premium')
    setCancelled(true)
    setShowCancelModal(false)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col items-center`}>
      <div className={`w-full max-w-sm ${bg} min-h-screen shadow-lg`}>
        <div className="bg-[#1A2B1A] px-5 pt-10 pb-5">
          <button onClick={onBack} className="text-white/60 text-sm mb-3 block">← Back</button>
          <h1 className="text-[#A8D5A2] text-xl font-semibold">⚙️ Settings</h1>
        </div>
        <div className="px-4 py-5 space-y-3 pb-24">
          {cancelled && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-700 font-medium">Subscription cancelled. Thanks for the feedback!</p>
            </div>
          )}
          <div className={`${card} border rounded-xl p-4 flex items-center justify-between`}>
            <div>
              <p className={`text-sm font-medium ${text}`}>Dark Mode</p>
              <p className={`text-xs ${subtext} mt-0.5`}>Easy on the eyes at night</p>
            </div>
            <button onClick={toggleDark} className={`w-12 h-6 rounded-full transition-all relative ${darkMode ? 'bg-[#2D5A27]' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${darkMode ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
          <div className={`${card} border rounded-xl p-4`}>
            <p className={`text-sm font-medium ${text}`}>Subscription</p>
            <p className={`text-xs ${subtext} mt-0.5 mb-3`}>{isPremium ? '⭐ Premium active' : 'Free plan'}</p>
            {isPremium ? (
              <button onClick={() => setShowCancelModal(true)} className="w-full py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">Cancel Subscription</button>
            ) : (
              <button onClick={onBack} className="w-full py-2.5 bg-[#1A2B1A] text-[#A8D5A2] rounded-xl text-sm font-medium">Upgrade to Premium</button>
            )}
          </div>
          <div className={`${card} border rounded-xl p-4`}>
            <p className={`text-sm font-medium ${text}`}>Privacy</p>
            <p className={`text-xs ${subtext} mt-1 leading-relaxed`}>We never store your personal data. No account required. Your saved recipes stay on your device only.</p>
          </div>
          <div className={`${card} border rounded-xl p-4`}>
            <p className={`text-sm font-medium ${text}`}>About PantrySnap AI</p>
            <p className={`text-xs ${subtext} mt-1`}>Version 1.0 · Built to help you cook smarter and waste less food.</p>
          </div>
        </div>
      </div>
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} w-full max-w-sm rounded-2xl p-6`}>
            <h3 className={`text-lg font-bold ${text} mb-1`}>Sorry to see you go 😢</h3>
            <p className={`text-sm ${subtext} mb-4`}>Help us improve — why are you cancelling?</p>
            <div className="space-y-2 mb-5">
              {cancelReasons.map(r => (
                <button key={r} onClick={() => setCancelReason(r)} className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${cancelReason === r ? 'border-[#2D5A27] bg-green-50 text-[#2D5A27] font-medium' : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                  {cancelReason === r ? '✓ ' : ''}{r}
                </button>
              ))}
            </div>
            <button onClick={handleCancel} disabled={!cancelReason} className="w-full py-3 bg-red-500 text-white rounded-xl font-medium disabled:opacity-40 mb-2">Confirm Cancellation</button>
            <button onClick={() => setShowCancelModal(false)} className={`w-full py-3 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-xl font-medium`}>Keep my Premium</button>
          </div>
        </div>
      )}
    </div>
  )
}

function PaywallScreen({ onBack, onUnlock, darkMode }: any) {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const text = darkMode ? 'text-white' : 'text-gray-800'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'

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
      if (data.url) window.location.href = data.url
    } catch {
      alert('Something went wrong. Try again.')
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col items-center`}>
      <div className={`w-full max-w-sm ${darkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen shadow-lg px-5 pb-10`}>
        <div className="bg-[#1A2B1A] -mx-5 px-5 pt-10 pb-5 mb-6">
          <button onClick={onBack} className="text-white/60 text-sm">← Back</button>
        </div>
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">👑</div>
          <h2 className={`text-2xl font-bold ${text}`}>PantrySnap Premium</h2>
          <p className={`text-sm ${subtext} mt-1`}>Less than a coffee a month</p>
        </div>
        <div className="space-y-3 mb-6">
          {plans.map(({ id, price, per, saving }) => (
            <div key={id} onClick={() => setSelectedPlan(id)} className={`flex items-center justify-between rounded-xl px-4 py-3 border cursor-pointer transition-all ${selectedPlan === id ? 'border-[#2D5A27] border-2 bg-green-50' : darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div>
                <p className={`font-bold text-sm ${text}`}>{price} <span className={`font-normal text-xs ${subtext}`}>{per}</span></p>
                {saving && <p className="text-xs text-green-600 mt-0.5">{saving}</p>}
              </div>
              {selectedPlan === id && <span className="text-xs bg-[#2D5A27] text-white px-2 py-0.5 rounded-full">Selected</span>}
            </div>
          ))}
        </div>
        <ul className="space-y-3 mb-6">
          {['📷 Snap your fridge — AI finds recipes','🌍 Choose any world cuisine','👥 Adjust servings & scale ingredients','🔥 Calories update automatically','📅 Meal planner & diet calendar','❤️ Save unlimited favourite recipes','✨ Daily recipe recommendations','🚫 Completely ad-free'].map(f => (
            <li key={f} className={`flex items-center gap-2 text-sm ${text}`}><span className="text-green-500">✓</span>{f}</li>
          ))}
        </ul>
        <button onClick={handleUnlock} className="w-full py-4 bg-[#1A2B1A] text-[#A8D5A2] rounded-xl font-bold mb-2">
          Start Premium — {plans.find(p => p.id === selectedPlan)?.price}{plans.find(p => p.id === selectedPlan)?.per}
        </button>
        <p className={`text-xs ${subtext} text-center`}>Cancel anytime from Settings. No hidden fees.</p>
      </div>
    </div>
  )
}

function SnapScreen({ onBack, isPremium, onUpgrade, setAiRecipes, aiRecipes, goToRecipe, darkMode }: any) {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [people, setPeople] = useState(2)
  const [cuisine, setCuisine] = useState('Any')
  const cuisineOptions = ['Any','Italian','Indian','Mexican','Japanese','Chinese','Arab','Mediterranean']
  const text = darkMode ? 'text-white' : 'text-gray-800'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'
  const bg = darkMode ? 'bg-gray-900' : 'bg-white'

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
        setAiRecipes(data.recipes.map((r: any, i: number) => ({ ...r, id: 1000 + i, emoji: '🍽️', servings: people, calories: r.calories || 500, ingredients: r.ingredients ? [[r.ingredients, '']] : [], steps: r.instructions || [] })))
        onBack()
      } else {
        alert(data.error || 'Something went wrong')
      }
    } catch {
      alert('Failed to contact the AI server.')
    } finally {
      setLoading(false)
    }
  }

  if (!isPremium) return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col items-center`}>
      <div className={`w-full max-w-sm ${bg} min-h-screen shadow-lg flex flex-col`}>
        <div className="bg-[#1A2B1A] px-5 pt-10 pb-5">
          <button onClick={onBack} className="text-white/60 text-sm mb-3 block">← Back</button>
          <h1 className="text-[#A8D5A2] text-xl font-semibold">📷 Fridge Snap</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-4">📷</div>
          <h2 className={`text-lg font-bold ${text} mb-2`}>Premium Feature</h2>
          <p className={`text-sm ${subtext} mb-6 leading-relaxed`}>Photo your fridge, pick your cuisine and how many people — AI does the rest.</p>
          <button onClick={onUpgrade} className="w-full py-3 bg-[#1A2B1A] text-[#A8D5A2] rounded-xl font-medium">Unlock with Premium</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col items-center`}>
      <div className={`w-full max-w-sm ${bg} min-h-screen shadow-lg pb-10`}>
        <div className="bg-[#1A2B1A] px-5 pt-10 pb-5">
          <button onClick={onBack} className="text-white/60 text-sm mb-3 block">← Back</button>
          <h1 className="text-[#A8D5A2] text-xl font-semibold">📷 Fridge Snap</h1>
          <p className="text-white/50 text-xs mt-1">Photo your fridge — AI finds recipes</p>
        </div>
        <div className="px-5 py-5 space-y-5">
          <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-gray-300">
            {image ? <img src={image} className="w-full rounded-xl max-h-48 object-cover" alt="fridge" /> : (
              <><div className="text-4xl mb-2">📸</div><p className={`text-sm font-medium ${text}`}>Tap to take a photo or upload</p><p className={`text-xs ${subtext} mt-1`}>Your fridge, pantry, or ingredients</p></>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
          <div>
            <p className={`text-sm font-medium ${text} mb-2`}>How many people eating?</p>
            <div className="flex gap-2">
              {[1,2,3,4,6,8].map(n => (
                <button key={n} onClick={() => setPeople(n)} className={`flex-1 py-2 rounded-lg text-sm border ${people === n ? 'bg-[#1A2B1A] text-[#A8D5A2] border-[#1A2B1A]' : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500'}`}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <p className={`text-sm font-medium ${text} mb-2`}>What cuisine do you feel like?</p>
            <div className="grid grid-cols-4 gap-2">
              {cuisineOptions.map(c => (
                <button key={c} onClick={() => setCuisine(c)} className={`py-2 rounded-lg text-xs border ${cuisine === c ? 'bg-[#1A2B1A] text-[#A8D5A2] border-[#1A2B1A]' : darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500'}`}>{c}</button>
              ))}
            </div>
          </div>
          <button onClick={analyse} disabled={!image || loading} className="w-full py-4 bg-[#1A2B1A] text-[#A8D5A2] rounded-xl font-bold disabled:opacity-40">
            {loading ? '🔍 Analysing your fridge…' : 'Find recipes from my fridge'}
          </button>
          {aiRecipes.length > 0 && (
            <div className="space-y-3">
              <p className={`text-xs font-bold ${subtext} uppercase`}>Last scan — {aiRecipes.length} recipes</p>
              {aiRecipes.map((r: any, i: number) => (
                <div key={i} onClick={() => goToRecipe(r)} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-xl p-4 cursor-pointer hover:shadow-md`}>
                  <p className={`text-sm font-bold ${text}`}>🍽️ {r.name}</p>
                  <p className={`text-xs ${subtext} mt-1`}>{r.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
