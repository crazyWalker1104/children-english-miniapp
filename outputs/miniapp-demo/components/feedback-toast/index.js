Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    // 反馈文字，为空时不显示
    text: {
      type: String,
      value: ""
    },
    // 反馈类型：default / success / error
    type: {
      type: String,
      value: "default"
    }
  }
})
