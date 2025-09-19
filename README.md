# JavaScript ES6 Quick Notes

## 1) var vs let vs const
- **var** → function scope, redeclare possible.  
- **let** → block scope, redeclare na but reassign possible.  
- **const** → block scope, redeclare & reassign 2tai possible na.  

## 2) map() vs forEach() vs filter()
- **map()** → new array return kore.  
- **forEach()** → loop kore but kichu return kore na.  
- **filter()** → condition true hole new array return kore.  

## 3) Arrow Functions
- Short syntax function likhar style (`()=>`).  
- Own `this` nai, parent theke `this` ney.  

## 4) Destructuring Assignment
- Object/array theke value easily variable e assign kora.  
```js
const {name} = obj; 
const [a,b] = arr;
```

## 5) Template Literals
- Use backtick (`` ` ``) instead of quotes.  
- `${}` diye variable/expr insert kora jai.  
- Multi-line support kore.  
- Old string concatenation (`+`) er cheye easy & clean.  

```js
const name = "Injam";
const age = 22;
console.log(`Hello ${name}, your age is ${age}`);


