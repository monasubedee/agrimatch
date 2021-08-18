import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, View, Platform } from 'react-native';
import { Input, Image, Center, Select, VStack, Button, CheckIcon, Checkbox } from 'native-base';
import Logo from '../../assets/images/logo.png';
import myanmarPhoneNumber from 'myanmar-phonenumber';
import { signinUrl } from '../../utils/global';
import md5 from 'react-native-md5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import LoggedUserCredentials from '../../models/LoggedUserCredentials';
import { AuthContext } from '../../components/context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



const SigninScreen = ({ navigation }) => {

    const { signIn } = React.useContext(AuthContext);

    const [data, setData] = useState({
        allowUser: true,
        userType: '',
        phoneNumber: '',
        password: '',

    });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const [error, setError] = useState({
        isValidUserType: true,
        isValidPhoneNumber: true,
        isValidPassword: true,
        isValidCheckbox: true,
        allowUser: '',
        userType: '',
        phoneNumber: '',
        password: '',
        errorText: ''
    });

    const handleIndexChange = index => {

        setSelectedIndex(index);
    }

    const handleCheckboxChange = (val) => {

        if (!val) {
            setData({
                ...data,
                allowUser: val
            });
            setError({
                ...error,
                isValidCheckbox: false,
                allowUser: "You need to agree terms and conditions."
            })
        }
        else {
            setData({
                ...data,
                allowUser: val
            });
            setError({
                ...error,
                isValidCheckbox: true,
                allowUser: ""
            })
        }

    }


    const handleUserTypeChange = (val) => {
        if (val.trim().length === 0) {
            setError({
                ...error,
                isValidUserType: false,
                userType: 'Please select User Type'
            });
            setData({
                ...data,
                userType: val
            });
        }
        else {
            setError({
                ...error,
                isValidUserType: true,
                userType: ''
            });
            setData({
                ...data,
                userType: val
            });
        }

    }

    const handlePhoneNumberChange = (val) => {
        if (val.trim().length === 0) {
            setError({
                ...error,
                isValidPhoneNumber: false,
                phoneNumber: 'Enter Phone Number'
            });
            setData({
                ...data,
                phoneNumber: val
            })

        }
        else if (!myanmarPhoneNumber.isValidMMPhoneNumber(val)) {
            setError({
                ...error,
                isValidPhoneNumber: false,
                phoneNumber: 'Enter valid Phone Number'
            });
            setData({
                ...data,
                phoneNumber: val
            });
        }
        else {
            setError({
                ...error,
                isValidPhoneNumber: true,
                phoneNumber: ''
            });
            setData({
                ...data,
                phoneNumber: val
            })
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length === 0) {
            setError({
                ...error,
                isValidPassword: false,
                password: 'Enter your password'
            });
            setData({
                ...data,
                password: val
            });
        }
        else {
            setError({
                ...error,
                isValidPassword: true,
                password: ''
            });
            setData({
                ...data,
                password: val
            });
        }
    }

    const handleValidPhoneNumber = (val) => {
        if (val.trim().length === 0) {
            setError({
                ...error,
                isValidPhoneNumber: false,
                phoneNumber: 'Enter your Phone Number'
            });
        }
        else if (!myanmarPhoneNumber.isValidMMPhoneNumber(val)) {
            setError({
                ...error,
                isValidPhoneNumber: false,
                phoneNumber: 'Enter valid Phone Number'
            });
        }
        else {
            setError({
                ...error,
                isValidPhoneNumber: true,
                phoneNumber: ''
            });
        }
    }

    const handleValidPassword = (val) => {
        if (val.trim().length === 0) {
            setError({
                ...error,
                isValidPassword: false,
                password: 'Enter your password'
            });
        }
        else {
            setError({
                ...error,
                isValidPassword: true,
                password: ''

            })
        }
    }

    const handleLogin = (userType, phoneNumber, password, allowUser) => {
        setLoading(true);

        if (!allowUser) {
            setLoading(false);
            setError({
                ...error,
                isValidCheckbox: false,
                allowUser: 'You need to agree terms and conditions.'
            })
        }

        else if (userType.trim().length === 0) {
            setLoading(false);
            setError({
                ...error,
                isValidUserType: false,
                userType: 'Please Select User Type'
            });
        }
        else if (phoneNumber.trim().length === 0) {
            setLoading(false);
            setError({
                ...error,
                isValidPhoneNumber: false,
                phoneNumber: 'Enter your Phone Number'
            });
        }
        else if (!myanmarPhoneNumber.isValidMMPhoneNumber(phoneNumber)) {
            setLoading(false);
            setError({
                ...error,
                isValidPhoneNumber: false,
                phoneNumber: 'Enter valid Phone Number'
            });
        }
        else if (password.trim().length === 0) {
            setLoading(false);
            setError({
                ...error,
                isValidPassword: false,
                password: 'Enter your password'
            });
        }
        else {
            signIn(userType, phoneNumber, password, error, setError, setLoading);

        }

    }


    return (
        <KeyboardAwareScrollView enableOnAndroid>
            <View style={styles.signup_wrapper}>
                <View style={styles.tab_wrapper}>
                    <SegmentedControlTab
                        values={["English", 'မြန်မာ']}
                        selectedIndex={selectedIndex}
                        onTabPress={handleIndexChange}
                        tabStyle={styles.tabStyle}
                        activeTabStyle={styles.activeTabStyle}
                        tabTextStyle={styles.tabTextStyle}
                    />
                </View>

                <Center>
                    <Image style={styles.logo_image} source={Logo} alt="icon-image" size={'xl'} />

                    <View style={styles.form_container}>

                        <VStack alignItems="center" space={4}>
                            <Select
                                minWidth={350}
                                selectedValue={data.userType}
                                isInvalid={!error.isValidUserType}
                                accessibilityLabel="Select User Type"
                                placeholder="Select User Type"
                                placeholderTextColor='#36454F'
                                variant="underlined"
                                onValueChange={(value) => handleUserTypeChange(value)}
                                _selectedItem={{
                                    endIcon: <CheckIcon size={4} />,
                                }}
                            >
                                <Select.Item label="Farmer" value="Farmer" />
                                <Select.Item label="Middleman" value="Middleman" />
                            </Select>

                        </VStack>
                        {
                            !error.isValidUserType ? <Text style={styles.errorText}>{error.userType}</Text> : null
                        }

                        <Input
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor='#36454F'
                            isInvalid={!error.isValidPhoneNumber}
                            variant="underlined"
                            keyboardType="phone-pad"
                            onChangeText={(value) => handlePhoneNumberChange(value)}
                            onEndEditing={(e) => handleValidPhoneNumber(e.nativeEvent.text)}
                            _focus={{ borderColor: "#369154", marginLeft: "10px", marginRight: "10px" }}
                        />
                        {
                            !error.isValidPhoneNumber ? <Text style={styles.errorText}>{error.phoneNumber}</Text> : null
                        }

                        <Input
                            style={styles.input}
                            isInvalid={!error.isValidPassword}
                            placeholderTextColor='#36454F'
                            placeholder="Password"
                            variant="underlined"
                            secureTextEntry
                            onChangeText={(value) => handlePasswordChange(value)}
                            onEndEditing={(e) => handleValidPassword(e.nativeEvent.text)}
                            _focus={{ borderColor: "#369154", marginLeft: "10px", marignRight: "10px" }}
                        />
                        {
                            !error.isValidPassword ? <Text style={styles.errorText}>{error.password}</Text> : null
                        }


                        <View style={styles.checkbox_wrapper}>

                            <Checkbox
                                isInvalid={!error.isValidCheckbox}
                                isChecked={data.allowUser}
                                //value={data.allowUser}
                                style={styles.check_me}
                                size="sm"
                                colorScheme="green"
                                accessibilityLabel="hello"
                                onChange={(val) => handleCheckboxChange(val)}
                            >
                                <Text style={styles.check_text}>
                                    Allow to use and share personal data in app such as phone number and location.
                                </Text>
                            </Checkbox>
                            {
                                !error.isValidCheckbox ? <Text style={styles.errorText}>{error.allowUser}</Text> : null
                            }
                            {
                                error.errorText.length > 0 ? <Text style={styles.showErrorText}>{error.errorText}</Text> : null
                            }

                        </View>

                        <Button
                            isLoading={isLoading}
                            style={styles.button}
                            onPress={() => handleLogin(data.userType, data.phoneNumber, data.password, data.allowUser)}
                        >
                            Sign In
                        </Button>
                        <View style={styles.signup_link}>
                            <Text style={styles.btn_font}>
                                Don't have an account? <Text onPress={() => navigation.navigate('SignUp')} style={styles.signin_link}>Sign up here</Text>
                            </Text>
                        </View>


                    </View>

                </Center>
            </View>
        </KeyboardAwareScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'

    },
    signup_wrapper: {
        marginTop: 40,
        fontFamily: 'Roboto',

    },
    logo_image: {
        width: 180,
        height: 150,
        marginTop: 20
    },
    form_container: {
        marginTop: 35
    },
    button: {
        backgroundColor: '#369154',
        marginTop: 30,
        marginHorizontal: Platform.OS === 'android' ? 20 : 15
    },
    btn_font: {
        fontSize: 15,
        marginTop: 11,
        marginLeft: 8
    },
    signin_link: {
        fontFamily: 'Roboto-bold'
    },
    signup_link: {
        marginLeft: 20
    },
    input: {
        marginLeft: 10,
        marginRight: 10
    },
    checkbox_wrapper: {
        marginTop: 30,
        marginHorizontal: 20,

    },
    check_me: {
        fontSize: 5,
        marginLeft: Platform.OS === 'android' ? 4 : 0
    },
    check_text: {
        marginLeft: 11
    },
    errorText: {
        color: '#ff0000',
        fontSize: 13,
        marginLeft: 10,
        marginTop: 5
    },
    showErrorText: {
        color: '#ff0000',
        fontSize: 15,
        textAlign: 'right',
        marginTop: 10
    },
    tab_wrapper: {

        width: '60%',
        alignSelf: 'center',
        // position:'absolute',


    },
    tabStyle: {
        borderColor: '#369154',

    },
    activeTabStyle: {
        backgroundColor: '#369154',
        borderColor: '#369154'
    },
    tabTextStyle: {
        color: '#369154'
    }



})


export default SigninScreen;