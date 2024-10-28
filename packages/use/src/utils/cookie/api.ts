/* eslint-disable ts/ban-ts-comment */
import assign from './assign'
import defaultConverter from './converter'
import type { CookiesStatic } from './types'

function init(converter, defaultAttributes): CookiesStatic {
  function set(name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes)

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString()
    }

    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape)

    let stringifiedAttributes = ''
    for (const attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += `; ${attributeName}`

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += `=${attributes[attributeName].split(';')[0]}`
    }

    return (document.cookie
      = `${name}=${converter.write(value, name)}${stringifiedAttributes}`)
  }

  function get(name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    const cookies = document.cookie ? document.cookie.split('; ') : []
    const jar = {}
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split('=')
      const value = parts.slice(1).join('=')

      try {
        const found = decodeURIComponent(parts[0])
        if (!(found in jar))
          jar[found] = converter.read(value, found)
        if (name === found) {
          break
        }
      }
      catch {
        // Do nothing...
      }
    }

    return name ? jar[name] : jar
  }
  return Object.create(
    {
      set,
      get,
      remove(name, attributes) {
        set(
          name,
          '',
          assign({}, attributes, {
            expires: -1
          })
        )
      },
      withAttributes: (attributes: any) => {
        // @ts-ignore
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: (converter: any) => {
        // @ts-ignore
        return init(assign({}, converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

export default init(defaultConverter, { path: '/' })
