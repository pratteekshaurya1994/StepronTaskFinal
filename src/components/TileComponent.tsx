import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {Colors} from '../constants';

export interface TileComponentProps {
  item?: any;
  onDelete?: (e: any) => void;
  onEdit?: () => void;
}

const TileComponent = (props: TileComponentProps) => {
  const {item, onDelete, onEdit} = props;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.Id);
    }
  };

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <Image source={{uri: item.photo}} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.dateOfBirth}>
          Date of Birth: {item.dateOfBirth}
        </Text>
        <Text style={styles.maritalStatus}>
          {item.married ? 'Married' : 'Single'}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={onEdit}
          style={[
            styles.buttonStyle,
            {
              backgroundColor: Colors.primary,
            },
          ]}>
          <Text style={styles.deleteButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={[
            styles.buttonStyle,
            {
              backgroundColor: Colors.warn,
            },
          ]}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dateOfBirth: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  maritalStatus: {
    fontSize: 16,
    color: '#666',
  },
  buttonStyle: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default TileComponent;
