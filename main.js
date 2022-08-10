const app = new Vue({
	el: '#app',
	data: {
		jewelTop: 50,
		jewelLeft: 50,
		jewelSize: 100,
		jewelMax: 3,
		jewelTypes: [
			{name: 'red', color: 0xff0000},
			{name: 'green', color: 0x00ff00},
			{name: 'blue', color: 0x0000ff},
			{name: 'yellow', color: 0xffff00},
			{name: 'orange', color: 0xffa500},
			{name: 'purple', color: 0x800080}
		],
		block: [[]]
	},
	mounted: function() {
		//this.app = new PIXI.Application({
		//	antialias: true,
		//	resolution: window.devicePixelRatio || 1,
		//	autoDensity: true,
		//	resizeTo: window
		//})
		this.app = new PIXI.Application({})
		this.$el.appendChild(this.app.view)
		this.interactive = true
		this.getBlockTypes()
		this.drawBlock(this.jewelLeft, this.jewelTop)
		this.addClickEvent(() => this.rotate())
	},
	methods: {
		createGraphics() {
			return new PIXI.Graphics()
		},
		addGraphicChild(graphics) {
			this.app.stage.addChild(graphics);
		},
		getRandomJewelType() {
			return this.jewelTypes[Math.floor(Math.random()*this.jewelTypes.length)];
		},
		draw(left, top, color) {
			this.jewel = this.createGraphics()
			this.jewel.beginFill(color)
			this.jewel.drawRect(left, top, this.jewelSize, this.jewelSize)
			this.jewel.endFill()
			this.addGraphicChild(this.jewel)
		},
		getBlockTypes() {
			for (let i = 0; i < this.jewelMax; i++) {
				this.block[0][i] = this.getRandomJewelType()
			}
		},
		drawBlock(blockLeft, blockTop) {
			for (let i = 0; i < this.jewelMax; i++) {
				this.draw(blockLeft, blockTop + i*this.jewelSize, this.block[0][i].color)
			}
		},
		rotate() {
			let j = this.block[0][this.jewelMax - 1];
			for (let i = this.jewelMax - 1; i > 0; i--) {
				this.block[0][i] = this.block[0][i - 1];
			}
			this.block[0][0] = j;
			this.drawBlock(this.jewelLeft, this.jewelTop)
		},
		addClickEvent(callback) {
			this.app.renderer.plugins.interaction.on('pointerdown', callback)
		}
	},
})