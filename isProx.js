var {
  ProxySecurity,
  secureGet,
  secureSet,
  secureLooseDelete,
  secureHas,
  toPrimitive,
  clense,
  ShieldedProxyEnv,
  preventInject,
} = class ProxySecurity {
  /**
   * The ProxySecurity class is designed to enhance object security by providing
   * methods that allow safe interaction with object properties. It includes
   * static methods such as secureGet, secureSet, secureLooseDelete, and secureHas,
   * which perform operations on object properties without invoking corresponding
   * JavaScript events or handlers. In addition, this class provides methods to
   * convert objects to their primitive forms, cleanse objects by integrating
   * them with their primitive equivalents, and create secure proxy environments
   * to prevent unwanted code injection. It offers a ShieldedProxyEnv for creating
   * secure handler objects and preventInject for deploying secure proxies.
   */
  static ProxySecurity = ProxySecurity;

  /**
   * Retrieves the value of a property without triggering any getter.
   *
   * @param {Object} obj - The object from which to get the property value.
   * @param {string|symbol} prop - The property whose value to retrieve.
   * @returns {*} The value of the specified property.
   */
  static secureGet(obj, prop) {
    return Reflect.getOwnPropertyDescriptor(obj, prop).value;
  }

  /**
   * Sets the value of a property without triggering any setter.
   *
   * @param {Object} obj - The object on which to set the property.
   * @param {string|symbol} prop - The property whose value is to be set.
   * @param {*} value - The value to set on the property.
   * @returns {boolean} Indicates whether the property was successfully set.
   */
  static secureSet(obj, prop, value) {
    return Reflect.defineProperty(obj, prop, { value });
  }

  /**
   * Replaces the value of a property with `undefined` without triggering delete-event.
   *
   * @param {Object} obj - The object from which to remove the property.
   * @param {string|symbol} prop - The property to be replaced with undefined.
   * @returns {boolean} Indicates whether the property was successfully replaced.
   */
  static secureLooseDelete(obj, prop) {
    return Reflect.defineProperty(obj, prop, { value: undefined });
  }

  /**
   * Checks if a property exists without triggering a has-event.
   *
   * @param {Object} obj - The object in which to check for the property.
   * @param {string|symbol} prop - The property to check existence for.
   * @returns {boolean} True if the property exists, otherwise false.
   */
  static secureHas(obj, prop) {
    return Reflect.ownKeys(obj).includes(prop);
  }

  /**
   * Converts a given object to its primitive equivalent.
   * If the object is null or undefined, it returns the object as-is.
   *
   * @param {*} obj - The object to convert to a primitive.
   * @returns {*} - The primitive equivalent of the object, or undefined if nothing matches.
   */
  static toPrimitive(obj) {
    switch (obj) {
      case null:
      case undefined:
        return obj;
    }

    let type = typeof obj;
    switch (type) {
      case "string":
      case "number":
      case "boolean":
      case "symbol":
      case "function":
      case "object":
        return globalThis[type[0].toUpperCase() + type.slice(1)]();
      case "bigint":
        return new globalThis.BigInt();
      case "undefined":
        return undefined;
    }
  }

  /**
   * Integrates the properties of an object into its primitive equivalent.
   * Uses toPrimitive to determine the base primitive of the object.
   *
   * @param {Object} obj - The object to cleanse by assigning primitive values.
   * @returns {Object} - A new object based on the object's primitive form.
   */
  static clense(obj) {
    return Object.assign(this.toPrimitive(obj), obj);
  }

  // ---

  /**
   * Provides a secure environment for interacting with objects via proxy.
   *
   * @returns {Object} The handler object with get, set, deleteProperty
   *   and has traps using secure methods.
   */
  static ShieldedProxyEnv = () => ({
    get(target, prop) {
      return ProxySecurity.secureGet(target, prop);
    },
    set(target, prop, value) {
      return ProxySecurity.secureSet(target, prop, value);
    },
    deleteProperty(target, prop) {
      return ProxySecurity.secureLooseDelete(target, prop);
    },
    has(target, prop) {
      return ProxySecurity.secureHas(target, prop);
    },
  });

  /**
   * Creates a Proxy to wrap a foreign value, providing a secure bridge.
   *
   * @param {Object} object - The object to be wrapped by the proxy.
   * @returns {Proxy} A new proxy object secured by the shieldedEnv.
   */
  static preventInject(object) {
    return new Proxy(object, ProxySecurity.ShieldedProxyEnv());
  }
};

if (typeof module !== "undefined") module.exports = ProxySecurity;
if (typeof window !== "undefined") window.ProxySecurity = ProxySecurity;
