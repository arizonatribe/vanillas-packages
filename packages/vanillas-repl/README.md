# Vanillas (REPL)

<img
  src="https://raw.githubusercontent.com/arizonatribe/vanillas/master/media/logo_sunset_rounded.png"
  alt="Vanillas JS"
  align="right"
/>

Runs a NodeJs REPL with the [Vanillas](https://www.npmjs.com/package/vanillas) utils library loaded into the REPL context

# Installation

You don't need to install this globally, rather just use `npx` to launch the REPL with the latest version of Vanillas whenever you need it.

```
npx vanillas-repl

🍦> V.isPrime(16)
false
```

# Usage
Once you have a REPL opened, you can leverage the Vanillas utils available in the global scope under a variable named `V`.

```javascript
🍦> V.toHashCode("veggie burrito")
8

🍦> V.toHashCode("chicken burrito")
24

🍦> const food = {
  proteins: ["chicken", "fish", "pinto beans", "black beans", "refried beans"],
  vegetables: ["tomato", "cilantro", "onion", "jalapeno", "habanero", "serano"],
  grains: ["tortilla", "taco shell", "chips"],
  dairy: ["cheddar cheese", "sour cream"],
  seasoning: ["pepper", "salt"],
}

🍦> function noMeat(ingredients) {
  return ingredients.filter(item => !/(chicken|beef|steak|menudo|fish)/.test(item))
}

🍦> function noTurf(ingredients) {
  return ingredients.filter(item => !/(chicken|beef|steak|menudo)/.test(item))
}

🍦> function noDairy(ingredients) {
  return ingredients.filter(item => !/(milk|leche|sour\s+cream|cheese)/.test(item))
}

🍦> function noGluten(ingredients) {
  return ingredients.filter(item => !/(tortilla|chips|shell)/.test(item))
}

🍦> function noSpice(ingredients) {
  return ingredients.filter(item => !/(jalapeno|pepper|habanero|serano)/.test(item))
}

🍦> function noFat(ingredients) {
  return ingredients.filter(item => !/(refried|cream|cheese)/.test(item))
}

🍦> const noFun = V.compose(noSpice, noFat, noGluten, noMeat)

🍦> function makeNachos(ingredients, ingredientName) {
  return ingredientName === "grains"
    ? ingredients.filter(item => /chips/.test(item))
    : ingredients
}

🍦> function makeBurrito(ingredients, ingredientName) {
  return ingredientName === "grains"
    ? ingredients.filter(item => /tortilla/.test(item))
    : ingredients
}

🍦> function makeTaco(ingredients, ingredientName) {
  return ingredientName === "grains"
    ? ingredients.filter(item => /shell/.test(item))
    : ingredients
}

🍦> const veggieBurrito = V.mapObject(makeBurrito, V.mapObject(noMeat, food))

🍦> const fishTaco = V.mapObject(makeBurrito, V.mapObject(noTurf, food))

🍦> const mildNacos = V.mapObject(makeNacos, V.mapObject(noSpice, food))
```
