function invariant(cond: boolean, msg: string) {
    if (!cond) {
        throw Error(msg)
    }
}

export default invariant; 