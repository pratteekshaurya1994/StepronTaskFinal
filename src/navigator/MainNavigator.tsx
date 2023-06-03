import * as React from 'react';
import {NavigateTo} from '../constants';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/Welcome';
import MainScreen from '../screens/stepron/MainScreen';
import AddEditScreen from '../screens/stepron/AddEditScreen';

const MainStack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <MainStack.Navigator initialRouteName={NavigateTo.WelcomeScreen}>
      <MainStack.Screen
        name={NavigateTo.WelcomeScreen}
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name={NavigateTo.Main}
        component={MainScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name={NavigateTo.AddEditScreen}
        component={AddEditScreen}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
