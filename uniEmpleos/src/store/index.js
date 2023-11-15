import { createStoreon } from "storeon"
import { storeonDevtools } from "storeon/devtools"
import { routerNavigate } from "@storeon/router"
import { persistState } from "@storeon/localstorage"
import router from "./router"
import user from "./user"
import language from "./language"

const store = createStoreon([
  router,
  storeonDevtools,
  user,
  language,
  persistState(["user", "language"])
])

const navigate = (target) => {
  store.dispatch(routerNavigate, target)
}

export { navigate }
export default store
