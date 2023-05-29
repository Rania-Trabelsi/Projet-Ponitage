import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {Picker} from '@react-native-picker/picker';
import {SlideFromRightIOS} from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {url} from '../url';
import Icon from 'react-native-vector-icons/AntDesign';

const SiteList = () => {
  const [employers, setEmployers] = useState([]);
  const [Sites, setSites] = useState([]);
  const [Entreprises, setEntreprises] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formLocation, setFormLocation] = useState('');
  const [formResponsable, setResponsable] = useState('');
  const [formName, setFormName] = useState('');
  const [CurrentUser, setCurrentUser] = useState({});
  const [location, setLocation] = useState('');
  const [selectedSite, setSelectedSite] = useState(null);
  const [Isedit, setIsedit] = useState(false);

  useEffect(() => {
    getAllUsers();
    getAllEntreprise();
    getAllSites();
    getCurrentUser();

    Geolocation.getCurrentPosition(info => {
      // store or send the location data
      setLocation(
        `${String(info.coords.latitude).slice(0, 8)},${String(
          info.coords.longitude,
        ).slice(0, 10)}`,
      );
    });
  }, [Sites]);
  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const decoded = jwtDecode(token);

    try {
      let currentUser = await axios.get(`${url}/users/${decoded.id}`);
      setCurrentUser(currentUser.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSite = async id => {
    try {
      await axios.delete(`${url}/sites/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
    try {
      let result = await (await axios.get(`${url}/users/`)).data;
      setEmployers(result.filter(e => e.roles[0].name === 'ROLE_MODERATOR'));
    } catch (error) {
      console.log(error);
    }
  };
  const getAllSites = async () => {
    try {
      let result = await (await axios.get(`${url}/sites/`)).data;
      setSites(result);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllEntreprise = async () => {
    try {
      let result = await (await axios.get(`${url}/entreprise/`)).data;
      setEntreprises(result);
    } catch (error) {
      console.log(error);
    }
  };
  const addSite = async site => {
    try {
      const response = await axios.post(`${url}/sites`, site);
      console.log(response);
      const newSite = {siteId: response.data.siteId};
      console.log('site Id =', newSite.siteId);
      addSiteUser(newSite.siteId, formResponsable);
      UpdateUser({...formResponsable, site: newSite.siteId});

      addSitetoEntreprise(CurrentUser.entreprise.entrepriseId, newSite.siteId);
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status == 400) {
        Alert.alert("Message d'erreur", 'localisation existe deja !');
      } else {
        Alert.alert('Error');
      }
    }
  };
  const addSiteUser = async (siteId, user) => {
    try {
      const response = await axios.post(`${url}/sites/${siteId}/users`, user);
      console.log(response.data);
    } catch (error) {
      if (error.response.status == 415) {
        Alert.alert("Message d'erreur", 'responsable indefini !');
      } else {
        Alert.alert('Error');
      }
    }
  };
  const addSitetoEntreprise = async (entrepriseId, site) => {
    try {
      const response = await axios.post(
        `${url}/entreprise/${entrepriseId}/sites`,
        site,
      );
      console.log('Site added:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding site:', error);
      throw error;
    }
  };
  const updateSite = async site => {
    try {
      await axios.put(`${url}/sites`, site);
      UpdateUser({...formResponsable, site: site.siteId});
      addSiteUser(site.siteId, formResponsable);
    } catch (error) {
      console.log(error);
    }
  };
  const updateEntreprise = async entreprise => {
    try {
      await axios.put(`${url}/entreprise`, entreprise);
    } catch (error) {
      console.log(error);
    }
  };
  const UpdateUser = async user => {
    try {
      await axios.put(`${url}/users`, user);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditPress = site => {
    console.log(site);
    setSelectedSite(site);
    setResponsable(site.users[0]);
    setFormLocation(site.localisation);
    setFormName(site.name);
    setModalVisible(true);
    setIsedit(true);
  };

  //   const handleDeletePress = employer => {
  //     const updatedEmployers = employers.filter(e => e.id !== employer.id);
  //     setEmployers(updatedEmployers);
  //   };

  const handleAddPress = () => {
    setSelectedSite({});
    setResponsable('');
    setFormName('');
    setFormLocation(location);
    setModalVisible(true);
    setIsedit(false);
  };

  const handleFormSubmit = () => {
    if (Isedit) {
      const updatedSite = {
        ...selectedSite,
        name: formName,
        localisation: formLocation,
      };
      console.log(updatedSite);

      updateSite(updatedSite);
    } else {
      const newSite = {
        localisation: formLocation,
        name: formName,
      };
      addSite(newSite);
      console.log({...formResponsable, site: newSite});

      console.log(newSite);
      getAllSites();
    }
    setModalVisible(false);
  };

  const handleSiteChange = value => {
    setSelectedSite(value);
  };

  const getEmployersForSite = () => {
    if (selectedSite === 'All') {
      return employers;
    } else {
      return employers.filter(e => e.site === selectedSite);
    }
  };

  const deleteBtn = id => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer ce site ?', [
      {
        text: 'Annuler',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Confirmer', onPress: () => deleteSite(id)},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sites</Text>
      </View>

      {Sites.map(site => (
        <View key={site.siteId} style={styles.employerContainer}>
          <Text style={styles.employerName}>{site.name}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditPress(site)}>
            <Icon name="edit" size={25} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              deleteBtn(site.siteId);
              getAllSites();
            }}>
            <Icon name="delete" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          handleAddPress();
          console.log(selectedSite);
        }}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {Isedit ? 'Modifier site' : 'Ajouter site'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Localisation du site"
            value={formLocation}
            onChangeText={setFormLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom du site"
            value={formName}
            onChangeText={setFormName}
          />
          <Dropdown
            data={employers}
            maxHeight={300}
            labelField="username"
            valueField={formResponsable}
            placeholder={'Responsable du site'}
            value={formResponsable}
            onChange={item => {
              delete item._index;
              setResponsable(item);

              console.log(item);
            }}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleFormSubmit}>
            <Text style={styles.buttonText}>Confirmer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#81B7AE',
    width: '115%',
    left: -20,
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: 200,
  },
  employerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingVertical: 10,
    marginBottom: 10,
  },
  employerName: {
    flex: 1,
    fontSize: 18,
  },
  employerrole: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 800,
  },
  addButton: {
    backgroundColor: '#84C5BA',
    position: 'absolute',
    bottom: 40,
    right: 40,
    borderRadius: 50,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default SiteList;
