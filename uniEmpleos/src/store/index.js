import { createStoreon } from "storeon"
import { storeonDevtools } from "storeon/devtools"
import { persistState } from "@storeon/localstorage"
import user from "./user"

const store = createStoreon([
  user,
  storeonDevtools,
  persistState(["user"]), //
])

export default store
