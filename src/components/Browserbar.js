import React, { Component } from 'react'

// turn required globals into explicit dependencies
import {Helpers, LocalStore} from '../API'

import DappIdenticon from './DappIdenticon'

class Breadcrumb extends Component {
  render() {
    let _url = new URL(this.props.url)
    // console.log(_url)

    // remove trailing '/'
    let pathname = _url.pathname.replace(/\/$/g, '')
    let pathParts = pathname.split('/')
    // remove all '?'
    let search = _url.search.replace(/\?/g, '')

    let parts = [_url.host, ...pathParts, search, _url.hash]
    return (
      <div className="url-breadcrumb" >
        <span>
          {_url.protocol} // {parts.map((p, i) => p ? <span key={i}>{p}  ▸ </span> : '')}
        </span>
      </div>
    )
  }
}

class UrlBreadcrumbInput extends Component {
  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {url: props.url}
  }
  handleChange(e){
    this.setState({url: e.target.value})
  }
  render() {
    let permissions = {
      admin: false
    }
    return (
      <form className="url" action="about:blank" target="dapp-form-helper-iframe" autoComplete="on">
        {!permissions.admin && <input className="url-input" id="url-input" type="text" value={this.props.url} onChange={this.handleChange}/> }
        <Breadcrumb url={this.props.url}/>
      </form>
    );
  }
}

export default class Browserbar extends Component {
  constructor(props){
    super(props)
    this.handleReloadClick = this.handleReloadClick.bind(this)
  }
  /**
   * Go back in the dapps browser history
   */
  handleGoBackClick(){
    var webview = Helpers.getCurrentWebview()
    if (webview && webview.canGoBack()) {
      webview.goBack();
    }
  }
  /**
   * Reload the current webview
   * @event click button.reload 
   */
  handleReloadClick(){
    var webview = Helpers.getCurrentWebview()
    if (webview) {
      webview.reload()
    }
  }
  render(){

    let nameFull = 'fullName'
    let name = 'name'
    let dapp = {
      icon: ''
    }
    return (
      <div className="browser-bar">
        <button title="go back" className="back icon icon-arrow-left" onClick={this.handleGoBackClick}></button>
        <button title="refresh page" className="reload icon icon-refresh" onClick={this.handleReloadClick}></button>
        <div className="app-bar">
          <label htmlFor="url-input" className={"dapp-info" + (this.icon && 'has-icon')}>
            {this.icon && <img src={this.icon} className="app-icon" />}
            <span title={nameFull}>{name}</span>
          </label>

          <UrlBreadcrumbInput url={this.props.url} />

          <button className="accounts">
            <span className="simptip-position-left simptip-movable" data-tooltip="{{name}}">
              <DappIdenticon identity="address" className="dapp-tiny" />
            </span>
          </button>

        </div>
      </div>
    )
  }
}