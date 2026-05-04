import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import swimReducer from '@/redux/features/swimSlices'
import locationReducer from '@/redux/features/locationSlice'
import type { RootState } from '@/redux/store'

type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }

interface RenderWithStoreOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: DeepPartial<RootState>
}

export function renderWithStore(
  ui: React.ReactElement,
  { preloadedState, ...opts }: RenderWithStoreOptions = {}
) {
  const store = configureStore({
    reducer: { swimReducer, locationReducer },
    preloadedState: preloadedState as any,
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...opts }) }
}
