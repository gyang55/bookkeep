
import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';

interface HeaderProps {
  title: string;
}


const Header: React.FC<HeaderProps> = ({ title }) => {

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: '#4a86e8',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Header;
