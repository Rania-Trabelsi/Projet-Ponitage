import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import jwtDecode from 'jwt-decode';
import {url} from '../url';
import Icon from 'react-native-vector-icons/AntDesign';
const ManagerList = () => {
  const [employers, setEmployers] = useState([]);
  const [Sites, setSites] = useState([]);
  const [Entreprises, setEntreprises] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState('');
  const [formrole, setFormrole] = useState({});
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formEntreprise, setFormEntreprise] = useState('');
  const [formSite, setFormSite] = useState({});
  const [selectedSite, setSelectedSite] = useState('All');
  const [SelectedRole, setSelectedRole] = useState({});
  const [SelectedEntreprise, setSelectedEntreprise] = useState({});
  const [SelectedSiteModal, setSelectedSiteModal] = useState({});
  const [CurrentUser, setCurrentUser] = useState({});

  const Roles = [
    {id: '64453736b1a2b2c4884a2734', name: 'ROLE_ADMIN'},
    {id: '64453736b1a2b2c4884a2733', name: 'ROLE_MODERATOR'},
    {id: '64453736b1a2b2c4884a2732', name: 'ROLE_USER'},
  ];

  useEffect(() => {
    getCurrentUser();
    getAllUsers();
    getAllEntreprise();
    getAllSites();
  }, [employers]);
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

  const updateSite = async site => {
    try {
      await axios.put(`${url}/sites`, site);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async id => {
    try {
      await axios.delete(`${url}/users/${id}`);
      Sites.map(e =>
        updateSite({...e, users: e.users.filter(e => !e.id === id)}),
      );
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
  const addUser = async user => {
    try {
      let result = await axios.post(`${url}/api/auth/signup`, user);
      console.log(CurrentUser.site);
      addSiteUser(CurrentUser.site, result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addSiteUser = async (siteId, user) => {
    try {
      const response = await axios.post(`${url}/sites/${siteId}/users`, user);
    } catch (error) {
      console.error(error);
    }
  };
  const UpdateUser = async user => {
    try {
      await axios.put(`${url}/users`, user);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditPress = employer => {
    setSelectedEmployer(employer);
    setFormName(employer.username);
    setFormEmail(employer.email);
    setSelectedRole(employer.roles);
    setModalVisible(true);
  };

  const handleDeletePress = employer => {
    const updatedEmployers = employers.filter(e => e.id !== employer.id);
    setEmployers(updatedEmployers);
  };

  const handleAddPress = () => {
    setSelectedEmployer(null);
    setFormName('');
    setSelectedRole({});
    setFormEmail('');
    setFormPassword('');
    setModalVisible(true);
  };

  const handleFormSubmit = () => {
    if (selectedEmployer) {
      let updatedEmployer = {
        ...selectedEmployer,
        username: formName,
        roles: [{id: '64453736b1a2b2c4884a2732', name: 'ROLE_USER'}],
        email: formEmail,
      };

      UpdateUser(updatedEmployer);
    } else {
      const newEmployer = {
        username: formName,
        email: formEmail,
        password: formPassword,
        roles: ['ROLE_USER'],
        entrepriseId: '592637e5',
      };

      addUser(newEmployer);
      getAllUsers();
    }
    setModalVisible(false);
  };
  const deleteBtn = id => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer cet employé ?', [
      {
        text: 'Annuler',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Confirmer', onPress: () => deleteUser(id)},
    ]);
  };

  const handleSiteChange = value => {
    setSelectedSite(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employés</Text>
      </View>
      <ScrollView>
        {Sites.filter(site => site.siteId === CurrentUser.site).map(e =>
          e.users
            .filter(e => e.roles[0].name !== 'ROLE_ADMIN')
            .map(employer => (
              <View key={employer.id} style={styles.employerContainer}>
                <Text style={styles.employerName}>
                  {employer.username} -{' '}
                  {employer.roles[0].name === 'ROLE_MODERATOR'
                    ? 'Responsable du site'
                    : employer.roles[0].name === 'ROLE_ADMIN'
                    ? 'Administrateur'
                    : 'Employé'}
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPress(employer)}>
                  <Icon name="edit" size={25} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    deleteBtn(employer.id);
                    getAllUsers();
                  }}>
                  <Icon name="deleteuser" size={25} color="#fff" />
                </TouchableOpacity>
              </View>
            )),
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {selectedEmployer ? 'Modifier employé' : 'Ajouter employé'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Identifiant"
            value={formName}
            onChangeText={setFormName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formEmail}
            onChangeText={setFormEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={formPassword}
            onChangeText={setFormPassword}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleFormSubmit}>
            <Text style={styles.buttonText}>Confirmer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              setModalVisible(false);
              console.log(formrole);
              console.log(formEntreprise);
              console.log(formSite);
            }}>
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

export default ManagerList;
