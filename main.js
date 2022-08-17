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
		block: [{}],
		jewels: [],
		board: {},
	},
	mounted: function() {
		this.app = new PIXI.Application({})
		this.$el.appendChild(this.app.view)
		this.interactive = true
		this.drawBackground()
		this.getBlockTypes()
		this.drawBlock()
		this.setJewelsZeros()
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
				this.block[i] = this.createGraphics()
				this.block[i].type = this.getRandomJewelType()
			}
		},
		move(object, left, top) {
			object.x += left*this.jewelSize
			object.y += top*this.jewelSize
		},
		setJewelsZeros() {
			for (let i = 0; i < this.boardCellHeight; i++) {
				this.jewels[i] = []
				for (let j = 0; j < this.boardCellWidth; j++) {
					this.jewels[i][j] = null
				}
			}
		},
		drawBlock() {
			for (let i = 0; i < this.jewelMax; i++) {
				this.draw(this.block[i], this.jewelLeft, this.jewelTop, this.block[i].type.color, this.jewelSize, this.jewelSize)
				this.block[i].x = this.startCellLeft*this.jewelSize
				this.block[i].y = this.startCellTop*this.jewelSize
				this.move(this.block[i], 0, i)
			}
			console.log(this.block[0].y, this.block[1].y, this.block[2].y);
		},
		drawAllJewels() {
			for (let i = 0; i < this.boardCellHeight; i++) {
				for (let j = 0; j < this.boardCellWidth; j++) {
					if (this.jewels[i][j] != null) {
						this.draw(this.jewels[i][j], this.jewelLeft, this.jewelTop, this.jewels[i][j].type.color, this.jewelSize, this.jewelSize)
						this.jewels[i][j].y = i*this.jewelSize
						this.jewels[i][j].x = j*this.jewelSize
					}
				}
			}
		},
		rotate() {
			let j = this.block[this.jewelMax - 1].type
			let Min = this.block[0].y
			for (let i = this.jewelMax - 1; i > 0; i--) {
				this.block[i].type = this.block[i - 1].type
				Min = Math.min(Min, this.block[i].y)
			}
			this.block[0].type = j
			for (let i = 0; i < this.jewelMax; i++) {
				this.move(this.block[i], 0, 1)
				if ((this.block[i].y - Min) == this.jewelSize*this.jewelMax) {
					this.move(this.block[i], 0, -1*this.jewelMax)
				}
			}
			//this.block[0] = k
			console.log(this.block[0].y, this.block[1].y, this.block[2].y);
			console.log(Min);
		},
		moveRight() {
			if (this.cellLeft < this.boardCellWidth - 1) {
				console.log('moveRight!!')
				this.cellLeft++
				for (let i = 0; i < this.jewelMax; i++) {
					this.move(this.block[i], 1, 0)
				}
			}
		},
		moveLeft() {
			if (this.cellLeft > 0) {
				console.log('moveLeft!!')
				this.cellLeft--
				for (let i = 0; i < this.jewelMax; i++) {
					this.move(this.block[i], -1, 0)
				}
			}
		},
		moveDown() {
			//220->ok,240->ng
			//240=20*12=this.jewelSize*(this.boardCellHeight-1)
			let Max = this.block[0].y
			for (let i = this.jewelMax - 1; i > 0; i--) {
				Max = Math.max(Max, this.block[i].y)
			}
			if (Max >= 240 || this.jewels[this.cellTop + this.jewelMax][this.cellLeft] != null) {
				this.remake()
			} else {
				console.log(('moveDown!!'))
				console.log(this.block[this.jewelMax - 1].y);
				this.cellTop++
				for (let i = 0; i < this.jewelMax; i++) {
					this.move(this.block[i], 0, 1)
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
					case'KeyA':
						console.log('toTop')
						this.showBlockXY()
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
		},
		destory() {
			for (let i = 0; i < this.jewelMax; i++) {
				this.app.stage.removeChild(this.block[i]);
			}
		},
		remake() {
			this.destory()
			for (let i = 0; i < this.jewelMax; i++) {
				this.jewels[this.cellTop + i][this.cellLeft] = this.createGraphics()
				this.jewels[this.cellTop + i][this.cellLeft].type = this.block[i].type
			}
			this.cellLeft = this.startCellLeft
			this.cellTop = this.startCellTop
			this.getBlockTypes()
			this.drawBlock()
			this.drawAllJewels()
		},
		showBlockXY(index) {
			console.log(this.block[index].x, this.block[index].y);
		},
		showJewels() {
			console.log(this.jewels);
		},
	},
})