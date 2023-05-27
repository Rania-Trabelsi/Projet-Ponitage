import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Animated,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {url} from './url';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logoAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const login = user => async () => {
    try {
      let userdata = await axios.post(`${url}/api/auth/signin`, {
        username: user.username,
        password: user.password,
      });
      console.log(userdata.data.roles[0]);
      Geolocation.getCurrentPosition(info => {
        // store or send the location data
        console.log(`${info.coords.latitude},${info.coords.longitude}`);
      });
      // Save token to local storage
      await AsyncStorage.setItem('accessToken', userdata.data.accessToken);
      handleLogin(userdata.data.roles[0]);
    } catch (error) {
      Alert.alert(
        "Message d'erreur",
        'Identifiant ou mot de passe invalide ! Veuillez réessayer.',
        [
          {
            text: 'Annuler',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
      );
      console.log('here', error);
      console.log('here', error.response.data);
    }
  };

  const handleLogin = role => {
    if (role === 'ROLE_USER') {
      navigation.navigate('User');
    } else if (role === 'ROLE_ADMIN') {
      navigation.navigate('Admin');
    } else if (role === 'ROLE_MODERATOR') {
      navigation.navigate('Manager');
    } else {
      Alert.alert(
        "Message d'erreur",
        'Identifiant ou mot de passe invalide ! Veuillez réessayer.',
      );
      console.log(role);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hello}>Bienvenue !</Text>

      <Animated.Image
        source={require('../assets/images/entrence.png')}
        style={[styles.logo, {opacity: logoAnim}]}
      />
      <TextInput
        style={styles.input}
        placeholder="Identifiant"
        autoCapitalize="none"
        onChangeText={text => setUser({...user, username: text})}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry={showPassword}
        onChangeText={text => setUser({...user, password: text})}
        required
      />

      <TouchableOpacity
        style={styles.eyeIconContainer}
        onPress={() => setShowPassword(!showPassword)}>
        <Icon
          style={styles.eyeIcon}
          name={showPassword ? 'eye' : 'eye-slash'}
          size={10}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={login(user)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>s'identifier</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  hello: {
    fontWeight: '900',
    fontSize: 23,
    color: 'black',
    opacity: 0.75,
    fontFamily: 'Poppins-Medium',
  },
  logo: {
    width: 187.52,
    height: 163,
    marginVertical: 20,
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 40,
    top: 40,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    fontFamily: 'Poppins-Regular',
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
    fontSize: 13,
    paddingLeft: 30,
  },
  buttonContainer: {
    width: '80%',
    height: 50,
    marginTop: 20,
    marginBottom: 200,
    backgroundColor: '#81B7AEB2',
    top: 40,
    borderRadius: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  eyeIconContainer: {
    right: -105,
    top: -5,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#888',
  },
});

export default Login;
