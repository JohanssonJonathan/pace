import React from "react";
import UserMood from "./UserMood";
import OnboardingPage from "./OnboardingPage";
import Dashboard from "./Dashboard";
import FirstTaskMutation from "../../queries/FirstTaskMutation";

const CurrentView = ({
  acceptInvite,
  atInvitePage,
  focusMode,
  toggleFocus,
  retrieveFocus,
  user
}) => {
  if (!user.emoji) {
    const newUser = { ...user, emoji: user.emoji || "1f920" };
    return <UserMood prompt="How are you doing?" user={newUser} />;
  } else if (!user.tasks[0] && user.createdFirstTask === null) {
    return (
      <FirstTaskMutation>
        {({ firstTaskOfProfile }) => {
          return (
            <OnboardingPage
              prompt="What are you doing today?"
              user={user}
              firstTaskOfProfile={firstTaskOfProfile}
            />
          );
        }}
      </FirstTaskMutation>
    );
  } else {
    return (
      <Dashboard
        prompt="You're doing great!"
        user={user}
        atInvitePage={atInvitePage}
        acceptInvite={acceptInvite}
        focusMode={focusMode}
        toggleFocus={toggleFocus}
        retrieveFocus={retrieveFocus}
      />
    );
  }
};

export default CurrentView;
