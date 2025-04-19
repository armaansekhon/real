import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet } from "react-native";

const DropdownInput = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  placeholder,
  zIndex,
}) => {
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      placeholder={placeholder}
      style={[styles.dropdown, { zIndex }]}
      dropDownContainerStyle={[styles.dropdownContainer, { zIndex: zIndex - 1 }]}
      placeholderStyle={styles.dropdownPlaceholder}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 42,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 14,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 13,
    fontFamily: "PlusR",
    justifyContent: "center",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 10,
  },
  dropdownPlaceholder: {
    color: "#999",
    fontFamily: "PlusR",
  },
});

export default DropdownInput;
