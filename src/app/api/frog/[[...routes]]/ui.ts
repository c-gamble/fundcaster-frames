import { createSystem, colors } from "frog/ui";

// TODO: include parameters for adjusting the theme
export const getUI = () => {
  const {
    Box,
    Columns,
    Column,
    Heading,
    HStack,
    Rows,
    Row,
    Spacer,
    Text,
    VStack,
    vars,
  } = createSystem({
    colors: colors.dark
  });

  return {
    Box,
    Columns,
    Column,
    Heading,
    HStack,
    Rows,
    Row,
    Spacer,
    Text,
    VStack,
    vars,
  };
};
