import { createStoreon } from "storeon"
import { storeonDevtools } from "storeon/devtools"
import { routerNavigate } from "@storeon/router"
import router from "./router"

const store = createStoreon([router, storeonDevtools])

const navigate = (target) => {
  store.dispatch(routerNavigate, target)
}

export { navigate }
export default store
