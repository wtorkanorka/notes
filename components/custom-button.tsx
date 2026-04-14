import React, { ReactNode } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  btnStyle?: StyleProp<ViewStyle>;
  pressFnc?: () => void;
  children?: ReactNode;
}

const CustomButton = ({ btnStyle, pressFnc, children }: Props) => (
  <TouchableOpacity
    style={btnStyle}
    onPress={() => pressFnc && pressFnc()}
    activeOpacity={0.7} // Прозрачность при нажатии
  >
    {children}
  </TouchableOpacity>
);

export default CustomButton;
