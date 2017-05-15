import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import {History, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {Header,template} from './common/mixin';
import {Charts} from './common/chart';
import ReactSwipe from 'react-swipes';
import {martket} from '../data/web_market.js';
import {MenuButtom} from './common/menuButtom';
import ReactPullToRefresh from "react-pull-to-refresh";
//canvas
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

class Main extends Component {
    constructor() {
        super();
        this.state = {
            saleMoney:'',  //销售金额
            name:'',   //姓名
            phone:'',   //电话
            products:[],    //销售商品
            postProduct:[], //上传的商品信息
            serverId:'',   // 图片id
            picSrc:'',     //图片src
            saleOldvalue:'',    //金额上次input值
            preventMountSubmit:true,//防止重复提交
            card:[1,2,3,4,5],
            dataCanvas:martket,
            timeChartKInfoList:martket.resultData.timeChartKInfoList
        }
        //事件
        this.startFn=(ev)=>{
            console.log('start');
        }
        this.moveFn=(ev)=>{
            console.log('move');
        }
        this.endFn=(ev)=>{
            console.log('end');
        }
        //上拉刷新
        this.handleRefresh=(resolve, reject)=>{
            setTimeout(function(){
               if (true) {
                resolve();
              } else {
                reject();
              }
            },1000)
             
        }
    }
    //在渲染前调用,在客户端也在服务端
    componentWillMount() {
        
    }
    // 在第一次渲染后调用，只在客户端
    componentDidMount() {
        //请求曲线图数据
       console.log(this.state.dataCanvas);
    }
    //在组件接收到新的props或者state时被调用
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    //在组件接收到新的props或者state但还没有render时被调用。在初始化时不会被调用
    componentWillUpdate(nextProps,nextState){
      
    }
   
    render() {
        // swipes 的配置
        let opt = {
            distance: 320, // 每次移动的距离，卡片的真实宽度
            swTouchstart:(ev)=>{
                console.log('start');
            },
            swTouchmove: (ev) => {
              console.log('move');
            },
            swTouchend: (ev) => {
                let data = {
                    moved: ev.moved,
                    originalPoint: ev.originalPoint,
                    newPoint: ev.newPoint,
                    cancelled: ev.cancelled
                }
                console.log(data);
                this.setState({
                    curCard: ev.newPoint
                })
            }
        }
        return (
            <ReactPullToRefresh
              onRefresh={this.handleRefresh}      
              className="your-own-class-if-you-want"
              style={{
                textAlign: 'center'
              }}>
                <div className="trendPage">
                    <div className="search-box">
                      股票代码或拼音简称
                    </div>
                    <div className="real-time-index">
                        <div className="rise-li">
                            <p className="down">3241.41</p>
                            <span>上证指数</span>
                            <span>-0.36%</span>
                        </div>
                        <div className="rise-li">
                            <p className="down">3241.41</p>
                            <span>深证指数</span>
                            <span className="down">-0.36%</span>
                        </div>
                        <div className="rise-li">
                            <p className="down">3241.41</p>
                            <span>创业板指</span>
                            <span className="down">-0.36%</span>
                        </div>
                    </div>
                    <div className="chart">
                          <Charts canvasUrl={this.state.timeChartKInfoList}></Charts>
                    </div>
                    <div className="hot-pannel">
                        <p>热门模块</p>
                        <div className="hot-pannel-info">
                            <div className="hot-info-list">
                                <p>运输业</p>
                                <p>1.59%</p>
                                <p>316.24</p>
                            </div>
                            <div className="hot-info-list">
                                <p>运输业</p>
                                <p>1.59%</p>
                                <p>316.24</p>
                            </div>
                            <div className="hot-info-list">
                                <p>运输业</p>
                                <p>1.59%</p>
                                <p>316.24</p>
                            </div>
                            <div className="hot-info-list">
                                <p>运输业</p>
                                <p>1.59%</p>
                                <p>316.24</p>
                            </div>
                            <div className="hot-info-list">
                                <p>运输业</p>
                                <p>1.59%</p>
                                <p>316.24</p>
                            </div>
                            <div className="hot-info-list">
                                <p>运输业</p>
                                <p>1.59%</p>
                                <p>316.24</p>
                            </div>
                        </div>
                    </div>
                    <div className="tab-column">
                        <div className="tab-column-title">
                            涨幅榜
                        </div>
                        <div className="tab-column-title">
                            跌幅榜
                        </div>
                        <div className="tab-column-title">
                            换手率榜
                        </div>
                    </div>
                    <div className="tab-column-wrap">
                        <div className="tab-column-wrap">
                            <ul className="tab-column-list">
                                <li className="tab-li">
                                    <div>
                                        <p>弘讯科技</p>
                                        <span>603015</span>
                                    </div>
                                    <div>13.70</div>
                                    <div>10.04%</div>
                                </li>
                                <li className="tab-li">
                                    <div>
                                        <p>弘讯科技</p>
                                        <span>603015</span>
                                    </div>
                                    <div>13.70</div>
                                    <div>10.04%</div>
                                </li>
                                <li className="tab-li">
                                    <div>
                                        <p>弘讯科技</p>
                                        <span>603015</span>
                                    </div>
                                    <div>13.70</div>
                                    <div>10.04%</div>
                                </li>
                                <li className="tab-li">
                                    <div>
                                        <p>弘讯科技</p>
                                        <span>603015</span>
                                    </div>
                                    <div>13.70</div>
                                    <div>10.04%</div>
                                </li>
                                <li className="tab-li">
                                    <div>
                                        <p>弘讯科技</p>
                                        <span>603015</span>
                                    </div>
                                    <div>13.70</div>
                                    <div>10.04%</div>

                                </li>
                            </ul>
                        </div>
                    </div>
                <MenuButtom></MenuButtom>
            </div> 
            </ReactPullToRefresh>  
        )
    }
    //在组件从 DOM 中移除的时候立刻被调用。
    componentWillUnmount() {
        cancelAnimationFrame(this.state.requestID);
    }
}
export default template({
    id: 'index',  //应用关联使用的redux
    component: Main,//接收数据的组件入口
    url: ''
});

