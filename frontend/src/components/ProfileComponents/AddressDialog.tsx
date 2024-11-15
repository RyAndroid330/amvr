import { FC, useState } from 'react';
import { Dialog, Button, Flex, Text } from '@radix-ui/themes';

interface Address {
  uid?: string;
  country: string;
  city: string;
  street: string;
  street_number: number;
  postal_code: number;
}

interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  initialAddress?: Address;
}

const AddressDialog: FC<AddressDialogProps> = ({
  open,
  onClose,
  onSave,
  initialAddress,
}) => {
  const [address, setAddress] = useState<Address>(
    initialAddress || {
      country: '',
      city: '',
      street: '',
      street_number: 0,
      postal_code: 0,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]:
        name === 'street_number' || name === 'postal_code'
          ? Number(value)
          : value,
    }));
  };

  const handleSave = () => {
    onSave(address);
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content maxWidth='450px'>
        <Dialog.Title>Update Address</Dialog.Title>
        <Dialog.Description size='4' m='4'>
          <div>
            <Text>Street: </Text>
            <input
              name='street'
              value={address.street}
              onChange={handleChange}
            />
            <Text>Number: </Text>
            <input
              name='street_number'
              type='integer'
              value={address.street_number}
              onChange={handleChange}
              style={{ maxWidth: '50px' }}
            />
          </div>
          <div>
            <Text>City: </Text>
            <input name='city' value={address.city} onChange={handleChange} />
          </div>
          <div>
            <Text>Postal Code: </Text>
            <input
              name='postal_code'
              type='integer'
              value={address.postal_code}
              onChange={handleChange}
              style={{ maxWidth: '50px' }}
              maxLength={5}
            />
            <Text>Country: </Text>
            <input
              name='country'
              value={address.country}
              onChange={handleChange}
              style={{ maxWidth: '100px' }}
            />
          </div>
        </Dialog.Description>
        <Flex gap='3' mt='4' justify='end'>
          <Dialog.Close>
            <Button variant='soft' color='gray' onClick={onClose}>
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button type='button' onClick={handleSave}>
              Save
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddressDialog;
