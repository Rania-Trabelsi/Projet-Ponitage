import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useNavigation, useRoute} from '@react-navigation/native';
import User from './Employé/User';
import {url} from './url';

const QRCodeScanner = ({params}) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState('');
  const [user, setUser] = useState({});
  const [Entreprise, setEntreprise] = useState({});
  const [Entreprises, setEntreprises] = useState([]);
  const [Sites, setSites] = useState([]);
  const [Site, setSite] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  console.log(route.params.type);

  const currentUser = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const decoded = jwtDecode(token);
    console.log(decoded);

    try {
      let currentUser = await axios.get(`${url}/users/${decoded.id}`);
      setUser(currentUser.data);
      console.log(currentUser.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      setLocation(`${info.coords.latitude},${info.coords.longitude}`);
      console.log(location);
    });
    currentUser();
    getAllEntreprise();
    getAllSites();
  }, []);

  const getAllSites = async () => {
    try {
      let result = await (await axios.get('`${url}/sites/')).data;
      setSites(result);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllEntreprise = async () => {
    try {
      let result = await (await axios.get(`${url}/entreprise`)).data;
      setEntreprises(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getSite = async id => {
    try {
      let result = await (await axios.get(`${url}/sites/${id}`)).data;
      setSite(result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleBarCodeRead = ({data}) => {
    setScanning(false);
    setResult(data);
    sendPointage(data);
  };

  const sendPointage = async data => {
    console.log(data);
    getAllEntreprise();
    getAllSites();
    let siteIdFromQRCode = data.split('/')[0];
    let type = data.split('/')[1];
    console.log(Entreprises);
    console.log(Sites);
    let SelectedEntreprise = {
      ...Entreprises.find(e => e.entrepriseId == user.entreprise.entrepriseId),
    };

    console.log(SelectedEntreprise);
    //setEntreprise(SelectedEntreprise);
    console.log(SelectedEntreprise.sites);
    let isAuth = SelectedEntreprise.sites.findIndex(e =>
      e.includes(siteIdFromQRCode),
    );

    console.log(isAuth);
    console.log(user.entreprise.sites);
    if (isAuth === -1) {
      console.log('you are not allowed');
      return null;
    }
    let siteIndex = Sites.findIndex(e => e.siteId == siteIdFromQRCode);
    let selectedSite = Sites[siteIndex];
    console.log(selectedSite);
    if (type !== route.params.type) {
      console.log('you are not allowed by type');
      return null;
    }
    let latitude = selectedSite.localisation.split(',')[0];
    let longitude = selectedSite.localisation.split(',')[1];
    console.log(latitude, longitude);
    console.log(location);
    if (!location.includes(latitude) || !location.includes(longitude)) {
      console.log('you are not allowed by location');
      return null;
    }

    let pointage = {
      type: route.params.type,
      localisation: selectedSite.localisation,
      user: user,
      site: selectedSite,
    };

    const token = await AsyncStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
      await axios.post('`${url}/pointages', pointage);
      console.log('success');
    } catch (error) {
      console.log('failed: ', error);
    }
  };

  const handleScan = () => {
    setScanning(true);
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        onBarCodeRead={scanning ? handleBarCodeRead : null}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      />
      <View style={styles.result}>
        {result && <Text>{result}</Text>}
        {!result && (
          <Text onPress={handleScan}>
            {!scanning ? 'Tap to scan QR code' : 'Scanning...'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  result: {
    position: 'absolute',
    bottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default QRCodeScanner;
