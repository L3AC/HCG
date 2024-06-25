// SimpleAlert.js
import React, { useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SimpleAlert = ({ isVisible, type, text, timer, onClose }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      if (timer) {
        const timeout = setTimeout(() => {
          hideAlert();
        }, timer);
        return () => clearTimeout(timeout);
      }
    } else {
      hideAlert();
    }
  }, [isVisible, timer]);

  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  let title, iconName, iconColor;

  switch (type) {
    case 'success':
      title = 'Éxito';
      iconName = 'check-circle';
      iconColor = 'green';
      break;
    case 'error':
      title = 'Error';
      iconName = 'times-circle';
      iconColor = 'red';
      break;
    case 'warning':
      title = 'Advertencia';
      iconName = 'exclamation-circle';
      iconColor = 'orange';
      break;
    case 'info':
      title = 'Aviso';
      iconName = 'info-circle';
      iconColor = 'blue';
      break;
    default:
      title = 'Aviso';
      iconName = 'info-circle';
      iconColor = 'blue';
  }

  return (
    isVisible && (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: translateY }], opacity: opacity },
        ]}
      >
        <Icon name={iconName} size={40} color={iconColor} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
        <Button title="Aceptar" onPress={hideAlert} />
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SimpleAlert;