import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 5,
    category: 'general'
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    // console.log("hello i m constructor")
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`
  }
  async updateNews() {
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(40);
    // console.log(data);
    let parsedData = await data.json();
    this.props.setProgress(70);
    // console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false
    })
    this.props.setProgress(100);
  }
  async componentDidMount() {
    this.updateNews()
  }
  // handlePrevClick =  () => {
  //   this.setState({
  //     page: this.state.page - 1,
  //   })
  //   this.updateNews()
  // }
  // handleNextClick =  () => {
  //   this.setState({
  //     page: this.state.page + 1,
  //   })
  //   this.updateNews()
  // }
  fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;

    let data = await fetch(url);
    // console.log(data);
    let parsedData = await data.json();
    // console.log(parsedData);
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      page: this.state.page + 1,
      loading: false
    })

  };

  render() {
    // console.log("render")
    return (
      <>
        <h1 className="text-center" style={{ margin: '35px 0px' ,marginTop:'90px'}}>News Monkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner />}
       
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length < this.state.totalResults}
          loader={ <Spinner />}>

        <div div className="container">
            <div className="row my-3">
              {this.state.articles.map((element, index) => {
                return <div className="col-md-4 mb-4" key={index}>
                  <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                </div> 
                //   <div className="container d-flex justify-content-between">
                //  <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}> &larr;Previous</button>
                //  <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                //   </div>
                
              })}
          </div>
            </div> 
           </InfiniteScroll >
      </>

    )
  }
}

export default News