const a = {
  toString() { return '' }
}

const b = new Proxy(a, {
  get: (target, prop) => {
    console.log(`get ${prop}`)
    return target[prop]
  },
  set: (target, prop, value) => {
    console.log(`set ${prop} = ${value}`)
    target[prop] = value
    return true
  },
  deleteProperty: (target, prop) => {
    console.log(`delete ${prop}`)
    return true
  },
  has: (target, prop) => {
    console.log(`has ${prop}`)
    return true
  },
})

b.a = 1
b.a = 2
b.a = 3

console.log(b)
ProxySecurity.secureSet(b, 'asd', 4)
console.log(b)