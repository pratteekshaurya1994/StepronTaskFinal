import React, {useCallback, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  Platform,
} from 'react-native';
import {Colors, FontConfig, ImageConfig} from '../constants';
import {CommonFunctions, ToastAlert} from '../helpers';
import {launchImageLibrary} from 'react-native-image-picker';
import LabelComponent from './core/LabelComponent';
export interface ProfileAvatarComponentProps {
  labelText?: string;
  imgUrl: any;
  onChange: (value: any) => void;
  hasError?: boolean;
}

const options = {
  title: 'photoUpload',
  takePhotoButtonTitle: 'photoTake',
  chooseFromLibraryButtonTitle: 'photoLibrary',
  cancelButtonTitle: 'cancel',
  quality: 0.7,
  base64: true,
  maxWidth: 728,
};

const ProfileAvatarComponent = (props: ProfileAvatarComponentProps) => {
  const {imgUrl, onChange, labelText, hasError} = props;
  const [imgUploaded, setImgUploaded] = useState<boolean>(false);
  const [pickerModalVisible, setPickerModalVisible] = useState<boolean>(false);
  const [url, setUrl] = useState(imgUrl);
  useEffect(() => {
    if (url != null) {
      setImgUploaded(true);
    } else {
      setImgUploaded(false);
    }
  }, [url]);

  const openImageUpload = useCallback(() => {
    setPickerModalVisible(false);
    CommonFunctions.openMedia(undefined, 'camera')
      .then(file => {
        if (onChange) {
          onChange(file);
          setUrl(file.uri);
        }
      })
      .catch(error => {
        console.log('came here');
        ToastAlert.show(error.err || 'Something went wrong');
      });
  }, []);
  const onPick = () => {
    setPickerModalVisible(false);
    // @ts-ignore
    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.errorCode) {
        console.log(response.errorMessage, 'Image Picker Error');
        ToastAlert.show('Something went wrong');
      } else {
        if (response.assets && response.assets.length > 0) {
          const fileAsset = response.assets[0];
          const file = {
            uri:
              Platform.OS == 'android'
                ? fileAsset.uri || ''
                : (fileAsset.uri || '').replace('file://', ''),
            type: fileAsset.type || '',
            name: fileAsset.fileName || 'image.jpg',
            size: fileAsset.fileSize || 0,
          };
          setPickerModalVisible(false);
          if (onChange) {
            onChange(file);
            setUrl(file.uri);
          }
        }
      }
    });
  };

  const selectPickerModal = () => {
    return (
      <View style={styles.ModalContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={pickerModalVisible}
          onRequestClose={() => {
            setPickerModalVisible(!pickerModalVisible);
          }}>
          <View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
            <View style={[styles.modalView, {height: '40%'}]}>
              <View style={styles.modalCloseContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setPickerModalVisible(!pickerModalVisible);
                  }}>
                  <ImageConfig.CloseIconModal height={'25'} width={'25'} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.modalTextTitle, {fontSize: 24}]}>
                Edit Profile
              </Text>
              <View style={styles.modalSelectorContainer}>
                <TouchableOpacity
                  onPress={() => {
                    openImageUpload();
                  }}
                  style={styles.centeredStyle}>
                  <View style={styles.modalIconContainer}>
                    <ImageConfig.cameraIcon height={'35'} width={'35'} />
                  </View>
                  <Text style={styles.uploadText}>CAMERA</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onPick();
                  }}
                  style={styles.centeredStyle}>
                  <View style={styles.modalIconContainer}>
                    <ImageConfig.imageUploadIcon height={'35'} width={'35'} />
                  </View>
                  <Text style={styles.uploadText}>IMAGE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
          }}>
          <LabelComponent
            style={{
              paddingBottom: 5,
            }}
            title={labelText || ''}
          />
          {hasError && (
            <View
              style={{
                marginVertical: 3,
                position: 'absolute',
                right: 0,
              }}>
              <Text
                style={{
                  fontFamily: FontConfig.primary.light,
                  color: Colors.warn,
                  fontSize: 13,
                  textTransform: 'capitalize',
                }}>
                Required
              </Text>
            </View>
          )}
        </View>
        <View style={styles.avatarStyle}>
          <View>
            {imgUploaded ? (
              <Image
                source={{uri: url}}
                resizeMethod="resize"
                resizeMode="cover"
                style={styles.profileImgStyle}
              />
            ) : (
              <ImageConfig.IconAccountCircle
                width={100}
                height={100}
                color={Colors.primary}
              />
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              setPickerModalVisible(!pickerModalVisible);
            }}
            style={styles.cameraIconStyle}>
            <ImageConfig.cameraIconLight width={19} height={19} />
          </TouchableOpacity>
        </View>
      </View>
      {selectPickerModal()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarStyle: {
    height: 120,
    width: 120,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cameraIconStyle: {
    backgroundColor: Colors.primary,
    marginLeft: -25,
    marginBottom: 10,
    borderRadius: 500,
    padding: 7,
  },
  profileImgStyle: {
    height: 120,
    width: 120,
    borderRadius: 500,
  },

  //////////////
  ModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCloseContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    width: '100%',
  },
  modalSelectorContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 30,
    width: '100%',
    justifyContent: 'space-evenly',
  },
  modalTextTitle: {
    fontFamily: FontConfig.primary.bold,
    color: Colors.textOnInput,
    marginBottom: 5,
  },
  modalIconContainer: {
    backgroundColor: Colors.backgroundShiftColor,
    padding: 20,
    borderRadius: 500,
  },
  uploadText: {
    fontSize: 14,
    fontFamily: FontConfig.primary.bold,
    color: Colors.textDark,
    marginTop: 10,
  },
  centeredStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileAvatarComponent;
