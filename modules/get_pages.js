const lastpage = (msgsCount) => {
    const getPageNo = Math.trunc(msgsCount / 10)
    const checkRemainder = () => {
      return msgsCount % 10 !== 0 ? 1 : 0
    }
    return getPageNo + checkRemainder()
  }

module.exports = { lastpage }