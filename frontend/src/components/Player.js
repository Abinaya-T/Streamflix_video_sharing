import React from "react";
import "./Player.css";
import Header from "./Header";
import { config } from "../App";
import { message } from "antd";
import { Divider, Icon, Button } from 'semantic-ui-react';
import moment from 'moment';


export class Player extends React.Component {
  constructor(props) {
    super(props);
    this.video = [];
    this.state = {
      id: this.props.match.params.videoId,
      videoData: [],
      loading: false,
    };
  }

  performAPICall = async () => {
    let response = [];
    let errored = false;

    this.setState({
      loading: true,
    });
    
    try {
      response = await (
        await fetch(`${config.endpoint}/${this.state.id}`)
      ).json();
      // converting json obj to array of obj
      // response = Object.entries(response).map((e) => ({ [e[0]]: e[1] }));
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
    if (errored || (!Object.keys(response).length && !response.message)) {
      message.error(
        "Could not fetch video. Check that the backend is running, reachable and returns valid JSON."
      );
      return false;
    }
    if (!Object.keys(response).length) {
      message.error(response.message);
      return false;
    }
    return true;
  };

  getVideo = async () => {
    const res = await this.performAPICall();
    if (res) {
      this.video = res;
      this.setState({ videoData: this.video});
      console.log("get video")
      console.log(this.state.videoData.votes.upVotes)
    }
  };

  componentDidMount() {
    this.getVideo();
    console.log("mount")
    console.log(this.state.videoData.votes)
  }

  render() {
    const isLoading = this.state.loading;
    console.log("render" + isLoading)
    console.log(this.state.videoData)
    let videoFrame;
    let upVotes;
    let downVotes;
    if(!isLoading){
      videoFrame = <iframe width={'560'} height={'315'} src={"https://www." + this.state.videoData.videoLink} frameBorder='0'
      allow='autoplay; encrypted-media' allowFullScreen="true" webkitallowfullscreen="true" title={'video'}/>
      console.log("Inside If isLoading" + this.state.videoData)
    }
    return (
      <>
        <Header />
        <div className="container">
          <div className="video-container">{videoFrame}</div>
          <div className="video-description">
            <h3>{this.state.videoData.title}</h3>
            <div className="video-stats">
              <span>
                {this.state.videoData.contentRating} |{" "}
                {moment
                (this.state.videoData.releaseDate).fromNow()}
              </span>
              <div className="votes">
                <Button className="buttonStyle" size="mini"  icon labelPosition="left">
                  <Icon  name="thumbs up" />
                    {upVotes}
                </Button>
                <Button className="buttonStyle" size="mini"  icon labelPosition="right">
                    {downVotes}
                  <Icon fitted="true" name="thumbs down" />
                </Button>
              </div>
            </div>
          </div>
          <Divider />
        </div>
      </>
    );
  }
}
