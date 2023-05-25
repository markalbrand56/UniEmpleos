const user = (store) => {
  store.on("@init", () => ({
    user: {
      token: " ",
      idoffert: " ",
    },
  }))
  store.on("user/config", (_, newConfigs) => ({ user: newConfigs }))
}

export default user
