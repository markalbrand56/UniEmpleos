const language = (store) => {
  store.on("@init", () => ({
    language: {
      currentLanguage: "es",
    },
  }))
  store.on("language/config", (_, newConfigs) => ({ language: newConfigs }))
}

export default language
