import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
/**
 * 曲线图插件
 */
export class Charts extends Component {
    constructor(props,context) {
        super(props);
        this.state={
        		list:this.props.canvasUrl.map((item)=>{ return Number(item.curPrice)})
        	}
        console.log(this.state.list);
    }
    //在渲染前调用,在客户端也在服务端
    componentWillMount() {
   		this.canvasPrototype();
    }
    // 在第一次渲染后调用，只在客户端
    componentDidMount() {
    	 //画canvas
        this.draw();
    }
    //在组件接收到新的props或者state时被调用
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    //在组件接收到新的props或者state但还没有render时被调用。在初始化时不会被调用
    componentWillUpdate(nextProps,nextState){
      
    }
   
    render() {
    	var scwidth = document.documentElement.clientWidth;
        return (
        	<canvas className="myCanvas" width={scwidth} height="140"></canvas>
        	)
    }
    
    //在组件从 DOM 中移除的时候立刻被调用。
    componentWillUnmount() {
        cancelAnimationFrame(this.state.requestID);
    }
    draw(){
    	let canvas=document.querySelector('.myCanvas');
        const width=canvas.width,
        	height =canvas.height;
        let ctx=canvas.getContext('2d'),
        	max=this.state.list[0],
        	min=this.state.list[0];
        //求最大值 小值
		for(let i=0,len=this.state.list.length;i<len;i++){
			if(max<=this.state.list[i]){
				max=this.state.list[i]
			}
		}
		for(let i=0,len=this.state.list.length;i<len;i++){
			if(min>=this.state.list[i]){
				min=this.state.list[i]
			}
		}
    	this.state.max=max;
    	this.state.min=min;
       	this.drawXY(ctx,width,height);
       	this.drawCur(ctx,width,height); 
       	this.drawXText(ctx,width,height);	
    }
    //画x轴 y轴
    drawXY(ctx,width,height){
    	let wspace=width/4,
    		hspace=height/2;		
    	//x轴
    	ctx.lineWidth=1;
		for(let i=0;i<3;i++){
			if(i==1){
				ctx.beginPath();
				ctx.strokeStyle="#f3f3f3";
				ctx.drawDashLine(0,hspace*i,width,hspace*i,2);
			}else{
				ctx.beginPath();
				ctx.strokeStyle="#f3f3f3";
				ctx.moveTo(0,hspace*i);
				ctx.lineTo(width,hspace*i);
				ctx.stroke();
			}
		}
		//y轴
		for(let j=1;j<4;j++){
			ctx.beginPath();
			ctx.strokeStyle="#f3f3f3";
			ctx.moveTo(wspace*j,0);
			ctx.lineTo(wspace*j,height);
			ctx.stroke();
		}
    }
    drawXText(ctx,width,height){
    	//最高值
    	ctx.font="10px";
    	ctx.strokeStyle="#909090";
    	ctx.textAlign="start";
    	ctx.textBaseline="top";
		ctx.fillText(this.state.max,10,10);

		//最小值
		ctx.font="10px";
		ctx.strokeStyle="#909090";
		ctx.textAlign="start";
    	ctx.textBaseline="bottom";
		ctx.fillText(this.state.min,10,height-10);
    }
    drawCur(ctx,width,height){
    	let data=this.state.list,
    		len=200,
    		max=this.state.max,
    		min=this.state.min,
    		xspace=width/(len-1),
    		yspace=0;

    		yspace=(height-10)/(max-min);
    		ctx.save();
    		ctx.translate(0,10);
    		ctx.beginPath();
    		ctx.strokeStyle="#7EC1FD";
    		ctx.moveTo(0,(max-data[0])*yspace);
    		for(var i=0;i<data.length;i++){	
    			ctx.lineTo(i*xspace,(max-data[i])*yspace);
    		}
    		ctx.stroke();
    		//阴影
    		ctx.fillStyle="#E4EBF7";
    		ctx.lineTo(data.length*xspace,height-10);
    		ctx.lineTo(0,height-10);
    		ctx.closePath();
    		ctx.fill();
    		ctx.restore();
    }
    //canvas清晰
    canvasPrototype(){
    	(function(prototype) {
		    var pixelRatio = (function(context) {
		            var backingStore = context.backingStorePixelRatio ||
		                // context.webkitBackingStorePixelRatio ||
		                // context.mozBackingStorePixelRatio ||
		                // context.msBackingStorePixelRatio ||
		                // context.oBackingStorePixelRatio ||
		                context.backingStorePixelRatio || 1;

		            return (window.devicePixelRatio || 1) / backingStore;
		        })(prototype),

		        forEach = function(obj, func) {
		            for (var p in obj) {
		                if (obj.hasOwnProperty(p)) {
		                    func(obj[p], p);
		                }
		            }
		        },

		        ratioArgs = {
		            'fillRect': 'all',
		            'clearRect': 'all',
		            'strokeRect': 'all',
		            'moveTo': 'all',
		            'lineTo': 'all',
		            'arc': [0, 1, 2],
		            'arcTo': 'all',
		            'bezierCurveTo': 'all',
		            'isPointinPath': 'all',
		            'isPointinStroke': 'all',
		            'quadraticCurveTo': 'all',
		            'rect': 'all',
		            'translate': 'all',
		            'createRadialGradient': 'all',
		            'createLinearGradient': 'all'
		        };

		    if (pixelRatio === 1) return;

		    forEach(ratioArgs, function(value, key) {
		        prototype[key] = (function(_super) {
		            return function() {
		                var i, len,
		                    args = Array.prototype.slice.call(arguments);

		                if (value === 'all') {
		                    args = args.map(function(a) {
		                        return a * pixelRatio;
		                    });
		                } else if (Array.isArray(value)) {
		                    for (i = 0, len = value.length; i < len; i++) {
		                        args[value[i]] *= pixelRatio;
		                    }
		                }

		                return _super.apply(this, args);
		            };
		        })(prototype[key]);
		    });

		    // Stroke lineWidth adjustment
		    prototype.stroke = (function(_super) {
		        return function() {
		            this.lineWidth *= pixelRatio;
		            _super.apply(this, arguments);
		            this.lineWidth /= pixelRatio;
		        };
		    })(prototype.stroke);

		    // Text
		    //
		    prototype.fillText = (function(_super) {
		        return function() {
		            var args = Array.prototype.slice.call(arguments);

		            args[1] *= pixelRatio; // x
		            args[2] *= pixelRatio; // y

		            this.font = this.font.replace(
		                /(\d+)(px|em|rem|pt)/g,
		                function(w, m, u) {
		                    return (m * pixelRatio) + u;
		                }   
		            );

		            _super.apply(this, args);

		            this.font = this.font.replace(
		                /(\d+)(px|em|rem|pt)/g,
		                function(w, m, u) {
		                    return (m / pixelRatio) + u;
		                }
		            );
		        };
		    })(prototype.fillText);

		    prototype.strokeText = (function(_super) {
		        return function() {
		            var args = Array.prototype.slice.call(arguments);

		            args[1] *= pixelRatio; // x
		            args[2] *= pixelRatio; // y

		            this.font = this.font.replace(
		                /(\d+)(px|em|rem|pt)/g,
		                function(w, m, u) {
		                    return (m * pixelRatio) + u;
		                }
		            );

		            _super.apply(this, args);

		            this.font = this.font.replace(
		                /(\d+)(px|em|rem|pt)/g,
		                function(w, m, u) {
		                    return (m / pixelRatio) + u;
		                }
		            );
		        };
		    })(prototype.strokeText);
		})(CanvasRenderingContext2D.prototype);
		(function(prototype) {
		    prototype.getContext = (function(_super) {
		        return function(type) {
		            var backingStore, ratio,
		                context = _super.call(this, type);

		            if (type === '2d') {

		                backingStore = context.backingStorePixelRatio ||
		                   /* context.webkitBackingStorePixelRatio ||
		                    context.mozBackingStorePixelRatio ||
		                    context.msBackingStorePixelRatio ||
		                    context.oBackingStorePixelRatio ||*/
		                    context.backingStorePixelRatio || 1;

		                ratio = (window.devicePixelRatio || 1) / backingStore;

		                if (ratio > 1) {
		                    this.style.height = this.height + 'px';
		                    this.style.width = this.width + 'px';
		                    this.width *= ratio;
		                    this.height *= ratio;
		                }
		            }

		            return context;
		        };
		    })(prototype.getContext);
		})(HTMLCanvasElement.prototype);
		CanvasRenderingContext2D.prototype.drawDashLine = function(x1, y1, x2, y2, dashLength) {
		    var dashLen = dashLength === undefined ? 5 : dashLength,
		        xpos = x2 - x1, //得到横向的宽度;
		        ypos = y2 - y1, //得到纵向的高度;
		        numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
		    //利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
		    for (var i = 0; i < numDashes; i++) {
		        if (i % 2 === 0) {
		            this.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
		            //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
		        } else {
		            this.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
		        }
		    }
		    this.stroke();
		};
    }
}
