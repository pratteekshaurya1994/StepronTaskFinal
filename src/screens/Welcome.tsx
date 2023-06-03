import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Colors, FontConfig, NavigateTo} from '../constants';
import {BaseViewComponent} from '../components/core';

const WelcomeScreen = (props: any) => {
  const navigation = props.navigation;
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('hello');
      navigation.navigate(NavigateTo.Main);
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <BaseViewComponent
      normal={Platform.OS === 'android'}
      contentContainerStyle={styles.contentContainerStyle}
      backgroundColor={'#00000000'}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(NavigateTo.Main);
        }}>
        <Text
          style={{
            color: 'red',
          }}>
          Welcome To Stepron Task
        </Text>
      </TouchableOpacity>
    </BaseViewComponent>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WelcomeScreen;
