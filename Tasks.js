import React from "react";
import { Component } from "react";
import Task from "./Task";
import CreateTask from "./CreateTask";
import { View, Text, StyleSheet } from "react-native";
import theme from "../../../styles/commonStyles/theme.js";
import { palette } from "../../../styles/commonStyles/colors";
import FollowingTasks from "./FollowingTasks";
const localStyles = StyleSheet.create({
  tasksContainer: {
    marginTop: 20,
    padding: 20
  },
  getStartedText: {
    marginBottom: 13,
    marginLeft: 36,
    fontSize: theme.FONT_SIZE_MEDIUM_SMALL
  },
  afterThatText: {
    marginBottom: 13,
    marginLeft: 36,
    fontWeight: "100"
  },
  addNewTask: {
    flexDirection: "row"
  },
  addAnotherTaskText: {
    color: palette.green,
    fontSize: theme.FONT_SIZE_SMALL,
    paddingTop: 2
  }
});

class Tasks extends Component {
  state = {
    isAdding: false,
    showDailyRoutine: false
  };

  toggleIsAdding = () => {
    this.setState({ isAdding: !this.state.isAdding });
  };

  toggleDailyRoutine = value => {
    this.setState({
      showDailyRoutine: value ? true : false
    });
  };

  componentWillMount = () => {
    let taskTime = {};
    let now = new Date();
    if (this.props.user.tasks.length > 0) {
      taskTime = new Date(
        this.props.user.tasks[this.props.user.tasks.length - 1].updatedAt
      );
    } else {
      taskTime = now;
    }

    if (
      now.getTime() - taskTime.getTime() >
      1000 * 60 * 60 * this.props.dailyRoutineTime
    ) {
      if (!this.state.showDailyRoutine) {
        this.toggleDailyRoutine(true);
      }
    }
  };

  render() {
    const { isAdding } = this.state;
    const { user } = this.props;
    const allUnCompletedTasks =
      user.tasks && user.tasks.filter(task => !task.completed);
    const firstTask = allUnCompletedTasks && allUnCompletedTasks[0];

    return (
      <View style={localStyles.tasksContainer}>
        <Text style={localStyles.getStartedText}>Focus on</Text>
        {allUnCompletedTasks.length === 0 && ( // Show this when there are no tasks
          <CreateTask
            user={user}
            placeholder="What are you up to today?"
            isPrimary={true}
            position={0}
          />
        )}
        {firstTask && ( // Displays first isPrimary task that can be edited and deleted
          <Task
            task={firstTask}
            user={firstTask.owner}
            key={firstTask.id}
            checkable
            isPrimary
            toggleDailyRoutine={this.toggleDailyRoutine}
          />
        )}
        <FollowingTasks
          allUnCompletedTasks={allUnCompletedTasks}
          isAdding={isAdding}
          toggleIsAdding={this.toggleIsAdding}
          user={user}
          toggleDailyRoutine={this.toggleDailyRoutine}
        />
      </View>
    );
  }
}

export default Tasks;
