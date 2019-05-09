import React, { Component } from "react";
import { AsyncStorage, View, StyleSheet } from "react-native";
import UserQuery from "../../queries/UserQuery";
import CurrentView from "./CurrentView";
import ProfileButton from "../../UI/ProfileButton";
import Profile from "../../user/Profile";
import theme from "../../../styles/commonStyles/theme";
import { buildingForWeb } from "../../../lib/platform";

const localStyles = StyleSheet.create({
  settingsButtonContainer: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 98
  },
  settingsContainer: {
    position: "absolute",
    top: 50,
    zIndex: 98,
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    flex: 1,
    borderRadius: 8
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: theme.BACKGROUND_COLOR
  }
});

const Content = ({ showSettings, toggleSettings }) => {
  if (buildingForWeb) {
    return (
      <View style={localStyles.settingsButtonContainer}>
        {!showSettings ? (
          <ProfileButton toggleSettings={toggleSettings} />
        ) : (
          <Profile toggleSettings={toggleSettings} />
        )}
      </View>
    );
  } else {
    return !showSettings ? (
      <View style={localStyles.settingsButtonContainer}>
        <ProfileButton toggleSettings={toggleSettings} />
      </View>
    ) : (
      <View style={localStyles.settingsContainer}>
        <Profile toggleSettings={toggleSettings} />
      </View>
    );
  }
};
class UserFlow extends Component {
  state = {
    focusMode: false,
    showSettings: false
  };

  toggleSettings = () => {
    this.setState(prevState => ({
      showSettings: !prevState.showSettings
    }));
  };

  toggleFocus = () => {
    this.setState(prevState => ({
      focusMode: !prevState.focusMode
    }));

    this.storeFocus();
  };

  storeFocus = () => {
    AsyncStorage.setItem("focusStatus", !this.state.focusMode).catch(error =>
      console.log(error)
    );
  };

  retrieveFocus = async () => {
    AsyncStorage.getItem("focusStatus")
      .then(value => {
        if (value !== null) {
          this.setState({ focusMode: value === "true" ? true : false });
        }
      })
      .catch(error => console.log(error.message));
  };

  render() {
    //If the user is redirected from /i/:pageid route to here these values will be defined.
    //Otherwise they will be undefined
    const { acceptInvite, atInvitePage } = this.props;
    const { focusMode } = this.state;
    //acceptInvite is only defined if it comes from the /i/:pageid route
    //atInvitePage is only defined if it comes from the /i/:pageid route
    //teamId is only defined if it comes from the /i/:page route

    return (
      <UserQuery>
        {({ user }) => {
          return (
            <>
              <Content
                showSettings={this.state.showSettings}
                toggleSettings={this.toggleSettings}
              />
              <CurrentView
                acceptInvite={acceptInvite}
                atInvitePage={atInvitePage}
                focusMode={focusMode}
                toggleFocus={this.toggleFocus}
                retrieveFocus={this.retrieveFocus}
                user={user}
              />
            </>
          );
        }}
      </UserQuery>
    );
  }
}

export default UserFlow;
