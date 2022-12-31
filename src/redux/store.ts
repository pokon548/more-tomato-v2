import { configureStore } from '@reduxjs/toolkit'
import clockReducer from './theme/clockSlice'
import themeReducer from './theme/themeSlice'
// ...

export const store = configureStore({
  reducer: {
    clock: clockReducer,
    theme: themeReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch