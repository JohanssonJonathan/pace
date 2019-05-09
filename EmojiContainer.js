import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import EmojiIcon from "./EmojiIcon";
import EmojiPicker from "./EmojiPicker";
import theme from "../../styles/commonStyles/theme";
import UpdateEmojiMutation from "../queries/UpdateEmojiMutation";
import { buildingForWeb } from "../../lib/platform";
import Mixpanel from "../../utilities/mixpanel";

class EmojiContainer extends Component {
  emojiChangeHandler = () => {
    const { toggleEmojiPicker } = this.props;
    if (this.props.onChange) {
      this.props.onChange();
    }
    toggleEmojiPicker();
    Mixpanel.track("Toggled emoji picker", { visibility: "hidden" });
  };

  render() {
    const {
      user,
      emojiSize,
      unicode,
      visible,
      toggleEmojiPicker,
      width,
      emojiPressHandler
    } = this.props;

    const localStyles = StyleSheet.create({
      container: {
        alignItems: "center",
        position: "relative",
        zIndex: 996
      },
      ...(buildingForWeb
        ? {
            emojipicker: {
              width: 0,
              position: "absolute",
              left: -((276 - emojiSize) / 2),
              top: emojiSize * 1.5
            },
            licenseText: {
              width: 276,
              marginTop: 10,
              textAlign: "center",
              fontFamily: theme.FONT_FAMILY,
              fontSize: theme.FONT_SIZE_TINY,
              color: theme.SUBTLE_TEXT_COLOR
            }
          }
        : {
            emojipicker: {
              flex: 1
            },
            emoji: {
              marginTop: 60,
              marginBottom: 20
            }
          })
    });

    return (
      <UpdateEmojiMutation>
        {({ update }) => {
          return (
            <View style={localStyles.container}>
              <View style={localStyles.emoji}>
                <EmojiIcon
                  emojiSize={emojiSize}
                  unicode={unicode}
                  onPress={emojiPressHandler}
                />
              </View>
              {visible && (
                <View style={localStyles.emojipicker}>
                  <EmojiPicker
                    id={user.id}
                    toggleEmojiPicker={toggleEmojiPicker}
                    update={update}
                    width={width}
                    onChange={this.emojiChangeHandler}
                  />
                  {buildingForWeb && (
                    <Text style={localStyles.licenseText}>
                      Emoji icons supplied by{" "}
                      <a href="https://www.emojione.com/">EmojiOne</a>
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
        }}
      </UpdateEmojiMutation>
    );
  }
}

export default EmojiContainer;
