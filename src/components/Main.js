require('normalize.css/normalize.css')
require('styles/App.scss')

import React from 'react'
import ReactDOM from 'react-dom'

//get images data
var imageDatas = require('../data/imageDatas.json')
// let yeomanImage = require('../images/yeoman.png')

// transform image file name into image dir(url)
function getImageUrl(imageDataArr) {
	for (var i=0 i<imageDataArr.lengthi++){
		var singeImageData = imageDataArr[i]
		singeImageData.imageUrl = require('../images/' + singeImageData.fileName)
		imageDataArr[i] = singeImageData
	}
	return imageDataArr
}

imageDatas = getImageUrl(imageDatas)

/*
 * ger a random value
 */
function getRangeRandom(low, high) {
	return Math.floor(Math.random() * (high - low) + low)
}

/*
 * get a ramdon angle
 */
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30))
}

var ImgFigure = React.createClass({

	handleClick : function (e) {
		if (this.props.arrange.isCenter) 
			this.props.inverse()
		else 
			this.props.center()
		
		e.stopPropagation()
		e.preventDefault()
	},

	render: function () {

		var styleObj = {}

		// apply imaeg.porp if it has its postion
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos
		}

		// check if the image has been rotated, if not -> rotate
		if (this.props.arrange.rotate){
			(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)'
			}.bind(this))
		}

		// check if selected image is center image，if so, set z-index = 11
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11
		}

		var imgFigureClassName = 'img-figure'

		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : ''

		return(
			<figure className={imgFigureClassName} 
					style={styleObj} 
					onClick={this.handleClick}> 
				<img src={this.props.data.imageUrl} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p> {this.props.data.desc} </p>
					</div>
				</figcaption>
			</figure>
		)
	}
})

// control unit
var ControllerUnit = React.createClass({
	handleClick: function (e) {
		// if selected image is centered, rotate the image 
		// if not, center image 
		if (this.props.arrange.isCenter)
			this.props.inverse()
		else
			this.props.center()

		e.preventDefault()
		e.stopPropagation()
	},

	render: function () {
		var controlelrUnitClassName = 'controller-unit'
		// add 'is-center' class to indicator
		if (this.props.arrange.isCenter) {
			controlelrUnitClassName += ' is-center'

			// add 'is-inverse' class to inversed indicator
			if (this.props.arrange.isInverse) {
				controlelrUnitClassName += ' is-inverse'
			}
		}
		return ( <span className={controlelrUnitClassName} onClick={this.handleClick}></span> )
	}
})

var AppComponent = React.createClass({
		Constant: {
			centerPos: {
				left: 0,
				right: 0
			},
			hPosRange: {  
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: {    
				x: [0, 0],
				topY: [0, 0]
			}
		},

	/*
	 * reverse image
	 * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
	 * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
	 */
	inverse: function (index) {
		return function () {
			var imgsArrangeArr = this.state.imgsArrangeArr
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		}.bind(this)
	},


	rearrange: function (centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2),   
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1)

		// set center image positon and clear its rotate angle
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}

		// get imamge data which will be rendered on the top
		topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum))
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum)

		// position images on the top
		imgsArrangeTopArr.forEach(function (value, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			} 
		})

		// left and right images
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2 i < j i++) {
			var hPosRangeLORX = null

			// 前半部分布局左边， 右半部分布局右边
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX
			} else {
				hPosRangeLORX = hPosRangeRightSecX
			}

			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}

		}

		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])

		this.setState({imgsArrangeArr: imgsArrangeArr})

	},

	/*
	 * reannage center image 
	 * @param index - image index
	 * @returns {Function}
	 */
	center: function (index) {
		return function () {
			this.rearrange(index)
		}.bind(this)
	},

	getInitialState: function() {
		return {
			imgsArrangeArr: [
				/*{
				 pos: {
						left: '0',
						top: '0'
				 },
				 rotate: 0,   
				 isInverse: false,   
				 isCenter: false,    
				 }*/
			]
		}
	},

	// mount component, calculate position range 
	componentDidMount: function () {
		// get stage(window) size 
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2)

		// get imageFigure size
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2)

		// get center position
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		// get position range on the left and right 
		this.Constant.hPosRange.leftSecX[0] = -halfImgW
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW
		this.Constant.hPosRange.y[0] = -halfImgH
		this.Constant.hPosRange.y[1] = stageH - halfImgH

		// get position range on the top
		this.Constant.vPosRange.topY[0] = -halfImgH
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3
		this.Constant.vPosRange.x[0] = halfStageW - imgW
		this.Constant.vPosRange.x[1] = halfStageW

		var imgsArrangeArr = this.state.imgsArrangeArr

		this.rearrange(getRangeRandom(0,imgsArrangeArr.length))
	},

	render: function() {
		var controllerUnits = [],
			imgFigures = []

		imageDatas.forEach(function (value, index) {
			if(!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}

			imgFigures.push(
				<ImgFigure key={index}  
						   data={value} 
						   ref={'imgFigure' + index} 
						   arrange={this.state.imgsArrangeArr[index]}
						   inverse={this.inverse(index)} 
						   center={this.center(index)}/>
			)

			controllerUnits.push(
				<ControllerUnit key={index} 
								arrange={this.state.imgsArrangeArr[index]}
								inverse={this.inverse(index)} 
								center={this.center(index)}/>
			)
		}.bind(this))

		return (
			<section className="stage" ref="stage">
				<section className="img-sec"> {imgFigures} </section>
				<nav className="controller-nav"> {controllerUnits} </nav>
			</section>
		)
	}
})

AppComponent.defaultProps = {}

export default AppComponent 