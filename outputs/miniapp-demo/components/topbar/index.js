Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    // 顶部标题文字
    title: {
      type: String,
      value: ""
    },
    // 是否显示返回按钮，默认显示
    showBack: {
      type: Boolean,
      value: true
    },
    // 右侧按钮图标/文字，为空时显示占位透明按钮保持布局
    rightIcon: {
      type: String,
      value: ""
    }
  },
  methods: {
    onBack() {
      this.triggerEvent("back")
    },
    onRightTap() {
      this.triggerEvent("righttap")
    }
  }
})
