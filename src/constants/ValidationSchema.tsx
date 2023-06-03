import * as yup from 'yup';

const userDetails = yup.object({
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  dateOfBirth: yup
    .string()
    .min(10, 'Required')
    .max(10, 'Required')
    .required('Required'),
  married: yup.boolean().required('Required'),
  photo: yup.string().required('Required'),
});

export {userDetails};
