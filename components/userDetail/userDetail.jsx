import React from "react";
import { TextField, Button, Typography } from "@mui/material";
import "./userDetail.css";
import { Link } from "react-router-dom";
// import fetchModel from "../../lib/fetchModelData";
import axios from "axios";

/**
 * Define UserDetail, a React component of project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: undefined,
      recentPhoto: undefined,
      mostCommentedPhoto: undefined,
    };
  }

  componentDidMount() {
    const new_user_id = this.props.match.params.userId;
    this.handleUserChange(new_user_id);
  }

  componentDidUpdate() {
    const new_user_id = this.props.match.params.userId;
    const current_user_id = this.state.userDetails?._id;
    if (current_user_id !== new_user_id) {
      this.handleUserChange(new_user_id);
    }
  }

  handleUserChange(user_id) {
    axios.get("/user/" + user_id).then((response) => {
      const new_user = response.data;
      this.setState({
        userDetails: new_user,
      });

      // Fetch the most recently uploaded photo
      axios
        .get("/user/recentPhoto/" + user_id)
        .then((response) => {
          const recentPhoto = response.data;
          this.setState({ recentPhoto });
        })
        .catch((error) => {
          console.error("Error fetching recent photo", error);
        });

      // Fetch the photo with the most comments
      axios
        .get("/user/mostCommentedPhoto/" + user_id)
        .then((response) => {
          const mostCommentedPhoto = response.data;
          this.setState({ mostCommentedPhoto });
        })
        .catch((error) => {
          console.error("Error fetching most commented photo", error);
        });

      const main_content = new_user.first_name + " " + new_user.last_name;
      this.props.changeTopbarContent(main_content);
    });
  }
  navigateToUserPhotos = (photoId) => {
    // Assuming you have a route defined for the user photos view
    this.props.history.push(`/photos/${this.state.userDetails._id}/${photoId}`);
  };

  formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date
      .toISOString()
      .replace(/T/, " ")
      .replace(/\.\d+Z$/, "");
    return formattedDate;
  };

  render() {
    const { userDetails } = this.state;
    return userDetails ? (
      <div>
        <Button
          variant="contained"
          size="medium"
          component={Link}
          to={`/photos/${userDetails._id}`}
          className="button"
        >
          USER PHOTOS
        </Button>
        <div className="user-detail-box" style={{ marginTop: '16px' }}>
              <Typography variant="body1" className="user-detail-title">
                First Name
              </Typography>
              <Typography variant="body1" className="user-detail-value">
                {userDetails.first_name}
              </Typography>
            </div>
            <div className="user-detail-box">
              <Typography variant="body1" className="user-detail-title">
                Last Name
              </Typography>
              <Typography variant="body1" className="user-detail-value">
                {userDetails.last_name}
              </Typography>
            </div>
            <div className="user-detail-box">
              <Typography variant="body1" className="user-detail-title">
                Location
              </Typography>
              <Typography variant="body1" className="user-detail-value">
                {userDetails.location}
              </Typography>
            </div>
            <div className="user-detail-box">
              <Typography variant="body1" className="user-detail-title">
                Description
              </Typography>
              <Typography variant="body1" className="user-detail-value">
                {userDetails.description}
              </Typography>
            </div>
            <div className="user-detail-box">
              <Typography variant="body1" className="user-detail-title">
                Occupation
              </Typography>
              <Typography variant="body1" className="user-detail-value">
                {userDetails.occupation}
              </Typography>
            </div>

        {this.state.recentPhoto && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "20px",
              borderRadius: "10px",
              border: "2px solid lightgrey",
              padding: "20px",
              width: "80%",
              height: "25%",          
            }}
          >
            <img
              src={`images/${this.state.recentPhoto.file_name}`}
              alt="Recent Photo"
              onClick={() =>
                this.navigateToUserPhotos(this.state.recentPhoto._id)
              }
              style={{ width: "50px", height: "50px" }}
            />
            <Typography>
              Recent Photo Date and time:{" "}
              {this.formatDate(this.state.recentPhoto.date_time)}
            </Typography>
          </div>
        )}
        {this.state.mostCommentedPhoto && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "20px",
              borderRadius: "10px",
              border: "2px solid lightgrey",
              padding: "20px",
              width: "80%",
              height: "25%",          
            }}
          >
            <img
              src={`images/${this.state.mostCommentedPhoto.file_name}`}
              alt="Most Commented Photo"
              onClick={() =>
                this.navigateToUserPhotos(this.state.mostCommentedPhoto._id)
              }
              style={{ width: "50px", height: "50px" }}
            />
            <Typography>
              The Most commented photo, Comments count:{" "}
              {this.state.mostCommentedPhoto.commentCount}
            </Typography>
          </div>
        )}

      </div>
    ) : (
      <div/>
    );
  }
}

export default UserDetail;
