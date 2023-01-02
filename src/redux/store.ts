import { configureStore } from '@reduxjs/toolkit'
import clockReducer from './theme/clockSlice'
import themeReducer from './theme/themeSlice'
import settingReducer from './theme/settingSlice'
// ...

export const store = configureStore({
  reducer: {
    clock: clockReducer,
    theme: themeReducer,
    setting: settingReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch