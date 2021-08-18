
import React, { useEffect, useState } from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import Notifications from './screens/Notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './components/context';
import { signinUrl, signupUrl } from './utils/global';
import LoggedUserCredentials from './models/LoggedUserCredentials';
import md5 from 'react-native-md5';
import Chat from './screens/chat/Chat';
import SigninScreen from './screens/auth/SigninScreen';
import SignupScreen from './screens/auth/SignupScreen';
import HomeScreen from './screens/home/HomeScreen';
import CreateGroup from './screens/home/CreateGroup';
import Nearme from './screens/home/Nearme';
import Crop from './screens/home/Crop';
import MessageContainer from './screens/messages/MessageContainer';


const Stack = createStackNavigator();

const App = () => {

  const [fontLoaded, setFontLoaded] = useState(false);

  const initialState = {
    userToken: null,

  }

  const authReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,

        }
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,

        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,

        };
      case 'REGISTER':
        return {
          ...prevState,
          userToken: action.token,

        };

    }
  };


  const [authState, dispatch] = React.useReducer(authReducer, initialState);

  const authContext = React.useMemo(() => ({

    signIn: async (userType, phoneNumber, password, error, setError, setLoading) => {
      let userToken = null;
      const data_values = {
        'userType': userType,
        'phoneNumber': phoneNumber,
        'password': md5.hex_md5(password)
      };

      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_values)
      };


      try {

        const response = await fetch(signinUrl, config);

        if (response.status === 200) {

          const data = await response.json();
          userToken = data.token;

          const accessTokenArray = ["accessToken", data.token];
          const userIdArray = ["userId", data.userId];
          const userNameArray = ["userName", data.name];
          const userTypeArray = ["userType", data.userType];

          const storeItems = [accessTokenArray, userIdArray, userNameArray, userTypeArray];

          LoggedUserCredentials.setLoggedUserData(
            data.token,
            data.userId,
            data.name,
            data.userType
          );

          await AsyncStorage.multiSet(storeItems);

        }
        else {

          setLoading(false);
          setError({
            ...error,
            errorText: 'Login failed.Please Try Again.'
          })
        }

      } catch (error) {
        console.log(error);
        setLoading(false);
        setError({
          ...error,
          errorText: 'No Internet Connection'
        })

      }

      dispatch({ type: 'LOGIN', token: userToken });
    }

    ,
    signOut: async () => {
      try {
        // await AsyncStorage.multiRemove(["accessToken", "userId", "userName", "userType"]);
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
      } catch (err) {
        console.log(err);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: async (data, param, setData) => {

      let userToken = null;
      const { email, name, gpa_cert_no, gpa_cert_pic, pro_pic } = data;
      const { phoneNumber, userType, password } = param;


      try {
        var formData = new FormData();
        formData.append('phoneNumber', phoneNumber);
        formData.append('userType', userType);
        formData.append('password', md5.hex_md5(password));
        formData.append('email', email);
        formData.append('name', name);
        formData.append('latitude', LoggedUserCredentials.getLocation().latitude);
        formData.append('longitude', LoggedUserCredentials.getLocation().longitude);

        if (userType === 'Farmer' && gpa_cert_no.trim().length > 0) {
          formData.append('gpaCertNo', gpa_cert_no);
        }

        if (userType === 'Farmer' && gpa_cert_pic !== null) {
          const localUri = gpa_cert_pic;
          const filename = localUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;

          formData.append('gpaCertPic', {
            uri: localUri,
            type,
            name: filename
          })
        }

        if (pro_pic !== null) {
          const localUri = pro_pic;
          const filename = localUri.split('/').pop();

          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;

          formData.append('proPic', {
            uri: localUri,
            type,
            name: filename
          })
        }

        const config = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          body: formData
        };

        const response = await fetch(signupUrl, config);

        const statusCode = response.status;

        if (statusCode === 201) {
          const data = await response.json();
          userToken = data.token;

          const accessTokenArray = ["accessToken", data.token];
          const userIdArray = ["userId", data.userId];
          const userNameArray = ["userName", data.name];
          const userTypeArray = ["userType", data.userType];

          const storeItems = [accessTokenArray, userIdArray, userNameArray, userTypeArray];

          LoggedUserCredentials.setLoggedUserData(
            data.token,
            data.userId,
            data.name,
            data.userType
          );

          await AsyncStorage.multiSet(storeItems);
          // setData({
          //     ...data,
          //     isLoading:false
          // })

        }
        else {
          console.log("error")
          setData({
            ...data,
            isLoading: false,
            errorText: 'Something went wrong.Please Try Again.'
          })
        }



      } catch (error) {
        console.log("error is", error);
        setData({
          ...data,
          isLoading: false,
          errorText: 'No Internet Connection'
        })
      }

      dispatch({ type: 'REGISTER', token: userToken });
    }
  }), []);

  useEffect(() => {
    let userToken = null;


    try {
      AsyncStorage.multiGet(["accessToken", "userId", "userName", "userType"]).then(res => {
        if (res) {

          const accessToken = res[0][1];
          const userId = res[1][1];
          const userName = res[2][1];
          const userType = res[3][1];
          userToken = accessToken;
          LoggedUserCredentials.setLoggedUserData(accessToken, userId, userName, userType);
          dispatch({ type: 'RETRIEVE_TOKEN', token: userToken })

        }

      })


    }
    catch (err) {
      console.log(err);
    }

  }, []);


  const fetchFonts = async () => {
    await Font.loadAsync({
      'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
      'Roboto-bold': require('./assets/fonts/Roboto-Bold.ttf')
    })

  }

  const handleFinish = () => {
    setFontLoaded(true);
  }

  const handleError = (err) => {
    console.log(err);
  }

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={handleFinish}
        onError={handleError}
      />
    )
  }


  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#369154" />
  //     </View>
  //   )

  // }

  return (

    <AuthContext.Provider value={authContext}>
      <NativeBaseProvider>
        <NavigationContainer>

          <Stack.Navigator>
            {
              authState.userToken !== null ?
                <>
                  <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Chat" component={Chat} options={{ gestureEnabled: false, headerShown: true }} />
                  <Stack.Screen name="CreateGroup" component={CreateGroup} options={{ gestureEnabled: false }} />
                  <Stack.Screen name="Message" component={MessageContainer} />
                  <Stack.Screen name="Crop" component={Crop} />
                  <Stack.Screen name="Nearme" component={Nearme} options={{ headerShown: true, gestureEnabled: false }} />
                  <Stack.Screen name="Notification" component={Notifications} />
                </>
                :
                <>
                  <Stack.Screen name="SignIn" component={SigninScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="SignUp" component={SignupScreen} options={{ headerShown: false }} />
                  {/* <Stack.Screen name="UserModal" component={UserDetailModal} /> */}
                </>
            }
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </AuthContext.Provider>



  );
}

export default App;
