import {
  Editable,
  ButtonGroup,
  IconButton,
  EditablePreview,
  EditableInput,
  Input,
  Flex,
  useEditableControls
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { MdDeleteOutline } from 'react-icons/md';

export default function CustomEditable(props) {
  const { value, setValue, deleteValue, ...rest } = props;

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
        <IconButton
          size="sm"
          icon={<MdDeleteOutline />}
          onClick={deleteValue}
        />
      </Flex>
    );
  }

  return (
    <Editable
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      value={value}
      onSubmit={setValue}
      isPreviewFocusable={false}
      {...rest}
    >
      <EditablePreview />
      <Input as={EditableInput} />
      <EditableControls />
    </Editable>
  );
}
