 import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './profile.module.css';
import { Box, Card, Flex, Text, Button } from '@radix-ui/themes';
import UserAgreementDialog from '../../../components/ProfileComponents/UserAgreementDialog';
import AddressDialog from '../../../components/ProfileComponents/AddressDialog';

interface User {
  role: string;
  firstName: string;
  first_name: string;
  lastName: string;
  last_name: string;
  emailAddress: string;
  email_address: string;
  password?: string;
  dateOfBirth: string;
  date_of_birth: string;
  address?: string;
  id: string;
  gdpr: boolean;
}

interface Address {
  country: string;
  city: string;
  street: string;
  street_number: number;
  postal_code: number;
}

const EditProfile: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false); // State for AddressDialog
  const [address, setAddress] = useState<Address | null>(null);

  const { register, handleSubmit, setValue } = useForm<User>();

  const onSubmit: SubmitHandler<User> = async (data) => {
    if (!user?.gdpr) {
      console.error('GDPR agreement is required to save data.');
      setShowDialog(true);
      return;
    }

    try {
      if (!id) {
        console.error('User ID is missing');
        return;
      }
      data.id = id;
      data.gdpr = true;

      const dateOfBirth = new Date(data.dateOfBirth);
      dateOfBirth.setDate(dateOfBirth.getDate() + 1);
      data.dateOfBirth = dateOfBirth.toISOString().split('T')[0];

      const response = await fetch('/api/profile/edit-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('User data updated:', data);
      navigate(`/users/${id}/profile`);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAgree = () => {
    if (user) {
      setUser((prev) => (prev ? { ...prev, gdpr: true } : null));
      setShowDialog(false);
    }
  };

  const handleAddressSave = (updatedAddress: Address) => {
    setAddress(updatedAddress);
    setShowAddressDialog(false);
    console.log('Address updated:', updatedAddress);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/profile?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUser(data[0]);

        if (data[0]) {
          setValue('id', data[0].id);
          setValue('firstName', data[0].first_name);
          setValue('lastName', data[0].last_name);
          setValue('role', data[0].role);
          setValue('emailAddress', data[0].email_address);
          setValue('password', data[0].password);
          setValue(
            'dateOfBirth',
            new Date(data[0].date_of_birth).toISOString().split('T')[0]
          );
          setValue('address', data[0].address);
          setValue('gdpr', data[0].gdpr);
        }

        if (data[0] && !data[0].gdpr) {
          setShowDialog(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchData();
  }, [id, setValue]);

  return (
    <Box maxWidth='500px' className={styles.container}>
      <Card variant='classic'>
        <h1>Profile</h1>
        {user ? (
          <form onSubmit={handleSubmit(onSubmit)} method='PUT'>
            <Flex direction='column' gap='3' key={user.id}>
              <div className={styles.form}>
                <Text>First Name: </Text>
                <input
                  defaultValue={user.firstName}
                  {...register('firstName')}
                />
              </div>
              <div className={styles.form}>
                <Text>Last Name: </Text>
                <input
                  defaultValue={user.last_name}
                  {...register('lastName')}
                />
              </div>
              <div className={styles.form}>
                <Text>Role: </Text>
                <input defaultValue={user.role} {...register('role')} />
              </div>
              <div className={styles.form}>
                <Text>Email Address: </Text>
                <input
                  defaultValue={user.email_address}
                  {...register('emailAddress')}
                />
              </div>
              <div className={styles.form}>
                <Text>Date of Birth: </Text>
                <input
                  defaultValue={
                    new Date(user.date_of_birth).toISOString().split('T')[0]
                  }
                  {...register('dateOfBirth')}
                />
              </div>
              <div className={styles.form}>
                <Text>Address: </Text>
                <Text>{user.address || 'No address available'}</Text>
              </div>
              <Button
                variant='outline'
                type='button'
                onClick={() => setShowAddressDialog(true)}
              >
                Update Address
              </Button>
              <div className={styles.form}>
                <Text>Password: </Text>
                <input
                  type='password'
                  placeholder='Enter new password if updating'
                  {...register('password')}
                />
              </div>
              {user.gdpr && <Text>User Agreement Signed ✅</Text>}
              <Button>Save Changes</Button>
            </Flex>
          </form>
        ) : (
          <p>No profile data found</p>
        )}
      </Card>
      <UserAgreementDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onAgree={handleAgree}
      />
      <AddressDialog
        open={showAddressDialog}
        onClose={() => setShowAddressDialog(false)}
        onSave={handleAddressSave}
        initialAddress={
          address || {
            country: '',
            city: '',
            street: '',
            street_number: 0,
            postal_code: 0,
          }
        }
      />
    </Box>
  );
};

export default EditProfile;

