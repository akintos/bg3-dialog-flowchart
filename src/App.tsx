import { Button, ChakraProvider, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";
import { DialogDataProvider, useDialogData } from "./data/useDialogData";
import Workspace from "./flowchart/Workspace";
import theme from "./theme";

function PathSelector() {
  const { path, setPath } = useDialogData();
  const [value, setValue] = useState(path);

  return (
    <Flex>
      <Input
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setPath(value);
          }
        }}
        placeholder="파일 "
      />
      <Button onClick={() => setPath(value)}>Load</Button>
    </Flex>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <DialogDataProvider>
        <Flex direction={"column"} height={"100vh"} width={"100vw"}>
          <PathSelector />
          <Workspace />
        </Flex>
      </DialogDataProvider>
    </ChakraProvider>
  );
}

export default App;
