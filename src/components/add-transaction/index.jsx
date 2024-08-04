import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  FormErrorMessage
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { GlobalContext } from "../../context";

export default function TransactionForm({ onClose, isOpen }) {
  const { formData, setFormData, value, setValue, handleFormSubmit } =
    useContext(GlobalContext);
  const [errors, setErrors] = useState({
    description: false,
    amount: false,
  });

  function handleFormChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Check for errors
    const newErrors = {
      description: !formData.description,
      amount: formData.amount === "" || formData.amount <= 0,
    };

    if (newErrors.description || newErrors.amount) {
      setErrors(newErrors);
      return;
    }

    handleFormSubmit(formData);
    setErrors({ description: false, amount: false });
    // Clear the form fields
    setFormData({
      type: "expense",
      amount: "",
      description: "",
    });
    // Close the modal
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={() => {
      setErrors({ description: false, amount: false });
      onClose();
    }}>
      <form onSubmit={handleSubmit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={errors.description}>
              <FormLabel>Enter Description</FormLabel>
              <Input
                placeholder="Enter Transaction description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleFormChange}
              />
              <FormErrorMessage>This field is required</FormErrorMessage>
            </FormControl>
            <FormControl mt="4" isInvalid={errors.amount}>
              <FormLabel>Enter Amount</FormLabel>
              <Input
                placeholder="Enter Transaction amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleFormChange}
              />
              <FormErrorMessage>
                {errors.amount ? "This field is required and must be greater than 0" : ""}
              </FormErrorMessage>
            </FormControl>
            <RadioGroup mt="5" value={value} onChange={setValue}>
              <Radio
                checked={formData.type === "income"}
                value="income"
                colorScheme="blue"
                name="type"
                onChange={handleFormChange}
              >
                Income
              </Radio>
              <Radio
                checked={formData.type === "expense"}
                value="expense"
                colorScheme="red"
                name="type"
                onChange={handleFormChange}
              >
                Expense
              </Radio>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button mr={"4"} onClick={() => {
              setErrors({ description: false, amount: false });
              onClose();
            }}>
              Cancel
            </Button>
            <Button type="submit">
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
