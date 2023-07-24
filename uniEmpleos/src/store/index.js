import { createStoreon } from "storeon"
import { storeonDevtools } from "storeon/devtools"
import { routerNavigate } from "@storeon/router"
import router from "./router"
import user from "./user"

const store = createStoreon([router, storeonDevtools, user])

const navigate = (target) => {
  store.dispatch(routerNavigate, target)
}

export { navigate }
export default store
