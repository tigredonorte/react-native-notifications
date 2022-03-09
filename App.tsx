import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import * as notifications from 'expo-notifications';
import * as taskManager from 'expo-task-manager';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';
taskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log('Received a notification in the background!');
  // Do something with the notification data
});
notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

notifications.setNotificationHandler({
  handleNotification: async(data) => ({
    shouldShowAlert: true,
    shouldPlaySound: true, 
    shouldSetBadge: true,
  })
});

export default function App() {

  const [ token, setToken ] = useState('');

  // notification listeners
  useEffect(() => {
    const backgroundSubs = notifications.addNotificationResponseReceivedListener((notification) => {
      console.log({ notification }, 'backgroundSubs');
    });

    const foregroundSubs = notifications.addNotificationReceivedListener((notification) => {
      console.log({ notification }, 'foregroundSubs');
    });

    return () => {
      backgroundSubs.remove();
      foregroundSubs.remove();
    }
  }, []);

  const askForPermission = async() => {
    if (Platform.OS === 'android') {
      return true;
    }
    let perm = await notifications.getPermissionsAsync();
    if (!perm.granted) {
      if (!perm.canAskAgain) {
        return false;
      }

      perm = await notifications.requestPermissionsAsync();
      if (!perm.granted) {
        return false;
      }
    }
    return true;
  }

  // request permission
  useEffect(() => {
    const init = async() => {
      if (!await askForPermission()) {
        return Alert.alert('Permission denied', "You must grant notification permission to use this app");
      }
      
      const response = await notifications.getExpoPushTokenAsync();
      setToken(response.data); // here you must save the user's token.
    };
    init();
  }, [ setToken ]);

  const scheduleLocalNotification = async() => {
    await notifications.scheduleNotificationAsync({
      content: {
        title: 'My first notification',
        body: 'Can i read long notifications? I dont know, but writing this big notification I can test it! ',
        data: {
          foo: 'bar'
        }
      },
      trigger: {
        seconds: 5
      }
    });
  }

  const scheduleRemoteNotification = async() => {
    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: token,
          data: { foo: 'bar' },
          title: 'Sent via app',
          body: 'this push was sent via the api'
        })
      });
  
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <View style={styles.container}>
      <Button onPress={scheduleLocalNotification}>Local notification</Button>
      <Button mode='contained' onPress={scheduleRemoteNotification}>Remote notification</Button>
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
