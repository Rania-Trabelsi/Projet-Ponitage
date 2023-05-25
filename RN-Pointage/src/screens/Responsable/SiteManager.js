import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
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
import {url} from '../url';
import Icon from 'react-native-vector-icons/AntDesign';
const SiteManager = () => {
  const [employers, setEmployers] = useState([]);
  const [Sites, setSites] = useState([]);
  const [Entreprises, setEntreprises] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formLocation, setFormLocation] = useState('');
  const [formResponsable, setResponsable] = useState('');
  const [formName, setFormName] = useState('');
  const [CurrentUser, setCurrentUser] = useState({});
  const [SiteID, setSiteID] = useState('');

  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    getAllUsers();
    getCurrentSite();
    getAllSites();
    getCurrentUser();
  }, [Sites]);

  const getCurrentSite = async () => {
    try {
      let result = await axios.get(`${url}/sites/${CurrentUser.site}`);
      setSelectedSite(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const decoded = jwtDecode(token);

    try {
      let currentUser = await axios.get(`${url}/users/${decoded.id}`);
      setCurrentUser(currentUser.data);
      setSiteID(currentUser.data.site.siteId);
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
      setEmployers(result);
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
      await axios.post(`${url}/sites`, site);
    } catch (error) {
      console.log(error);
    }
  };
  const updateSite = async site => {
    try {
      await axios.put(`${url}/sites`, site);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditPress = () => {
    setFormLocation(selectedSite.localisation);
    setFormName(selectedSite.name);
    setModalVisible(true);
  };

  //   const handleDeletePress = employer => {
  //     const updatedEmployers = employers.filter(e => e.id !== employer.id);
  //     setEmployers(updatedEmployers);
  //   };

  const handleAddPress = () => {
    setResponsable('');
    setFormName('');
    setFormLocation('');
    setModalVisible(true);
  };

  const handleFormSubmit = () => {
    if (selectedSite) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Site</Text>
      </View>
      {Sites.filter(e => e.siteId === CurrentUser.site).map(site => (
        <View key={site.siteId} style={styles.employerContainer}>
          <View style={styles.labelBox}>
            <Text style={styles.employerName}>Nom du site</Text>
            <Text style={styles.employerName}>{site.name}</Text>
          </View>
          <View style={styles.labelBox}>
            <Text style={styles.employerName}>localisation</Text>
            <Text style={styles.employerName}>{site.localisation}</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleEditPress}>
        <Icon name="edit" size={25} color="#fff" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {selectedSite ? 'Modifier site' : 'Ajouter site'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="localisation du site"
            value={formLocation}
            onChangeText={setFormLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="nom du site"
            value={formName}
            onChangeText={setFormName}
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
  labelBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  employerContainer: {
    alignItems: 'center',
    height: 100,
    justifyContent: 'space-around',
  },
  employerName: {
    fontSize: 18,
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

export default SiteManager;
