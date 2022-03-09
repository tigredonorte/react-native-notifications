import React, { useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import * as notifications from 'expo-notifications';

notifications.setNotificationHandler({
  handleNotification: async(data) => ({
    shouldShowAlert: true,
    shouldPlaySound: true, 
    shouldSetBadge: true,
  })
});

export default function App() {

  useEffect(() => {
    const subscription = notifications.addNotificationReceivedListener((notification) => {
      console.log({ notification });
    });

    return () => subscription.remove();
  }, []);

  const notify = async() => {
    const perm = await notifications.requestPermissionsAsync();
    if (!perm.granted) {
      return Alert.alert('Permission denied', "You must grant notification permission to use this app");
    }

    const res = await notifications.scheduleNotificationAsync({
      content: {
        title: 'My first notification',
        body: 'Can i read long notifications? I dont know, but writing this big notification I can test it! ',
        data: {
          foo: 'bar'
        }
      },
      trigger: {
        seconds: 2
      }
    });
    console.log(res);
  }

  return (
    <View style={styles.container}>
      <Button onPress={notify}>Trigger notification</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
