import React, {useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  Keyboard,
} from 'react-native';
import FontConfig from '../../constants/FontConfig';
import Colors from '../../constants/Colors';
import LabelComponent from './LabelComponent';
import {FieldProps} from 'formik';

export interface FormikInputComponentProps {
  showLabel?: boolean;
  labelText?: string;
  inputStyles?: StyleProp<TextStyle>;
  errorText?: StyleProp<TextStyle>;
  errorContainerStyle?: StyleProp<ViewStyle>;
  baseStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  isPassword?: boolean;
  formikField: FieldProps;
  onUpdate?: (value: any) => void;
  inputProperties?: TextInputProps;
  trimSpaces?: boolean;
  trimSpecialCharacters?: boolean;
  trimNumbers?: boolean;
  trimLeft?: boolean;
  isRequired?: boolean;
  trimCharacters?: boolean;
  secureTextEntry?: any;
  errorMessage?: any;
  editable?: boolean;
  // isPhone?: boolean;
  inputRef?: any;
}

const FormikInputComponent = (props: FormikInputComponentProps) => {
  const {
    labelText,
    formikField,
    inputProperties,
    onUpdate,
    trimSpaces,
    trimSpecialCharacters,
    trimNumbers,
    trimCharacters,
    errorMessage,
    errorText,
    inputRef,
  } = props;

  const {field, form} = formikField;
  const [hasFocus, setHasFocus] = useState(false);

  // console.log({field, form, meta});
  const showLabel =
    props.showLabel !== undefined
      ? props.showLabel
      : !!(labelText && labelText.length > 0);
  const inputStyles = props.inputStyles || {};
  const baseStyle = props.baseStyle || {};
  const isRequired = props.isRequired !== undefined ? props.isRequired : true;
  const editable = props.editable !== undefined ? props.editable : true;
  const inputWrapperStyle = props.inputWrapperStyle || {};
  const errorContainerStyle = props.errorContainerStyle || {};

  const hasError =
    form.touched[field.name] && form.errors && form.errors[field.name];
  const style: any = props.style || {
    borderColor: styles.inputWrapper.borderColor,
  };
  const trimLeft = props.trimLeft === undefined ? false : props.trimLeft;

  // const trimHandler =(text:string)=>{
  //   if (trimSpaces) {
  //
  //   }
  // }

  const textChangeHandler = (text: string) => {
    // console.log(form.dirty);
    if (trimSpaces) {
      text = text.replace(/ /g, '');
    }
    if (trimSpecialCharacters) {
      text = text.replace(/[^a-zA-Z0-9 ]/g, '');
    }
    if (trimNumbers) {
      text = text.replace(/[^a-zA-Z ]/g, '');
    }
    if (trimCharacters) {
      text = text.replace(/[^0-9 ]/g, '');
    }
    if (trimLeft) {
      text = text.trimLeft();
    }

    // if (isPhone) {
    //   if (text.length > 3) {
    //     text = '(' + text.substr(0, 3) + ')' + text.substr(3);
    //   }
    // }
    form.setFieldTouched(field.name);
    form.setFieldValue(field.name, text);
    // form.handleChange(field.name);
    if (onUpdate) {
      onUpdate(text);
    }
  };
  const onInputBlur = () => {
    setHasFocus(false);
    Keyboard.dismiss;
    form.handleBlur(field.name);
    form.setFieldTouched(field.name);
  };
  const onFocus = () => {
    // form.setFieldTouched(field.name);
    setHasFocus(true);
  };

  return (
    <View style={[styles.inputBaseWrapper, baseStyle, inputWrapperStyle]}>
      {showLabel && (
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <LabelComponent title={labelText || ''} style={{marginBottom: 10}} />
          {isRequired && (
            <Text style={{color: Colors.primary, top: -4}}>*</Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.inputWrapper,
          style,
          {
            borderColor: hasFocus
              ? Colors.textDark
              : hasError
              ? Colors.warn
              : style && style.borderColor
              ? style.borderColor
              : styles.inputWrapper.borderColor,
          },
        ]}>
        {/*{props.sideIcon && <Ionicons size={20} color={Colors.textLight} name={props.sideIcon}/>}*/}
        <TextInput
          placeholderTextColor={'#8B8E9080'}
          // selectionColor={Colors.textLight}
          style={[
            styles.input,
            {color: !editable ? Colors.textLight : Colors.textDark},
            inputStyles,
          ]}
          value={field.value}
          autoCapitalize={'none'}
          autoCorrect={false}
          onFocus={onFocus}
          nativeID={field.name}
          testID={field.name}
          onChangeText={textChangeHandler}
          onBlur={onInputBlur}
          editable={editable}
          {...inputProperties}
          ref={inputRef}
        />

        {(errorMessage || hasError) && (
          <View
            style={[
              styles.errorContainer,
              styles.baseErrorContainerStyle,
              errorContainerStyle,
            ]}>
            <Text style={[styles.errorText, errorText]}>
              {errorMessage || form.errors[field.name]}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputBaseWrapper: {
    marginVertical: 8,
    // marginHorizontal: 20,
    // borderBottomWidth: 1,
    // // borderBottomColor: Colors.textDark
  },
  label: {
    marginBottom: 5,
  },
  labelText: {
    fontFamily: FontConfig.primary.regular,
    fontSize: 14,
    // opacity: 0.8,
    color: Colors.textLight,
  },
  baseErrorContainerStyle: {
    top: -12,
  },

  inputWrapper: {
    // marginVertical: 5,
    borderRadius: 5,
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: 1.5,
    borderColor: Colors.borderColor,
    // backgroundColor: Colors.backgroundColor,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  input: {
    height: 40,
    // borderRadius: 10,
    width: '100%',
    paddingHorizontal: 10,
    color: Colors.textDark,
    // backgroundColor: Colors.backgroundColor,
    fontFamily: FontConfig.primary.regular,
    fontSize: 15,
  },
  errorContainer: {
    marginTop: -5,
    position: 'absolute',
    right: 0,
  },
  errorText: {
    fontFamily: FontConfig.primary.regular,
    color: Colors.warn,
    fontSize: 13,
    textTransform: 'capitalize',
  },
});

export default FormikInputComponent;
