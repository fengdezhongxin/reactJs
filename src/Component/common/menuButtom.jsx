import React, {Component, PropTypes} from 'react';
import { Link, IndexLink } from 'react-router';
import pureRender from 'pure-render-decorator';
import { is, fromJS} from 'immutable';
import { Tool } from '../../Config/Tool';
import template from './template';

/**
 * 导航栏
 *
 * @export
 * @class Header
 * @extends {Component}
 */


export class MenuButtom extends Component {  //头部标题
     constructor(props) {
        super(props);
        
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    render() {
        return (
            <div className="menuButtom">
                <dl>
                   <Link to="/saleRecord">
                       <dd>
                            <div className="icon trend"></div>
                            <p>行情</p>
                       </dd>
                   </Link>
                   <Link to='/saleRecord'>
                       <dd>
                            <div className="icon optionalIcon"></div>
                            <p>自选</p>
                       
                       </dd>
                   </Link>
                   <Link to='/saleRecord'>
                       <dd>
                            <div className="icon guessIcon"></div>
                            <p>猜涨跌</p>
                       </dd>
                   </Link>
                   <Link to='/saleRecord'>
                       <dd>
                            <div className="icon accountIcon"></div>
                            <p>开户</p>
                       </dd>
                   </Link>
                   </dl>
            </div>
        );
    }
}


