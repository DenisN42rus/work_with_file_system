class Watcher {
  constructor(completeCb) {
    this.onComplete = completeCb
    this.proccess = []
    this.isStarted = false
  }

  started() {
    this.isStarted = true
  }

  startProccess(el) {
    this.proccess.push(el)
  }

  endProccess(el) {
    const index = this.proccess.findIndex((item) => item === el)
    this.proccess.splice(index, 1)
    this.checkOnComplete()
  }

  checkOnComplete() {
    if (this.isStarted && this.proccess.length === 0) {
      this.isStarted = false
      this.onComplete()
    }
  }
}

module.exports = Watcher;
