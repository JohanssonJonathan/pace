import React, { Component } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Tasks from "../tasks/Tasks";
import CurrentTime from "../CurrentTime";
import FocusMode from "../FocusMode";
import EmojiContainer from "../../UI/EmojiContainer";
import ImageUploader from "../../UI/ImageUploader";
import { buildingForWeb } from "../../../lib/platform";
import EmojiIcon from "../../UI/EmojiIcon";
import theme from "../../../styles/commonStyles/theme";
import howAreYouArrow from "../../../img/how-are-you-arrow.svg";

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center"
  },

  currentUserDashboard: {
    backgroundColor: theme.BACKGROUND_COLOR,
    borderRadius: 8
  },
  currentUserFocus: {
    backgroundColor: theme.BACKGROUND_COLOR,
    flex: 1
  },
  wholeProfileContent: {
    ...(buildingForWeb
      ? {
          marginTop: 77
        }
      : { marginTop: 10 }),
    marginBottom: 0,
    width: 72,
    height: 72,
    position: "relative",
    zIndex: 899,
    alignSelf: "center"
  },
  emojiContainer: {
    alignItems: "center",
    position: "relative"
  },
  emojiInProfile: {
    position: "absolute",
    zIndex: 999,
    left: 34,
    top: 54
  },
  microCopy: {
    color: theme.PRIMARY_COLOR_ACTIVE,
    fontWeight: theme.FONT_WEIGHT_SEMI,
    ...(buildingForWeb && {
      fontFamily: theme.FONT_FAMILY
    })
  },
  dailyRoutineContainer: {
    position: "absolute",
    top: 50,
    left: 110,
    width: 150
  },
  howAreYouArrow: {
    height: 22,
    width: 52,
    position: "absolute",
    top: 20,
    left: -40
  }
});

const Content = ({
  children,
  user,
  focusMode,
  avatar,
  toggleFocus,
  showDailyRoutine,
  dailyRoutineTime
}) => {
  return (
    <View style={localStyles.container}>
      {buildingForWeb && (
        <FocusMode toggleFocus={toggleFocus} focus={focusMode} />
      )}
      <View style={localStyles.wholeProfileContent}>
        <ImageUploader
          avatar={avatar}
          user={user}
          avatarStyle={localStyles.profileImage}
        />
        <View style={localStyles.emojiInProfile}>{children}</View>
        {showDailyRoutine && (
          <View style={localStyles.dailyRoutineContainer}>
            <Text style={localStyles.microCopy}>How are you today?</Text>
            <Image source={howAreYouArrow} style={localStyles.howAreYouArrow} />
          </View>
        )}
      </View>
      <CurrentTime />
      <Tasks
        user={user}
        focusMode={focusMode}
        dailyRoutineTime={dailyRoutineTime}
      />
    </View>
  );
};

const WebContainer = ({
  children,
  user,
  focusMode,
  avatar,
  toggleFocus,
  showDailyRoutine,
  dailyRoutineTime
}) => {
  return (
    <View
      style={
        focusMode
          ? localStyles.currentUserFocus
          : localStyles.currentUserDashboard
      }
    >
      <Content
        toggleFocus={toggleFocus}
        focusMode={focusMode}
        user={user}
        avatar={avatar}
        showDailyRoutine={showDailyRoutine}
        dailyRoutineTime={dailyRoutineTime}
      >
        {children}
      </Content>
    </View>
  );
};

const MobileContainer = ({
  children,
  visible,
  user,
  toggleEmojiPicker,
  avatar,
  emojiPressHandler
}) => {
  const windowHeight = Dimensions.get("window").height;

  if (visible) {
    return (
      <View style={localStyles.currentUserDashboard}>
        <View style={localStyles.EmojiContainer}>
          <EmojiContainer
            user={user}
            unicode={user.emoji}
            emojiSize={64}
            toggleEmojiPicker={toggleEmojiPicker}
            visible={visible}
            emojiPressHandler={emojiPressHandler}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={localStyles.currentUserDashboard}>
        <View style={{ height: windowHeight - 100 }}>
          <Content avatar={avatar} user={user}>
            {children}
          </Content>
        </View>
      </View>
    );
  }
};

class UserViewPage extends Component {
  state = {
    showCompletedTasks: false,
    visible: false,
    showDailyRoutine: false,
    dailyRoutineTime: 16 // Hours
  };

  toggleEmojiPicker = () => {
    this.setState({
      visible: !this.state.visible
    });
  };

  emojiPressHandler = () => {
    this.toggleEmojiPicker();
    this.props.emojiPickerVisible && this.props.emojiPickerVisible();
  };

  toggleDailyRoutine = value => {
    this.setState({ showDailyRoutine: value ? true : false });
  };

  hoursSinceLastUpdate = userUpdateTime => {
    let lastUpdate = {};
    const now = new Date();

    if (userUpdateTime) {
      lastUpdate = new Date(userUpdateTime);
    } else {
      lastUpdate = new Date(now.getTime() - 1000 * 60 * 60 * 24);
    }

    return (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  };

  componentWillMount() {
    if (
      this.hoursSinceLastUpdate(this.props.user.updatedAt) >
      this.state.dailyRoutineTime
    ) {
      if (!this.state.showDailyRoutine) {
        this.toggleDailyRoutine(true);
      }
    }
  }

  render() {
    const { user, focusMode, toggleFocus } = this.props;
    const { avatar } = user;
    const { visible } = this.state;
    if (buildingForWeb) {
      return (
        <WebContainer
          toggleFocus={toggleFocus}
          focusMode={focusMode}
          user={user}
          avatar={avatar}
          showDailyRoutine={this.state.showDailyRoutine}
          dailyRoutineTime={this.state.dailyRoutineTime}
        >
          <EmojiContainer
            user={user}
            unicode={this.state.showDailyRoutine ? "2753" : user.emoji}
            emojiSize={32}
            toggleEmojiPicker={this.toggleEmojiPicker}
            visible={visible}
            onChange={this.toggleDailyRoutine}
            emojiPressHandler={this.emojiPressHandler}
          />
        </WebContainer>
      );
    } else {
      return (
        <MobileContainer
          visible={visible}
          toggleEmojiPicker={this.toggleEmojiPicker}
          user={user}
          avatar={avatar}
          emojiPressHandler={this.emojiPressHandler}
        >
          <EmojiIcon
            user={user}
            unicode={user.emoji}
            emojiSize={32}
            toggleEmojiPicker={this.toggleEmojiPicker}
            visible={visible}
            onPress={this.emojiPressHandler}
          />
        </MobileContainer>
      );
    }
  }
}

export default UserViewPage;
