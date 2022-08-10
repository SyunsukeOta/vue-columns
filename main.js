const app = new Vue({
	el: '#app',
	data: {
		boardTop: 50,
		boardLeft: 50,
		boardCellWidth: 6,
		boardCellHeight: 13,
		boardType: 0x999999,
		jewelTop: 50,
		jewelLeft: 50,
		jewelSize: 20,
		jewelMax: 3,
		jewelTypes: [
			{name: 'red', color: 0xff0000},
			{name: 'green', color: 0x00ff00},
			{name: 'blue', color: 0x0000ff},
			{name: 'yellow', color: 0xffff00},
			{name: 'orange', color: 0xffa500},
			{name: 'purple', color: 0x800080}
		],
		startCellLeft: 2,
		startCellTop: 0,
		cellLeft: 2,
		cellTop: 0,
		block: [[]],
		jewel: [{}],
		board: {},
	},
	mounted: function() {
		this.app = new PIXI.Application({})
		this.$el.appendChild(this.app.view)
		this.interactive = true
		this.drawBackground()
		this.getBlockTypes()
		this.drawBlock()
		this.addClickEvent()
	},
	methods: {
		createGraphics() {
			return new PIXI.Graphics()
		},
		addGraphicChild(graphics) {
			this.app.stage.addChild(graphics)
		},
		getRandomJewelType() {
			return this.jewelTypes[Math.floor(Math.random()*this.jewelTypes.length)]
		},
		draw(object, left, top, color, width, height) {
			object.beginFill(color)
			object.drawRect(left, top, width, height)
			object.endFill()
			this.addGraphicChild(object)
		},
		getBlockTypes() {
			for (let i = 0; i < this.jewelMax; i++) {
				this.block[0][i] = this.getRandomJewelType()
			}
		},
		drawBlock() {
			for (let i = 0; i < this.jewelMax; i++) {
				this.jewel[i] = this.createGraphics()
				this.draw(this.jewel[i], this.startCellLeft*this.jewelSize + this.jewelLeft, this.startCellTop*this.jewelSize + this.jewelTop + i*this.jewelSize, this.block[0][i].color, this.jewelSize, this.jewelSize)
			}
		},
		move(object, left, top) {
			object.x += left*this.jewelSize
			object.y += top*this.jewelSize
		},
		rotate() {
			let j = this.block[0][this.jewelMax - 1]
			for (let i = this.jewelMax - 1; i > 0; i--) {
				this.block[0][i] = this.block[0][i - 1]
			}
			this.block[0][0] = j
			this.drawBlock()
		},
		moveRight() {
			if (this.cellLeft < this.boardCellWidth - 1) {
				console.log('moveRight!!')
				this.cellLeft++
				for (let i = 0; i < this.jewelMax; i++) {
					this.move(this.jewel[i], 1, 0)
				}
			}
		},
		moveLeft() {
			if (this.cellLeft > 0) {
				console.log('moveLeft!!')
				this.cellLeft--
				for (let i = 0; i < this.jewelMax; i++) {
					this.move(this.jewel[i], -1, 0)
				}
			}
		},
		moveDown() {
			if (this.cellTop < this.boardCellHeight - this.jewelMax) {
				console.log(('moveDown!!'))
				this.cellTop++
				for (let i = 0; i < this.jewelMax; i++) {
					this.move(this.jewel[i], 0, 1)
				}
			}
		},
		addClickEvent() {
			document.addEventListener("keydown", event => {
				switch (event.code) {
					case 'Space':
						console.log('OK')
						this.rotate()
						break
					case 'ArrowDown':
						console.log('↓')
						this.moveDown()
						break
					case 'ArrowRight':
						console.log('→')
						this.moveRight()
						break
					case 'ArrowLeft':
						console.log('←')
						this.moveLeft()
						break
					default:
						console.log(event.code)
						break
				}
				event.preventDefault()
				return
			}, false)
		},
		drawBackground() {
			this.board = this.createGraphics()
			this.draw(this.board, this.boardLeft, this.boardTop, this.boardType, this.boardCellWidth*this.jewelSize, this.boardCellHeight*this.jewelSize)
		}
	},
})