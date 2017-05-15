import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
/**
 * 曲线图插件
 */
export class ReactIScroll extends Component {
    constructor(props,context) {
        super(props);
    }
    //在渲染前调用,在客户端也在服务端
    componentWillMount() {
    }
    // 在第一次渲染后调用，只在客户端
    componentDidMount() {
    	 //画canvas
        this.slider();
    }
    //在组件接收到新的props或者state时被调用
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    //在组件接收到新的props或者state但还没有render时被调用。在初始化时不会被调用
    componentWillUpdate(nextProps,nextState){
      
    }
   
    render() {
        return (
        	<div id='Iscroll'>
              <div className="pull_up">
                  <div className="up_animate active"></div>
                  <div className="up_animate"></div>
                  <div className="up_animate"></div>
              </div>
              <div id="Iscroll_content">
              		{this.props.children}
                    <div className="down_load">加载中。。。。</div>
              </div>
            </div>
        	)
    }
    
    //在组件从 DOM 中移除的时候立刻被调用。
    componentWillUnmount() {
        cancelAnimationFrame(this.state.requestID);
    }
     //滑动逻辑
    slider() {
      /**
       * 这里只实现垂直滚动
      */
      var parent = document.getElementById('Iscroll');
      var content = document.getElementById('Iscroll_content');
      var sliderHeight=parseFloat(getPX(document.body).height,10)-parseFloat(getPX(parent).height,10);
      var startY = 0; // 初始位置
      var lastY = 0; // 上一次位置
      var nowY=0;
      var moveY=0;
      /**
       * 用于缓动的变量
      */
      var lastMoveTime = 0;
      var lastMoveStart = 0;
      var stopInertiaMove = false; // 是否停止缓动
      var events = {
              index: 0, //显示元素的索引
              slider: null, //this为slider对象,
              up_index:0,
              up_time:null,
              up_refresh:false,
              down_load:false,
              handleEvent: function(event) {
                  if (event.type == 'touchstart') {
                      this.start(event);
                  } else if (event.type == 'touchmove') {
                      this.move(event);
                  } else if (event.type == 'touchend') {
                      this.end(event);
                  }
              },
              //滑动开始
              start: function(e) {
                  e.preventDefault();
                  lastY = startY = e.touches[0].pageY;
                  var contentTop = content.style.top.replace('px', '')||0;
                  if(contentTop==0){
                    events.up_refresh=true;
                  }else{
                   events.up_refresh=false;
                  }
                  /**
                   * 缓动代码
                   */
                  lastMoveStart = lastY;
                  lastMoveTime =  Date.now();
                  stopInertiaMove = true;
                  this.slider.addEventListener('touchmove', this, false);
                  this.slider.addEventListener('touchend', this, false);

              },
              //移动
              move: function(e) {
                  e.preventDefault();
                  nowY = e.touches[0].pageY;
                  moveY = nowY - lastY;
                  var contentTop = content.style.top.replace('px', '')||0;
                  // 设置top值移动content
                  if((parseInt(contentTop) + moveY)<=0){
                  	events.up_div_scale(0);
                  	content.style.top = (parseInt(contentTop) + moveY) + 'px';
                  	lastY = nowY;
                  }else{
                  	events.up_div_scale(moveY);
                  }
                  /**
                   * 缓动代码
                   */
                  var nowTime =  Date.now();
                  stopInertiaMove = true;
                  if(nowTime - lastMoveTime > 300) {
                    lastMoveTime = nowTime;
                    lastMoveStart = nowY;
                  }
                  console.log(moveY);
              },
              //滑动释放
              end: function(e) {
                 // do touchend
                  e.preventDefault();
                  var contentTop = content.style.top.replace('px', '');
                  var contentY = (parseInt(contentTop));
                  if(moveY==0){
                    return;
                  }
                  /**
                   * 缓动代码
                   */
                  var nowTime = Date.now();
                  var v = (nowY - lastMoveStart) / (nowTime - lastMoveTime); //最后一段时间手指划动速度
                  stopInertiaMove = false;
                  (function(v, startTime, contentY) {
                  	var time=null;
                    var speed=5;
                    var dir = v > 0 ? -1 : 1; //加速度方向
                    var deceleration = dir*0.0006;
                    var duration = v / deceleration; // 速度消减至0所需时间
                    var dist = v * duration / 2; //最终移动多少
                    function inertiaMove() {
                      speed+=6;
                      if(stopInertiaMove) return;
                      var nowTime = Date.now();
                      var t = nowTime-startTime;
                      var nowV = v + t*deceleration;
                      var moveY = (v + nowV)/2 * t;
                      if((contentY + moveY)>=0){
                        content.style.top = "0px";
                      }else if(sliderHeight>=(contentY + moveY)){
                        content.style.top = sliderHeight + "px";
                      }else{
                        content.style.top = (contentY + moveY) + "px";
                      }
                      // 速度方向变化表示速度达到0了
                      if(dir*nowV > 0) {
                      	clearTimeout(time);
                      	time=null;
                        return;
                      }
                   	time=setTimeout(inertiaMove, speed);
                    }
                    inertiaMove();
                  })(v, lastMoveTime, contentY);
                //解绑事件
                this.slider.removeEventListener('touchmove', this, false);
                this.slider.removeEventListener('touchend', this, false);
              },
              up_div_scale:function(height){
                var dom_an=document.querySelector(".pull_up"),
                 	hg=dom_an.style.height||0;
                if(parseFloat(hg,10)==0){
                	events.up_animate();
                }
                 dom_an.style.height=height+"px";
                if(height==0){
                  clearInterval(events.up_time);
                  events.up_time=null;
                }else if(height>58){
                 	 dom_an.style.height="60px";
                }
              },
              //刷新动画
              up_animate:function(){
                var dom_an=document.querySelectorAll(".up_animate"),
                    up_date_start=Date.now(),
                    up_date_end=0;
                events.up_time=setInterval(function(){
                  events.up_index++;
                  for(var i=0,len=dom_an.length;i<len;i++){
                      if(events.up_index==i){
                        dom_an[i].className="up_animate active";
                      }else{
                        dom_an[i].className="up_animate";
                      }
                  }
                  if(events.up_index>=2){
                    events.up_index=-1;
                  }
                  up_date_end=Date.now()-up_date_start;
                  if(up_date_end>=2000){
                    clearInterval(events.up_time);
                    events.up_time=null;
                    events.up_refresh=false;
                    content.style.top = "0px";
                    events.up_div_scale(0);
                    return;
                  }
                },500)
              },
              down_load:function(){
              }
          },
          init = function() {
              var touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
                  dom = document.querySelector("#Iscroll");
              events.slider = dom;
              if (!!touch) {
                 dom.addEventListener('touchstart', events, false);
              }
          };
        init();
        //
        function getPX(id) {
            var style = null;
            if (window.getComputedStyle) {
                style = window.getComputedStyle(id, null); // 非IE
            } else {
                style = id.currentStyle; // IE
            }
            return style;
        }
    }
}
