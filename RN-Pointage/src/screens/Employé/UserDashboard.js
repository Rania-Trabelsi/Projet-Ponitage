import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {Use} from 'react-native-svg';
import {url} from '../url';

const UserDashboard = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [Pointages, setPointages] = useState([]);
  const [User, setUser] = useState({});
  const [UserID, setUserID] = useState('');

  useEffect(() => {
    getAllPointages();
    currentUser();
  }, []);

  const getAllPointages = async () => {
    try {
      let result = await (await axios.get(`${url}/pointages/`)).data;
      setPointages(result);
      console.log(Pointages);
    } catch (error) {
      console.log(error);
    }
  };
  const currentUser = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const decoded = jwtDecode(token);
    console.log(decoded);
    setUserID(decoded.id);

    try {
      let currentUser = await axios.get(`${url}/users/${decoded.id}`);
      setUser(currentUser.data);
      console.log(currentUser.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateSelect = date => {
    setSelectedDate(date.dateString);
  };

  const handleResetDate = () => {
    setSelectedDate('');
  };

  const filteredPointages = selectedDate
    ? Pointages.filter(e => e.date.includes(selectedDate))
    : Pointages;

  // Custom style for selected day
  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#81B7AE',
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pointages</Text>
        {selectedDate && (
          <TouchableOpacity
            onPress={handleResetDate}
            style={styles.resetButton}>
            <Text style={styles.resetButtonText}>All</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          style={styles.calendar}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#000000',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e',
          }}
          markedDates={markedDates} // Add marked dates for custom styles
        />
        <Text style={styles.selectedDate}>{selectedDate}</Text>
        <View style={styles.pointagesContainer}>
          {filteredPointages &&
            filteredPointages
              .filter(e => e.user.id == UserID)
              .map(({pointageId, date, user: {username}, type}) => (
                <Text key={pointageId} style={styles.pointageItem}>
                  User: {username} | Type: {type} | {date.slice(11, 19)}
                </Text>
              ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#81B7AE',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  resetButton: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  calendar: {
    width: '100%',
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pointagesContainer: {
    width: '80%',
  },
  pointageItem: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
  },
  dayContainer: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDay: {
    backgroundColor: 'lightblue',
    borderRadius: 50,
  },
});

export default UserDashboard;
