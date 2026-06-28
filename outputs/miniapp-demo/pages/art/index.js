const { completeTask, hearWord, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
const { getAgeLevel } = require("../../utils/age")
const { feedbackSuccess, feedbackComplete, feedbackError } = require("../../utils/interaction")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")
const { shuffle } = require("../../utils/shuffle")
const { encourage, encourageComplete } = require("../../utils/encouragement")

const ART_IMAGE = "/assets/images/art/starry-night-child-safe.png"

function getGridMeta(count) {
  if (count <= 4) {
    return {
      columns: 2,
      rows: 2,
      className: "cols-2"
    }
  }

  return {
    columns: 3,
    rows: count <= 6 ? 2 : 3,
    className: "cols-3"
  }
}

function getPieceStyle(index, meta) {
  const column = index % meta.columns
  const row = Math.floor(index / meta.columns)
  const x = meta.columns === 1 ? 0 : Math.round((column / (meta.columns - 1)) * 100)
  const y = meta.rows === 1 ? 0 : Math.round((row / (meta.rows - 1)) * 100)

  return [
    `background-image: url(${ART_IMAGE});`,
    `background-size: ${meta.columns * 100}% ${meta.rows * 100}%;`,
    `background-position: ${x}% ${y}%;`
  ].join(" ")
}

function createPieces(count, meta) {
  return shuffle(Array.from({ length: count }).map(function (_, index) {
    const id = index + 1
    return {
      id,
      label: String(id),
      style: getPieceStyle(index, meta),
      placed: false,
      selected: false
    }
  }))
}

function createBoard(count, meta) {
  return Array.from({ length: count }).map(function (_, index) {
    const id = index + 1
    return {
      id,
      pieceId: 0,
      label: "",
      style: getPieceStyle(index, meta)
    }
  })
}

Page({
  data: {
    pieces: [],
    board: [],
    selectedPieceId: 0,
    artImage: ART_IMAGE,
    pieceCount: 4,
    gridClass: "cols-2",
    placedCount: 0,
    feedback: "",
    completed: false,
    layoutMode: "mobile"
  },

  onLoad() {
    this.setData({
      layoutMode: getCurrentLayoutMode()
    })
    this.startPuzzle()
    hearWord("yellow")
  },

  onResize(resizeInfo) {
    this.setData({
      layoutMode: getResizeLayoutMode(resizeInfo)
    })
  },

  startPuzzle() {
    const app = getApp()
    const level = getAgeLevel(app.globalData.childProfile.age)
    const pieceCount = level.puzzlePieces
    const gridMeta = getGridMeta(pieceCount)

    this.setData({
      pieces: createPieces(pieceCount, gridMeta),
      board: createBoard(pieceCount, gridMeta),
      selectedPieceId: 0,
      pieceCount,
      gridClass: gridMeta.className,
      placedCount: 0,
      feedback: "",
      completed: false
    })
  },

  selectPiece(event) {
    const id = Number(event.currentTarget.dataset.id)
    const selected = this.data.pieces.find(function (piece) {
      return piece.id === id
    })

    if (!selected || selected.placed || this.data.completed) {
      return
    }

    const pieces = this.data.pieces.map(function (piece) {
      return {
        ...piece,
        selected: piece.id === id
      }
    })
    this.setData({
      pieces,
      selectedPieceId: id,
      feedback: "Tap the matching picture spot!"
    })
    playText(`Number ${id}`)
  },

  placePiece(event) {
    const slotId = Number(event.currentTarget.dataset.id)
    const selectedPieceId = this.data.selectedPieceId

    if (!selectedPieceId || this.data.completed) {
      this.setData({ feedback: "Pick a piece first!" })
      feedbackError()
      playText("Pick a piece first!")
      return
    }

    if (this.data.board[slotId - 1] && this.data.board[slotId - 1].pieceId) {
      this.setData({ feedback: "This spot is done!" })
      feedbackError()
      playText("This spot is done!")
      return
    }

    if (slotId !== selectedPieceId) {
      this.setData({ feedback: "Try another spot!" })
      feedbackError()
      playText("Try another spot!")
      return
    }

    const board = this.data.board.map(function (slot) {
      if (slot.id !== slotId) {
        return slot
      }

      return {
        ...slot,
        pieceId: selectedPieceId,
        label: String(selectedPieceId)
      }
    })
    const pieces = this.data.pieces.map(function (piece) {
      if (piece.id !== selectedPieceId) {
        return piece
      }

      return {
        ...piece,
        placed: true,
        selected: false
      }
    })
    const placedCount = pieces.filter(function (piece) {
      return piece.placed
    }).length
    const completed = placedCount === this.data.pieceCount

    this.setData({
      board,
      pieces,
      selectedPieceId: 0,
      placedCount,
      feedback: completed ? encourageComplete() : encourage(),
      completed
    })

    if (completed) {
      completeTask("art-starry-night", "art-star")
      addStudySeconds(30)
      feedbackComplete()
      playText(encourageComplete())
      return
    }

    feedbackSuccess()
    playText(encourage())
  },

  reset() {
    this.startPuzzle()
  },

  back() {
    wx.navigateBack()
  }
})
