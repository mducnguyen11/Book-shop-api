import br from 'bcryptjs';

const usersData = [
  {
    name: 'Nguyen M Duc',
    username: 'mducnguyen11',
    password: br.hashSync('123'),
    address: 'Ha noi',
    phoneNumber: '038765545',
    dateOfBirth: new Date('2003-02-19'),
  },
];

export default usersData;
