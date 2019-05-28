import React, {Component} from 'react'
import './MapPage.scss'
import Iframe from 'react-iframe'
import Preloader from '../../components/Preloader'

export default class Map extends Component {
  state ={
    isLoading: true
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({isLoading: false})
    }, 2000)
  }

  render () {
    const map = <Iframe url={'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.6655269994703!2d30.59119171589868!3d50.42870309681247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4c57dd85632a3%3A0x60a23243bc1fbf89!2z0KLQpiDQodC40LvRjNCy0LXRgCDQkdGA0LjQtw!5e0!3m2!1sru!2sua!4v1555755290223!5m2!1sru!2sua'} className = "iframe"/>
    const content = this.state.isLoading ? <Preloader/> : map
    return (
      <div className='map'>
        <div className="parallax-container">
          {content}
        </div>
      </div>
    )
  }
}
