import React from 'react';
import Admin from './Admin/Admin';
import Login from './Login';
import QRCodeScanner from './QRCodeScanner';
import SiteManager from './Responsable/SiteManager';
import User from './Employé/User';
import UserDashboard from './Employé/UserDashboard';
import EmployerList from './Admin/EmployerList';
import AdminDashboard from './Admin/AdminDashboard';
import QRCodeGenerator from './Admin/QRCodeGenerator';
import SiteList from './Admin/SiteList';
import Manager from './Responsable/Manager';
import ManagerDashboard from './Responsable/ManagerDashboard';
import ManagerList from './Responsable/ManagerList';

export const LoginScreen = () => <Login name="Login" />;
export const UserScreen = () => <User name="User" />;
export const AdminScreen = () => <Admin name="Admin" />;
export const ManagerScreen = () => <Manager name="Manager" />;
export const AdminDashboardScreen = () => <AdminDashboard name="Admin" />;
export const ManagerDashboardScreen = () => <ManagerDashboard name="Mnager" />;
export const QRCodeScannerScreen = () => (
  <QRCodeScanner name="QRCodeScanner" type="" />
);
export const QRCodeGeneratorScreen = () => (
  <QRCodeGenerator name="QRCodeGenerator" />
);
export const EmployerListScreen = () => <EmployerList name="EmployerList" />;
export const SiteListScreen = () => <SiteList name="SiteList" />;
export const ManagerListScreen = () => <ManagerList name="ManagerList" />;
export const SiteManagerScreen = () => <SiteManager name="SiteManager" />;
export const UserDashboardScreen = () => <UserDashboard name="UserDashboard" />;
