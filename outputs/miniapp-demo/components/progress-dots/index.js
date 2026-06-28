Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    // 进度点数组，每项格式 { id: String, active: Boolean }
    dots: {
      type: Array,
      value: []
    }
  }
})
