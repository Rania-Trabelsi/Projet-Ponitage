import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {url} from '../url';

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [Pointages, setPointages] = useState([]);

  useEffect(() => {
    getAllPointages();
  }, []);

  const getAllPointages = async () => {
    try {
      let result = await (await axios.get(`${url}/pointages/`)).data;
      setPointages(result);
    } catch (error) {
      console.log(error);
    }
  };
  const pointages = [
    {
      pointageId: '1',
      type: 'Entree',
      user: {
        username: 'John',
      },
      date: '2023-05-18T16:03:05.881+00:00',
    },
    {
      pointageId: '2',
      type: 'Sortie',
      user: {
        username: 'Jane',
      },
      date: '2023-05-18T18:30:00.000+00:00',
    },
    {
      pointageId: '3',
      type: 'Entree',
      user: {
        username: 'John',
      },
      date: '2023-05-19T09:15:00.000+00:00',
    },
  ];

  const handleDateSelect = date => {
    setSelectedDate(date.dateString);
  };

  const handleResetDate = () => {
    setSelectedDate('');
  };

  const filteredPointages = selectedDate
    ? Pointages.filter(pointage => pointage.date.includes(selectedDate))
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
          {filteredPointages.map(pointage => (
            <Text key={pointage.pointageId} style={styles.pointageItem}>
              User: {pointage.user.username} | Type: {pointage.type} |{' '}
              {pointage.date.slice(11, 19)} | {pointage.site.name}
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

export default AdminDashboard;
