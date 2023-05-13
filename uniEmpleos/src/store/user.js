const user = store => {
    store.on('@init', () => ({ token: " " }))
    store.on('user/login', (_, { tokennew }) => ({ token: tokennew }))

}

export default user