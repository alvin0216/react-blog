import React from 'react'
import mitt from 'mitt'

export const BusContext = React.createContext(null)

export default function useBus() {
  return React.useContext(BusContext)
}

export function useListener(name, fn) {
  const bus = useBus()
  React.useEffect(() => {
    bus.on(name, fn)
    return () => {
      bus.off(name, fn)
    }
  }, [bus, name, fn])
}

export function Provider({ children }) {
  const [bus] = React.useState(() => mitt())
  return <BusContext.Provider value={bus}>{children}</BusContext.Provider>
}
