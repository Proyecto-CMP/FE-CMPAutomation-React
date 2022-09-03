import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Fragment } from "react";
import { useState } from 'react'
import { Checkbox } from '@mui/material';
import Select from 'react-select';
import { useEffect } from 'react';

const FormPeriodo = () => {
  const [ncontrato, setNcontrato] = useState("")
  const [fileName, setFileName] = useState("")

  const test = () => {
    console.log(ncontrato)
    console.log(checkboxOptions)
    console.log(fileName)
  }

  const [checkboxOptions, setcheckboxOptions] = useState([  { name: "Numero de contrato sin faenas", value: false }

])


  const ncontradoDataStatic = [
    { value: '123456789', label: '123456789' },
    { value: '987654321', label: '987654321' }
  ];

  // useState waiting for ncontrato to change
  useEffect(() => {
    if(ncontrato.value === "123456789"){
      console.log("aqui")
      setcheckboxOptions([
        { name: "Guacolda", value: false },
        { name: "CNN", value: false }])
    }
    if(ncontrato.value === "987654321"){
      setcheckboxOptions([
        { name: "MLC", value: false },
        { name: "Romeral", value: false }])
    }
  }, [ncontrato])



  return (
    <>

      <Card className="w-96 bg-gray-200 " >
        <CardHeader
          variant="gradient"
          color='blue'
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Formulario para abrir periodo
          </Typography>
          <Typography variant="h5" color="white">
            Seleccionar faenas donde se abrira el periodo
          </Typography>
          <Typography variant="h6" color="white">
            Se debe subir el archivo excel 97-2003 (.xls)
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Select
            placeholder="Seleccione un numero de contrato"
            value={ncontrato}
            onChange={setNcontrato}
            options={ncontradoDataStatic}
          />
           { ncontrato ? (
                   <Fragment>
                   {
                     checkboxOptions.map((option, index) => {
                       return (
                         <div key={index}>
                           <Checkbox
                             checked={checkboxOptions[index].value}
                             onChange={() => {
                               let newCheckboxOptions = [...checkboxOptions];
                               newCheckboxOptions[index].value = !newCheckboxOptions[index].value;
                               setcheckboxOptions(newCheckboxOptions);
                             }}
                           /> {option.name}
                         </div>
                       )
                     })
                   }
                 </Fragment>
   ) : null}
          
 

          <Input
            type="file"
            accept=".xls"
            onChange={(e) => {
              setFileName(e.target.files[0].name)
            }}
          />
          
        </CardBody>

        <CardFooter className="pt-0">
          <Button variant="gradient" fullWidth onClick={test}>
            Enviar Formulario
          </Button>
        </CardFooter>
      </Card>

    </>
  )
}

export default FormPeriodo
