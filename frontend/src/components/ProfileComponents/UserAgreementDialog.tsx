import { FC } from 'react';
import { Dialog, Button, Flex } from '@radix-ui/themes';

interface UserAgreementDialogProps {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const UserAgreementDialog: FC<UserAgreementDialogProps> = ({
  open,
  onClose,
  onAgree,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content maxWidth='450px'>
        <Dialog.Title>User Agreement</Dialog.Title>
        <Dialog.Description size='2' mb='4'>
          We need to store and process personal information about you, such as
          your first name, last name, email address, date of birth, and address.
          The purpose of this processing is to connect you with other users
          and/or to enable support to contact you. We obtained your information
          solely from data inputted by you. We always apply current privacy
          legislation to all processing of personal data. The legal basis for
          processing your personal data is the legitimate interest in providing
          and improving our services. Your information will be stored for as
          long as you have an active account with us or as required by
          applicable laws and regulations. The personal information we process
          about you is shared only with other users on the platform. We will not
          share your information with any third parties unless legally required
          to do so. Furthermore, we will never transfer your data to a country
          outside the EU. The data controller is AMVR. You have the right to
          contact us if you would like to access information we have about you,
          request corrections, request data transfer, restrict processing,
          object to processing, or request the deletion of your data. The
          easiest way to do this is by contacting us at support@yourcompany.com.
          You can reach our Data Protection Officer at dpo@yourcompany.com. If
          you have any complaints about how we process your personal data, you
          have the right to lodge a complaint with the supervisory authority,
          the Swedish Authority for Privacy Protection (IMY). You have the right
          to contact us if you would like to access information we have about
          you, request corrections, request data transfer, restrict processing,
          object to processing, or request the deletion of your data. The
          easiest way to do this is by contacting us at support@yourcompany.com.
        </Dialog.Description>
        <Flex gap='3' mt='4' justify='end'>
          <Dialog.Close>
            <Button variant='soft' color='gray' onClick={onClose}>
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close onClick={onAgree}>
            <Button type='button'>Agree</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UserAgreementDialog;
