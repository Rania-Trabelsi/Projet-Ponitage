import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  LoginScreen,
  AdminScreen,
  UserScreen,
  AdminDashboardScreen,
  ManagerScreen,
  ManagerDashboardScreen,
  QRCodeScannerScreen,
  QRCodeGeneratorScreen,
  EmployerListScreen,
  SiteListScreen,
  ManagerListScreen,
  SiteManagerScreen,
  UserDashboardScreen,
} from './src/screens';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        initialRouteName: 'Login',
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Manager" component={Manager} />
      <Stack.Screen
        name="QRCodeScanner"
        component={QRCodeScannerScreen}
        type=""
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function User() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Settings') {
            iconName = 'line-chart';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#70A4A7',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={UserScreen}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Settings"
        component={UserDashboardScreen}
        options={{tabBarLabel: () => null}}
      />
    </Tab.Navigator>
  );
}

function Admin() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Settings') {
            iconName = 'qrcode';
          } else if (route.name === 'Dashbord') {
            iconName = 'line-chart';
          } else if (route.name === 'Employes') {
            iconName = 'users';
          } else if (route.name === 'Enterprise') {
            iconName = 'building-o';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#70A4A7',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={AdminScreen}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Settings"
        component={QRCodeGeneratorScreen}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Dashbord"
        component={AdminDashboardScreen}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Employes"
        component={EmployerListScreen}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Enterprise"
        component={SiteListScreen}
        options={{tabBarLabel: () => null}}
      />
    </Tab.Navigator>
  );
}

function Manager() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Settings') {
            iconName = 'th-list';
          } else if (route.name === 'Dashbord') {
            iconName = 'line-chart';
          } else if (route.name === 'Employes') {
            iconName = 'users';
          } else if (route.name === 'Enterprise') {
            iconName = 'building-o';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#70A4A7',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={ManagerScreen}
        options={{tabBarLabel: () => null}}
      />
      
      <Tab.Screen
        name="Dashbord"
        component={ManagerDashboardScreen}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Employes"
        component={ManagerListScreen}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Enterprise"
        component={SiteManagerScreen}
        options={{tabBarLabel: () => null}}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;
