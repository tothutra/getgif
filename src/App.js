import React, { Component } from 'react';
import loader from './images/oval.svg'
import clearButton from './images/close.svg'
import Gif from './Gif';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {hasResults? <img className="block mx-auto close-button" src={clearButton} onClick={clearSearch}/> : <h1 className="title" onClick={clearSearch}>GetGif!</h1>}
  </div>
)


const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {loading? <img className="block mx-auto" src={loader}/> : hintText}
  </div>
)

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      hintText: 'Hit enter to search',
      loading: false,
      gif: null,
      gifs: []
    }
    //this.handleChange = this.handleChange.bind(this)
  }

  searchGiphy = async term => {
    this.setState({
      loading: true,
    })
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=prv2W4jSkGiLPcX0ZZ6g6e1mMjWVlzGb&q=${term}&limit=25&offset=0&rating=G&lang=en`
      )
      const {data} = await response.json()
      const randomGif = randomChoice(data)
      if (data.length === 0) {
        throw `Nothing found for ${term}`
      } else {
        this.setState((prevState, props) => ({
          ...prevState,
          gif: randomGif,
          gifs: [...prevState.gifs, randomGif],
          loading: false,
          hintText: `Hit enter to see more ${term}`
        }))
      }

    } catch (error) {
      this.setState({
        loading: false,
        hintText: error,
      })
    }
  }

  handleChange = event => {
    const {value} = event.target
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }))
  }
  handleKeyPress = event => {
    const {value} = event.target
    if (value.length >2 && event.key === "Enter") {
      this.searchGiphy(value)
    }
  }

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      loading: false,
      gif: null,
      gifs: []
    }))
    this.input.focus()
  }
  render() {
    const {searchTerm} = this.state
    const hasResults = this.state.gifs.length
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {this.state.gifs.map(gif => (
            <Gif {...gif}/>
          ))}
          <input
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.input = input
            }}
          />
        </div>
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
