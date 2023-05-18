const user = (store) => {
  store.on("@init", () => ({
    user: {
      token: " ",
    },
  }))
  store.on("user/config", (_, newConfigs) => ({ user: newConfigs }))
}

export default user
