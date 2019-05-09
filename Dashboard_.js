import React from "react";
import TeamView from "../../team/TeamView";
import { buildingForWeb } from "../../../lib/platform";
import CustomScrollView from "../../UI/CustomScrollView";
import { StyleSheet, View } from "react-native";
import UserView from "./UserView";

const localStyles = StyleSheet.create({
  mobileContainer: {
    flexGrow: 1
  },
  containerFocus: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  container: {
    width: 800,
    marginVertical: 100
  }
});

const Wrapper = ({ children, focusMode }) => {
  if (buildingForWeb) {
    return (
      <View
        style={focusMode ? localStyles.containerFocus : localStyles.container}
      >
        {children}
      </View>
    );
  } else {
    return (
      <CustomScrollView
        contentContainerStyle={localStyles.mobileContainer}
        style={{ alignSelf: "stretch" }}
      >
        {children}
      </CustomScrollView>
    );
  }
};

class Dashboard extends React.Component {
  state = {
    emojiPickerVisible: false
  };
  render() {
    const { emojiPickerVisible } = this.state;

    const {
      atInvitePage,
      acceptInvite,
      user,
      focusMode,
      toggleFocus
    } = this.props;
    return (
      <Wrapper focusMode={focusMode}>
        <UserView
          prompt="You're doing great!"
          user={user}
          focusMode={focusMode}
          toggleFocus={toggleFocus}
          emojiPickerVisible={_ =>
            this.setState({ emojiPickerVisible: !emojiPickerVisible })
          }
        />
        {!focusMode && (
          <TeamView
            user={user}
            atInvitePage={atInvitePage}
            acceptInvite={acceptInvite}
          />
        )}
      </Wrapper>
    );
  }
}

export default Dashboard;
