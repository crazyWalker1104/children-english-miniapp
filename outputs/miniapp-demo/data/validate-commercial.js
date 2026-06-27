const { commercialReadinessItems } = require("./commercial-readiness")

const strict = process.argv.indexOf("--strict") >= 0

function validateCommercialReadiness() {
  const pendingItems = commercialReadinessItems.filter(function (item) {
    return item.status !== "approved"
  })

  if (!pendingItems.length) {
    console.log("Commercial readiness passed")
    return
  }

  console.log(`Commercial readiness: ${pendingItems.length} pending items`)
  pendingItems.forEach(function (item) {
    console.log(`- [${item.type}] ${item.title}: ${item.note}`)
  })

  if (strict) {
    throw new Error("Commercial readiness has pending items")
  }
}

if (typeof module !== "undefined" && require.main === module) {
  validateCommercialReadiness()
}

module.exports = {
  validateCommercialReadiness
}
