/**
 * Validation error converter
 * @param err object
 * @returns object
 */
export const convertValidationError = (err) => {
  let errMsg = {}
  if (err.response.status === 422) {
    for (let key of Object.keys(err.response.data.errors)) {
      const splited = key.split('.')
      const reduced = splited.reduceRight((pre, cur) => {
        let obj = {}
        obj[cur] = pre
        return obj
      }, err.response.data.errors[key])
      mergeDeep(errMsg, reduced)
    }
  }
  return errMsg
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject (item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep (target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}