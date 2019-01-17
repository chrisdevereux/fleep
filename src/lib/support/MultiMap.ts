export class MultiMap<Key, Value> {
  private state = new Map<Key, Set<Value>>()

  add(key: Key, value: Value) {
    let valueSet = this.state.get(key)
    if (!valueSet) {
      valueSet = new Set()
      this.state.set(key, valueSet)
    }

    valueSet.add(value)
  }

  get(key: Key) {
    const valueSet = this.state.get(key)
    return valueSet && Array.from(valueSet.values()) || []
  }

  delete(key: Key, value: Value) {
    const valueSet = this.state.get(key)
    if (valueSet) {
      valueSet.delete(value)
    }
  }
}