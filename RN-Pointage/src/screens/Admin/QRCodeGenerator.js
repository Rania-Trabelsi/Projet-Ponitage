import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {RadioButton} from 'react-native-paper';
import {url} from '../url';
// const data = [
//   {label: 'Data 1', value: 'data1'},
//   {label: 'Data 2', value: 'data2'},
//   {label: 'Data 3', value: 'data3'},
// ];

const QRCodeGenerator = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('data');
  const [qrData, setQRData] = useState('data');
  const [site, setSite] = useState([]);
  const [radioValue, setRadioValue] = useState('Entree');

  const handleGenerateQRCode = () => {
    setQRData(`${selectedValue}/${radioValue}`);
    console.log(qrData);
    setModalVisible(false);
  };

  const getAllSites = async () => {
    try {
      let data = await axios.get(`${url}/sites`);
      setSite(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllSites();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => setSelectedValue(item.siteId)}
      style={[
        styles.item,
        selectedValue === item.siteId && styles.selectedItem,
      ]}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.qrCodeContainer}>
        <QRCode value={qrData} size={300} />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Select Data</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={site}
            renderItem={renderItem}
            keyExtractor={item => item.siteId}
            extraData={selectedValue}
            contentContainerStyle={styles.modalContentContainer}
          />
          <View style={styles.radioGroup}>
            <RadioButton.Group
              onValueChange={value => setRadioValue(value)}
              value={radioValue}>
              <View style={styles.radioItem}>
                <RadioButton value="Entree" />
                <Text style={styles.radioLabel}>Enteree</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="Sortie" />
                <Text style={styles.radioLabel}>Soritie</Text>
              </View>
            </RadioButton.Group>
          </View>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleGenerateQRCode}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const {height} = Dimensions.get('window');
const modalHeight = height * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeContainer: {
    marginTop: 50,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: modalHeight,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    width: 200,
    margin: 10,
    textAlign: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: '#81B7AEB2',
  },
  doneButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#81B7AE',
    borderRadius: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default QRCodeGenerator;
