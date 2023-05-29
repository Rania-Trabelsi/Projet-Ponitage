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
import {url} from '../url';
import Icon from 'react-native-vector-icons/AntDesign';

const EmployerList = () => {
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
  const [selectedSite, setSelectedSite] = useState('all');
  const [SelectedRole, setSelectedRole] = useState({});
  const [SelectedEntreprise, setSelectedEntreprise] = useState({});
  const [SelectedSiteModal, setSelectedSiteModal] = useState({});
  const [newUserId, setnewUserId] = useState('');
  const [newToken, setnewToken] = useState('');

  const Roles = [
    {id: '64453736b1a2b2c4884a2734', name: 'ROLE_ADMIN', lable: 'Admin'},
    {
      id: '64453736b1a2b2c4884a2733',
      name: 'ROLE_MODERATOR',
      lable: 'Responsable',
    },
    {id: '64453736b1a2b2c4884a2732', name: 'ROLE_USER', lable: 'Employé'},
  ];

  useEffect(() => {
    getAllUsers();
    getAllEntreprise();
    getAllSites();
  }, [employers]);

  function incrementHex(hexString) {
    const lastChar = hexString.slice(-1);
    const nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
    return hexString.slice(0, -1) + nextChar;
  }

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
      let currentSiteId = getUserSite(selectedEmployer).siteId;
      deleteUserFromSite(id, currentSiteId);
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
      setSites([{name: 'Site', users: employers}, ...result]);
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
  const addUser = async user => {
    try {
      let result = await axios.post(`${url}/api/auth/signup`, user);
      addSiteUser(formSite.siteId, result.data);
    } catch (error) {
      Alert.alert("Message d'erreur", 'informations invalides !', [
        {
          text: 'Annuler',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    }
  };

  const addSiteUser = async (siteId, user) => {
    try {
      const response = await axios.post(`${url}/sites/${siteId}/users`, user);
      console.log(response.data);
    } catch (error) {
      Alert.alert(
        formrole.name !== 'ROLE_MODERATOR'
          ? "Message d'erreur"
          : 'Renseignement',
        formrole.name !== 'ROLE_MODERATOR'
          ? 'site indefini !'
          : 'Veuillez créer un site.',
      );
    }
  };

  const UpdateUser = async user => {
    try {
      await axios.put(`${url}/users`, user);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUserFromSite = async (userId, siteId) => {
    try {
      await axios.delete(`${url}/sites/${siteId}/users/${userId}`);
      console.log('deleted');
    } catch (error) {
      console.log('password', error);
    }
  };

  const handleEditPress = employer => {
    setSelectedEmployer(employer);
    setFormName(employer.username);
    setFormEmail(employer.email);
    setFormrole(...employer.roles);
    setFormSite(getUserSite(employer));
    setFormEntreprise(employer.entreprise);
    setFormPassword('');
    setModalVisible(true);
  };

  const handleDeletePress = employer => {
    const updatedEmployers = employers.filter(e => e.id !== employer.id);
    setEmployers(updatedEmployers);
  };

  const handleAddPress = () => {
    setSelectedEmployer(null);
    setFormName('');
    setFormrole({});
    setFormSite({});
    setFormEntreprise({});
    setFormEmail('');
    setFormPassword('');
    setModalVisible(true);
  };

  const getUserSite = user => {
    let result = Sites.filter(
      (e, i) => e.users.find(el => el.id == user.id) && i != 0,
    )[0];

    return result ? result : {users: []};
  };

  const updatePassword = async (id, newPassword) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'text/plain',
        },
      };
      await axios.put(
        `${url}/users/${id}/change-password`,
        newPassword,
        config,
      );
      console.log('changed', newPassword);
    } catch (error) {
      console.log('password', error);
    }
  };

  const handleFormSubmit = () => {
    if (selectedEmployer) {
      let updatedEmployer = {
        ...selectedEmployer,
        username: formName,
        roles: [formrole],
        email: formEmail,
      };
      console.log(formrole);
      console.log('update', updatedEmployer);
      console.log(formSite);
      UpdateUser(updatedEmployer);
      if (formPassword !== '') {
        updatePassword(selectedEmployer.id, formPassword);
      }

      console.log('site', getUserSite(selectedEmployer));
      let currentSiteId = getUserSite(selectedEmployer).siteId;
      if (formSite.users.findIndex(e => e.id == selectedEmployer.id) == -1) {
        addSiteUser(formSite.siteId, selectedEmployer);
        deleteUserFromSite(selectedEmployer.id, currentSiteId);
      }
    } else {
      const newEmployer = {
        username: formName,
        email: formEmail,
        password: formPassword,
        roles: [formrole.name],
        entrepriseId: '592637e5',
      };
      addUser(newEmployer);
      getAllUsers();
    }
    setModalVisible(false);
  };

  const handleSiteChange = value => {
    setSelectedSite(value);
    console.log(value);
  };

  const getEmployersForSite = () => {
    if (selectedSite === 'all') {
      return employers;
    } else {
      return selectedSite.users;
    }
  };
  const deleteBtn = user => {
    setSelectedEmployer(user);
    Alert.alert('Supprimer', 'Voulez-vous supprimer cet employé ?', [
      {
        text: 'Annuler',
        onPress: () => console.log(getUserSite(selectedEmployer).siteId),
        style: 'cancel',
      },
      {text: 'Confirmer', onPress: () => deleteUser(user.id)},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employés</Text>
      </View>
      <ScrollView style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrer par site:</Text>
        <Picker
          selectedValue={selectedSite}
          onValueChange={handleSiteChange}
          style={styles.picker}>
          <Picker.Item label="choisir le site" value="all" />
          {Sites.map((site, index) => (
            <Picker.Item label={site.name} value={site} key={index} />
          ))}
        </Picker>
        {getEmployersForSite().map(employer => (
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
                deleteBtn(employer);
              }}>
              <Icon name="deleteuser" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <Text style={styles.addButtonText}>Ajouter</Text>
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
            placeholder={
              selectedEmployer ? 'Nouveau Mot de Pass' : 'Mot de passe'
            }
            secureTextEntry
            value={formPassword}
            onChangeText={setFormPassword}
          />

          <Dropdown
            data={Roles}
            maxHeight={300}
            labelField="lable"
            valueField={formrole}
            placeholder={'Rôle'}
            value={formrole}
            onChange={item => {
              delete item._index;
              delete item.lable;
              setFormrole(item);

              console.log(item);
            }}
          />

          {formrole.name !== 'ROLE_MODERATOR' ? (
            <Dropdown
              data={Sites}
              maxHeight={300}
              labelField="name"
              valueField={SelectedSiteModal}
              placeholder={'Selectionner le site'}
              value={SelectedSiteModal}
              onChange={item => {
                delete item._index;
                setFormSite(item);

                console.log(item);
              }}
            />
          ) : null}
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
    width: '100%',
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    flex: 1,
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
    color: '#fff',
    fontSize: 20,
    fontWeight: 800,
  },
  addButton: {
    position: 'absolute',
    top: 120,
    right: 18,
    borderRadius: 10,
    paddingVertical: 0.75,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#81B7AE',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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

export default EmployerList;
