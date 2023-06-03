export interface userDetailsSchemaType {
  firstName: String;
  lastName: String;
  dateOfBirth: String;
  married: boolean | null;
  photo?: String;
}
const userDetailsInitialValues: userDetailsSchemaType = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  married: null,
  photo: '',
};

export {userDetailsInitialValues};
