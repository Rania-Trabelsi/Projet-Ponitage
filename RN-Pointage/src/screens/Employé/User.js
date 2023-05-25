import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {url} from '../url';
import IconF from 'react-native-vector-icons/Feather';

const User = () => {
  const [isOpen, setIsOpen] = useState(false); // state variable to keep track of whether the bar is open
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const translateY = useRef(new Animated.Value(0)).current;

  const currentUser = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const decoded = jwtDecode(token);
    console.log(decoded);

    try {
      let currentUser = await axios.get(`${url}/users/${decoded.id}`);
      setUser(currentUser.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    currentUser();
  }, []);

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(translateY, {
        toValue: -10,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(animation).start();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/Subtract.png')}
        style={styles.box}>
        <Image
          style={styles.image}
          source={require('../../assets/images/user.svg')}
        />
        <View style={styles.textContent}>
          <Text style={styles.text}>
            Bonjour, <Text style={styles.bold}>{user.username}!</Text>
          </Text>
          <Text style={styles.role}>Utilisateur</Text>
        </View>
        <Animated.Image
          style={[styles.fingerprint, {transform: [{translateY}]}]}
          source={require('../../assets/images/fingerprint.png')}
        />
      </ImageBackground>
      <View style={styles.homeContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('QRCodeScanner', {type: 'Entree'})
          }>
          <ImageBackground
            style={styles.home}
            source={require('../../assets/images/Entrée.png')}></ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('QRCodeScanner', {type: 'Sortie'})
          }>
          <ImageBackground
            style={styles.home}
            source={require('../../assets/images/Sortie.png')}></ImageBackground>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.logout}
        onPress={() => navigation.navigate('Login')}>
        <IconF name="log-out" color="#81B7AE" size={35} />
      </TouchableOpacity>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {justifyContent: 'center', alignItems: 'center', padding: 10},
  box: {
    width: 354.15,
    height: 189.11,
    top: 50.26,
    shadowColor: '#000',
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 50,
  },
  image: {width: 40, height: 40, resizeMode: 'contain'},
  textContent: {marginLeft: 20},
  text: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 25,
    letterSpacing: 0.06,
    color: '#FFFFFF',
  },
  bold: {color: '#70A4A7'},
  role: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.06,
    color: '#000000',
  },
  fingerprint: {
    position: 'absolute',
    bottom: -20,
    right: 85,
  },
  Avatar: {},
  userBox: {
    flexDirection: 'row',
    top: 50,
    width: '80%',
    alignItems: 'center',
  },
  hello: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.06,
    color: '#6C757D',
  },
  userName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.06,
    color: '#000000',
    opacity: 0.75,
  },
  userRole: {
    position: 'absolute',
    bottom: -65,
    left: -125,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: 0.06,
    color: '#000000',
  },
  userInfo: {left: 20},
  homeContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-evenly',
    top: 120,
  },
  home: {
    width: 150,
    height: 190,
    borderRadius: 10,
  },
  homeImage: {},
  homeText: {
    textAlign: 'center',
  },
  barButton: {
    backgroundColor: '#E9ECEF',
    borderRadius: 10,
    height: 50,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  barButtonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 17,
    letterSpacing: 0.06,
    color: 'rgba(0, 0, 0, 0.7)',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 4,
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(129, 183, 174, 0.7)',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    padding: 5,
    paddingBottom: 20,
    alignItems: 'center',
  },
  up: {
    width: '100%',
    height: 30,
    alignItems: 'center',
  },
  logout: {
    position: 'absolute',
    bottom: -200,
    right: 15,
    padding: 20,
    borderRadius: 10,
  },
  logoutText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 25,
    letterSpacing: 0.06,
    color: '#FFFFFF',
  },
});
