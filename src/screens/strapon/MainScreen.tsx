import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, FlatList, Text} from 'react-native';
import {Colors, NavigateTo} from '../../constants';
import {CustomButton} from '../../components/core';
import Tile from '../../components/TileComponent';
import {localStorage} from '../../helpers';

const MainScreen = (props: any) => {
  const navigation = props.navigation;

  const [data, setData] = useState([]);

  const getItem = useCallback(async () => {
    const getData: any = await localStorage.getItem('value1');
    const storedData = JSON.parse(getData);
    if (storedData != null || storedData != undefined) {
      setData(storedData);
    } else {
      console.log('no data');
      setData([]);
    }
  }, []);

  useEffect(() => {
    getItem();
  }, [getItem]);

  useEffect(() => {
    getItem();
    const focusListener = navigation.addListener('focus', getItem);
    return () => {
      focusListener();
    };
  }, [getItem, navigation]);

  const renderItem = ({item}: {item: any}) => {
    return (
      <Tile
        item={item}
        onDelete={async id => {
          const updatedData = data.filter((item: any) => item.Id !== id);
          setData(updatedData);
          localStorage.setItem('value1', JSON.stringify(updatedData));
        }}
        onEdit={() => {
          navigation.navigate(NavigateTo.AddEditScreen, {
            mode: 'edit',
            uniqueID: item.Id,
            dataItem: item,
          });
        }}
      />
    );
  };

  return (
    <View style={styles.contentContainerStyle}>
      <View
        style={{
          marginBottom: 100,
          marginTop: 20,
        }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  No data to show
                </Text>
              </View>
            );
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
        }}>
        <CustomButton
          title="Add"
          style={{borderRadius: 50}}
          onPress={() => {
            navigation.navigate(NavigateTo.AddEditScreen, {
              mode: 'add',
            });
          }}
          class="primary"
          type="normal"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default MainScreen;
