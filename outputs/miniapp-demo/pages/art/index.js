const { completeTask, hearWord, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
const { getAgeLevel } = require("../../utils/age")
const { feedbackSuccess, feedbackComplete, feedbackError } = require("../../utils/interaction")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")
const { shuffle } = require("../../utils/shuffle")
const { encourage, encourageComplete } = require("../../utils/encouragement")

function createPieces(count) {
  return shuffle(Array.from({ length: count }).map(function (_, index) {
    const id = index + 1
    return {
      id,
      label: String(id),
      placed: false,
      selected: false
    }
  }))
}

function createBoard(count) {
  return Array.from({ length: count }).map(function (_, index) {
    const id = index + 1
    return {
      id,
      pieceId: 0,
      label: ""
    }
  })
}

function getGridClass(count) {
  if (count >= 9) {
    return "grid-3"
  }

  return "grid-2"
}

Page({
  data: {
    pieces: [],
    board: [],
    selectedPieceId: 0,
    artImage: "/assets/images/art/starry-night-child-safe.png",
    pieceCount: 4,
    gridClass: "grid-2",
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

    this.setData({
      pieces: createPieces(pieceCount),
      board: createBoard(pieceCount),
      selectedPieceId: 0,
      pieceCount,
      gridClass: getGridClass(pieceCount),
      placedCount: 0,
      feedback: "",
      completed: false
    })
  },

  selectPiece(event) {
    const id = Number(event.currentTarget.dataset.id)
    const selected = this.data.pieces.find((piece) => piece.id === id)

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
      feedback: "Now tap its spot!"
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
