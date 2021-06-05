import { message } from "antd";
import React from "react";
import { config } from "../App";
import Header from "./Header";
import "./Search.css";
import { Sort } from "./Sort";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button as Btn, Icon, Input } from "semantic-ui-react";
import moment from "moment";

export class Search extends React.Component {
  constructor() {
    super();
    this.debounceTimeout = 0;
    this.videos = [];
    this.filterpanel = [];
    this.state = {
      loading: false,
      filteredvideos: [],
      genrefilter: [],
    };
  }

  performAPICall = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      response = await (await fetch(`${config.endpoint}`)).json();
      response = response.videos;
    } catch (e) {
      errored = true;
    }

    this.setState({
      loading: false,
    });
    if (this.validateResponse(errored, response)) {
      return response;
    }
  };

  validateResponse = (errored, response) => {
    if (errored || !response.length) {
      console.log(errored);
      console.log(response.length);
      console.log("Inside age  1");
      message.error(
        "Could not fetch videos. Check that the backend is running, reachable and returns valid JSON."
      );
      return false;
    }

    if (!response.length) {
      console.log("Inside age  2");
      message.error(response.message || "No videos found in database");
      return false;
    }

    return true;
  };

  getVideosList = async () => {
    const res = await this.performAPICall();
    if (res) {
      this.videos = res;
      this.setState({ filteredvideos: [...this.videos] });
    }
  };

  search = (text) => {
    let currentList = [];
    let List1 = [];
    let newList = [];

    if (text !== "") {
      currentList = this.videos;
      List1 = currentList.filter((item) => {
        let searchText = text.toLowerCase();
        let curItem = item.title.toLowerCase();
        return curItem.includes(searchText);
      });
      newList = [...List1];
    } else {
      newList = this.videos;
    }

    this.setState({ filteredvideos: newList });
  };

  debounceSearch = (event) => {
    let timer;
    let text = event.target.value;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    timer = setTimeout(() => {
      this.search(text);
    }, 300);
    this.debounceTimeout = timer;
  };

  filterByAge = async (item) => {
    if (item === "Any age group") {
      await this.getVideosList();
    } else {
      let age = item.replace("+", "%2B");
      console.log(age);
      let response = {};
      let errored = false;

      this.setState({
        loading: true,
      });

      try {
        response = await (
          await fetch(`${config.endpoint}?contentRating=${age}`)
        ).json();
        response = response.videos;
      } catch (e) {
        errored = true;
      }

      this.setState({
        loading: false,
      });
      if (this.validateResponse(errored, response)) {
        console.log("Inside age validation");
        this.videos = response;
        this.setState({
          filteredvideos: [...this.videos],
        });
      }
    }
  };

  filterByGenre = async (genre) => {
    console.log(genre);
    if (genre === "All genre") {
      await this.getVideosList();
    } else {
      let response = {};
      let errored = false;

      this.setState({
        loading: true,
      });

      try {
        response = await (
          await fetch(`${config.endpoint}?genres=${genre}`)
        ).json();
        response = response.videos
      } catch (e) {
        errored = true;
      }

      this.setState({
        loading: false,
      });
      if (this.validateResponse(errored, response)) {
        this.videos = response;
        this.setState({
          filteredvideos: [...this.videos],
        });
      }
    }
  };

  handlerSort = (val) => {
    console.log("Inside HandlerSort");
    this.setState({
      filteredvideos: val,
    });
  };

  componentDidMount() {
    this.getVideosList();
  }

  render() {
    let filterPanel = [
      "All genre",
      "Education",
      "Sports",
      "Comedy",
      "Lifestyle",
    ];
    let agePanel = ["Any age group", "7+", "12+", "16+", "18+"];

    return (
      <>
        {/* Display Header with Search bar */}
        <Header history={this.props.history}>
          <Input
            className="video-search"
            placeholder="What are you looking for?"
            Fluid
            icon={<Icon name="search" inverted circular link />}
            size="small"
            onSearch={(val) => {
              this.search(val);
            }}
            onChange={(e) => {
              this.debounceSearch(e);
            }}
          />
        </Header>
        <div className="container filter-container">
          <div className="filter-panel">
            {filterPanel.map((item) => {
              return (
                <Btn
                  className="genre-btn"
                  size="small"
                  onClick={(e, data) => {
                    this.filterByGenre(data.children);
                  }}
                >
                  {item}
                </Btn>
              );
            })}
          </div>
          <div className="filter-panel">
            {agePanel.map((item) => {
              return (
                <Btn
                  className="content-rating-btn"
                  size="small"
                  onClick={(e, data) => {
                    this.filterByAge(data.children);
                  }}
                >
                  {item}
                </Btn>
              );
            })}
          </div>
          <div className="sort">
            <Sort handleSort={this.handlerSort} />
          </div>
        </div>

        <div className="container video-grid">
          <Container fluid>
            <Row className="justify-content-md-center">
              {this.state.filteredvideos.map((video) => (
                <Col xs={6} md={4}>
                  <Link to={"/" + video._id} className="video-tile-link">
                    <div className="video-tile card border-0">
                      <img src={video.previewImage} alt="video-preview-img" />
                      <div className="card-body">
                        <h6 style={{ color: "white", fontWeight: "bold" }}>
                          {video.title}
                        </h6>
                        <p>{moment(video.releaseDate).fromNow()}</p>
                      </div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </>
    );
  }
}
