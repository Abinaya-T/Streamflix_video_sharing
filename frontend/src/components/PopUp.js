import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./PopUp.css";
import { config } from "../App";
import { message } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";

export class PopUp extends React.Component {
  constructor() {
    super();
    this.state = {
      videos:[],
      show: false,
      videoLink: "",
      previewImage: "",
      title: "",
      genre: "",
      contentRating: "",
      releaseDate: "",
    };
    // this.handleShow = this.handleShow.bind(this);
    // this.handleClose = this.handleClose.bind(this);
  }

  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  getData = async () =>{
    const response = await fetch(`${config.endpoint}`)
    const data = await response.json();
    if (data) {
      this.setState({ videos: data});
    }
  }
  addData = async () => {
    console.log("Inside addData");
    const {
      videoLink,
      previewImage,
      title,
      genre,
      contentRating,
      releaseDate,
    } = this.state;
    console.log(title);
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previewImage: previewImage,
          videoLink: videoLink,
          title: title,
          genre: genre,
          contentRating: contentRating,
          releaseDate: releaseDate,
        }),
      };
      const response = await fetch(`${config.endpoint}`, requestOptions);
      const data = await response.json();
      console.log(data);
      if (data) {
        message.success("Video added successfully");
        this.handleClose();
        await this.getData()
      }
    } catch (error) {
      message.error("An Error occurred, please try again Later !");
    }
  };

  render() {
    return (
      <>
        <Button id="upload-btn" variant="primary" onClick={this.handleShow}>
          Upload
        </Button>
        <Modal
          className="special_modal"
          show={this.state.show}
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Upload Video</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="videoLink">
                <Form.Control
                  placeholder="Video Link"
                  name="videoLink"
                  onChange={this.handleChange}
                />
                <Form.Text className="text-muted">
                  This link will be used to derive the video
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="previewImgLink">
                <Form.Control
                  name="previewImage"
                  placeholder="Thumbnail Image Link"
                  onChange={this.handleChange}
                />
                <Form.Text className="text-muted">
                  This link will be used to preview the thumbnail image
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="title">
                <Form.Control
                  name="title"
                  placeholder="Title"
                  onChange={this.handleChange}
                />
                <Form.Text className="text-muted">
                  The title will be the representative text for the video
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="genreSelect">
                <Form.Control
                  as="select"
                  name="genre"
                  placeholder="Genre"
                  onChange={this.handleChange}
                >
                  <option>Education</option>
                  <option>Sports</option>
                  <option>Comedy</option>
                  <option>Lifestyle</option>
                  <option>Movies</option>
                </Form.Control>
                <Form.Text className="text-muted">
                  Genre will help in categorizing your videos
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="AgeSelect">
                <Form.Control
                  as="select"
                  name="contentRating"
                  placeholder="Suitable Age group for the clip"
                  onChange={this.handleChange}
                >
                  <option>7+</option>
                  <option>12+</option>
                  <option>16+</option>
                  <option>18+</option>
                </Form.Control>
                <Form.Text className="text-muted">
                  This will be used to filter videos based on Age group
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="UploadedDate">
                <Form.Control
                  type="date"
                  name="releaseDate"
                  placeholder="Release Date"
                  onChange={this.handleChange}
                />
                <Form.Text className="text-muted">
                  Uploaded date will be used to sort videos
                </Form.Text>
              </Form.Group>
              <Button
                id="upload-btn-cancel"
                variant="secondary"
                onClick={this.handleClose}
              >
                Close
              </Button>
              <Button
                id="upload-btn-submit"
                variant="danger"
                onClick={this.addData}
              >
                Upload Video
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
