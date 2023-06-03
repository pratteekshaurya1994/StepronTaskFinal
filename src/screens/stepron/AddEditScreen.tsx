import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  BaseViewComponent,
  CustomButton,
  FormikRadioGroupComponent,
  KeyboardAvoidCommonView,
} from '../../components/core';
import {FontConfig, Colors} from '../../constants';
import {Formik, Field, FieldProps} from 'formik';
import FormikInputComponent from '../../components/core/FormikInputComponent';
import FormikDatepickerComponent from '../../components/core/FormikDatepickerComponent';
import Moment from 'moment';
import {CommonStyles, ToastAlert, localStorage} from '../../helpers';
import {userDetails} from '../../constants/ValidationSchema';
import {
  userDetailsInitialValues,
  userDetailsSchemaType,
} from '../../constants/CommonTypes';
import ProfileAvatarComponent from '../../components/ProfileAvatarComponent';

const AddEditScreen = (props: any) => {
  const navigation = props.navigation;
  const [newData, setNewData] = useState<any>([]);

  const {mode} = props.route.params;
  const {dataItem} = props.route.params;

  let currentId = 1; // Initial ID value

  const generateUniqueID = () => {
    const newId = currentId;
    currentId += 1;
    return newId;
  };

  const isIdUnique = (id: any) => {
    return !newData.some((item: any) => item.Id === id);
  };
  const addNewUserHandler = useCallback(
    (values: userDetailsSchemaType) => {
      let newId = generateUniqueID();
      while (!isIdUnique(newId)) {
        newId = generateUniqueID();
      }
      const newObject = {
        Id: newId,
        dateOfBirth: values.dateOfBirth,
        firstName: values.firstName,
        lastName: values.lastName,
        married: values.married,
        photo: values.photo,
      };
      if (mode === 'add') {
        const updatedData = [...newData, newObject];
        setNewData(updatedData);
        localStorage.setItem('value1', updatedData);
        ToastAlert.show('New Item added in list');
        navigation.goBack();
      } else {
        console.log('dataItem.Id: ', dataItem.Id);

        const updatedData = [...newData];
        const objectToUpdate = updatedData.find(
          item => item.Id === dataItem.Id,
        );
        if (objectToUpdate) {
          objectToUpdate.dateOfBirth = values.dateOfBirth;
          objectToUpdate.firstName = values.firstName;
          objectToUpdate.lastName = values.lastName;
          objectToUpdate.married = values.married;
          objectToUpdate.photo = values.photo;
        }

        setNewData(updatedData);
        localStorage.setItem('value1', JSON.stringify(updatedData));
        ToastAlert.show('List updated');
        navigation.goBack();
      }
    },
    [newData, dataItem],
  );

  const getItemLocalStorage = useCallback(async () => {
    const getData: any = await localStorage.getItem('value1');
    const storedData = JSON.parse(getData);
    if (storedData != null || storedData != undefined) {
      setNewData(storedData);
    } else {
      console.log('no data');
      setNewData([]);
    }
  }, []);

  useEffect(() => {
    getItemLocalStorage();
  }, [getItemLocalStorage]);

  const [isImageError, setIsImageError] = useState<boolean>(false);

  return (
    <>
      <KeyboardAvoidCommonView>
        <BaseViewComponent>
          <View style={styles.wrapper}>
            <View style={{flexGrow: 1}}>
              <Formik
                onSubmit={addNewUserHandler}
                validationSchema={userDetails}
                validateOnBlur={true}
                initialValues={{
                  ...userDetailsInitialValues,
                  ...({
                    firstName: mode === 'add' ? '' : dataItem.firstName,
                    lastName: mode === 'add' ? '' : dataItem.lastName,
                    dateOfBirth: mode === 'add' ? '' : dataItem.dateOfBirth,
                    married: mode === 'add' ? null : dataItem.married,
                    photo: mode === 'add' ? '' : dataItem.photo,
                  } as userDetailsSchemaType),
                }}>
                {({handleSubmit, setFieldValue, setFieldTouched, values}) => (
                  <>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}>
                      <Text style={[CommonStyles.pageTitle, {fontSize: 28}]}>
                        {'Add New User'}
                      </Text>
                      <View style={{marginVertical: 10}}>
                        <Text style={styles.labelText}>
                          Please fill the form with appropriate details of the
                          individual .
                        </Text>
                      </View>
                    </View>
                    <Field name={'firstName'}>
                      {(field: FieldProps) => (
                        <FormikInputComponent
                          labelText="First Name"
                          trimLeft={true}
                          trimSpecialCharacters={true}
                          inputProperties={{
                            placeholder: 'John',
                            maxLength: 50,
                            keyboardType: 'name-phone-pad',
                          }}
                          formikField={field}
                        />
                      )}
                    </Field>
                    <Field name={'lastName'}>
                      {(field: FieldProps) => (
                        <FormikInputComponent
                          labelText="Last Name"
                          trimLeft={true}
                          trimSpecialCharacters={true}
                          inputProperties={{
                            placeholder: 'Doe',
                            maxLength: 50,
                            keyboardType: 'name-phone-pad',
                          }}
                          formikField={field}
                        />
                      )}
                    </Field>
                    <Field name={'dateOfBirth'}>
                      {(field: FieldProps) => (
                        <FormikDatepickerComponent
                          labelText="Date of Birth"
                          // @ts-ignore
                          maxDate={Moment()}
                          formikField={field}
                        />
                      )}
                    </Field>
                    <Field name={'married'}>
                      {(field: FieldProps) => (
                        <FormikRadioGroupComponent
                          formikField={field}
                          labelText={'Married'}
                          radioButtons={[
                            {id: true, title: 'yes'},
                            {id: false, title: 'No'},
                          ]}
                          labelStyle={{
                            fontSize: 12,
                            fontFamily: FontConfig.primary.regular,
                            color: Colors.textDark,
                          }}
                        />
                      )}
                    </Field>
                    <Field name={'photo'}>
                      {(field: FieldProps) => (
                        <ProfileAvatarComponent
                          imgUrl={mode === 'add' ? null : dataItem.photo}
                          onChange={val => {
                            setFieldValue(field.field.name, val.uri);
                            setFieldTouched(field.field.name, true);
                            setIsImageError(false);
                          }}
                          labelText="Photo"
                          hasError={isImageError}
                        />
                      )}
                    </Field>
                    <View style={{flex: 1}}>
                      <CustomButton
                        testID="addUser_btn"
                        style={{
                          flex: 0,
                          borderRadius: 8,
                          height: 50,
                          marginBottom: 0,
                          marginTop: 30,
                        }}
                        class={'primary'}
                        onPress={() => {
                          console.log('values:: ', values);
                          const formValues = {
                            ...values,
                          };
                          if (formValues.photo == '') {
                            setIsImageError(true);
                          } else {
                            setIsImageError(false);
                          }
                          handleSubmit();
                        }}
                        title={'Proceed'}
                        textStyle={{
                          fontSize: 20,
                          fontFamily: FontConfig.primary.bold,
                        }}
                      />
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </BaseViewComponent>
      </KeyboardAvoidCommonView>
    </>
  );
};

const styles = StyleSheet.create({
  labelText: {
    fontSize: 14,
    fontFamily: FontConfig.primary.regular,
    color: Colors.textLight,
  },
  wrapper: {
    justifyContent: 'space-between',
    flexGrow: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  rowHandler: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowFormStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    top: -10,
    marginTop: 10,
  },
});

export default AddEditScreen;
